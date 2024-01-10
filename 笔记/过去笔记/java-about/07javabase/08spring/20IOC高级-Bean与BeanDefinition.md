---
title: 20IOC高级-Bean与BeanDefinition
---

## 1. BeanDefinition概述【熟悉】

`BeanDefinition` 也是一种**配置元信息**，它描述了 **Bean 的定义信息**。下面咱还是通过多个途径来试着了解 `BeanDefinition` 的概念。

### 1.1 官方文档

官方文档对于 `BeanDefinition` 的介绍并没有使用很大的篇幅，基本也只是概述一下就完事了：

[https://docs.spring.io/spring/docs/5.2.x/spring-framework-reference/core.html#beans-chil](https://docs.spring.io/spring/docs/5.2.x/spring-framework-reference/core.html#beans-child-bean-definitions)

> A bean definition can contain a lot of configuration information, including constructor arguments, property values, and container-specific information, such as the initialization method, a static factory method name, and so on. A child bean definition inherits configuration data from a parent definition. The child definition can override some values or add others as needed. Using parent and child bean definitions can save a lot of typing. Effectively, this is a form of templating.
>
> bean 的定义信息可以包含许多配置信息，包括构造函数参数，属性值和特定于容器的信息，例如初始化方法，静态工厂方法名称等。子 bean 定义可以从父 bean 定义继承配置数据。子 bean 的定义信息可以覆盖某些值，或者可以根据需要添加其他值。使用父 bean 和子 bean 的定义可以节省很多输入（实际上，这是一种模板的设计形式）。

文档已经解释的比较清楚了，bean 的定义就是包含了这个 bean 应该有的所有重要信息，并且它又提到了一个概念：bean 的定义信息也是有**层次性**的（联想 `BeanFactory` 的层次性），bean 的定义信息可以继承自某个已经有的定义信息，并覆盖父信息的一些配置值（而且文档最后也说了这相当于模板的设计）。

### 1.2 javadoc

翻开 `BeanDefinition` 接口的 javadoc ，里面写的不多，不过也已经很精确的说明了 `BeanDefinition` 的基本作用：

> A BeanDefinition describes a bean instance, which has property values, constructor argument values, and further information supplied by concrete implementations. This is just a minimal interface: The main intention is to allow a BeanFactoryPostProcessor such as PropertyPlaceholderConfigurer to introspect and modify property values and other bean metadata.
>
> `BeanDefinition` 描述了一个 bean 的实例，该实例具有属性值，构造函数参数值以及具体实现所提供的更多信息。 这只是一个最小的接口，它的主要目的是允许 `BeanFactoryPostProcessor`（例如 `PropertyPlaceholderConfigurer` ）内省和修改属性值和其他 bean 的元数据。

对比起官方文档，javadoc 额外提了编码设计中 `BeanDefinition` 的使用：`BeanFactoryPostProcessor` 可以任意修改 `BeanDefinition` 中的信息。这里面又提到了一个 `BeanFactoryPostProcessor` 的概念，不要着急不要慌张，后面我们马上就学到后置处理器的部分，自然就都学到啦 ~

### 1.3 BeanDefinition接口的方法定义

借助 IDE ，打开 `BeanDefinition` 的接口定义，从方法列表上看，`BeanDefinition` 整体包含以下几个部分：

- Bean 的类信息 - 全限定类名 ( beanClassName )
- Bean 的属性 - 作用域 ( scope ) 、是否默认 Bean ( primary ) 、描述信息 ( description ) 等
- Bean 的行为特征 - 是否延迟加载 ( lazy ) 、是否自动注入 ( autowireCandidate ) 、初始化 / 销毁方法 ( initMethod / destroyMethod ) 等
- Bean 与其他 Bean 的关系 - 父 Bean 名 ( parentName ) 、依赖的 Bean ( dependsOn ) 等
- Bean 的配置属性 - 构造器参数 ( constructorArgumentValues ) 、属性变量值 ( propertyValues ) 等

由此可见，`BeanDefinition` 几乎把 bean 的所有信息都能收集并封装起来，可以说是很全面了。

### 1.4 【面试题】面试中如何概述BeanDefinition

**`BeanDefinition` 描述了 SpringFramework 中 bean 的元信息，它包含 bean 的类信息、属性、行为、依赖关系、配置信息等。`BeanDefinition` 具有层次性，并且可以在 IOC 容器初始化阶段被 `BeanDefinitionRegistryPostProcessor` 构造和注册，被 `BeanFactoryPostProcessor` 拦截修改等。**

## 2. BeanDefinition的结构【了解】

跟上一章一样，搞明白了 `BeanDefinition` 是什么，下面咱来看看 `BeanDefinition` 在 SpringFramework 中是如何设计的：

![image-20220503184815569](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220503184815.png)

### 2.1 AttributeAccessor

看类名就知道，它是**属性的访问器**，那它一定具有可以访问对象属性的功能咯？文档注释写的非常简单，就一句话：

> nterface defining a generic contract for attaching and accessing metadata to/from arbitrary objects.
>
> 定义用于将元数据附加到任意对象，或从任意对象访问元数据的通用协定的接口。

#### 2.1.1 回顾元信息的概念

元信息的部分我们有说过，一个类中有什么属性、什么方法，是封装在 **`Class`** 类对象中的，通过**反射**可以获取类的属性、方法定义信息。

比方说以下一个例子：

```java
public class Person {
    private String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

像这样的一个简单的类，如果用定义性质的语言描述，可以抽象成如下内容：

```
className: Person
attributes: [name]
methods: [getName, setName]
```

#### 2.1.2 AttributeAccessor的设计

翻看 `AttributeAccessor` 的接口方法，会发现它不只是简单的 getter 和 setter ，它还能移除属性信息（此处的属性就是 bean 的成员属性）。

```java
public interface AttributeAccessor {
    // 设置bean中属性的值
    void setAttribute(String name, @Nullable Object value);

    // 获取bean中指定属性的值
    Object getAttribute(String name);

    // 移除bean中的属性
    Object removeAttribute(String name);

    // 判断bean中是否存在指定的属性
    boolean hasAttribute(String name);

    // 获取bean的所有属性
    String[] attributeNames();
}
```

> 看这个设计，有木有联想到 `Map` 呢？（都有 `get` `set` `remove` `contains` `getAll` 之类的操作）

由此，我们就可以总结出第一个 `BeanDefinition` 的特征：**`BeanDefinition` 继承了 `AttributeAccessor` 接口，具有配置 bean 属性的功能。**（注意此处的措辞，配置 bean 就包含了访问、修改、移除在内的操作）

### 2.2 BeanMetadataElement

看到 **metadata** ，是不是立马就回想起元信息的概念了？其实这个类名已经把它的功能都告诉我们了：它**存放了 bean 的元信息**。这个接口只有一个方法，是获取 bean 的资源来源：

```java
public interface BeanMetadataElement {
    default Object getSource() {
        return null;
    }
}
```

资源来源，说白了，就是 bean 的文件 / url 路径。咱们前面写的所有示例，都是在本地磁盘上的 .class 文件加载进来的，所以对应的也就应该是 `FileSystemResource` ，这个过会咱们到演示部分看一下就知道了。

### 2.3 AbstractBeanDefinition

到了 `BeanDefinition` 的第一个实现类了，作为 `BeanDefinition` 的抽象实现，它里面已经定义好了一些属性和功能（大部分都有了），大体包含以下内容：（只挑选部分重要属性）

```java
 // bean的全限定类名
    private volatile Object beanClass;

    // 默认的作用域为单实例
    private String scope = SCOPE_DEFAULT;

    // 默认bean都不是抽象的
    private boolean abstractFlag = false;

    // 是否延迟初始化
    private Boolean lazyInit;
    
    // 自动注入模式(默认不自动注入)
    private int autowireMode = AUTOWIRE_NO;

    // 是否参与IOC容器的自动注入(设置为false则它不会注入到其他bean，但其他bean可以注入到它本身)
    // 可以这样理解：设置为false后，你们不要来找我，但我可以去找你们
    private boolean autowireCandidate = true;

    // 同类型的首选bean
    private boolean primary = false;

    // bean的构造器参数和参数值列表
    private ConstructorArgumentValues constructorArgumentValues;

    // bean的属性和属性值集合
    private MutablePropertyValues propertyValues;

    // bean的初始化方法
    private String initMethodName;

    // bean的销毁方法
    private String destroyMethodName;

    // bean的资源来源
    private Resource resource;
```

可以发现，基本上前面提到的，这里都有了！那它干嘛还要抽象出来呢？看看文档注释怎么说：

> Base class for concrete, full-fledged BeanDefinition classes, factoring out common properties of GenericBeanDefinition, RootBeanDefinition, and ChildBeanDefinition. The autowire constants match the ones defined in the AutowireCapableBeanFactory interface.
>
> 它是 `BeanDefinition` 接口的抽象实现类，其中排除了 `GenericBeanDefinition` ，`RootBeanDefinition` 和 `ChildBeanDefinition` 的常用属性。 自动装配常量与 `AutowireCapableBeanFactory` 接口中定义的常量匹配。

哦，看样子它还不是最全的咯？针对不同的 `BeanDefinition` 落地实现，还有一些特殊的属性咯，所以还是需要抽象出一个父类才行哈。

在继续往下走之前，这里有必要插入一点东西，就是这个 `autowireMode` 属性，我们之前在 bean 的依赖注入中没有讲到，这里补充一下。

#### 2.3.1 补充 : 自动注入模式

正常来讲，bean 中的组件依赖注入，是需要在 xml 配置文件，或者在属性 / 构造器 / setter 方法上标注注入的注解（ `@Autowired` / `@Resource` / `@Inject` 的。不过，SpringFramework 为我们提供了另外一种方式，**如果组件中的类型 / 属性名与需要注入的 bean 的类型 / name 完全一致，可以不标注依赖注入的注解，也能实现依赖注入**。

一般情况下，自动注入只会在 xml 配置文件中出现，注解配置中 `@Bean` 注解的 `autowire` 属性在 SpringFramework 5.1 之后被标记为已过时，替代方案是使用 `@Autowired` 等注解。

使用方式很简单，譬如前面的依赖注入章节中，`basic_di/inject-set.xml` 配置文件里面，cat 注入的 `Person` 完全可以不写，只需要在 `<bean>` 标签上声明自动注入模式为按名称注入即可，运行效果是完全一样的。

```xml
<bean id="cat" class="com.linkedbear.spring.basic_di.a_quickstart_set.bean.Cat" autowire="byName">
    <property name="name" value="test-cat"/>
    <!-- <property name="master" ref="person"/> 可以不写 -->
</bean>
```

自动注入的模式有 5 种选择：`AUTOWIRE_NO`（不自动注入）、`AUTOWIRE_BY_NAME`（根据 bean 的名称注入）、`AUTOWIRE_BY_TYPE`（根据 bean 的类型注入）、`AUTOWIRE_CONSTRUCTOR`（根据 bean 的构造器注入）、`AUTOWIRE_AUTODETECT`（借助内省决定如何注入，3.0 即弃用），**默认是不开启的**（所以才需要我们开发者对需要注入的属性标注注解，或者在 xml 配置文件中配置）。

下面咱看几个具体的落地实现，看它们里面有什么特殊的设计。

### 2.4 GenericBeanDefinition

又看到 `Generic` 了，它代表着通用、一般的，所以这种 `BeanDefinition` 也具有一般性。`GenericBeanDefinition` 的源码实现非常简单，仅仅是比 `AbstractBeanDefinition` 多了一个 `parentName` 属性而已。

由这个设计，可以得出以下几个结论：

- AbstractBeanDefinition 已经完全可以构成 BeanDefinition 的实现了
- GenericBeanDefinition 就是 AbstractBeanDefinition 的非抽象扩展而已
- GenericBeanDefinition 具有层次性（可从父 BeanDefinition 处继承一些属性信息）

不过，相比较下面的而言，它的层次性体现的不是那么强烈，下面的这两种 `BeanDefinition` 就有非常强的层次性关系了。

### 2.5 RootBeanDefinition与ChildBeanDefinition

**root** 和 **child** ，很明显这是父子关系的意思了呀。对于 `ChildBeanDefinition` ，它的设计实现与 `GenericBeanDefinition` 如出一辙，都是集成一个 `parentName` 来作为父 `BeanDefinition` 的 “指向引用” 。不过有一点要注意， `ChildBeanDefinition` 没有默认的无参构造器，必须要传入 `parentName` 才可以，但 `GenericBeanDefinition` 则有两种不同的构造器。

`RootBeanDefinition` 有着 “根” 的概念在里面，它只能作为单体独立的 `BeanDefinition` ，或者父 `BeanDefinition` 出现（不能继承其他 `BeanDefinition` ）。它里面的设计也复杂得多，从源码的篇幅上就能看得出来（接近 500 行，而 `GenericBeanDefinition` 只有 100 行多一点）。不过这里我们不去挨个属性研究它的作用，只了解重要的组成部分就好啦。

下面是 `RootBeanDefinition` 的一些重要的成员属性：

```java
    // BeanDefinition的引用持有，存放了Bean的别名
    private BeanDefinitionHolder decoratedDefinition;

    // Bean上面的注解信息
    private AnnotatedElement qualifiedElement;

    // Bean中的泛型
    volatile ResolvableType targetType;

    // BeanDefinition对应的真实的Bean
    volatile Class<?> resolvedTargetType;

    // 是否是FactoryBean
    volatile Boolean isFactoryBean;
    // 工厂Bean方法返回的类型
    volatile ResolvableType factoryMethodReturnType;
    // 工厂Bean对应的方法引用
    volatile Method factoryMethodToIntrospect;
```

可以发现，`RootBeanDefinition` 在 `AbstractBeanDefinition` 的基础上，又扩展了这么些 Bean 的信息：

-  Bean 的 id 和别名
- Bean 的注解信息
- Bean 的工厂相关信息（是否为工厂 Bean 、工厂类、工厂方法等）

而且这里面直接把一些反射相关的元素都包含进来了，可见 `BeanDefinition` 在底层可是要在反射上 “大动干戈”了。

### 2.6 AnnotatedBeanDefinition

最后，提一下这个家伙。它并不是 `BeanDefinition` 的实现类，而是一个子接口：

```java
public interface AnnotatedBeanDefinition extends BeanDefinition {
    
	AnnotationMetadata getMetadata();
    
	MethodMetadata getFactoryMethodMetadata();
}
```

由这个接口定义的方法，大概就可以猜测到，它可以把 Bean 上的注解信息提供出来。借助 IDEA ，发现它的子类里，有一个 `AnnotatedGenericBeanDefinition` ，还有一个 `ScannedGenericBeanDefinition` ，它们都是基于注解驱动下的 Bean 的注册，封装的 `BeanDefinition` 。现在我们没有必要对这些 `BeanDefinition` 深入研究，到后面 IOC 原理中，遇到咱们会解释的。

## 3. 体会BeanDefinition【熟悉】

下面，咱们使用一些简单的 Demo ，帮助小伙伴们体会 `BeanDefinition` 中的设计，以及封装的内容。本章只会了解 `BeanDefinition` 的设计部分，至于如何利用它们，咱们统一放到下一章讲解。

### 3.1 基于xml的BeanDefinition

```java
public class Person {
    
    private String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```



```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="person" class="org.clxmm.definition.a_quickstart.bean.Person">
        <property name="name" value="zhangsan"/>
    </bean>
</beans>
```

#### 3.1.2 测试获取BeanDefinition

```java
public class BeanDefinitionQuickstartXmlApplication {
    
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("definition/definition-beans.xml");
        // ？？？
    }
}
```

![image-20220503190112831](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220503190112.png)

到了这里，要写下一步的代码，发现 `ClassPathXmlApplicationContext` 里没有 `getBeanDefinition` 方法：

别慌，回想前面学习的知识，`ApplicationContext` 中最终是组合了一个 `BeanFactory` 来存放 Bean 的，那 `ApplicationContext` 没有，`BeanFactory` 里有没有呢？

打开 `DefaultListableBeanFactory` ，搜索 `getBeanDefintion` ，发现真的能找到了：

```java
public class BeanDefinitionQuickstartXmlApplication {
    
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("definition/definition-beans.xml");
        BeanDefinition personBeanDefinition = ctx.getBeanFactory().getBeanDefinition("person");
        System.out.println(personBeanDefinition);
    }
}
```

运行 `main` 方法，控制台可以打印出 person 的 `BeanDefinition` 信息：

```
Generic bean: class [org.clxmm.definition.a_quickstart.bean.Person]; scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in class path resource [definition/definition-beans.xml]

