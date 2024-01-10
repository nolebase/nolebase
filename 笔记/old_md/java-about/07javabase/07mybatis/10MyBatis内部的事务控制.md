---
title: 10MyBatis内部的事务控制
---

对于一个 Dao 层框架来讲，事务是永远避不开的话题。MyBatis 本身不是像 Hibernate 那样重度封装 jdbc 以实现近乎于全自动的框架，MyBatis 本身不算很重，所以对事务部分下的功夫相对不算很多。本章我们先看一下 MyBatis 本身的内部是如何搞定事务控制的，下一章再深入源码层面探究 MyBatis 是如何封装事务模块的。

## 1. 回顾事务控制

- **原子性**：一个事务就是一个不可再分解的单位，事务中的操作要么全部做，要么全部不做。原子性强调的是事务的**整体**
- **一致性**：事务执行后，所有的数据都应该保持一致状态。一致性强调的是数据的**完整**
- **隔离性**：多个数据库操作并发执行时，一个请求的事务操作不能被其它操作干扰，多个并发事务执行之间要相互隔离。隔离性强调的是**并发**的隔离
- **持久性**：事务执行完成后，它对数据的影响是永久性的。持久性强调的是操作的**结果**

针对数据库的并发操作，可能会出现一些事务的并发问题。事务并发操作中会出现三种问题：

 

- **脏读**：一个事务读到了另一个事务没有提交的数据

- 不可重复读

  ：一个事务读到了另一个事务已提交修改的数据

  - 对同一行数据查询两次，结果不一致

- 幻读

  ：一个事务读到了另一个事务已提交新增的数据

  - 对同一张表查询两次，出现新增的行，导致结果不一致

针对上述三个问题，由此引出了事务的隔离级别：

 

- **read uncommitted** 读未提交 —— 不解决任何问题
- **read committed** 读已提交 —— 解决脏读
- **repeatable read** 可重复读 —— 解决脏读、不可重复读
- **serializable** 可串行化 —— 解决脏读、不可重复读、幻读

四种隔离级别，自上而下级别逐级增高，但并发性能逐级降低。MySQL 中默认的事务隔离级别是 **repeatable read** ，Oracle 、PostgresSQL 的默认事务隔离级别是 **read committed** 。

对于 jdbc 的事务操作而言，无非就是**开启事务、提交事务、回滚事务**三个操作罢了，既然用了 MyBatis ，那这些操作肯定是 MyBatis 帮我们做了而已。

## 2. 快速回顾MyBatis的事务控制

其实在之前的很多案例中，我们都有意或者无意的使用到了 MyBatis 的事务控制，比方说之前写的新增、更新、删除数据：

```java
   SqlSession sqlSession = sqlSessionFactory.openSession();
    DepartmentMapper departmentMapper = sqlSession.getMapper(DepartmentMapper.class);

    Department department = departmentMapper.findById("11c8cdec37e041cf8476c86d46a42dd3");
    department.setName("测测试试");
    departmentMapper.updateById(department);

    departmentMapper.deleteById("11c8cdec37e041cf8476c86d46a42dd3");

    sqlSession.commit();
    sqlSession.close();
```

而这种写法能得以生效，主要是因为 MyBatis 全局配置文件中配置了事务管理器：

```xml
    <environments default="development">
        <environment id="development">
            <!-- 配置了事务管理器 -->
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis?characterEncoding=utf-8"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
```

### 2.1 事务管理器的类型

在 MyBatis 中有两种事务管理器：

- **JDBC** – 这个配置直接使用了 JDBC 的提交和回滚方法，它依赖从数据源获得的连接来管理事务作用域。
- **MANAGED** – 使用外置的事务管理器（如 WebLogic 、JBOSS 等），这种情况下几乎不作任何操作，只预留了是否关闭连接的配置

除此之外，MyBatis 还提供了对 SpringFramework 的支持，有关这部分内容，我们放在整合 SpringFramework 的章节再讲解。

### 2.2 SqlSession控制事务

咱们目前的重点还是基于 jdbc 的事务控制哈，MyBatis 框架帮我们做了事务控制，而最终落实的操作上还是 `SqlSession` 上的几个方法，以及由 `SqlSessionFactory` 创建 `SqlSession` 上：

```java
    SqlSession sqlSession = sqlSessionFactory.openSession();
    SqlSession sqlSessionAutoCommit = sqlSessionFactory.openSession(true);
```



注意看细节，`openSession` 方法有一个重载的可以传入 boolean 参数的方法，这个参数最终会落实到原生 jdbc 操作的如下语句：

```java
   Connection connection = DriverManager.getConnection(......);
    connection.setAutoCommit(autoCommit);
```

如果在开启新的 `SqlSession` 时，传入的 `autoCommit` 为 **true** ，那就意味着该 `SqlSession` 不参与任何事务操作了，具体我们可以简单测试一下：

