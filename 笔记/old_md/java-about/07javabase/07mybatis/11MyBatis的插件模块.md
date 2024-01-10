---
title: 11MyBatis的插件模块
---

## 1. 插件概述

**MyBatis 的插件就是一些能拦截某些 MyBatis 核心组件方法，增强功能的拦截器**。MyBatis 允许我们在 SQL 语句执行过程中的某些点进行拦截增强，官方文档中列出了四种可供增强的切入点：

- `Executor` ( update, query, flushStatements, commit, rollback, getTransaction, close, isClosed )
- `ParameterHandler` ( getParameterObject, setParameters )
- `ResultSetHandler` ( handleResultSets, handleOutputParameters )
- `StatementHandler` ( prepare, parameterize, batch, update, query )

这些东西看上去不是很眼熟，没有关系，我们可以先来简单的解释一下它们的作用，以及拦截它们的目的。

- Executor ：我们上一章也提过了，它是执行 statement 的核心组件，它负责整体的执行把控
  拦截 Executor ，则意味着要干扰 / 增强底层执行的 CRUD 等动作
- ParameterHandler ：处理 SQL 注入参数的处理器
  拦截 ParameterHandler ，则意味着要干扰 / 增强 SQL 参数注入 / 读取的动作
- ResultSetHandler ：处理原生 jdbc 的 ResultSet 的处理器
  拦截 ResultSetHandler ，则意味着要干扰 / 增强封装结果集的动作
- StatementHandler ：处理原生 jdbc 的 Statement 的处理器
  拦截 StatementHandler ，则意味着要干扰 / 增强 Statement 的创建和执行的动作

下面的几个 Handler 相对来讲都不是那么难理解吧，它们都可以理解为是原生 jdbc 的一层包装，MyBatis 的底层执行流程中不需要单独对原生 jdbc 的 API 进行操纵，只需要运用这几个 Handler 就可以。**`Executor`** 是重中之重

## 2. 插件快速体验

我们直接创建一个 `plugin` 包，并新建一个 `CustomInterceptor` ，让它实现 `org.apache.ibatis.plugin.Interceptor` 接口：

```java
@Intercepts(@Signature(type = Executor.class, method = "update", 
                       args = {MappedStatement.class, Object.class}))
public class CustomInterceptor implements Interceptor {
  @Override
  public Object intercept(Invocation invocation) throws Throwable {
    System.out.println("CustomInterceptor intercept run ......");
    // 顺便，把这个Invocation中的东西也打印出来吧
    System.out.println(invocation.getTarget());
    System.out.println(invocation.getMethod().getName());
    System.out.println(Arrays.toString(invocation.getArgs()));
    return invocation.proceed();
  }
}
```



在类上标注一个 `@Intercepts` 注解，用于声明要拦截哪个组件的哪个方法（或者哪些组件的哪些方法）

编写好拦截器后，不要忘记将这个拦截器配置到 MyBatis 全局配置文件中：

```xml

  <plugins>
    <plugin interceptor="org.clxmm.plugin.CustomInterceptor"></plugin>
  </plugins>
```



**测试**

```java
    public static void main(String[] args) throws Exception {
        InputStream xml = Resources.getResourceAsStream("mybatis-config.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(xml);
        SqlSession sqlSession = sqlSessionFactory.openSession();
    
        DepartmentMapper departmentMapper = sqlSession.getMapper(DepartmentMapper.class);
        Department department = departmentMapper.findById("18ec781fbefd727923b0d35740b177ab");
        System.out.println(department);
        department.setName("技术开发部");
        departmentMapper.update(department);
        
        sqlSession.commit();
        sqlSession.close();
    }
```



```
Department{id='18ec781fbefd727923b0d35740b177ab', name='开发部', tel='123'}]
CustomInterceptor intercept run ......
org.apache.ibatis.executor.CachingExecutor@418e7838
update
[org.apache.ibatis.mapping.MappedStatement@61230f6a, 
Department{id='18ec781fbefd727923b0d35740b177ab', name='技术开发部', tel='123'}]
```

### 2.3 拦截query方法

```java
@Intercepts(@Signature(type = Executor.class, method = "query",
                       args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}))
public class CustomInterceptor implements Interceptor {
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        System.out.println("CustomInterceptor intercept run ......");
        System.out.println(invocation.getTarget());
        System.out.println(invocation.getMethod().getName());
        // 这里我们只关心参数内容
        System.out.println(invocation.getArgs()[1]);
        return invocation.proceed();
    }
}
```

## 3. 实战：性能分析插件

```java
@Intercepts({
  @Signature(type = StatementHandler.class, method = "query", args = {Statement.class, ResultHandler.class}),
  @Signature(type = StatementHandler.class, method = "update", args = {Statement.class})
})
```

简单说一下为什么选择拦截 `StatementHandler` 的 `update` 和 `query` 方法，**检查 SQL 的性能好不好，最好是不要带入 MyBatis 框架本身的执行逻辑耗时**，而且 `StatementHandler` 的 `update` 和 `query` 方法，在底层都有一个 `Statement` 对象的 **`execute`** 方法执行，而这个 `execute` 就是**执行 SQL** 的动作，所以拦截 `StatementHandler` 之后监控的执行时间更具有参考意义。

```java
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        System.out.println("PerformanceInterceptor intercept run ......");
        long startTime = System.currentTimeMillis();
        Object retVal = invocation.proceed();
        long endTime = System.currentTimeMillis();
        // 此处我们先写死1000ms吧
        if (endTime - startTime > 1000) {
            // 打印。。。
        }
        return retVal;
    }
```

