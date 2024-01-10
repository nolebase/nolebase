---
title: 25IOC高级-Java编程式驱动IOC
---

前面几章，我们把后置处理器的类型都学习了，小伙伴们应该对这种编程式的写法有一种比较强的感觉了。这一章，咱来学习如何使用纯编程式的写法，驱动 IOC 容器，来实现前面的配置式 / 声明式的功能。

可能有一些已经在实际工作或项目开发中用过 SpringFramework 的小伙伴会提出一个疑惑：**既然声明式 / 配置式的 Spring 已经这么好用了，为什么还要搞编程式驱动的 IOC 呢？**对于这个问题，见仁见智，作者目前能给出这样几个回答，看小伙伴是否能理解或者接受：

- 亲身接触编程式的 IOC 有助于理解 Spring 在底层对声明式 / 配置式的处理
- SpringBoot 的底层原理，就是利用了原生 SpringFramework 的编程式驱动的 IOC
- 项目开发组如果要基于 Spring 等框架二次封装，可能会利用到编程式驱动的 IOC

so ，作者表达的意思是，编程式驱动的 IOC 一般不会在日常开发中出现，而是在你深入了解 Spring 或者想深度挖掘 Spring 时起到比较大的作用。既然小册是带小伙伴深入学习，那这个深入是必须要入的 ~

## 1. 快速上手编程式驱动IOC【熟悉】

先来一个最简单的需求吧：**不使用任何配置类 / 配置文件，向 IOC 容器注册一个 Person 对象，并注入属性值。**

### 1.1 声明bean

先把 `Person` 类声明出来：

```java
@Data
public class Person {

    private String name;


}
```

接下来本章后面的几个需求，也会利用到这个 Person ，后面就不再重复声明了。

### 1.2 编写启动类

这次没有配置类，没有配置文件，全靠启动类一把梭。

先把骨架写出来：

```java
public class ProgrammaticQuickstartApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
        
        Person person = ctx.getBean(Person.class);
        System.out.println(person);
    }
}
```

由于没有配置类、没有配置文件，所以这里只需要创建一个空的 `ApplicationContext` 即可。

然后，向 IOC 容器中注册一个 `Person` ，参照之前学过的内容，应该可以想到是加载 `BeanDefinition` 吧！所以，我们可以在这里用 `BeanDefinitionBuilder` 构建一个最简单的 `Person` 类型的定义信息，然后注册进 `ApplicationContext` 中：

```java
public static void main(String[] args) throws Exception {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    BeanDefinition personDefinition = BeanDefinitionBuilder.rootBeanDefinition(Person.class).getBeanDefinition();
    ctx.registerBeanDefinition("person", personDefinition);
    
    Person person = ctx.getBean(Person.class);
    System.out.println(person);
}
```

> 注意此处的 `registerBeanDefinition` 方法来自于 `BeanDefinitionRegistry` ，所以用 `ApplicationContext` 或者 `ConfigurableApplicationContext` 接口是拿不到的，只有用实现类，或者强转才可以。

### 1.3 运行失败及原因分析

运行 `main` 方法，控制台会抛出异常：

```
Exception in thread "main" java.lang.IllegalStateException: 
org.springframework.context.annotation.AnnotationConfigApplicationContext@728938a9 
has not been refreshed yet

```

划重点：**has not been refreshed yet**，代表 `ApplicationContext` 还没有被 **refresh** ，无法使用。

我们就接触了 `refresh` 方法的重要，而这些 `ApplicationContext` 的落地实现中，如果没有预先传入配置文件 / 配置类 / 包扫描路径，则必须**手动调用 `refresh()` 方法来初始化 `ApplicationContext`** ，这里面的玄机我们可以简单的看一下源码中，`AnnotationConfigApplicationContext` 的构造方法：

```java
public AnnotationConfigApplicationContext() {
    this.reader = new AnnotatedBeanDefinitionReader(this);
    this.scanner = new ClassPathBeanDefinitionScanner(this);
}

public AnnotationConfigApplicationContext(Class<?>... componentClasses) {
    this();
    register(componentClasses);
    refresh();
}
```

