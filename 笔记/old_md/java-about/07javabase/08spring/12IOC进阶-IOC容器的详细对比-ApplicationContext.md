---
title: 12IOC进阶-IOC容器的详细对比-ApplicationContext
---

推荐使用 `ApplicationContext` 而不是 `BeanFactory` ，因为 `ApplicationContext` 相比较 `BeanFactory` 扩展的实在是太多了：

|                                                              | **BeanFactory** | ApplicationContext |
| ------------------------------------------------------------ | --------------- | ------------------ |
| Bean instantiation/wiring —— Bean的实例化和属性注入          | Yes             | Yes                |
| Integrated lifecycle management —— **生命周期管理**          |                 | Yes                |
| Automatic `BeanPostProcessor` registration —— **Bean后置处理器的支持** |                 | Yes                |
| Automatic `BeanFactoryPostProcessor` registration —— **BeanFactory后置处理器的支持** |                 | Yes                |
| Convenient `MessageSource` access (for internalization) —— **消息转换服务（国际化）** |                 | Yes                |
| Built-in `ApplicationEvent` publication mechanism —— **事件发布机制（事件驱动）** |                 | Yes                |

那既然是这样，咱就一定要更深入的了解 `ApplicationContext` 才是。

## 1. ApplicationContext和它的上下辈们

![image-20220428204109736](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220428204109.png)

可以发现 `ApplicationContext` 不仅继承了 `BeanFactory` 的两个扩展接口，还继承了其它几个接口，咱都一并来讲解。

### 1.1 ApplicationContext【掌握】

这是主角之一，但它的文档注释却不是很长，咱一起来读一下。

#### 1.1.1 ApplicationContext是SpringFramework最核心接口

> Central interface to provide configuration for an application. This is read-only while the application is running, but may be reloaded if the implementation supports this.
>
> 它是为应用程序提供配置的中央接口。在应用程序运行时，它是只读的，但是如果受支持的话，它可以重新加载。

很言简意赅，`ApplicationContext` 就是中央接口，它就是 SpringFramework 的最最核心。另外它多提了一个概念：**重新加载**，这个概念很关键，咱会在后面介绍 `ApplicationContext` 的抽象实现中着重介绍它。

#### 1.1.2 ApplicationContext组合多个功能接口

> An ApplicationContext provides:
>
> - Bean factory methods for accessing application components. Inherited from ListableBeanFactory.
> - The ability to load file resources in a generic fashion. Inherited from the ResourceLoader interface.
> - The ability to publish events to registered listeners. Inherited from the ApplicationEventPublisher interface.
> - The ability to resolve messages, supporting internationalization. Inherited from the MessageSource interface.
> - Inheritance from a parent context. Definitions in a descendant context will always take priority. This means, for example, that a single parent context can be used by an entire web application, while each servlet has its own child context that is independent of that of any other servlet.
>
> `ApplicationContext` 提供：
>
> - 用于访问应用程序组件的 Bean 工厂方法。继承自 `ListableBeanFactory` 。
> - 以通用方式加载文件资源的能力。继承自 `ResourceLoader` 接口。
> - 能够将事件发布给注册的监听器。继承自 `ApplicationEventPublisher` 接口。
> - 解析消息的能力，支持国际化。继承自 `MessageSource` 接口。
> - 从父上下文继承。在子容器中的定义将始终优先。例如，这意味着整个 Web 应用程序都可以使用单个父上下文，而每个 servlet 都有其自己的子上下文，该子上下文独立于任何其他 servlet 的子上下文。

这一段它列出了 `ApplicationContext` 的核心功能，注意这里面与上面表里面列举的内容有所不同，这里主要介绍的是功能和来源的接口。

这里面有一点需要注意，`ApplicationContext` 也是支持层级结构的，但这里它的描述是**父子上下文**，这个概念要区分理解。**上下文中包含容器，但又不仅仅是容器。容器只负责管理 Bean ，但上下文中还包括动态增强、资源加载、事件监听机制等多方面扩展功能。**

#### 1.1.3 ApplicationContext负责部分回调注入

> In addition to standard BeanFactory lifecycle capabilities, ApplicationContext implementations detect and invoke ApplicationContextAware beans as well as ResourceLoaderAware , ApplicationEventPublisherAware and MessageSourceAware beans.
>
> 除了标准的 `BeanFactory` 生命周期功能外，`ApplicationContext` 实现还检测并调用 `ApplicationContextAware` bean 以及 `ResourceLoaderAware` bean， `ApplicationEventPublisherAware` 和 `MessageSourceAware` bean。

看到这个，可能小伙伴们会有些惊讶，这里面有些 Aware 接口没见过啊，它们也能注入吗？先别着急，往上看看 `ApplicationContext` 继承的接口们：

- ResourceLoader → ResourceLoaderAware
- ApplicationEventPublisher → ApplicationEventPublisherAware
- MessageSource → MessageSourceAware

是不是突然明白了什么？这些 Aware 注入的最终结果还是 **`ApplicationContext`** 本身啊！

### 1.2 ConfigurableApplicationContext【掌握】

与上一章的 `ConfigurableBeanFactory` 类似，它也给 `ApplicationContext` 提供了 **“可写”** 的功能，实现了该接口的实现类可以被客户端代码修改内部的某些配置。下面还是看看文档注释的描述：

#### 1.2.1 ConfigurableApplicationContext提供了可配置的可能

