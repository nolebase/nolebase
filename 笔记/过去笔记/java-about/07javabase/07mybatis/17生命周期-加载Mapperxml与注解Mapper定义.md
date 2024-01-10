---
title: 17生命周期-加载Mapper.xml与注解Mapper定义
--- 

先回顾一下解析 `<mapper>` 标签的核心方法吧：

```java
private void mapperElement(XNode parent) throws Exception {
    if (parent != null) {
        for (XNode child : parent.getChildren()) {
            // 包扫描Mapper接口
            if ("package".equals(child.getName())) {
                String mapperPackage = child.getStringAttribute("name");
                configuration.addMappers(mapperPackage);
            } else {
                String resource = child.getStringAttribute("resource");
                String url = child.getStringAttribute("url");
                String mapperClass = child.getStringAttribute("class");
                // 处理resource加载的mapper.xml
                if (resource != null && url == null && mapperClass == null) {
                    ErrorContext.instance().resource(resource);
                    InputStream inputStream = Resources.getResourceAsStream(resource);
                    XMLMapperBuilder mapperParser = new XMLMapperBuilder(inputStream, 
                                         configuration, resource, configuration.getSqlFragments());
                    mapperParser.parse();
                } else if (resource == null && url != null && mapperClass == null) {
                    // 处理url加载的mapper.xml
                    ErrorContext.instance().resource(url);
                    InputStream inputStream = Resources.getUrlAsStream(url);
                    XMLMapperBuilder mapperParser = new XMLMapperBuilder(inputStream, 
                                         configuration, url, configuration.getSqlFragments());
                    mapperParser.parse();
                } else if (resource == null && url == null && mapperClass != null) {
                    // 注册单个Mapper接口
                    Class<?> mapperInterface = Resources.classForName(mapperClass);
                    configuration.addMapper(mapperInterface);
                } // else throw ex ......
            }
        }
    }
}
```

这里面分布的两个核心逻辑，就是 mapper.xml 的文件的加载，以及注解 Mapper 接口的解析。

## 1. mapper.xml解析

mapper.xml 文件的解析，是借助 `XMLMapperBuilder` 处理的，这个家伙也是继承自 `BaseBuilder` 的，各位还都有印象吧，它其中组合了一个 `MapperBuilderAssistant` ，它可以注册 `MappedStatement` ，构建 `ResultMapping` 、缓存等，在整个 Mapper 解析中有着不可或缺的地位。

我们先回顾一下解析 mapper.xml 文件的核心逻辑吧：

```java
private void configurationElement(XNode context) {
    try {
        // 提取mapper.xml对应的命名空间
        String namespace = context.getStringAttribute("namespace");
        if (namespace == null || namespace.isEmpty()) {
            throw new BuilderException("Mapper's namespace cannot be empty");
        }
        builderAssistant.setCurrentNamespace(namespace);
        // 解析cache、cache-ref
        cacheRefElement(context.evalNode("cache-ref"));
        cacheElement(context.evalNode("cache"));
        // 解析提取parameterMap(官方文档称已废弃，不看了)
        parameterMapElement(context.evalNodes("/mapper/parameterMap"));
        // 解析提取resultMap
        resultMapElements(context.evalNodes("/mapper/resultMap"));
        // 解析封装SQL片段
        sqlElement(context.evalNodes("/mapper/sql"));
        // 构造Statement
        buildStatementFromContext(context.evalNodes("select|insert|update|delete"));
    } // catch ......
}
```

自上而下的几个核心步骤，会把 namespace 取出，二级缓存的配置处理好，结果集映射的定义也解析出来，以及 statement 和 SQL 片段的提取和封装

### 1.1 二级缓存的解析与处理

二级缓存的解析主要是 `<cache>` 标签，这里面能定义的属性挺多的，底层会根据这些配置，借助 `MapperBuilderAssistant` 构建出 `Cache` 缓存对象的实现，而 `MapperBuilderAssistant` 又是利用 `CacheBuilder` 构造的 `Cache` 对象，这里面有建造者和装饰者的体现，我们到后面设计模式的部分还会讲到。

```java
private void cacheElement(XNode context) {
    if (context != null) {
        // 默认的类型是PERPETUAL，也即PerpetualCache
        String type = context.getStringAttribute("type", "PERPETUAL");
        Class<? extends Cache> typeClass = typeAliasRegistry.resolveAlias(type);
        // 默认的过期策略 LRU
        String eviction = context.getStringAttribute("eviction", "LRU");
        Class<? extends Cache> evictionClass = typeAliasRegistry.resolveAlias(eviction);
        // 获取其他属性
        Long flushInterval = context.getLongAttribute("flushInterval");
        Integer size = context.getIntAttribute("size");
        boolean readWrite = !context.getBooleanAttribute("readOnly", false);
        boolean blocking = context.getBooleanAttribute("blocking", false);
        Properties props = context.getChildrenAsProperties();
        // 2.2.3 创建Cache对象
        builderAssistant.
          useNewCache(typeClass, evictionClass, flushInterval, size, readWrite, blocking, props);
    }
}

public Cache useNewCache(Class<? extends Cache> typeClass, 
        Class<? extends Cache> evictionClass,
        Long flushInterval, Integer size, boolean readWrite,
        boolean blocking, Properties props) {
    // 建造器！
    Cache cache = new CacheBuilder(currentNamespace)
                          .implementation(valueOrDefault(typeClass, PerpetualCache.class))
                          .addDecorator(valueOrDefault(evictionClass, LruCache.class))
                          .clearInterval(flushInterval)
                          .size(size)
                          .readWrite(readWrite)
                          .blocking(blocking)
                          .properties(props)
                          .build();
    configuration.addCache(cache);
    currentCache = cache;
    return cache;
}
```

