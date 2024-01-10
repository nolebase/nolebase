---
title: 28IOC原理-Bean完整的生命周期概述
---

## 1. 如何全面理解bean的生命周期

我们有讲过 bean 的生命周期大概是这样的：

![image-20220508202944146](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220508202944.png)

如果这只是一个普通的 java 的对象，那这个图示完全成立、合理。不过在 SpringFramework 中，这个流程就不够完整了，我们来回忆一下前面学习的内容。

### 1.1 bean的创建之前

在 bean 的创建之前，bean 是以 `BeanDefinition` 的方式被描述和注册在 `BeanFactory` 的（准确的说是注册在 `BeanDefinitionRegistry` 中），这个时候虽然 bean 还没有被创建，但是 `BeanFactory` 中已经存有 bean 对应的 `BeanDefinition` 了，所以**在 bean 的实例化之前，还应该有 `BeanDefinition` 阶段**。

### 1.2 BeanDefinition的由来

`BeanDefinition` 也不是凭空出现的，要么是解析了配置文件，要么是解析了配置类，要么有人编程式的注入了 `BeanDefinition` ，所以如果纵观整个 bean 的生命周期，在 `BeanDefinition` 阶段之前，还应该有 `BeanDefinition` 的来源和加载阶段。

### 1.3 小册讲解的生命周期阶段

不能再往上捋了，再往上就该 IOC 容器的生命周期了，咱到此打住。

结合前面第 13 章的内容，以及上面的梳理，本小册的 IOC 原理探究，就以 **【单实例 bean 】** 的全生命周期为主线讨论，具体包含以下部分：

- BeanDefinition 部分
  - BeanDefinition 的解析
  - BeanDefinition 的注册
- bean 实例部分
  - bean 的实例化
  - bean 的属性赋值 + 依赖注入
  - bean 的初始化流程
  - bean 的启动与停止
  - bean 的销毁

## 2. BeanDefinition阶段的主要工作

本章我们先不深入源码中研究具体的 bean 的生命周期原理，我们先从概念和设计上有一个整体的把控，这样带着问题和思路去看源码，或许会更清晰明朗一些。

### 2.1 BeanDefinition的来源

上面咱也说了，bean 的实例化需要先有 `BeanDefinition` 的信息，所以 `BeanDefinition` 都是怎么来的呢？这里我们来理一下。

- 声明式注入 `BeanDefinition`

  - @Configuration + @Bean

    ```java
    @Configuration
    public class QuickstartConfiguration {
        @Bean
        public Person person() {
            return new Person();
        }
    }
    ```

  - @Component + @ComponentScan

    ```java
    @Configuration
    @ComponentScan("com.linkedbear.spring.annotation.c_scan")
    public class ComponentScanConfiguration
    ```

  - @Import

    ```java
    @Import({Boss.class, BartenderConfiguration.class})
    public @interface EnableTavern
    ```

- 配置式注入 `BeanDefinition`

  - `<bean>` 标签声明

    ```xml
    <bean id="person" class="com.linkedbear.spring.basic_dl.a_quickstart_byname.bean.Person"/>
    
    ```

  - 编程式注入 `BeanDefinition`

    - ImportBeanDefinitionRegistrar

    ```java
    public class WaiterRegistrar implements ImportBeanDefinitionRegistrar {
        
        @Override
        public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
            registry.registerBeanDefinition("waiter", new RootBeanDefinition(Waiter.class));
        }
    }
    ```

    - 手动构造 BeanDefinition 注入

      ```java
          AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
      
          BeanDefinition personDefinition = BeanDefinitionBuilder.rootBeanDefinition(Person.class)
                  .addPropertyValue("name", "zhangsan").getBeanDefinition();
          ctx.registerBeanDefinition("person", personDefinition);
      
          ctx.refresh();
      ```

通过上述的方式，就可以把 `BeanDefinition` 注入到 `BeanFactory` 中了。

### 2.2 BeanDefinition的后置处理

根据前面后置处理器学过的内容，我们可以知道 `BeanDefinition` 都构造好之后，是不会立即注册到 `BeanFactory` 的，这中间有一步执行 `BeanDefinitionRegistryPostProcessor` 的动作，等这些 `BeanDefinitionRegistryPostProcessor` 都执行完 `postProcessBeanDefinitionRegistry` 方法后，`BeanDefinition` 才会注册到 `BeanFactory` 。

