---
title: 18生命周期-SqlSession执行
--- 

本章我们来看一看，`SqlSession` 的构造，以及在执行 statement 时，它底层都干了什么。

## 1. SqlSession的创建

`SqlSession` 的创建，要来源于 `SqlSessionFactory` 的 `openSession` 方法，而这个 `openSession` 方法重载的实在是有点多：

```java
    SqlSession openSession();
    SqlSession openSession(boolean autoCommit);
    SqlSession openSession(Connection connection);
    SqlSession openSession(TransactionIsolationLevel level);
    SqlSession openSession(ExecutorType execType);
    SqlSession openSession(ExecutorType execType, boolean autoCommit);
    SqlSession openSession(ExecutorType execType, TransactionIsolationLevel level);
    SqlSession openSession(ExecutorType execType, Connection connection);
```



虽说是那么多，下面的几种我们用到过吗？肯定没有吧，所以我们也不用关心，只需要看默认的无参方法即可

### 1.1 openSession

```java
@Override
public SqlSession openSession() {
    return openSessionFromDataSource(configuration.getDefaultExecutorType(), null, false);
}

private SqlSession openSessionFromDataSource(ExecutorType execType, 
                                             TransactionIsolationLevel level, boolean autoCommit) {
    Transaction tx = null;
    try {
        final Environment environment = configuration.getEnvironment();
        final TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);
        tx = transactionFactory.newTransaction(environment.getDataSource(), level, autoCommit);
        final Executor executor = configuration.newExecutor(tx, execType);
        return new DefaultSqlSession(configuration, executor, autoCommit);
    } catch (Exception e) {
        closeTransaction(tx); // may have fetched a connection so lets call close()
        throw ExceptionFactory.wrapException("Error opening session.  Cause: " + e, e);
    } finally {
        ErrorContext.instance().reset();
    }
}
```

事务工厂就是在这里创建的，不过这里我们要关心的不是事务工厂了，而是 `SqlSession` 的创建。

大概看一下创建 `SqlSession` 都需要哪些因素：

- `Environment` → `TransactionFactory` 事务工厂
- `Executor` 真正的执行器
- `Configuration` 全局配置

还记得吧，`SqlSession` 本身不是真正负责执行 CRUD 操作的，而是会转交给 `Executor` 来干，这里我们可以看一下，`Configuration` 是如何创建 `Executor` 的。

#### 1.1.1 configuration.newExecutor

```java
public Executor newExecutor(Transaction transaction, ExecutorType executorType) {
    // 默认值的处理
    executorType = executorType == null ? defaultExecutorType : executorType;
    executorType = executorType == null ? ExecutorType.SIMPLE : executorType;
    // 创建Executor的实现
    Executor executor;
    if (ExecutorType.BATCH == executorType) {
        executor = new BatchExecutor(this, transaction);
    } else if (ExecutorType.REUSE == executorType) {
        executor = new ReuseExecutor(this, transaction);
    } else {
        executor = new SimpleExecutor(this, transaction);
    }
    // 包装二级缓存
    if (cacheEnabled) {
        executor = new CachingExecutor(executor);
    }
    // 拦截器增强
    executor = (Executor) interceptorChain.pluginAll(executor);
    return executor;
}
```

可以发现，它就是根据指定的 `executorType` ，决定创建哪种类型的 `Executor` ，并在必要的时候包装一下二级缓存的增强。这几个 `Executor` 的实现类，我们在第 22 章中已经见过了，不过当时我们只讲解了 `SimpleExecutor` 和 `CachingExecutor` ，是因为这两个实现类是我们最常遇到的，如果小伙伴们有忘记这两个实现类，可以返回去再看看。

另外留意一下最底下，MyBatis 的插件会给 `Executor` 增强，这个增强逻辑本身也不复杂：

```java
public Object pluginAll(Object target) {
    for (Interceptor interceptor : interceptors) {
        // 逐个增强
        target = interceptor.plugin(target);
    }
    return target;
}

default Object plugin(Object target) {
    return Plugin.wrap(target, this);
}

public static Object wrap(Object target, Interceptor interceptor) {
    Map<Class<?>, Set<Method>> signatureMap = getSignatureMap(interceptor);
    Class<?> type = target.getClass();
    Class<?>[] interfaces = getAllInterfaces(type, signatureMap);
    if (interfaces.length > 0) {
        // 本质是使用jdk动态代理
        return Proxy.newProxyInstance(
            type.getClassLoader(),
            interfaces,
            new Plugin(target, interceptor, signatureMap));
    }
    return target;
}
```