### 1.2 解析结果集映射

### 1.2 解析结果集映射

解析 `<resultMap>` 结果集映射，这个过程比较复杂，大概可以分为三个步骤吧：

- 解析结果集的目标类型
- 解析结果集的映射配置【复杂】
- 封装构建 ResultMap 对象

其中第二个步骤是最复杂的，根据不同的映射规则和标签，有不同的处理方式。

#### 1.2.1 ResultMapping的结构

`resultMap` 是一个完整的结果集映射配置，`resultMapping` 是一个结果集映射配置中的某一个项（组成部分），它们是组合关系。说

```java
public class ResultMapping {

    private Configuration configuration;
    // 实体类的属性名
    private String property;
    // 结果集的列名
    private String column;
    // 映射属性的类型(可能是关联属性)
    private Class<?> javaType;
    private JdbcType jdbcType;
    private TypeHandler<?> typeHandler;
    // 直接引用另一个resultMap的全限定名
    private String nestedResultMapId;
    // 关联查询的statement全限定名(用于延迟加载)
    private String nestedQueryId;
    private Set<String> notNullColumns;
    // 引用其它resultMap时列名的前缀
    private String columnPrefix;
    private List<ResultFlag> flags;
    private List<ResultMapping> composites;
    private String resultSet;
    private String foreignColumn;
    private boolean lazy;
```

`ResultMapping` 已经把一条映射结果集的某一个属性的映射定义的明明白白了。一组 `ResultMapping` 可以构成一个 `ResultMap` ，而一个 `ResultMap` 就对应 mapper.xml 中的一个 `<resultMap>` 标签。

#### 1.2.2 解析结果集映射的普通标签

普通映射标签有 `<id>` 、`<result>` 、`<association>` 、`<collection>` 四个标签，它的解析核心方法在 `org.apache.ibatis.builder.xml.XMLMapperBuilder#buildResultMappingFromContext` 中，虽然这个方法本身写的不是很美丽：

```java
private ResultMapping buildResultMappingFromContext(XNode context, Class<?> resultType, 
                                                    List<ResultFlag> flags) {
    String property;
    if (flags.contains(ResultFlag.CONSTRUCTOR)) {
        property = context.getStringAttribute("name");
    } else {
        property = context.getStringAttribute("property");
    }
    String column = context.getStringAttribute("column");
    String javaType = context.getStringAttribute("javaType");
    String jdbcType = context.getStringAttribute("jdbcType");
    String nestedSelect = context.getStringAttribute("select");
    // 此处有association和collection提取javaType/ofTye的逻辑
    String nestedResultMap = context.getStringAttribute("resultMap", () ->
            processNestedResultMappings(context, Collections.emptyList(), resultType));
    String notNullColumn = context.getStringAttribute("notNullColumn");
    String columnPrefix = context.getStringAttribute("columnPrefix");
    String typeHandler = context.getStringAttribute("typeHandler");
    String resultSet = context.getStringAttribute("resultSet");
    String foreignColumn = context.getStringAttribute("foreignColumn");
    boolean lazy = "lazy".equals(context.getStringAttribute("fetchType", 
                             configuration.isLazyLoadingEnabled() ? "lazy" : "eager"));
    // 结果集类型、typeHandler类型的解析
    Class<?> javaTypeClass = resolveClass(javaType);
    Class<? extends TypeHandler<?>> typeHandlerClass = resolveClass(typeHandler);
    JdbcType jdbcTypeEnum = resolveJdbcType(jdbcType);
    // 构建ResultMapping
    return builderAssistant.buildResultMapping(resultType, property, column, 
                   javaTypeClass, jdbcTypeEnum, nestedSelect, nestedResultMap, 
                   notNullColumn, columnPrefix, typeHandlerClass, 
                   flags, resultSet, foreignColumn, lazy);
}
```

不过有一说一，它确实把这几个标签中涉及到的所有属性都收集全了。

这个方法可以处理 4 个标签，但是这里面几乎没有标签的区分（仅有 `<id>` 判断过一次），那 MyBatis 怎么就能保证一个方法通吃呢？

答案在这个方法的最后一行，因为我们把解析的标签中所有的属性都取出来，一股脑的扔到 `MapperBuilderAssistant` 中了，那自然 `MapperBuilderAssistant` 会帮我们处理吧。我们进到 `buildResultMapping` 方法中一探究竟：

```java
public ResultMapping buildResultMapping(Class<?> resultType, String property,
        String column, Class<?> javaType, JdbcType jdbcType, String nestedSelect,
        String nestedResultMap, String notNullColumn, String columnPrefix,
        Class<? extends TypeHandler<?>> typeHandler, List<ResultFlag> flags,
        String resultSet, String foreignColumn, boolean lazy) {
    // 看看这个映射结果集的类型，有没有TypeHandler能处理它
    Class<?> javaTypeClass = resolveResultJavaType(resultType, property, javaType);
    TypeHandler<?> typeHandlerInstance = resolveTypeHandler(javaTypeClass, typeHandler);
    // 处理复杂结果集的列名(极特殊用法)
    List<ResultMapping> composites;
    if ((nestedSelect == null || nestedSelect.isEmpty()) && 
        (foreignColumn == null || foreignColumn.isEmpty())) {
        composites = Collections.emptyList();
    } else {
        composites = parseCompositeColumnName(column);
    }
    // 交给建造器处理
    return new ResultMapping.Builder(configuration, property, column, javaTypeClass)
            .jdbcType(jdbcType)
            .nestedQueryId(applyCurrentNamespace(nestedSelect, true))
            .nestedResultMapId(applyCurrentNamespace(nestedResultMap, true))
            .resultSet(resultSet)
            .typeHandler(typeHandlerInstance)
            .flags(flags == null ? new ArrayList<>() : flags)
            .composites(composites)
            .notNullColumns(parseMultipleColumnNames(notNullColumn))
            .columnPrefix(columnPrefix)
            .foreignColumn(foreignColumn)
            .lazy(lazy)
            .build();
}
```

