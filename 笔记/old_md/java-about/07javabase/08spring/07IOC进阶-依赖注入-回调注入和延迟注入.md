---
title: 07IOC进阶-依赖注入-回调注入和延迟注入
---

对，这一章的难度算是进阶的，倒不是说难不难，只是这部分涉及的内容可能平时开发中用的相对少，做一个了解+会用即可。

## 1. 回调注入【熟悉】

说起这个回调，其实对于大多数情况来讲，已经不需要实现接口了，直接 `@Autowired` 就可以搞定。但这话不是绝对的，这些回调机制还是有用的，咱还是来学一学。

### 1.1 回调的根源：Aware

回调注入的核心是一个叫 **`Aware`** 的接口，它来自 SpringFramework 3.1 ：

```java
public interface Aware {

}
```

它是一个空接口，底下有一系列子接口，借助 IDEA 的继承关系，可以发现还蛮多的：

![image-20220426200548739](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220426200548.png)

这里面，可能比较常用到的有这么几个，咱单独列出来讲解一下。

### 1.2 比较常用的几个回调接口

| **接口名**                     | **用途**                                                     |
| ------------------------------ | ------------------------------------------------------------ |
| BeanFactoryAware               | 回调注入 BeanFactory                                         |
| ApplicationContextAware        | 回调注入 ApplicationContext（与上面不同，后续 IOC 高级讲解） |
| EnvironmentAware               | 回调注入 Environment                                         |
| ApplicationEventPublisherAware | 回调注入事件发布器                                           |
| ResourceLoaderAware            | 回调注入资源加载器（xml驱动可用）                            |
| BeanClassLoaderAware           | 回调注入加载当前 Bean 的 ClassLoader                         |
| BeanNameAware                  | 回调注入当前 Bean 的名称                                     |

这里面大部分接口，其实在当下的 SpringFramework 5 版本中，借助 `@Autowired` 注解就可以实现注入了，根本不需要这些接口，只有最后面两个，是因 Bean 而异的，还是需要 **Aware** 接口来帮忙注入。下面咱来演示两个接口的作用，剩余的接口小伙伴们可以自行尝试编写体会一下即可。

### 1.3 ApplicationContextAware的使用

#### 1.3.1 创建Bean

新创建一个 `AwaredTestBean` ，用来实现这些 `Aware` 接口。咱先让它实现 `ApplicationContextAware` 接口：

这样就相当于，当这个 `AwaredTestBean` 被初始化好的时候，就会把 `ApplicationContext` 传给它，之后它就可以干自己想干的事了。

```java
public class AwaredTestBean implements ApplicationContextAware {

    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    public void printBeanNames() {
        Stream.of(applicationContext.getBeanDefinitionNames()).forEach(System.out::println);
    }
}
```

#### 1.3.2 创建配置类

之后，编写一个配置类，创建这个 `AwaredTestBean` （没有选择直接用包扫描，是为了演示下面的 `BeanNameAware` 接口）：

```java
@Configuration
public class AwareConfiguration {
    
    @Bean
    public AwaredTestBean bbb() {
        return new AwaredTestBean();
    }
}
```

#### 1.3.3 编写启动类

```java
public class AwareApplication {
    
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(AwareConfiguration.class);
        AwaredTestBean bbb = ctx.getBean(AwaredTestBean.class);
        bbb.printBeanNames();
    }
}
```

运行 `main` 方法，发现容器中的 bean 名称一一被打印，说明 `ApplicationContext` 已经成功注入到 `AwaredTestBean` 中了。

### 1.4 BeanNameAware的使用

如果当前的 bean 需要依赖它本身的 name ，使用 `@Autowired` 就不好使了，这个时候就得使用 `BeanNameAware` 接口来辅助注入当前 bean 的 name 了。

#### 1.4.1 修改bean

给 `AwaredTestBean` 再实现 `BeanNameAware` 接口，并增加 `getName` 方法：

```java
public class AwaredTestBean implements ApplicationContextAware, BeanNameAware {
    
    private String beanName;
    private ApplicationContext ctx;
    
    public String getName() {
        return beanName;
    }
    
    public void printBeanNames() {
        Stream.of(ctx.getBeanDefinitionNames()).forEach(System.out::println);
    }
    
    @Override
    public void setApplicationContext(ApplicationContext ctx) throws BeansException {
        this.ctx = ctx;
    }
    
    @Override
    public void setBeanName(String name) {
        this.beanName = name;
    }
}
```

修改启动类，添加 `getName` 方法的调用并打印：

```java
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(AwareConfiguration.class);
        AwaredTestBean bbb = ctx.getBean(AwaredTestBean.class);
        bbb.printBeanNames();
        System.out.println("-----------");
        System.out.println(bbb.getName());
    }
```

