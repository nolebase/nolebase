---
title: 14整合Spring
---

## 1. 简单整合

### 1.1 整合思路

之前我们在测试的时候，都是自己构造 `SqlSessionFactory` ，整合 SpringFramework 之后就需要 SpringFramework 帮我们管理和初始化 `SqlSessionFactory` 了哈，并且由此生成 `SqlSession` 。

除此之外，Dao 实现类，或者 Mapper 接口，亦或者是 MyBatis 整合 SpringFramework 之后提供的 `SqlSessionTemplate` ，都是可以直接通过 SpringFramework 的 IOC 容器获取，这个也是很重要的。

### 1.2 搭建工程

我们要整合 SpringFramework ，所以必不可少的，要导入 MyBatis 整合 SpringFramework 的 jar 包：

```xml
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>2.0.5</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.2.6.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.2.6.RELEASE</version>
    </dependency>
```

### 1.3 编写spring-mybatis.xml

整合 SpringFramework ，那必然要有 SpringFramework 的配置文件了，我们在 `src/main/resources` 中添加一个 `spring-mybatis.xml` 文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
                           http://www.springframework.org/schema/beans/spring-beans.xsd">

</beans>
```

#### 1.3.1 数据源+包扫描+事务

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context" 
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd 
             http://www.springframework.org/schema/context 
                           https://www.springframework.org/schema/context/spring-context.xsd 
                           http://www.springframework.org/schema/tx 
                           http://www.springframework.org/schema/tx/spring-tx.xsd">

  <context:component-scan base-package="org.clxmm.mapper"/>

  <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
    <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
    <property name="url" 
              value="jdbc:mysql://localhost:3306/mybatis?characterEncoding=utf-8&amp;useSSL=false"/>
    <property name="username" value="root"/>
    <property name="password" value="123456"/>
  </bean>

  <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
  </bean>

  <tx:annotation-driven transaction-manager="transactionManager"/>

</beans>

```

MyBatis 中最重要的核心，`SqlSessionFactory` ，我们要把它交给 SpringFramework 统一管理，而 MyBatis 整合 SpringFramework 的整合包中，有这么一个 `FactoryBean` ，借助它就可以创建出 `SqlSessionFactory` ：

这个类名也是起的相当的通俗易懂，所以我们就可以来创建一下它：

```xml

  <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource"/>
    <!-- MyBatis全局配置文件 -->
    <property name="configLocation" value="classpath:mybatis-config.xml"/>
    <property name="typeAliasesPackage" value="org.clxmm.entity"/>
  </bean>
```



此外，还有两个配置需要我们编写，一个是可以快速操作 `SqlSession` 的 `SqlSessionTemplate` ：

```xml
    <bean id="sqlSessionTemplate" class="org.mybatis.spring.SqlSessionTemplate">
        <constructor-arg index="0" ref="sqlSessionFactory"/>
    </bean>
```

一个是可以扫描 Mapper 接口的 `MapperScannerConfigurer` ：

```xml
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.linkedbear.mybatis.mapper"/>
        <!-- 注意这里只能设置sqlSessionFactoryBeanName！！！ -->
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
    </bean>
```



这样配置之后，基本上 `spring-mybatis.xml` 的内容也就写的差不多了。

### 1.4 精简MyBatis全局配置文件

既然上面有一些配置已经在 `spring-mybatis.xml` 中存在了，那 MyBatis 的全局配置文件中也就没有必要写了，所以我们需要精简一下配置文件了。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <setting name="logImpl" value="LOG4J"/>
        <setting name="cacheEnabled" value="true"/>
    </settings>

    <!--
    别名已在初始化SqlSessionFactory时指定
    <typeAliases>
        <package name="com.linkedbear.mybatis.entity"/>
    </typeAliases>
    -->
    
    <!--
    事务管理器、数据源由SpringFramework统一管控
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis?characterEncoding=utf-8"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
    -->

    <mappers>
        <mapper resource="mapper/department.xml"/>
        <mapper resource="mapper/user.xml"/>
    </mappers>
