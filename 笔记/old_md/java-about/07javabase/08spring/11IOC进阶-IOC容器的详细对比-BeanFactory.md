---
title: 11IOC进阶-IOC容器的详细对比-BeanFactory
---

进入到进阶的部分，难度就不像前面那么低了，因为咱要慢慢进入 SpringFramework 更深层次的部分，来更透彻的了解 SpringFramework ，从而更好地驾驭它。

SpringFramework 中的容器最核心的是 `BeanFactory` 与 `ApplicationContext` ，但它们还有好多的子接口、抽象类和具体实现类，接下来的两章咱就把这些重要的子接口、实现类都研究个明明白白。

## 1. BeanFactory和它的子接口们

![image-20220427212323830](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220427212323.png)

可以发现，这里面除了一些 `BeanFactory` 接口的扩展，还有 `ApplicationContext` ，那关于 `ApplicationContext` 的部分咱放到下一章，这部分只解释 `BeanFactory` 相关的重要接口。

### 1.1 BeanFactory【掌握】

`BeanFactory` 作为 SpringFramework 中最顶级的容器接口，它的作用一定是最简单、最核心的。下面咱先来看一看文档注释 ( javadoc ) 中的描述。

#### 1.1.1 BeanFactory是根容器

> The root interface for accessing a Spring bean container. This is the basic client view of a bean container; further interfaces such as `ListableBeanFactory` and `org.springframework.beans.factory.config.ConfigurableBeanFactory` are available for specific purposes.
>
> 用于访问 SpringFramework bean 容器的根接口。这是 bean 容器的基本客户端视图。诸如 `ListableBeanFactory` 和 `org.springframework.beans.factory.config.ConfigurableBeanFactory` 之类的扩展接口可用于特定的用途。

这一段的解释是最开始，解释 `BeanFactory` 是 SpringFramework 中管理 Bean 的容器，它是最最基本的根接口，下面的扩展都是为了实现某些额外的特性（层次性、可搜索性、可配置性等）。

#### 1.1.2 BeanFactory中定义的作用域概念

> This interface is implemented by objects that hold a number of bean definitions, each uniquely identified by a String name. Depending on the bean definition, the factory will return either an independent instance of a contained object (the Prototype design pattern), or a single shared instance (a superior alternative to the Singleton design pattern, in which the instance is a singleton in the scope of the factory). Which type of instance will be returned depends on the bean factory configuration: the API is the same. Since Spring 2.0, further scopes are available depending on the concrete application context (e.g. "request" and "session" scopes in a web environment).
>
> `BeanFactory` 接口由包含多个 bean 定义的对象实现，每个 bean 的定义信息均由 “name” 进行唯一标识。根据 bean 的定义，SpringFramework 中的工厂会返回所包含对象的独立实例 ( prototype ，原型模式 ) ，或者返回单个共享实例 ( singleton ，单例模式的替代方案，其中实例是工厂作用域中的单例 ) 。返回 bean 的实例类型取决于 bean 工厂的配置：API是相同的。从 SpringFramework 2.0 开始，根据具体的应用程序上下文 ( 例如 Web 环境中的 request 和 session 作用域 ) ，可以使用更多作用域。

这段文档是解释了 `BeanFactory` 中设计的作用域概念，默认情况下，`BeanFactory` 中的 Bean 只有**单实例 Bean（`singleton`）** 和**原型 Bean（`prototype`）** ，自打 SpringFramework2.0 开始，出现了 Web 系列的作用域 `“request”` 和 `“session”` ，后续的又出现了 `“global session”` 和 `“websocket”` 作用域。

这里面有一句话不是很好理解：

> Which type of instance will be returned depends on the bean factory configuration: the API is the same.
>
> 返回 bean 的实例类型取决于 bean 工厂的配置：API是相同的。

前面的部分还可以，咱知道 Bean 的作用域类型取决于定义的 scope ，但后面的 `the API is the same.` 是什么鬼呢？回想一下配置 Bean 的作用域是怎么来的：

```java
@Component
@Scope("prototype")
public class Cat { }
```

无论是声明单实例 Bean ，还是原型 Bean ，都是用 `@Scope` 注解标注；在配置类中用 `@Bean` 注册组件，如果要显式声明作用域，也是用 `@Scope` 注解。由此就可以解释这句话了：**产生单实例 Bean 和原型 Bean 所用的 API 是相同的，都是用 `@Scope` 注解来声明，然后由 `BeanFactory` 来创建**。

#### 1.1.3 BeanFactory集成了环境配置

> The point of this approach is that the BeanFactory is a central registry of application components, and centralizes configuration of application components (no more do individual objects need to read properties files, for example). See chapters 4 and 11 of "Expert One-on-One J2EE Design and Development" for a discussion of the benefits of this approach.
>
> 这种方法的重点是 `BeanFactory` 是应用程序组件的注册中心，并且它集成了应用程序组件的配置（例如不再需要单个对象读取属性文件）。有关此方法的好处的讨论，请参见《Expert One-on-One J2EE Design and Development》的第4章和第11章。



这部分解释了 `BeanFactory` 它本身是所有 Bean 的注册中心，所有的 Bean 最终都在 `BeanFactory` 中创建和保存。另外 `BeanFactory` 中还集成了配置信息，

不过，这里面有关集成配置的概念，其实说的有点老了，自 SpringFramework 3.1 之后出现了一个新的概念叫 **`Environment`** ，到后面咱会展开讲解，它才是真正做环境和配置的保存地。

#### 1.1.4 BeanFactory推荐使用DI而不是DL