#### 1.1.2 DefaultSqlSession的设计

上面的组件都准备就绪后，最终会创建出一个 `DefaultSqlSession` 的对象，这个 `DefaultSqlSession` 本身是 `SqlSession` 的最基础实现类，它的内部结构如下：

```java
public class DefaultSqlSession implements SqlSession {

    private final Configuration configuration;
    private final Executor executor;

    private final boolean autoCommit;
    private boolean dirty;
    private List<Cursor<?>> cursorList;

    public DefaultSqlSession(Configuration configuration, Executor executor, boolean autoCommit) {
        this.configuration = configuration;
        this.executor = executor;
        this.dirty = false;
        this.autoCommit = autoCommit;
    }
```

除了我们上面看到的 `Configuration` 、`Executor` 之外，还有一个比较奇怪的属性：`dirty` ，它是干什么的呢？

##### 1.1.2.1 dirty的设计

这个属性其实从字面意思上理解，它是标记当前这个 `SqlSession` 是不是脏的，这个 “脏” 如何去理解呢？我们可以看看这个 `dirty` 属性都在哪些地方被设置：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220330205115mybatis.png)

只有一处设置了 `dirty` 为 true ，而这个位置，对应的是 `SqlSession` 的 `update` 方法：

```java
@Override
public int update(String statement, Object parameter) {
    try {
        dirty = true;
        MappedStatement ms = configuration.getMappedStatement(statement);
        return executor.update(ms, wrapCollection(parameter));
    } // catch finally ......
}
```

对于 **insert** 、**update** 、**delete** 这样会对数据造成影响的操作，最终都是走 `update` 方法执行 SQL 语句。那既然是这些造成了数据影响的操作执行了，对于整个 `SqlSession` 来讲，如果事务开启时，那它现在所能查到的数据，就与真实数据库中不一致了，即 “脏” 了。

那如何让它变回干净的状态呢？很简单，**提交 / 回滚事务**，都可以让 `SqlSession` 重回干净状态（此时 `SqlSession` 查询到的数据与数据库一致）。

好了回到主线上，`SqlSession` 的创建本身还是不太复杂的，我们还是继续往下看。

## 2. 执行SqlSession的方法

### 2.1 select系列

`SqlSession` 中定义的 select 系列的方法是最多的，借助 IDE 我们可以看到方法的类型分为以下几种：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220330205442mybatis.png)

#### 2.1.1 selectList

`selectList` 方法是我们最常用的方法之一，它可以直接返回一个数据的列表，泛型也是由我们自己指定。这个方法是 `SqlSession` 系列最通用的方法，我们可以来看看它的实现：

```java
public <E> List<E> selectList(String statement, Object parameter, RowBounds rowBounds) {
    try {
        MappedStatement ms = configuration.getMappedStatement(statement);
        return executor.query(ms, wrapCollection(parameter), rowBounds, Executor.NO_RESULT_HANDLER);
    } // catch finally ......
}
```

可以发现它相当于是做了一次转发，先从全局 `Configuration` 中取出对应的 `MappedStatement` ，随后就交给 `Executor` 去真正执行了。

好，那我们就准备继续往里走，不过在此之前我们先留意下这里面的一个方法：`wrapCollection` 。

##### 2.1.1.1 wrapCollection

这个 `wrapCollection` 方法，从字面上看，它是要把参数包装为集合？还是要包装集合呢？不知道，咱还是点击去看看吧：