> SPI interface to be implemented by most if not all application contexts. Provides facilities to configure an application context in addition to the application context client methods in the ApplicationContext interface.
>
> 它是一个支持 SPI 的接口，它会被大多数（如果不是全部）应用程序上下文的落地实现。除了 `ApplicationContext` 接口中的应用程序上下文客户端方法外，还提供了用于配置应用程序上下文的功能。

这里又提到 SPI 了，咱回头讲到模块装配时再解释这个概念。后面它又提了，`ConfigurableApplicationContext` 给 `ApplicationContext` 添加了用于配置的功能，这个说法可以从接口方法中得以体现。`ConfigurableApplicationContext` 中扩展了 `setParent` 、`setEnvironment` 、`addBeanFactoryPostProcessor` 、`addApplicationListener` 等方法，都是可以改变 `ApplicationContext` 本身的方法。

#### 1.2.2 ConfigurableApplicationContext只希望被调用启动和关闭

> 
> Configuration and lifecycle methods are encapsulated here to avoid making them obvious to ApplicationContext client code. The present methods should only be used by startup and shutdown code.
>
> 配置和与生命周期相关的方法都封装在这里，以避免暴露给 `ApplicationContext` 的调用者。本接口的方法仅应由启动和关闭代码使用。

由这段话也能明白，`ConfigurableApplicationContext` 本身扩展了一些方法，但是它一般情况下不希望让咱开发者调用，而是只调用启动（refresh）和关闭（close）方法。注意这个一般情况是在程序运行期间的业务代码中，但如果是为了定制化 `ApplicationContext` 或者对其进行扩展，`ConfigurableApplicationContext` 的扩展则会成为切入的主目标。

好了，对于 `ApplicationContext` 的子接口就这一个，但它还实现了几个其他的接口，咱也一起来看看。

### 1.3 EnvironmentCapable【熟悉】

**capable** 本意为“有能力的”，在这里解释为 **“携带/组合”** 更为合适。

**在 SpringFramework 中，以 Capable 结尾的接口，通常意味着可以通过这个接口的某个特定的方法（通常是 `getXXX()` ）拿到特定的组件。**

按照这个概念说法，这个 `EnvironmentCapable` 接口中就应该通过一个 `getEnvironment()` 方法拿到 **`Environment`** ，事实上也确实如此：

```java
public interface EnvironmentCapable {
	Environment getEnvironment();
}
```

下面咱还是看看官方是如何解释这个接口的。

#### 1.3.1 ApplicationContext都具有EnvironmentCapable的功能

> Interface indicating a component that contains and exposes an Environment reference.
>
> All Spring application contexts are EnvironmentCapable, and the interface is used primarily for performing instanceof checks in framework methods that accept BeanFactory instances that may or may not actually be ApplicationContext instances in order to interact with the environment if indeed it is available.
>
> 它是具有获取并公开 `Environment` 引用的接口。
>
> 所有 Spring 的 `ApplicationContext` 都具有 `EnvironmentCapable` 功能，并且该接口主要用于在接受 `BeanFactory` 实例的框架方法中执行 **instanceof** 检查，以便可以与环境进行交互（如果实际上是 `ApplicationContext` 实例）。

从这部分可以知道，`ApplicationContext` 都实现了这个 `EnvironmentCapable` 接口，也就代表着所有的 `ApplicationContext` 的实现类都可以取到 `Environment` 抽象。至于 `Environment` 是什么，咱后面 IOC 高级部分会解释，这里简单解释一下。

`Environment` 是 SpringFramework 中抽象出来的类似于**运行环境**的**独立抽象**，它内部存放着应用程序运行的一些配置。

现阶段小伙伴可以这么理解：基于 SpringFramework 的工程，在运行时包含两部分：**应用程序本身、应用程序的运行时环境**。

#### 1.3.2 ConfigurableApplicationContext可以获取ConfigurableEnvironment

> As mentioned, ApplicationContext extends EnvironmentCapable, and thus exposes a getEnvironment() method; however, ConfigurableApplicationContext redefines getEnvironment() and narrows the signature to return a ConfigurableEnvironment. The effect is that an Environment object is 'read-only' until it is being accessed from a ConfigurableApplicationContext, at which point it too may be configured.
>
> 如上面所述，`ApplicationContext` 扩展了 `EnvironmentCapable` ，因此公开了 `getEnvironment()` 方法；但是，`ConfigurableApplicationContext` 重新定义了 `getEnvironment()` 并缩小了签名范围，以返回 `ConfigurableEnvironment` 。结果是环境对象是 “只读的” ，直到从 `ConfigurableApplicationContext` 访问它为止，此时也可以对其进行配置。

这里又看到 **Configurable** 的概念了，对于**可配置的** `ApplicationContext` ，就可以获取到**可配置的** `Environment` 抽象，这个也不难理解吧。

### 1.4 MessageSource【熟悉】

上面咱也看到了，它是支持国际化的组件。关于国际化的内容，小册计划放到 SpringWebMvc 部分来一起讲解，这里先简单了解下即可。

**国际化，是针对不同地区、不同国家的访问，可以提供对应的符合用户阅读习惯（语言）的页面和数据。**对于不同地区、使用不同语言的用户，需要分别提供对应语言环境的表述。

对于国际化的概念，目前先了解即可。下面看看 SpringFramework 中是如何设计国际化的：

