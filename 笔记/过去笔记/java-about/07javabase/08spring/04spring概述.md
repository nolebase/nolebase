---
title: 04spring概述
---

## 1.SpringFramework包含的模块

先大致了解一下springFramework的核心模块

- beans、core、context、expression[核心包]
- aop 切面编程
- jdbc
- orm整合orm框架
- tx事物
- web层技术
- test整合测试

## 2.快速入门-IOC-DL

开始一个快速的依赖查找

### 1.引入依赖

```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-context</artifactId>
  <version>5.2.8.RELEASE</version>
</dependency>
```

### 2.声明一个普通的类

声明一个普通的java类

![image-20220423202315775](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220423202315spring.png)

```java
public class Person {

}
```

### 3.配置文件中加入person的配置

在 `quickstart-byname.xml` 中，使用 SpringFramework 的定义规则，将 `Person` 声明到配置文件中：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="person" class="org.clxmm.basic_dl.a_quickstart_byname.bean.Person"></bean>
</beans>
```

### 4.创建启动类

```java
  public static void main(String[] args) throws Exception {

        BeanFactory factory = new ClassPathXmlApplicationContext("basic_dl/quickstart-byname.xml");
        Person person = (Person) factory.getBean("person");
        System.out.println(person);

    }
```

输出

```
org.clxmm.basic_dl.a_quickstart_byname.bean.Person@f6c48ac
```

## 3.IOC依赖查找

### 1.最简单的实验-byName

在上一面的快速开始就是

### 2.根据类型查找-byType

![image-20220423203253270](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220423203253sprin.png)

`quickstart-bytype.xml`不用声明id属性

```
    <bean class="org.clxmm.basic_dl.b_bytype.bean.Person"/>
```

主启动类:不在需要强制类型转换

```java
    public static void main(String[] args) {
        BeanFactory factory = new ClassPathXmlApplicationContext("basic_dl/quickstart-bytype.xml");
        Person person = factory.getBean(Person.class);
        System.out.println(person);
    }
```

输出

```
org.clxmm.basic_dl.b_bytype.bean.Person@598067a5
```

### 3.接口与实现类

![image-20220423211112878](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220423211113spring.png)

xml配置

```xml
<bean class="org.clxmm.basic_dl.b_bytype.bean.dao.impl.DemoDaoImpl"/>
```

启动程序修改

```java
    public static void main(String[] args) {
        BeanFactory factory = new ClassPathXmlApplicationContext("basic_dl/quickstart-bytype.xml");
        Person person = factory.getBean(Person.class);
        System.out.println(person);


        DemoDao demoDao = factory.getBean(DemoDao.class);
        demoDao.findAll();

    }
```

输出

```
org.clxmm.basic_dl.b_bytype.bean.Person@3c0ecd4b
DemoDaoImpl findAll-----
```

证明 `DemoDaoImpl` 也成功注入，并且 `BeanFactory` 可以根据接口类型，找到对应的实现类

## 4.IOC依赖注入

由上面的实例可以发现一个问题：创建的 Bean 都是不带属性的！如果我要创建的 Bean 需要一些预设的属性，那该怎么办呢？那就涉及到 IOC 的另外一种实现了，就是**依赖注入**。还是延续 IOC 的思想，**如果你需要属性依赖，不要自己去找，交给 IOC 容器，让它帮你找**，并给你赋上值。

### 1快速开始

![image-20220423212255546](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220423212255.png)

#### 1.声明类加配置文件

```java
@Data
public class Cat {

    private String name;
    private Person master;
    
}

@Data
public class Person {
    private String name;
    private Integer age;
}
```

配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="person" class="org.clxmm.basic_di.a_quickstart_set.bean.Person">
        <property name="name" value="clxmm"/>
        <property name="age" value="18"/>
    </bean>
    <!-- 关联bean赋值 -->
    <bean id="cat" class="org.clxmm.basic_di.a_quickstart_set.bean.Cat">
        <property name="name" value="test-cat"/>
        <!-- ref引用上面的person对象 -->
        <property name="master" ref="person"/>
    </bean>
</beans>
```

#### 2.运行

```java
    public static void main(String[] args) {
        BeanFactory beanFactory = new ClassPathXmlApplicationContext("basic_di/inject-set.xml");
        Person person = beanFactory.getBean(Person.class);
        System.out.println(person);

        Cat cat = beanFactory.getBean(Cat.class);
        System.out.println(cat);
    }
```

输出

```
Person(name=clxmm, age=18)
Cat(name=test-cat, master=Person(name=clxmm, age=18))
```



## 5.依赖查找与依赖注入的对比

- 作用目标不同
  - 依赖注入的作用目标通常是类成员
  - 依赖查找的作用目标可以是方法体内，也可以是方法体外
