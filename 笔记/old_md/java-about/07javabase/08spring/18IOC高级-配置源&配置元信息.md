---
title: 18IOC高级-配置源&配置元信息
---

从这一章开始，咱开始进入到难度更高的 IOC 高级部分了。对于要深入学习 SpringFramework 中 IOC 的高级特性或者深入原理部分的小伙伴们来讲，这部分真的很重要呀

本章介绍 SpringFramework 中的配置源和配置元信息。说到配置源，可能有部分小伙伴的第一反应是：数据源？不是还没到 jdbc 吗？那当然没到啦，配置源是针对 SpringFramework 的，不是对数据库的，这个概念，以及元信息的概念可能理解起来会比较困难，本章会尽可能的用比较容易理解的例子来解释清楚。

## 1. 配置源【理解】

### 1.1 如何理解配置源

**配置源**，简单理解，就是**配置的来源**。在前面的超多例子中，都是使用 xml 配置文件或者注解配置类来驱动 IOC 容器，那么对于 IOC 容器而言，xml 配置文件或者注解配置类就可以称之为配置源。

解释这个概念倒是不难，不过我想请小伙伴们思考一个问题：我们自己写好的配置源给了 Spring 之后，Spring 是如何驱动起整个应用上下文的呢？

这个问题倒是不难回答，Spring 拿到配置源后肯定是**先加载**，**再解析**，**最后注册**那些定义好的 **bean 到 IOC 容器**，这个过程基本也就算结束了。下面咱来简单捋一捋这个过程中配置源的**解析**部分。

### 1.2 配置源的解析思路

咱现在已经学过的配置源就是 xml 配置文件，以及注解配置类两种，咱分别来看。

#### 1.2.1 xml配置文件

仔细端倪一会之前写过的 xml 配置文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <context:component-scan base-package="com.linkedbear.spring.basic_di.c_value_spel.bean"/>

    <context:property-placeholder location="classpath:basic_di/value/red.properties"/>

    <bean id="person" class="com.linkedbear.spring.basic_di.a_quickstart_set.bean.Person">
        <property name="name" value="test-person-byset"/>
        <property name="age" value="18"/>
    </bean>
</beans>
```

这个 xml 中包含几个部分：

```
xml 头信息
component-scan 声明包扫描
property-placeholder 引入外部 properties 文件
<bean> 注册 bean 并属性赋值
```

再思考一个问题：为什么在 xml 中能写这些标签呢？很简单，xml 头上的那些约束声明的可以写呗。

那 xml 头上的约束又是从哪来的呢？当然是 SpringFramework 中的 jar 包自带的呗。

思考到这里就可以了，要是真的问 jar 包是哪里来的，可能不出 10 个问题，我们就要开始思考人生了。。。

回到正题上，xml 中定义的这些信息，如果给这些信息一个定义，那它们就可以这样解释：

- xml 中包含 1 条组件扫描的声明
- 包含一条 properties 资源文件引入的声明
- 包含一个 bean 的注册

 于是这个 xml 可以用如下的一种抽象语言描述：

```
beans.xml {
    context: [component-scan, property-placeholder]
    beans: [person]
}
```

这里面不会描述具体的组件扫描路径等等，只会**记录这个 xml 中声明了哪些标签**。

#### 1.2.2 注解配置类

跟上面一样，咱先找一个之前写过的注解配置类：

```java
@Configuration
@ComponentScan("com.linkedbear.spring.bean.b_scope.bean")
public class BeanScopeConfiguration {
    
    @Bean
    public Child child1(Toy toy) {
        Child child = new Child();
        child.setToy(toy);
        return child;
    }
    
