---
title: 26IOC高级-模块装配&条件装配综合使用
---

## 1. 需求与分析

先说一下需求吧：**使用模块装配，通过标注一个 `@EnableJdbc` 的注解，能够根据当前工程中导入的数据库连接驱动，注册对应的数据源到 IOC 容器。**

咱把这个需求分解一下，可以提取出来的点应该有这么几个：

- 自定义注解与模块装配
- 条件装配注册特定数据库驱动的数据库连接池（数据源）
- 外部化配置数据源的连接信息

还好，基本都是之前在进阶部分学过的内容了，那咱就开始写吧。

## 2. 第一版写法

需求中提到了 jdbc 、数据源等有关数据库的依赖，所以首先我们要把缺少的依赖导入工程中。

### 2.1 添加pom依赖

我们先用 MySQL 来测试效果，此处导入 MySQL 的驱动、Druid 的数据库连接池、DBUtils 简化数据库访问的依赖。

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>

<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.23</version>
</dependency>

<dependency>
    <groupId>commons-dbutils</groupId>
    <artifactId>commons-dbutils</artifactId>
    <version>1.7</version>
</dependency>
```

### 2.2 声明模块装配的注解

既然是模块装配打头，那注解是必然要有的，接下来我们把注解声明出来：

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Import(JdbcConfiguration.class)
public @interface EnableJdbc {
    
}
```

模块装配要配合 `@Import` 注解一起使用，此处我们可以使用 `@Import` 导入一个注册数据源的配置类，在配置类中完成注册数据源、加载连接池配置等工作。

### 2.3 编写配置类

配置类中，需要构造一个 `DataSource` 和 `QueryRunner` ，就像这样：

```java
@Configuration
public class JdbcConfiguration {

    @Bean
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/test?characterEncoding=utf8");
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        return dataSource;
    }


    @Bean
    public QueryRunner queryRunner(DataSource dataSource) {
        return new QueryRunner(dataSource);
    }

}
```

这个写法有够简单了吧，不过这样写仅仅是装配了 MySQL 的，如果要支持 Oracle 、H2 的数据库，就还需要创建另外两个 `DataSource` 。（另外两个 `DataSource` 的声明几乎完全一致，小册不在此列出）

### 2.4 加入条件装配

如果是一次性把这三个 `DataSource` 都写到 `JdbcConfiguration` 中，那每次 IOC 容器初始化时，都会创建三个 `DataSource` ，这很明显不符合要求，我们要的是工程的 classpath 下有哪个数据库连接驱动，就装配哪个 `DataSource` ，很明显这里要用到条件装配了。又因为获取数据库连接驱动的方式无法通过 Profiles 决定，所以只能选用 Conditional 的方式。

可问题是：怎么知道 classpath 下是不是有指定的数据库连接驱动呢？

哎，很简单嘛，用类加载器加载一下，如果成功了，那就是有；如果报 `ClassNotFoundException` 了，那就代表没有。所以我们可以写一个类似于这样的简单判断：

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@Conditional(OnClassNameConditional.class)
public @interface ConditionalOnClassName {
    
