---
title: 02mybatis全局文件加载
--- 

代码的调试，我们可以使用上一章的任意一个测试代码作为 Debug 载体，本章我们研究的其实是这两句代码：

```java
    InputStream xml = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(xml);
```

也就是如何加载 MyBatis 全局配置文件，以及如何由全局配置文件构建出 `SqlSessionFactory` 。

## 1. 全局配置文件的加载

首先我们来看配置文件的加载，这个 `Resources.getResourceAsStream` 方法，只从方法名上，想必小伙伴也能猜出来，它应该是借助类加载器吧，我们快速的看一眼源码：

```java
public static InputStream getResourceAsStream(String resource) throws IOException {
  return getResourceAsStream(null, resource);
}

public static InputStream getResourceAsStream(
  ClassLoader loader, String resource) throws IOException {
  InputStream in = 
    classLoaderWrapper.getResourceAsStream(resource, loader);
  if (in == null) {
    throw new IOException("Could not find resource " + resource);
  }
  return in;
}
```

这个地方看上去没有传入 `ClassLoader` ，实际上取 `ClassLoader` 的地方在另外一个位置：

`ClassLoaderWrapper.java`

```java


  public InputStream getResourceAsStream(String resource, ClassLoader classLoader) {
    return getResourceAsStream(resource, getClassLoaders(classLoader));
  }

  ClassLoader[] getClassLoaders(ClassLoader classLoader) {
    return new ClassLoader[]{
        classLoader,
        defaultClassLoader,
        Thread.currentThread().getContextClassLoader(),
        getClass().getClassLoader(),
        systemClassLoader};
  }
```

一下子取这么多 `ClassLoader` ，图个啥咧？很明显，它是**想挨个 `ClassLoader` 都试一遍，只要能取到资源，就 OK** 。下面是实际利用 `ClassLoader` 加载全局配置文件的底层源码：

```java
InputStream getResourceAsStream(String resource, ClassLoader[] classLoader) {
    for (ClassLoader cl : classLoader) {
        if (null != cl) {
            // try to find the resource as passed
            InputStream returnValue = cl.getResourceAsStream(resource);
            // now, some class loaders want this leading "/", 
          so we'll add it and try again if we didn't find the resource
            if (null == returnValue) {
                returnValue = cl.getResourceAsStream("/" + resource);
            }
            if (null != returnValue) {
                return returnValue;
            }
        }
    }
    return null;
}
```

逻辑很清晰吧，所以使用这种方式，就可以很简单的获取到全局配置文件的二进制流了。

## 2. 解析配置文件

下面就是解析的过程了，我们的测试代码是直接 new 了一个 `SqlSessionFactoryBuilder` ，随后调 `build` 方法构造出 `SqlSessionFactory` ：

```java
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(xml);
```

而 `build` 方法最终来到了一个三参数的重载方法中：

```java
public SqlSessionFactory build(InputStream inputStream) {
    return build(inputStream, null, null);
}

public SqlSessionFactory build(InputStream inputStream, String environment, Properties properties) {
    try {
        XMLConfigBuilder parser = new XMLConfigBuilder(inputStream, environment, properties);
        return build(parser.parse());
    } // catch finally ......
}
```

可见，这里面用到的第一个底层核心组件，是 **`XMLConfigBuilder`** ，直译为**基于 xml 的配置建造器**（建造器模式的体现）。而这个 `XMLConfigBuilder` ，首先继承了一个叫 **`BaseBuilder`** 的东西：

```java
public class XMLConfigBuilder extends BaseBuilder {
    // ......
}
```

我们先来研究这两个类的构造。

### 2.1 BaseBuilder

`BaseBuilder` 顾名思义，它是一个基础的构造器，它的初始化需要传入 MyBatis 的全局配置对象 `Configuration` ：

```java
public abstract class BaseBuilder {
  protected final Configuration configuration;
  protected final TypeAliasRegistry typeAliasRegistry;
  protected final TypeHandlerRegistry typeHandlerRegistry;

  public BaseBuilder(Configuration configuration) {
    this.configuration = configuration;
    this.typeAliasRegistry = this.configuration.getTypeAliasRegistry();
    this.typeHandlerRegistry = this.configuration.getTypeHandlerRegistry();
  }
}
```