> Note that it is generally better to rely on Dependency Injection ("push" configuration) to configure application objects through setters or constructors, rather than use any form of "pull" configuration like a BeanFactory lookup. Spring's Dependency Injection functionality is implemented using this BeanFactory interface and its subinterfaces.
>
> 请注意，通常最好使用依赖注入（“推”的配置），通过setter方法或构造器注入的方式，配置应用程序对象，而不是使用任何形式的“拉”的配置（例如借助 `BeanFactory` 进行依赖查找）。 SpringFramework 的 Dependency Injection 功能是使用 `BeanFactory` 接口及其子接口实现的。

这部分的内容其实跟 `BeanFactory` 的关系不是特别大，它阐述的是 SpringFramework 官方在 IOC 的两种实现上的权衡：**推荐使用 DI ，尽可能不要使用 DL** 。

另外它这里面的一个概念特别好：**DI 的思想是“推”**，它主张把组件需要的依赖“推”到组件的成员上；**DL 的思想是”拉“**，组件需要哪些依赖需要组件自己去 IOC 容器中“拉取”。这样在解释 DL 和 DI 的概念和对比时就有了新的说法（奇怪的知识增加了~~~）。

#### 1.1.5 BeanFactory支持多种类型的配置源

> Normally a BeanFactory will load bean definitions stored in a configuration source (such as an XML document), and use the org.springframework.beans package to configure the beans. However, an implementation could simply return Java objects it creates as necessary directly in Java code. There are no constraints on how the definitions could be stored: LDAP, RDBMS, XML, properties file, etc. Implementations are encouraged to support references amongst beans (Dependency Injection).
>
> 通常情况下，`BeanFactory` 会加载存储在配置源（例如 XML 文档）中 bean 的定义，并使用 `org.springframework.beans` 包中的 API 来配置 bean 。然而，`BeanFactory` 的实现可以根据需要直接在 Java 代码中返回它创建的 Java 对象。bean 定义的存储方式没有任何限制，它可以是 LDAP （轻型文件目录访问协议），RDBMS（关系型数据库系统），XML，properties 文件等。鼓励实现以支持 Bean 之间的引用（依赖注入）。

这一段告诉我们，SpringFramework 可以支持的配置源类型有很多种，当然咱最常用的还是 xml 和注解驱动啦 ~ 这些配置源中存储的信息是一些 Bean 的定义，这个概念很复杂，咱放到后面的 `BeanDefinition` 中介绍。

#### 1.1.6 BeanFactory可实现层次性

> In contrast to the methods in ListableBeanFactory, all of the operations in this interface will also check parent factories if this is a HierarchicalBeanFactory. If a bean is not found in this factory instance, the immediate parent factory will be asked. Beans in this factory instance are supposed to override beans of the same name in any parent factory.
>
> 与 `ListableBeanFactory` 中的方法相比，`BeanFactory` 中的所有操作还将检查父工厂（如果这是 `HierarchicalBeanFactory` ）。如果在 `BeanFactory` 实例中没有找到指定的 bean ，则会向父工厂中搜索查找。`BeanFactory` 实例中的 Bean 应该覆盖任何父工厂中的同名 Bean 。

这部分想告诉我们的是，`BeanFactory` 本身可以支持**父子结构**，这个父子结构的概念和实现由 `HierarchicalBeanFactory` 实现，在 `BeanFactory` 中它也只是提了一下。这部分咱放到下面的 `HierarchicalBeanFactory` 中解释。

#### 1.1.7 BeanFactory中设有完整的生命周期控制机制

> Bean factory implementations should support the standard bean lifecycle interfaces as far as possible. The full set of initialization methods and their standard order is:
>
> 1. BeanNameAware's `setBeanName`
> 2. BeanClassLoaderAware's `setBeanClassLoader`
> 3. ......
>
> On shutdown of a bean factory, the following lifecycle methods apply: ......
>
> `BeanFactory` 接口实现了尽可能支持标准 Bean 的生命周期接口。全套初始化方法及其标准顺序为：......
>
> 在关闭 `BeanFactory` 时，以下生命周期方法适用：......



由这一段咱能很清楚的了解到，Bean 的生命周期是在 `BeanFactory` 中就有设计的，而且官方文档也提供了全套的初始化和销毁流程，这个咱在这里不展开，后面会有专门介绍完整的 Bean 的生命周期的章节来讲解此部分内容（讲真想完整理解好也挺难的，先做好心理预备）。

#### 1.1.8 小结

到这里，小伙伴是不是对 `BeanFactory` 有了一个更深刻的认识了呢？总结下来 `BeanFactory` 提供了如下基础的特性：

- 基础的容器
- 定义了作用域的概念
- 集成环境配置
- 支持多种类型的配置源
- 层次性的设计

### 1.2 HierarchicalBeanFactory【熟悉】

从类名上能很容易的理解，它是体现了**层次性**的 `BeanFactory` 。有了这个特性，`BeanFactory` 就有了**父子结构**。它的文档注释蛮简单的，咱看一眼：

> Sub-interface implemented by bean factories that can be part of a hierarchy.
>
> The corresponding setParentBeanFactory method for bean factories that allow setting the parent in a configurable fashion can be found in the ConfigurableBeanFactory interface.
>
> 由 `BeanFactory` 实现的子接口，它可以理解为是层次结构的一部分。
>
> 可以在 `ConfigurableBeanFactory` 接口中找到用于 `BeanFactory` 的相应 `setParentBeanFactory` 方法，该方法允许以可配置的方式设置父对象。

果然文档注释也解释的很清晰了，对应的接口方法定义中，就有这么一个方法：**`getParentBeanFactory()`** ，它就可以获取到父 `BeanFactory` 对象；接口中还有一个方法是 `containsLocalBean(String name)` ，它是检查当前本地的容器中是否有指定名称的 Bean ，而不会往上找父 `BeanFactory` 。

