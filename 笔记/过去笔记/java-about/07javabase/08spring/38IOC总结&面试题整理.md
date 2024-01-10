---
title: 38IOC总结&面试题整理
---

## 1. SpringFramework的基本知识

先回顾一下 SpringFramework 框架本身的一些基本知识吧，学习了一个框架，它是干什么的，它能干什么，这些还是得清楚。

### 1.1 SpringFramework概述

**SpringFramework 是一个开源的、松耦合的、分层的、可配置的一站式企业级 Java 开发框架，它的核心是 IOC 与 AOP ，它可以更容易的构建出企业级 Java 应用，并且它可以根据应用开发的组件需要，整合对应的技术。**

### 1.2 为什么使用SpringFramework

- IOC：组件之间的解耦（由强依赖降为弱依赖）
- AOP：切面编程可以将应用业务做统一或特定的功能增强，能实现应用业务与增强逻辑的解耦
- 容器与事件：管理应用中使用的组件 Bean、托管 Bean 的生命周期、事件与监听器的驱动机制
- Web、事务控制、测试、与其他技术的整合

### 1.3 SpringFramework的模块划分

-  beans、core、context、expression 【核心包、容器】
- aop 【切面编程】
- jdbc 【整合 jdbc 】
- orm 【整合 ORM 框架】
- tx 【事务控制】
- web 【 Web 层技术】
- test 【整合测试】

## 2. IOC相关

### 2.1 如何理解IOC

**IOC 控制反转**是一种**思想**，它的核心是**将控制权转交出去**。利用 IOC 思想，可以实现组件之间的**解耦**。IOC 的实现方式通常有依赖注入和依赖查找。

### 2.2 为什么使用IOC

-  解耦
- 解决对象间的依赖关系
- 托管对象的大部分生命周期过程，应用程序仅关心使用过程

### 2.3 IOC的实现方式及对比

- 作用目标不同
  - 依赖注入的作用目标通常是类成员（当然也可以是方法参数）
  - 依赖查找的作用目标可以是方法体内，也可以是方法体外
- 实现方式不同
  - 依赖注入通常借助一个上下文**被动**的接收（标注 `@Autowired` 注解 / `<property>` 标签配置）
  - 依赖查找通常**主动**使用上下文搜索（拿到 `BeanFactory` / `ApplicationContext` 之后主动调用 `getBean` 方法）

### 2.4 IOC在Spring中的实现方式

##### 依赖查找

- getBean ：根据 name 获取 / 根据 Class 获取指定的 bean
- ofType ：根据 Class 获取容器中所有指定类型的 bean
- withAnnotation ：获取标注了指定注解的 bean
- getBeanDefinitionNames ：获取容器中的所有 bean 的 name
- getBeanProvider ：延迟查找，先获取 ObjectProvider 后获取实际的对象，如果不存在可使用缺省值代替

##### 依赖注入

- xml 配置文件
  - 借助 \<property> 标签给带有 setter 方法的属性赋值 / 注入依赖对象
  - 借助 \<constructor-arg> 标签使用 bean 的构造器注入依赖对象 / 属性赋值
- 注解驱动方式
  - 使用 @Value 给普通属性赋值
  - 使用 @Autowired / @Resource / @Inject 注解给组件依赖注入
  - 借助 ObjectProvider 可以实现组件延迟注入
  - 借助 Aware 系列接口实现回调注入

### 2.5 使用依赖注入的优点

首先，依赖注入作为 IOC 的实现方式之一，目的就是**解耦**，我们不再需要直接去 new 那些依赖的类对象（直接依赖会导致对象的创建机制、初始化过程难以统一控制）；而且，如果组件存在多级依赖，依赖注入可以将这些依赖的关系简化，开发者只需要定义好谁依赖谁即可。

除此之外，依赖注入的另一个特点是依赖对象的**可配置**：通过 xml 或者注解声明，可以指定和调整组件注入的对象，借助 Java 的多态特性，可以不需要大批量的修改就完成依赖注入的对象替换（面向接口编程与依赖注入配合近乎完美）。

再有一个，依赖注入可以不需要依赖框架的 API （仅依赖 JSR 规范也可以实现依赖注入），而依赖查找必须要拿到框架的容器 API ，从这一点也能看出来依赖注入的一个优点是**与框架 API 的低耦合**。