> Strategy interface for resolving messages, with support for the parameterization and internationalization of such messages. Spring provides two out-of-the-box implementations for production:
>
> - org.springframework.context.support.ResourceBundleMessageSource: built on top of the standard java.util.ResourceBundle, sharing its limitations.
> - org.springframework.context.support.ReloadableResourceBundleMessageSource: highly configurable, in particular with respect to reloading message definitions.
>
> 用于解析消息的策略接口，并支持消息的参数化和国际化。SpringFramework 为生产提供了两种现有的实现：
>
> - `ResourceBundleMessageSource`：建立在标准 `java.util.ResourceBundle` 之上，共享其局限性。
> - `ReloadableResourceBundleMessageSource`：高度可配置，尤其是在重新加载消息定义方面。

这里它又提到了关于 Java 原生的国际化，咱都放一放，现阶段只知道 SpringFramework 支持国际化就 OK 。

### 1.5 ApplicationEventPublisher【熟悉】

类名可以理解为，它是**事件的发布器**。SpringFramework 内部支持很强大的事件监听机制，而 ApplicationContext 作为容器的最顶级，自然也要实现观察者模式中**广播器**的角色。文档注释中对于它的描述也是异常的简单：

> Interface that encapsulates event publication functionality. Serves as a super-interface for ApplicationContext.
>
> 封装事件发布功能的接口，它作为 `ApplicationContext` 的父接口。

所以它就是一个很简单的事件发布/广播器而已，后续在 IOC 进阶部分学习事件驱动机制时会讲解它。

### 1.6 ResourcePatternResolver【熟悉】

这个接口可能是这几个扩展里最复杂的一个，从类名理解可以解释为“**资源模式解析器**”，实际上它是**根据特定的路径去解析资源文件**的。从下面的文档注释中，咱就可以深刻的体会 `ResourcePatternResolver` 的作用和扩展。

#### 1.6.1 ResourcePatternResolver是ResourceLoader的扩展

> Strategy interface for resolving a location pattern (for example, an Ant-style path pattern) into Resource objects. This is an extension to the ResourceLoader interface. A passed-in ResourceLoader (for example, an org.springframework.context.ApplicationContext passed in via org.springframework.context.ResourceLoaderAware when running in a context) can be checked whether it implements this extended interface too.
>
> 它是一个策略接口，用于将位置模式（例如，Ant 样式的路径模式）解析为 `Resource` 对象。 这是 `ResourceLoader` 接口的扩展。可以检查传入的 `ResourceLoader`（例如，在上下文中运行时通过 `ResourceLoaderAware` 传入的 `ApplicationContext` ）是否也实现了此扩展接口。

可以发现，它本身还是 `ResourceLoader` 的扩展，`ResourceLoader` 实现最基本的解析，`ResourcePatternResolver` 可以支持 **Ant** 形式的带星号 ( * ) 的路径解析（ Ant 形式会在下面看到）。

#### 1.6.2 ResourcePatternResolver的实现方式有多种

> PathMatchingResourcePatternResolver is a standalone implementation that is usable outside an ApplicationContext, also used by ResourceArrayPropertyEditor for populating Resource array bean properties.
>
> `PathMatchingResourcePatternResolver` 是一个独立的实现，可在 `ApplicationContext` 外部使用，`ResourceArrayPropertyEditor` 使用它来填充 `Resource` 数组中 Bean 属性。

这一段列出了一种 `ResourcePatternResolver` 的独立实现：**基于路径匹配的解析器**，这种扩展实现的特点是会**根据特殊的路径来返回多个匹配到的资源文件**。

#### 1.6.3 ResourcePatternResolver支持的Ant路径模式匹配

> Can be used with any sort of location pattern (e.g. "/WEB-INF/*-context.xml"): Input patterns have to match the strategy implementation. This interface just specifies the conversion method rather than a specific pattern format.
>
> 可以与任何类型的位置模式一起使用（例如 `"/WEB-INF/*-context.xml"` ）：输入模式必须与策略实现相匹配。该接口仅指定转换方法，而不是特定的模式格式。

根据前面的文档注释也知道，它支持的是 Ant 风格的匹配模式，这种模式可以有如下写法：

-  /WEB-INF/*.xml ：匹配 /WEB-INF 目录下的任意 xml 文件
- */WEB-INF/**/beans-*.xml ：匹配 /WEB-INF 下面任意层级目录的 beans- 开头的 xml 文件
- /**/*.xml ：匹配任意 xml 文件

#### 1.6.4 ResourcePatternResolver可以匹配类路径下的文件

> This interface also suggests a new resource prefix "classpath*:" for all matching resources from the class path. Note that the resource location is expected to be a path without placeholders in this case (e.g. "/beans.xml"); JAR files or classes directories can contain multiple files of the same name.
>
> 此接口还为类路径中的所有匹配资源建议一个新的资源前缀 `"classpath*: "`。请注意，在这种情况下，资源位置应该是没有占位符的路径（例如 `"/beans.xml"` ）； jar 文件或类目录可以包含多个相同名称的文件。

文档注释中又提到了 `ResourcePatternResolver` 还可以匹配类路径下的资源文件，方式是在资源路径中加一个 `classpath*:` 的前缀。由此咱也可以知道，`ResourcePatternResolver` 不仅可以匹配 Web 工程中 webapps 的文件，也可以匹配 classpath 下的文件了。

到这里，关于 `ApplicationContext` 相关的接口咱就大概都了解了，下面是 `ApplicationContext` 的实现类们，这里面涉及的内容可能比较难记，小伙伴根据我标注的实现类的重要程度来理解和记录即可。

## 2. ApplicationContext的实现类们

![image-20220428205110314](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220428205110.png)

这里面涉及到的实现类咱一个一个列出来看。

### 2.1 AbstractApplicationContext【掌握*】

