---
title: 21IOC高级-BeanDefinition与BeanDefinitionRegistry
---

上一章，咱们对 `BeanDefinition` 的整体设计，以及几种常见的类型有了一个认识。不过 `BeanDefinition` 不是凭空出现的，是要配合一个 API 才能完成注册的，IOC 容器中也才能有的，它就是前面留下的一个很重要的坑：**`BeanDefinitionRegistry`**。

## 1. BeanDefinitionRegistry概述【理解】

还是那个老套路，先对 `BeanDefinitionRegistry` 有个整体的认识。

【以下内容可能比较啰里八嗦，想直接拿来面试的小伙伴请直接移步 1.5 节】

由于官方文档中并没有提及 `BeanDefinitionRegistry` 的设计，故我们只尝试从 javadoc 中获取一些信息。

> Interface for registries that hold bean definitions, for example RootBeanDefinition and ChildBeanDefinition instances. Typically implemented by BeanFactories that internally work with the AbstractBeanDefinition hierarchy. This is the only interface in Spring's bean factory packages that encapsulates registration of bean definitions. The standard BeanFactory interfaces only cover access to a fully configured factory instance. Spring's bean definition readers expect to work on an implementation of this interface. Known implementors within the Spring core are DefaultListableBeanFactory and GenericApplicationContext.
>
> 包含 bean 定义的注册表的接口（例如 `RootBeanDefinition` 和 `ChildBeanDefinition` 实例）。通常由内部与 `AbstractBeanDefinition` 层次结构一起工作的 `BeanFactorty` 实现。 这是 SpringFramework 的 bean 工厂包中唯一封装了 bean 的定义注册的接口。标准 `BeanFactory` 接口仅涵盖对完全配置的工厂实例的访问。 `BeanDefinition` 的解析器希望可以使用此接口的实现类来支撑逻辑处理。SpringFramework 中的已知实现者是 `DefaultListableBeanFactory` 和 `GenericApplicationContext` 。

### 1.1 BeanDefinitionRegistry中存放了所有BeanDefinition

Registry 有注册表的意思，联想下 Windows 的注册表，它存放了 Windows 系统中的应用和设置信息。如果按照这个设计理解，那 `BeanDefinitionRegistry` 中存放的就应该是 `BeanDefinition` 的设置信息。其实 SpringFramework 中的底层，对于 `BeanDefinition` 的注册表的设计，就是一个 **`Map`** ：

```java
// 源自DefaultListableBeanFactory
private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<>(256);
```

### 1.2 BeanDefinitionRegistry中维护了BeanDefinition

另外，Registry 还有注册器的意思，既然 Map 有增删改查，那作为 `BeanDefinition` 的注册器，自然也会有 `BeanDefinition` 的注册功能咯。`BeanDefinitionRegistry` 中有 3 个方法，刚好对应了 `BeanDefinition` 的增、删、查：

```java
void registerBeanDefinition(String beanName, BeanDefinition beanDefinition)
            throws BeanDefinitionStoreException;

void removeBeanDefinition(String beanName) throws NoSuchBeanDefinitionException;

BeanDefinition getBeanDefinition(String beanName) throws NoSuchBeanDefinitionException;
```

### 1.3 BeanDefinitionRegistry支撑其它组件运行

javadoc 的最后一段，说起来有点有趣：

> Spring's bean definition readers expect to work on an implementation of this interface.
>
> `BeanDefinition` 的加载器希望可以使用此接口的实现类来支撑逻辑处理。

javadoc 中的 Reader 可以参照上一章提到了 `XmlBeanDefinitionReader` ，它是用来读取和加载 xml 配置文件的组件。加载 xml 配置文件的目的就是读取里面的配置，和定义好要注册到 IOC 容器的 bean 。`XmlBeanDefinitionReader` 要在加载完 xml 配置文件后，将配置文件的流对象也好，文档对象也好，交给解析器来解析 xml 文件，解析器拿到 xml 文件后要解析其中定义的 bean ，并且封装为 `BeanDefinition` 注册到 IOC 容器，这个时候就需要 `BeanDefinitionRegistry` 了。所以在这个过程中，**`BeanDefinitionRegistry` 会支撑 `XmlBeanDefinitionReader` 完成它的工作**。

