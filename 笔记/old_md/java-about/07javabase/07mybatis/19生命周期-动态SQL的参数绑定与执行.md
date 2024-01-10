---
title: 19生命周期-动态SQL的参数绑定与执行
---

在上一章的 `Executor` 的 `query` 方法中，我们看到了 SQL 的获取是借助了 `MappedStatement` 去生成 SQL ：

```java
public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds,
                         ResultHandler resultHandler) throws SQLException {
    // 注意看这里
    BoundSql boundSql = ms.getBoundSql(parameter);
    CacheKey key = createCacheKey(ms, parameter, rowBounds, boundSql);
    return query(ms, parameter, rowBounds, resultHandler, key, boundSql);
}
```

## 1. 动态SQL的构造

这个 `getBoundSql` 方法，会传入当前调用它的参数对象，用于动态 SQL 的生成，下面我们先来看看它的方法实现：（关键注释已标注在源码）

```java
public BoundSql getBoundSql(Object parameterObject) {
    // 使用SqlSource，根据传入的参数，构造出BoundSql
    BoundSql boundSql = sqlSource.getBoundSql(parameterObject);
    // 此处是处理<parameterMap>标签，由于MyBatis已将其废弃，我们忽略
    List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
    if (parameterMappings == null || parameterMappings.isEmpty()) {
        boundSql = 
          new BoundSql(configuration, boundSql.getSql(), 
                       parameterMap.getParameterMappings(), parameterObject);
    }
    for (ParameterMapping pm : boundSql.getParameterMappings()) {
        String rmId = pm.getResultMapId();
        if (rmId != null) {
            ResultMap rm = configuration.getResultMap(rmId);
            if (rm != null) {
                hasNestedResultMaps |= rm.hasNestedResultMaps();
            }
        }
    }

    return boundSql;
}

```

从源码中，我们可以得知，`MappedStatement` 获取 `BoundSql` ，实际还是调用内部组合的那个 `SqlSource` 去生成和获取。

它是封装 SQL 的一个 “**定义**” （可以联想到 Bean 与 `BeanDefinition` ）。而 `SqlSource` 接口本身就一个方法，就是传入参数，生成 `BoundSql` 对象。

### 1.1 BoundSql

我们可以先看一下 `BoundSql` 的构造：

```java
public class BoundSql {

    private final String sql;
    private final List<ParameterMapping> parameterMappings;
    private final Object parameterObject;
    private final Map<String, Object> additionalParameters;
    private final MetaObject metaParameters;

    public BoundSql(Configuration configuration, String sql, 
                    List<ParameterMapping> parameterMappings, Object parameterObject) {
        this.sql = sql;
        this.parameterMappings = parameterMappings;
        this.parameterObject = parameterObject;
        this.additionalParameters = new HashMap<>();
        this.metaParameters = configuration.newMetaObject(additionalParameters);
    }
```

注意看这个 `sql` 参数，它是 `String` 类型，说明是可以直接拿来生成 `PreparedStatement` 的。而直接生成 `PreparedStatement` 的 SQL 语句，占位符都是 **`?`** 吧！再回想一下 `SqlSource` 中存储的，都是 xml 或者注解中声明的 SQL 吧，那里面如果有需要传入参数的地方，是通过 **`#{}`** 传入的，所以由此我们可以得知一个非常重要的推断：**`SqlSource` 中传入参数，返回 `BoundSql` 的过程，会将动态 SQL 解析转化为可以执行的带占位符的 SQL 语句**。

另外思考一下，它里面存了 SQL 和参数对象，这意味着什么呢？是不是只要有一个 `BoundSql` 的对象，就可以执行一次 SQL 操作了呢？即便是我们自己用原生的 jdbc 操作，也可以进行操作。

### 1.2 制造BoundSql的逻辑

#### 1.2.1 StaticSqlSource

`StaticSqlSource` 本身就是一个静态的 `SqlSource` ，它本身没有任何动态 SQL 的标签 / `${}` 表达式，所以它转换为 BoundSql 的时候，只需要把那些 `#{}` 替换为 `?` 即可。它的源码实现那是相当简单：

```java
public BoundSql getBoundSql(Object parameterObject) {
    return new BoundSql(configuration, sql, parameterMappings, parameterObject);
}
```

诶？它直接把 SQL 封装进去就完事了？那替换 `#{}` 占位符的逻辑呢？上面 `BoundSql` 的构造方法中也没有替换的逻辑呀，肯定是创建 `StaticSqlSource` 的时候就已经转换完毕了，那到底在哪里呢？