要的是最后，这怎么是一个 `ResultMapping` 的建造者一串到底了？说好的四种不同的映射标签处理呢？

好，这个时候我们就要静下心来好好想想，为什么 MyBatis 没有区分开来。想一下，四种标签分别都需要定义哪些属性呢？

- `<id>` ：`column` 、`property`
- `<result>` ：`column` 、`property`
- `<association>` ：`property` 、`javaType`
- `<collection>` ：`column` 、`property` 、`ofType`

可以发现，四种标签所需要定义的属性，只有 `<id>` 和 `<result>` 是一样的，其余的都不一样！所以 MyBatis 只区分了 `<id>` 和 `<result>` ，其余的一概通吃，因为只要添加了 `<id>` 的标识后，四种标签仅靠定义的属性就可以区分开来了！

至于最后的 `ResultMapping` 具体构建，那就是 `ResultMapping.Builder` 建造者的逻辑了，内容相对简单，其实就是一个一个属性的设置罢了。

#### 1.2.3 解析构造器标签

构造器标签 `<constructor>` ，它本身内部还是封装类似于 `<id>` 、`<result>` 等标签，所以它的处理逻辑与上面基本一致，我们简单回顾一下它的解析逻辑：

```java
private void processConstructorElement(XNode resultChild, Class<?> resultType, List<ResultMapping>
                                       resultMappings) {
    List<XNode> argChildren = resultChild.getChildren();
    for (XNode argChild : argChildren) {
        List<ResultFlag> flags = new ArrayList<>();
        // 注意这里添加了一个CONSTRUCTOR的标记
        flags.add(ResultFlag.CONSTRUCTOR);
        if ("idArg".equals(argChild.getName())) {
            flags.add(ResultFlag.ID);
        }
        resultMappings.add(buildResultMappingFromContext(argChild, resultType, flags));
    }
}
```

注释中标注的这个额外的 `CONSTRUCTOR` 标记，还记得它的作用吗？用了 `CONSTRUCTOR` 标记后，MyBatis 底层会去取标签的 `name` 属性而非 `property` 属性：

```java
private ResultMapping 
  buildResultMappingFromContext(XNode context, Class<?> resultType, List<ResultFlag> flags) {
    String property;
    if (flags.contains(ResultFlag.CONSTRUCTOR)) {
        // <constructor>标签用name
        property = context.getStringAttribute("name");
    } else {
        // 普通的标签用property
        property = context.getStringAttribute("property");
    }
```

#### 1.2.4 解析鉴定器标签

先简单回顾下鉴定器的使用，它可以根据查询查询结果集的某一列数据，动态选择封装结果集的 ResultMap 

下面是一个简单的使用，它会根据是否用户是否被逻辑删除，决定要不要延迟加载所在部门的信息。

```java
    <resultMap id="userWithDiscriminator" type="com.linkedbear.mybatis.entity.User">
        <discriminator column="deleted" javaType="boolean">
            <case value="false" resultMap="userlazy"/>
            <case value="true" resultType="com.linkedbear.mybatis.entity.User"/>
        </discriminator>
    </resultMap>
```

```java
private Discriminator processDiscriminatorElement(XNode context, Class<?> resultType, 
                                                  List<ResultMapping> resultMappings) {
    String column = context.getStringAttribute("column");
    String javaType = context.getStringAttribute("javaType");
    String jdbcType = context.getStringAttribute("jdbcType");
    String typeHandler = context.getStringAttribute("typeHandler");
    Class<?> javaTypeClass = resolveClass(javaType);
    Class<? extends TypeHandler<?>> typeHandlerClass = resolveClass(typeHandler);
    JdbcType jdbcTypeEnum = resolveJdbcType(jdbcType);
    // 解析<discriminator>的<case>子标签，并封装到Map中
    Map<String, String> discriminatorMap = new HashMap<>();
    for (XNode caseChild : context.getChildren()) {
        String value = caseChild.getStringAttribute("value");
        String resultMap = caseChild.getStringAttribute("resultMap", 
                processNestedResultMappings(caseChild, resultMappings, resultType));
        discriminatorMap.put(value, resultMap);
    }
    // 注意构造的是Discriminator而不是ResultMapping
    return builderAssistant.buildDiscriminator(resultType, column, 
             javaTypeClass, jdbcTypeEnum, typeHandlerClass, discriminatorMap);
}
```

源码中主要干的事情，是获取到判断依据的列，以及处理的 case 分支。这里我们重点关注一下这个 `discriminatorMap` 封装的结果：

可以发现，它只是把我们定义的两种情况，以及对应的 resultType / resultMap 存起来了而已。注意这个 true 对应的值，它并没有存放实际的 resultType ，而是一大串我们看不懂的东西，其实这一大串东西，对应的就是 `resultType="com.linkedbear.mybatis.entity.User"` ，它这么起名只是为了标明来源。

解析出 `Map` 后，下一步就是构建了，它依然使用 `MapperBuilderAssistant` 帮忙构建，我们进入 `buildDiscriminator` 方法：