这个 `Configuration` 我们都知道，最终 MyBatis 初始化完成后，所有的配置项、Mapper 、statement 都会存放到这里，小伙伴们能回忆起来就 OK 。

往下大致扫一眼定义的方法，大多数都是一些解析、获取之类的方法，看上去更像是**提供基础的工具类方法支撑**：（下面是引用的 `BaseBuilder` 中定义的两个方法）

```java
protected Boolean booleanValueOf(String value, Boolean defaultValue) {
    return value == null ? defaultValue : Boolean.valueOf(value);
}

protected JdbcType resolveJdbcType(String alias) {
    if (alias == null) {
        return null;
    }
    try {
        return JdbcType.valueOf(alias);
    } catch (IllegalArgumentException e) {
        throw new BuilderException("Error resolving JdbcType. Cause: " + e, e);
    }
}
```

那照这样来看，核心的处理逻辑并不在 `BaseBuilder` 中，我们回到实现类 `XMLConfigBuilder` 中。

### 2.2 XMLConfigBuilder

照例，我们还是先看一眼内部成员，以及构造方法的定义。

### 2.2.1 构造方法定义

```java
public class XMLConfigBuilder extends BaseBuilder {

    private boolean parsed;
    private final XPathParser parser;
    private String environment;
    private final ReflectorFactory localReflectorFactory = new DefaultReflectorFactory();
    
    public XMLConfigBuilder(InputStream inputStream, String environment, Properties props) {
        // 注意这里new了一个XPathParser
        this(new XPathParser(inputStream, true, props, new XMLMapperEntityResolver()), environment, props);
    }

    private XMLConfigBuilder(XPathParser parser, String environment, Properties props) {
        super(new Configuration());
        ErrorContext.instance().resource("SQL Mapper Configuration");
        this.configuration.setVariables(props);
        this.parsed = false;
        this.environment = environment;
        this.parser = parser;
    }
```

源码中的构造方法重载的特别多，而上面在 `SqlSessionFactoryBuilder` 中调用的 `build` 方法，最终是调用的上面代码中的三参数构造方法，这个构造方法又调用了下面重载的构造方法。注意源码中，它重载的构造方法不再需要 `InputStream` ，而是构造了一个 **`XPathParser`** ，这个家伙虽然我们也没见过，但也能大概猜出来，它就是**解析 xml 全局配置文件的解析器**，这个东西我们没有必要先去研究，到下面用到的时候再顺道着看就 OK 。

另外，最下面的构造方法中，可以发现 `Configuration` 对象是在这里 new 出来的，而且是非常朴实无华的、用空参构造方法 new 出来，所以各位小伙伴可以先了解一个事情：如果真要我们自己去操作，去初始化 MyBatis 的 `Configuration` ，也不是不行，我们自己操作都无所谓。

其余的，最下面的构造方法中，都是普通的赋值操作，也没什么好说的。

### 2.2.2 核心parse方法

接下来的代码就是 `return build(parser.parse());` 了，这一行代码实际上是两个方法，首先它先调用 `XMLConfigBuilder` 的 `parse` 方法，生成 `Configuration` ，之后才是 `SqlSessionFactoryBuilder` 的 `build` 方法。我们先来看 `XMLConfigBuilder` 是如何解析配置文件的。

```java
  public Configuration parse() {
    if (parsed) {
      throw new BuilderException("Each XMLConfigBuilder can only be used once.");
    }
    parsed = true;
    parseConfiguration(parser.evalNode("/configuration"));
    return configuration;
  }
```

最核心的方法还是中间的 `parseConfiguration` 方法，不过在此之前，我们关注一下 `parser.evalNode("/configuration")` 这个动作。

### 2.2.2.1 XPathParser#evalNode

`XPathParser` 的作用就是将 xml 配置文件转为 `Document` 对象，并提供对应的 xml 标签节点。它的 `evalNode` 方法，就是用来获取 xml 中指定的标签：