诶，别着急，我们往上翻一下 `StaticSqlSource` 的构造方法调用位置不就知道了嘛：

```java
// SqlSourceBuilder(有伏笔)
public SqlSource parse(String originalSql, Class<?> parameterType, 
                       Map<String, Object> additionalParameters) {
    ParameterMappingTokenHandler handler = 
      new ParameterMappingTokenHandler(configuration, parameterType, additionalParameters);
    GenericTokenParser parser = new GenericTokenParser("#{", "}", handler);
    String sql;
    if (configuration.isShrinkWhitespacesInSql()) {
        sql = parser.parse(removeExtraWhitespaces(originalSql));
    } else {
        sql = parser.parse(originalSql);
    }
    return new StaticSqlSource(configuration, sql, handler.getParameterMappings());
}
```

看，上面它会利用一个 `GenericTokenParser` 配合 `ParameterMappingTokenHandler` 去处理 `#{}` 占位符，所以这里就可以把 `#{}` 转换为 `?` 了。具体的内容小伙伴们暂且可以不着急深入，现在只是知道有这回事就行。

#### 1.2.2 DynamicSqlSource

`DynamicSqlSource` 构造 `BoundSql` 的逻辑是最复杂的，所以这部分小伙伴们在看的时候要静下心来。

```java
private final SqlNode rootSqlNode;

public BoundSql getBoundSql(Object parameterObject) {
    // 使用DynamicContext辅助解析
    DynamicContext context = new DynamicContext(configuration, parameterObject);
    rootSqlNode.apply(context);
    // 使用SqlSourceBuilder解析SqlNode处理后的SQL
    SqlSourceBuilder sqlSourceParser = new SqlSourceBuilder(configuration);
    Class<?> parameterType = parameterObject == null ? Object.class : parameterObject.getClass();
    // SqlSourceBuilder创建完成后，生成的是StaticSqlSource
    SqlSource sqlSource = sqlSourceParser.parse(context.getSql(), parameterType, context.getBindings());
    // 由StaticSqlSource可以导出可以使用的SQL
    BoundSql boundSql = sqlSource.getBoundSql(parameterObject);
    // BoundSql中存入额外的参数
    context.getBindings().forEach(boundSql::setAdditionalParameter);
    return boundSql;
}
```

##### 1.2.2.1 DynamicContext的作用

它可以理解为一个构造 SQL 的容器，从它的成员属性中就可以看到端倪：

```java
private final StringJoiner sqlBuilder = new StringJoiner(" ");

public DynamicContext(Configuration configuration, Object parameterObject) {
    if (parameterObject != null && !(parameterObject instanceof Map)) {
        MetaObject metaObject = configuration.newMetaObject(parameterObject);
        boolean existsTypeHandler = configuration.getTypeHandlerRegistry().hasTypeHandler(parameterObject.getClass());
        bindings = new ContextMap(metaObject, existsTypeHandler);
    } else {
        bindings = new ContextMap(null, false);
    }
    bindings.put(PARAMETER_OBJECT_KEY, parameterObject);
    bindings.put(DATABASE_ID_KEY, configuration.getDatabaseId());
}
```

注意它用的是 `StringJoiner` 而不是 `StringBuilder` ，其实之前的版本中 MyBatis 还真的是用 `StringBuilder` 来拼接 SQL 的，只是新版本的 jdk 提供了更好用的 `StringJoiner` ，MyBatis 就选择了它而已。`StringJoiner` 可以在构造时传入一个分隔符，这样每次拼接字符串时，`StringJoiner` 都会自动拼接一个分隔符，正好 MyBatis 在解析动态 SQL 时，每截取出来一段拼接时，都要先拼接一个空格，所以上面我们可以看到 `StringJoiner` 的构造时，就传入了一个空格作为分隔符。

了解了 `DynamicContext` 本身的构造，关键的问题是 `DynamicSqlSource` 的 `getBoundSql` 方法中的下一句：`rootSqlNode.apply(context);` 这句代码是调用的 `rootSqlNode` ，可关键是，这个 `SqlNode` 又是个啥呢？

##### 1.2.2.2 SqlNode的设计

 MyBatis 解析 mapper.xml 的逻辑中，会根据 SQL 定义中是否包含动态语句 / 标签，而决定如何封装子节点。

