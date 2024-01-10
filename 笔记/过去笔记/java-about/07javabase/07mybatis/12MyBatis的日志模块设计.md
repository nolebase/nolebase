---
title: 12MyBatis的日志模块设计
---

## 1. 日志与日志框架

Java 中比较常见的日志框架，就目前而言有 `Log4j` 、`Log4j2` 、`commons-logging` 、`java.util.logging` 、`Logback` 等等，还有一个专门的日志抽象 **`slf4j`** ，我们之前编码的所有项目，都是用 Log4j 实现的，但大家不可能只用 Log4j ，肯定还有用其他框架的伙伴们，所以 MyBatis 如何针对这些日志的实现，做统一整合，这是个问题。

## 2. 日志适配器

MyBatis 解决多种日志框架统一整合的方案，是使用适配器模式解决。我们先回顾一下适配器模式吧。

### 2.1 适配器模式

**适配器**的主要目的，是**为了解决由于接口不兼容导致某些组件无法直接使用的问题**。举个最简单的例子，我们国家使用的家用交流电，都是 220V 的，但北美等地区的国家，使用的电压都是 110V 的，这种情况下我们的一些电器就没有办法正常使用了，解决的办法就是在电源接口与电器之间接入一个电源适配器，有了它，无论外头是 220V 还是 110V ，通过电源适配器之后都可以转换为电器所需要的电压（比方说笔记本电脑的电源）。

反映到程序的代码中，适配器解决的场景，一般是我们**要面对几个具有相同 / 相似功能，但操作它们的 API 各不相同时，可以借助适配器的思路做一层统一封装**，这样我们客户端只需要调用适配器即可，至于适配器的内部如何调用具体的那些 API ，我们不需要关心。

### 2.2 MyBatis中的设计

MyBatis 中设计的日志适配器，就是按照上面分析的思路而设计好的，通过预先定义好的一些适配器，就可以针对不同的日志框架，采取对应的适配器，而这些适配器都实现了某一个特性的接口（ `org.apache.ibatis.logging.Log` ），这样 MyBatis 只需要调用 `Log` 接口的方法，而不需要关注实际的适配器实现（这样也就体现了**开放封闭原则**和**依赖倒转原则**）。

#### 2.2.1 日志框架的自动选择机制

具体来看，MyBatis 在适配日志框架时，考虑到约定大于配置的设计，于是它定义了一个规则，默认情况下 MyBatis 会自上而下扫描 classpath 下是否依赖了这些日志框架，如果有，则直接应用：

- SLF4J
- Apache Commons Logging
- Log4j2
- Log4j
- java.util.logging

所以如果我们的 classpath 下同时依赖了 Slf4j 和 Log4j 时，如果没有显式的在 MyBatis 全局配置文件中配置，则 Slf4j 生效，Log4j 不生效。

> 之所以提这一点，MyBatis 官方文档中是有特意强调的：不少应用服务器（如 Tomcat 和 WebShpere）的类路径中已经包含 Apache Commons Logging。注意，在这种配置环境下，MyBatis 会把 Commons Logging 作为日志工具，所以 Log4j 会失效。如果想强制使用 Log4j ，则需要在 MyBatis 全局配置文件中定义：
>
> ```xml
> <settings>
>         <setting name="logImpl" value="LOG4J"/>
> </settings>
> ```

#### 2.2.2 MyBatis支持的日志框架

还记得 `BaseBuilder` 吗？它是构建 MyBatis 全局配置、mapper 、statement 等等建造器的顶级父类，它里面组合了一个 `TypeAliasRegistry` ，而这个 `TypeAliasRegistry` 里面定义了默认的别名，所以我们只需要看这里面有哪些关于日志的适配器别名，那么对应支持的日志框架就应该有哪些。

跳转到 `Configuration` 的构造器中，可以找到对应的这段源码：