```java
public XNode evalNode(String expression) {
    return evalNode(document, expression);
}

public XNode evalNode(Object root, String expression) {
    Node node = (Node) evaluate(expression, root, XPathConstants.NODE);
    if (node == null) {
        return null;
    }
    return new XNode(this, node, variables);
}

private Object evaluate(String expression, Object root, QName returnType) {
    try {
        // 使用javax的XPath解析xml
        return xpath.evaluate(expression, root, returnType);
    } catch (Exception e) {
        throw new BuilderException("Error evaluating XPath.  Cause: " + e, e);
    }
}
```

### 2.2.2.2 Node封装为XNode的意图

注意看 `XNode` 的构造方法，它额外传入了一个 `variables` 对象，而这个 `variables` 实际上就是我们在全局配置文件中，定义的那些 `<properties>` 标签，以及引入的 `.properties` 文件。可为什么又跟这些配置属性值牵扯上了呢？我们回忆一下，之前我们在全局配置文件中写过这样的代码吧：

```xml
<environments default="development">
    <environment id="development">
        <transactionManager type="JDBC"/>
        <dataSource type="POOLED">
            <property name="driver" value="${jdbc.driverClassName}"/>
            <property name="url" value="${jdbc.url}"/>
            <property name="username" value="${jdbc.username}"/>
            <property name="password" value="${jdbc.password}"/>
        </dataSource>
    </environment>
</environments>
```



如果真的要取这里面的 driver 属性，肯定不能把 `${jdbc.driverClassName}` 拿出来吧，得动态替换配置属性的值。但是 javax 原生的 `Node` 可实现不了这玩意，所以 MyBatis 就基于 javax 的 `Node` 封装了一个 `XNode` ，并组合 `XPathParser` ，就可以实现动态解析配置属性值的效果了。

> 可能这样解释的话，很多小伙伴会一脸茫然，小册举个例子。
>
> 以上面的 xml 为例，当我们取到 `<dataSource>` 标签后，要解析其中的 `driver` 、`url` 等属性，而这些属性的 value 是一些占位符，在解析的时候，MyBatis 会先跟平常一样，解析出 `<property>` 标签，然后获取 value 属性（比方说解析 `driver` 属性吧，这样返回的 value 是 `${jdbc.driverClassName}` ），然后！它会使用一个**占位符解析器**，去解析一下这个占位符，并根据 `properties>` 标签中定义 / 加载的配置属性，替换为对应的属性值。通过这个步骤，`${jdbc.driverClassName}` 就被替换为了 `com.mysql.jdbc.Driver` ，这样也就实现了**动态配置属性值的解析**。

这样解释一下之后是不是就好理解一些了呢？下面我们再来看源码：

```java
// XNode
public String evalString(String expression) {
    // 自己不解析，委托XPathParser去解析
    return xpathParser.evalString(node, expression);
}

// XPathParser
public String evalString(Object root, String expression) {
    // 先从标签中取出明文属性值
    String result = (String) evaluate(expression, root, XPathConstants.STRING);
    // 交由占位服务解析器，处理占位符，替换为真实配置值
    result = PropertyParser.parse(result, variables);
    return result;
}
```

## 2.3 parseConfiguration

回到上面的 `parse` 方法中，`parse` 方法的本质，是解析 `<configuration>` 标签的内容，所以下面我们进入 `parseConfiguration` 方法中：	

```java
  private void parseConfiguration(XNode root) {
    try {
      //issue #117 read properties first
      propertiesElement(root.evalNode("properties"));
      Properties settings = settingsAsProperties(root.evalNode("settings"));
      loadCustomVfs(settings);
      loadCustomLogImpl(settings);
      typeAliasesElement(root.evalNode("typeAliases"));
      pluginElement(root.evalNode("plugins"));
      objectFactoryElement(root.evalNode("objectFactory"));
      objectWrapperFactoryElement(root.evalNode("objectWrapperFactory"));
      reflectorFactoryElement(root.evalNode("reflectorFactory"));
      settingsElement(settings);
      // read it after objectFactory and objectWrapperFactory issue #631
      environmentsElement(root.evalNode("environments"));
      databaseIdProviderElement(root.evalNode("databaseIdProvider"));
      typeHandlerElement(root.evalNode("typeHandlers"));
      mapperElement(root.evalNode("mappers"));
    } catch (Exception e) {
      throw new BuilderException("Error parsing SQL Mapper Configuration. Cause: " + e, e);
    }
  }
```