```java
public static void main(String[] args) throws Exception {
        InputStream xml = Resources.getResourceAsStream("mybatis-config.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(xml);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        // 注意此处先传入false
        SqlSession sqlSession2 = sqlSessionFactory.openSession(false);
    
        DepartmentMapper departmentMapper = sqlSession.getMapper(DepartmentMapper.class);
        DepartmentMapper departmentMapper2 = sqlSession2.getMapper(DepartmentMapper.class);
    
        Department department = departmentMapper2.findById("53e3803ebbf4f97968e0253e5ad4cc83");
        // 刚查出来的数据中，name为"测试产品部"
        department.setName("测试部部");
        departmentMapper2.update(department);
    
        List<Department> departmentList = departmentMapper.findAll();
        departmentList.forEach(System.out::println);
        
        sqlSession.close();
        sqlSession2.close();
    }
```

如上述代码所示，`sqlSession` 是带事务的，根据 MySQL 的默认事务隔离级别 **repeatable read** ，它应该读不到其它事务修改的数据，而此 `sqlSession2` 传入了 **false** ，代表着它也开启了事务，那下面 `departmentMapper2` 更新部门信息时， `departmentMapper` 查出来的数据就应该是修改之前的 “测试产品部” 。我们运行 `main` 方法，观察控制台的数据打印：

```java
Department{id='00000000000000000000000000000000', name='全部部门', tel='-'}
Department{id='18ec781fbefd727923b0d35740b177ab', name='开发部', tel='123'}
Department{id='53e3803ebbf4f97968e0253e5ad4cc83', name='测试产品部', tel='789'}
Department{id='ee0e342201004c1721e69a99ac0dc0df', name='运维部', tel='456'}
```

果然是可重复读，`sqlSession2` 的事务中修改没有丝毫干扰到 `sqlSession` 。

接下来，我们把上面 `sqlSession2` 的开启中，参数改为 **true** ，这样就意味着查询也好、修改也好，都不在事务中操作了，这次我们再观察运行结果：（已提前把数据库的数据改回了 “测试产品部” ）

```
Department{id='00000000000000000000000000000000', name='全部部门', tel='-'}
Department{id='18ec781fbefd727923b0d35740b177ab', name='开发部', tel='123'}
Department{id='53e3803ebbf4f97968e0253e5ad4cc83', name='测试部部', tel='789'}
Department{id='ee0e342201004c1721e69a99ac0dc0df', name='运维部', tel='456'}
```

可见这样操作之后，`sqlSession` 可以查询到修改之后的数据了。



# MyBatis事务控制的模型与设计

## 1. 从environments标签解析开始说起

乍一看，好像我们不是很好下手去探究，那就不妨从 MyBatis 的全局配置文件开始吧。MyBatis 全局配置文件中，解析 `<environments>` 标签时会处理 `<transactionManager>` 子标签：（已省略掉大部分无关源码）

```java
private void environmentsElement(XNode context) throws Exception {
    if (context != null) {
        // ......
            // 只会构造默认的数据库环境配置
            if (isSpecifiedEnvironment(id)) {
                // 解析transactionManager标签，生成TransactionFactory
                TransactionFactory txFactory = transactionManagerElement(child.evalNode("transactionManager"));
                // ......
    }
}
```

这里会直接解析 `<transactionManager>` 标签，并生成 `TransactionFactory` 对象。我们先不去探究方法的实现，先搞明白 TransactionFactory 是个什么东西吧。

### 1.1 TransactionFactory与Transaction

还记得之前在 MyBatis 全局配置文件中提到的 `ObjectFactory` 吗？它是用来创建结果集模型对象的工厂，那自然 `TransactionFactory` 的含义也就很好理解了：它是**创建具体事务的工厂**咯。

#### 1.1.1 接口定义

这个接口的方法定义非常简单：

```java
public interface TransactionFactory {
    default void setProperties(Properties props) {
        // NOP
    }
    Transaction newTransaction(Connection conn);
    Transaction newTransaction(DataSource dataSource, TransactionIsolationLevel level, boolean autoCommit);
}
```

刨去上面的空方法不看，合着它就一个方法：**开启新的事务**，方法的返回值是一个 **`Transaction`** 对象。正好我们都看到另一个核心接口了，那就捎带着看看 `Transaction` 接口的方法定义吧：

```java
public interface Transaction {
    Connection getConnection() throws SQLException;
    void commit() throws SQLException;
    void rollback() throws SQLException;
    void close() throws SQLException;
    Integer getTimeout() throws SQLException;
}
```

可以发现，一个事务应该有的方法，在这里面统统包含了。

> 这不跟 **`PlatformTransactionManager`** 和 **`TransactionStatus`** 有些类似吗？哎没错，是有点类似的，只不过 MyBatis 做的只是单个事务的控制，并没有像 SpringFramework 那样划分的更细致

#### 1.1.2 具体实现

针对 MyBatis 本身内置的两种事务管理器 **JDBC** 和 **MANAGED** ，MyBatis 分别有对应的两个落地实现：`JdbcTransactionFactory` 和 `ManagedTransactionFactory` 。而两个事务管理器的本质区别，就是创建出来的 Transaction 的实现类对象不同：