![image-20220508203655468](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220508203655.png)

这个动作之后，下一步则是执行 `BeanFactoryPostProcessor` 的 `postProcessBeanFactory` 方法了，这个阶段可以给 `BeanDefinition` 修改配置信息，添加注入的依赖项，给属性赋值等操作。

![image-20220508203722962](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220508203723.png)

这一步执行完毕后，`BeanDefinition` 就不会再动了，`BeanDefinition` 的阶段也就算结束了。

## 3. bean实例阶段的内容

从 `AbstractApplicationContext` 的 `refresh` 方法中找到执行步骤，其中第 11 步 `finishBeanFactoryInitialization` 方法就是初始化 bean 实例的动作了：

```java
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        prepareRefresh();
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
        prepareBeanFactory(beanFactory);
        
        try {
            postProcessBeanFactory(beanFactory);
            invokeBeanFactoryPostProcessors(beanFactory);
            registerBeanPostProcessors(beanFactory);
            initMessageSource();
            initApplicationEventMulticaster();
            onRefresh();
            registerListeners();
            // 11. 初始化剩余的单实例bean
            finishBeanFactoryInitialization(beanFactory);
            finishRefresh();
        }
        // catch ......
        finally {
            resetCommonCaches();
        }
    }
}
```

这一步的动作非常多，它会将**所有还没有实例化的、非延迟加载的单实例 bean** 都创建出来。而创建一个 bean 的流程也是非常多且复杂，总体可以分为以下几个步骤。

### 3.1 BeanDefinition的合并

对，bean 的实例化阶段，第一步并不是直接创建对象哦，还记得之前的 `BeanDefinition` 合并那个特性吗？如果一个 `<bean>` 有继承另外一个 `<bean>` 定义，则会形成父子定义。这种情况下，创建 bean 的时候就需要读取父 bean 的定义，合并为最终的 `RootBeanDefinition` 。

### 3.2 bean的实例化

合并完 `BeanDefinition` ，下一步才是真正的实例化 bean ，不过这里要注意一个问题：如果 bean 是一个 `FactoryBean` ，这里该如何处理呢？是只创建 `FactoryBean` 本身？还是连 `FactoryBean` 创建的真实对象一起创建？这个问题此处先不作回答，小伙伴们带着问题进入源码中会更有助于思考哦。

除了考虑 `FactoryBean` 之外，还有一个要考虑的因素是缓存问题。咱在一开始学 IOC 的由来时，就知道 `BeanFactory` 中可以缓存单实例 bean ，那么在 Spring 中是如何处理单实例 bean 在实例化后的缓存呢？这个问题也应该考虑在内吧。

### 3.3 属性赋值+依赖注入

bean 对象实例化完成后，里面所有的成员都是空的，接下来的步骤就是属性赋值和依赖注入了。由于这部分逻辑属于 bean 实例已经创建，所以小册在这里**将该步骤划到下面的 bean 初始化部分**。

在这个环节，最重要的是如何处理 `<bean>` 中的 `<property>` 标签、bean 中的 `@Value` 、`@Autowired` 等自动注入的注解。小伙伴们不妨先自行思考一下，以目前已经学过的所有知识，有没有一些机制，能在 bean 的初始化阶段之前完成这部分工作的？

哎，`BeanPostProcessor` 的扩展 `InstantiationAwareBeanPostProcessor` 可以在 bean 的实例化之后、初始化之前执行 `postProcessAfterInstantiation` 方法，以及 `postProcessProperties` ( `postProcessPropertyValues` ) 方法完成属性赋值！所以我们就可以断定，这个环节一定是 `InstantiationAwareBeanPostProcessor` 在工作咯。

### 3.4 bean的初始化

这个阶段相信小伙伴们都非常熟悉了，这才是前面第 13 章讲的 bean 的生命周期，这部分咱就不多啰嗦了吧，后面直接翻源码看看底层原理就完事了。

### 3.5 bean的启动

之前在 bean 的生命周期中没有提到一个接口：`Lifecycle` ，之所以没有在那儿提，是考虑到 `Lifecycle` 的执行是依照 `ApplicationContext` 的生命周期而来，两者是相互关联的，所以小册把 `Lifecycle` 接口的讲解安排到了这里。

