---
title: 13IOC进阶-事件机制&监听器
---

## 1. 观察者模式【回顾】

**观察者模式**，也被称为**发布订阅模式**，也有的人叫它**“监听器模式”**，它是 GoF23 设计模式中行为型模式的其中之一。观察者模式关注的点是某**一个对象被修改 / 做出某些反应 / 发布一个信息等，会自动通知依赖它的对象（订阅者）**。

观察者模式的三大核心是：**观察者、被观察主题、订阅者**。观察者（ Observer ）需要绑定要通知的订阅者（ Subscriber ），并且要观察指定的主题（ Subject ）。

## 2. SpringFramework中设计的观察者模式【掌握】

SpringFramework 中，体现观察者模式的特性就是事件驱动和监听器。**监听器**充当**订阅者**，监听特定的事件；**事件源**充当**被观察的主题**，用来发布事件；**IOC 容器**本身也是事件广播器，可以理解成**观察者**。

不过我个人比较喜欢把 SpringFramework 的事件驱动核心概念划分为 4 个：**事件源、事件、广播器、监听器**。

- 事件源：发布事件的对象
- 事件：事件源发布的信息 / 作出的动作
- 广播器：事件真正广播给监听器的对象【即 ApplicationContext 】
  - ApplicationContext 接口有实现 ApplicationEventPublisher 接口，具备事件广播器的发布事件的能力
  - ApplicationEventMulticaster 组合了所有的监听器，具备事件广播器的广播事件的能力
- 监听器：监听事件的对象

## 3. 快速体会事件与监听器【掌握】

### 3.1 编写监听器

SpringFramework 中内置的监听器接口是 `ApplicationListener` ，它还带了一个泛型，代表要监听的具体事件：

```java
@FunctionalInterface
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {
	void onApplicationEvent(E event);
}
```

我们要自定义监听器，只需要实现这个 `ApplicationListener` 接口即可。

为快速体会事件和监听器的功能，下面咱先介绍两个事件：`ContextRefreshedEvent` 和 `ContextClosedEvent` ，它们分别代表**容器刷新完毕**和**即将关闭**。下面咱编写一个监听器，来监听 `ContextRefreshedEvent` 事件。

```java
@Component
public class ContextRefreshedApplicationListener implements ApplicationListener<ContextRefreshedEvent> {
    
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        System.out.println("ContextRefreshedApplicationListener监听到ContextRefreshedEvent事件！");
    }
}
```

### 3.2 编写启动类

```java
    public static void main(String[] args) throws Exception {

        System.out.println("准备初始化IOC容器。。。");
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                "org.clxmm.event.a_quickstart");
        System.out.println("IOC容器初始化完成。。。");
        ctx.close();
        System.out.println("IOC容器关闭。。。");
    }
```

```
准备初始化IOC容器。。。
ContextRefreshedApplicationListener监听到ContextRefreshedEvent事件！
IOC容器初始化完成。。。
IOC容器关闭。。。
```

### 3.3 注解式监听器

除了实现 `ApplicationListener` 接口之外，还可以使用注解的形式注册监听器。

使用注解式监听器，组件不再需要实现任何接口，而是直接在需要作出事件反应的方法上标注 `@EventListener` 注解即可：

```java
@Component
public class ContextClosedApplicationListener {
    
    @EventListener
    public void onContextClosedEvent(ContextClosedEvent event) {
        System.out.println("ContextClosedApplicationListener监听到ContextClosedEvent事件！");
    }
}
```

重新运行 `QuickstartListenerApplication` 的 `main` 方法，控制台可以打印出 `ContextClosedApplicationListener` 监听事件的反应：

```
准备初始化IOC容器。。。
ContextRefreshedApplicationListener监听到ContextRefreshedEvent事件！
IOC容器初始化完成。。。
ContextClosedApplicationListener监听到ContextClosedEvent事件！
IOC容器关闭。。。
```

- `ApplicationListener` 会在容器初始化阶段就准备好，在容器销毁时一起销毁；
- `ApplicationListener` 也是 IOC 容器中的普通 Bean ；
- IOC 容器中有内置的一些事件供我们监听。

## 4. SpringFramework中的内置事件【熟悉】

在 SpringFramework 中，已经有事件的默认抽象，以及 4 个默认的内置事件了，下面咱了解一下它们。

### 4.1 ApplicationEvent

很明显，它是事件模型的抽象，它是一个抽象类，里面也没有定义什么东西，只有事件发生时的时间戳。值得关注的是，它是继承自 jdk 原生的观察者模式的事件模型，并且把它声明为抽象类：

```java
public abstract class ApplicationEvent extends EventObject

```

关于这个设计，它的文档注释就已经说明了：

> Class to be extended by all application events. Abstract as it doesn't make sense for generic events to be published directly.
>
> 由所有应用程序事件扩展的类。它被设计为抽象的，因为**直接发布一般事件没有意义**。

如果说只是有这么一个派生，那看上去没什么太大的意义，所以 SpringFramework 中又给这个 ApplicationEvent 进行了一次扩展。

### 4.2 ApplicationContextEvent

```java
public abstract class ApplicationContextEvent extends ApplicationEvent {
    
	public ApplicationContextEvent(ApplicationContext source) {
		super(source);
	}
    
	public final ApplicationContext getApplicationContext() {
		return (ApplicationContext) getSource();
	}
}
```

它在构造时，会把 IOC 容器一起传进去，这意味着事件发生时，可以**通过监听器直接取到 `ApplicationContext` 而不需要做额外的操作**，这才是 SpringFramework 中事件模型扩展最值得的地方。下面列举的几个内置的事件，都是基于这个 `ApplicationContextEvent` 扩展的。