- 实现方式不同
  - 依赖注入通常借助一个上下文被动的接收
  - 依赖查找通常主动使用上下文搜索

## 6依赖查找的多种方式

### 1.ofType

试想，如果一个接口有多个实现，而咱又想一次性把这些都拿出来，那 `getBean` 方法显然就不够用了，需要使用额外的方式。

![image-20220423214906400](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220423214906.png)

#### 1.声明一个接口和三个实现类

如上图

#### 2.配置文件

```
<bean class="org.clxmm.basic_dl.c_oftype.dao.impl.DemoMySQLDao"/>
<bean class="org.clxmm.basic_dl.c_oftype.dao.impl.DemoOracleDao"/>
<bean class="org.clxmm.basic_dl.c_oftype.dao.impl.DemoRedisDao"/>
```

#### 3.改用ApplicationContext

ofType: 它可以**传入一个类型，返回一个 Map** ，而 Map 中的 value 不难猜测就是**传入的参数类型对应的那些类 / 实现类**。

```java
    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("basic_dl/quickstart-oftype.xml");

//        DemoDao bean = ctx.getBean(DemoDao.class);
        // No qualifying bean of type 'org.clxmm.basic_dl.c_oftype.dao.DemoDao' available: expected single matching bean but found 3: org.clxmm.basic_dl.c_oftype.dao.impl.DemoMySQLDao#0,org.clxmm.basic_dl.c_oftype.dao.impl.DemoOracleDao#0,org.clxmm.basic_dl.c_oftype.dao.impl.DemoRedisDao#0

        Map<String, DemoDao> beans = ctx.getBeansOfType(DemoDao.class);
        beans.forEach((beanName, bean) -> {
            System.out.println(beanName + ":" + bean);
        });


    }
```

输出

```
org.clxmm.basic_dl.c_oftype.dao.impl.DemoMySQLDao#0:org.clxmm.basic_dl.c_oftype.dao.impl.DemoMySQLDao@598067a5
org.clxmm.basic_dl.c_oftype.dao.impl.DemoOracleDao#0:org.clxmm.basic_dl.c_oftype.dao.impl.DemoOracleDao@3c0ecd4b
org.clxmm.basic_dl.c_oftype.dao.impl.DemoRedisDao#0:org.clxmm.basic_dl.c_oftype.dao.impl.DemoRedisDao@14bf9759
```

这样就实现了传入一个接口 / 抽象类，返回容器中所有的实现类 / 子类。

## 7.BeanFactory与ApplicationContext【掌握】

借助 IDEA ，发现 `ApplicationContext` 也是一个接口，而且通过接口继承关系发现它是 `BeanFactory` 的子接口。那咱想了解这两个接口，最好的办法还是先翻一翻官方文档，从官方文档中尝试获取最权威的解释。

### 1官方文档解释

在官方文档 [docs.spring.io/spring/docs…](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.spring.io%2Fspring%2Fdocs%2F5.2.x%2Fspring-framework-reference%2Fcore.html%23beans-introduction) 中，有一个段落解释了这两个接口的关系：

> The `org.springframework.beans` and `org.springframework.context` packages are the basis for Spring Framework’s IoC container. The [`BeanFactory`](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.spring.io%2Fspring-framework%2Fdocs%2F5.2.x%2Fjavadoc-api%2Forg%2Fspringframework%2Fbeans%2Ffactory%2FBeanFactory.html) interface provides an advanced configuration mechanism capable of managing any type of object. [`ApplicationContext`](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.spring.io%2Fspring-framework%2Fdocs%2F5.2.x%2Fjavadoc-api%2Forg%2Fspringframework%2Fcontext%2FApplicationContext.html) is a sub-interface of `BeanFactory`. It adds:
>
> - Easier integration with Spring’s AOP features
> - Message resource handling (for use in internationalization)
> - Event publication
> - Application-layer specific contexts such as the `WebApplicationContext` for use in web applications.
>
> `org.springframework.beans` 和 `org.springframework.context` 包是 SpringFramework 的 IOC 容器的基础。`BeanFactory` 接口提供了一种高级配置机制，能够管理任何类型的对象。`ApplicationContext` 是 `BeanFactory` 的子接口。它增加了：
>
> - 与 SpringFramework 的 AOP 功能轻松集成
> - 消息资源处理（用于国际化）
> - 事件发布
> - 应用层特定的上下文，例如 Web 应用程序中使用的 `WebApplicationContext`

这样说下来，给咱的主观感受是：**`ApplicationContext` 包含 `BeanFactory` 的所有功能，并且人家还扩展了好多特性**，其实就是这么回事。