```java
    typeAliasRegistry.registerAlias("SLF4J", Slf4jImpl.class);
    typeAliasRegistry.registerAlias("COMMONS_LOGGING", JakartaCommonsLoggingImpl.class);
    typeAliasRegistry.registerAlias("LOG4J", Log4jImpl.class);
    typeAliasRegistry.registerAlias("LOG4J2", Log4j2Impl.class);
    typeAliasRegistry.registerAlias("JDK_LOGGING", Jdk14LoggingImpl.class);
    // 控制台日志打印
    typeAliasRegistry.registerAlias("STDOUT_LOGGING", StdOutImpl.class);
    // 不打印日志
    typeAliasRegistry.registerAlias("NO_LOGGING", NoLoggingImpl.class);
```

可以发现，除了上面列出来的那 5 种，它还支持了基于控制台的日志打印，还可以不启用日志。所以我们在 MyBatis 全局配置文件中配置日志实现的时候，就可以使用上面的别名。当然如果上面的框架无法满足需求的话，也自己实现，并配置别名。

#### 2.3.1 显式配置了日志实现

如果我们有在 MyBatis 全局配置文件中显式的指定了日志实现，那么在解析全局配置文件的逻辑中有这样一个方法：

XMLConfigBuilder

```java
private void parseConfiguration(XNode root) {
    try {
        // ......
        loadCustomLogImpl(settings);
        // ......
}
```

它负责加载自定义的日志实现，我们进来看一下实现：

```java
  // 处理Log组件配置
  private void loadCustomLogImpl(Properties props) {
    // BaseBuilder.resolveClass
    Class<? extends Log> logImpl = resolveClass(props.getProperty("logImpl"));
    configuration.setLogImpl(logImpl);
  }

  public void setLogImpl(Class<? extends Log> logImpl) {
    if (logImpl != null) {
      this.logImpl = logImpl;
      LogFactory.useCustomLogging(this.logImpl);
    }
  }
```

可以发现这个套路我们很熟悉呀，先根据配置的别名，解析出对应的全限定类名，之后设置到 `LogFactory` 中。这个 `LogFactory` 过会就可以根据这个日志适配器的 `Class` ，创建出对象来。

如果没有指定日志实现的话，上面的逻辑就不会走了，此时初始化的逻辑就来到了 `LogFactory` 的静态代码块中：

```java
static {
    tryImplementation(LogFactory::useSlf4jLogging);
    tryImplementation(LogFactory::useCommonsLogging);
    tryImplementation(LogFactory::useLog4J2Logging);
    tryImplementation(LogFactory::useLog4JLogging);
    tryImplementation(LogFactory::useJdkLogging);
    tryImplementation(LogFactory::useNoLogging);
}

public static synchronized void useLog4JLogging() {
    setImplementation(org.apache.ibatis.logging.log4j.Log4jImpl.class);
}
```

可以发现，这个推断的逻辑未免也太朴实无华了，真就挨个试呗？而且挨个试，都是拿着日志适配器的 `Class` 对象去试。那从上到下早晚能找出一个能用的（实在不能用，那就不启用日志了呗），自然也就能实现日志适配器的初始化了。

#### 2.3.3 初始化日志适配器

设置好日志适配器的实现之后，每次需要 `getLogger` 的时候，`LogFactory` 都会反射实例化一个适配器对象出来，

```java
public static Log getLog(Class<?> clazz) {
    return getLog(clazz.getName());
}

public static Log getLog(String logger) {
    try {
        return logConstructor.newInstance(logger);
    } catch (Throwable t) {
        throw new LogException("Error creating logger for logger " + logger + ".  Cause: " + t, t);
    }
}
```

## 3. Logger增强类

除了上面的普通日志打印之外，还记得上一章我们看到过的 `PreparedStatementLogger` 吗？它是代理了 `PreparedStatement` 并且附带了日志打印的一个增强器。

### 3.1 PreparedStatementLogger

其实通过源码，我们能发现这个家伙其实是一个 `InvocationHandler` ：

```java
public final class PreparedStatementLogger extends BaseJdbcLogger implements InvocationHandler {
```

难怪我们上一章看到的那家伙是个代理对象，就是被它整的！它代理原有的 `PreparedStatement` ，目的肯定很明确，它就是负责在执行 `PreparedStatement` 的方法前后打印一些日志咯，通过核心的 `invoke` 方法也能找到根据：