### 2.6 依赖注入的注入方式对比

| 注入方式   | 被注入成员是否可变 | 是否依赖IOC框架的API                                         |                                    |
| ---------- | ------------------ | ------------------------------------------------------------ | ---------------------------------- |
| 构造器注入 | 不可变             | 否（xml、编程式注入不依赖）                                  | 不可变的固定注入                   |
| 参数注入   | 不可变             | 否（高版本中注解配置类中的 `@Bean` 方法参数注入可不标注注解） | 注解配置类中 `@Bean` 方法注册 bean |
| 属性注入   | 不可变             | 是（只能通过标注注解来侵入式注入）                           | 通常用于不可变的固定注入           |
| setter注入 | 可变               | 否（xml、编程式注入不依赖）                                  | 可选属性的注入                     |

### 2.7 自动注入的注解对比

| 注解       | 注入方式         | 支持@Primary | 来源                         | Bean不存在时处理                     |
| ---------- | ---------------- | ------------ | ---------------------------- | ------------------------------------ |
| @Autowired | 根据**类型**注入 | 支持         | SpringFramework 原生注解     | 可指定 required=false 来避免注入失败 |
| @Resource  | 根据**名称**注入 | 支持         | JSR 250 规范                 | 容器中不存在指定 Bean 会抛出异常     |
| @Inject    | 根据**类型**注入 | 支持         | JSR 330 规范 ( 需要导jar包 ) | 容器中不存在指定 Bean 会抛出异常     |

`@Qualifier` ：如果被标注的成员 / 方法在根据类型注入时发现有多个相同类型的 Bean ，则会根据该注解声明的 name 寻找特定的 bean 。

`@Primary` ：如果有多个相同类型的 Bean 同时注册到 IOC 容器中，使用 “根据类型注入” 的注解时会注入标注 `@Primary` 注解的 bean 。

### 2.8 使用setter注入还是构造器注入

- SpringFramework **4.0.2** 及之前是推荐 setter 注入，理由是**一个 Bean 有多个依赖时，构造器的参数列表会很长**；而且如果 **Bean 中依赖的属性不都是必需的话，注入会变得更麻烦**；
- **4.0.3** 及以后官方推荐构造器注入，理由是**构造器注入的依赖是不可变的、完全初始化好的，且可以保证不为 null** ；
- 当然 **4.0.3** 及以后的官方文档中也说了，如果**真的出现构造器参数列表过长的情况，可能是这个 Bean 承担的责任太多，应该考虑组件的责任拆解**。

### 2.9 Spring中的自动注入模式

- byType ：根据类型注入
- byName ：根据组件的 name 注入
- byConstructor ：根据构造器注入
- autodetect ：通过类的内省机制决定使用哪种方式注入
  - 顺序：byConstructor → byType
- no ：不自动注入（默认）

> 这个问题之前可能问的比较多，由于现在自动注入模式的使用越来越少了，所以这个问题相对的也就没多少关注度了，不过小伙伴们还是知道一下为好。

## 3. IOC容器相关

### 3.1 如何对比BeanFactory与ApplicationContext

`BeanFactory` 接口提供了一个**抽象的配置和对象的管理机制**，`ApplicationContext` 是 `BeanFactory` 的子接口，它简化了与 AOP 的整合、消息机制、事件机制，以及对 Web 环境的扩展（ `WebApplicationContext` 等），`BeanFactory` 是没有这些扩展的。

`ApplicationContext` 主要扩展了以下功能：

- AOP 的支持（ `AnnotationAwareAspectJAutoProxyCreator` 作用于 bean 的初始化之后 ）
- 配置元信息（ `BeanDefinition` 、`Environment` 、注解等 ）
- 资源管理（ `Resource` 抽象 ）
- 事件驱动机制（ `ApplicationEvent` 、`ApplicationListener` ）
- 消息与国际化（ `LocaleResolver` ）
- `Environment` 抽象（ SpringFramework 3.1 以后）

