---
title: 21生命周期-Mapper动态代理类执行流程原理
---

```java
InputStream xml = Resources.getResourceAsStream("mybatis-config.xml");
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(xml);
SqlSession sqlSession = sqlSessionFactory.openSession();

DepartmentMapper departmentMapper = sqlSession.getMapper(DepartmentMapper.class);
departmentMapper.findAll();
```

## 1. 获取Mapper代理对象

获取 Mapper 接口的方式，是走 `SqlSession` 的 `getMapper` 方法。

### 1.1 SqlSession#getMapper

进入到 `DefaultSqlSession` 中，可以发现它又调了全局 `Configuration` 的 `getMapper` 方法

```java
public <T> T getMapper(Class<T> type) {
    return configuration.getMapper(type, this);
}
```

### 1.2 Configuration#getMapper

啊这，它又调用了 `MapperRegistry` 的 `getMapper` 方法：

```java
protected final MapperRegistry mapperRegistry = new MapperRegistry(this);

public <T> T getMapper(Class<T> type, SqlSession sqlSession) {
    return mapperRegistry.getMapper(type, sqlSession);
}
```

### 1.3 MapperRegistry#getMapper

```java
private final Map<Class<?>, MapperProxyFactory<?>> knownMappers = new HashMap<>();

public <T> T getMapper(Class<T> type, SqlSession sqlSession) {
    final MapperProxyFactory<T> mapperProxyFactory = (MapperProxyFactory<T>) knownMappers.get(type);
    if (mapperProxyFactory == null) {
        throw new BindingException("Type " + type + " is not known to the MapperRegistry.");
    }
    try {
        return mapperProxyFactory.newInstance(sqlSession);
    } // catch ......
}
```

注意这里面的一个关键的类：`MapperProxyFactory` ，它是啥？

顾名思义，`MapperProxyFactory` 的 Mapper 代理对象的工厂，说到工厂那我们第一想到的就是可以生产对象吧！这个 `MapperProxyFactory` 的本职工作就是生产 Mapper 接口，至于怎么生产，下面我们马上就可以看到了。

我们可以 Debug 进来，观察一下此时 `knownMappers` 中的情况：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220405161208mybatis.png)

诶？竟然有两个 Mapper 了？而且点进去可以发现就是工程代码里的 `DepartmentMapper` 和 `UserMapper` 。为什么会有预先的这两个家伙呢？

其实在 Mapper 接口、mapper.xml 的逻辑中，这个接口就已经注册好了：

```java
configuration.addMapper(mapperInterface);

public <T> void addMapper(Class<T> type) {
    mapperRegistry.addMapper(type);
}

public <T> void addMapper(Class<T> type) {
    // ......
        try {
            // 此处会记录下来
            knownMappers.put(type, new MapperProxyFactory<>(type));
            // ......
        } // finally ......
    }
}
```

OK 回到正题，这里获取到 MapperProxyFactory 之后，下一步就是创建代理对象了。

### 1.4 newInstance

进入 `MapperProxyFactory` 的 `newInstance` 方法，可以发现它真的很简单：

```java
public T newInstance(SqlSession sqlSession) {
    final MapperProxy<T> mapperProxy = new MapperProxy<>(sqlSession, mapperInterface, methodCache);
    return newInstance(mapperProxy);
}

protected T newInstance(MapperProxy<T> mapperProxy) {
    return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(), new Class[] { mapperInterface }, mapperProxy);
}
```

就是最普通的 jdk 动态代理，创建出对象后，返回就完事了。

接口本身没啥意思，关键是那个 `InvocationHandler` ，也就是 `MapperProxy` ，这个我们得重点研究一下。

## 2. MapperProxy

既然是 Mapper 的代理，它又能代替 Mapper 接口实现方法，那它内部肯定有执行 SqlSession 的逻辑，下面我们还是从内部的成员结构开始研究。

### 2.1 重要成员

```java
public class MapperProxy<T> implements InvocationHandler, Serializable {
    // 内部要组合SqlSession，不然没法执行SqlSession的方法
    private final SqlSession sqlSession;
    // 记录当前代理了哪个接口
    private final Class<T> mapperInterface;
    // 缓存MapperMethod
    private final Map<Method, MapperMethodInvoker> methodCache;
```

注意看这个 `Map` 的 key ，是 Java 中反射的那个 `Method` ，那是不是说明了这个 `MapperProxy` 会将 Mapper 接口中的每个方法都缓存一遍呢？回头 Mapper 代理对象执行时，只需要知道当前执行哪个方法，就可以从这个 `Map` 中取出对应的 Invoker ，调用其方法就 OK 呢？哎没错，大体的逻辑就是这么回事，下面我们看到具体的调用逻辑时就可以了解到全流程了。

### 2.2 核心invoke

`InvocationHandler` 的核心方法当然是 `invoke` ，我们往下翻到 `MapperProxy` 的 `invoke` 方法，