看到了吧，只要传入了配置类，这里会帮我们 `refresh` ，所以我们就可以直接拿来用。

### 1.4 手动refresh后测试

```java
public static void main(String[] args) throws Exception {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();

    BeanDefinition personDefinition = BeanDefinitionBuilder.rootBeanDefinition(Person.class).getBeanDefinition();
    ctx.registerBeanDefinition("person", personDefinition);
    ctx.refresh();

    Person person = ctx.getBean(Person.class);
    System.out.println(person);
}
```

重新运行 `main` 方法，控制台可以打印出 `Person` 的信息，说明这次 `ApplicationContext` 已经能加载出手动构造的 `BeanDefinition` 了：

```
Person{name='null'}

```

### 1.5 给Person的属性赋值

介绍 `BeanDefinition` 的结构时，我们就知道属性变量值的封装是在一组 `PropertyValues` 中，so 在这里，我们构造 BeanDefinition 时，就可以顺便把属性值也设置好：

```java
    BeanDefinition personDefinition = BeanDefinitionBuilder.rootBeanDefinition(Person.class)
            .addPropertyValue("name", "zhangsan").getBeanDefinition();
    ctx.registerBeanDefinition("person", personDefinition);
```

重新运行 `main` 方法，可以发现 name 属性已经被成功设置了：

```
Person{name='zhangsan'}

```

## 2. 编程式依赖注入与bean的初始化【熟悉】

编程式的依赖注入，需求也相对比较简单：**同时在 IOC 容器中注册 `Person` 和两个 `Animal` 的子类对象 `Cat` 和 `Dog` ，并且 `Cat` 和 `Dog` 都依赖 `Person` 。**

### 2.1 声明bean

`Person` 我们就不重复声明了，只把 `Person` 和它的子类造出来就好：

```java
public abstract class Animal {
    
    protected String name;
    
    protected Person person;
    
    // getter setter toString
}
```

```java
public class Cat extends Animal {
    
    @Override
    public String toString() {
        return "Cat{" + "name='" + name + '\'' + ", person=" + person + '}';
    }
}

public class Dog extends Animal {
    
    @Override
    public String toString() {
        return "Dog{" + "name='" + name + '\'' + ", person=" + person + '}';
    }
}
```

也是很简单的写法了吧，前面我们也写过不少次了。

### 2.2 编写启动类

来吧，直接起一个新的主启动类，把骨架写好：

```java
public class ProgrammaticInjectApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
        
        ctx.refresh();
        Cat cat = ctx.getBean(Cat.class);
        System.out.println(cat);
    }
}
```

这次长记性了，先把 `refresh` 方法调用了再说，其余的编程式代码都写到 `refresh` 上面。

这次要构造依赖注入的效果，根据之前在 xml 配置文件中的定义，转换过来就应该是构造两个 `BeanDefinition` 才是，于是就可以这样来写：

```java
    BeanDefinition personDefinition = BeanDefinitionBuilder.rootBeanDefinition(Person.class)
            .addPropertyValue("name", "老王").getBeanDefinition();
    ctx.registerBeanDefinition("laowang", personDefinition);
    
    BeanDefinition catDefinition = BeanDefinitionBuilder.rootBeanDefinition(Cat.class)
            .addPropertyValue("name", "咪咪").addPropertyReference("person", "laowang")
            .getBeanDefinition();
    ctx.registerBeanDefinition("mimi", catDefinition);
```

注意，依赖注入的对象引用，在 xml 配置文件中用 **ref** 属性，此处也是用对应的 property reference 来设置（有木有发现操作的套路完全一致呢）。这样写完之后，我们来运行 `main` 方法，控制台能打印 `Cat` 中注入了 `Person` 的对象：

```
Cat{name='咪咪', person=Person{name='老王'}}

```