```java
private Object wrapCollection(final Object object) {
    // 这个方法是3.5.5抽出来的，之前都是直接在此处编写的逻辑
    return ParamNameResolver.wrapToMapIfCollection(object, null);
}

// 3.5.5 新抽的方法
public static Object wrapToMapIfCollection(Object object, String actualParamName) {
    if (object instanceof Collection) {
        ParamMap<Object> map = new ParamMap<>();
        map.put("collection", object);
        if (object instanceof List) {
            map.put("list", object);
        }
        Optional.ofNullable(actualParamName).ifPresent(name -> map.put(name, object));
        return map;
    } else if (object != null && object.getClass().isArray()) {
        ParamMap<Object> map = new ParamMap<>();
        map.put("array", object);
        Optional.ofNullable(actualParamName).ifPresent(name -> map.put(name, object));
        return map;
    }
    return object;
}
```

哦，原来它是将我们调用 statement 传参时，兼容集合和数组类型的参数做的工作。

一般情况下我们调用 `SqlSession` 的方法时，都是传入一个模型对象，或者 `Map` 集合，不过也有一些情况需要传入数组 / 列表（ `findByIds` 、`deleteByIds` ），这种情况下在 mapper.xml 中我们怎么取这个数组 / 集合呢？答案就在这里，对于数组，它会帮我们起一个默认的名 `array` ，而对于列表，我们可以使用 `collection` 或者 `list` 获取到。

##### 2.1.1.2 executor执行

包装好参数后，下面就会进入到 `Executor` 中了，这里面的逻辑更为重要，小伙伴们打起精神来呀。

```java
  @Override
  public <E> List<E> query(MappedStatement ms, Object parameter, 
                           RowBounds rowBounds, ResultHandler resultHandler) throws SQLException {
    // 获取要执行查询的SQL
    BoundSql boundSql = ms.getBoundSql(parameter);
    CacheKey key = createCacheKey(ms, parameter, rowBounds, boundSql);
    return query(ms, parameter, rowBounds, resultHandler, key, boundSql);
  }
```

`Executor` 的 `query` 方法又被分为 3 个步骤，分别是构造 SQL 、构造缓存键、真正的查询动作。

1. 构造 SQL ，这个步骤会涉及到动态 SQL 的参数绑定动作，由于该部分略复杂，小册打算放到下一章来讲解；
2. 构造缓存键，这个东西与一级缓存有关，下面我们马上就会看到；
3. `query` 真正的查询。

针对后两个方法，我们继续往下拆解。

**CacheKey的构造**

缓存键的设计，其实是为了分辨出每次 `SqlSession` 的查询时，都是用的哪个 statement ，用了什么 SQL ，传了什么参数。缓存键会把这些要素都保存起来，封装为一个 `CacheKey` 对象

```java
public CacheKey createCacheKey(MappedStatement ms, Object parameterObject, 
                               RowBounds rowBounds, BoundSql boundSql) {
    if (closed) {
        throw new ExecutorException("Executor was closed.");
    }
    CacheKey cacheKey = new CacheKey();
    // 当前查询的statement的id
    cacheKey.update(ms.getId());
    // 内存分页的起始点
    cacheKey.update(rowBounds.getOffset());
    // 内存分页的pageSize
    cacheKey.update(rowBounds.getLimit());
    // 当前查询使用的SQL
    cacheKey.update(boundSql.getSql());
    // 如果有查询参数的话，会把查询参数也封装起来
    List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
    TypeHandlerRegistry typeHandlerRegistry = ms.getConfiguration().getTypeHandlerRegistry();
    // mimic DefaultParameterHandler logic
    for (ParameterMapping parameterMapping : parameterMappings) {
        if (parameterMapping.getMode() != ParameterMode.OUT) {
            Object value;
            String propertyName = parameterMapping.getProperty();
            if (boundSql.hasAdditionalParameter(propertyName)) {
                value = boundSql.getAdditionalParameter(propertyName);
            } else if (parameterObject == null) {
                value = null;
            } else if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())) {
                value = parameterObject;
            } else {
                MetaObject metaObject = configuration.newMetaObject(parameterObject);
                value = metaObject.getValue(propertyName);
            }
            cacheKey.update(value);
        }
    }
    // 如果有指定environment的值，则此处也会记录(肯定有)
    if (configuration.getEnvironment() != null) {
        // issue #176
        cacheKey.update(configuration.getEnvironment().getId());
    }
    return cacheKey;
}
```

##### 2.1.1.3 query