    String value();
}
```

```java
public class OnClassNameConditional implements Condition {
    
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        String className = (String) metadata.getAnnotationAttributes(ConditionalOnClassName.class.getName()).get("value");
        try {
            Class.forName(className);
            return true;
        } catch (ClassNotFoundException e) {
        	return false;
        }
    }
}
```

一个自定义 Conditional 的注解，一个支撑注解的条件逻辑类，这样就可以搞定了。

然后，在 `JdbcConfiguration` 中，给每个 `DataSource` 的注册上都标注上 `@ConditionalOnClassName` 注解，这样就可以搞定条件装配了：

```java
@Bean
@ConditionalOnClassName("com.mysql.jdbc.Driver")
public DataSource mysqlDataSource() {
    DruidDataSource dataSource = new DruidDataSource();
    dataSource.setDriverClassName("com.mysql.jdbc.Driver");
    dataSource.setUrl("jdbc:mysql://localhost:3306/test?characterEncoding=utf8");
    dataSource.setUsername("root");
    dataSource.setPassword("123456");
    return dataSource;
}
```

### 2.5 测试运行

这次的测试启动类，我也拿它当配置类用了，其实这完全没问题的，只是之前的示例代码中我都没这么干而已：

```java
@Configuration
@EnableJdbc
public class EnableJdbcApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(EnableJdbcApplication.class);
        DruidDataSource dataSource = ctx.getBean(DruidDataSource.class);
        System.out.println(dataSource.getUrl());
    }
}
```

这里的操作很简单，在测试启动类上标注 `@EnableJdbc` ，并用它自己驱动 IOC 容器，然后从容器中取出 `DataSource` ，打印它的 url 。

运行 `main` 方法，控制台可以打印出 MySQL 的数据库连接地址：

```java
jdbc:mysql://localhost:3306/test?characterEncoding=utf8

```

将 `pom.xml` 中的数据库连接驱动换为 h2 的依赖：

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <version>1.4.199</version>
</dependency>
```

不改动任何程序代码，直接重新运行 `main` 方法，控制台也能立马切换为 h2 的数据库连接地址，至此第一版代码编写完成。

```
jdbc:h2:~/test

```

### 2.6 第一版代码的问题

回过头来看一看，第一版代码有什么问题呢？

- 外部化配置呢？所有的配置都是写死在配置类的呀，这不大合理吧
- 虽说把多个 DataSource 放在一个配置类中注册，但如果随后一些其它的组件也多起来，那这个 JdbcConfiguration 只会越来越庞大，最好能够把不同数据库的组件都分散到不同的配置类中

基于这两个问题，我们要对现在的代码改进。

先从外部化配置改起吧，要实现外部化配置的效果，我们也知道，是要把外置的配置文件引入到 IOC 容器的 `Environment` 中。下面咱就来搞定这个。

## 3. 第二版写法

先从外部化配置改起吧，要实现外部化配置的效果，我们也知道，是要把外置的配置文件引入到 IOC 容器的 `Environment` 中。下面咱就来搞定这个。

### 3.1 声明jdbc配置文件

在工程的 `resources` 下新建一个 `enablejdbc` 包，随后创建一个 `jdbc.properties` 文件：

```properties
jdbc.url=jdbc:mysql://localhost:3306/test?characterEncoding=utf8
jdbc.username=root
jdbc.password=123456
```

哎，这里为啥没有 `jdbc.driverClassName` 呢？小伙伴们思考一下原因？

看一眼上面的配置类，针对不同的条件装配中，`driverClassName` 已经被固定住了，所以我们也没必要再在配置文件中写了（突然感觉省了点事哈）。

### 3.2 配置类注入Environment

用 `EnvironmentAware` 给 `JdbcConfiguration` 注入 `Environment` ，然后每个 `DataSource` 的创建就可以使用 `Environment` 的取值了：

```java
@Bean
@ConditionalOnClassName("com.mysql.jdbc.Driver")
public DataSource mysqlDataSource() {
    DruidDataSource dataSource = new DruidDataSource();
    dataSource.setDriverClassName("com.mysql.jdbc.Driver");
    dataSource.setUrl(environment.getProperty("jdbc.url"));
    dataSource.setUsername(environment.getProperty("jdbc.username"));
    dataSource.setPassword(environment.getProperty("jdbc.password"));
    return dataSource;
}
```

MySQL 的数据源这么写，Oracle 和 H2 的也是一模一样的写法啊，这也太奇怪了吧，有木有更好地办法呢？这个问题先放一下，我们后面马上改进。

### 3.3 拆分配置类

三个 `DataSource` 放在一起虽说可以，但终究还是拆开合适，于是我们就可以这样拆成三个配置类：