先简单说说 `Lifecycle` 的触发时机吧。往上翻一翻 `refresh` 方法的 try 块最后一行：`finishRefresh` ，它在里面会找出所有实现了 `Lifecycle` 接口的 bean ，并调用它们的 `start` 方法（所以是不是回想起了第 16 章的 `ContextStartedEvent` 事件）。注意此时所有实现了 `Lifecycle` 的非延迟加载的单实例 bean 都**已经加载完成**了，是可以正常调用 `start` 方法的。

一般实现 `Lifecycle` 的 `start` 方法多用于**建立连接**、**加载资源**等等操作，以备程序的运行期使用。

so ，这个阶段 `ApplicationContext` 就会完成所有 `Lifecycle` 类型的 bean 的 `start` 方法调用，对于一个 bean 的生命周期而言，就已经到了正常存活期了。

## 4. bean销毁阶段的内容

相比较于 bean 的创建和初始化，销毁部分就变得比较简单了，我们可以先对整个 `ApplicationContext` 的关闭有一个整体的了解。

关闭 `ApplicationContext` 会顺序执行以下几步：

1. 广播容器关闭事件
   - `ContextClosedEvent` 事件
2. 通知所有实现了 `Lifecycle` 的 bean 回调 `close` 方法
3. 销毁所有 bean
4. 关闭 BeanFactory
5. 标记本身为不可用，

而这里面有关 bean 的销毁，就只包含 2 、3 两步，下面分述。

### 4.1 bean的停止

与上面的 bean 启动一致，如果一个 bean 实现了 `Lifecycle` 接口，此处会回调 bean 的 `close` 方法。由于此时 bean 的销毁回调方法还没有执行，所以在销毁阶段，`Lifecycle` 的执行时机是最靠前的。

一般实现 `Lifecycle` 的 `close` 方法多用来关闭连接、释放资源等操作，因为程序终止了，这些资源也就没必要持有了。

### 4.2 bean的销毁回调

bean “停止” 后，接下来就是对应于 bean 初始化阶段的三种生命周期回调的销毁部分了。不过这里面有一个不同点：`BeanPostProcessor` 的回调包含 bean 的初始化之前和初始化之后，但 `DestructionAwareBeanPostProcessor` 只包含 bean 销毁回调之前的动作，没有之后。

## 5. Debug测试代码编写

下面，我们把这次 bean 完整生命周期研究的测试代码先编写出来，后面的 4 章我们全部使用该代码来测试和研究 bean 的完整生命周期。

### 5.1 声明bean

测试的 bean 中，我们选择前面反复多次学习的 `Person` 与 `Cat` 为测试模型，其中给 `Person` 实现全生命周期的回调：

```java
public class Person implements InitializingBean, DisposableBean, Lifecycle {
    
    private String name;
    
    private boolean state = false;
    
    public Person() {
        System.out.println("Person constructor run ......");
    }
    
    @PostConstruct
    public void postConstruct() {
        System.out.println("Person @PostConstruct run ......");
    }
    
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("Person InitializingBean run ......");
    }
    
    public void initMethod() {
        System.out.println("Person initMethod run ......");
    }
    
    @PreDestroy
    public void preDestory() {
        System.out.println("Person @PreDestroy run ......");
    }
    
    @Override
    public void destroy() throws Exception {
        System.out.println("Person DisposableBean run ......");
    }
    
    public void destroyMethod() {
        System.out.println("Person destroyMethod run ......");
    }
    
    @Override
    public void start() {
        System.out.println("Person 睡醒起床了 ......");
        this.state = true;
    }
    
    @Override
    public void stop() {
        System.out.println("Person 睡觉去了 ......");
        this.state = false;
    }
    
    @Override
    public boolean isRunning() {
        return state;
    }
    
    // getter setter toString
}

```

给 Cat 使用 `@Component` 标注，并自动注入 `Person` ：

```java
@Component
public class Cat {
    
    @Value("miaomiao")
    private String name;
    
    @Autowired
    private Person master;
    
    // getter setter toString
}
```

### 5.2 编写后置处理器

为了能体现出后置处理器的回调，需要编写一个 `BeanPostProcessor` ，一个 `DestructionAwareBeanPostProcessor` ：