### 2.3 bean的初始化时机探究

如果这一小节仅仅是玩这么点东西，那也太没意思了。我们来看看这些通过编程式驱动的 bean 都是什么时候初始化出来的呢？

#### 2.3.1 refresh触发bean的实例化

在 `Animal` 中声明默认的无参构造方法，并添加控制台的打印：

```
public abstract class Animal {
    
    public Animal() {
        System.out.println("Animal constructor run ......");
    }
```

然后，在测试启动类的 `main` 方法，`refresh()` 方法调用之后也添加控制台打印：

```java
    // ......
    ctx.refresh();
    System.out.println("ApplicationContext refreshed ......");
    // ......
```

重新运行 `main` 方法，发现 `Animal` 的实例化动作发生在 `main` 方法控制台打印之前：

```
Animal constructor run ......
ApplicationContext refreshed ......
Cat{name='咪咪', person=Person{name='老王'}}
```

由此可以得出：**`refresh` 方法会触发 bean 的实例化。**

#### 2.3.2 原型bean呢

上面的结论是否是准确的呢？刚才可只是测了单实例 bean 而已吧，我们可以把 `Dog` 也声明出来看一看：（此处声明 `Dog` 为**原型 bean** ）

```java
    BeanDefinition dogDefinition = BeanDefinitionBuilder.rootBeanDefinition(Dog.class)
            .addPropertyValue("name", "汪汪").addPropertyReference("person", "laowang")
            .setScope(ConfigurableBeanFactory.SCOPE_PROTOTYPE).getBeanDefinition();
    ctx.registerBeanDefinition("wangwang", dogDefinition);
```

上面的结论是否是准确的呢？刚才可只是测了单实例 bean 而已吧，我们可以把 `Dog` 也声明出来看一看：（此处声明 `Dog` 为**原型 bean** ）

```java
    BeanDefinition dogDefinition = BeanDefinitionBuilder.rootBeanDefinition(Dog.class)
            .addPropertyValue("name", "汪汪").addPropertyReference("person", "laowang")
            .setScope(ConfigurableBeanFactory.SCOPE_PROTOTYPE).getBeanDefinition();
    ctx.registerBeanDefinition("wangwang", dogDefinition);
```

之后同样的，在下面获取一下 `Dog` ：

```
    Dog dog = ctx.getBean(Dog.class);
    System.out.println(dog);
```

重新运行 `main` 方法，发现原型 bean 并没有在 `refresh` 之前创建对象，所以刚才的结论要改一下了：**`refresh` 方法会触发单实例 bean 的实例化。**

```
Animal constructor run ......
ApplicationContext refreshed ......
Cat{name='咪咪', person=Person{name='老王'}}
Animal constructor run ......
Dog{name='汪汪', person=Person{name='老王'}}
```

#### 2.3.3 延迟加载的bean呢

除了这两者，还有一种特殊情况是 bean 被设置为 `lazy-init` 的延迟加载 bean ，它又会是什么情况呢？

我们把上面 `Dog` 的 `BeanDefinition` 构造中，`scope` 还原回单实例，并设置它是 `lazy-init` 的：

```java
    BeanDefinition dogDefinition = BeanDefinitionBuilder.rootBeanDefinition(Dog.class)
            .addPropertyValue("name", "汪汪").addPropertyReference("person", "laowang")
            // .setScope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
            .setLazyInit(true)
            .getBeanDefinition();
```

重新运行 `main` 方法，发现 `Dog` 的初始化仍然发生在 `refresh` 之后，so 结论又要改了，当然这次总结出来的可就对了：

**`refresh` 方法的执行，会触发非延迟加载的单实例 bean 的实例化和初始化。**

## 3. 内置组件的使用【熟悉】

内置组件，主要包含 `ApplicationContext` 中组合的一些关键的 API （包括扫描器、加载器、解析器等），这一小节我们把它们都拿出来用一用。

### 3.1 借助包扫描