```java
@Configuration
public class AbstractJdbcConfiguration implements EnvironmentAware {
    protected Environment environment;

    @Bean
    public QueryRunner queryRunner(DataSource dataSource) {
        return new QueryRunner(dataSource);
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

}


@Configuration
@ConditionalOnClassName("com.mysql.jdbc.Driver")
public class MySQLJdbcConfiguration extends AbstractJdbcConfiguration {
    
    @Bean
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl(environment.getProperty("jdbc.url"));
        dataSource.setUsername(environment.getProperty("jdbc.username"));
        dataSource.setPassword(environment.getProperty("jdbc.password"));
        return dataSource;
    }
}


```

> 注意：这里我把 `JdbcConfiguration` 类改名为 `AbstractJdbcConfiguration` 了，这样我只需要写一次 `Environment` 的注入就可以。

拆开三个配置类后，下一步要考虑的是咋把这些配置类注册进 IOC 容器。最简单的办法是包扫描，但包扫描不见得是最好的办法：如果恰巧 Oracle 库出了点问题，这个类暂时不想装配进去了，使用包扫描的话只能把 `OracleJdbcConfiguration` 删掉或者改源码去掉 `@Configuration` 注解，才能停用 Oracle 的配置类装配。so ，**有没有一种更好的方案，能针对某个模块的装配，利用外部化配置指定需要加载的配置类呢？** 当然有（没有那我故弄玄虚干嘛），这个知识点非常重要，它就是 **SPI** 。

## 4. SPI【掌握】

说到 SPI ，其实最早它的用法是来源于 jdk ，下面先介绍关于 SPI 的一些基础。

关于 SPI 的来源，得从面向对象的接口编程说起。依赖倒转原则中提到，**应该依赖接口而不是实现类**，但接口最终要有实现类落地。如果程序因为业务调整，需要替换某个接口的实现类，那就不得不改动实现类的创建，也就是得改源码了。SPI 的出现解决了这个问题，它通过一种“**服务寻找**”的机制，**动态的加载接口 / 抽象类对应的具体实现类**。

是不是突然产生了一种 IOC 的感觉？对的，SPI 还真有点 IOC 的味，**它把接口具体实现类的定义和声明权交给了外部化的配置文件中**。

![image-20220508124614818](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220508124614.png)

是不是好理解多了？一个接口可以有多个实现类，通过 SPI 机制，可以将一个接口需要创建的实现类的对象都罗列在一个特殊的文件中，SPI 机制会将这些实现类都实例化出对象并返回。

好了，下面解释下 SPI 的概念吧。SPI 全程叫 **Service Provider Interface** 服务提供接口，它可以通过一个指定的接口 / 抽象类，寻找到预先配置好的实现类（并创建实现类对象）。jdk1.6 中有 SPI 的具体实现，SpringFramework 3.2 也引入了 SPI 的实现，而且比 jdk 的实现更加强大，下面我们分别来讲解这两种 SPI 的实现。

### 4.2 jdk1.6中的SPI

对于原生 jdk 的 SPI ，我们只是了解下就好，因为它的使用范围实在是有点有限，只能通过**接口 / 抽象类**来加载具体的实现类，所以很多框架都没有直接用 jdk 的 SPI ，基本都是自己造了一套更强大的（ Spring 算一个，Dubbo 算一个，等等吧）。下面来一个最简单的示例来讲解 jdk 原生的 SPI 。

#### 4.2.1 声明接口和实现类

不整那么复杂的，一个接口两个实现类就好吧！这样，我们直接拿 IOC 一开始的 DemoDao 用吧：

```java
public interface DemoDao {
    
}

public class DemoMySQLDaoImpl implements DemoDao {
    
}

public class DemoOracleDaoImpl implements DemoDao {
    
}
```

#### 4.2.2 声明SPI文件

jdk 的 SPI 是需要遵循规范的：**所有定义的 SPI 文件都必须放在工程的 `META-INF/services` 目录下**，且**文件名必须命名为接口 / 抽象类的全限定名**，**文件内容为接口 / 抽象类的具体实现类的全限定名，如果出现多个具体实现类，则每行声明一个类的全限定名，没有分隔符**。