| Feature                                                      | **BeanFactory** | ApplicationContext |
| ------------------------------------------------------------ | --------------- | ------------------ |
| Bean instantiation/wiring —— Bean 的实例化和属性注入         | Yes             | Yes                |
| Integrated lifecycle management —— **生命周期管理**          | No              | Yes                |
| Automatic `BeanPostProcessor` registration —— **Bean后置处理器的支持** | No              | Yes                |
| Automatic `BeanFactoryPostProcessor` registration —— **BeanFactory 的后置处理器的支持** | No              | Yes                |
| Convenient `MessageSource` access (for internalization) —— **消息转换服务（国际化）** | No              | Yes                |
| Built-in `ApplicationEvent` publication mechanism —— **事件发布机制（事件驱动）** | No              | Yes                |

> 如果面试中被问到这个问题，注意在回答时表达清楚 **`ApplicationContext` 是基于 `BeanFactory` 的扩展而不是继承**！因为底层我们也看到了，无论是 `AbstractRefreshableApplicationContext` 还是 `GenericApplicationContext` ，底层都是组合了一个 `DefaultListableBeanFactory` 。

### 3.2 ApplicationContext的类型

从支持的配置源的角度来看，`ApplicationContext` 分为两种：基于 xml 配置文件的 `ApplicationContext` ，和基于注解驱动配置类的 `ApplicationContext` 。其中基于 xml 配置文件的 `ApplicationContext` 又有 `ClassPathXmlApplicationContext` 和 `FileSystemXmlApplicationContext` 两种，它们的区别是加载 xml 配置文件的基准路径不同；基于注解驱动配置类的 `ApplicationContext` 只有 `AnnotationConfigApplicationContext` ，它可以基于配置类驱动，也可以基于包扫描路径驱动。

### 3.3 对比BeanFactory与FactoryBean

`BeanFactory` ：SpringFramework 中实现 IOC 的最底层容器（此处的回答可以从两种角度出发：从类的继承结构上看，它是最顶级的接口，也就是最顶层的容器实现；从类的组合结构上看，它则是最深层次的容器，`ApplicationContext` 在最底层组合了 `BeanFactory` ）。

`FactoryBean` ：创建对象的工厂 Bean ，可以使用它来直接创建一些初始化流程比较复杂的对象

### 3.4 BeanFactory的设计

【接口的设计角度】从 `BeanFactory` 的顶层接口开始，最基础的 `BeanFactory` 只具备**依赖查找**的能力，下面的扩展接口分别增加了 `BeanFactory` 的**层次性**、**可列举**、**可配置**的特性。

【实现的设计角度】`BeanFactory` 的实现类中，大多采用 “父类控制流程 + 子类实现细节” 的方式完成底层的功能逻辑，在父类中使用大量模板方法来控制整体的逻辑流程，由子类实现这些模板方法，完成功能的真正实现。

【特性】`BeanFactory` 本身具备以下基本功能特性：

- 基础的容器（ DL 、DI ）
- 定义了作用域的概念（ scope ）
- 集成环境配置（ `Environment` ）
- 支持多种类型的配置源（ `Resource` 、`PropertySource` ）
- 层次性的设计（ Hierarchical ）
- 完整的生命周期控制机制（ `createBean` 定义在 `BeanFactory` 中而不是 `ApplicationContext`）

### 3.5 ApplicationContext的设计

【接口的设计角度】`ApplicationContext` **继承了 `BeanFactory` 接口**，它具备 `BeanFactory` 本身的特性；除此之外，`ApplicationContext` 还继承了多个接口，扩展了资源加载解析、消息国际化、事件发布等特性。

【实现的设计角度】`ApplicationContext` 分为 xml 配置文件和注解驱动两种不同的驱动实现，它们的实现方式与 `BeanFactory` 相似，也是采用 “父类控制流程 + 子类实现细节” 的方式设计。

【扩展特性】`ApplicationContext` 提供了以下的特性：

- 用于访问应用程序组件的 Bean 工厂方法，它继承自 `ListableBeanFactory` 。
- 以通用方式加载文件资源的能力，它继承自 `ResourceLoader` 。
- 能够将事件发布给注册的监听器，它继承自 `ApplicationEventPublisher` 。
- 解析消息的能力，支持国际化，它继承自 `MessageSource` 。
- 从父上下文继承，在子容器中的定义将始终优先。（ `ApplicationContext` 也具有层次性）