```java
@Override
public Object invoke(Object proxy, Method method, Object[] params) throws Throwable {
    try {
        if (Object.class.equals(method.getDeclaringClass())) {
            return method.invoke(this, params);
        }
        if (EXECUTE_METHODS.contains(method.getName())) {
            // 此处有打印日志的动作
            if (isDebugEnabled()) {
                debug("Parameters: " + getParameterValueString(), true);
            }
            // ......
```

那它是在哪里创建的代理对象呢？下面有个静态的 `newInstance` 方法：

```java
public static PreparedStatement newInstance(PreparedStatement stmt, Log statementLog, int queryStack) {
    InvocationHandler handler = new PreparedStatementLogger(stmt, statementLog, queryStack);
    ClassLoader cl = PreparedStatement.class.getClassLoader();
    return (PreparedStatement) Proxy
      .newProxyInstance(cl, new Class[]{PreparedStatement.class, CallableStatement.class}, handler);
}
```

可以看到，非常朴实无华的 `Proxy.newProxyInstance` 动作，就把原有的 `PreparedStatement` 给增强了。

### 3.2 ConnectionLogger

问题继续往下延伸，`PreparedStatement` 通常都是由 `Connection` 的对象，调用 `prepareStatement` 方法构建出来的，那原生的 `Connection` 如何创建出带有日志增强的 `PreparedStatement` 呢？

两种方案，要么原生 `Connection` 创建出来之后，由 MyBatis 自己创建代理，要么就在 `Connection` 的开启阶段，就给予一次增强，也就是所谓的 `ConnectionLogger` ，MyBatis 选择了第二种，它使用 `ConnectionLogger` 代理了原有的 `Connection` ，并拦截了 `prepareStatement` 和 `createStatement` 方法，以达到创建带有日志打印的 `PreparedStatementLogger` 增强代理对象：

```java
@Override
public Object invoke(Object proxy, Method method, Object[] params)
    throws Throwable {
    try {
        if (Object.class.equals(method.getDeclaringClass())) {
            return method.invoke(this, params);
        }
        if ("prepareStatement".equals(method.getName()) || "prepareCall".equals(method.getName())) {
            // 此处也有打印日志的动作
            if (isDebugEnabled()) {
                debug(" Preparing: " + removeExtraWhitespace((String) params[0]), true);
            }
            PreparedStatement stmt = (PreparedStatement) method.invoke(connection, params);
            stmt = PreparedStatementLogger.newInstance(stmt, statementLog, queryStack);
            return stmt;
        } else if ("createStatement".equals(method.getName())) {
            Statement stmt = (Statement) method.invoke(connection, params);
            stmt = StatementLogger.newInstance(stmt, statementLog, queryStack);
            return stmt;
        } else {
            return method.invoke(connection, params);
        }
    } catch (Throwable t) {
        throw ExceptionUtil.unwrapThrowable(t);
    }
}
```

相应的，它也有自己的 `newInstance` 方法，逻辑与上面的 `PreparedStatement` 同理：

```java
public static Connection newInstance(Connection conn, Log statementLog, int queryStack) {
    InvocationHandler handler = new ConnectionLogger(conn, statementLog, queryStack);
    ClassLoader cl = Connection.class.getClassLoader();
    return (Connection) Proxy.newProxyInstance(cl, new Class[]{Connection.class}, handler);
}
```

那最后一个问题就来了：`ConnectionLogger` 又是何时创建的呢？很简单，那就是获取 `Connection` 时一并创建了：

```java
protected Connection getConnection(Log statementLog) throws SQLException {
    Connection connection = transaction.getConnection();
    // 日志级别为Debug或更低，则创建日志代理
    if (statementLog.isDebugEnabled()) {
        return ConnectionLogger.newInstance(connection, statementLog, queryStack);
    } else {
        return connection;
    }
}
```

同理，`ResultSetLogger` 也是一样的套路，小册也就不再拿出来啰嗦了。

