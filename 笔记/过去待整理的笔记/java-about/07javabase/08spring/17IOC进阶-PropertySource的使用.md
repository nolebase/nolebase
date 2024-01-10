---
title: 17IOC进阶-PropertySource的使用
---

承接上一章的内容，本章咱来介绍一个重要的资源加载注解：`@PropertySource` 。

## 1. @PropertySource引入properties文件【掌握】

常规的使用方式，当然是引入 properties 文件了，下面咱快速回顾一下这种使用方式。

### 1.1 声明properties文件

在 `resources` 目录下新建一个 `propertysource` 文件夹，此处存放本章声明的所有资源文件。

新建一个 `jdbc.properties` 文件，用来代表声明一个 jdbc 的连接属性（这种写法在后续的 jdbc 整合时非常常见，不过咱还没有学到跟 jdbc 打交道，所以此处只是单纯的声明下而已）：

```properties
jdbc.url=jdbc:mysql://localhost:3306/test
jdbc.driver-class-name=com.mysql.jdbc.Driver
jdbc.username=root
jdbc.password=root
```

### 1.2 编写配置模型类

```java
@Component
@Data
public class JdbcProperties {

    @Value("${jdbc.url}")
    private String url;

    @Value("${jdbc.driver-class-name}")
    private String driverClassName;

    @Value("${jdbc.username}")
    private String username;

    @Value("${jdbc.password}")
    private String password;
}
```

### 1.3 编写配置类

新建一个 `JdbcPropertiesConfiguration` ，扫描配置模型类所在的包，并声明导入上面的 `jdbc.properties` 文件：

```java
@Configuration
@ComponentScan("com.linkedbear.spring.annotation.g_propertysource.bean")
@PropertySource("classpath:propertysource/jdbc.properties")
public class JdbcPropertiesConfiguration {
    
}
```

### 1.4 测试运行

```java
public class PropertySourcePropertiesApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                JdbcPropertiesConfiguration.class);
        System.out.println(ctx.getBean(JdbcProperties.class).toString());
    }
}
```

运行 `main` 方法，控制台打印了 `jdbc.properties` 中的属性，证明 properties 文件导入成功。

```
JdbcProperties(url=jdbc:mysql://localhost:3306/test, driverClassName=com.mysql.jdbc.Driver, username=root, password=root)
```

## 2. @PropertySource引入xml文件【了解】

意料之外吧，`@PropertySource` 还可以引入 xml 文件，其实在它的注解属性上已经有标注了：

> Indicate the resource location(s) of the properties file to be loaded. Both traditional and XML-based properties file formats are supported.
>
> 指示要加载的属性文件的资源位置。 支持原生 properties 和基于 XML 的属性文件格式。

### 2.1 声明xml文件

新建一个 `jdbc.xml` 文件，但是这里面的写法可是有严格的格式要求的：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <entry key="xml.jdbc.url">jdbc:mysql://localhost:3306/test</entry>
    <entry key="xml.jdbc.driver-class-name">com.mysql.jdbc.Driver</entry>
    <entry key="xml.jdbc.username">root</entry>
    <entry key="xml.jdbc.password">123456</entry>
</properties>
```

这是 sun 当时给出的 Properties 格式的 xml 标准规范写法，必须按照这个格式来，才能解析为 `Properties` 。咱先这么写，稍后会解释这样写的原因。

### 2.2 编写配置模型类

仿造上面的配置模型类，搞一个基本一样的出来：（注意这里的 `@Value` 取值加了 xml 前缀）

```java
@Data
@Component
public class JdbcXmlProperty {

    @Value("${xml.jdbc.url}")
    private String url;

    @Value("${xml.jdbc.driver-class-name}")
    private String driverClassName;

    @Value("${xml.jdbc.username}")
    private String username;