### 3.6 Environment的设计

**`Environment` 是 SpringFramework 3.1 引入的抽象的概念，它包含 profiles 和 properties 的信息，可以实现统一的配置存储和注入、配置属性的解析等。其中 profiles 实现了一种基于模式的环境配置，properties 则应用于外部化配置。**

> 理解 `Environment` ，要先理解 `ApplicationContext` 、`Environment` 、`BeanFactory` 、beans 之间的关系，把这个关系理清楚之后，再按照自己的理解，解释 `Environment` 的时候也会更加的容易。

### 3.7 如何理解BeanDefinitionRegistry

**`BeanDefinitionRegistry` 是维护 `BeanDefinition` 的注册中心，它内部存放了 IOC 容器中 bean 的定义信息，同时 `BeanDefinitionRegistry` 也是支撑其它组件和动态注册 Bean 的重要组件。在 SpringFramework 中，`BeanDefinitionRegistry` 的实现是 `DefaultListableBeanFactory` 。**

> 重点理解 `BeanDefinitionRegistry` 针对的目标是 `BeanDefinition` 而不是 bean 对象哦！

### 3.8 对比BeanFactory与BeanDefinitionRegistry

`BeanFactory` ：SpringFramework 中实现 IOC 的最底层容器，内部存放了应用中注册的 bean 实例。

`BeanDefinitionRegistry` ：`BeanDefinition` 的注册表，它的维护对象是 `BeanDefinition` 而不是 bean 实例，

> 在这个问题上，小伙伴们一定要辩证的去看：虽然最终 `DefaultListableBeanFactory` 同时实现了 `BeanFactory` 与 `BeanDefinitionRegistry` 两个接口，但这不代表 `BeanFactory` 与 `BeanDefinitionRegistry` 可以混为一谈，它们两个的分工是非常明确且高度分离的。

### 3.9 BeanFactoryPostProcessor

#### 3.9.1 BeanFactoryPostProcessor的设计

**`BeanFactoryPostProcessor` 是容器的扩展点，它用于 IOC 容器的生命周期中，所有 `BeanDefinition` 都注册到 `BeanFactory` 后回调触发，用于访问 / 修改已经存在的 `BeanDefinition` 。与 `BeanPostProcessor` 相同，它们都是容器隔离的，不同容器中的 `BeanFactoryPostProcessor` 不会相互起作用。**

关键点：**改变原有 bean 的定义信息**

#### 3.9.2 BeanDefinitionRegistryPostProcessor的设计

**`BeanDefinitionRegistryPostProcessor` 是容器的扩展点，它用于 IOC 容器的生命周期中，所有 `BeanDefinition` 都准备好，即将加载到 `BeanFactory` 时回调触发，用于给 `BeanFactory` 中添加新的 `BeanDefinition` 。`BeanDefinitionRegistryPostProcessor` 也是容器隔离的，不同容器中的 `BeanDefinitionRegistryPostProcessor` 不会相互起作用。**

关键点：**注册新的 bean 定义信息**

#### 3.9.3 后置处理器的对比

|              | **BeanPostProcessor**                       | **BeanFactoryPostProcessor**                                 | **BeanDefinitionRegistryPostProcessor**                      |
| ------------ | ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 处理目标     | bean 实例                                   | BeanDefinition                                               | `BeanDefinition` 、`.class` 文件等                           |
| 执行时机     | bean 的初始化阶段前后（已创建出 bean 对象） | `BeanDefinition` 解析完毕并注册进 `BeanFactory` 之后（此时 bean 未实例化） | 配置文件、配置类已解析完毕并注册进 `BeanFactory` ，但还没有被 `BeanFactoryPostProcessor` 处理 |
| 可操作的空间 | 给 bean 的属性赋值、创建代理对象等          | 给 `BeanDefinition` 中增删属性、移除 `BeanDefinition` 等     | 向 `BeanFactory` 中注册新的 `BeanDefinition`                 |

## 4. Bean相关

### 4.1 Bean的类型有哪些

SpringFramework 中的 Bean 只有两种类型：普通 Bean 、工厂 Bean （ `FactoryBean` ）。

普通 Bean 就是最最普通的 bean 对象而已，绝大部分创建的 bean 都是普通 Bean 。