```java
public class LifecycleNameReadPostProcessor implements BeanPostProcessor {
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof Person) {
            Person person = (Person) bean;
            System.out.println("LifecycleNameReadPostProcessor ------> " + person.getName());
        }
        return bean;
    }
}
```

```java
public class LifecycleDestructionPostProcessor implements DestructionAwareBeanPostProcessor {
    
    @Override
    public void postProcessBeforeDestruction(Object bean, String beanName) throws BeansException {
        if (bean instanceof Cat) {
            Cat cat = (Cat) bean;
            System.out.println(cat.getName() + "被放走了 ......");
        }
    }
}
```

### 5.3 编写xml配置文件

Debug 的测试代码，小册打算分 xml 和注解两种形式都讲解，所以咱来分别编写 xml 配置文件，以及注解配置类咯。

xml 配置文件中，需要注册 person 、cat 、两个后置处理器，以及开启注解驱动（不然 JSR 250 规范的注解不会生效）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <bean id="person" class="org.clxmm.lifecycle.e_source.bean.Person"
          init-method="initMethod" destroy-method="destroyMethod">
        <property name="name" value="zhangsan"/>
    </bean>

    <bean id="cat" class="org.clxmm.lifecycle.e_source.bean.Cat">
        <property name="name" value="mimi"/>
        <property name="master" ref="person"/>
    </bean>

    <bean class="org.clxmm.lifecycle.e_source.config.LifecycleNameReadPostProcessor"/>
    <bean class="org.clxmm.lifecycle.e_source.config.LifecycleDestructionPostProcessor"/>

    <context:annotation-config/>
</beans>
```

### 5.4 编写注解配置类

注解配置类中，不需要注册后置处理器，只需要注册 Person ，以及组件扫描即可：

```java
@Configuration
@ComponentScan("org.clxmm.lifecycle.e_source.bean")
public class LifecycleSourceConfiguration {

    @Bean(initMethod = "initMethod", destroyMethod = "destroyMethod")
    public Person person() {
        Person person = new Person();
        person.setName("lisi");
        return person;
    }
}
```

### 5.5 编写xml测试启动类

启动类中，只需要加载 xml 配置文件即可。不过为了能直观的在运行结果中体现出每个环节的动作，可以在测试启动类中适当的位置添加控制台打印，就像这样：

```java
public class LifecycleSourceXmlApplication {
    
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext();
        ctx.setConfigLocation("lifecycle/bean-source.xml");
    
        System.out.println("================准备刷新IOC容器==================");
    
        ctx.refresh();
    
        System.out.println("================IOC容器刷新完毕==================");
    
        ctx.start();
    
        System.out.println("================IOC容器启动完成==================");
    
        Person person = ctx.getBean(Person.class);
        System.out.println(person);
        Cat cat = ctx.getBean(Cat.class);
        System.out.println(cat);
    
        System.out.println("================准备停止IOC容器==================");
    
        ctx.stop();
    
        System.out.println("================IOC容器停止成功==================");
    
        ctx.close();
    }
}
```

```
================准备刷新IOC容器==================
Person constructor run ......
Person @PostConstruct run ......
Person InitializingBean run ......
Person initMethod run ......
LifecycleNameReadPostProcessor ------> lisi
================IOC容器刷新完毕==================
Person 睡醒起床了 ......
================IOC容器启动完成==================
Person(name=lisi, state=true)
Cat(name=miaomiao, master=Person(name=lisi, state=true))
================准备停止IOC容器==================
Person 睡觉去了 ......
================IOC容器停止成功==================
miaomiao被放走了 ......
Person @PreDestroy run ......
Person DisposableBean run ......
Person destroyMethod run ......
```

### 5.6 编写注解测试启动类

注解测试启动类中，下面的部分与 xml 方式的一模一样，唯一不同的是声明的 ApplicationContext 类型不同，以及需要把配置类、后置处理器注册到 IOC 容器中：

```java
public class LifecycleSourceAnnotationApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
        ctx.register(LifecycleSourceConfiguration.class);
        ctx.register(LifecycleNameReadPostProcessor.class);
        ctx.register(LifecycleDestructionPostProcessor.class);
    
        // 与上面一致，不再重复贴出
    }
}
```