继续往下走 `Executor` 的 `query` 方法，这个方法一进来，小伙伴是不是有一种似曾相识的感觉？对了，这就是一级缓存中我们看过的源码：

```java
public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, 
                         ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException {
    ErrorContext.instance().resource(ms.getResource()).activity("executing a query").object(ms.getId());
    if (closed) {
        throw new ExecutorException("Executor was closed.");
    }
    // 如果statement指定了需要刷新缓存，则清空一级缓存
    if (queryStack == 0 && ms.isFlushCacheRequired()) {
        clearLocalCache();
    }
    List<E> list;
    try {
        queryStack++;
        // 查询之前先检查一级缓存中是否存在数据
        list = resultHandler == null ? (List<E>) localCache.getObject(key) : null;
        if (list != null) {
            // 有，则直接取缓存
            handleLocallyCachedOutputParameters(ms, key, parameter, boundSql);
        } else {
            // 没有，则查询数据库
            list = queryFromDatabase(ms, parameter, rowBounds, resultHandler, key, boundSql);
        }
    } finally {
        queryStack--;
    }
    if (queryStack == 0) {
        // ......
        // 全局localCacheScope设置为statement，则清空一级缓存
        if (configuration.getLocalCacheScope() == LocalCacheScope.STATEMENT) {
            // issue #482
            clearLocalCache();
        }
    }
    return list;
}
```

所以具体里面都是怎么走的，一级缓存如何处理的，

##### 2.1.1.4 queryFromDatabase

```java
private <E> List<E> queryFromDatabase(MappedStatement ms, Object parameter, RowBounds rowBounds, 
        ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException {
    List<E> list;
    // 缓存占位，代表此时还没有查询到数据
    localCache.putObject(key, EXECUTION_PLACEHOLDER);
    try {
        // 执行数据库查询
        list = doQuery(ms, parameter, rowBounds, resultHandler, boundSql);
    } finally {
        localCache.removeObject(key);
    }
    // 查询结果放入缓存
    localCache.putObject(key, list);
    if (ms.getStatementType() == StatementType.CALLABLE) {
        localOutputParameterCache.putObject(key, parameter);
    }
    return list;
}
```



而真正从数据库中查询出来的那个 `list` 集合，则是走的 `doQuery` 方法：（又是 `query` → `doQuery` ）

```java
protected abstract <E> List<E> doQuery(MappedStatement ms, Object parameter, RowBounds rowBounds, 
        ResultHandler resultHandler, BoundSql boundSql) throws SQLException;
```

呦，到了这里变成抽象方法了，那我们就应该找相应的实现呀。

##### 2.1.1.5 SimpleExecutor#doQuery

上面的 `SqlSession` 创建中，我们知道一般情况下我们用的是 `SimpleExecutor` ，所以我们来到它的 `doQuery` 方法中：

```java
public <E> List<E> doQuery(MappedStatement ms, Object parameter, RowBounds rowBounds, 
        ResultHandler resultHandler, BoundSql boundSql) throws SQLException {
    // 注意这个Statement是java.sql.Statement
    Statement stmt = null;
    try {
        // 注意是Configuration不是Connection
        Configuration configuration = ms.getConfiguration();
        StatementHandler handler = 
          configuration.newStatementHandler(wrapper, ms, parameter, rowBounds, resultHandler, boundSql);
        stmt = prepareStatement(handler, ms.getStatementLog());
        return handler.query(stmt, resultHandler);
    } finally {
        closeStatement(stmt);
    }
}
```

1. 一开始在 try-catch 块上面定义的那个 `Statement` 类型的变量，是 jdbc 原生的 `Statement`
2. 下面 try-catch 块中，它会使用全局 `Configuration` 对象去创建一个 `StatementHandler`

> 这个家伙我们在插件的那一章见过它，这里我们暂且不展开聊这个 `StatementHandler` ，下一章讲解参数绑定时再聊

再往下，它会利用 `StatementHandler` ，创建出真实的 `Statement` 对象，而这个创建的过程，就会用到 `StatementHandler` 的方法了：

```java
private Statement prepareStatement(StatementHandler handler, Log statementLog) throws SQLException {
    Statement stmt;
    Connection connection = getConnection(statementLog);
    stmt = handler.prepare(connection, transaction.getTimeout());
    handler.parameterize(stmt);
    return stmt;
}
```