就是把整个 MyBatis 全局配置文件，从头到尾顺序解析了一遍

### 1 propertiesElement-解析properties

首先解析的是 `<properties>` 标签，这里面它就会解析内部定义的 `<property>` ，以及配置的 `resource` 、`url` 属性：（关键注释已标注在源码中）

```java
private void propertiesElement(XNode context) throws Exception {
  if (context != null) {
    // 先加载内部定义的<property>
    Properties defaults = context.getChildrenAsProperties();
    String resource = context.getStringAttribute("resource");
    String url = context.getStringAttribute("url");
    // 二者不可兼得
    if (resource != null && url != null) {
      throw new BuilderException("The properties element cannot specify both a URL and a 
                                 resource based property file reference.  Please specify one or the other.");
    }
    if (resource != null) {
      defaults.putAll(Resources.getResourceAsProperties(resource));
    } else if (url != null) {
      defaults.putAll(Resources.getUrlAsProperties(url));
    }
    // 编程式加载的配置属性值
    Properties vars = configuration.getVariables();
    if (vars != null) {
      defaults.putAll(vars);
    }
    // 将配置属性值放入解析器、全局配置中
    parser.setVariables(defaults);
    configuration.setVariables(defaults);
  }
}
```

**编程式的最高，properties 文件次之，配置文件内定义的最低**了。

### 2 settingsAsProperties-加载配置项

下面是解析 `<settings>` 标签了，这个标签的解析涉及到 3 行代码：

```java
 Properties settings = settingsAsProperties(root.evalNode("settings"));
loadCustomVfs(settings);
loadCustomLogImpl(settings);
```

也不难理解，这个操作很明显是将 `<settings>` 标签中的一行行配置，封装为一个 `Properties` ，然后额外处理一下 VFS 和 Log 组件。关于 VFS 的内容小册暂时不提，我们先来看看底层如何处理 Log 组件的配置：

```java
// 处理Log组件配置
private void loadCustomLogImpl(Properties props) {
  Class<? extends Log> logImpl = resolveClass(props.getProperty("logImpl"));
  configuration.setLogImpl(logImpl);
}
```

这么简单的逻辑吗？它直接从配置中取到 `logImpl` 的配置值，然后设置到 `Configuration` 中就完事了，而这个 `resolveClass` 方法，其实是用别名解析的：

```java
// BaseBuilder
protected <T> Class<? extends T> resolveClass(String alias) {
    if (alias == null) {
        return null;
    }
    try {
        return resolveAlias(alias);
    } // catch ......
}

protected <T> Class<? extends T> resolveAlias(String alias) {
    return typeAliasRegistry.resolveAlias(alias);
}
```

而这些别名的注册，早在 `Configuration` 创建的时候，就全部初始化好了：

```java
public Configuration() {
    typeAliasRegistry.registerAlias("JDBC", JdbcTransactionFactory.class);
    typeAliasRegistry.registerAlias("MANAGED", ManagedTransactionFactory.class);

    // ......

    typeAliasRegistry.registerAlias("SLF4J", Slf4jImpl.class);
    typeAliasRegistry.registerAlias("COMMONS_LOGGING", JakartaCommonsLoggingImpl.class);
    typeAliasRegistry.registerAlias("LOG4J", Log4jImpl.class);
    typeAliasRegistry.registerAlias("LOG4J2", Log4j2Impl.class);
    typeAliasRegistry.registerAlias("JDK_LOGGING", Jdk14LoggingImpl.class);
    typeAliasRegistry.registerAlias("STDOUT_LOGGING", StdOutImpl.class);
    typeAliasRegistry.registerAlias("NO_LOGGING", NoLoggingImpl.class);

    // ......
}
```

so 我们在配置那些 setting 配置项的时候，可供填充的内容，其实是参考自这里 MyBatis 预定的别名（这也能解释为什么我们如果在 settings 中配置 `log4j` 不好使，必须配置 `LOG4J` 才可以）。