#### 1.4.2 NamedBean

其实，`BeanNameAware` 还有一个可选的搭配接口：**`NamedBean`** ，它专门提供了一个 `getBeanName` 方法，用于获取 bean 的 name 。

> 多提一嘴，`@Autowired` 注入 SpringFramework 内置组件并不是在所有场景都适用的，后续 IOC 高级中会解释这个问题。

## 2. 延迟注入【熟悉】

提到延迟注入，是不是就想起来之前学习依赖查找时的延迟查找了呢？还真就这么回事，下面咱再看看 `ObjectProvider` 如何应用于延迟注入。

### 2.1 setter的延迟注入

之前咱在写 setter 注入时，直接在 setter 中标注 `@Autowired` ，并注入对应的 bean 即可。如果使用延迟注入，则注入的就应该换成 `ObjectProvider` ：

```java
@Component
public class Dog {
    
    private Person person;
    
    @Autowired
    public void setPerson(ObjectProvider<Person> person) {
        // 有Bean才取出，注入
        this.person = person.getIfAvailable();
    }
```

如此设计，可以防止 Bean 不存在时出现异常。

### 2.2 构造器的延迟注入

构造器的延迟注入与 setter 方式不要太像：

```java
@Component
public class Dog {
    
    private Person person;
    
    @Autowired
    public Dog(ObjectProvider<Person> person) {
        // 如果没有Bean，则采用缺省策略创建
        this.person = person.getIfAvailable(Person::new);
    }
}
```

效果跟 setter 是一样的，只不过 setter 的注入时机是创建对象**后**，而构造器的注入时机是创建对象**时**。

### 2.3 属性字段的延迟注入

属性直接注入是不能直接注入 Bean 的，只能注入 `ObjectProvider` ，通常也不会这么干，因为这样注入了之后，每次要用这个 Bean 的时候都得判断一次：

```java
    @Autowired
    private ObjectProvider<Person> person;
    
    @Override
    public String toString() {
        // 每用一次都要getIfAvailable一次
        return "Dog{" + "person=" + person.getIfAvailable(Person::new) + '}';
    }
```

### 依赖注入的注入方式-扩展

| 注入方式   | 被注入成员是否可变 | 是否依赖IOC框架的API               | 注入时机   |                          | 支持延迟注入 |
| ---------- | ------------------ | ---------------------------------- | ---------- | ------------------------ | ------------ |
| 构造器注入 | 不可变             | 否（xml、编程式注入不依赖）        | 对象创建时 | 不可变的固定注入         | 是           |
| 参数注入   | 不可变             | 是（只能通过标注注解来侵入式注入） | 对象创建后 | 通常用于不可变的固定注入 | 否           |
| setter注入 | 可变               | 否（xml、编程式注入不依赖）        | 对象创建后 | 可选属性的注入           | 是           |

## 3.依赖注入4连问

### 3.1 依赖注入的目的和优点？

首先，依赖注入作为 IOC 的实现方式之一，目的就是**解耦**，我们不再需要直接去 new 那些依赖的类对象（直接依赖会导致对象的创建机制、初始化过程难以统一控制）；而且，如果组件存在多级依赖，依赖注入可以将这些依赖的关系简化，开发者只需要定义好谁依赖谁即可。

除此之外，依赖注入的另一个特点是依赖对象的**可配置**：通过 xml 或者注解声明，可以指定和调整组件注入的对象，借助 Java 的多态特性，可以不需要大批量的修改就完成依赖注入的对象替换（面向接口编程与依赖注入配合近乎完美）。

### 3.2 谁把什么注入给谁了？

由于组件与组件之间的依赖只剩下成员属性 + 依赖注入的注解，而注入的注解又被 SpringFramework 支持，所以这个问题也好回答：**IOC 容器把需要依赖的对象注入给待注入的组件**。

### 3.3 依赖注入具体是如何注入的？

关于 `@Autowired` 注解的注入逻辑

`Resource` 和 `@Inject` 的注入方式

### 3.4 使用setter注入还是构造器注入？

这个问题，最好的保险回答是引用官方文档，而官方文档在不同的版本推荐的注入方式也不同，具体可参照如下回答：

- SpringFramework **4.0.2** 及之前是推荐 setter 注入，理由是**一个 Bean 有多个依赖时，构造器的参数列表会很长**；而且如果 **Bean 中依赖的属性不都是必需的话，注入会变得更麻烦**；
- **4.0.3** 及以后官方推荐构造器注入，理由是**构造器注入的依赖是不可变的、完全初始化好的，且可以保证不为 null** ；
- 当然 **4.0.3** 及以后的官方文档中也说了，如果**真的出现构造器参数列表过长的情况，可能是这个 Bean 承担的责任太多，应该考虑组件的责任拆解**。

## 