这个类是 `ApplicationContext` **最最最最核心的实现类，没有之一**。`AbstractApplicationContext` 中定义和实现了**绝大部分应用上下文的特性和功能**，一定要给它**最大的重视**。

#### 2.1.1 AbstractApplicationContext只构建功能抽象

> Abstract implementation of the ApplicationContext interface. Doesn't mandate the type of storage used for configuration; simply implements common context functionality. Uses the Template Method design pattern, requiring concrete subclasses to implement abstract methods.
>
> `ApplicationContext` 接口的抽象实现。不强制用于配置的存储类型；简单地实现通用上下文功能。使用模板方法模式，需要具体的子类来实现抽象方法。]

一开始人家就解释了，`AbstractApplicationContext` 的抽象实现主要是规范功能（借助模板方法），实际的动作它不管，让子类自行去实现。

#### 2.1.2 AbstractApplicationContext可以处理特殊类型的Bean

> In contrast to a plain BeanFactory, an ApplicationContext is supposed to detect special beans defined in its internal bean factory: Therefore, this class automatically registers BeanFactoryPostProcessors, BeanPostProcessors, and ApplicationListeners which are defined as beans in the context.
>
> 与普通的 `BeanFactory` 相比，`ApplicationContext` 应该能够检测在其内部 Bean 工厂中定义的特殊 bean ：因此，此类自动注册在上下文中定义为 bean 的 `BeanFactoryPostProcessors` ，`BeanPostProcessors` 和 `ApplicationListeners` 。

`ApplicationContext` 比 `BeanFactory` 强大的地方是支持更多的机制，这里面就包括了**后置处理器、监听器**等，而这些器，说白了也都是**一个一个的 Bean** ，`BeanFactory` 不会把它们区别对待，但是 `ApplicationContext` 就可以区分出来，并且赋予他们发挥特殊能力的机会。

#### 2.1.3 AbstractApplicationContext可以转换为多种类型

> A MessageSource may also be supplied as a bean in the context, with the name "messageSource"; otherwise, message resolution is delegated to the parent context. Furthermore, a multicaster for application events can be supplied as an "applicationEventMulticaster" bean of type ApplicationEventMulticaster in the context; otherwise, a default multicaster of type SimpleApplicationEventMulticaster will be used.
>
> 一个 `MessageSource` 也可以在上下文中作为一个普通的 bean 提供，名称为 `"messageSource"` 。否则，将消息解析委托给父上下文。此外，可以在上下文中将用于应用程序事件的广播器作为类型为 `ApplicationEventMulticaster` 的 `"applicationEventMulticaster"` bean 提供。否则，将使用类型为 `SimpleApplicationEventMulticaster` 的默认事件广播器。

咱上面看到了，`ApplicationContext` 实现了国际化的接口 `MessageSource` 、事件广播器的接口 `ApplicationEventMulticaster` ，那作为容器，它也会**把自己看成一个 Bean** ，以支持不同类型的组件注入需要。

#### 2.1.4 AbstractApplicationContext提供默认的加载资源文件策略

> Implements resource loading by extending DefaultResourceLoader. Consequently treats non-URL resource paths as class path resources (supporting full class path resource names that include the package path, e.g. "mypackage/myresource.dat"), unless the getResourceByPath method is overridden in a subclass.
>
> 通过扩展 `DefaultResourceLoader` 实现资源加载。因此，除非在子类中覆盖了 `getResourceByPath()` 方法，否则将非 URL 资源路径视为类路径资源（支持包含包路径的完整类路径资源名称，例如 `"mypackage/myresource.dat"` ）。

默认情况下，`AbstractApplicationContext` 加载资源文件的策略是直接继承了 `DefaultResourceLoader` 的策略，从类路径下加载；但在 Web 项目中，可能策略就不一样了，它可以从 `ServletContext` 中加载（扩展的子类 `ServletContextResourceLoader` 等）。

看完了文档，小册在这个章节中多提一句：`AbstractApplicationContext` 中定义了一个特别特别重要的方法，它是控制 `ApplicationContext` 生命周期的核心方法：**`refresh`** 。下面是基本的方法定义，小伙伴们先对此有个印象即可，不需要深入进去看源码。对于源码的执行，小伙伴可以学完这些基础之后，参考《SpringBoot 源码解读与原理分析》的 11-15 章，学习 `refresh` 方法的核心执行。

```java
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        // Prepare this context for refreshing.
        // 1. 初始化前的预处理
        prepareRefresh();

        // Tell the subclass to refresh the internal bean factory.
        // 2. 获取BeanFactory，加载所有xml配置文件中bean的定义信息（未实例化）
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

        // Prepare the bean factory for use in this context.
        // 3. BeanFactory的预处理配置
        prepareBeanFactory(beanFactory);

        try {
            // Allows post-processing of the bean factory in context subclasses.
            // 4. 准备BeanFactory完成后进行的后置处理
            postProcessBeanFactory(beanFactory);

            // Invoke factory processors registered as beans in the context.
            // 5. 执行BeanFactory创建后的后置处理器
            invokeBeanFactoryPostProcessors(beanFactory);

            // Register bean processors that intercept bean creation.
            // 6. 注册Bean的后置处理器
            registerBeanPostProcessors(beanFactory);

            // Initialize message source for this context.
            // 7. 初始化MessageSource
            initMessageSource();

            // Initialize event multicaster for this context.
            // 8. 初始化事件派发器
            initApplicationEventMulticaster();

            // Initialize other special beans in specific context subclasses.
            // 9. 子类的多态onRefresh
            onRefresh();

            // Check for listener beans and register them.
            // 10. 注册监听器
            registerListeners();
          
            //到此为止，BeanFactory已创建完成

            // Instantiate all remaining (non-lazy-init) singletons.
            // 11. 初始化所有剩下的单例Bean
            finishBeanFactoryInitialization(beanFactory);

            // Last step: publish corresponding event.
            // 12. 完成容器的创建工作
            finishRefresh();
        } // catch ......

        finally {
            // Reset common introspection caches in Spring's core, since we
            // might not ever need metadata for singleton beans anymore...
            // 13. 清除缓存
            resetCommonCaches();
        }
    }
}
```