````java
protected MixedSqlNode parseDynamicTags(XNode node) {
    List<SqlNode> contents = new ArrayList<>();
    // 提取出statement中所有的子节点(除了子标签之外，SQL明文也算)
    NodeList children = node.getNode().getChildNodes();
    for (int i = 0; i < children.getLength(); i++) {
        XNode child = node.newXNode(children.item(i));
        // 当前子节点是普通文本，或者xml中的CDATA类，则认定为SQL文本
        if (child.getNode().getNodeType() == Node.CDATA_SECTION_NODE ||
            child.getNode().getNodeType() == Node.TEXT_NODE) {
            String data = child.getStringBody("");
            TextSqlNode textSqlNode = new TextSqlNode(data);
            // 普通文本也有可能是动态的
            if (textSqlNode.isDynamic()) {
                contents.add(textSqlNode);
                isDynamic = true;
            } else {
                contents.add(new StaticTextSqlNode(data));
            }
        } else if (child.getNode().getNodeType() == Node.ELEMENT_NODE) { // issue #628
            // 如果是动态SQL标签，则解析标签
            String nodeName = child.getNode().getNodeName();
            NodeHandler handler = nodeHandlerMap.get(nodeName);
            if (handler == null) {
                throw new BuilderException("Unknown element <" + nodeName + "> in SQL statement.");
            }
            handler.handleNode(child, contents);
            // 并标注当前statement是动态SQL
            isDynamic = true;
        }
    }
    return new MixedSqlNode(contents);
}
````

注意一下，它中间会根据一个一个的 SQL 子节点，封装为一个一个的 `SqlNode` （普通文本会封装为 `TextSqlNode` ，而动态 SQL 会让 `NodeHandler` 处理，也就是那些对应着动态 SQL 标签的一个一个的 Handler ，例如 `IfHandler` 、`WhereHandler` 等，这些 Handler 内部的处理也是会封装 SQL 为 `SqlNode` 对象）。这些封装好的 `SqlNode` 对象，最终会被组合进一个 `List<SqlNode>` 的集合 `contents` 中，并在方法的最后封装为一个 `MixedSqlSource` 。所以我们在实际 Debug 的时候，进入到 `DynamicSqlSource` 中，拿到的一定是一个 `MixedSqlSource` 类型的对象。

##### 1.2.2.3 SqlNode解析为SQL

那下面的工作就是 `MixedSqlNode` 解析为 SQL 语句的逻辑了，进入 `apply` 方法，可以发现它就是一个简单的循环：

```java
public boolean apply(DynamicContext context) {
    contents.forEach(node -> node.apply(context));
    return true;
}
```

对于普通的 `StaticTextSqlNode` 而言，它要做的，就是把内部的 SQL 语句原封不动的追加到 SQL 语句的组合容器 `DynamicContext` 中：

```java
public boolean apply(DynamicContext context) {
    context.appendSql(text);
    return true;
}
```

而动态 SQL 标签封装而来的 `WhereSqlNode` 就不一样了：

```java
// TrimSqlNode
public boolean apply(DynamicContext context) {
    FilteredDynamicContext filteredDynamicContext = new FilteredDynamicContext(context);
    boolean result = contents.apply(filteredDynamicContext);
    filteredDynamicContext.applyAll();
    return result;
}
```

注意它进入到了 `TrimSqlNode` 中

`<where>` 标签实质上是一个 `<trim>` 标签），而这里面它会给原本的 `DynamicContext` 包一层装饰者 `FilteredDynamicContext` ，这个家伙是配合 `<trim>` 标签来的，它可以在内部的 SQL 组合完成后，截掉最前面或者最后面的特定字符串（好比 where 子句中的第一个 and ），这个处理的逻辑在 `FilteredDynamicContext` 的 `applyAll` 方法（上面的 `apply` 方法中有调用）：

```java
public void applyAll() {
    sqlBuffer = new StringBuilder(sqlBuffer.toString().trim());
    String trimmedUppercaseSql = sqlBuffer.toString().toUpperCase(Locale.ENGLISH);
    if (trimmedUppercaseSql.length() > 0) {
        // 截掉前后字符串
        applyPrefix(sqlBuffer, trimmedUppercaseSql);
        applySuffix(sqlBuffer, trimmedUppercaseSql);
    }
    delegate.appendSql(sqlBuffer.toString());
}
```

以此法处理完成后，<where> 标签就全部处理完成了。