```

由这个打印信息，可以获取到一个 bean 的所有基本信息了。

值得注意的是，它是一个 **Generic bean** （打印 `personBeanDefinition` 的类型可得 `org.springframework.beans.factory.support.GenericBeanDefinition` ），这个信息比较重要哦。

### 3.2 基于@Component的BeanDefinition

给 `Person` 上打一个 `@Component` 注解，然后使用 `AnnotationConfigApplicationContext` 来驱动扫描 `Person` 类，其余的代码不变：

（注意 `AnnotationConfigApplicationContext` 可以直接调用 `getBeanDefinition` 方法哦）

```java
public class BeanDefinitionQuickstartComponentApplication {
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                "org.clxmm.definition.a_quickstart.bean");
        BeanDefinition personBeanDefinition = ctx.getBeanDefinition("person");
        System.out.println(personBeanDefinition);
        System.out.println(personBeanDefinition.getClass().getName());
    }

}
```

```
Generic bean: class [org.clxmm.definition.a_quickstart.bean.Person]; scope=singleton; abstract=false; lazyInit=null; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in file [/Users/lxc/Desktop/gitee/java2021/12spring/spring-01-ioc/target/classes/org/clxmm/definition/a_quickstart/bean/Person.class]
org.springframework.context.annotation.ScannedGenericBeanDefinition
```

运行 `main` 方法，控制台打印出来的依然是一个 **Generic bean** ，但类型与上面的 xml `BeanDefinition` 不太一致：

可以发现，`BeanDefinition` 的打印信息里，最大的不同是加载来源：**基于 xml 解析出来的 bean ，定义来源是 xml 配置文件；基于 `@Component` 注解解析出来的 bean ，定义来源是类的 .class 文件中。**

### 3.3 基于@Bean的BeanDefinition

编写一个配置类 `BeanDefinitionQuickstartConfiguration` ，使用 `@Bean` 注册一个 Person ：

```java
@Configuration
public class BeanDefinitionQuickstartConfiguration {
    