```java
// JdbcTransactionFactory
public Transaction newTransaction(Connection conn) {
    return new JdbcTransaction(conn);
}

// ManagedTransactionFactory
public Transaction newTransaction(Connection conn) {
    return new ManagedTransaction(conn, closeConnection);
}
```

##### 1.1.2.1 JdbcTransaction

基于 jdbc 的事务模型，那它其实就应该是 `Connection` 套层壳了，看似神秘，实则相当的朴实无华：

```java
public Connection getConnection() throws SQLException {
    if (connection == null) {
        openConnection();
    }
    return connection;
}

@Override
public void commit() throws SQLException {
    if (connection != null && !connection.getAutoCommit()) {
        connection.commit();
    }
}

@Override
public void rollback() throws SQLException {
    if (connection != null && !connection.getAutoCommit()) {
        connection.rollback();
    }
}

@Override
public void close() throws SQLException {
    if (connection != null) {
        resetAutoCommit();
        connection.close();
    }
}

```

具体这些方法会在什么时机下触发，我们下面马上就会研究。

##### 1.1.2.2 ManagedTransaction

MANAGED 类型的事务几乎不会有任何操作，所以看一下它的方法实现，简直是简单的不要再简单：

```java
@Override
public void commit() throws SQLException {
    // Does nothing
}

@Override
public void rollback() throws SQLException {
    // Does nothing
}

@Override
public void close() throws SQLException {
    if (this.closeConnection && this.connection != null) {
        this.connection.close();
    }
}

protected void openConnection() throws SQLException {
    this.connection = this.dataSource.getConnection();
    if (this.level != null) {
        this.connection.setTransactionIsolation(this.level.getLevel());
    }
}
```

除了控制一下 `Connection` 要不要关闭，其余的活你是一点也不干了啊！不过人家这么干也是合理的，你都让人家外置的事务管理器控制了，那 MyBatis 理所应当的就不应该管了。

### 1.2 解析transactionManager标签

了解了 MyBatis 封装的这两个事务核心 API ，下面我们就看看解析全局配置文件中的 `<transactionManager>` 标签逻辑：

```java
  // 解析transactionManager标签
  private TransactionFactory transactionManagerElement(XNode context) throws Exception {
    if (context != null) {
      // 取出配置的事务管理器类型
      String type = context.getStringAttribute("type");
      Properties props = context.getChildrenAsProperties();
      // 解析类型，并调用默认无参构造器创建对象
      TransactionFactory factory =
        (TransactionFactory) resolveClass(type).getDeclaredConstructor().newInstance();
      factory.setProperties(props);
      return factory;
    }
    throw new BuilderException("Environment declaration requires a TransactionFactory.");
  }

```

可见这个逻辑是非常简单的哈，它会读取到 MyBatis 全局配置文件中配置好的事务管理器类型，之后解析类型，调用默认的无参构造器创建出对象，完事。

## 2. 事务的作用位置

了解了 `TransactionFactory` 和 `Transaction` 的设计，下面我们再回到测试代码的开始，我们看看 `TransactionFactory` 是在什么位置起的作用，以及事务控制都是在哪里调用的。

### 2.1 开启SqlSession

之前写的测试代码中，我们都是使用默认的 `openSession` 开启新的 `SqlSession` ，而这个 `openSession` 会调用到下面的一个 `openSessionFromDataSource` 方法：

```java
  public SqlSession openSession() {
    return openSessionFromDataSource(configuration.getDefaultExecutorType(), null, false);
  }

  private SqlSession openSessionFromDataSource(ExecutorType execType, 
                                               TransactionIsolationLevel level, boolean autoCommit) {
    Transaction tx = null;
    try {
      final Environment environment = configuration.getEnvironment();
      final TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);
      // 此处创建新的事务
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

注意观察 try 块的逻辑，开启事务的步骤是先获取**当前 `Environment` → 事务管理器 → 事务**，事务信息也在这里被创建了。

注意，创建出来的事务传入 `Executor` 对象了，它就是实际负责执行 statement 的核心组件，非常重要，后面我们在生命周期中会详细讲解它，这里我们先混个脸熟就行。

### 2.2 提交/回滚

`SqlSession` 的提交或回滚，最终还是调用到 `Executor` 了，我们直接来到 `Executor` 的实现父类 `BaseExecutor` 中看一下它的逻辑：

```java
protected Transaction transaction;

@Override
public void commit(boolean required) throws SQLException {
    // ......
    if (required) {
        // 此处提交事务
        transaction.commit();
    }
}

@Override
public void rollback(boolean required) throws SQLException {
    if (!closed) {
        try {
            clearLocalCache();
            flushStatements(true);
        } finally {
            if (required) {
                // 此处回滚事务
                transaction.rollback();
            }
        }
    }
}
```

可以发现，在 `commit` 和 `rollback` 中都有对应的事务操作，非常简单。