`FactoryBean` 不会在实际的业务逻辑中起作用，而是由创建的对象来起作用。`FactoryBean` 本身是一个接口，它只是创建真正 Bean 对象的工厂而已。

### 4.2 Bean的作用域有哪些

SpringFramework 中内置了 6 种作用域（5.x 版本）：

| 作用域类型    |                                                |
| ------------- | ---------------------------------------------- |
| **singleton** | 一个 IOC 容器中只有一个【默认值】              |
| **prototype** | 每次获取创建一个                               |
| request       | 一次请求创建一个（仅 Web 应用可用）            |
| session       | 一个会话创建一个（仅 Web 应用可用）            |
| application   | 一个 Web 应用创建一个（仅 Web 应用可用）       |
| websocket     | 一个 WebSocket 会话创建一个（仅 Web 应用可用） |

### 4.3 Bean的实例化方式

SpringFramework 中实例化 Bean 的方式，分为 4 种普通方式 + 1 种特殊方式：

- 直接通过 `<bean>` / `@Bean` / `@Component` 的方式注册 Bean 后实例化
- 借助 `FactoryBean` 实例化 bean
- 使用静态工厂方法（ `factory-method` ）实例化 bean
- 使用实例工厂方法（ `factory-bean` + `factory-method` ）实例化 bean
- 借助 `InstantiationAwareBeanPostProcessor` 实例化 bean （该法比较特殊，它实际上是拦截原有 bean 的创建流程而已）

### 4.4 Bean初始化/销毁的三种生命周期控制方法对比

|            | init-method & destroy-method              | @PostConstruct & @PreDestroy     | InitializingBean & DisposableBean |
| ---------- | ----------------------------------------- | -------------------------------- | --------------------------------- |
| 执行顺序   | 最后                                      | 最先                             | 中间                              |
| 组件耦合度 | 无侵入（只在 `<bean>` 和 `@Bean` 中使用） | 与 JSR 规范耦合                  | 与 SpringFramework 耦合           |
| 容器支持   | xml 、注解原生支持                        | 注解原生支持，xml 需开启注解驱动 | xml 、注解原生支持                |
| 单实例Bean | √                                         | √                                | √                                 |
| 原型Bean   | 只支持 init-method                        | √                                | √                                 |

### 4.5 如何理解BeanDefinition

**`BeanDefinition` 描述了 SpringFramework 中 bean 的元信息，它包含 bean 的类信息、属性、行为、依赖关系、配置信息等。`BeanDefinition` 具有层次性，并且可以在 IOC 容器初始化阶段被 `BeanDefinitionRegistryPostProcessor` 构造和注册，被 `BeanFactoryPostProcessor` 拦截修改等。**

> 学完后置处理器之后，再看这个回答，是不是就容易理解多了呢？IOC 的高级部分很多都是围绕 `BeanDefinition` 做事情的，所以 `BeanDefinition` 的理解小伙伴们一定要明确。

### 4.6 设计BeanDefinition的意义

**SpringFramework 面对一个应用程序，它也需要对其中的 bean 进行定义抽取，只有抽取成可以统一类型 / 格式的模型，才能在后续的 bean 对象管理时，进行统一管理，也或者是对特定的 bean 进行特殊化的处理。而这一切的一切，最终落地到统一类型上，就是 `BeanDefinition` 这个抽象化的模型。**

> 学完后置处理器之后，再回过头来理解 `BeanDefinition` 的设计，那种 “哦，原来如此” 的感觉是不是就很强烈了？先有定义，后有实例，这样更容易实现全流程的控制和扩展的切入。

### 4.7 BeanPostProcessor

#### 4.7.1 BeanPostProcessor的设计

**`BeanPostProcessor` 是一个容器的扩展点，它针对的是 bean 对象，可以在 bean 的生命周期过程中，初始化阶段前后添加自定义处理逻辑，并且不同 IOC 容器间的 `BeanPostProcessor` 不会相互干预。**

#### 4.7.2 BeanPostProcessor的扩展

通常在 SpringFramework 的内部，扩展的 `BeanPostProcessor` 有以下几种：

- InstantiationAwareBeanPostProcessor ：作用于 bean 对象的实例化前后，以及属性赋值阶段