```java
public Discriminator buildDiscriminator(Class<?> resultType, String column,
        Class<?> javaType, JdbcType jdbcType, Class<? extends TypeHandler<?>> typeHandler,
        Map<String, String> discriminatorMap) {
    ResultMapping resultMapping = buildResultMapping(
            resultType, null, column, javaType, jdbcType, null, null, null, 
            null, typeHandler, new ArrayList<>(), null, null, false);
    Map<String, String> namespaceDiscriminatorMap = new HashMap<>();
    for (Map.Entry<String, String> e : discriminatorMap.entrySet()) {
        String resultMap = e.getValue();
        // 注意这里如果应用自身的其他resultMap，会在前面追加当前mapper.xml对应的namespace
        resultMap = applyCurrentNamespace(resultMap, true);
        namespaceDiscriminatorMap.put(e.getKey(), resultMap);
    }
    return new Discriminator.Builder(configuration, resultMapping, namespaceDiscriminatorMap).build();
}
```

可以发现这里面其实没有什么神秘的，核心还是借助 `Discriminator` 的建造器帮忙创建出 `Discriminator` 对象来。

### 1.3 解析statement【 ! 】

，这一步所干的事情，就是解析 mapper.xml 中声明的 `<select>` 、`<insert>` 、`<update>` 、`<delete>` 标签，并最终封装为一个一个的 **`MappedStatement`** 。这次我们知道 `MappedStatement` 是什么东西了，是不是也就更容易理解一点了呢？

#### 1.3.1 解析的入口

解析 statement 标签，有两部分内容需要加载：如果在 MyBatis 全局配置文件中声明过 `databaseId` ，则这里解析时会检查 statement 标签中的 `databaseId` 并有针对性的加载；除此之外，所有情况下都会加载那些没有标注 `databaseId` 的标签，并封装为 `MappedStatement` 。

```java
private void buildStatementFromContext(List<XNode> list) {
    if (configuration.getDatabaseId() != null) {
        buildStatementFromContext(list, configuration.getDatabaseId());
    }
    buildStatementFromContext(list, null);
}

private void buildStatementFromContext(List<XNode> list, String requiredDatabaseId) {
    for (XNode context : list) {
        final XMLStatementBuilder statementParser = new XMLStatementBuilder(configuration, 
                builderAssistant, context, requiredDatabaseId);
        try {
            // 【复杂、困难】借助XMLStatementBuilder解析一个一个的statement标签
            statementParser.parseStatementNode();
        } catch (IncompleteElementException e) {
            // statement解析失败，只会记录到Configuration中，但不会抛出异常
            configuration.addIncompleteStatement(statementParser);
        }
    }
}
```

这里面首先遇到的，是之前先劝退各位的 `XMLStatementBuilder` ，它本身也跟 `XMLMapperBuilder` 差不多，都是用于解析 xml 文件、构建所需组件的建造器，只不过 `XMLStatementBuilder` 专注于解析一个 statement 标签（ insert update delete select ）内部的内容了（动态 SQL 也离不开 xml ）。

下面我们进入 `parseStatementNode` 方法。方法比较长，

#### 1.3.2 databaseId的鉴别

```java
public void parseStatementNode() {
    String id = context.getStringAttribute("id");
    String databaseId = context.getStringAttribute("databaseId");

    if (!databaseIdMatchesCurrent(id, databaseId, this.requiredDatabaseId)) {
        return;
    }
    // ......
```

这段逻辑是非常简单的，它会先检查当前的这个 statement 是否与当前数据源对应的数据库一致，如果不匹配，则不会加载。

#### 1.3.3 收集属性

```java
    String nodeName = context.getNode().getNodeName();
    SqlCommandType sqlCommandType = SqlCommandType.valueOf(nodeName.toUpperCase(Locale.ENGLISH));
    boolean isSelect = sqlCommandType == SqlCommandType.SELECT;
    boolean flushCache = context.getBooleanAttribute("flushCache", !isSelect);
    boolean useCache = context.getBooleanAttribute("useCache", isSelect);
    boolean resultOrdered = context.getBooleanAttribute("resultOrdered", false);
```

这一段的内容，是收集 statement 标签中定义的一些基础属性，以及判断这个 statement 是否为 DQL （即 select ）。

#### 1.3.4 include标签的支持

```java
    // Include Fragments before parsing
    XMLIncludeTransformer includeParser = new XMLIncludeTransformer(configuration, builderAssistant);
    includeParser.applyIncludes(context.getNode());
```

接下来它会创建一个 `XMLIncludeTransformer` ，并应用于当前 statement 的子标签节点。我们知道，动态 SQL 是可以引用一些 SQL 片段的，而 MyBatis 底层支持 SQL 片段拼接的工具，就是这个 `XMLIncludeTransformer` 。它的内部实现比较复杂比较绕，主要是利用了递归解析的方式，将动态 SQL 中的 `<include />` 标签转换为实际的 SQL 片段，如：

```xml
<select id="findAll">
    select <include refid="allFields" /> from tbl_department
</select>

<sql id="allFields">
    id, name, tel
</sql>
```

解析完毕后就是：

```sql
select id, name, tel from tbl_department

```

#### 1.3.5 基础属性的处理

```java
    String parameterType = context.getStringAttribute("parameterType");
    Class<?> parameterTypeClass = resolveClass(parameterType);

    String lang = context.getStringAttribute("lang");
    LanguageDriver langDriver = getLanguageDriver(lang);
```

接下来的两段又是 statement 基础属性的一些处理，上面是处理传入参数的类型，下面是解析 SQL 语言的编写（一般我们都不会动它，都是使用默认的 xml 语言编写）。

#### 1.3.6 selectKey标签的处理