最后，再调用 `StatementHandler` 的 `query` 方法，真正发起查询：（一般情况下我们用的都是 `PreparedStatement` ，所以相应的 Handler 也就是 `PreparedStatementHandler` ）

```java
protected final ResultSetHandler resultSetHandler;

public <E> List<E> query(Statement statement, ResultHandler resultHandler) throws SQLException {
    PreparedStatement ps = (PreparedStatement) statement;
    ps.execute();
    return resultSetHandler.handleResultSets(ps);
}
```

注意，这里又出现了另一个 Handler ：`ResultSetHandler` ，它是用来处理结果集和封装的，

整个流程走完之后，小册贴一张 `selectList` 的整体调用时序图，方便小伙伴们快速总结。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220330210504mybatis.png)

#### 2.1.2 selectOne

对于 `selectOne` 的处理，MyBatis 可谓是深得其精髓：**先查出列表来，然后取第 0 个就完事**了。对应到源码中，它的设计如下：

```java
public <T> T selectOne(String statement, Object parameter) {
    // Popular vote was to return null on 0 results and throw exception on too many.
    List<T> list = this.selectList(statement, parameter);
    if (list.size() == 1) {
        return list.get(0);
    } else if (list.size() > 1) {
        throw new TooManyResultsException("Expected one result (or null) to be returned by selectOne(), but found: " + list.size());
    } else {
        return null;
    }
}
```

可以看到，这里 MyBatis 还多做了一点处理：如果查出来的数据超过 1 条，不会直接返回第 0 条数据，而是抛出异常。这

#### 2.1.3 selectMap

下面的几个方法是我们平时用得不多的，不过我们也可以看一下。

`selectMap` 方法相当于增强版 `selectList` ，它可以为每一条查询出来的结果提供一个可以检索的 key ，比方说这样：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220330210628mybatis.png)

上图中，我们把查询结果的 id 列作为 `Map` 的 key ，查询的一行结果数据作为 value ，就可以构造出一个基于 `Map` 的数据库查询结果集了。

下面我们看源码的实现，其实 `selectMap` 还是基于 `selectList` 来的，只是最后多了一些处理罢了：（关键注释已标注在源码）

```java
public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey, RowBounds rowBounds) {
    // 先通过selectList查到数据
    final List<? extends V> list = selectList(statement, parameter, rowBounds);
    // 借助DefaultMapResultHandler封装Map
    final DefaultMapResultHandler<K, V> mapResultHandler = new DefaultMapResultHandler<>(mapKey, 
            configuration.getObjectFactory(), configuration.getObjectWrapperFactory(), configuration.getReflectorFactory());
    final DefaultResultContext<V> context = new DefaultResultContext<>();
    // 封装Map
    for (V o : list) {
        context.nextResultObject(o);
        mapResultHandler.handleResult(context);
    }
    return mapResultHandler.getMappedResults();
}
```

我们可以来捋一下这段逻辑，它从数据库中查出数据后，会先创建两个对象：`DefaultMapResultHandler` 和 `DefaultResultContext` ，然后通过 `DefaultMapResultHandler` 的 `handleResult` 方法一步一步的封装，最后取到封装好的 `Map` 返回。这里面我们最好奇的方法肯定是 `DefaultMapResultHandler` 的了，下面我们进去看一下。

##### 2.1.3.1 DefaultMapResultHandler

`DefaultMapResultHandler` 本身的结构并不复杂，，贴出构造方法

```java
public class DefaultMapResultHandler<K, V> implements ResultHandler<V> {

    private final Map<K, V> mappedResults;
    private final String mapKey;
    private final ObjectFactory objectFactory;
    private final ObjectWrapperFactory objectWrapperFactory;
    private final ReflectorFactory reflectorFactory;

    public DefaultMapResultHandler(String mapKey, ObjectFactory objectFactory, 
            ObjectWrapperFactory objectWrapperFactory, ReflectorFactory reflectorFactory) {
        this.objectFactory = objectFactory;
        this.objectWrapperFactory = objectWrapperFactory;
        this.reflectorFactory = reflectorFactory;
        // 注意看这里
        this.mappedResults = objectFactory.create(Map.class);
        this.mapKey = mapKey;
    }
```