- MergedBeanDefinitionPostProcessor ：作用于 BeanDefinition 的合并阶段，借助它可以完成层级 bean 的定义信息汇总

  - 如 AutowiredAnnotationBeanPostProcessor 会收集 bean 所属类及 bean 所属类的父类中的自动注入信息

- DestructionAwareBeanPostProcessor ：作用于 bean 对象的销毁动作之前

  > BeanPostProcessor 与 BeanFactoryPostProcessor 的对比在上面 3.9.3 节。

### 4.8 单实例Bean的线程安全问题



默认情况下单实例 Bean 的线程是不安全的（ 只要有可能变动的成员属性 ），如果 bean 存在多种状态，则需要考虑换为 prototype 作用域类型的原型 Bean 。

### 4.9 【复杂】Bean的生命周期

#### 4.9.1 概述回答

**首先，bean 的生命周期分为 `BeanDefinition` 阶段和 bean 实例阶段。**

1）**`BeanDefinition` 阶段分为加载 xml 配置文件、解析注解配置类、编程式构造 `BeanDefinition` 、`BeanDefinition` 的后置处理，一共四个部分**

2）**bean 实例阶段的生命周期包含四大步骤：**

 a）**bean 的实例化** b）**属性赋值 + 依赖注入** c）**bean 的初始化生命周期回调** d）**bean 实例的销毁**

> 作者在这里有话要说，虽然一般情况下，面试中被问到如何理解 bean 的生命周期（或者相似的内容），大多数的应聘者在回答时，都是只回答最经常接触的三种初始化和销毁的回调方法（ `init-method` 等），但这样回答对于面试官而言，可能只是一个“正确”的答案，却不会是一个优质的、能让面试官眼前一亮的答案。理解 bean 的生命周期，首先要从 `BeanDefinition` 开始切入，由 `BeanDefinition` 再到 bean 实例，这个回答的逻辑和脉络才是一个好的回答。能不能回答出 `BeanDefinition` ，以及这期间参与的后置处理器，是划分 “普通 Spring 开发者” ，和 “有深度的 Spring 开发者” 的依据之一。

#### 4.9.2 BeanDefinition阶段的生命周期

1. **加载 xml 配置文件** 发生在基于 xml 配置文件的 `ApplicationContext` 中 `refresh` 方法的 **`BeanFactory` 初始化阶段**，此时 `BeanFactory` 刚刚构建完成，它会借助 `XmlBeanDefinitionReader` 来加载 xml 配置文件，并使用 `DefaultBeanDefinitionDocumentReader` 解析 xml 配置文件，封装声明的 `<bean>` 标签内容并转换为 `BeanDefinition` 。
2. **解析注解配置类** 发生在 `ApplicationContext` 中 `refresh` 方法的 **`BeanDefinitionRegistryPostProcessor` 执行阶段**，该阶段首先会执行 `ConfigurationClassPostProcessor` 的 `postProcessBeanDefinitionRegistry` 方法。`ConfigurationClassPostProcessor` 中会找出所有的配置类，排序后依次解析，并借助 `ClassPathBeanDefinitionScanner` 实现包扫描的 `BeanDefinition` 封装，借助 `ConfigurationClassBeanDefinitionReader` 实现 `@Bean` 注解方法的 `BeanDefinition` 解析和封装。
3. **编程式构造 `BeanDefinition`** 也是发生在 `ApplicationContext` 中 `refresh` 方法的 **`BeanDefinitionRegistryPostProcessor` 执行阶段**，由于 `BeanDefinitionRegistryPostProcessor` 中包含 `ConfigurationClassPostProcessor` ，而 `ConfigurationClassPostProcessor` 会执行 `ImportBeanDefinitionRegistrar` 的逻辑，从而达到编程式构造 `BeanDefinition` 并注入到 `BeanDefinitionRegistry` 的目的；另外，实现了 `BeanDefinitionRegistryPostProcessor` 的类也可以编程式构造 `BeanDefinition` ，注入 `BeanDefinitionRegistry` 。

#### 4.9.3 bean实例化阶段的生命周期

在所有非延迟加载的单实例 bean 初始化之前，会**先初始化所有的 `BeanPostProcessor`** 。