```java
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    try {
        // 如果是Object类中的方法，默认不代理
        if (Object.class.equals(method.getDeclaringClass())) {
            return method.invoke(this, args);
        } else {
            // Mapper接口自己定义的方法，需要找对应的MapperMethodInvoker
            return cachedInvoker(method).invoke(proxy, method, args, sqlSession);
        }
    } // catch ......
}
```

#### 2.2.1 缓存Invoker

```java
private MapperMethodInvoker cachedInvoker(Method method) throws Throwable {
    try {
        // 先取缓存，取到就返回
        MapperMethodInvoker invoker = methodCache.get(method);
        if (invoker != null) {
            return invoker;
        }

        return methodCache.computeIfAbsent(method, m -> {
            // 兼容Java8特性中接口的default方法
            if (m.isDefault()) {
                try {
                    if (privateLookupInMethod == null) {
                        return new DefaultMethodInvoker(getMethodHandleJava8(method));
                    } else {
                        return new DefaultMethodInvoker(getMethodHandleJava9(method));
                    }
                } // catch ......
            } else {
                // 这里才是执行SqlSession的Invoker
   return new PlainMethodInvoker(new MapperMethod(mapperInterface, method, sqlSession.getConfiguration()));
            }
        });
    } // catch ......
}
```

这段源码其实主要就两段逻辑：1）如果缓存里有 Invoker ，则直接返回；2）如果没有，则根据要执行的方法是否为 default 方法，不是则封装 `PlainMethodInvoker` ，并放入缓存。这个封装的重点，不是 `PlainMethodInvoker` ，而是它内部的 `MapperMethod` 。

##### 2.2.1.1 MapperMethod

这个 Invoker 的内部组合了一个 `MapperMethod` ，而这个 `MapperMethod` 的内部又组合了两个新的家伙

```java
public class MapperMethod {

    private final SqlCommand command;
    private final MethodSignature method;

    public MapperMethod(Class<?> mapperInterface, Method method, Configuration config) {
        this.command = new SqlCommand(config, mapperInterface, method);
        this.method = new MethodSignature(config, mapperInterface, method);
    }
```

这么多陌生的类放在我们面前搞得我们有点措手不及，这样吧，不如我们先不看了，先返回去关注 `MapperProxy` 的 `invoke` 方法吧，后面遇到这几个类的时候再说。

#### 2.2.2 执行Invoker的方法

取到 `MapperMethodInvoker` 之后，接下来就是调用它的 `invoke` 方法了，注意这个 `invoke` 方法的参数列表中多了一个 `SqlSession` ：

```java
private static class PlainMethodInvoker implements MapperMethodInvoker {
    private final MapperMethod mapperMethod;

    public PlainMethodInvoker(MapperMethod mapperMethod) {
        super();
        this.mapperMethod = mapperMethod;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args, SqlSession sqlSession) 
      throws Throwable {
        return mapperMethod.execute(sqlSession, args);
    }
}
```

而 `invoke` 方法的动作就是直接调用 `mapperMethod` 的 `execute` 方法，继续往里跳：（注意标注在源码中的注释）

```java
private final SqlCommand command;

public Object execute(SqlSession sqlSession, Object[] args) {
    Object result;
    // 2.2.2.1 判断一下当前调用的SQL的类别
    switch (command.getType()) {
        case INSERT: {
            // 2.2.2.2 处理参数
            Object param = method.convertArgsToSqlCommandParam(args);
            // 此处调用SqlSession的insert方法
            result = rowCountResult(sqlSession.insert(command.getName(), param));
            break;
        }
        case UPDATE: {
            Object param = method.convertArgsToSqlCommandParam(args);
            // 此处调用SqlSession的update方法
            result = rowCountResult(sqlSession.update(command.getName(), param));
            break;
        }
        case DELETE: {
            Object param = method.convertArgsToSqlCommandParam(args);
            // 此处调用SqlSession的delete方法
            result = rowCountResult(sqlSession.delete(command.getName(), param));
            break;
        }
        case SELECT:
            if (method.returnsVoid() && method.hasResultHandler()) {
                // 使用ResultHandler处理查询动作
                executeWithResultHandler(sqlSession, args);
                result = null;
            } else if (method.returnsMany()) {
                // selectList
                result = executeForMany(sqlSession, args);
            } else if (method.returnsMap()) {
                // selectMap
                result = executeForMap(sqlSession, args);
            } else if (method.returnsCursor()) {
                // selectCursor
                result = executeForCursor(sqlSession, args);
            } else {
                Object param = method.convertArgsToSqlCommandParam(args);
                // selectOne
                result = sqlSession.selectOne(command.getName(), param);
                if (method.returnsOptional()
                    && (result == null || !method.getReturnType().equals(result.getClass()))) {
                    result = Optional.ofNullable(result);
                }
            }
            break;
        case FLUSH:
            // flush动作
            result = sqlSession.flushStatements();
            break;
        default:
            throw new BindingException("Unknown execution method for: " + command.getName());
    }
    if (result == null && method.getReturnType().isPrimitive() && !method.returnsVoid()) {
        // throw ex ......
    }
    return result;
}
```