当然，`BeanDefinitionRegistry` 不止支撑了这一个哈，还记得之前小册 17 章，学习模块装配时用到的 `ImportBeanDefinitionRegistrar` 吗？它的 `registerBeanDefinitions` 方法是不是也传入了一个 `BeanDefinitionRegistry` 呀？所以说这个 `BeanDefinitionRegistry` 用到的位置还是不少的，

### 1.4 BeanDefinitionRegistry的主要实现是DefaultListableBeanFactory

注意这个地方我没说是唯一实现哦，是因为 `BeanDefinitionRegistry` 除了有最最常用的 `DefaultListableBeanFactory` 之外，还有一个不常用的 `SimpleBeanDefinitionRegistry` ，但这个 `SimpleBeanDefinitionRegistry` 基本不会去提它，是因为这个设计连内部的 IOC 容器都没有，仅仅是一个 `BeanDefinitionRegistry` 的表面实现而已，所以我们当然不会用它咯。

可能有的小伙伴借助 IDE 发现很多 `ApplicationContext` 也实现了它，但我想请这部分小伙伴回想一下，`ApplicationContext` 本身管理 Bean 吗？不吧，`ApplicationContext` 不都是内部组合了一个 `DefaultListableBeanFactory` 来实现的嘛，所以我们说，唯一真正落地实现的是 `DefaultListableBeanFactory` 这话是正确合理的。

### 1.5 【面试题】面试中如何概述BeanDefinitionRegistry

**`BeanDefinitionRegistry` 是维护 `BeanDefinition` 的注册中心，它内部存放了 IOC 容器中 bean 的定义信息，同时 `BeanDefinitionRegistry` 也是支撑其它组件和动态注册 Bean 的重要组件。在 SpringFramework 中，`BeanDefinitionRegistry` 的实现是 `DefaultListableBeanFactory` 。**

## 2. BeanDefinitionRegistry维护BeanDefinition的使用【熟悉】

对于 `BeanDefinitionRegistry` 内部的设计，倒是没什么好说的，主要还是研究它如何去维护 `BeanDefinition` 。

### 2.1 BeanDefinition的注册

对于 `BeanDefinition` 的注册，目前我们接触到的方式是在 模块装配中使用的 `ImportBeanDefinitionRegistrar` ：

```java
public class WaiterRegistrar implements ImportBeanDefinitionRegistrar {
    
    @Override
    public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
        registry.registerBeanDefinition("waiter", new RootBeanDefinition(Waiter.class));
    }
}
```

之前的这个例子中是直接 **new** 了一个 `RootBeanDefinition` ，其实 `BeanDefinition` 的构造可以借助**建造器**生成，下面我们再演示一个例子。

#### 2.1.1 声明Person类

像往常一样，搞一个比较简单的 `Person` 就好啦，记得声明几个属性和 `toString` 方法：

```java
public class Person {
    
    private String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    @Override
    public String toString() {
        return "Person{" + "name='" + name + '\'' + '}';
    }
}
```

#### 2.1.2 编写ImportBeanDefinitionRegistrar的实现类

编写一个 `PersonRegister` ，让它实现 `ImportBeanDefinitionRegistrar` ，这样就可以拿到 `BeanDefinitionRegistry` 了：

```java
public class PersonRegister implements ImportBeanDefinitionRegistrar {
    
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        registry.registerBeanDefinition("person",
                BeanDefinitionBuilder.genericBeanDefinition(Person.class).addPropertyValue("name", "zhangsan")
                        .getBeanDefinition());
    }
}
```

注意这里面的写法，使用 `BeanDefinitionBuilder` ，是可以创建 `GenericBeanDefinition` 、`RootBeanDefinition` 和 `ChildBeanDefinition` 三种类型的，此处小册使用 `GenericBeanDefinition` ，后续直接向 `BeanDefinition` 中添加 bean 中属性的值就好，整个构造过程一气呵成，非常的简单。

#### 2.1.3 编写配置类导入PersonRegister

```java
@Configuration
@Import(PersonRegister.class)
public class BeanDefinitionRegistryConfiguration {
    
}
```

#### 2.1.4 测试获取Person

万事俱备，下面编写测试启动类，使用 `BeanDefinitionRegistryConfiguration` 驱动 IOC 容器，并从容器中取出 `Person` 并打印：