> You should use an `ApplicationContext` unless you have a good reason for not doing so, with `GenericApplicationContext` and its subclass `AnnotationConfigApplicationContext` as the common implementations for custom bootstrapping. These are the primary entry points to Spring’s core container for all common purposes: loading of configuration files, triggering a classpath scan, programmatically registering bean definitions and annotated classes, and (as of 5.0) registering functional bean definitions.
>
> 你应该使用 `ApplicationContext` ，除非能有充分的理由解释不需要的原因。一般情况下，我们推荐将 `GenericApplicationContext` 及其子类 `AnnotationConfigApplicationContext` 作为自定义引导的常见实现。这些实现类是用于所有常见目的的 SpringFramework 核心容器的主要入口点：加载配置文件，触发类路径扫描，编程式注册 Bean 定义和带注解的类，以及（从5.0版本开始）注册功能性 Bean 的定义。

这段话的下面还给了一张表，对比了 `BeanFactory` 与 `ApplicationContext` 的不同指标：

| **Feature**                                                  | BeanFactory | ApplicationContext |
| ------------------------------------------------------------ | ----------- | ------------------ |
| Bean instantiation/wiring —— Bean的实例化和属性注入          | Yes         | Yes                |
| Integrated lifecycle management —— 生命周期管理              | No          | Yes                |
| Automatic `BeanPostProcessor` registration —— Bean后置处理器的支持 | No          | Yes                |
| Automatic `BeanFactoryPostProcessor` registration —— BeanFactory后置处理器的支持 | No          | Yes                |
| Convenient `MessageSource` access (for internalization) —— 消息转换服务（国际化） | No          | Yes                |
| Built-in `ApplicationEvent` publication mechanism —— 事件发布机制（事件驱动） | No          | Yes                |

## 8.BeanFactory与ApplicationContext的对比

`BeanFactory` 接口提供了一个**抽象的配置和对象的管理机制**，`ApplicationContext` 是 `BeanFactory` 的子接口，它简化了与 AOP 的整合、消息机制、事件机制，以及对 Web 环境的扩展（ `WebApplicationContext` 等），`BeanFactory` 是没有这些扩展的。

`ApplicationContext` 主要扩展了以下功能：

- AOP 的支持（ `AnnotationAwareAspectJAutoProxyCreator` 作用于 Bean 的初始化之后 ）

- 配置元信息（ `BeanDefinition` 、`Environment` 、注解等 ）

- 资源管理（ `Resource` 抽象 ）

- 事件驱动机制（ `ApplicationEvent` 、`ApplicationListener` ）

- `Environment` 抽象（ SpringFramework 3.1 以后）

## 9.withAnnotation

IOC 容器除了可以根据一个父类 / 接口来找实现类，还可以根据类上标注的注解来查找对应的 Bean 。下面咱来测试包含注解的 Bean 如何被查找。

![image-20220424201713797](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220424201713.png)

### 1.声明注解与bean

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Color {

}
```

```java
@Color
public class Balck {
}

@Color
public class Red {
}

public class Dog {
}
```

Dog类上没有加注解

### 2.配置配置文件

```xml
    <bean class="org.clxmm.basic_dl.d_withanno.bean.Dog"/>
    <bean class="org.clxmm.basic_dl.d_withanno.bean.Red"/>
    <bean class="org.clxmm.basic_dl.d_withanno.bean.Balck"/>
```

### 3.运行程序

```java
    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("basic_dl/quickstart-withanno.xml");
        Map<String, Object> beans = ctx.getBeansWithAnnotation(Color.class);
        beans.forEach((beanName, bean) -> {
            System.out.println(beanName + " : " + bean.toString());
        });
    }
```

输出

```
org.clxmm.basic_dl.d_withanno.bean.Red#0 : org.clxmm.basic_dl.d_withanno.bean.Red@370736d9
org.clxmm.basic_dl.d_withanno.bean.Balck#0 : org.clxmm.basic_dl.d_withanno.bean.Balck@5f9d02cb
```

可以发现控制台只打印了 `Black` 和 `Red` ，证明成功取出

## 10.获取IOC容器中的所有Bean

接下来咱就试一下这个 `getBeanDefinitionNames` 方法的效果，编写一个新的启动类，这次咱就不再造 bean 了，咱直接拿上面刚测试过的吧：

```java
public class BeannamesApplication {
    
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("basic_dl/quickstart-withanno.xml");
        String[] beanNames = ctx.getBeanDefinitionNames();
        // 利用jdk8的Stream快速编写打印方法
        Stream.of(beanNames).forEach(System.out::println);
    }
}
```

输出

```
org.clxmm.basic_dl.d_withanno.bean.Dog#0
org.clxmm.basic_dl.d_withanno.bean.Red#0
org.clxmm.basic_dl.d_withanno.bean.Balck#0
```

## 11.依赖查找-延迟查找

对于一些特殊的场景，需要依赖容器中的某些特定的 Bean ，但当它们不存在时也能使用默认 / 缺省策略来处理逻辑。这个时候，使用上面已经学过的方式倒是可以实现，但编码可能会不很优雅。

### 1.使用现有方案实现Bean缺失时的缺省加载

咱把设计做的简单一些，准备两个 bean ：`Cat` 和 `Dog` ，但是在 xml 中咱只注册 `Cat` ，这样 IOC 容器中就只有 `Cat` ，没有 `Dog` 。

之后，咱来编写启动类。由于 Dog 没有在 IOC 容器中，所以调用 `getBean` 方法时会报 `NoSuchBeanDefinitionException` ，为了保证能在没有找到 Bean 的时候启用缺省策略，咱可以在 catch 块中手动创建，实现代码如下：

```java
public class ImmediatlyLookupApplication {
    
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("basic_dl/quickstart-lazylookup.xml");
        Cat cat = ctx.getBean(Cat.class);
        System.out.println(cat);
        