注意源码中构造方法的倒数第二行，它创建 `Map` 的方法是借助 `ObjectFactory` ，直接创建 `Map` 接口的实现类，这个实现类在底层的落地是 **`HashMap`** ：

```java
protected Class<?> resolveInterface(Class<?> type) {
    Class<?> classToCreate;
    if (type == List.class || type == Collection.class || type == Iterable.class) {
        classToCreate = ArrayList.class;
    } else if (type == Map.class) {
        // 看这里
        classToCreate = HashMap.class;
    } // ......
    return classToCreate;
}
```

那这就意味着一个问题：**`selectMap` 处理完成的 `Map` 数据，迭代时的顺序与 `selectList` 大概率不一致**！如果我们想让封装后的 `Map` 依然保证迭代的顺序一致性，则需要自己编写 `ObjectFactory` 的实现类 / `DefaultObjectFactory` 的子类，并重写 `resolveInterface` 方法，替换 `Map` 接口的落地实现类为 `LinkedHashMap` 。

##### 2.1.3.2 封装Map的过程

下面是封装 `Map` 的过程，其实很简单，就是从 `DefaultResultContext` 中取到正在迭代的数据，取出来，反射获取指定列（即 `mapKey` ）对应的值，并存入 `Map` 中，逻辑很简单清晰。

```java
public void handleResult(ResultContext<? extends V> context) {
    final V value = context.getResultObject();
    final MetaObject mo = MetaObject.forObject(value, objectFactory, objectWrapperFactory, reflectorFactory);
    // 反射获取指定列的值
    final K key = (K) mo.getValue(mapKey);
    mappedResults.put(key, value);
}

public Map<K, V> getMappedResults() {
    return mappedResults;
}
```

#### 2.1.4 selectCursor

`Cursor` 游标，是 MyBatis 3.4.0 新增的特性，它适合处理大数据集结果。`Cursor` 的设计本身类似于 `ResultSet` ，因为不是一次性查出放到内存，所以对内存消耗的影响也小。

`DefaultSqlSession` 中设计的 `selectCursor` 的逻辑也不复杂，它很类似于 `selectList` ：

```java
  @Override
  public <T> Cursor<T> selectCursor(String statement, Object parameter, RowBounds rowBounds) {
    try {
      MappedStatement ms = configuration.getMappedStatement(statement);
      Cursor<T> cursor = executor.queryCursor(ms, wrapCollection(parameter), rowBounds);
      // 注意此处有一个注册游标
      registerCursor(cursor);
      return cursor;
    } catch (Exception e) {
      throw ExceptionFactory.wrapException("Error querying database.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }
```

注意看上面，从数据库中查出数据，并封装为游标后，会有一个注册的动作，而这个注册的动作，在 `DefaultSqlSession` 中就是一个再简单不过的 `list` 添加：

```java
private List<Cursor<?>> cursorList;

private <T> void registerCursor(Cursor<T> cursor) {
    if (cursorList == null) {
        cursorList = new ArrayList<>();
    }
    cursorList.add(cursor);
}
```

这个时候，观察思维能力很强的小伙伴应该意识到一个问题：`cursorList` 不可能只有添加，肯定还有清除，那什么时候会清除呢？答案是在 SqlSession 关闭的时候：

```java
public void close() {
    try {
        executor.close(isCommitOrRollbackRequired(false));
        closeCursors();
        dirty = false;
    } finally {
        ErrorContext.instance().reset();
    }
}

private void closeCursors() {
    if (cursorList != null && !cursorList.isEmpty()) {
        for (Cursor<?> cursor : cursorList) {
            try {
                // 注意，此处会把游标关闭
                cursor.close();
            } catch (IOException e) {
                throw ExceptionFactory.wrapException("Error closing cursor.  Cause: " + e, e);
            }
        }
        cursorList.clear();
    }
}
```

当 `SqlSession` 关闭时，会将自身查询出来的游标也一并关闭掉，这就意味着 `SqlSession` 关闭后，我们就不能再利用那些游标，从数据库中取出数据了。

#### 2.1.5 select()