在 `ApplicationContext` 的 `refresh` 方法中，**`finishBeanFactoryInitialization`** 步骤会初始化所有的非延迟加载的单实例 bean 。实例化 bean 的入口是 `getBean` → `doGetBean` ，该阶段会合并 `BeanDefinition` ，并根据 bean 的 scope 选择实例化 bean 的策略。

创建 bean 的逻辑会走 `createBean` 方法，该方法中会先执行所有 `InstantiationAwareBeanPostProcessor` 的 `postProcessBeforeInstantiation` 方法尝试创建 bean 实例，如果成功创建，则会直接调用 `postProcessAfterInitialization` 方法初始化 bean 后返回；如果 `InstantiationAwareBeanPostProcessor` 没有创建 bean 实例，则会调用 `doCreateBean` 方法创建 bean 实例。在 `doCreateBean` 方法中，会先根据 bean 的 `Class` 中的构造器定义，决定如何实例化 bean ，如果没有定义构造器，则会使用无参构造器，反射创建 bean 对象。

#### 4.9.4 bean初始化阶段的生命周期

bean 对象创建完成后，会进行**属性赋值、组件依赖注入**，以及**初始化阶段的方法回调**。在 `populateBean` 属性赋值阶段，会事先收集好 bean 中标注了依赖注入的注解（ `@Autowired` 、`@Value` 、`@Resource` 、`@Inject` ），之后会借助后置处理器，回调 `postProcessProperties` 方法实现依赖注入。

属性赋值和依赖注入之后，会回调执行 bean 的初始化方法，以及后置处理器的逻辑：首先会执行 Aware 相关的回调注入，之后执行后置处理器的前置回调，在后置处理器的前置方法中，会回调 bean 中标注了 `@PostConstruct` 注解的方法，所有的后置处理器前置回调后，会执行 `InitializingBean` 的 `afterPropertiesSet` 方法，随后是 `init-method` 指定的方法，等这些 bean 的初始化方法都回调完毕后，最后执行后置处理器的后置回调。

全部的 bean 初始化结束后，`ApplicationContext` 的 `start` 方法触发时，会触发实现了 `Lifecycle` 接口的 bean 的 `start` 方法。

#### 4.9.5 bean销毁阶段的生命周期

bean 对象在销毁时，由 `ApplicationContext` 发起关闭动作。销毁 bean 的阶段，由 `BeanFactory` 取出所有单实例 bean ，并逐个销毁。

销毁动作会先将当前 bean 依赖的所有 bean 都销毁，随后回调自定义的 bean 的销毁方法，之后如果 bean 中有定义内部 bean 则会一并销毁，最后销毁那些依赖了当前 bean 的 bean 也一起销毁。

## 5. Bean装配相关

### 5.1 模块装配与条件装配

- 模块装配：指用最少的代码，把一个模块需要的核心功能组件都装配好（通常使用自定义 `@EnableXXX` 注解 + `@Import` 完成）。
  - `@Import` 支持装配的组件：普通类、注解配置类、`ImportSelector` 、`ImportBeanDefinitionRegistrar` 。
- 条件装配：可以设定装配的 bean 或配置类在特定条件下才生效，分为 profile 和 conditional 两种实现方式。
  - profile 基于 `Environment` 层，一般用于多环境配置
  - conditional 基于 bean 层，且 conditional 的判断方式更加灵活

### 5.2 组件扫描

利用组件扫描，可以扫描指定路径下的所有标注了模式注解的类，并封装生成 bean 对象。可以通过声明 `@ComponentScan` 注解中的 `includeFilters` 和 `excludeFilters` 属性来指定扫描的匹配规则。

### 5.3 SPI

SPI 是通过一种“**服务寻找**”的机制，**动态的加载接口 / 抽象类对应的具体实现类，它把接口具体实现类的定义和声明权交给了外部化的配置文件中**。

jdk 的 SPI 是需要遵循规范的：**所有定义的 SPI 文件都必须放在工程的 `META-INF/services` 目录下**，且**文件名必须命名为接口 / 抽象类的全限定名**，**文件内容为接口 / 抽象类的具体实现类的全限定名，如果出现多个具体实现类，则每行声明一个类的全限定名，没有分隔符**。