纵观这段逻辑，其实就是两个步骤：1）判断当前调用 SQL 的类型，而这个类型藏在 `SqlCommand` 中；根据调用 SQL 的类型，处理查询参数，随后调用 `SqlSession` 的方法。两个步骤我们拆解来看。

##### 2.2.2.1 command的类型

如何判断 command 的类型呢？我们要回到 `SqlCommand` 的构造方法中：（注意源码中标注的注释）

```java
public SqlCommand(Configuration configuration, Class<?> mapperInterface, Method method) {
    final String methodName = method.getName();
    final Class<?> declaringClass = method.getDeclaringClass();
    MappedStatement ms = resolveMappedStatement(mapperInterface, methodName, declaringClass, configuration);
    if (ms == null) {
        if (method.getAnnotation(Flush.class) != null) {
            name = null;
            type = SqlCommandType.FLUSH;
        } // else throw ex ......
    } else {
        name = ms.getId();
        // command的类型藏在MappedStatement中
        type = ms.getSqlCommandType();
        if (type == SqlCommandType.UNKNOWN) {
            throw new BindingException("Unknown execution method for: " + name);
        }
    }
}
```

注意看下面的 else 部分，`type` 的值是从 `MappedStatement` 中取出的，而 `MappedStatement` 怎么知道哪条 SQL 是什么类型呢？

很简单，你用 `<insert>` 标签或者 `@Insert` 注解，那就 INSERT ，用 `<select>` 标签或者 `@Select` 注解，那就是 SELECT 了。

##### 2.2.2.2 convertArgsToSqlCommandParam

获取到要执行的类型后，在执行 `SqlSession` 之前还有一个额外的动作，它要处理一下参数：

```java
this.paramNameResolver = new ParamNameResolver(configuration, method);

public Object convertArgsToSqlCommandParam(Object[] args) {
    return paramNameResolver.getNamedParams(args);
}
```

为什么会有这样一个动作呢？我们回忆一下 Mapper 接口方法的写法：

```java
User findByUsernameAndPassword(@Param("username") String username, String password);

```

用这种方式，可以直接在方法的参数列表上声明多个参数，对应的 mapper.xml 中就可以通过 `${username}` 和 `${password}` 取到这两个参数（有没有 `@Param` 注解无所谓），它的这种方式，就需要这个 `convertArgsToSqlCommandParam` 方法处理：

```java
private final SortedMap<Integer, String> names;

public Object getNamedParams(Object[] args) {
    final int paramCount = names.size();
    if (args == null || paramCount == 0) {
        return null;
    } else if (!hasParamAnnotation && paramCount == 1) {
        Object value = args[names.firstKey()];
        return wrapToMapIfCollection(value, useActualParamName ? names.get(0) : null);
    } else {
        // 遇到多个参数，封装一个Map
        final Map<String, Object> param = new ParamMap<>();
        int i = 0;
        for (Map.Entry<Integer, String> entry : names.entrySet()) {
            param.put(entry.getValue(), args[entry.getKey()]);
            // 给每个参数起另外的别名：param1, param2, ...
            final String genericParamName = GENERIC_NAME_PREFIX + (i + 1);
            // ensure not to overwrite parameter named with @Param
            if (!names.containsValue(genericParamName)) {
                param.put(genericParamName, args[entry.getKey()]);
            }
            i++;
        }
        return param;
    }
}
```

这里面的处理方式，就是在方法参数多于一个时，用一个 `Map` 将这些参数都收集好。注意这个方法最开始用到的那个 `names` ，它会把方法参数列表的变量名都收集起来（如果有 `@Param` 参数，则用注解声明的属性名），以便 `getNamedParams` 方法的处理。

经过这个方法处理后，返回的就是 Map 了，mapper.xml 中就可以使用这些参数了，对应的 `ParameterHandler` 也可以拿来处理了。

##### 2.2.2.3 关注一下select部分

对于 DML 的三个动作，在上面的 Invoker 中我们已经看到了调用 `SqlSession` 的方法，而对于 select 部分却没有看到太多，我们可以再看一下这些动作中最具代表性的调用 `selectList` 的实现 `executeForMany` 方法：（看一下源码的整体流程和注释就可以了，小册不再展开）

```java
private <E> Object executeForMany(SqlSession sqlSession, Object[] args) {
    List<E> result;
    Object param = method.convertArgsToSqlCommandParam(args);
    if (method.hasRowBounds()) {
        // 内存分页的处理
        RowBounds rowBounds = method.extractRowBounds(args);
        result = sqlSession.selectList(command.getName(), param, rowBounds);
    } else {
        result = sqlSession.selectList(command.getName(), param);
    }
    // issue #510 Collections & arrays support
    if (!method.getReturnType().isAssignableFrom(result.getClass())) {
        // 如果返回值是数组，则这里有一个处理的动作
        if (method.getReturnType().isArray()) {
            return convertToArray(result);
        } else {
            // 否则，返回集合
            return convertToDeclaredCollection(sqlSession.getConfiguration(), result);
        }
    }
    return result;
}
```

接下来的部分，就跟前面衔接起来了，调用 `selectList` 方法，返回出去，结束。