### 3 typeAliasesElement-注册类型别名

下面一个要解析的是 `typeAliases` 标签了，这里面我们知道可以用 `<package>` 直接扫描，也可以使用 `<typeAlias>` 直接声明指定类型的别名。底层针对这两种情况分别做了处理：

```java
private void typeAliasesElement(XNode parent) {
  if (parent != null) {
    for (XNode child : parent.getChildren()) {
      // 处理package的包扫描指定别名
      if ("package".equals(child.getName())) {
        String typeAliasPackage = child.getStringAttribute("name");
        // 注意这里调用的是registerAliases注册一组
        configuration.getTypeAliasRegistry().registerAliases(typeAliasPackage);
      } else {
        // 处理typeAlias标签的逐个定义
        String alias = child.getStringAttribute("alias");
        String type = child.getStringAttribute("type");
        try {
          Class<?> clazz = Resources.classForName(type);
          if (alias == null) {
            typeAliasRegistry.registerAlias(clazz);
          } else {
            typeAliasRegistry.registerAlias(alias, clazz);
          }
        } catch (ClassNotFoundException e) {
          throw new BuilderException("Error registering typeAlias for '" + alias + "'. Cause: " + e, e);
        }
      }
    }
  }
}
```

注意在源码中，如果是处理 `<package>` 标签声明的包扫描，此处调用的方法也不一样了！进入到 `registerAliases` 方法中，我们会发现，这里会使用一个 `ResolverUtil` 的工具类，来扫描所有类（父类是 `Object` ），扫描完成后，在下面的 for 循环中，判断这些类是否为普通的类（非接口、非匿名内部类、非内部类），是则注册别名。

```java
  public void registerAliases(String packageName) {
    registerAliases(packageName, Object.class);
  }

  public void registerAliases(String packageName, Class<?> superType) {
    // 上面传入的是Object
    // 注意这个扫描动作是全层次扫描，会扫描到子包
    ResolverUtil<Class<?>> resolverUtil = new ResolverUtil<>();
    resolverUtil.find(new ResolverUtil.IsA(superType), packageName);
    Set<Class<? extends Class<?>>> typeSet = resolverUtil.getClasses();
    for (Class<?> type : typeSet) {
      // Ignore inner classes and interfaces (including package-info.java)
      // Skip also inner classes. See issue #6
      if (!type.isAnonymousClass() && !type.isInterface() && !type.isMemberClass()) {
        registerAlias(type);
      }
    }
  }
```

注意一点！这里面有一个**全层次包扫描**的动作！所以配置的 package 实际上是**扫描的指定包及其子包下的所有类**，并将他们全部注册 alias 别名。



##  pluginElement-注册插件

接下来注册的是 `plugins` 插件了，这里面的代码逻辑倒是简单：

```java
private void pluginElement(XNode parent) throws Exception {
    if (parent != null) {
        for (XNode child : parent.getChildren()) {
            String interceptor = child.getStringAttribute("interceptor");
            Properties properties = child.getChildrenAsProperties();
            // 直接创建拦截器对象
            Interceptor interceptorInstance = 
              (Interceptor) resolveClass(interceptor).getDeclaredConstructor().newInstance();
            // 拦截器的属性赋值
            interceptorInstance.setProperties(properties);
            configuration.addInterceptor(interceptorInstance);
        }
    }
}
```

整体下来，它就是简单的把拦截器创建出来，注册进全局 Configuration 中。当然我们要意识到的一件事：**拦截器是 MyBatis 自行创建的，如果我们要用 Spring 整合 MyBatis ，并且想让 Spring 管理 MyBatis 的拦截器，似乎不太现实**。

## 注册一堆Factory

下面的 3 行代码，注册的都是一些 Factory ：

```java
    objectFactoryElement(root.evalNode("objectFactory"));
    objectWrapperFactoryElement(root.evalNode("objectWrapperFactory"));
    reflectorFactoryElement(root.evalNode("reflectorFactory"));
```

这 3 种 Factory 的注册，在底层几乎是一模一样（以 `ObjectFactory` 为例）：