以下是针对上面 `DemoDao` 的定义：

> 文件名： org.clxmm.configuration.z_spi.bean.DemoDao

```
org.clxmm.configuration.z_spi.bean.DemoMySqlDaoImpl
org.clxmm.configuration.z_spi.bean.DemoOracleDaoImpl
```

#### 4.2.3 测试获取

编写测试启动类，使用 jdk 提供的一个 `ServiceLoader` 类来加载 SPI 文件中定义的实现类，并直接打印到控制台：

```java
public class JdkSpiApplication {
    
    public static void main(String[] args) throws Exception {
        ServiceLoader<DemoDao> serviceLoader = ServiceLoader.load(DemoDao.class);
        serviceLoader.iterator().forEachRemaining(dao -> {
            System.out.println(dao);
        });
    }
}
```

运行 `main` 方法，控制台可以打印出 `DemoDao` 的两个实现类的对象：

```
org.clxmm.configuration.z_spi.bean.DemoMySqlDaoImpl@6e8cf4c6
org.clxmm.configuration.z_spi.bean.DemoOracleDaoImpl@12edcd21
```

这样就算搞定 jdk 原生的 SPI 了。

### 4.3 SpringFramework3.2中的SPI

SpringFramework 中的 SPI 相比较于 jdk 原生的，那可就高级多了，因为它不仅仅局限于接口 / 抽象类，它可以是**任何一个类、接口、注解**。也正是因为可以支持注解的 SPI ，这个特性在 SpringBoot 中被疯狂利用（大名鼎鼎的 **`@EnableAutoConfiguration`** ）。so 这个 Spring 的 SPI 我们更有必要来学习啦。

接口和实现类我们就不重复声明了，用上面的就 OK 。

#### 4.3.1 声明SPI文件

SpringFramework 的 SPI 文件也是有规矩的，它需要放在工程的 **`META-INF`** 下，且文件名必须为 **`spring.factories`** 。而文件的内容，其实就是一个 `properties` ：

```properties
org.clxmm.configuration.z_spi.bean.DemoDao=\
  org.clxmm.configuration.z_spi.bean.DemoMySqlDaoImpl,\
  org.clxmm.configuration.z_spi.bean.DemoOracleDaoImpl
```

#### 4.3.2 测试获取

使用 SpringFramework 的 SPI ，加载 `spring.factories` 文件的 API 是 **`SpringFactoriesLoader`** ，它不仅可以加载声明的类的对象，而且可以直接把预先定义好的全限定名都取出来：

```java
public class SpringSpiApplication {
    
    public static void main(String[] args) throws Exception {
        // 加载并实例化
        List<DemoDao> demoDaos = SpringFactoriesLoader
                .loadFactories(DemoDao.class, SpringSpiApplication.class.getClassLoader());
        demoDaos.forEach(dao -> {
            System.out.println(dao);
        });
    
        System.out.println("------------------------------------------------");
    
        // 只加载全限定类名
        List<String> daoClassNames = SpringFactoriesLoader
                .loadFactoryNames(DemoDao.class, SpringSpiApplication.class.getClassLoader());
        daoClassNames.forEach(className -> {
            System.out.println(className);
        });
    }
}
```

```
org.clxmm.configuration.z_spi.bean.DemoMySqlDaoImpl@66cd51c3
org.clxmm.configuration.z_spi.bean.DemoOracleDaoImpl@4dcbadb4
------------------------------------------------
org.clxmm.configuration.z_spi.bean.DemoMySqlDaoImpl
org.clxmm.configuration.z_spi.bean.DemoOracleDaoImpl
```

由于 SpringFramework 的 SPI 更为灵活，所以我们在这里就使用 SpringFramework 的 SPI 来加载配置类。

### 3.4 SPI加载配置类

先把几个配置类都声明到 `spring.factories` 中吧：