### 2.2 GenericApplicationContext【熟悉】

咱先从注解驱动的 IOC 容器看起，`GenericApplicationContext` 已经是一个普通的类（非抽象类）了，它里面已经具备了 `ApplicationContext` 基本的所有能力了。咱来看看官方怎么描述它的。

#### 2.2.1 GenericApplicationContext组合了BeanFactory

> Generic ApplicationContext implementation that holds a single internal DefaultListableBeanFactory instance and does not assume a specific bean definition format. Implements the BeanDefinitionRegistry interface in order to allow for applying any bean definition readers to it.
>
> 通用 `ApplicationContext` 的实现，该实现拥有一个内部 `DefaultListableBeanFactory` 实例，并且不采用特定的 bean 定义格式。另外它实现 `BeanDefinitionRegistry` 接口，以便允许将任何 bean 定义读取器应用于该容器中。

注意划重点：**`GenericApplicationContext` 中组合了一个 `DefaultListableBeanFactory` ！！！\**由此可以得到一个非常非常重要的信息：\**`ApplicationContext` 并不是继承了 `BeanFactory` 的容器，而是组合了 `BeanFactory` ！**

然后后面它说了它还实现了 `BeanDefinitionRegistry` 接口，上一章咱简单说了它是 “Bean 定义的注册器”，它与 Bean 的定义信息有关，咱往后放一放。

#### 2.2.2 GenericApplicationContext借助BeanDefinitionRegistry处理特殊Bean

> Typical usage is to register a variety of bean definitions via the BeanDefinitionRegistry interface and then call refresh() to initialize those beans with application context semantics (handling org.springframework.context.ApplicationContextAware, auto-detecting BeanFactoryPostProcessors, etc).
>
> 典型的用法是通过 `BeanDefinitionRegistry` 接口注册各种 Bean 的定义，然后调用 `refresh()` 以使用应用程序上下文语义来初始化这些 Bean（处理 `ApplicationContextAware` ，自动检测 `BeanFactoryPostProcessors` 等）。

这里又看到了 **`BeanDefinitionRegistry`** 了，上一章咱也提了一嘴它叫 **Bean 定义的注册器**，`GenericApplicationContext` 实现了它，可以自定义注册一些 Bean 。然而在 `GenericApplicationContext` 中，它实现的定义注册方法 `registerBeanDefinition` ，在底层还是调用的 `DefaultListableBeanFactory` 执行 `registerBeanDefinition` 方法，说明它也没有对此做什么扩展。

#### 2.2.3 GenericApplicationContext只能刷新一次

> In contrast to other ApplicationContext implementations that create a new internal BeanFactory instance for each refresh, the internal BeanFactory of this context is available right from the start, to be able to register bean definitions on it. refresh() may only be called once.
>
> 与为每次刷新创建一个新的内部 `BeanFactory` 实例的其他 `ApplicationContext` 实现相反，此上下文的内部 `BeanFactory` 从一开始就可用，以便能够在其上注册 Bean 定义。 `refresh()` 只能被调用一次。

这句话不是很好理解，小册换一种说法尝试着解释一下：由于 `GenericApplicationContext` 中组合了一个 `DefaultListableBeanFactory` ，而这个 `BeanFactory` 是在 `GenericApplicationContext` 的**构造方法中就已经初始化好**了，那么初始化好的 `BeanFactory` 就**不允许在运行期间被重复刷新了**。下面是源码中的实现：

```java
public GenericApplicationContext() {
    // 内置的beanFactory在GenericApplicationContext创建时就已经初始化好了
    this.beanFactory = new DefaultListableBeanFactory();
}

protected final void refreshBeanFactory() throws IllegalStateException {
    if (!this.refreshed.compareAndSet(false, true)) {
        // 利用CAS，保证只能设置一次true，如果出现第二次，就抛出重复刷新异常
        throw new IllegalStateException(
                "GenericApplicationContext does not support multiple refresh attempts: just call 'refresh' once");
    }
    this.beanFactory.setSerializationId(getId());
}
```

可如果是这样的话，它的文档注释为什么不直接说就可以呢，还非得加一句“与...相反”，那是因为有另外一类 `ApplicationContext` 它的设计不是这样的，咱下面会讲到，它就是 `AbstractRefreshableApplicationContext` 。

#### 2.2.4 GenericApplicationContext的替代方案是用xml

> For the typical case of XML bean definitions, simply use ClassPathXmlApplicationContext or FileSystemXmlApplicationContext, which are easier to set up - but less flexible, since you can just use standard resource locations for XML bean definitions, rather than mixing arbitrary bean definition formats. The equivalent in a web environment is org.springframework.web.context.support.XmlWebApplicationContext.
>
> 对于 XML Bean 定义的典型情况，只需使用 `ClassPathXmlApplicationContext` 或 `FileSystemXmlApplicationContext` ，因为它们更易于设置（但灵活性较差，因为只能将从标准的资源配置文件中读取 XML Bean 定义，而不能混合使用任意 Bean 定义的格式）。在 Web 环境中，替代方案是 `XmlWebApplicationContext` 。