```java
private void objectFactoryElement(XNode context) throws Exception {
    if (context != null) {
        String type = context.getStringAttribute("type");
        Properties properties = context.getChildrenAsProperties();
        ObjectFactory factory = (ObjectFactory) resolveClass(type).getDeclaredConstructor().newInstance();
        factory.setProperties(properties);
        configuration.setObjectFactory(factory);
    }
}
```

## settingsElement-应用配置项

```java
private void settingsElement(Properties props) {
    // ......
    configuration.setCacheEnabled(booleanValueOf(props.getProperty("cacheEnabled"), true));
    configuration.setProxyFactory((ProxyFactory) createInstance(props.getProperty("proxyFactory")));
    configuration.setLazyLoadingEnabled(booleanValueOf(props.getProperty("lazyLoadingEnabled"), false));
    // ......
}
```

就是把全局配置文件中的那些 `<settings>` 都应用进全局的 `Configuration` 对象中

## environmentsElement-数据源环境配置

这里面因为存在嵌套标签 `<transactionManager>` 与 `<dataSource>` ，所以这里面的源码会稍微复杂一点

```java
private void environmentsElement(XNode context) throws Exception {
    if (context != null) {
        if (environment == null) {
            // 从default中取出默认的数据库环境配置标识
            environment = context.getStringAttribute("default");
        }
        for (XNode child : context.getChildren()) {
            String id = child.getStringAttribute("id");
            // 只会构造默认的数据库环境配置
            if (isSpecifiedEnvironment(id)) {
                // 解析transactionManager标签，生成TransactionFactory
                TransactionFactory txFactory = 
                  transactionManagerElement(child.evalNode("transactionManager"));
                // 解析dataSource标签，生成DataSource
                DataSourceFactory dsFactory = dataSourceElement(child.evalNode("dataSource"));
                DataSource dataSource = dsFactory.getDataSource();
                // 简单的建造器，构造出Environment对象
                Environment.Builder environmentBuilder = new Environment.Builder(id)
                    .transactionFactory(txFactory)
                    .dataSource(dataSource);
                configuration.setEnvironment(environmentBuilder.build());
            }
        }
    }
}
```

纵读整段源码，思路还是非常清晰的吧，它干的事情就是把事务管理器，以及数据源的配置加载好，构造进 `Environment` 对象中，完事。而解析 `transactionManager` 标签，以及 `dataSource` 标签的逻辑，跟上面解析那一堆 Factory 也都几乎完全一致，所以小册也不重复贴源码了，小伙伴们跟着 IDE 翻一下源码就好。

另外，`Environment` 的结构，也仅仅是组合了上面的 `TransactionFactory` 与 `DataSource`

```java
public final class Environment {
    private final String id;
    private final TransactionFactory transactionFactory;
    private final DataSource dataSource;
    
    // ......
}
```

##  databaseIdProviderElement-数据库厂商标识解析

接下来是 `<databaseIdProvider>` 标签的解析，这个东西我们说如果要用的话，就是声明 "DB_VENDOR" ，然后根据不同的数据库厂商，定义好别名即可。这个逻辑反映到源码中也不难理解：

```java
private void databaseIdProviderElement(XNode context) throws Exception {
    DatabaseIdProvider databaseIdProvider = null;
    if (context != null) {
        String type = context.getStringAttribute("type");
        // awful patch to keep backward compatibility
        // 写 VENDOR 跟写 DB_VENDOR 一样
        if ("VENDOR".equals(type)) {
            type = "DB_VENDOR";
        }
        Properties properties = context.getChildrenAsProperties();
        databaseIdProvider = (DatabaseIdProvider) resolveClass(type).getDeclaredConstructor().newInstance();
        databaseIdProvider.setProperties(properties);
    }
    Environment environment = configuration.getEnvironment();
    if (environment != null && databaseIdProvider != null) {
        String databaseId = databaseIdProvider.getDatabaseId(environment.getDataSource());
        configuration.setDatabaseId(databaseId);
    }
}
```

前半段就是正常的初始化 `DatabaseIdProvider` 类型的对象，关键是下面还有个 `configuration.setDatabaseId(databaseId);` 的动作，它是干什么呢？