        Dog dog;
        try {
            dog = ctx.getBean(Dog.class);
        } catch (NoSuchBeanDefinitionException e) {
            // 找不到Dog时手动创建
        	dog = new Dog();
        }
        System.out.println(dog);
    }

}
```

### 2.改良-获取之前先检查

既然作为一个容器，能获取自然就能有检查，`ApplicationContext` 中有一个方法就可以专门用来检查容器中是否有指定的 Bean ：`containsBean`

```java
    Dog dog = ctx.containsBean("dog") ? (Dog) ctx.getBean("dog") : new Dog();

```

但注意，这个 `containsBean` 方法只能传 bean 的 id ，不能查类型，所以虽然可以改良前面的方案，但还是有问题：如果 Bean 的名不叫 dog ，叫 wangwang ，那这个方法岂不是废了？所以这个方案还是不够好，需要改良。

### 3.改良-延迟查找

如果能有一种机制，我想获取一个 Bean 的时候，你可以**先不给我报错，先给我一个包装让我拿着，回头我自己用的时候再拆开决定里面有还是没有**，这样是不是就省去了 IOC 容器报错的麻烦事了呢？在 SpringFramework 4.3 中引入了一个新的 API ：**`ObjectProvider`** ，它可以实现延迟查找。

```java
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("basic_dl/quickstart-lazylookup.xml");
        Cat cat = ctx.getBean(Cat.class);
        System.out.println(cat);
        // 下面的代码会报Bean没有定义 NoSuchBeanDefinitionException
        // Dog dog = ctx.getBean(Dog.class);
    
        // 这一行代码不会报错
        ObjectProvider<Dog> dogProvider = ctx.getBeanProvider(Dog.class);
    }
```

可以发现，`ApplicationContext` 中有一个方法叫 `getBeanProvider` ，它就是返回上面说的那个**“包装”**。如果直接 `getBean` ，那如果容器中没有对应的 Bean ，就会报 `NoSuchBeanDefinitionException`；如果使用这种方式，运行 `main` 方法后发现并没有报错，只有调用 `dogProvider` 的 `getObject` ，真正要取包装里面的 Bean 时，才会报异常。所以总结下来，`ObjectProvider` 相当于**延后了 Bean 的获取时机，也延后了异常可能出现的时机**。

但是，上面的问题还没有被解决呀，调用 `getObject` 方法还是会报异常，那下面咱就继续研究 `ObjectProvider` 的其他一些方法。

### 4. 延迟查找-方案实现

`ObjectProvider` 中还有一个方法：`getIfAvailable` ，它可以在**找不到 Bean 时返回 null 而不抛出异常**。使用这个方法，就可以避免上面的问题了。改良之后的代码如下：

```java
    Dog dog = dogProvider.getIfAvailable();
    if (dog == null) {
        dog = new Dog();
    }
```

### 5.ObjectProvider在jdk8的升级

随着 SpringFramework 5.0 基于 jdk8 的发布，函数式编程也被大量用于 SpringFramework 中。`ObjectProvider` 中新加了几个方法，可以使编码更佳优雅。

`ObjectProvider` 在 SpringFramework 5.0 后扩展了一个带 `Supplier` 参数的 `getIfAvailable` ，它可以在找不到 Bean 时直接用 **`Supplier`** 接口的方法返回默认实现，由此上面的代码还可以进一步简化为：

```java
    Dog dog = dogProvider.getIfAvailable(() -> new Dog());

// 或者更简单的，使用方法引用：

    Dog dog = dogProvider.getIfAvailable(Dog::new);

```

当然，一般情况下，取出的 Bean 都会马上或者间歇的用到，`ObjectProvider` 还提供了一个 `ifAvailable` 方法，可以在 Bean 存在时执行 `Consumer` 接口的方法：

```java
    dogProvider.ifAvailable(dog -> System.out.println(dog)); // 或者使用方法引用

```