所有的 SqlNode 处理完成后，DynamicContext 中也就组合了所有的 SQL ，这样动态 SQL 的构建也就完成了

##### 1.2.2.4 if标签的处理

上面只是大面上的处理，至于 `<where>` 标签中会涉及到的 `<if>` 等标签的处理我们还没有看，下面我们再拿一个简单的例子看一下。

```java
<select id="findAllDepartment" parameterType="Department" resultType="Department">
    select * from tbl_department
    <where>
        <if test="id != null">
            and id = #{id}
        </if>
        <if test="name != null">
            and name like concat('%', #{name}, '%')
        </if>
    </where>
</select>
```

而这个 if 标签对应的 SQL 是否拼接，就要来到处理 if 标签的 `SqlNode` 实现类 `IfSqlNode` 中了：

```java
public boolean apply(DynamicContext context) {
    if (evaluator.evaluateBoolean(test, context.getBindings())) {
        contents.apply(context);
        return true;
    }
    return false;
}
```

这个方法的意图很明显，拿出判断的表达式，看看是否成立，如果成立，则将 SQL 字符串片段拼接进去。

先不进入 `evaluateBoolean` 方法，我们先看看此时此刻这个 `IfSqlNode` 中都封装了什么：

if 标签的 `test` 表达式，以及内部的 SQL 片段都在这里面封装好了，那万事俱备，就差判断了，我们继续往下走吧。

```java
public boolean evaluateBoolean(String expression, Object parameterObject) {
    // 此处使用到了OGNL
    Object value = OgnlCache.getValue(expression, parameterObject);
    if (value instanceof Boolean) {
        return (Boolean) value;
    }
    if (value instanceof Number) {
        return new BigDecimal(String.valueOf(value)).compareTo(BigDecimal.ZERO) != 0;
    }
    return value != null;
}
```

注意看方法的实现，它会使用 OGNL 的语法去解析这个 test 判断表达式，得到结果后根据不同类型处理一下，之后就返回了。一般情况下我们写的表达式都是返回 boolean ，所以它直接强转完就返回了。

当然，从源码中我们也可以看得出来，我们可以在判断表达式中写一些支持 `Comparable` 接口的对象比较，MyBatis 也会帮我们处理判断结果。

##### 1.2.2.5 处理#{}占位符

所有的动态 SQL 节点都处理完毕后，`MixSqlNode` 的处理工作也就结束了，所有解析出来的 SQL 片段最终都放在 `DynamicContext` 中了。我们可以通过 Debug 看出：

此时的 SQL 语句还是带 `#{}` 占位符的，那下一步就是该处理这些占位符了吧。接下来的这三行，就是处理它们的。

```java
    SqlSourceBuilder sqlSourceParser = new SqlSourceBuilder(configuration);
    Class<?> parameterType = parameterObject == null ? Object.class : parameterObject.getClass();
    SqlSource sqlSource = sqlSourceParser.parse(context.getSql(), parameterType, context.getBindings());
```

这个 `SqlSourceBuilder` 要做的工作，就是将 `#{}` 转换为 `?` 。。。等一下！这个 `SqlSourceBuilder`

```java
public SqlSource parse(String originalSql, Class<?> parameterType,
                       Map<String, Object> additionalParameters) {
    ParameterMappingTokenHandler handler =
      new ParameterMappingTokenHandler(configuration, parameterType, additionalParameters);
    GenericTokenParser parser = new GenericTokenParser("#{", "}", handler);
    String sql;
    // 3.5.5 新增特性：是否删除SQL中的多余空格
    if (configuration.isShrinkWhitespacesInSql()) {
        sql = parser.parse(removeExtraWhitespaces(originalSql));
    } else {
        sql = parser.parse(originalSql);
    }
    return new StaticSqlSource(configuration, sql, handler.getParameterMappings());
}
```

先简单说下原理，这里面涉及到的两个组件，`GenericTokenParser` 负责找 `#{}` ，`ParameterMappingTokenHandler` 负责替换成 `?` 占位符，并记录占位符对应的参数。Debug 走到这里，会发现进入了 if-else 结构的 else 分支，那我们就往下进行。