这一小节的需求：**不主动声明 `BeanDefinition` ，把上一小节的 Cat 和 Dog注册进 IOC 容器。**

既然不能主动声明 `BeanDefinition` 了，那就没有办法直接取到 `Cat` 和 `Dog` 了，只能通过其他的手段来实现了。这里比较好的办法是通过包扫描器来辅助我们拿到 `Cat` 和 `Dog` 。

在 SpringFramework 中，有专门的类路径下的包扫描器叫 `ClassPathBeanDefinitionScanner` ，它可以指定一个根包，来扫描路径下的所有指定匹配规则的类。这个话说的很干，小伙伴跟着小册实战一下就会用啦。

#### 3.1.1 包扫描器的创建与规则设置

`ClassPathBeanDefinitionScanner` 在创建时，需要传入 `BeanDefinitionRegistry` ，而 `ApplicationContext` 的落地实现类都实现了 `BeanDefinitionRegistry` 接口，所以可以直接传入 `ApplicationContext` 本身：

```java
public static void main(String[] args) throws Exception {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();

    ClassPathBeanDefinitionScanner scanner = new ClassPathBeanDefinitionScanner(ctx);
```

然后，要给包扫描器设置过滤规则，既然要把 `Cat` 和 `Dog` 都扫进来，而它们的父类都是 `Animal` ，所以此处就可以添加这样的一个包含的过滤规则：

```java
    scanner.addIncludeFilter((metadataReader, metadataReaderFactory) -> {
        // getClassMetadata可以获取到扫描类的相关元信息，此处把Animal的子类都拿出来
        return metadataReader.getClassMetadata().getSuperClassName().equals(Animal.class.getName());
    });
```

然后，要让包扫描器工作了吧，那扫描的动作不用猜也知道是 `scan()` 吧，刚好这个扫描器就有个 `scan()` 方法：

```java
    int count = scanner.scan("com.linkedbear.spring.programmatic.b_di.bean");
```

哎？等一下，它的返回值怎么是 **int** 类型的呢？是不是哪里出了问题？这个地方需要来解释一下了。

#### 3.1.2 包扫描的扫描动作对比

`ClassPathBeanDefinitionScanner` 的 `scan` 方法，在文档注释中有标注，它的返回值是 “number of beans registered” —— **注册进 IOC 容器的 bean 的数量**。所以我们可以得知，**使用 `scan` 方法后，匹配的类会直接被封装为 `BeanDefinition` ，注册进 IOC 容器**。

那有没有一个能返回 `BeanDefinition` 的方法，让我们自行注册呢？当然可以，`ClassPathBeanDefinitionScanner` 还提供了一个 `findCandidateComponents` 方法，该方法就会返回扫描匹配的 `BeanDefinition` 集合：

```java
public Set<BeanDefinition> findCandidateComponents(String basePackage);

```

那太好了啊，用这个方法，我们会拿到包扫描之后封装的 `BeanDefinition` 信息，但不会注册进 IOC 容器，这样就可以任我们处置了（我们还得给这些 bean 属性赋值和注入呢）。

给 bean 的注入，其实就是拿 `BeanDefinition` 进行一番操作罢了，不算麻烦，小伙伴们跟着写一遍就好啦：

```java
    Set<BeanDefinition> animalDefinitions = scanner
            .findCandidateComponents("com.linkedbear.spring.programmatic.b_di.bean");
    animalDefinitions.forEach(definition -> {
        MutablePropertyValues propertyValues = definition.getPropertyValues();
        String beanClassName = definition.getBeanClassName();
        propertyValues.addPropertyValue("name", beanClassName);
        // 设置依赖注入的引用，需要借助RuntimeBeanReference实现
        propertyValues.addPropertyValue("person", new RuntimeBeanReference("laowang"));
        ctx.registerBeanDefinition(Introspector.decapitalize(beanClassName.substring(beanClassName.lastIndexOf("."))), definition);
    });
```

最后，整个 IOC 容器刷新，获取。

#### 3.1.3 测试运行