这段注释它提到了 xml 的配置，咱之前也讲过，**注解驱动的 IOC 容器可以导入 xml 配置文件**，不过如果大多数都是 xml 配置的话，官方建议还是直接用 `ClassPathXmlApplicationContext` 或者 `FileSystemXmlApplicationContext` 就好。对比起灵活度来讲，咱也能清晰地认识到：注解驱动的方式在开发时很灵活，但如果需要修改配置时，可能需要重新编译配置类；xml 驱动的方式在修改配置时直接修改即可，不需要做任何额外的操作，但能配置的内容实在是有些有限。所以这也建议咱开发者在实际开发中，要权衡对比着使用。

#### 2.2.5 GenericApplicationContext不支持特殊Bean定义的可刷新读取

> For custom application context implementations that are supposed to read special bean definition formats in a refreshable manner, consider deriving from the AbstractRefreshableApplicationContext base class.
>
> 对于应该以可刷新方式读取特殊bean定义格式的自定义应用程序上下文实现，请考虑从 `AbstractRefreshableApplicationContext` 基类派生。

这个概念似乎很难理解，咱大可不必在意啦，它是解释怎么扩展自定义 `ApplicationContext` 实现的，咱目前也搞不了这些复杂的东西 ~ ~ ~

### 2.3 AbstractRefreshableApplicationContext【熟悉】

类名直译为 “可刷新的 ApplicationContext ”，它跟上面 `GenericApplicationContext` 的最大区别之一就是它**可以被重复刷新**，那它里面的设计肯定也会不一样咯，咱赶紧来看一看吧！

#### 2.3.1 AbstractRefreshableApplicationContext支持多次刷新

> Base class for ApplicationContext implementations which are supposed to support multiple calls to refresh(), creating a new internal bean factory instance every time. Typically (but not necessarily), such a context will be driven by a set of config locations to load bean definitions from.
>
> 它是 `ApplicationContext` 接口实现的抽象父类，应该支持多次调用 `refresh()` 方法，每次都创建一个新的内部 `BeanFactory` 实例。通常（但不是必须）这样的上下文将由一组配置文件驱动，以从中加载 bean 的定义信息。

注释中明确说明了：每次都**会创建一个新的内部的 `BeanFactory` 实例**（也就是 `DefaultListableBeanFactory` ），而整个 `ApplicationContext` 的初始化中不创建。通过源码来看，它的内部也是**组合 `DefaultListableBeanFactory`** ，但构造方法中什么也没有干：

```java
public abstract class AbstractRefreshableApplicationContext extends AbstractApplicationContext {
    @Nullable
    private DefaultListableBeanFactory beanFactory;

    public AbstractRefreshableApplicationContext() {
    }
```

那它是怎么创建 `BeanFactory` 的呢？借助 IDEA 观察方法列表，其中就有一个方法叫 `creatBeanFactory` ：

```java
protected DefaultListableBeanFactory createBeanFactory() {
    return new DefaultListableBeanFactory(getInternalParentBeanFactory());
}
```

#### 2.3.2 AbstractRefreshableApplicationContext刷新的核心是加载Bean定义信息

> The only method to be implemented by subclasses is loadBeanDefinitions, which gets invoked on each refresh. A concrete implementation is supposed to load bean definitions into the given DefaultListableBeanFactory, typically delegating to one or more specific bean definition readers. Note that there is a similar base class for WebApplicationContexts.
>
> 子类唯一需要实现的方法是 `loadBeanDefinitions` ，它在每次刷新时都会被调用。一个具体的实现应该将 bean 的定义信息加载到给定的 `DefaultListableBeanFactory` 中，通常委托给一个或多个特定的 bean 定义读取器。 注意，`WebApplicationContexts` 有一个类似的父类。

这段话告诉我们，既然是可刷新的 `ApplicationContext` ，那它里面存放的 **Bean 定义信息应该是可以被覆盖加载的**。由于 `AbstractApplicationContext` 就已经实现了 `ConfigurableApplicationContext` 接口，容器本身可以重复刷新，那么每次刷新时就应该重新加载 Bean 的定义信息，以及初始化 Bean 实例。

另外它还说，在 Web 环境下也有一个类似的父类，猜都能猜到肯定是名字里多了个 Web ：`AbstractRefreshableWebApplicationContext` ，它的特征与 `AbstractRefreshableApplicationContext` 基本一致，不重复解释。

#### 2.3.3 AbstractRefreshableWebApplicationContext额外扩展了Web环境的功能

> org.springframework.web.context.support.AbstractRefreshableWebApplicationContext provides the same subclassing strategy, but additionally pre-implements all context functionality for web environments. There is also a pre-defined way to receive config locations for a web context.
>
> `AbstractRefreshableWebApplicationContext` 提供了相同的子类化策略，但是还预先实现了 Web 环境的所有上下文功能。还有一种预定义的方式来接收 Web 上下文的配置位置。

#### 2.3.4 几个重要的最终实现类

> Concrete standalone subclasses of this base class, reading in a specific bean definition format, are ClassPathXmlApplicationContext and FileSystemXmlApplicationContext, which both derive from the common AbstractXmlApplicationContext base class; org.springframework.context.annotation.AnnotationConfigApplicationContext supports @Configuration-annotated classes as a source of bean definitions.
>
> 以特定的 bean 定义格式读取的该父类的具体独立子类是 `ClassPathXmlApplicationContext` 和 `FileSystemXmlApplicationContext` ，它们均从 `AbstractXmlApplicationContext` 基类扩展。 `AnnotationConfigApplicationContext` 支持 `@Configuration` 注解的类作为 `BeanDefinition` 的源。