> 注意这个 `shrinkWhitespacesInSql` 配置，这是 MyBatis 3.5.5 刚加的，目的是去除 SQL 语句中的多余长空格（就像上面 Debug 中我们看到的那个 SQL 一样，因为有换行，以及我们编写 SQL 时的可读性，所以封装出来的 SQL 里面有好多好多的空格，MyBatis 觉得可以处理一下它们，于是就加了这样的一个特性）。不过这个特性我们一般不会用，一来比较新，二来如果遇到我们编写 SQL 的时候确实就是有长空格，那 MyBatis 也会 “误伤” 它们。所以综合来看这个配置我们忽略就好。

接下来的这个 `parse` 方法就有点不友好了，它很长，而且关键信息提取不是那么容易，所以小册不打算贴这段源码了，而是换用一组图来解释：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220331202928mybatis.png)

这个 `GenericTokenParser` 的内部结构，各位可以理解为上图中下面部分的结构，它内部有一个 `StringBuilder` 用来存储解析后的 SQL 语句，还有一个存储参数列表的容器，记录每个占位符对应的参数应该放什么。

当开始处理 SQL 语句时，它会初始化一个 SQL 字符串的扫描光标，去扫描 SQL 字符串中的 `#{` 结构，只要发现了，它就会记录下它的位置，并将这之前的内容全部放入容器中：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220331203009.png)

之后就是处理 `#{}` 占位符了，既然找到了 `#{` ，那就一定要找到剩下半拉括号，于是它就会从左半拉括号开始往右找，找到之后也记录下来，并把这个占位符中的参数摘出来，放到参数列表的容器中：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220331203037.png)

这个时候就要根据这个参数名去找对应的参数配置了，注意这里只是记录要找的参数名，还没有具体到参数值。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220331203109.png)

找出来之后，放到参数列表的容器中，继续下一轮寻找。

所有占位符都处理完毕后，即说明占位符都已经替换完毕，可以返回。返回的是一个 `StaticSqlSource` ：

##### 1.2.2.6 存入查询参数

```java
public BoundSql getBoundSql(Object parameterObject) {
    // ......
    SqlSource sqlSource = sqlSourceParser.parse(context.getSql(), parameterType, context.getBindings());
    // 由StaticSqlSource可以导出可以使用的SQL
    BoundSql boundSql = sqlSource.getBoundSql(parameterObject);
    // BoundSql中存入额外的参数
    context.getBindings().forEach(boundSql::setAdditionalParameter);
    return boundSql;
}
```

这一步就很简单了，它把我们传入的查询参数，以及 `databaseId` 等额外参数，直接塞到 `BoundSql` 中，完事。

这么一长串逻辑处理完毕后，`SqlSource` 也就构造出 `BoundSql` 了，结束。

#### 1.2.3 ProviderSqlSource

`ProviderSqlSource` 生成 `BoundSql` 的逻辑，因为我们声明注解 statement 的时候，要指明要调用生成 SQL 的方法：

```java
public interface UserAnnotationMapper {
    
    @SelectProvider(type = UserMapperProvider.class, method = "findAll")
    List<User> findAll();
}
```

那自然，生成 `BoundSql` 的方式就是反射调用方法呗，确实，MyBatis 就是帮我们反射指定的方法，并拿到返回的 SQL ，直接完事。里面具体的逻辑也非常简单，

至此，`SqlSource` 生成 `BoundSql` 的逻辑，我们就算全部走完了，但是目前还有一个问题：参数的值啥时候取出来，利用到 `PreparedStatement` 呢？下面我们继续研究这个问题。

## 2. 参数绑定的应用

在 `Executor` 执行数据库查询时，肯定是要先准备出 `PreparedStatement` 的，

```java
private Statement prepareStatement(StatementHandler handler, Log statementLog) throws SQLException {
    Statement stmt;
    Connection connection = getConnection(statementLog);
    stmt = handler.prepare(connection, transaction.getTimeout());
    handler.parameterize(stmt);
    return stmt;
}
```

核心的动作是 `handler.prepare` ，而准备出来后，下面还有一个 `handler.parameterize` 的动作，很明显这个动作是设置参数的，我们进入这个方法。

### 2.1 parameterize

```java
protected final ParameterHandler parameterHandler;

public void parameterize(Statement statement) throws SQLException {
    parameterHandler.setParameters((PreparedStatement) statement);
}
```

这里又是直接调用了 `ParameterHandler` 的方法，这个 `ParameterHandler` 又是个啥呢？

### 2.2 ParameterHandler

顾名思义，它就是参数的处理器罢了。这个接口本身简单的很：