```java
public static void main(String[] args) throws Exception {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();

    BeanDefinition personDefinition = BeanDefinitionBuilder.rootBeanDefinition(Person.class)
            .addPropertyValue("name", "老王").getBeanDefinition();
    ctx.registerBeanDefinition("laowang", personDefinition);

    ClassPathBeanDefinitionScanner scanner = new ClassPathBeanDefinitionScanner(ctx);
    scanner.addIncludeFilter((metadataReader, metadataReaderFactory) -> {
        return metadataReader.getClassMetadata().getSuperClassName().equals(Animal.class.getName());
    });
    
    // int count = scanner.scan("com.linkedbear.spring.programmatic.b_di.bean");
    Set<BeanDefinition> animalDefinitions = scanner
            .findCandidateComponents("com.linkedbear.spring.programmatic.b_di.bean");
    animalDefinitions.forEach(definition -> {
        MutablePropertyValues propertyValues = definition.getPropertyValues();
        String beanClassName = definition.getBeanClassName();
        propertyValues.addPropertyValue("name", beanClassName);
        propertyValues.addPropertyValue("person", new RuntimeBeanReference("laowang"));
        ctx.registerBeanDefinition(Introspector.decapitalize(beanClassName.substring(beanClassName.lastIndexOf("."))), definition);
    });
    
    ctx.refresh();

    Cat cat = ctx.getBean(Cat.class);
    System.out.println(cat);
}
```

运行 `main` 方法，控制台可以打印出 `Cat` 的内容，说明借助包扫描已经可以实现这个需求了：

```
Animal constructor run ......
Animal constructor run ......
Cat{name='com.linkedbear.spring.programmatic.b_di.bean.Cat', person=Person{name='老王'}}
```

### 3.2 借助xml配置文件解析器

上面的 `Person` 还是自己声明的 `BeanDefinition` 构造，这次的需求要继续变更：**`Person` 声明在 xml 配置文件中，并编程式加载进 IOC 容器中**。

#### 3.2.1 编写xml配置文件

既然换用 xml 配置文件，那咱就先把配置文件搞出来：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="laowang" class="com.linkedbear.spring.programmatic.a_quickstart.bean.Person">
        <property name="name" value="老李"/>
    </bean>
</beans>
```

#### 3.2.2 xml配置文件解析器的使用

在 SpringFramework 中，负责 xml 配置文件解析的组件是 `XmlBeanDefinitionReader` ，它的构造也需要把 `BeanDefinitionRegistry` 传进去：

```java
    XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(ctx);

```

然后，只需要让它加载 xml 配置文件就好了：

```
    reader.loadBeanDefinitions(new ClassPathResource("programmatic/programmatic-components.xml"));

```

注意，`XmlBeanDefinitionReader` 里面可没有加载 xml 配置文件后返回 `BeanDefinition` 的操作了，想一下为什么呢？

很简单，因为 xml 配置文件本身就属于完善了的配置式写法，里面定义 bean 的内容已经很全了，当然不需要再进行编程式干预咯。

#### 3.2.3 测试运行

把上面的这两行，替换掉 3.1.3 节中的 `personDefinition` 注册，并重新运行 `main` 方法，控制台仍然可以打印出 `Cat` 和组合的 `Person` ：

```
Animal constructor run ......
Animal constructor run ......
Cat{name='com.linkedbear.spring.programmatic.b_di.bean.Cat', person=Person{name='老李'}}
```

差不多啦，编程式驱动的 IOC 就讲解这些吧，这些内容并不是全部的编程式驱动，只是想通过这些例子来告诉小伙伴们，一切通过声明式 / 配置式等快速简单的方式实现的工作，底层都是由编程式来支撑实现的，所以我们也可以直接使用编程式驱动来完成同样的功能。只不过，平时的开发中我们真的用不到它，但如果你的等级升得比较高，或者你参与了项目组的底层封装 / 二开，那这些技能可能会给你不小的帮助。