```properties
org.clxmm.configuration.e_enablejdbc.annotation.EnableJdbc=\
  org.clxmm.configuration.e_enablejdbc.config.MySQLJdbcConfiguration,\
  org.clxmm.configuration.e_enablejdbc.config.OracleJdbcConfiguration
```

注意这里我使用了注解作为 key ，这是完全可以的哦。

然后就是加载它们了。由于**配置类需要 SpringFramework 解析其中的 Bean 的定义，以及其他的配置**，所以**不适合直接创建对象**，这里**获取全限定名**是合理的方式。

再回想一下，如果是加载一组类的全限定名，并且都要注册到 IOC 容器中，那么用谁会比较合适呢？哎，是不是有个东西叫 **`ImportSelector`** 来着？它刚好就是要一组类的全限定名！那我们快点来写吧：

```java
public class JdbcConfigSelector implements ImportSelector {
    
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        List<String> configClassNames = SpringFactoriesLoader
                .loadFactoryNames(EnableJdbc.class, this.getClass().getClassLoader());
        return configClassNames.toArray(new String[0]);
    }
}
```

之后，在 `@EnableJdbc` 注解上，把这个 `JdbcConfigSelector` 导入进去：

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Import(JdbcConfigSelector.class)
public @interface EnableJdbc {
    
}
```

### 3.5 测试运行

第二版的测试运行类与前面几乎完全一致，只是不要忘记加载 `jdbc.properties` 的配置哦：

```java
@Configuration
@EnableJdbc
@PropertySource("enablejdbc/jdbc.properties")
public class EnableJdbcApplication {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(EnableJdbcApplication.class);
        DruidDataSource dataSource = ctx.getBean(DruidDataSource.class);
        System.out.println(dataSource.getUrl());
        System.out.println(dataSource.getDriverClassName());
    }

}
```

运行 `main` 方法，可以发现 MySQL 的驱动已经注册进去了：

```
jdbc:mysql://localhost:3306/test?characterEncoding=utf8
com.mysql.jdbc.Driver
```

### 3.6 模块装配&条件装配的使用总结

到这里，小伙伴会不会对整体的模块装配+条件装配有一个更清晰的认识呢？通过一个注解，把一个功能所需要的组件都装配进 IOC 容器中，并且合理利用 SPI 配合条件装配，可以满足不同环境、不同外部配置的需求。

之所以讲这部分，是因为后续小伙伴在学习 SpringBoot 时，**SpringBoot 就完全利用了这个套路来实现自动装配**的。小伙伴可以先记住这个套路，到后面学习 SpringBoot 时，自然会 会心一笑 的。

## 5. 回归理性的第三版写法

其实小伙伴在拆分配置类的时候，那种强烈的不适感有没有冲出头顶：

```java
@Bean
public DataSource dataSource() {
    DruidDataSource dataSource = new DruidDataSource();
    dataSource.setDriverClassName("com.mysql.jdbc.Driver");
    dataSource.setUrl(environment.getProperty("jdbc.url"));
    dataSource.setUsername(environment.getProperty("jdbc.username"));
    dataSource.setPassword(environment.getProperty("jdbc.password"));
    return dataSource;
}
```

```java
@Bean
public DataSource dataSource() {
    DruidDataSource dataSource = new DruidDataSource();
    dataSource.setDriverClassName("oracle.jdbc.driver.OracleDriver");
    dataSource.setUrl(environment.getProperty("jdbc.url"));
    dataSource.setUsername(environment.getProperty("jdbc.username"));
    dataSource.setPassword(environment.getProperty("jdbc.password"));
    return dataSource;
}
```

而且，根据之前学过的 `BeanDefinition` 与编程式驱动 IOC ，**这几个配置是不是完全可以转换为构造一个 `BeanDefinition` 啊**！好，有了这个思路，下面我们回归理性，用 `BeanDefinition` 的思维来重构这个案例。

### 5.1 编写BeanDefinitionRegistryPostProcessor

既然可以通过编程式注入 `BeanDefinition` ，那我们完全可以借助 `BeanDefinitionRegistryPostProcessor` ，或者 `ImportBeanDefinitionRegistrar` ，向 `BeanFactory` 中注入 `BeanDefinition` ，此处我们选用 `BeanDefinitionRegistryPostProcessor` 吧。

跟之前的 `@Bean` 声明一样的，是都需要 **`Environment`** ；不一样的，是构造 `BeanDefinition` 的方式，这里要用编程式了。还是老套路，要用 `EnvironmentAware` 的回调注入哦（**直接 `@Autowired` 是不可行的，小伙伴们可以自行测试一下**）：

```java
public class DataSourceRegisterPostProcessor implements BeanDefinitionRegistryPostProcessor, EnvironmentAware {
    