```java
public class BeanDefinitionRegistryApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                BeanDefinitionRegistryConfiguration.class);
        Person person = ctx.getBean(Person.class);
        System.out.println(person);
    }
}
```

运行 `main` 方法，控制台中打印了 `Person` 的 name 属性是有值的，说明 SpringFramework 已经按照我们预先定义好的 `BeanDefinition` ，注册到 IOC 容器，并且生成了对应的 Bean 。

```
Person{name='zhangsan'}

```

### 2.2 BeanDefinition的移除

`BeanDefinitionRegistry` 除了能给 IOC 容器中添加 `BeanDefinition` ，还可以移除掉一些特定的 `BeanDefinition` 。这种操作可以在 Bean 的实例化之前去除，以阻止 IOC 容器创建。

要演示 `BeanDefinition` 的移除，需要一个现阶段没见过的 API ，咱们先学着用一下，到后面我们会系统的学习它的用法。

#### 2.2.1 声明Person

这次声明的 `Person` 类要加一个特殊的属性：**sex** ，性别，它在后面会起到判断作用。

声明好 getter 、setter 和 `toString` 方法即可。

```java
public class Person {
    
    private String name;
    private String sex;
    
    // getter 、setter 、 toString
}
```

#### 2.2.2 声明配置类

接下来要注册两个 `Person` ，分别注册一男一女。

由上一章 `BeanDefinition` 的注册方式与实现类型，可知如果此处使用注解配置类的方式注册 Bean ( `@Bean` ) ，生成的 `BeanDefinition` 将无法取到 `beanClassName` （也无法取到 PropertyValues ），故此处选用 xml 方式注册 Bean 。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <bean id="aqiang" class="com.linkedbear.spring.definition.c_removedefinition.bean.Person">
        <property name="name" value="阿强"/>
        <property name="sex" value="male"/>
    </bean>

    <bean id="azhen" class="com.linkedbear.spring.definition.c_removedefinition.bean.Person">
        <property name="name" value="阿珍"/>
        <property name="sex" value="female"/>
    </bean>

    <!-- 注意此处要开启包扫描 -->
    <context:component-scan base-package="com.linkedbear.spring.definition.c_removedefinition.config"/>
</beans>
```

#### 2.2.3 编写剔除BeanDefinition的后置处理器

这里涉及到后置处理器的概念了，没见过没关系，不会搞没关系，先照着葫芦画瓢，后面马上就学到了。

要剔除 `BeanDefinition` ，需要实现 `BeanFactoryPostProcessor` 接口，并重写 `postProcessBeanFactory` 方法：（记得标注 `@Component` 注解哦）

```java
@Component
public class RemoveBeanDefinitionPostProcessor implements BeanFactoryPostProcessor {
    
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    
    }
}
```

注意方法的入参，它是一个 `ConfigurableListableBeanFactory` ，不用想，它的唯一实现一定是 `DefaultListableBeanFactory` 。又从前面了解到 `DefaultListableBeanFactory` 实现了 `BeanDefinitionRegistry` 接口，所以这里我们就可以直接将 `beanFactory` 强转为 `BeanDefinitionRegistry` 类型。

于是，我们就可以编写如下的剔除逻辑：**移除 IOC 容器中所有性别为 male 的 Person** 。

```java
@Override
public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    BeanDefinitionRegistry registry = (BeanDefinitionRegistry) beanFactory;
    // 获取IOC容器中的所有BeanDefinition
    for (String beanDefinitionName : beanFactory.getBeanDefinitionNames()) {
        // 判断BeanDefinition对应的Bean是否为Person类型
        BeanDefinition beanDefinition = beanFactory.getBeanDefinition(beanDefinitionName);
        if (Person.class.getName().equals(beanDefinition.getBeanClassName())) {
            // 判断Person的性别是否为male
            // 使用xml配置文件对bean进行属性注入，最终取到的类型为TypedStringValue，这一点不需要记住
            TypedStringValue sex = (TypedStringValue) beanDefinition.getPropertyValues().get("sex");
            if ("male".equals(sex.getValue())) {
                // 移除BeanDefinition
                registry.removeBeanDefinition(beanDefinitionName);
            }
        }
    }
}
```

#### 2.2.4 测试获取“阿强”

这一次我们又要用 `ClassPathXmlApplicationContext` 来加载配置文件驱动 IOC 容器了，写法很简单，直接从 IOC 容器中取 “aqiang” 就好：

```java
public class RemoveBeanDefinitionApplication {
    
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("definition/remove-definitions.xml");
        Person aqiang = (Person) ctx.getBean("aqiang");
        System.out.println(aqiang);
    }
}
```

运行 `main` 方法，控制台打印 `NoSuchBeanDefinitionException` 的异常，证明 “aqiang” 对应的 `BeanDefinition` 已经被移除了，无法创建 `Person` 实例。

好了，到这里，对 `BeanDefinitionRegistry` 有一个比较清晰的认识就好，具体操作不需要太深入了解，会用就够啦。

## 3. BeanDefinition的合并【了解】

了解完 `BeanDefinitionRegistry` ，回过头来再学习一个 `BeanDefinition` 的特性：**合并**。

关于合并这个概念，可能有些小伙伴没有概念，小册先来解释一下合并的意思。

### 3.1 如何理解BeanDefinition的合并

上一章我们知道，之前在 xml 配置文件中定义的那些 bean ，最终都转换为一个个的 `GenericBeanDefinition` ，它们都是相互独立的。比如这样：

```java
<bean class="com.linkedbear.spring.basic_dl.b_bytype.bean.Person"></bean>
<bean class="com.linkedbear.spring.basic_dl.b_bytype.dao.impl.DemoDaoImpl"/>
```

但其实，bean 也是存在**父子关系**的。与 Class 的抽象、继承一样，`<bean>` 标签中有 **abstract** 属性，有 **parent** 属性，由此就可以形成父子关系的 `BeanDefinition` 了。

### 3.2 BeanDefinition合并的体现

先构建一个比较简单的场景吧：所有的**动物**都归**人**养，动物分很多种（猫啊 狗啊 猪啊 巴拉巴拉）。

下面我们基于这个场景来编码演绎。

#### 3.2.1 声明实体类

对于这几个实体类，前面已经写过很多次了，这里快速编写出来就 OK ：

```java
public class Person {
    
}