```java
    // Parse selectKey after includes and remove them.
    processSelectKeyNodes(id, parameterTypeClass, langDriver);

    // Parse the SQL (pre: <selectKey> and <include> were parsed and removed)
    KeyGenerator keyGenerator;
    String keyStatementId = id + SelectKeyGenerator.SELECT_KEY_SUFFIX;
    keyStatementId = builderAssistant.applyCurrentNamespace(keyStatementId, true);
    if (configuration.hasKeyGenerator(keyStatementId)) {
      keyGenerator = configuration.getKeyGenerator(keyStatementId);
    } else {
      keyGenerator = context.getBooleanAttribute("useGeneratedKeys",
          configuration.isUseGeneratedKeys() && SqlCommandType.INSERT.equals(sqlCommandType))
          ? Jdbc3KeyGenerator.INSTANCE : NoKeyGenerator.INSTANCE;
    }
```

下面的这一步，是处理 `<select>` 标签中的 `<selectKey>` 子标签，通常情况下我们用 `<selectKey>` 不算很多，一般是在自增主键的表插入数据时，获取自增值用。它的底层解析不算很复杂，我们来看看 `processSelectKeyNodes` 方法的实现：

```java
private void processSelectKeyNodes(String id, Class<?> parameterTypeClass, LanguageDriver langDriver) {
    // 可能有多个selectKey
    List<XNode> selectKeyNodes = context.evalNodes("selectKey");
    if (configuration.getDatabaseId() != null) {
        parseSelectKeyNodes(id, selectKeyNodes, parameterTypeClass, 
                            langDriver, configuration.getDatabaseId());
    }
    parseSelectKeyNodes(id, selectKeyNodes, parameterTypeClass, langDriver, null);
    removeSelectKeyNodes(selectKeyNodes);
}
```

从这个逻辑上看，`<selectKey>` 标签可以一次性用好几个，MyBatis 会把他们都收集起来一起解析。

解析的逻辑是下面的 `parseSelectKeyNodes` 方法：

```java
private void parseSelectKeyNodes(String parentId, List<XNode> list, Class<?> parameterTypeClass, 
        LanguageDriver langDriver, String skRequiredDatabaseId) {
    for (XNode nodeToHandle : list) {
        // 每个selectKey也有自己的id
        String id = parentId + SelectKeyGenerator.SELECT_KEY_SUFFIX;
        String databaseId = nodeToHandle.getStringAttribute("databaseId");
        if (databaseIdMatchesCurrent(id, databaseId, skRequiredDatabaseId)) {
            // 实际的解析动作
            parseSelectKeyNode(id, nodeToHandle, parameterTypeClass, langDriver, databaseId);
        }
    }
}
```

这里它会循环每个 `<selectKey>` 标签了，会为它们赋予新的 id（追加一个 `"!selectKey"` 的后缀），以及判断它们的 databaseId （对，`<selectKey>` 也是可以针对不同的数据库分别配置的），当 databaseId 匹配，或者没有 databaseId 声明时，才会实际的解析这个标签。

而下面的解析动作，就没什么意思了，又是取值、创建 SQL 语句对象等等，

```java
private void parseSelectKeyNode(String id, XNode nodeToHandle, Class<?> parameterTypeClass, 
        LanguageDriver langDriver, String databaseId) {
    // 解析基础的属性，类型
    String resultType = nodeToHandle.getStringAttribute("resultType");
    Class<?> resultTypeClass = resolveClass(resultType);
    StatementType statementType = StatementType.valueOf(nodeToHandle
             .getStringAttribute("statementType", StatementType.PREPARED.toString()));
    String keyProperty = nodeToHandle.getStringAttribute("keyProperty");
    String keyColumn = nodeToHandle.getStringAttribute("keyColumn");
    // 该selectKey触发的时机，先于/晚于主体SQL执行
    boolean executeBefore = "BEFORE".equals(nodeToHandle.getStringAttribute("order", "AFTER"));

    // defaults 默认值，MyBatis表示:这些你们都不用管了！
    boolean useCache = false;
    boolean resultOrdered = false;
    KeyGenerator keyGenerator = NoKeyGenerator.INSTANCE;
    Integer fetchSize = null;
    Integer timeout = null;
    boolean flushCache = false;
    String parameterMap = null;
    String resultMap = null;
    ResultSetType resultSetTypeEnum = null;

    // 解析SQL语句
    SqlSource sqlSource = langDriver.createSqlSource(configuration, nodeToHandle, parameterTypeClass);
    SqlCommandType sqlCommandType = SqlCommandType.SELECT;

    // selectKey的本质也是一个MappedStatement
    builderAssistant.addMappedStatement(id, sqlSource, statementType, sqlCommandType,
            fetchSize, timeout, parameterMap, parameterTypeClass, resultMap, resultTypeClass,
            resultSetTypeEnum, flushCache, useCache, resultOrdered,
            keyGenerator, keyProperty, keyColumn, databaseId, langDriver, null);

    // 将这个selectKey也放入MyBatis全局配置对象Configuration中
    id = builderAssistant.applyCurrentNamespace(id, false);
    MappedStatement keyStatement = configuration.getMappedStatement(id, false);
    configuration.addKeyGenerator(id, new SelectKeyGenerator(keyStatement, executeBefore));
}
```

#### 1.3.7 构造SQL语句

```java
    SqlSource sqlSource = langDriver.createSqlSource(configuration, context, parameterTypeClass);

```

这个环节就这一句话，但这句话也相当复杂了，我们暂且放下，

#### 1.3.8 继续收集属性