SpringFramework 中的 SPI 在要求上比较宽松，它不止可以基于接口 / 抽象类，还可以是**任何一个类、接口、注解**，并且这种机制**被大量用于 SpringBoot 的自动装配**中。

## 6. 功能特性相关

### 6.1 事件与监听器

#### 6.1.1 如何理解观察者模式

**观察者模式**，也被称为**发布订阅模式**、**监听器模式**，它是 GoF23 设计模式中行为型模式的其中之一。观察者模式关注的点是某**一个对象被修改 / 做出某些反应 / 发布一个信息等，会自动通知依赖它的对象（订阅者）**。观察者模式的三大核心是：**观察者、被观察主题、订阅者**。观察者（ Observer ）需要绑定要通知的订阅者（ Subscriber ），并且要观察指定的主题（ Subject ）。

#### 6.1.2 Spring中的观察者模式是如何体现的

SpringFramework 中，体现观察者模式的特性就是事件驱动和监听器。**监听器**充当**订阅者**，监听特定的事件；**事件源**充当**被观察的主题**，用来发布事件；**IOC 容器**本身也是事件广播器，可以理解成**观察者**。

SpringFramework 的事件驱动核心概念可以划分为 4 个：**事件源、事件、广播器、监听器**。

- **事件源：发布事件的对象**

- **事件：事件源发布的信息 / 作出的动作**

- 广播器：事件真正广播给监听器的对象

  【即 `ApplicationContext`】

  - `ApplicationContext` 接口有实现 `ApplicationEventPublisher` 接口，具备**事件广播器的发布事件的能力**
  - `ApplicationEventMulticaster` 组合了所有的监听器，具备**事件广播器的广播事件的能力**

- **监听器：监听事件的对象**

#### 6.1.3 监听器的实现方式

- 实现 `ApplicationListener` ，并指定要监听的事件类型
- 普通 bean 的方法上标注 `@EventListener` 注解，同样可以生成一个监听器

#### 6.1.4 Spring中内置的事件

- `ContextRefreshedEvent` ：IOC 容器刷新完毕但尚未启动，广播该事件
- `ContextClosedEvent` ：IOC 容器已经关闭但尚未销毁所有 Bean ，广播该事件
- `ContextStartedEvent` ：`ApplicationContext` 的 `start` 方法被触发，广播该事件
- `ContextStoppedEvent` ：`ApplicationContext` 的 `stop` 方法被触发，广播该事件

### 6.2 资源管理

SpringFramework 中的资源管理是内部封装的，它的核心资源模型接口 `Resource` 可以支持 `ResourceLoader` 从类路径等位置加载。根据资源的加载来源不同，Spring 划分了几种 `Resource` 的不同实现，并由 `DefaultResourceLoader` 委托 `ProtocolResolver` 来负责加载这些资源。

SpringFramework 可以支持 properties 、xml（yml）等类型的资源文件，这些资源会通过 `PropertySourceFactory` 加载进 `Environment` 中，成为应用内变量的一部分。

### 6.3 配置元信息

#### 6.3.1 理解配置源

**配置源**，就是**配置的来源**。对于 IOC 容器而言，xml 配置文件或者注解配置类可以称之为配置源；对于 `Environment` 来讲，properties 资源文件也可以看作是配置源。SpringFramework 拿到配置源后会**先加载**，**再解析**，**最后注册**那些定义好的 **bean 到 IOC 容器**。

#### 6.3.2 理解元信息

简单的理解，**元信息**，就是**信息的信息**，**定义的定义**。举个例子，**`Class`** 这个类里面就包含一个类的所有定义（属性、方法、继承实现、注解等），所以我们可以说：**`Class` 中包含类的元信息**。

#### 6.3.3 Spring中的元信息

Spring 中的元信息可以简单的分为 Bean 的元信息、IOC 容器的元信息：

- Bean 的元信息
  - 全限定名 className
  - 作用域 scope
  - 是否延迟加载 lazy
  - 工厂 Bean 名称 factoryBean
  - 构造方法参数列表 constructorArgumentValues
  - 属性值 propertyValues
- IOC 容器的元信息
  - beans ，包含 `profile` 、`default-autowire` 等配置
  - context ，包含 `component-scan` 、`property-placeholder` 、`annotation-config` 等配置