</configuration>
```

> 当然，我们也可以把所有的配置都放在 `SqlSessionFactoryBean` 的创建中，那样我们都不需要 MyBatis 全局配置文件也可以

### 1.5 测试效果

```java
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring-mybatis.xml");
        
        DepartmentMapper departmentMapper = ctx.getBean(DepartmentMapper.class);
        List<Department> departmentList = departmentMapper.findAll();
        departmentList.forEach(System.out::println);
        
        ctx.close();
    }
```

## 2. 整合原理

回到 `spring-mybatis.xml` 配置文件中，MyBatis 整合 SpringFramework 的核心就是那个 **`SqlSessionFactoryBean`** ，我们的切入点就是从这里出发。

### 2.1 SqlSessionFactoryBean的设计

先简单看一下 `SqlSessionFactoryBean` 的内部成员，一上来我们就可以看到两个非常核心的东西：

```java
public class SqlSessionFactoryBean
        implements FactoryBean<SqlSessionFactory>, InitializingBean, 
								ApplicationListener<ApplicationEvent> {

    // ......

    private Resource configLocation;

    private Configuration configuration;
```

嚯，MyBatis 的配置文件路径，以及 MyBatis 的核心 **`Configuration`** 对象！有这些东西，想必构造 `SqlSessionFactory` 也应该不成问题吧。

再往下看，更多的熟悉的东西都会映入我们眼帘：

```java
    private Resource[] mapperLocations;
    private DataSource dataSource;
    private TransactionFactory transactionFactory;
    private Properties configurationProperties;
    private Interceptor[] plugins;
    private TypeHandler<?>[] typeHandlers;
    private String typeHandlersPackage;
```

另外，观察这个 `SqlSessionFactoryBean` 实现的接口：

- `FactoryBean<SqlSessionFactory>` ：可以通过 `getObject` 方法构造 `SqlSessionFactory`
- `InitializingBean` ：有初始化逻辑（猜想会不会就是这个初始化的切入点加载了 MyBatis 的相关东西呢？）
- `ApplicationListener<ApplicationEvent>` ：监听一些事件（实际上它只监听了 `ContextRefreshedEvent` 事件）

所以接下来的着眼点，我们就可以从这几个接口对应的方法往下看。按照 SpringFramework 对这几个接口的处理，我们先来看 `InitializingBean` 接口的 `afterPropertiesSet` 方法。

### 2.2 afterPropertiesSet

这个 `afterPropertiesSet` 方法只有一句话，但是这句话至关重要：

```java
@Override
public void afterPropertiesSet() throws Exception {
    // 判断 ......
    this.sqlSessionFactory = buildSqlSessionFactory();
}
```

构建 **`SqlSessionFactory`** ！！！这动作可太关键了，我们一定要好好看下去。但是这个方法非常非常长，所以小册会拆解成多段来看。

#### 2.2.1 处理MyBatis全局配置对象

```java
protected SqlSessionFactory buildSqlSessionFactory() throws Exception {

    final Configuration targetConfiguration;

    XMLConfigBuilder xmlConfigBuilder = null;
    // 事先构造过Configuration，直接处理
    if (this.configuration != null) {
        targetConfiguration = this.configuration;
        if (targetConfiguration.getVariables() == null) {
            targetConfiguration.setVariables(this.configurationProperties);
        } else if (this.configurationProperties != null) {
            targetConfiguration.getVariables().putAll(this.configurationProperties);
        }
    } else if (this.configLocation != null) {
        // 传入全局配置文件路径
        xmlConfigBuilder = new XMLConfigBuilder(this.configLocation.getInputStream(), null, this.configurationProperties);
        targetConfiguration = xmlConfigBuilder.getConfiguration();
    } else {
        // 啥也没有，一切走默认
        targetConfiguration = new Configuration();
        Optional.ofNullable(this.configurationProperties).ifPresent(targetConfiguration::setVariables);
    }
    // ......
```

首先的这一段，它会先准备一个 MyBatis 的全局配置对象 `Configuration` ，并根据是否事先注入 `configuration` 对象或者传入全局配置文件路径，决定是否准备 `XMLConfigBuilder` 。如果确实需要 `XMLConfigBuilder` 的处理，在下面会有调用它的 `parse` 方法，后面我们会看到。

#### 2.2.2 处理内置组件

```java
    // ......
    Optional.ofNullable(this.objectFactory).ifPresent(targetConfiguration::setObjectFactory);
    Optional.ofNullable(this.objectWrapperFactory).ifPresent(targetConfiguration::setObjectWrapperFactory);
    Optional.ofNullable(this.vfs).ifPresent(targetConfiguration::setVfsImpl);
    // ......
```

#### 2.2.3 别名处理

```java
    // ......
    if (hasLength(this.typeAliasesPackage)) {
        scanClasses(this.typeAliasesPackage, this.typeAliasesSuperType).stream()
            .filter(clazz -> !clazz.isAnonymousClass()).filter(clazz -> !clazz.isInterface())
            .filter(clazz -> !clazz.isMemberClass()).
          forEach(targetConfiguration.getTypeAliasRegistry()::registerAlias);
    }

    if (!isEmpty(this.typeAliases)) {
        Stream.of(this.typeAliases).forEach(typeAlias -> {
            targetConfiguration.getTypeAliasRegistry().registerAlias(typeAlias);
            LOGGER.debug(() -> "Registered type alias: '" + typeAlias + "'");
        });
    }
```

别名的包扫描，和某些特定类的别名设置，这个也都很简单了，也很容易理解。

默认情况下，包扫描注册的别名就是类名（首字母大写），如果类上有标注 `@Alias` 注解，则取注解属性值。

#### 2.2.4 处理插件、类型处理器

```java
    // ......
    if (!isEmpty(this.plugins)) {
        Stream.of(this.plugins).forEach(plugin -> {
            targetConfiguration.addInterceptor(plugin);
            LOGGER.debug(() -> "Registered plugin: '" + plugin + "'");
        });
    }

    if (hasLength(this.typeHandlersPackage)) {
        scanClasses(this.typeHandlersPackage, TypeHandler.class).stream().filter(clazz -> !clazz.isAnonymousClass())
            .filter(clazz -> !clazz.isInterface()).filter(clazz -> !Modifier.isAbstract(clazz.getModifiers()))
            .forEach(targetConfiguration.getTypeHandlerRegistry()::register);
    }

    if (!isEmpty(this.typeHandlers)) {
        Stream.of(this.typeHandlers).forEach(typeHandler -> {
            targetConfiguration.getTypeHandlerRegistry().register(typeHandler);
            LOGGER.debug(() -> "Registered type handler: '" + typeHandler + "'");
        });
    }

    targetConfiguration.setDefaultEnumTypeHandler(defaultEnumTypeHandler);
    // ......
```

接下来是处理 MyBatis 插件，以及 `TypeHandler` ，内容也非常简单，扫一眼即可。

默认情况下最后一行的那个 `defaultEnumTypeHandler` 为 null ，除非我们在注册 `SqlSessionFactoryBean` 时注入过，否则 MyBatis 处理枚举类型时仍会使用默认的处理器。

#### 2.2.5 处理边角组件

```java
    // ......
    if (!isEmpty(this.scriptingLanguageDrivers)) {
        Stream.of(this.scriptingLanguageDrivers).forEach(languageDriver -> {
            targetConfiguration.getLanguageRegistry().register(languageDriver);
            LOGGER.debug(() -> "Registered scripting language driver: '" + languageDriver + "'");
        });
    }
    Optional.ofNullable(this.defaultScriptingLanguageDriver)
        .ifPresent(targetConfiguration::setDefaultScriptingLanguage);

    if (this.databaseIdProvider != null) {// fix #64 set databaseId before parse mapper xmls
        try {
            targetConfiguration.setDatabaseId(this.databaseIdProvider.getDatabaseId(this.dataSource));
        } catch (SQLException e) {
            throw new NestedIOException("Failed getting a databaseId", e);
        }
    }

    Optional.ofNullable(this.cache).ifPresent(targetConfiguration::addCache);
    // ......
```

#### 2.2.6 解析MyBatis全局配置文件

```java
    // ......
    if (xmlConfigBuilder != null) {
        try {
            xmlConfigBuilder.parse();
            LOGGER.debug(() -> "Parsed configuration file: '" + this.configLocation + "'");
        } catch (Exception ex) {
            throw new NestedIOException("Failed to parse config resource: " + this.configLocation, ex);
        } finally {
            ErrorContext.instance().reset();
        }
    }
    // ......
```

上面的边边角角东西都处理的差不多了，接下来就是加载全局配置文件了，由于 `xmlConfigBuilder` 在执行构造器时已经把全局 `Configuration` 注入进去了，所以这个 `parse` 动作完事后，配置文件的内容也就都进入 `Configuration` 中了。

#### 2.2.7 处理数据源和事务工厂

```java
    // ......
    targetConfiguration.setEnvironment(new Environment(this.environment,
            this.transactionFactory == null ? 
                            new SpringManagedTransactionFactory() : this.transactionFactory,
            this.dataSource));
    // ......
```

这段话只有一句代码，但这里面包含了两部分：**数据源与事务工厂**，注意默认情况下 MyBatis 与 SpringFramework 整合之后底层使用的事务工厂不再是 `JdbcTransactionFactory` ，而是 `SpringManagedTransactionFactory` ，不过底层的逻辑与原生 jdbc 并无太大差别。

#### 2.2.8 处理Mapper

```java
    // ......
    if (this.mapperLocations != null) {
        if (this.mapperLocations.length == 0) {
 LOGGER.warn(() -> "Property 'mapperLocations' was specified but matching resources are not found.");
        } else {
            for (Resource mapperLocation : this.mapperLocations) {
                if (mapperLocation == null) {
                    continue;
                }
                try {
                    XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(mapperLocation.getInputStream(),
                            targetConfiguration,
                                      mapperLocation.toString(), targetConfiguration.getSqlFragments());
                    xmlMapperBuilder.parse();
                } catch (Exception e) {
                    throw new NestedIOException("Failed to parse mapping resource: '" + mapperLocation + "'", e);
                } finally {
                    ErrorContext.instance().reset();
                }
                LOGGER.debug(() -> "Parsed mapper file: '" + mapperLocation + "'");
            }
        }
    } else {
        LOGGER.debug(() -> "Property 'mapperLocations' was not specified.");
    }

    return this.sqlSessionFactoryBuilder.build(targetConfiguration);
}
```

因为 `SqlSessionFactoryBean` 只能传入 mapper.xml 的路径，所以这里的处理逻辑只有加载和解析 mapper.xml ，至于 Mapper 接口的话，那是另外的 `MapperScannerConfigurer` 了，我们马上就说它。

经过这么一大段 `afterPropertiesSet` 的逻辑，`SqlSessionFactory` 也就创建出来了。

### 2.3 事件监听

别忘了，最上面我们在看 `SqlSessionFactoryBean` 的接口实现中，还实现了一个 `ApplicationListener` 呢，那对应的 `onApplicationEvent` 方法我们也应该关注一下：

```java
@Override
public void onApplicationEvent(ApplicationEvent event) {
    if (failFast && event instanceof ContextRefreshedEvent) {
        // fail-fast -> check all statements are completed
        this.sqlSessionFactory.getConfiguration().getMappedStatementNames();
    }
}
```

注意看，它只监听了 `ContextRefreshedEvent` 类型的事件，那就意味着等 IOC 容器刷新完毕后，这个逻辑就会随之执行，先不看逻辑具体是什么，看一下这行注释：

> fail-fast -> check all statements are completed.
>
> 快速失败->检查所有语句是否已完成。

所以说这个动作相当于是 MyBatis 初始化完成后的一个收尾检查性质的处理咯。点进去看一下 `getMappedStatementNames` 方法都干了些啥：

```java
public Collection<String> getMappedStatementNames() {
    buildAllStatements();
    return mappedStatements.keySet();
}
```

等一下，这个方法是有返回值的，但上面没用到，所以这个动作只是为了触发 `buildAllStatements();` 这一行代码咯，那为什么不直接调用它呢？

聊回来，我们看看这个 `buildAllStatements` 方法都干了些什么：

```java
protected void buildAllStatements() {
    parsePendingResultMaps();
    // 处理失败的cache-ref再处理一遍
    if (!incompleteCacheRefs.isEmpty()) {
        synchronized (incompleteCacheRefs) {
            incompleteCacheRefs.removeIf(x -> x.resolveCacheRef() != null);
        }
    }
    // 处理失败的statement再处理一遍
    if (!incompleteStatements.isEmpty()) {
        synchronized (incompleteStatements) {
            incompleteStatements.removeIf(x -> {
                x.parseStatementNode();
                return true;
            });
        }
    }
    // 处理失败的Mapper方法再处理一遍
    if (!incompleteMethods.isEmpty()) {
        synchronized (incompleteMethods) {
            incompleteMethods.removeIf(x -> {
                x.resolve();
                return true;
            });
        }
    }
}
```

在 IOC 容器刷新完毕后，MyBatis 还是不想放弃它们，想再给它们一次机会，于是就把它们又尝试着处理了一次。当然，这也是初始化阶段的最后一次机会了，这次要是再处理不了，那就拉倒了，真不管了。

到此为止，整个 `SqlSessionFactoryBean` 的任务也就全部完成了，大概抓住几个要点即可

- 几乎可以代替 MyBatis 全局配置文件
- 可以传入全局配置文件，供 MyBatis 解析和处理
- 代替 MyBatis 处理数据源和事务工厂
- 只处理和解析 mapper.xml

`SqlSessionFactoryBean` 只负责 mapper.xml 的处理，那 Mapper 接口怎么办呢？哎别急，下面还有一个组件呢。

### 2.4 MapperScannerConfigurer

首先请各位注意一点，这个家伙的本质是一个 `BeanDefinitionRegistryPostProcessor` ：

```java
public class MapperScannerConfigurer
        implements BeanDefinitionRegistryPostProcessor, InitializingBean, 
ApplicationContextAware, BeanNameAware {
```

`BeanDefinitionRegistryPostProcessor` 的处理阶段最好不要直接使用 `getBean` 或者相似的方法去获取 IOC 容器中的 Bean **，如果只是为了检查或者依赖相关的 bean 的话，可以只依赖 bean 的 name 。

MyBatis 当然帮我们考虑到这个问题了，于是这个组件的内部设计是这样的：

```java
    private SqlSessionFactory sqlSessionFactory;

    private SqlSessionTemplate sqlSessionTemplate;

    private String sqlSessionFactoryBeanName;

    private String sqlSessionTemplateBeanName;
```

对应的，setter 方法也做了特殊处理：

```java
    // 标注为Deprecated，提示我们不要用它
    @Deprecated
    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        this.sqlSessionFactory = sqlSessionFactory;
    }

    public void setSqlSessionFactoryBeanName(String sqlSessionFactoryName) {
        this.sqlSessionFactoryBeanName = sqlSessionFactoryName;
    }
```

#### 2.4.2 核心处理逻辑

说完了这个要注意的点，我们还是要看核心的处理逻辑，**`BeanDefinitionRegistryPostProcessor` 的核心方法是 `postProcessBeanDefinitionRegistry` ，这个方法会向 `BeanDefinitionRegistry` 中注册新的 `BeanDefinition` **，具体的逻辑我们可以来看看源码逻辑：

```java
public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
    if (this.processPropertyPlaceHolders) {
        processPropertyPlaceHolders();
    }

    ClassPathMapperScanner scanner = new ClassPathMapperScanner(registry);
    // 一大堆set方法
    scanner.registerFilters();
    scanner.scan(
            StringUtils.tokenizeToStringArray(this.basePackage, 
                                              ConfigurableApplicationContext.CONFIG_LOCATION_DELIMITERS));
}
```

很明显，这里面的核心是这个 **`ClassPathMapperScanner`** ，它会执行包扫描的动作，并且将扫描到的 Mapper 接口都收集起来，构造为一个一个的 `MapperFactoryBean` （ `MapperFactoryBean` 想必各位都不会觉得陌生吧，它就是适配 Mapper 接口的工厂 Bean ）。那么核心的逻辑也就是 `ClassPathMapperScanner` 的 scan 方法了。

##### 2.4.2.1 scan

很不巧，这个 `scan` 方法其实是 `ClassPathBeanDefinitionScanner` 的，因为 `ClassPathMapperScanner` 继承自 `ClassPathBeanDefinitionScanner` ，所以会先来到 `ClassPathBeanDefinitionScanner` 中：

```java
public int scan(String... basePackages) {
    int beanCountAtScanStart = this.registry.getBeanDefinitionCount();

    doScan(basePackages);

    // Register annotation config processors, if necessary.
    if (this.includeAnnotationConfig) {
        AnnotationConfigUtils.registerAnnotationConfigProcessors(this.registry);
    }

    return (this.registry.getBeanDefinitionCount() - beanCountAtScanStart);
}
```

嚯，又是 SpringFramework 的经典套路了，**xxx 方法最终调用 doXxx 方法，真正负责干活的是 doXxx 方法**。其实读到这里我们应该有一种感觉：**doXxx 方法应该是类似于模板方法那样，让子类重写了**吧！OK 我们继续往下看。

##### 2.4.2.2 doScan

```java
public Set<BeanDefinitionHolder> doScan(String... basePackages) {
    Set<BeanDefinitionHolder> beanDefinitions = super.doScan(basePackages);

    if (beanDefinitions.isEmpty()) {
        LOGGER.warn(() -> "No MyBatis mapper was found in '" + Arrays.toString(basePackages)
                    + "' package. Please check your configuration.");
    } else {
        // 注意看这里
        processBeanDefinitions(beanDefinitions);
    }

    return beanDefinitions;
}
```

`ClassPathMapperScanner` 重写了 `doScan` 方法，也仅仅是多了一层 `BeanDefinition` 的处理而已，包扫描的逻辑还是用的 `ClassPathBeanDefinitionScanner` 的，那我们就不关心具体如何扫描了，主要是看扫描到 Mapper 接口之后都干了什么。

##### 2.4.2.3 processBeanDefinitions

```java
private void processBeanDefinitions(Set<BeanDefinitionHolder> beanDefinitions) {
    GenericBeanDefinition definition;
    for (BeanDefinitionHolder holder : beanDefinitions) {
        definition = (GenericBeanDefinition) holder.getBeanDefinition();
        // 获取Mapper接口的全限定名
        String beanClassName = definition.getBeanClassName();
        // logger ......

        // the mapper interface is the original class of the bean
        // but, the actual class of the bean is MapperFactoryBean
        // MapperFactoryBean的构造方法需要传入Mapper接口名
        definition.getConstructorArgumentValues().addGenericArgumentValue(beanClassName); // issue #59
        definition.setBeanClass(this.mapperFactoryBeanClass);

        definition.getPropertyValues().add("addToConfig", this.addToConfig);

        // 给MapperFactoryBean传入SqlSessionFactory
        boolean explicitFactoryUsed = false;
        if (StringUtils.hasText(this.sqlSessionFactoryBeanName)) {
            definition.getPropertyValues().add("sqlSessionFactory",
                    new RuntimeBeanReference(this.sqlSessionFactoryBeanName));
            explicitFactoryUsed = true;
        } else if (this.sqlSessionFactory != null) {
            definition.getPropertyValues().add("sqlSessionFactory", this.sqlSessionFactory);
            explicitFactoryUsed = true;
        }
        // 同样的逻辑处理SqlSessionTemplate ......

        if (!explicitFactoryUsed) {
            LOGGER.debug(() -> "Enabling autowire by type for MapperFactoryBean with name '" 
                         + holder.getBeanName() + "'.");
            definition.setAutowireMode(AbstractBeanDefinition.AUTOWIRE_BY_TYPE);
        }
        definition.setLazyInit(lazyInitialization);
    }
}
```

大体走下来，就这么两大步骤：拿着 Mapper 接口的全限定名创建 `MapperFactoryBean` ，注入 `SqlSessionFactory` 和 `SqlSessionTemplate` 。

处理好这些 `BeanDefinition` 之后，其实 `BeanDefinitionRegistry` 中就有这些 `MapperFactoryBean` 的定义了，后续的 bean 实例化阶段也就都能创建出对应的代理对象了，程序执行阶段也就可以拿得到了。