```java
    StatementType statementType = 
      StatementType.valueOf(context.getStringAttribute("statementType", StatementType.PREPARED.toString()));
    Integer fetchSize = context.getIntAttribute("fetchSize");
    Integer timeout = context.getIntAttribute("timeout");
    String parameterMap = context.getStringAttribute("parameterMap");
    String resultType = context.getStringAttribute("resultType");
    Class<?> resultTypeClass = resolveClass(resultType);
    String resultMap = context.getStringAttribute("resultMap");
    String resultSetType = context.getStringAttribute("resultSetType");
    ResultSetType resultSetTypeEnum = resolveResultSetType(resultSetType);
    if (resultSetTypeEnum == null) {
      resultSetTypeEnum = configuration.getDefaultResultSetType();
    }
    String keyProperty = context.getStringAttribute("keyProperty");
    String keyColumn = context.getStringAttribute("keyColumn");
    String resultSets = context.getStringAttribute("resultSets");
```

#### 1.3.9 构建MappedStatement

```java
    builderAssistant.addMappedStatement(id, sqlSource, statementType, sqlCommandType,
            fetchSize, timeout, parameterMap, parameterTypeClass, resultMap, resultTypeClass,
            resultSetTypeEnum, flushCache, useCache, resultOrdered,
            keyGenerator, keyProperty, keyColumn, databaseId, langDriver, resultSets);
}
```

最后的步骤，又是交给 `MapperBuilderAssistant` 干活了，而有了前面的源码经验，这个 `addMappedStatement` 方法的内部用的什么，我想不用我说各位也能猜得到吧，对，它还是用的建造器 `MappedStatement.Builder` 构建的 `MappedStatement` 

### 1.4 构造SQL【 ! 】

OK ，了解完整个 `MappedStatement` 的构建，接下来就剩下一个环节了：它里面的 SQL 是如何构建的呢？

#### 1.4.1 LanguageDriver

MyBatis 的全局配置文件中有这么一个属性：**`defaultScriptingLanguage`** ，它可以**指定动态 SQL 生成使用的默认脚本语言**，但是为什么我们不知道呢？害，我们除了用 xml 编写动态 SQL 之外，也没见到过还用别的方式了，所以我们都默认这么干是唯一的了。

> 其实我们可以通过编写实现了 `LanguageDriver` 接口的自定义类，扩展动态 SQL 的编写方式，这是 MyBatis 留给我们的一个扩展点，只不过我们不会真的扩展罢了（本身动态 SQL 已经挺好用了）。

话说回来，这个 `LanguageDriver` 本身是个啥呢？从字面上翻译，它是一个脚本语言的驱动器，实际上它就是动态 SQL 编写的方式的**解释器**罢了。它拿到 statement 中我们编写的动态 SQL ，并按照它既定的解释规则，就可以生成 SQL 语句了。

MyBatis 本身给 `LanguageDriver` 接口留的实现也只有 xml 的方式，落地实现类是 `XMLLanguageDriver` ，所以下面我们的重点就放在 `XMLLanguageDriver` 上了。

#### 1.4.2 createSqlSource

核心的处理逻辑是上面的那行 `langDriver.createSqlSource` ，它的实现又是交由另一个组件 `XMLScriptBuilder` 干活了：

```java
@Override
public SqlSource createSqlSource(Configuration configuration, XNode script, Class<?> parameterType) {
    XMLScriptBuilder builder = new XMLScriptBuilder(configuration, script, parameterType);
    return builder.parseScriptNode();
}
```

> 是不是产生了一种感觉：特喵的咋动不动就甩直接给另外的组件干活呢？

我们先留意一下这个 `XMLScriptBuilder` 类。

##### 1.4.2.1 XMLScriptBuilder的设计

这个 `XMLScriptBuilder` 又又又是继承自 `BaseBuilder` （这家伙的子类真的好多啊），很好理解，动态 SQL 要用 xml 写嘛，写完了要注册到 MyBatis 全局 `Configuration` 中，正好 `BaseBuilder` 中本身就集成了，继承一下还省事。

看一下它的构造吧，构造方法中有一段额外的逻辑值得我们留意一下：

```java
public class XMLScriptBuilder extends BaseBuilder {

    private final XNode context;
    private boolean isDynamic;
    private final Class<?> parameterType;
    private final Map<String, NodeHandler> nodeHandlerMap = new HashMap<>();

    public XMLScriptBuilder(Configuration configuration, XNode context, Class<?> parameterType) {
        super(configuration);
        this.context = context;
        this.parameterType = parameterType;
        initNodeHandlerMap();
    }
```

这个 `initNodeHandlerMap` 方法的用意何为呢？我们进去看一下：

```java
private void initNodeHandlerMap() {
    nodeHandlerMap.put("trim", new TrimHandler());
    nodeHandlerMap.put("where", new WhereHandler());
    nodeHandlerMap.put("set", new SetHandler());
    nodeHandlerMap.put("foreach", new ForEachHandler());
    nodeHandlerMap.put("if", new IfHandler());
    nodeHandlerMap.put("choose", new ChooseHandler());
    nodeHandlerMap.put("when", new IfHandler());
    nodeHandlerMap.put("otherwise", new OtherwiseHandler());
    nodeHandlerMap.put("bind", new BindHandler());
}
```

咦，这 put 的这些东西，key 不就是动态 SQL 中可以使用的标签吗？合着这些标签的底层支持都是一堆 `Handler` ，在解析动态 SQL 时，遇到这些标签时，会使用相应的 `Handler` 去处理。至于怎么处理，下面我们马上就可以看到了。

##### 1.4.2.2 解析SQL语句

我们往里跳转，来到 `XMLScriptBuilder` 的 `parseScriptNode` 方法：（看注释）