public abstract class Animal {

    private Person person;
    
    public Person getPerson() {
        return person;
    }
    
    public void setPerson(Person person) {
        this.person = person;
    }
}
```

`Cat` 要继承自 `Animal` ，并且为了方便打印出 `person` ，这里就不直接使用 IDEA 的 `toString` 方法生成了，而是在此基础上改造一下：

```java
public class Cat extends Animal {
    
    private String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    @Override
    public String toString() {
        return "Cat{" + "name=" + name + ", person='" + getPerson() + '\'' + "}";
    }
}
```

#### 3.2.2 编写xml配置文件

要体现 `BeanDefinition` 的合并，要使用配置文件的形式，前面也说过了。那下面咱就来造一个配置文件，先把 `Person` 注册上去。

```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="person" class="com.linkedbear.spring.definition.d_merge.bean.Person"/>
</beans>
```

接下来要注册 `Animal` 和 `Cat` 了。按照之前的写法，这里只需要注册 `Cat` 就可以了，像这样写就 OK ：

```xml
<bean class="com.linkedbear.spring.definition.d_merge.bean.Cat" parent="abstract-animal">
    <property name="person" ref="person"/>
    <property name="name" value="咪咪"/>
</bean>
```

但试想，如果要创建的猫猫狗狗猪猪太多的话，每个 bean 都要注入 property ，这样可不是好办法。由此，就可以使用 `BeanDefinition` 合并的特性来优化这个问题。

我们直接在 xml 中注册一个 `Animal` ：

```xml
<bean class="com.linkedbear.spring.definition.d_merge.bean.Animal"></bean>

```

但这样写完之后，IDEA 会报红

很明显嘛，抽象类怎么能靠一个 `<bean>` 标签构造出对象呢？所以，`<bean>` 标签里有一个属性，就是标注这个 bean 是否是抽象类：

如此，咱就可以把这个 `Animal` 声明好了，由于是 **abstract** 类型的 bean ，那也就可以搞定注入的事了：

```xml
<bean id="abstract-animal" class="com.linkedbear.spring.definition.d_merge.bean.Animal" abstract="true">
    <property name="person" ref="person"/>