最后一段它提了几个内置的最终实现类，分别是基于 xml 配置的 `ClassPathXmlApplicationContext` 和 `FileSystemXmlApplicationContext` ，以及基于注解启动的 `AnnotationConfigApplicationContext` 。这些咱已经有了解了，下面也会展开来讲。

### 2.4 AbstractRefreshableConfigApplicationContext【了解】

与上面的 `AbstractRefreshableApplicationContext` 相比较，只是多了一个 **Config** ，说明它有**扩展跟配置相关的特性**。翻看方法列表，可以看到有它自己定义的 `getConfigLocations` 方法，意为“**获取配置源路径**”，由此也就证明它确实有配置的意思了。

### 2.5 AbstractXmlApplicationContext【掌握】

到这里，xml 终于浮出水面了，它就是最终 `ClassPathXmlApplicationContext` 和 `FileSystemXmlApplicationContext` 的直接父类了。

#### 2.5.1 AbstractXmlApplicationContext已具备基本全部功能

> Convenient base class for ApplicationContext implementations, drawing configuration from XML documents containing bean definitions understood by an XmlBeanDefinitionReader. Subclasses just have to implement the getConfigResources and/or the getConfigLocations method. Furthermore, they might override the getResourceByPath hook to interpret relative paths in an environment-specific fashion, and/or getResourcePatternResolver for extended pattern resolution.
>
> 方便的 `ApplicationContext` 父类，从包含 `XmlBeanDefinitionReader` 解析的 `BeanDefinition` 的 XML 文档中提取配置。
>
> 子类只需要实现 `getConfigResources` 和/或 `getConfigLocations` 方法。此外，它们可能会覆盖 `getResourceByPath` 的钩子回调，以特定于环境的方式解析相对路径，和/或 `getResourcePatternResolver` 来扩展模式解析。

由于 `AbstractXmlApplicationContext` 已经接近于最终的 xml 驱动 IOC 容器的实现了，所以它应该有基本上所有的功能。又根据子类的两种不同的配置文件加载方式，说明**加载配置文件的策略是不一样的**，所以文档注释中有说子类只需要实现 `getConfigLocations` 这样的方法就好。

对于 `AbstractXmlApplicationContext` ，还有一个非常关键的部分需要咱知道，那就是加载到配置文件后如何处理。

#### 2.5.2 AbstractXmlApplicationContext中有loadBeanDefinitions的实现

定位到源码中，可以在 `AbstractXmlApplicationContext` 中找到 `loadBeanDefinitions` 的实现：

```java
@Override
protected void loadBeanDefinitions(DefaultListableBeanFactory beanFactory) throws BeansException, IOException {
    // Create a new XmlBeanDefinitionReader for the given BeanFactory.
    // 借助XmlBeanDefinitionReader解析xml配置文件
    XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReader(beanFactory);

    // Configure the bean definition reader with this context's
    // resource loading environment.
    beanDefinitionReader.setEnvironment(this.getEnvironment());
    beanDefinitionReader.setResourceLoader(this);
    beanDefinitionReader.setEntityResolver(new ResourceEntityResolver(this));

    // Allow a subclass to provide custom initialization of the reader,
    // then proceed with actually loading the bean definitions.
    // 初始化BeanDefinitionReader，后加载BeanDefinition
    initBeanDefinitionReader(beanDefinitionReader);
    loadBeanDefinitions(beanDefinitionReader);
}
```

可以看到，它解析 xml 配置文件不是自己干活，是**组合了一个 `XmlBeanDefinitionReader`** ，让它去解析。而实际解析配置文件的动作，就很好理解了：

```java
protected void loadBeanDefinitions(XmlBeanDefinitionReader reader) throws BeansException, IOException {
    Resource[] configResources = getConfigResources();
    if (configResources != null) {
        reader.loadBeanDefinitions(configResources);
    }
    String[] configLocations = getConfigLocations();
    if (configLocations != null) {
        reader.loadBeanDefinitions(configLocations);
    }
}
```

可以看到就是调用上面文档注释中提到的 `getConfigResources` 和 `getConfigLocations` 方法，取到配置文件的路径 / 资源类，交给 `BeanDefinitionReader` 解析。

### 2.6 ClassPathXmlApplicationContext【掌握】

终于到了一个咱非常熟悉的 `ApplicationContext` 了，咱已经很清楚它是从 classpath 下加载 xml 配置文件的 `ApplicationContext` 了，不过文档注释中也描述了一些内容和建议，咱还是要看一看的。

#### 2.6.1 ClassPathXmlApplicationContext是一个最终落地实现

> Standalone XML application context, taking the context definition files from the class path, interpreting plain paths as class path resource names that include the package path (e.g. "mypackage/myresource.txt"). Useful for test harnesses as well as for application contexts embedded within JARs.
>
> 独立的基于 XML 的 `ApplicationContext` ，它从 classpath 中获取配置文件，将纯路径解释为包含包路径的 classpath 资源名称（例如 `mypackage / myresource.txt` ）。对于测试工具以及 jar 包中嵌入的 `ApplicationContext` 很有用。

这段话写的很明白，它支持的配置文件加载位置都是 classpath 下取，这种方式的一个好处是：如果工程中依赖了一些其他的 jar 包，而工程启动时需要同时传入这些 jar 包中的配置文件，那 `ClassPathXmlApplicationContext` 就可以加载它们。