    @Bean
    public Person person() {
        return new Person();
    }
}
```

之后，使用这个配置类驱动 IOC 容器，并直接获取 `BeanDefinition` ：

```java
public class BeanDefinitionQuickstartBeanApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                BeanDefinitionQuickstartConfiguration.class);
        BeanDefinition personBeanDefinition = ctx.getBeanDefinition("person");
        System.out.println(personBeanDefinition);
        System.out.println(personBeanDefinition.getClass().getName());
    }
}
```

运行 `main` 方法，发现控制台打印的内容与前面相比有很大的区别：

```
Root bean: class [null]; scope=; abstract=false; lazyInit=null; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=beanDefinitionQuickstartConfiguration; factoryMethodName=person; initMethodName=null; destroyMethodName=(inferred); defined in org.clxmm.definition.a_quickstart.config.BeanDefinitionQuickstartConfiguration
org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader$ConfigurationClassBeanDefinition
```

具体区别可以发现有这么几个：

- Bean 的类型是 Root bean （ ConfigurationClassBeanDefinition 继承自 RootBeanDefinition ）
- Bean 的 className 不见了
- 自动注入模式为 AUTOWIRE_CONSTRUCTOR （构造器自动注入）
- 有 factoryBean 了：person 由 beanDefinitionQuickstartConfiguration 的 person 方法创建

### 3.4 【原理】BeanDefinition是如何生成的（简易理解）

这个问题说实话如果想完全彻底的解释清楚，有点费劲，我们放到后面的 IOC 原理篇，`BeanDefinition` 的解析阶段解释，这里只是让小伙伴们有一个认识和印象即可。

1. 通过 xml 加载的 `BeanDefinition` ，它的读取工具是 `XmlBeanDefinitionReader` ，它会解析 xml 配置文件，最终来到 `DefaultBeanDefinitionDocumentReader` 的 `doRegisterBeanDefinitions` 方法，根据 xml 配置文件中的 bean 定义构造 `BeanDefinition` ，最底层创建 `BeanDefinition` 的位置在 `org.springframework.beans.factory.support.BeanDefinitionReaderUtils#createBeanDefinition` 。
2. 通过模式注解 + 组件扫描的方式构造的 `BeanDefinition` ，它的扫描工具是 `ClassPathBeanDefinitionScanner` ，它会扫描指定包路径下包含特定模式注解的类，核心工作方法是 `doScan` 方法，它会调用到父类 `ClassPathScanningCandidateComponentProvider` 的 `findCandidateComponents` 方法，创建 `ScannedGenericBeanDefinition` 并返回。
3. 通过配置类 + `@Bean` 注解的方式构造的 `BeanDefinition` 最复杂，它涉及到配置类的解析。配置类的解析要追踪到 `ConfigurationClassPostProcessor` 的 `processConfigBeanDefinitions` 方法，它会处理配置类，并交给 `ConfigurationClassParser` 来解析配置类，取出所有标注了 `@Bean` 的方法。随后，这些方法又被 `ConfigurationClassBeanDefinitionReader` 解析，最终在底层创建 `ConfigurationClassBeanDefinition` 并返回。

再啰嗦一边哈，小伙伴只需要对这些内容有一个最简单的了解就好了，至于里面的原理是什么样子，我们现在不要关心！不要关心！不要关心！