</bean>
```

接下来要声明 `Cat` 了，有 **abstract** 就有 **parent** ，想必不用我多说小伙伴们也能猜到如何写了：

```xml
<bean id="cat" class="com.linkedbear.spring.definition.d_merge.bean.Cat" parent="abstract-animal">
    <property name="name" value="咪咪"/>
</bean>
```

这里就不再需要声明 `person` 属性的注入了，因为继承了 `abstract-animal` ，相应的依赖注入也就都可以继承过来。

这样 xml 配置文件就写完了。

#### 3.2.3 测试运行

编写启动类，使用 xml 配置文件驱动 IOC 容器，并从 `BeanFactory` 中取出 cat 的 `BeanDefinition` ：

```java
public class MergeBeanDefinitionApplication {
    
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("definition/definition-merge.xml");
        Cat cat = (Cat) ctx.getBean("cat");
        System.out.println(cat);
        
        BeanDefinition catDefinition = ctx.getBeanFactory().getBeanDefinition("cat");
        System.out.println(catDefinition);
    }
}
```

运行 `main` 方法，发现 `Cat` 里确实注入了 `person` 对象，可是获取出来的 `BeanDefinition` ，除了有了一个 `parentName` 之外，跟普通的 bean 没有任何不一样的地方。

```
Cat{name=咪咪, person='com.linkedbear.spring.definition.d_merge.bean.Person@31dc339b'}
Generic bean with parent 'abstract-animal': class [com.linkedbear.spring.definition.d_merge.bean.Cat]; scope=;   ......(太长省略)
```

可能会有小伙伴产生疑惑了：这就算是 `BeanDefinition` 的合并了吗？哪里有体现呢？要么我 Debug 看下结构？

以 Debug 的形式重新运行 `main` 方法，发现获取到的 `catDefinition` 里并没有把 `person` 的依赖带进来：

![image-20220503203834174](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220503203834.png)

哦，合着并没有合并 `BeanDefinition` 呗？那这一套花里胡哨的搞蛇皮呢？

等一下，先冷静冷静，会不会是我们的方法不对呢？既然是 `BeanDefinition` 的合并，那不加个 **merge** 的关键字，好意思说是合并吗？

试着重新调一下方法，发现 `ConfigurableListableBeanFactory` 里竟然也有一个 `getMergedBeanDefinition` 方法！它来自 `ConfigurableBeanFactory` ，它就是用来**将本身定义的 bean 定义信息，与继承的 bean 定义信息进行合并后返回**的。

#### 3.2.4 换用getMergedBeanDefinition

修改下测试运行，将 `getBeanDefinition` 换为 `getMergedBeanDefinition` ，重新运行 `main` 方法，发现控制台打印的 `BeanDefinition` 的类型变为了 `RootBeanDefinition` ，而且也没有 `parentName` 相关的信息了：

```
Root bean: class [com.linkedbear.spring.definition.d_merge.bean.Cat]; scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in class path resource [definition/definition-merge.xml]

```

以 Debug 方式运行，此时的 `propertyvalues` 中已经有两个属性键值对了：

![image-20220503204047426](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220503204047.png)

到这里，`BeanDefinition` 的合并就算了解的差不多了。至于里面的原理，我们会到后面的 IOC 原理部分解析，这里就先不搞那么难的内容了。

## 4. 设计BeanDefinition的意义【理解】

看到这里，小伙伴们可能会有一个大大的问号，也有可能是大大的感叹号，那就是：**SpringFramework 为什么会设计 `BeanDefinition` 呢？直接注册 Bean 不好吗？**这个问题的回答，在不同的阶段学习中，这个答案可能会不太一样。在刚学习完 `BeanDefinition` 的设计后，小册想先让小伙伴们理解这样的一个设计：**定义信息 → 实例**。

其实这个设计，在前面的元定义章节就已经反复解释过了，这里小册想再解释一下，因为它真的太太太重要了！

像我们平时编写 **Class** 再 **new** 出对象一样，**SpringFramework 面对一个应用程序，它也需要对其中的 bean 进行定义抽取，只有抽取成可以统一类型 / 格式的模型，才能在后续的 bean 对象管理时，进行统一管理，也或者是对特定的 bean 进行特殊化的处理。而这一切的一切，最终落地到统一类型上，就是 `BeanDefinition` 这个抽象化的模型。**