```java
private boolean isDynamic;

public SqlSource parseScriptNode() {
    // 解析动态SQL标签
    MixedSqlNode rootSqlNode = parseDynamicTags(context);
    SqlSource sqlSource;
    // 解析完毕后如果包含动态SQL，则封装为DynamicSqlSource
    if (isDynamic) {
        sqlSource = new DynamicSqlSource(configuration, rootSqlNode);
    } else {
        sqlSource = new RawSqlSource(configuration, rootSqlNode, parameterType);
    }
    return sqlSource;
}
```

这个方法实质就两步：解析动态 SQL 标签，封装 `SqlSource` 并返回。这里面复杂的是前一步 `parseDynamicTags` ，这一步会顺带着记录下 SQL 中是否包含动态 SQL 标签，以备下一步的 `SqlSource` 封装时作为判断依据。

##### 1.4.2.3 解析动态SQL标签

继续往下看，复杂的动态 SQL 标签解析逻辑，这里面的逻辑略长，不过不难理解，

```java
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
```

它解析的逻辑包含两部分：解析普通 SQL 文本，以及解析动态标签。

对于解析普通 SQL 文本的情况下，它判断的依据是：这段内容只有 SQL ，没有标签；这段内容是被 CDATA 包围的。符合这两种情况的文本会被认定为普通 SQL ，并直接添加到 contents 的那个 SQL 节点集合中。注意它中间还有一个是否为动态 SQL 的判断，可能会有小伙伴产生疑惑，普通文本 SQL 怎么可能会是动态 SQL 呢？来，我们回想一下 `#{}` 跟 `${}` 的区别，我们刚学习 MyBatis 的时候，知道的是 `#{}` 底层是占位符，而 `${}` 会被直接替换为明文是吧，那 `${}` 在生成 SQL 时，是不是就需要动态拼接了呀？所以这个地方，检查普通 SQL 文本是否为动态 SQL ，其实就是**判断这段 SQL 中有没有 `${}` 表达式**，如果有，则会认定当前 statement 中的 SQL 是动态 SQL 。

对于动态 SQL 标签的解析，它检查的是有没有 xml 的子标签，有的话就从上面初始化的那一堆 `Handler` 中找可以处理它的 `Handler` ，并处理它。处理完成后，标注一下当前 statement 中的 SQL 是动态 SQL 。

## 2. 注解Mapper接口解析

### 2.1 解析的入口

```java
private void mapperElement(XNode parent) throws Exception {
    if (parent != null) {
        for (XNode child : parent.getChildren()) {
            // 包扫描Mapper接口
            if ("package".equals(child.getName())) {
                String mapperPackage = child.getStringAttribute("name");
                // 【注意看这里】
                configuration.addMappers(mapperPackage);
            } else {
                // ......
                } else if (resource == null && url == null && mapperClass != null) {
                    // 注册单个Mapper接口
                    // 【注意看这里】
                    Class<?> mapperInterface = Resources.classForName(mapperClass);
                    configuration.addMapper(mapperInterface);
                } // ......
            }
        }
    }
}
```

本章一开始就标注好了，一个是包扫描 Mapper 接口，一个是注册单个 Mapper 接口。

核心的解析方法是 `configuration.addMapper` ，而它又是委托 `MapperRegistry` 帮忙做事：

```java
protected final MapperRegistry mapperRegistry = new MapperRegistry(this);

public <T> void addMapper(Class<T> type) {
    mapperRegistry.addMapper(type);
}

public <T> void addMapper(Class<T> type) {
    // 只有接口才会解析
    if (type.isInterface()) {
        // 重复注册的检查
        if (hasMapper(type)) {
            throw new BindingException("Type " + type + " is already known to the MapperRegistry.");
        }
        boolean loadCompleted = false;
        try {
            // 记录在Map中，留意value的类型是MapperProxyFactory
            knownMappers.put(type, new MapperProxyFactory<>(type));
            MapperAnnotationBuilder parser = new MapperAnnotationBuilder(config, type);
            // 利用MapperAnnotationBuilder解析Mapper接口
            parser.parse();
            loadCompleted = true;
        } finally {
            if (!loadCompleted) {
                knownMappers.remove(type);
            }
        }
    }
}
```

### 2.2 MapperAnnotationBuilder解析Mapper接口

`MapperAnnotationBuilder` 的 `parse` 方法比较长，但逻辑很有条理：



```java
public void parse() {
    String resource = type.toString();
    // 检查接口是否已经加载
    if (!configuration.isResourceLoaded(resource)) {
        // 加载Mapper接口对应的mapper.xml
        loadXmlResource();
        configuration.addLoadedResource(resource);
        assistant.setCurrentNamespace(type.getName());
        // 解析注解配置的缓存
        parseCache();
        parseCacheRef();
        // 解析Mapper方法
        for (Method method : type.getMethods()) {
            if (!canHaveStatement(method)) {
                continue;
            }
            // 解析注解配置的ResultMap
            if (getAnnotationWrapper(method, false, Select.class, SelectProvider.class).isPresent()
                && method.getAnnotation(ResultMap.class) == null) {
                parseResultMap(method);
            }
            try {
                // 构造statement
                parseStatement(method);
            } catch (IncompleteElementException e) {
                configuration.addIncompleteMethod(new MethodResolver(this, method));
            }
        }
    }
    parsePendingMethods();
}
```

自上而下的几个核心动作，跟解析 mapper.xml 的逻辑大致相同。

### 2.3 方法statement的解析