> getBean 方法会从当前 BeanFactory 开始查找是否存在指定的 Bean ，如果当前找不到就依次向上找父 BeanFactory ，直到找到为止返回，或者都找不到最终抛出 NoSuchBeanDefinitionException

注意这里的说法：如果当前找不到就往上找，那如果找到了就不往上找了。思考一个问题：如果当前 `BeanFactory` 中有指定的 Bean 了，父 `BeanFactory` 中可能有吗？

答案是有，因为**即便存在父子关系，但他们本质上是不同的容器，所以有可能找到多个相同的 Bean** 。换句话说，**`@Scope` 中声明的 Singleton 只是在一个容器中是单实例的，但有了层次性结构后，对于整体的多个容器来看，就不是单实例的了**。

至于怎么设置父 `BeanFactory` ，文档注释中也说了，要用 `ConfigurableBeanFactory` 的 `setParentBeanFactory` 方法，那至于 `ConfigurableBeanFactory` 是什么东西，咱下面自然会解释。

### 1.3 ListableBeanFactory【熟悉】

类名理解为**“可列举”**的 `BeanFactory` ，它的文档也把这个特性解释的很清楚，咱一段一段来读。

#### 1.3.1 ListableBeanFactory可以列举出容器中的所有Bean

> Extension of the BeanFactory interface to be implemented by bean factories that can enumerate all their bean instances, rather than attempting bean lookup by name one by one as requested by clients. BeanFactory implementations that preload all their bean definitions (such as XML-based factories) may implement this interface.
>
> 它是 `BeanFactory` 接口的扩展实现，它可以列举出所有 bean 实例，而不是按客户端调用的要求，按照名称一一进行 bean 的依赖查找。具有 “预加载其所有 bean 定义信息” 的 `BeanFactory` 实现（例如基于XML的 `BeanFactory` ）可以实现此接口。

这段话比较好理解了，它的扩展功能是能让咱在拿到 `BeanFactory` 时可以直接**把容器中的所有 Bean 都拿出来**（也就相当于提供了**可迭代**的特性），而不是一个一个的拿 name 去取（一个一个的取会很麻烦，而且很大程度上取不全）。后面提到了一个概念，叫“预加载所有 bean 的定义信息”，这个也是涉及到 `BeanDefinition` 的东西了，咱到后面讲解 `BeanDefinition` 时再详细介绍。

#### 1.3.2 ListableBeanFactory只列举当前容器中的Bean

> If this is a HierarchicalBeanFactory, the return values will not take any BeanFactory hierarchy into account, but will relate only to the beans defined in the current factory. Use the BeanFactoryUtils helper class to consider beans in ancestor factories too.
>
> 如果当前 `BeanFactory` 同时也是 `HierarchicalBeanFactory` ，则返回值会忽略 `BeanFactory` 的层次结构，仅仅与当前 `BeanFactory` 中定义的 bean 有关。除此之外，也可以使用 `BeanFactoryUtils` 来考虑父 `BeanFactory` 中的 bean 。

通过这部分可以了解到另外一个特性：**`ListableBeanFactory` 只会列举当前容器的 Bean** ，因为咱上面也看了，`BeanFactory` 可以具有层次性，那这样再列举所有 Bean 的时候，就需要斟酌到底是获取包括父容器在内的所有 Bean ，还是只获取当前容器中的 Bean ，SpringFramework 在斟酌之后选择了**只获取当前容器中的 Bean** ，而如果真的想获取所有 Bean ，可以借助 `BeanFactoryUtils` 工具类来实现（工具类中有不少以 `"IncludingAncestors"` 结尾的方法，代表可以一起取父容器）。

#### 1.3.3 ListableBeanFactory会有选择性的列举

> The methods in this interface will just respect bean definitions of this factory. They will ignore any singleton beans that have been registered by other means like org.springframework.beans.factory.config.ConfigurableBeanFactory's registerSingleton method, with the exception of getBeanNamesForType and getBeansOfType which will check such manually registered singletons too. Of course, BeanFactory's getBean does allow transparent access to such special beans as well. However, in typical scenarios, all beans will be defined by external bean definitions anyway, so most applications don't need to worry about this differentiation.
>
> `ListableBeanFactory` 中的方法将仅遵循当前工厂的 bean 定义，它们将忽略通过其他方式（例如 `ConfigurableBeanFactory` 的 `registerSingleton` 方法）注册的任何单实例 bean （但 `getBeanNamesForType` 和 `getBeansOfType` 除外），它们也会检查这种手动注册的单实例 Bean 。当然，`BeanFactory` 的 `getBean` 确实也允许透明访问此类特殊 bean 。在一般情况下，无论如何所有的 bean 都来自由外部的 bean 定义信息，因此大多数应用程序不必担心这种区别。