#### 2.6.2 ClassPathXmlApplicationContext使用Ant模式声明配置文件路径

> The config location defaults can be overridden via getConfigLocations, Config locations can either denote concrete files like "/myfiles/context.xml" or Ant-style patterns like "/myfiles/*-context.xml" (see the org.springframework.util.AntPathMatcher javadoc for pattern details).
>
> 可以通过 `getConfigLocations` 方法覆盖配置文件位置的默认值，配置位置可以表示具体的文件，例如 `/myfiles/context.xml` ，也可以表示Ant样式的模式，例如 `/myfiles/*-context.xml`（请参见 `AntPathMatcher` 的 javadoc 以获取模式详细信息）。

上面 `AbstractXmlApplicationContext` 中就说了，可以重写 `getConfigLocations` 方法来调整配置文件的默认读取位置，它这里又重复了一遍。除此之外它还提到了，加载配置文件的方式可以**使用 Ant 模式匹配**（比较经典的写法当属 web.xml 中声明的 `application-*.xml` ）。

#### 2.6.3 ClassPathXmlApplicationContext解析的配置文件有先后之分

> Note: In case of multiple config locations, later bean definitions will override ones defined in earlier loaded files. This can be leveraged to deliberately override certain bean definitions via an extra XML file.
>
> 注意：如果有多个配置位置，则较新的 `BeanDefinition` 会覆盖较早加载的文件中的 `BeanDefinition` ，可以利用它来通过一个额外的 XML 文件有意覆盖某些 `BeanDefinition` 。

这一点是配合第一点的多配置文件读取来的。通常情况下，如果在一个 jar 包的 xml 配置文件中声明了一个 Bean ，并且又在工程的 resources 目录下又声明了同样的 Bean ，则 jar 包中声明的 Bean 会被覆盖，这也就是配置文件加载优先级的设定。

#### 2.6.4 ApplicationContext可组合灵活使用

> This is a simple, one-stop shop convenience ApplicationContext. Consider using the GenericApplicationContext class in combination with an org.springframework.beans.factory.xml.XmlBeanDefinitionReader for more flexible context setup.
>
> 这是一个简单的一站式便利 `ApplicationContext` 。可以考虑将 `GenericApplicationContext` 类与 `XmlBeanDefinitionReader` 结合使用，以实现更灵活的上下文配置。

最后文档中并没有非常强调 `ClassPathXmlApplicationContext` 的作用，而是提了另外一个建议：由于 `ClassPathXmlApplicationContext` 继承了 `AbstractXmlApplicationContext` ，而 `AbstractXmlApplicationContext` 实际上是内部组合了一个 `XmlBeanDefinitionReader` ，所以就可以有一种组合的使用方式：利用 `GenericApplicationContext` 或者子类 `AnnotationConfigApplicationContext` ，配合 `XmlBeanDefinitionReader` ，就可以做到注解驱动和 xml 通吃了。

### 2.7 AnnotationConfigApplicationContext【掌握】

最后一个，咱介绍一个也用过很多次的了，就是注解驱动的 IOC 容器。它本身继承了 `GenericApplicationContext` ，那自然它也只能刷新一次。同样是最终的落地实现，它自然也应该跟 `ClassPathXmlApplicationContext` 类似的有一些特征，下面咱来看看。

#### 2.7.1 AnnotationConfigApplicationContext是一个最终落地实现

> Standalone application context, accepting component classes as input — in particular @Configuration-annotated classes, but also plain @Component types and JSR-330 compliant classes using javax.inject annotations.
>
> 独立的注解驱动的 `ApplicationContext` ，接受组件类作为输入，特别是使用 `@Configuration` 注解的类，还可以使用普通的 `@Component` 类型和符合 JSR-330 规范（使用 `javax.inject` 包的注解）的类。

注解驱动，除了 `@Component` 及其衍生出来的几个注解，更重要的是 `@Configuration` 注解，一个被 `@Configuration` 标注的类相当于一个 xml 文件。至于下面还提到的关于 JSR-330 的东西，它没有类似于 `@Component` 的东西（它只是定义了依赖注入的标准，与组件注册无关），它只是说如果一个组件 Bean 里面有 JSR-330 的注解，那它能给解析而已。

#### 2.7.2 AnnotationConfigApplicationContext解析的配置类也有先后之分

> Allows for registering classes one by one using register(Class...) as well as for classpath scanning using scan(String...). In case of multiple @Configuration classes, @Bean methods defined in later classes will override those defined in earlier classes. This can be leveraged to deliberately override certain bean definitions via an extra @Configuration class.
>
> 允许使用 `register(Class ...)` 一对一注册类，以及使用 `scan(String ...)` 进行类路径的包扫描。 如果有多个 `@Configuration` 类，则在以后的类中定义的 `@Bean` 方法将覆盖在先前的类中定义的方法。这可以通过一个额外的 `@Configuration` 类来故意覆盖某些 `BeanDefinition` 。

这个操作就跟上面 `ClassPathXmlApplicationContext` 如出一辙了，它也有配置覆盖的概念。除此之外，它上面还说了初始化的两种方式：要么注册配置类，要么直接进行包扫描。由于注解驱动开发中可能没有一个主配置类，都是一上来就一堆 `@Component` ，这个时候完全可以直接声明根扫描包，进行组件扫描。

有关 `FileSystemXmlApplicationContext` ，以及 Web 环境下扩展的 `ApplicationContext` ，本章不作更多的解析，小伙伴们可以举一反三，根据现有已经了解的知识，对比学习其它的一些 IOC 容器的实现。