```java
void parseStatement(Method method) {
    final Class<?> parameterTypeClass = getParameterType(method);
    final LanguageDriver languageDriver = getLanguageDriver(method);
    getAnnotationWrapper(method, true, statementAnnotationTypes).ifPresent(statementAnnotation -> {
        // 【复杂】构造SQL语句源
        final SqlSource sqlSource = buildSqlSource(statementAnnotation.getAnnotation(), 
                      parameterTypeClass, languageDriver, method);
        final SqlCommandType sqlCommandType = statementAnnotation.getSqlCommandType();
        // 解析statement的配置
        final Options options = getAnnotationWrapper(method, false, Options.class)
                                        .map(x -> (Options)x.getAnnotation()).orElse(null);
        // 生成statementId
        final String mappedStatementId = type.getName() + "." + method.getName();

        final KeyGenerator keyGenerator;
        String keyProperty = null;
        String keyColumn = null;
        // 处理KeyGenerator
        if (SqlCommandType.INSERT.equals(sqlCommandType) || SqlCommandType.UPDATE.equals(sqlCommandType)) {
            // first check for SelectKey annotation - that overrides everything else
            SelectKey selectKey = getAnnotationWrapper(method, false, SelectKey.class)
                                          .map(x -> (SelectKey)x.getAnnotation()).orElse(null);
            if (selectKey != null) {
                keyGenerator = handleSelectKeyAnnotation(selectKey, 
                                       mappedStatementId, getParameterType(method), languageDriver);
                keyProperty = selectKey.keyProperty();
            } else if (options == null) {
                keyGenerator = configuration.isUseGeneratedKeys() ? Jdbc3KeyGenerator.INSTANCE : NoKeyGenerator.INSTANCE;
            } else {
                keyGenerator = options.useGeneratedKeys() ? Jdbc3KeyGenerator.INSTANCE : NoKeyGenerator.INSTANCE;
                keyProperty = options.keyProperty();
                keyColumn = options.keyColumn();
            }
        } else {
            keyGenerator = NoKeyGenerator.INSTANCE;
        }

        // 处理其他的配置、属性
        Integer fetchSize = null;
        Integer timeout = null;
        StatementType statementType = StatementType.PREPARED;
        ResultSetType resultSetType = configuration.getDefaultResultSetType();
        boolean isSelect = sqlCommandType == SqlCommandType.SELECT;
        boolean flushCache = !isSelect;
        boolean useCache = isSelect;
        if (options != null) {
            if (FlushCachePolicy.TRUE.equals(options.flushCache())) {
                flushCache = true;
            } else if (FlushCachePolicy.FALSE.equals(options.flushCache())) {
                flushCache = false;
            }
            useCache = options.useCache();
            fetchSize = options.fetchSize() > -1 || options.fetchSize() 
                            == Integer.MIN_VALUE ? options.fetchSize() : null;
            timeout = options.timeout() > -1 ? options.timeout() : null;
            statementType = options.statementType();
            if (options.resultSetType() != ResultSetType.DEFAULT) {
                resultSetType = options.resultSetType();
            }
        }

        // 处理resultMapId
        String resultMapId = null;
        if (isSelect) {
            ResultMap resultMapAnnotation = method.getAnnotation(ResultMap.class);
            if (resultMapAnnotation != null) {
                resultMapId = String.join(",", resultMapAnnotation.value());
            } else {
                resultMapId = generateResultMapName(method);
            }
        }
        // 构造MappedStatement
        assistant.addMappedStatement(mappedStatementId, sqlSource,
                statementType, sqlCommandType, fetchSize, timeout, null,
                parameterTypeClass, resultMapId, getReturnType(method), resultSetType,
                flushCache, useCache, false, keyGenerator, keyProperty, keyColumn,
                statementAnnotation.getDatabaseId(), languageDriver,
                options != null ? nullOrEmpty(options.resultSets()) : null);
    });
}
```

### 2.4 buildSqlSource

注解 Mapper 接口中，构造 `SqlSource` ，其实就是扫描那些 statement 注解，包括常用的 `@Select` 等四个基本注解，还有 4 个 Provider 系列注解。针对这两种类型的注解，底层的处理逻辑也有一些区别：

```java
private SqlSource buildSqlSource(Annotation annotation, Class<?> parameterType, 
        LanguageDriver languageDriver, Method method) {
    if (annotation instanceof Select) {
        return buildSqlSourceFromStrings(((Select) annotation).value(), parameterType, languageDriver);
    } else if (annotation instanceof Update) {
        return buildSqlSourceFromStrings(((Update) annotation).value(), parameterType, languageDriver);
    } else if (annotation instanceof Insert) {
        return buildSqlSourceFromStrings(((Insert) annotation).value(), parameterType, languageDriver);
    } else if (annotation instanceof Delete) {
        return buildSqlSourceFromStrings(((Delete) annotation).value(), parameterType, languageDriver);
    } else if (annotation instanceof SelectKey) {
        return buildSqlSourceFromStrings(((SelectKey) annotation).statement(), parameterType, languageDriver);
    }
    return new ProviderSqlSource(assistant.getConfiguration(), annotation, type, method);
}
```

可以发现，由于 4 个基本注解中，声明的都是普通字符串，或者 xml script 脚本，所以只需要通过字符串构建即可；而 Provider 系列注解，则是直接构建为一个 `ProviderSqlSource` 类型的对象返回。在第 22 章中小册已经提过这个 `ProviderSqlSource` 了，不过当时小册说的是我们用的不多，并且 MyBatis 也不怎么推荐，所以这里我们还是忽略，重点关注的是如何通过字符串构建 `SqlSource` 。

```java
private SqlSource buildSqlSourceFromStrings(String[] strings, Class<?> parameterTypeClass,
        LanguageDriver languageDriver) {
    return languageDriver.
      createSqlSource(configuration, String.join(" ", strings).trim(), parameterTypeClass);
}
```