这一段注释的意思似乎有点让人摸不着头脑：作为一个“可迭代”的 `BeanFactory` ，按理来讲应该最起码得把当前容器中的所有 Bean 都列出来，结果你又告诉我**有些 Bean 会被忽略掉不给列**，那你想怎样嘛！ヽ(`Д´)ﾉ 别着急，下面小册会给你解释的，不过在解释之前，咱先演示一下这段注释的代码体现。

##### 1.3.3.1 创建Bean+配置文件

创建两个最最简单的类：

```java
public class Cat { }
public class Dog { }
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean class="com.linkedbear.spring.container.a_beanfactory.bean.Cat"/>
</beans>
```

##### 1.3.3.2 驱动原始的BeanFactory加载配置文件

这次咱驱动的时候，选用 `BeanFactory` 的最终实现来构造 IOC 容器（虽然现在看来有点超纲，但是没关系，下面会讲到哈）：

```java
public class ListableBeanFactoryApplication {
    
    public static void main(String[] args) throws Exception {
        ClassPathResource resource = new ClassPathResource("container/listable-container.xml");
        DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();
        XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReader(beanFactory);
        beanDefinitionReader.loadBeanDefinitions(resource);
        // 直接打印容器中的所有Bean
        System.out.println("加载xml文件后容器中的Bean：");
        Stream.of(beanFactory.getBeanDefinitionNames()).forEach(System.out::println);
    }
}
```

 使用这种方式，也可以加载 xml 配置文件，完成 IOC 容器的构建。此时如果直接打印 IOC 容器中的 Bean ，可以发现确实只有一个 cat ：

```
加载xml文件后容器中的Bean：
com.linkedbear.spring.container.a_beanfactory.bean.Cat#0

```

##### 1.3.3.3 测试手动注册Bean

```java
public class ListableBeanFactoryApplication {
    
    public static void main(String[] args) throws Exception {
        ClassPathResource resource = new ClassPathResource("container/listable-container.xml");
        DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();
        XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReader(beanFactory);
        beanDefinitionReader.loadBeanDefinitions(resource);
        // 直接打印容器中的所有Bean
        System.out.println("加载xml文件后容器中的Bean：");
        Stream.of(beanFactory.getBeanDefinitionNames()).forEach(System.out::println);
        System.out.println();
        
        // 手动注册一个单实例Bean
        beanFactory.registerSingleton("doggg", new Dog());
        // 再打印容器中的所有Bean
        System.out.println("手动注册单实例Bean后容器中的所有Bean：");
        Stream.of(beanFactory.getBeanDefinitionNames()).forEach(System.out::println);
    }
}
```

再次运行 `main` 方法，可以发现控制台还是只打印了一个 cat ：

```java
加载xml文件后容器中的Bean：
com.linkedbear.spring.container.a_beanfactory.bean.Cat#0

手动注册单实例Bean后容器中的所有Bean：
com.linkedbear.spring.container.a_beanfactory.bean.Cat#0
```

加载xml文件后容器中的Bean： com.linkedbear.spring.container.a_beanfactory.bean.Cat#0 手动注册单实例Bean后容器中的所有Bean： com.linkedbear.spring.container.a_beanfactory.bean.Cat#

##### 1.3.3.4 容器中真的注册了Dog

在上面的启动类 `main` 方法最后再追加这么几行代码：

```java
    System.out.println("容器中真的有注册Dog：" + beanFactory.getBean("doggg"));
    // 通过getBeanNamesOfType查找Dog
    System.out.println("容器中的所有Dog：" + Arrays.toString(beanFactory.getBeanNamesForType(Dog.class)));
```

重新运行，控制台打印了 `Dog` 的地址和名称：

```java
容器中真的有注册Dog：com.linkedbear.spring.container.a_beanfactory.bean.Dog@50cbc42f
容器中的所有Dog：[doggg]
```

说明文档注释中说的 `getBeanNamesOfType` 和 `getBeansOfType` 两个方法是例外的，它们可以取到手动注册的 Bean 。

##### 1.3.3.5 【源码】ListableBeanFactory设计选择性列举的目的

现象看到了，可它为什么要这么设计呢？这里只是先简单提一下，后面在讲解 `BeanDefinition` 章节部分时会回来填这个坑的。

借助 IDEA ，查看 `ConfigurableBeanFactory` 的 `registerSingleton` 方法调用，可以发现在一个叫 `AbstractApplicationContext` 的 `prepareBeanFactory` 方法中有一些使用：（源码节选）

```java
    // Register default environment beans.
    if (!beanFactory.containsLocalBean(ENVIRONMENT_BEAN_NAME)) {
        beanFactory.registerSingleton(ENVIRONMENT_BEAN_NAME, getEnvironment());
    }
    if (!beanFactory.containsLocalBean(SYSTEM_PROPERTIES_BEAN_NAME)) {
        beanFactory.registerSingleton(SYSTEM_PROPERTIES_BEAN_NAME, getEnvironment().getSystemProperties());
    }
    if (!beanFactory.containsLocalBean(SYSTEM_ENVIRONMENT_BEAN_NAME)) {
        beanFactory.registerSingleton(SYSTEM_ENVIRONMENT_BEAN_NAME, getEnvironment().getSystemEnvironment());
    }
```

可以发现它在这里直接注册了几个组件，而这些组件都是**属于 SpringFramework 内部使用的**，这样做的目的是 **SpringFramework 不希望咱开发者直接操控他们，于是就使用了这种方式来隐藏它们**。

这个设计如果不是很好理解的话，我举另外一个例子：在 Windows 系统中，系统不希望咱用户去随意改动系统内部使用的一些文件，会在文件资源管理器中设置一个选项：**隐藏受保护的操作系统文件**（在控制面板 → 文件资源管理器选项中）。

默认情况下这个选项是勾选的（意思就是这些文件我都藏起来了，我自己管理就行，不用你操心），当然你可以取消勾选它，这样文件资源管理器中也能显示那些操作系统的文件，但你要是真的动了它们，指不定你的机器就出什么问题了。

这样大概可以理解 `ListableBeanFactory` 这样设计的目的了吧，那这一段注释也就差不多理解完了。

#### 1.3.4 ListableBeanFactory的大部分方法不适合频繁调用

> NOTE: With the exception of getBeanDefinitionCount and containsBeanDefinition, the methods in this interface are not designed for frequent invocation. Implementations may be slow.
>
> 注意：除了 `getBeanDefinitionCount` 和 `containsBeanDefinition` 之外，此接口中的方法不适用于频繁调用，方法的实现可能执行速度会很慢。

最后文档注释中给了一句提醒，说这个接口里的大部分方法都不适合频繁调用，这个咱也能理解，毕竟谁会动不动去翻 IOC 容器的东西呢？顶多是读完一遍就自己缓存起来吧！而且一般情况下也不会有业务需求会深入到 IOC 容器的底部吧，所以这个提醒算是挺贴心的，而且咱开发者也都这么做了。

### 1.4 AutowireCapableBeanFactory【了解】

类名中有一个熟悉的概念：自动注入，它的意思就应该是：**支持自动注入的 `BeanFactory`** 。那是不是就意味着，这个扩展的 `BeanFactory` 就可以支持 DI 了呢？咱还是先从文档注释入手。

#### 1.4.1 AutowireCapableBeanFactory可以支持外部Bean的自动装配

> Extension of the BeanFactory interface to be implemented by bean factories that are capable of autowiring, provided that they want to expose this functionality for existing bean instances.
>
> 它是 `BeanFactory` 接口的扩展实现，它可以实现自动装配，前提是开发者希望为现有的 bean 实例公开此功能。

这句话的意思如果只是直译，那可能比较难理解，所以我在下面贴翻译的时候让这句话更好理解了一点。由这句话也能粗略的有一个概念：AutowireCapableBeanFactory 本身可以支持自动装配，而且还可以为**现有的一些 Bean 也能支持自动装配**。而这个“现有”的概念，实际上指的是那些**不被 SpringFramework 管理的 Bean** ，下面两段话就有解释。

#### 1.4.2 AutowireCapableBeanFactory用于框架集成

> This subinterface of BeanFactory is not meant to be used in normal application code: stick to BeanFactory or ListableBeanFactory for typical use cases.
>
> Integration code for other frameworks can leverage this interface to wire and populate existing bean instances that Spring does not control the lifecycle of. This is particularly useful for WebWork Actions and Tapestry Page objects, for example.
>
> `AutowireCapableBeanFactory` 这个子接口不能在常规的应用程序代码中使用：一般情况下，请坚持使用 `BeanFactory` 或 `ListableBeanFactory` 。 其他框架的集成代码可以利用此接口来连接和注入 SpringFramework 无法控制其生命周期的现有 bean 实例。例如，这对于 WebWork 操作和 Tapestry 页面对象特别有用。

这两段话想表达的意思，主要是说这个 `AutowireCapableBeanFactory` 一般不要让咱自己用，而是在**与其他框架进行集成时才使用**。注意这里面它的描述：**利用此接口来连接和注入 SpringFramework 无法控制其生命周期的现有 bean 实例**，这其实已经把它的作用完整的描述出来了：你要是真想用它，那也是**在跟其它框架集成时**，如果**其它框架的一些 Bean 实例无法让 SpringFramework 控制，但又需要注入一些由 SpringFramework 管理的对象**，那就可以用它了。

可能小伙伴有些疑惑，这个思路有什么使用场景吗？来，试想一个场景：

你自己编写了一个 Servlet ，而这个 Servlet 里面需要引入 IOC 容器中的一个存在的 Service ，应该如何处理呢？

根据 IOC 的思路，很明显还是两种思路：**DL 和 DI** ：

-  DL ：由 Servlet 自己取到 IOC 容器，并直接从 IOC 容器中获取到对应的 Service 并保存至成员属性中【拉】
- DI ：给需要注入的 Service 上标注 @Autowired 等自动注入的注解，并且让 IOC 容器识别这个 Servlet ，完成自动注入【推】

对于 DL 的实现，SpringFramework 有一种机制可以让 Servlet 取到 IOC 容器；而 DI 的实现，就需要这个 `AutowireCapableBeanFactory` 帮忙注入了。至于这部分怎么搞，咱放到后面介绍 Web 部分时再讲解。

#### 1.4.3 AutowireCapableBeanFactory不由ApplicationContext实现但可获取

> Note that this interface is not implemented by ApplicationContext facades, as it is hardly ever used by application code. That said, it is available from an application context too, accessible through ApplicationContext's getAutowireCapableBeanFactory() method.
>
> 请注意，该接口没有在 `ApplicationContext` 中实现，因为应用程序代码几乎从未使用过此接口。也就是说，它也可以从应用程序上下文中获得：可以通过 `ApplicationContext` 的 `getAutowireCapableBeanFactory()` 方法进行访问。

这段话已经很明确的表示了：**这个扩展你们一般用不到，但我给你取的方式，你们需要的时候自己拿**。

#### 1.4.4 AutowireCapableBeanFactory可以借助BeanFactoryAware注入

> You may also implement the org.springframework.beans.factory.BeanFactoryAware interface, which exposes the internal BeanFactory even when running in an ApplicationContext, to get access to an AutowireCapableBeanFactory: simply cast the passed-in BeanFactory to AutowireCapableBeanFactory.
>
> 您还可以实现 `BeanFactoryAware` 接口，该接口即使在 `ApplicationContext` 中运行时也公开内部 `BeanFactory` ，以访问 `AutowireCapableBeanFactory` ：只需将传入的 `BeanFactory` 强制转换为 `AutowireCapableBeanFactory` 。

这部分告诉咱，其实通过 `BeanFactoryAware` 接口注入的 `BeanFactory` 也就是 `AutowireCapableBeanFactory` ，可以直接强转拿来用。这个说实话，提不提这个都行，注入 `ApplicationContext` 一样可以拿到它。

### 1.5 ConfigurableBeanFactory【熟悉】

从类名中就能意识到，这个扩展已经具备了“**可配置**”的特性，这个概念咱要拿出来解释一下了。

#### 1.5.0 可读&可写

回想一开始学习面向对象编程时，就知道一个类的属性设置为 private 后，提供 **get** 方法则意味着该属性**可读**，提供 **set** 方法则意味着该属性**可写**。同样的，在 SpringFramework 的这些 `BeanFactory` ，包括后面的 `ApplicationContext` 中，都会有这样的设计。普通的 `BeanFactory` 只有 get 相关的操作，而 **Configurable** 开头的 `BeanFactory` 或者 `ApplicationContext` 就具有了 set 的操作：（节选自 `ConfigurableBeanFactory` 的方法列表）

```java
void setBeanClassLoader(@Nullable ClassLoader beanClassLoader);
    void setTypeConverter(TypeConverter typeConverter);
    void addBeanPostProcessor(BeanPostProcessor beanPostProcessor);
```

理解了这个概念，咱可以来看 `ConfigurableBeanFactory` 的文档注释了。

#### 1.5.1 ConfigurableBeanFactory提供可配置的功能

> Configuration interface to be implemented by most bean factories. Provides facilities to configure a bean factory, in addition to the bean factory client methods in the BeanFactory interface. 大多数 `BeanFactory` 的实现类都会实现这个带配置的接口。除了 `BeanFactory` 接口中的基础获取方法之外，还提供了配置 `BeanFactory` 的功能。

一上来就说明白了，`ConfigurableBeanFactory` 已经提供了**带配置的功能**，可以调用它里面定义的方法来对 `BeanFactory` 进行修改、扩展等。

#### 1.5.2 ConfigurableBeanFactory不推荐给开发者使用

> This bean factory interface is not meant to be used in normal application code: Stick to BeanFactory or org.springframework.beans.factory.ListableBeanFactory for typical needs. This extended interface is just meant to allow for framework-internal plug'n'play and for special access to bean factory configuration methods.
>
> `ConfigurableBeanFactory` 接口并不希望开发者在应用程序代码中使用，而是坚持使用 `BeanFactory` 或 `ListableBeanFactory` 。此扩展接口仅用于允许在框架内部进行即插即用，并允许对 `BeanFactory` 中的配置方法的特殊访问。

下面又说了，SpringFramework 不希望开发者用 `ConfigurableBeanFactory` ，而是老么实的用最根本的 `BeanFactory` ，原因也很简单，**程序在运行期间按理不应该对 `BeanFactory` 再进行频繁的变动**，此时只应该有读的动作，而不应该出现写的动作。

## 2. BeanFactory的实现类们

跟前面一样，借助 IDEA ，可以将 `BeanFactory` 的实现类取出来，形成一张图：（当然，这里面不是所有的，只包含最核心的实现类）

![image-20220428201149858](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220428201149.png)

注意到这里面不止有 `BeanFactory` 接口，还出现了几个陌生的接口（ `SingletonBeanRegistry` 、`BeanDefinitionRegistry` ），这些咱暂时不关心，放到后面的章节再解释。

### 2.1 AbstractBeanFactory【熟悉】

为什么一上来先说它，而不是它的父类 `DefaultSingletonBeanRegistry` 呢？很简单，咱介绍的是 `BeanFactory` 的实现类，`DefaultSingletonBeanRegistry` 并没有实现。

从类名上就知道，它是 `BeanFactory` 最基本的抽象实现，当然作为一个抽象类，一定是只具备了部分功能，不是完整的实现。先看一眼文档注释，对这个类有一个大概的了解。

#### 2.1.1 AbstractBeanFactory是最终BeanFactory的基础实现

> Abstract base class for BeanFactory implementations, providing the full capabilities of the ConfigurableBeanFactory SPI. Does not assume a listable bean factory: can therefore also be used as base class for bean factory implementations which obtain bean definitions from some backend resource (where bean definition access is an expensive operation).
>
> 它是 `BeanFactory` 接口最基础的抽象实现类，提供 `ConfigurableBeanFactory` SPI 的全部功能。我们不假定有一个可迭代的 `BeanFactory` ，因此也可以用作 `BeanFactory` 实现的父类，该实现可以从某些后端资源（其中 bean 定义访问是一项昂贵的操作）获取 bean 的定义。

这段注释说好理解，但又有点不好理解。其实它就想表达一个意思：`AbstractBeanFactory` 是作为 `BeanFactory` 接口下面的第一个抽象的实现类，它具有最基础的功能，并且它可以从配置源（之前看到的 xml 、LDAP 、RDBMS 等）获取 Bean 的定义信息，而这个 Bean 的定义信息就是 `BeanDefinition` ，已经提到了很多遍了，但是不要着急，咱后面会接触到的。

把这些都读完，剩下一个咱不认识的概念：**SPI** ，这是个什么东西呢？这里咱简单提一下，SPI 全称为 **Service Provider Interface**，是 jdk 内置的一种服务提供发现机制。说白了，它可以加载预先在特定位置下配置的一些类。关于 SPI 的部分，会在后面的 “模块装配高级” 中更详细的讲解。

#### 2.1.2 AbstractBeanFactory对Bean的支持

> This class provides a singleton cache (through its base class DefaultSingletonBeanRegistry), singleton/prototype determination, FactoryBean handling, aliases, bean definition merging for child bean definitions, and bean destruction (org.springframework.beans.factory.DisposableBean interface, custom destroy methods). Furthermore, it can manage a bean factory hierarchy (delegating to the parent in case of an unknown bean), through implementing the org.springframework.beans.factory.HierarchicalBeanFactory interface.
>
> 此类可以提供单实例 Bean 的缓存（通过其父类 `DefaultSingletonBeanRegistry` ），单例/原型 Bean 的决定，`FactoryBean` 处理，Bean 的别名，用于子 bean 定义的 bean 定义合并以及 bean 销毁（ `DisposableBean` 接口，自定义 `destroy` 方法）。此外，它可以通过实现 `HierarchicalBeanFactory` 接口来管理 `BeanFactory` 层次结构（在未知 bean 的情况下委托给父工厂）。

从这部分的描述中，咱看到除了在之前 `BeanFactory` 中介绍的功能和特性之外，它还扩展了另外一些功能：别名的处理（来源于 `AliasRegistry` 接口）、Bean 定义的合并（涉及到 Bean 的继承，后续章节讲解）、Bean 的销毁动作支持（ `DisposableBean` ）等等，这些特性有一些咱已经见过了，有一些还没有接触，咱后面都会来展开介绍。

#### 2.1.3 AbstractBeanFactory定义了模板方法

> The main template methods to be implemented by subclasses are getBeanDefinition and createBean, retrieving a bean definition for a given bean name and creating a bean instance for a given bean definition, respectively. Default implementations of those operations can be found in DefaultListableBeanFactory and AbstractAutowireCapableBeanFactory.
>
> 子类要实现的主要模板方法是 `getBeanDefinition` 和 `createBean` ，分别为给定的 bean 名称检索 bean 定义信息，并根据给定的 bean 定义信息创建 bean 的实例。这些操作的默认实现可以在 `DefaultListableBeanFactory` 和 `AbstractAutowireCapableBeanFactory` 中找到。

这一段告诉我们一个很关键的信息：SpringFramework 中大量使用**模板方法模式**来设计核心组件，它的思路是：**父类提供逻辑规范，子类提供具体步骤的实现**。在文档注释中，咱看到 `AbstractBeanFactory` 中对 `getBeanDefinition` 和 `createBean` 两个方法进行了规范上的定义，分别代表获取 Bean 的定义信息，以及创建 Bean 的实例，这两个方法都会在 SpringFramework 的 IOC 容器初始化阶段起到至关重要的作用。

多说一句，`createBean` 是 SpringFramework 能管控的所有 Bean 的创建入口。

### 2.2 AbstractAutowireCapableBeanFactory【掌握】

根据类名，可以看出来，它已经到了 `AutowireCapableBeanFactory` 接口的落地实现了，那就意味着，它可以实现组件的自动装配了。其实它的作用不仅仅是这么点，看小册标注的【掌握】也应该意识到它的重要，这个实现会比较详细的展开解释。

#### 2.2.1 AbstractAutowireCapableBeanFactory提供Bean的创建逻辑实现

> Abstract bean factory superclass that implements default bean creation, with the full capabilities specified by the RootBeanDefinition class. Implements the AutowireCapableBeanFactory interface in addition to AbstractBeanFactory's createBean method.
>
> 它是实现了默认 bean 创建逻辑的的抽象的 `BeanFactory` 实现类，它具有 `RootBeanDefinition` 类指定的全部功能。除了 `AbstractBeanFactory` 的 `createBean` 方法之外，还实现 `AutowireCapableBeanFactory` 接口。

一上来文档注释就告诉咱了，这个 `AbstractAutowireCapableBeanFactory` 继承了 `AbstractBeanFactory` 抽象类，还额外实现了 `AutowireCapableBeanFactory` 接口，那实现了这个接口就代表着，它可以**实现自动注入的功能**了。除此之外，它还把 `AbstractBeanFactory` 的 `createBean` 方法给实现了，代表它还具有**创建 Bean 的功能**。

这个地方要多说一嘴，其实 **`createBean` 方法也不是最终实现 Bean 的创建**，而是有另外一个叫 **`doCreateBean`** 方法，它同样在 `AbstractAutowireCapableBeanFactory` 中定义，而且是 **protected** 方法，没有子类重写它，算是它独享的了

#### 2.2.2 AbstractAutowireCapableBeanFactory实现了属性赋值和组件注入

> Provides bean creation (with constructor resolution), property population, wiring (including autowiring), and initialization. Handles runtime bean references, resolves managed collections, calls initialization methods, etc. Supports autowiring constructors, properties by name, and properties by type.
>
> 提供 Bean 的创建（具有构造方法的解析），属性填充，属性注入（包括自动装配）和初始化。处理运行时 Bean 的引用，解析托管集合，调用初始化方法等。支持自动装配构造函数，按名称的属性和按类型的属性。

这一段已经把 `AbstractAutowireCapableBeanFactory` 中实现的最最核心功能全部列出来了：**Bean 的创建、属性填充和依赖的自动注入、Bean 的初始化**。这部分是**创建 Bean 最核心的三个步骤**，后续在讲解 Bean 的完整生命周期时，会详细深入的讲解这部分，小伙伴要做好思想准备哦。

#### 2.2.3 AbstractAutowireCapableBeanFactory保留了模板方法

> The main template method to be implemented by subclasses is resolveDependency(DependencyDescriptor, String, Set, TypeConverter), used for autowiring by type. In case of a factory which is capable of searching its bean definitions, matching beans will typically be implemented through such a search. For other factory styles, simplified matching algorithms can be implemented.
>
> 子类要实现的主要模板方法是 `resolveDependency(DependencyDescriptor, String, Set, TypeConverter)` ，用于按类型自动装配。如果工厂能够搜索其 bean 定义，则通常将通过此类搜索来实现匹配的 bean 。对于其他工厂样式，可以实现简化的匹配算法。

跟 `AbstractBeanFactory` 不太一样，`AbstractAutowireCapableBeanFactory` 没有把全部模板方法都实现完，它保留了文档注释中提到的 `resolveDependency` 方法，这个方法的作用是**解析 Bean 的成员中定义的属性依赖关系**。

#### 2.2.4 AbstractAutowireCapableBeanFactory不负责BeanDefinition的注册

> Note that this class does not assume or implement bean definition registry capabilities. See DefaultListableBeanFactory for an implementation of the org.springframework.beans.factory.ListableBeanFactory and BeanDefinitionRegistry interfaces, which represent the API and SPI view of such a factory, respectively.
>
> 请注意，此类不承担或实现 bean 定义注册的功能。有关 `ListableBeanFactory` 和 `BeanDefinitionRegistry` 接口的实现，请参见`DefaultListableBeanFactory` ，它们分别表示该工厂的 API 和 SPI 视图。

最后一段注释，它想表明的是，`AbstractAutowireCapableBeanFactory` 实现了对 Bean 的创建、赋值、注入、初始化的逻辑，但对于 Bean 的定义是如何进入 `BeanFactory` 的，它不负责。这里面涉及到两个流程：**Bean 的创建**、**Bean 定义的进入**，这个咱放到后面 `BeanDefinition` 和 Bean 的完整生命周期中再详细解释。

### 2.3 DefaultListableBeanFactory【掌握】

这个类是**唯一一个目前使用的 `BeanFactory` 的落地实现了**，可想而知它的地位和重要性有多高，小伙伴一定要予以重视。

> Spring's default implementation of the ConfigurableListableBeanFactory and BeanDefinitionRegistry interfaces: a full-fledged bean factory based on bean definition metadata, extensible through post-processors.
>
> Spring 的 `ConfigurableListableBeanFactory` 和 `BeanDefinitionRegistry` 接口的默认实现，它时基于 Bean 的定义信息的的成熟的 `BeanFactory` 实现，它可通过后置处理器进行扩展。


翻看源码就知道，`DefaultListableBeanFactory` 已经没有 **abstract** 标注了，说明它可以算作一个**成熟的落地实现**了。

这里面要多注意的一个点：**`BeanDefinitionRegistry`** ，它又是个啥？字面意思理解为 **“Bean 定义的注册器”** ，它具体能干嘛咱先不用着急深入学习，先有个印象就好，下面的注释就解释它的用途了。

#### 2.3.2 DefaultListableBeanFactory会先注册Bean定义信息再创建Bean

> Typical usage is registering all bean definitions first (possibly read from a bean definition file), before accessing beans. Bean lookup by name is therefore an inexpensive operation in a local bean definition table, operating on pre-resolved bean definition metadata objects.
>
> 典型的用法是在访问 bean 之前先注册所有 bean 定义信息（可能是从有 bean 定义的文件中读取）。因此，按名称查找 Bean 是对本地 Bean 定义表进行的合理操作，该操作对预先解析的 Bean 定义元数据对象进行操作。

由此可见，`DefaultListableBeanFactory` 在 `AbstractAutowireCapableBeanFactory` 的基础上，完成了**注册 Bean 定义信息**的动作，而这个动作就是通过上面的 **`BeanDefinitionRegistry`** 来实现的。所以咱就可以知道一点，完整的 BeanFactory 对 Bean 的管理，应该是**先注册 Bean 的定义信息，再完成 Bean 的创建和初始化动作**。这个流程，在后面讲解完整的 Bean 生命周期时会详细讲到。

#### 2.3.3 DefaultListableBeanFactory不负责解析Bean定义文件

> Note that readers for specific bean definition formats are typically implemented separately rather than as bean factory subclasses: see for example PropertiesBeanDefinitionReader and org.springframework.beans.factory.xml.XmlBeanDefinitionReader.
>
> 请注意，特定 bean 定义信息格式的解析器通常是单独实现的，而不是作为 `BeanFactory` 的子类实现的，有关这部分的内容参见 `PropertiesBeanDefinitionReader` 和 `XmlBeanDefinitionReader` 。

从这一段话上，小伙伴有木有愈发强烈的意识到，SpringFramework 对于**组件的单一职责把控的非常好**？`BeanFactory` 作为一个统一管理 Bean 组件的容器，它的核心工作就是**控制 Bean 在创建阶段的生命周期**，而对于 Bean 从哪里来，如何被创建，都有哪些依赖要被注入，这些统统与它无关，而是有专门的组件来处理（就是包括上面提到的 `BeanDefinitionReader` 在内的一些其它组件）。

#### 2.3.4 DefaultListableBeanFactory的替代实现

> For an alternative implementation of the org.springframework.beans.factory.ListableBeanFactory interface, have a look at StaticListableBeanFactory, which manages existing bean instances rather than creating new ones based on bean definitions.
>
> 对于 `ListableBeanFactory` 接口的替代实现，请看一下 `StaticListableBeanFactory` ，它管理现有的 bean 实例，而不是根据 bean 定义创建新的 bean 实例。

这里它提了另一个实现 `StaticListableBeanFactory` ，它实现起来相对简单且功能也简单，因为它只能管理单实例 Bean ，而且没有跟 Bean 定义等相关的高级概念在里面，于是 SpringFramework 默认也不用它。

### 2.4 XmlBeanFactory【了解】

可能到这里部分了解之前背景的小伙伴会有疑问：`XmlBeanFactory` 呢？这个地方咱做一个解释。

在 SpringFramework 3.1 之后，`XmlBeanFactory` 正式被标注为**过时**，代替的方案是使用 `DefaultListableBeanFactory + XmlBeanDefinitionReader` ，这种设计更**符合组件的单一职责原则**，而且还有一点。自打 SpringFramework 3.0 之后出现了注解驱动的 IOC 容器，SpringFramework 就感觉这种 xml 驱动的方式不应该单独成为一种方案了，倒不如咱都各退一步，**搞一个通用的容器，都组合它来用**，这样就实现了**配置源载体分离**的目的了。

到这里，有关 `BeanFactory` 的重要接口扩展和实现，就了解的差不多了。小伙伴一定要对小册里标注【掌握】的内容有一定的认识和理解，最好能转换为自己的语言描述出来。