仔细想一下，我们上一章提过，`databasseIdProvider` 是配合 `mapper.xml` 中定义 statement 用的，而源码走到这个位置的时候，还没有轮到 `mapper.xml` 解析，如果像我们上一章那样，在一个 `mapper.xml` 中定义了两个一样的 statement ，那后面轮到 `mapper.xml` 解析的时候，MyBatis 一看，呦，两个 statement 竟然 id 一模一样？ 这不相当于撞车了吗？不行，这我得给他挂了！所以就会抛出 statement 的 id 相同的异常。但是！这逻辑不对啊，虽然两个 statement 的 id 一致，但 databaseId 不一样啊，一个 `SqlSessionFactory` 只能连一个数据源，而这个数据源的数据库厂商是确定的，所以这两个 statement 只能有一个可用，所以在解析 `mapper.xml` ，读取 statement 的时候还要比对一下 databaseId 呢！那这个 databaseId 从哪来呢？很明显可以从全局 `Configuration` 得到，那上面的这个 `setDatabaseId` 的动作就可以理解了吧！这个动作就是**为了提前确定好数据源对应的数据库厂商，为后面解析 mapper.xml 做准备**。

## typeHandlerElement-注册类型处理器

下面一个解析的是 `TypeHandler` 了，这里面的逻辑也是比较简单，要么包扫描，要么逐个注册，但最终都是注册到了 `typeHandlerRegistry` 中：

```java
private void typeHandlerElement(XNode parent) {
    if (parent != null) {
        for (XNode child : parent.getChildren()) {
            // 包扫描
            if ("package".equals(child.getName())) {
                String typeHandlerPackage = child.getStringAttribute("name");
                typeHandlerRegistry.register(typeHandlerPackage);
            } else {
                // 逐个注册TypeHandler
                String javaTypeName = child.getStringAttribute("javaType");
                String jdbcTypeName = child.getStringAttribute("jdbcType");
                String handlerTypeName = child.getStringAttribute("handler");
                Class<?> javaTypeClass = resolveClass(javaTypeName);
                JdbcType jdbcType = resolveJdbcType(jdbcTypeName);
                Class<?> typeHandlerClass = resolveClass(handlerTypeName);
                if (javaTypeClass != null) {
                    if (jdbcType == null) {
                        typeHandlerRegistry.register(javaTypeClass, typeHandlerClass);
                    } else {
                        typeHandlerRegistry.register(javaTypeClass, jdbcType, typeHandlerClass);
                    }
                } else {
                    typeHandlerRegistry.register(typeHandlerClass);
                }
            }
        }
    }
}
```

## mapperElement-解析mapper.xml

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
                    XMLMapperBuilder mapperParser = 
                      new XMLMapperBuilder(inputStream, configuration, resource, 
                                           configuration.getSqlFragments());
                    mapperParser.parse();
                } else if (resource == null && url != null && mapperClass == null) {
                    // 处理url加载的mapper.xml
                    ErrorContext.instance().resource(url);
                    InputStream inputStream = Resources.getUrlAsStream(url);
                    XMLMapperBuilder mapperParser = 
                      new XMLMapperBuilder(inputStream, configuration, url, configuration.getSqlFragments());
                    mapperParser.parse();
                } else if (resource == null && url == null && mapperClass != null) {
                    // 注册单个Mapper接口
                    Class<?> mapperInterface = Resources.classForName(mapperClass);
                    configuration.addMapper(mapperInterface);
                } else {
                    throw new 
                      BuilderException("A mapper element may only specify a url, 
                                       resource or class, but not more than one.");
                }
            }
        }
    }
}
```

但请不要忘记！这个方法完事之后，整个 MyBatis 的初始化工作就完成了！但此时 `mapper.xml` 还没有加载呢！所以这个环节也是相当重要的！源码中，可以发现，除了包扫描 Mapper 接口，以及单个注册 Mapper 接口之外，其余两个都是解析 `mapper.xml` 文件。至于解析 `mapper.xml` 的底层是如何处理，我们放到**映射文件的讲解之后**再展开讲解，这里我们先知道一点即可：**`mapper.xml` 的解析是使用 `XMLMapperBuilder` 完成的**。