    private Environment environment;
    
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        BeanDefinitionBuilder builder = BeanDefinitionBuilder.rootBeanDefinition(DruidDataSource.class)
                .addPropertyValue("url", environment.getProperty("jdbc.url"))
                .addPropertyValue("username", environment.getProperty("jdbc.username"))
                .addPropertyValue("password", environment.getProperty("jdbc.password"));
        // 完善driverClassName，注册DataSource
    }
    
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    }
    
    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }
}
```

剩下的就是怎么搞定 `driverClassName` 了。既然上面的三个配置类中，已经预先拿到了 `Driver` 的实现类，那这里我们也可以把它们声明到 SPI 文件中：

```properties
java.sql.Driver=\
  com.mysql.jdbc.Driver,\
  oracle.jdbc.driver.OracleDriver,\
  org.h2.Driver
```

然后借助 `SpringFactoriesLoader` ，就可以拿到这几个类的全限定名了。

拿到之后再怎么干，这就不用我再多说了吧，小伙伴们已经大脑飞速运行了吧！那么我们赶紧趁势一口气写完吧：

```java
@Override
public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
    BeanDefinitionBuilder builder = BeanDefinitionBuilder.rootBeanDefinition(DruidDataSource.class)
            .addPropertyValue("url", environment.getProperty("jdbc.url"))
            .addPropertyValue("username", environment.getProperty("jdbc.username"))
            .addPropertyValue("password", environment.getProperty("jdbc.password"));
    // 根据当前classpath下的数据库连接驱动添加driverClassName
    List<String> driverClassNames = SpringFactoriesLoader.loadFactoryNames(Driver.class, this.getClass().getClassLoader());
    String driverClassName = null;
    for (String temp : driverClassNames) {
        try {
            Class.forName(temp);
            driverClassName = temp;
            break;
        } catch (ClassNotFoundException ignored) {
            // 加载失败，classpath下无当前驱动，继续下一个
        }
    }
    // 存在驱动，注册DataSource
    if (driverClassName != null) {
        builder.addPropertyValue("driverClassName", driverClassName);
        registry.registerBeanDefinition("dataSource", builder.getBeanDefinition());
    }
}
```

### 5.2 编写配置类

配置类中，只需要定义 `QueryRunner` ，以及把刚写的 `DataSourceRegisterPostProcessor` 注册到 IOC 容器就可以了，非常的简单：

```java
@Configuration
public class JdbcConfiguration {
    
    @Bean
    public QueryRunner queryRunner(DataSource dataSource) {
        return new QueryRunner(dataSource);
    }
    
    @Bean
    public DataSourceRegisterPostProcessor dataSourceRegisterPostProcessor() {
        return new DataSourceRegisterPostProcessor();
    }
}
```

另外，不要忘记给 `@EnableJdbc` 导入这个配置类哦：

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Import(JdbcConfiguration.class)
public @interface EnableJdbc {
    
}
```

### 5.3 测试运行

与上面的测试运行类一模一样：

```java
@Configuration
@EnableJdbc
@PropertySource("enablejdbc/jdbc.properties")
public class EnableJdbcApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(EnableJdbcApplication.class);
        DruidDataSource dataSource = ctx.getBean(DruidDataSource.class);
        System.out.println(dataSource.getUrl());
        System.out.println(dataSource.getDriverClassName());
    }
}
```