    @Value("${xml.jdbc.password}")
    private String password;
}
```

### 2.3 编写配置类

仿造上面的配置类写法，造一个基本一样的配置类，注意扫描包的位置不要写错了：

```java
@Configuration
@ComponentScan("org.clxmm.annotation.h_propertyxml.bean")
@PropertySource("classpath:propertysource/jdbc.xml")
public class JdbcXmlConfiguration {
}
```

### 2.4 测试运行

编写启动类，驱动 `JdbcXmlConfiguration` ，并打印 IOC 容器中的 `JdbcXmlProperty` ：

```java
public class PropertySourceXmlApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(JdbcXmlConfiguration.class);
        System.out.println(ctx.getBean(JdbcXmlProperty.class).toString());
    }
}
```

```
JdbcXmlProperty(url=jdbc:mysql://localhost:3306/test, driverClassName=com.mysql.jdbc.Driver, username=root, password=root)

```

### 2.5 xml格式被限制的原因

好了，来解答上面那个问题：为了完成跟 `.properties` 文件一样的写法，反而在 xml 中要写这么一大堆乱七八糟的格式，这都哪来的？？？别着急，在这个问题之前，先请小伙伴思考另一个问题：SpringFramework 是怎么加载那些 `.properties` 文件的呢？

答案很简单嘛，肯定是走的 jdk 原生的 `Properties` 类咯。下面咱来解答这个问题。

#### 2.5.1 解析Properties的入口

答案的追踪可以从 `@PropertySource` 注解的一个属性入手：

```java
public @interface PropertySource {
    // ......

	/**
	 * Specify a custom {@link PropertySourceFactory}, if any.
	 * <p>By default, a default factory for standard resource files will be used.
	 * @since 4.3
	 */
	Class<? extends PropertySourceFactory> factory() default PropertySourceFactory.class;
}
```

这里有一个 `factory` 的属性，它自 SpringFramework 4.3 开始出现，它代表的是：**使用什么类型的解析器解析当前导入的资源文件**，说的简单点，它想表达的是,用 `@PropertySource` 注解引入的资源文件需要用什么策略来解析它。默认情况下它只放了一个 `PropertySourceFactory` 在这里，看一眼 `factory` 属性的泛型也能大概猜得出来，`PropertySourceFactory` 应该是一个接口 / 抽象类，它肯定有默认实现的子类。果不其然，借助 IDEA 咱很容易就能找到它在 SpringFramework 中默认的唯一实现：`DefaultPropertySourceFactory` 。

#### 2.5.2 默认的Properties解析工厂

```java
public class DefaultPropertySourceFactory implements PropertySourceFactory {

	@Override
	public PropertySource<?> createPropertySource(@Nullable String name, EncodedResource resource) throws IOException {
		return (name != null ? new ResourcePropertySource(name, resource) : new ResourcePropertySource(resource));
	}
}
```

默认实现中，它只是 new 了一个 `ResourcePropertySource` 而已，而这个构造方法中有一句让我们很敏感的方法调用：`PropertiesLoaderUtils.loadProperties`

```java
public ResourcePropertySource(String name, EncodedResource resource) throws IOException {
    super(name, PropertiesLoaderUtils.loadProperties(resource));
    this.resourceName = getNameForResource(resource.getResource());
}
```

进入这个 `loadProperties` 方法中：

```java
public static Properties loadProperties(EncodedResource resource) throws IOException {
    Properties props = new Properties();
    fillProperties(props, resource);
    return props;
}
```

得了，它的底层果然是这么用的，那问题自然也就解开了。`@PropertySource` 解析 xml 也是用 `Properties` 这个类解析的。可是我们在之前的 JavaSE 中可能没学过 `Properties` 解析 xml 啊，这还第一次听说咧。

#### 2.5.3 【扩展】jdk原生Properties解析xml

其实在 jdk 内置的 `Properties` 类中有这么一个方法可以解析 xml 文件：

```java
public synchronized void loadFromXML(InputStream in) throws IOException, InvalidPropertiesFormatException {
    XmlSupport.load(this, Objects.requireNonNull(in));
    in.close();
}
```

只是这个 xml 的要求，属实有点高，它是 sun 公司在很早之前就制定的一个 xml 表达 properties 的标准：（以下是 dtd 约束文件内容）

```xml-dtd
<!--
   Copyright 2006 Sun Microsystems, Inc.  All rights reserved.
  -->

<!-- DTD for properties -->

<!ELEMENT properties ( comment?, entry* ) >

<!ATTLIST properties version CDATA #FIXED "1.0">

<!ELEMENT comment (#PCDATA) >

<!ELEMENT entry (#PCDATA) >

<!ATTLIST entry key CDATA #REQUIRED>
```

#### 2.5.4 properties与xml的对比

难易程度高下立判，properties 完胜，所以对于这种配置型的资源文件，通常都是使用 properties 来编写。

当然，properties 也不是完全 OK ，由于它的特征是 key-value 的形式，整个文件排下来是没有任何层次性可言的（换句话说，每个配置项之间的地位都是平等的）。这个时候 xml 的优势就体现出来了，它可以非常容易的体现出层次性，不过咱不能因为这一个点就觉得 xml 还可以，因为有一个更适合解决这个问题的配置格式：**yml** 。

## 3. @PropertySource引入yml文件【了解】

接触过 SpringBoot 的小伙伴对 yml 肯定很熟悉了，当然也不乏有一些新学习的小伙伴，所以咱还是在这里简单介绍下 yml 。

### 3.1 yml的语法格式

**yml** 又称 **yaml** ，它是可以代替 properties 同时又可以表达层级关系的标记语言，它的基本格式如下：

```yaml
person: 
  name: zhangsan
  age: 18
  cat: 
    name: mimi
    color: white
dog: 
  name: wangwang
```

可以发现这种写法既可以表达出 properties 的 key-value 形式，同时可以非常清晰的看到层级之间的关系（ cat 在 person 中，person 与 dog 在一个层级）。这种写法同等于下面的 properties ：

```properties
person.name=zhangsan
person.age=18
person.cat.name=mimi
person.cat.color=white
dog.name=wangwang
```

两种写法各有优劣，在 SpringBoot 中这两种写法都予以支持。不过这不是咱本章讨论的重点了，下面咱介绍如何把 yml 引入到 IOC 容器中。

### 3.2 声明yml文件

根据上面的 yaml 格式，可以编写出如下 yml 的内容：

```yaml
yml: 
  jdbc:
    url: jdbc:mysql://localhost:3306/test
    driver-class-name: com.mysql.jdbc.Driver
    username: root
    password: 123456
```

### 3.3 编写配置模型类

写法与上面的一模一样，不过 `@Value` 中的 key 前缀改为了 yml ：

```java
@Component
@Data
public class JdbcYmlProperty {

    @Value("${yml.jdbc.url}")
    private String url;

    @Value("${yml.jdbc.driver-class-name}")
    private String driverClassName;

    @Value("${yml.jdbc.username}")
    private String username;

    @Value("${yml.jdbc.password}")
    private String password;
}
```

### 3.4 编写配置类

继续仿照上面的写法，把配置类也造出来：

```java
@Configuration
@ComponentScan("org.clxmm.annotation.i_propertyyml.bean")
@PropertySource("classpath:propertysource/jdbc.yml")
public class JdbcYmlConfiguration {
}
```

### 3.5 测试运行

直接编写启动类，驱动 `JdbcYmlConfiguration` ，取出 `JdbcYmlProperty` 并打印：

```java
public class PropertySourceYmlApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(JdbcYmlConfiguration.class);
        System.out.println(ctx.getBean(JdbcYmlProperty.class).toString());
    }
}
```

运行 `main` 方法，发现属性是一个也没有注入呀：

```
JdbcYmlProperty(url=${yml.jdbc.url}, driverClassName=${yml.jdbc.driver-class-name}, username=${yml.jdbc.username}, password=${yml.jdbc.password})
```

上面咱看到解析资源文件的默认实现策略是 `DefaultPropertySourceFactory` ，它是解析 properties 和标准 xml 文件的，要是能把 yml 文件也解析出来，那才奇了怪呢！

### 3.6 自定义PropertySourceFactory解析yml

解析 yml 文件，讲道理咱能搞，但是太费劲了，而且现有的开源技术中已经有很成熟的组件能解决 yml 文件的解析，所以咱就来引入一个目前来讲非常成熟，且一直被 SpringBoot 使用的 yml 解析器：snake-yaml 。

#### 3.6.1 导入snake-yaml的maven坐标

在 2020 年 2 月，snake-yaml 升级了 1.26 版本，自此之后很长一段时间没有再升级过，且观察最近几个版本的更新速度也非常慢，基本可以断定它的近几个版本都是很稳定的，于是咱就选择这个 1.26 版本作为 yml 文件的解析底层。

```xml
<dependency>
    <groupId>org.yaml</groupId>
    <artifactId>snakeyaml</artifactId>
    <version>1.26</version>
</dependency>
```

#### 3.6.2 自定义PropertySourceFactory

为了代替原有的 `DefaultPropertySourceFactory` ，就需要咱来自定义一个 `PropertySourceFactory` 的实现了，那就造一个吧，名就叫 `YmlPropertySourceFactory` ：

```java
public class YmlPropertySourceFactory implements PropertySourceFactory {
    
    @Override
    public PropertySource<?> createPropertySource(String name, EncodedResource resource) throws IOException {
        return null;
    }
}
```

之后，把这个 `YmlPropertySourceFactory` 设置到 `@PropertySource` 中：

```
@PropertySource(value = "classpath:propertysource/jdbc.yml", factory = YmlPropertySourceFactory.class)

```

注意看这个接口的方法，它要返回一个 `PropertySource<?>` ，借助 IDEA 观察它的继承关系，可以发现它里头有一个实现类叫 `PropertiesPropertySource` ：

那估计咱用这个返回就可以吧！点开它，发现它只有一个公开的构造方法：

```java
public PropertiesPropertySource(String name, Properties source) {
    super(name, (Map) source);
}
```

果然，它只需要传 name 和 `Properties` 对象就可以了。

于是，现在的目标就变成了：如何把 yml 资源文件的对象，转换为 `Properties` 的对象。

#### 3.6.3 资源文件转换为Properties对象

在 snake-yaml 中有一个能快速解析 yml 文件的类，叫 `YamlPropertiesFactoryBean` ，它可以快速加载 `Resource` 并转为 `Properties` ，具体写法可参加下面的实现：

```java
@Override
public PropertySource<?> createPropertySource(String name, EncodedResource resource) throws IOException {
    YamlPropertiesFactoryBean yamlPropertiesFactoryBean = new YamlPropertiesFactoryBean();
    // 传入resource资源文件
    yamlPropertiesFactoryBean.setResources(resource.getResource());
    // 直接解析获得Properties对象
    Properties properties = yamlPropertiesFactoryBean.getObject();
    // 如果@PropertySource没有指定name，则使用资源文件的文件名
    return new PropertiesPropertySource((name != null ? name : resource.getResource().getFilename()), properties);
}
```

### 3.7 重新测试

```
JdbcYmlProperty(url=jdbc:mysql://localhost:3306/test, driverClassName=com.mysql.jdbc.Driver, username=root, password=root)
```