```java
public interface ParameterHandler {
    Object getParameterObject();
    void setParameters(PreparedStatement ps) throws SQLException;
}
```

从接口方法上看，它的实现类一定能通过某个方法，把本次查询的参数传进去，这样才可以 get ，以及给 `PreparedStatement` 设置参数值。

我们的想法是必然的，按照 MyBatis 的编码风格，这个方法被设计为了构造方法：

```java
public class DefaultParameterHandler implements ParameterHandler {

    private final TypeHandlerRegistry typeHandlerRegistry;

    private final MappedStatement mappedStatement;
    private final Object parameterObject;
    private final BoundSql boundSql;
    private final Configuration configuration;

    public DefaultParameterHandler(MappedStatement mappedStatement, 
                                   Object parameterObject, BoundSql boundSql) {
        this.mappedStatement = mappedStatement;
        this.configuration = mappedStatement.getConfiguration();
        this.typeHandlerRegistry = mappedStatement.getConfiguration().getTypeHandlerRegistry();
        this.parameterObject = parameterObject;
        this.boundSql = boundSql;
    }
```

这里面有存储 `parameterObject` 。

### 2.3 setParameters

下面才是重点，`DefaultParameterHandler` 如何将参数设置到 `PreparedStatement` 中呢？那我们就得看 `setParameters` 方法了：（关键注释已标注在源码）

```java
public void setParameters(PreparedStatement ps) {
    ErrorContext.instance().activity("setting parameters").object(mappedStatement.getParameterMap().getId());
    // BoundSql中存放了所有的参数列表和顺序
    List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
    if (parameterMappings != null) {
        for (int i = 0; i < parameterMappings.size(); i++) {
            // 一个一个取出
            ParameterMapping parameterMapping = parameterMappings.get(i);
            if (parameterMapping.getMode() != ParameterMode.OUT) {
                Object value;
                String propertyName = parameterMapping.getProperty();
                if (......) { 
                    // ......
                } else {
                    // 获取参数值的逻辑：利用反射
                    MetaObject metaObject = configuration.newMetaObject(parameterObject);
                    value = metaObject.getValue(propertyName);
                }
                TypeHandler typeHandler = parameterMapping.getTypeHandler();
                JdbcType jdbcType = parameterMapping.getJdbcType();
                if (value == null && jdbcType == null) {
                    jdbcType = configuration.getJdbcTypeForNull();
                }
                try {
                    // 设置参数
                    typeHandler.setParameter(ps, i + 1, value, jdbcType);
                } // catch ......
            }
        }
    }
}
```

纵观整段源码的逻辑，可以提取出来的步骤就三个：

1. 循环获取每一个参数属性
2. 利用反射机制获取参数属性值
3. 借助 `TypeHandler` 设置到 `PreparedStatement` 中

能理解了吧，要给 `PreparedStatement` 设置什么类型的参数，是需要我们自己指定的！但是用了 MyBatis 后不由我们控制了，那 MyBatis 帮我们接了这个活，肯定要有它自己的处理逻辑，而它决定使用哪个方法设置参数的办法，就是选择不同的 `TypeHandler` 。

`TypeHandler` 设置参数的逻辑，并不是直接无脑设置，而是会先判断一下参数有没有实际的值，没有的话就直接设置 null 了：

```java
public void setParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException {
    if (parameter == null) {
        if (jdbcType == null) {
            throw new TypeException("JDBC requires that the JdbcType must be specified for all nullable parameters.");
        }
        try {
            ps.setNull(i, jdbcType.TYPE_CODE);
        } // catch throw ex ......
    } else {
        try {
            setNonNullParameter(ps, i, parameter, jdbcType);
        } // catch throw ex ......
    }
}
```

只有参数有值的时候，才会往下走，执行 `setNonNullParameter` 方法，而这个方法本身是一个模板方法，需要各个子类实现。这个时候就是不同类型的参数，用不同的 `TypeHandler` 了。

比方说设置字符串值的 `StringTypeHandler` ：

```java
public class StringTypeHandler extends BaseTypeHandler<String> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter);
    }
```

再比方说设置 int 值的 `IntegerTypeHandler` ：

```java
public class IntegerTypeHandler extends BaseTypeHandler<Integer> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Integer parameter, JdbcType jdbcType) throws SQLException {
        ps.setInt(i, parameter);
    }
```

经过 `TypeHandler` 的设置后，`PreparedStatement` 中的参数值也就都设置好了，参数绑定过程完毕。