### 4.3 ContextRefreshedEvent&ContextClosedEvent

这两个是一对，分别对应着 **IOC 容器刷新完毕但尚未启动**，以及 **IOC 容器已经关闭但尚未销毁所有 Bean** 。这个时机可能记起来有点小困难，小伙伴们可以不用记很多，只通过字面意思能知道就 OK ，至于这些事件触发的真正时机，

### 4.4 ContextStartedEvent&ContextStoppedEvent

这一对跟上面的时机不太一样了。`ContextRefreshedEvent` 事件的触发是所有单实例 Bean 刚创建完成后，就发布的事件，此时那些实现了 `Lifecycle` 接口的 Bean 还没有被回调 `start` 方法。当这些 `start` 方法被调用后，`ContextStartedEvent` 才会被触发。同样的，`ContextStoppedEvent` 事件也是在 `ContextClosedEvent` 触发之后才会触发，此时单实例 Bean 还没有被销毁，要先把它们都停掉才可以释放资源，销毁 Bean 。

## 5. 自定义事件开发【熟悉】

上面咱了解了 SpringFramework 中内置的事件，如果我们想自己在合适的时机发布一些事件，让指定的监听器来以此作出反应，执行特定的逻辑，那就需要自定义事件了。下面咱模拟一个场景，来体会自定义事件的开发过程。

### 5.1 场景概述

论坛应用，当新用户注册成功后，会同时发送短信、邮件、站内信，通知用户注册成功，并且发放积分。

在这个场景中，用户注册成功后，广播一个“用户注册成功”的事件，将用户信息带入事件广播出去，发送短信、邮件、站内信的监听器监听到注册成功的事件后，会分别执行不同形式的通知动作。

### 5.2 自定义用户注册成功事件

SpringFramework 中的自定义事件的方式就是通过继承 `ApplicationEvent` ：

```java
/**
 * 注册成功的事件
 */
public class RegisterSuccessEvent extends ApplicationEvent {
    
    public RegisterSuccessEvent(Object source) {
        super(source);
    }
}
```

### 5.3 编写监听器

使用上述的两种方式，分别编写发送短信、发送邮件，和发送站内信的监听器：

```java
@Component
public class SmsSenderListener implements ApplicationListener<RegisterSuccessEvent> {
    
    @Override
    public void onApplicationEvent(RegisterSuccessEvent event) {
        System.out.println("监听到用户注册成功，发送短信。。。");
    }
}

@Component
public class EmailSenderListener {
    
    @EventListener
    public void onRegisterSuccess(RegisterSuccessEvent event) {
        System.out.println("监听到用户注册成功！发送邮件中。。。");
    }
}

@Component
public class MessageSenderListener {
    
    @EventListener
    public void onRegisterSuccess(RegisterSuccessEvent event) {
        System.out.println("监听到用户注册成功，发送站内信。。。");
    }
}

```

### 5.4 编写注册逻辑业务层

只有事件和监听器还不够，还需要有一个事件源来持有事件发布器，在应用上下文中发布事件。

Service 层中，需要注入 `ApplicationEventPublisher` 来发布事件，此处选择使用回调注入的方式。

```java
@Service
public class RegisterService implements ApplicationEventPublisherAware {
    
    ApplicationEventPublisher publisher;
    
    public void register(String username) {
        // 用户注册的动作。。。
        System.out.println(username + "注册成功。。。");
        // 发布事件
        publisher.publishEvent(new RegisterSuccessEvent(username));
    }
    
    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }
}
```

### 5.5 编写测试启动类

```java
public class RegisterEventApplication {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = 
          new AnnotationConfigApplicationContext("org.clxmm.event.b_registerevent");
        RegisterService registerService = ctx.getBean(RegisterService.class);
        registerService.register("clxmm");
    }
}
```

```
clxmm注册成功。。。
监听到用户注册成功！发送邮件中。。。
监听到用户注册成功，发送站内信。。。
监听到用户注册成功，发送短信。。。
```

由此又得出来另外一个结论：**注解式监听器的触发时机比接口式监听器早**。

### 5.6 调整监听器的触发顺序

如果业务需要调整，需要先发送站内信，后发送邮件，这个时候就需要配合另外一个注解了：**`@Order`** 。标注上这个注解后，默认的排序值为 **`Integer.MAX_VALUE`** ，代表**最靠后**。

按照这个规则，那咱在 `MessageSenderListener` 的 `onRegisterSuccess` 方法上标注 `@Order(0)` ，重新运行启动类的 `main` 方法，观察控制台的打印：

```
监听到用户注册成功，发送站内信。。。
监听到用户注册成功，发送邮件中。。。
监听到用户注册成功，发送短信。。。
```

需求得以解决。不过这个时候我们再思考一个问题：如果不标注 `@Order` 注解，默认的顺序是多少呢？

尝试着把刚才的 `@Order` 注解中，`value` 改为 `Integer.MAX_VALUE - 1` ，重新运行，发现运行结果还是像上面那样打印，证明**默认的排序值是 `Integer.MAX_VALUE`** 。

### 5.7 理性看待自定义事件

到这里，估计部分小伙伴快看不下去了，这有点多此一举呀！我完全可以用一个监听器搞三个方法一块写就完了呀！甚至，完全可以把发送信息、邮件的动作，整合在注册的逻辑中。那这自定义事件到底有什么刚需吗？讲道理，**真的非常少**。很多场景下，使用自定义事件可以处理的逻辑，完全可以通过一些其它的方案来替代，这样真的会显得自定义事件很鸡肋。所以，一定要理性看待自定义事件的使用，千万不要一学到点东西，就疯狂输出哦 (￣▽￣)／。