但是怎么打印呢？这个难度有点大，因为通过 `Invocation` 取到的 `Statement` 是一个被 MyBatis 代理过的对象：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220327185427mybatis.png)

我们需要取它内部的 target ，所以这里面实现起来有一点点的别扭：

```java
public class PerformanceInterceptor implements Interceptor {

  @Override
  public Object intercept(Invocation invocation) throws Throwable {
    System.out.println("PerformanceInterceptor intercept run ......");
    long startTime = System.currentTimeMillis();
    Object retVal = invocation.proceed();
    long endTime = System.currentTimeMillis();
    // 此处我们先写死1000ms吧

    if (endTime - startTime > 10) {
      Statement statement = (Statement) invocation.getArgs()[0];
      // statement被MyBatis代理了一层，需要取到target
      Field targetField = statement.getClass().getSuperclass().getDeclaredField("h");
      targetField.setAccessible(true);
      PreparedStatementLogger target = (PreparedStatementLogger) targetField.get(statement);
      PreparedStatement preparedStatement = target.getPreparedStatement();
      String statementToString = preparedStatement.toString();
      System.out.println("发现慢SQL：" + statementToString);
      System.out.println("执行时间：" + (endTime - startTime) + "ms");
    }

    return retVal;
  }
}
```

简单解释一下为什么要这么写，要取代理对象内部的 target ，最简单的办法是使用反射获取，获取到的 target 是一个 `PreparedStatementLogger` ，它本来是一个装饰者，我们要获取到内部的 `delegate` ，也就是真正的 `PreparedStatement` ，这个 `Statement` 中就有要执行的 SQL ，直接 toString 一下就可以看到了。

> `PreparedStatement` 中有个 `originalSql` 属性存放着 SQL ，为什么不把它拿出来呢？是这样的，上面我们看到的 `JDBC42PreparedStatement` 是 **MySQL 驱动包下的**，如果回头我们换成 Oracle 或者 PostgreSQL 等其他数据库，那对应的驱动中 SQL 的属性叫什么，我们也不敢确定，总不能因为获取一个 SQL 而考虑适配所有数据库吧，这貌似划不来，所以我们直接 toString 一下就可以了。

### 3.3 测试效果

我们可以改一下慢 SQL 的时间阈值为 10ms

```
[main] DEBUG DepartmentMapper.findById  - ==>  Preparing: select * from tbl_department where id = ? 
PerformanceInterceptor intercept run ......
[main] DEBUG DepartmentMapper.findById  - ==> Parameters: 18ec781fbefd727923b0d35740b177ab(String) 
[main] DEBUG DepartmentMapper.findById  - <==      Total: 1 
发现慢SQL：com.mysql.jdbc.JDBC42PreparedStatement@3c130745: select * from tbl_department where id = '18ec781fbefd727923b0d35740b177ab'
执行时间：28ms
Department{id='18ec781fbefd727923b0d35740b177ab', name='技术开发部', tel='123'}
```



到这里我们的性能分析插件其实就算编写完了，但这里面有几个细节可以优化一下。



### 3.4 优化细节

#### 3.4.1 打印的内容

首先我们观察一下打印的内容：

```
发现慢SQL：com.mysql.jdbc.JDBC42PreparedStatement@3c130745: 
select * from tbl_department where id = '18ec781fbefd727923b0d35740b177ab'

```

很明显我们只想要最后面的 SQL 吧，前面那一堆东西我们根本不需要，所以我们可以就 `PreparedStatement` 转成 String 后再处理一下，处理的思路就是把前面的这些鬼东西去掉。

注意这里不能直接莽撞着去截字符串，因为不同的 jdbc 数据库驱动，toString 后的内容是不一样的，比方说 PostgreSQL 中的 `PreparedStatement` 打印之后的内容是没有那些乱七八糟的，直接就是 SQL ：

OK ，有了上面的分析，下面我们可以试着截一下 SQL ，那截取 SQL 的思路有很多了，可以用 `indexOf` 的方式，也可以用正则表达式直接提取，

```java
    private String getSql(String statementToString) {
        // 借助正则表达式的贪心特性，可以保证一次性取到最后
        Pattern pattern = Pattern.compile("(select |insert |update |delete ).*");
        Matcher matcher = pattern.matcher(statementToString);
        if (matcher.find()) {
            return matcher.group();
        }
        return statementToString;
    }
```

#### 3.4.2 硬编码参数

再回过头来看一下我们设定的慢 SQL 时间阈值：

```
    if (endTime - startTime > 10) {
```

这个 10 很明显被写死了，我们可以充分利用 MyBatis 给我们提供的**外部化配置**的特性，将这个 10 写到 MyBatis 全局配置文件中：

```xml
  <plugins>
    <plugin interceptor="org.clxmm.plugin.PerformanceInterceptor" >
      <property name="maxTolerate" value="10"/>
    </plugin>
  </plugins>
```

MyBatis 并不会那么智能的帮我们赋属性值，而是在 `Interceptor` 接口中预留了一个 default 的 `setProperties` 方法供我们手动赋属性值，所以我们可以重写这个方法，自己赋值：

```java
 private long maxTolerate;
  @Override
  public void setProperties(Properties properties) {
    this.maxTolerate = Long.parseLong(properties.getProperty("maxTolerate"));
  }
```