如果上面的几种方法，都不能满足我们需求的时候，我们还可以直接用 MyBatis 提供的自定义结果集封装的方法，自行处理，这个方法就是没有任何后缀的 `select` 方法：

```java
public void select(String statement, Object parameter, RowBounds rowBounds, ResultHandler handler) {
    try {
        MappedStatement ms = configuration.getMappedStatement(statement);
        executor.query(ms, wrapCollection(parameter), rowBounds, handler);
    } catch (Exception e) {
        throw ExceptionFactory.wrapException("Error querying database.  Cause: " + e, e);
    } finally {
        ErrorContext.instance().reset();
    }
}
```

注意看参数，它需要让我们自己传一个 `ResultHandler` 接口的实现类，用于封装结果集。这个 `ResultHandler` 会在`Executor` 的 `query` 方法执行，底层封装结果集时起作用，而封装结果集的动作，

### 2.2 update系列

MyBatis 认为 insert update delete 的操作，底层都是执行 DML ，所以它偷懒只在 update 方法上有实际的实现，其余的方法都是调用了它。

#### 2.2.1 update的实现

```java
public int update(String statement, Object parameter) {
    try {
        dirty = true;
        MappedStatement ms = configuration.getMappedStatement(statement);
        return executor.update(ms, wrapCollection(parameter));
    } catch (Exception e) {
        throw ExceptionFactory.wrapException("Error updating database.  Cause: " + e, e);
    } finally {
        ErrorContext.instance().reset();
    }
}

public int insert(String statement, Object parameter) {
    return update(statement, parameter);
}

public int delete(String statement, Object parameter) {
    return update(statement, parameter);
}
```

执行 `update` 方法时，首先标注当前 `SqlSession` 已经不干净了（有过 DML 操作），随后又是取出 `MappedStatement` ，并调用 `Executor` 的 `update` 方法。

#### 2.2.2 update → doUpdate

而 `Executor` 的 `update` 方法，又会调用模板方法 `doUpdate` ：

```java
public int update(MappedStatement ms, Object parameter) throws SQLException {
    ErrorContext.instance().resource(ms.getResource()).activity("executing an update").object(ms.getId());
    if (closed) {
        throw new ExecutorException("Executor was closed.");
    }
    clearLocalCache();
    return doUpdate(ms, parameter);
}
```

`doUpdate` 方法的落地实现，我们依然关注 `SimpleExecutor` ，但是我们点进来，发现好像有点似曾相识：

```java
public int doUpdate(MappedStatement ms, Object parameter) throws SQLException {
    Statement stmt = null;
    try {
        Configuration configuration = ms.getConfiguration();
        StatementHandler handler = configuration.newStatementHandler(this, ms, parameter, RowBounds.DEFAULT, null, null);
        stmt = prepareStatement(handler, ms.getStatementLog());
        return handler.update(stmt);
    } finally {
        closeStatement(stmt);
    }
}
```

跟上面的 `doQuery` 对比一下，好像就最后一步，调用 `StatementHandler` 的方法不一样吧！说明真正调用原生 jdbc 的操作，都在 `StatementHandler` 中。

#### 2.2.3 StatementHandler#update

进入到 `PreparedStatementHandler` 的 `update` 方法，可以发现它就是操作原生 jdbc ，执行 `PreparedStatement` 的 `execute` 方法，并获取 DML 的执行影响结果行数，返回。

```java
public int update(Statement statement) throws SQLException {
    PreparedStatement ps = (PreparedStatement) statement;
    ps.execute();
    int rows = ps.getUpdateCount();
    Object parameterObject = boundSql.getParameterObject();
    KeyGenerator keyGenerator = mappedStatement.getKeyGenerator();
    keyGenerator.processAfter(executor, mappedStatement, ps, parameterObject);
    return rows;
}
```

注意一点，在获取到返回行数后，MyBatis 又操作 `KeyGenerator` 执行了一个后置处理，它是用来干什么的呢？

回想一下，如果数据库表的主键采用自增主键，那是不是每次 insert 后我们都需要获取到主键值，以保证可以正常返回给客户端代码。而这个 `KeyGenerator` 的工作，就是帮我们处理自增主键并回填的。