    @Bean
    public Child child2(Toy toy) {
        Child child = new Child();
        child.setToy(toy);
        return child;
    }
}
```

根据上面的抽象思维，这个注解配置类也可以进行如下转换：

```
BeanScopeConfiguration.java: {
    annotations: [ComponentScan]
    beans: [child1, child2]
}
```

与上面一样，只会记录配置类中的**配置结构**而已，任何配置信息都不会体现在这里面。

> 注意，这个解析思路仅仅是我们自己分析的，与 SpringFramework 没有关系。

## 2. 元信息【理解】

突然跳到元信息的章节了，是不是有点猝不及防？先缓缓神，想想上面为什么会叨叨这个解析思路呢？

也或者，可能会有一些小伙伴产生一种感觉：这种解析思路像是把**整个文件中配置的所有定义都抽取出来**了，形成了一个类似于**配置定义信息**的东西。

好，如果真的有这个感觉，请一直保持住；如果没有感觉到，那也没有关系，咱来解释一下这里头的重要概念：**元信息**。

#### 2.2.1 Bean的定义元信息【重点】

跟上面的 Class 描述类相似，SpringFramework 中定义的 Bean 也会封装为一个个的 Bean 的元信息，也就是 **`BeanDefinition`** 。它包含了一个 Bean 所需要的几乎所有维度的定义：

- Bean 的全限定名 className
- Bean 的作用域 scope
- Bean 是否延迟加载 lazy
- Bean 的工厂 Bean 名称 factoryBean
- Bean 的构造方法参数列表 constructorArgumentValues
- Bean 的属性值 propertyValues

可以发现，通过这些定义，基本上一个 Bean 的所有特征、属性就全部都描述出来了。

#### 2.2.2 IOC容器的配置元信息【了解】

IOC 容器的配置元信息分为 beans 和 context 两部分，分别展开来看。

##### 2.2.2.1 beans的配置元信息

IOC 容器本身也是有元信息的，只不过这些元信息咱基本没怎么接触。以 xml 配置文件为例，如果你仔细注意一下整个配置文件的最顶层标签，会发现 `<beans>` 其实是有属性的：

| 配置元信息                  |                                                              | **默认值**       |
| --------------------------- | ------------------------------------------------------------ | ---------------- |
| default-autowire            | 默认的自动注入模式（不需要声明 `@Autowired` 等注解即可注入组件） | default（no）    |
| profile                     | 基于环境的配置                                               | ""               |
| default-autowire-candidates | 满足指定属性名规则的属性才会被自动注入                       |                  |
| default-init-method         | 全局 bean 的初始化方法                                       |                  |
| default-destroy-method      | 全局 bean 的销毁方法                                         |                  |
| default-lazy-init           | 全局 bean 是否延迟加载                                       | default（false） |
| default-merge               | 继承父 bean 时直接合并父 bean 的属性值                       | default（false） |

> 注：默认值中提到的 default 是在没有声明时继承父配置的默认值（ `<beans>` 标签是可以嵌套使用的），如果都没有声明，则配置的默认值是括号内的值。

##### 2.2.2.2 context的配置元信息

除此之外，还有一部分 IOC 容器的配置源信息来自于 `spring-context` 包的 context 前缀标签中（如之前写过的 `<component-scan />` 标签）。

| 配置元信息                       |                                                           |
| -------------------------------- | --------------------------------------------------------- |
| \<context:annotation-config/>    | 开启注解驱动                                              |
| \<context:component-scan/>       | 开启组件扫描                                              |
| \<context:property-placeholder/> | 引入外部的资源文件（ properties xml yml 等）              |
| \<context:property-override/>    | 指定配置源会覆盖全局配置（可用于配置覆盖）                |
| \<context:spring-configured/>    | 可以对没有注册到 IOC 容器的 bean 实现依赖注入             |
| \<context:load-time-weaver/>     | 与 AOP 相关（放到 AOP 章节介绍）                          |
| \<context:mbean-server/>         | 暴露应用运行状态监控（与 JMX 管理监控有关）               |
| \<context:mbean-export/>         | 注册 MBean 到 JMX 实现运行状态监控（与 JMX 管理监控有关） |

### 2.3 beans的其他配置元信息

前面介绍 `<beans>` 的配置元信息中，只是介绍了 `<beans>` 标签的属性，在 beans 的命名空间里还有两个常用的标签，而且也都比较简单：

| 配置元信息  |                             |                                                              |
| ----------- | --------------------------- | ------------------------------------------------------------ |
| \<alias/>   | 给指定的 bean 指定别名      | \<alias name="person" alias="zhangsan"/>                     |
| \<import /> | 导入外部现有的 xml 配置文件 | \<import resource="classpath:basic_dl/quickstart-byname.xml"/> |

### 2.4 properties等配置元信息

上一章我们反复研究的 properties 、xml 、yml 文件，它们的作用都是为了将具体的配置抽取为一个可任意修改的配置文件，防止在程序代码中出现硬编码配置，导致修改配置还需要重新编译的麻烦。这种**将配置内容抽取为配置文件**的动作，我们称之为 **“配置外部化”**，抽取出来的配置文件又被成为 **“外部化配置文件”** 

而加载这些外部化配置文件的方式，要么通过上面的 `<context:property-placeholder/>` ，要么通过 `@PropertySource` 注解，它们最终都会被封装为一个一个的 `PropertySource` 对象（ properties 文件被封装为 `PropertiesPropertySource` ）了，而这个 `PropertySource` 对象内部就持有了这些外部化配置文件的所有内容。

