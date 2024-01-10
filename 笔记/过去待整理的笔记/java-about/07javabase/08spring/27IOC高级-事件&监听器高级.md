---
title: 27IOC高级-事件&监听器高级
---

IOC 高级的最后一章，我们对 SpringFramework 中的事件和监听器模型再深入研究一下，以及事件机制的一些其他高级特性。这部分更多的是理解模型的设计，以及内部原理的执行流程，让小伙伴能更清晰的认识事件模型，以及与观察者模式的联系和对比。

## 1. 事件的层次广播【了解】

`BeanFactory` 具有**层次性**，相对应的 `ApplicationContext` 也具有层次性。这里面就出现了一个问题：如果父容器广播了事件，子容器是否要感知到？子容器广播事件又是否要父容器感知呢？这个特性我们要来研究一下。

### 1.1 声明事件和监听器

事件不需要任何花里胡哨的定义，仅仅继承 `ApplicationEvent` 即可：

```java
public class HierarchicalEvent extends ApplicationEvent {
    
    public HierarchicalEvent(Object source) {
        super(source);
    }
}
```

监听器也不需要花里胡哨，能监听上面的 `HierarchicalEvent` 就可以：

```java
public class HierarchicalEventListener implements ApplicationListener<HierarchicalEvent> {
    
    @Override
    public void onApplicationEvent(HierarchicalEvent event) {
        System.out.println("监听到HierarchicalEvent：" + event.toString());
    }
}
```

### 1.2 测试运行

层次性的测试需要构造父子容器，这样我们需要创建两个 `ApplicationContext` ，并且都注册一个 `HierarchicalEventListener` 。由于本测试案例中没有任何其它组件了，所以用编程式驱动 IOC 是最方便合适的：

```java
public class HierarchicalEventApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext parentCtx = new AnnotationConfigApplicationContext();
        parentCtx.addApplicationListener(new HierarchicalEventListener());
        
        AnnotationConfigApplicationContext childCtx = new AnnotationConfigApplicationContext();
        childCtx.setParent(parentCtx);
        childCtx.addApplicationListener(new HierarchicalEventListener());
        
    }
}
```

配置好之后，就可以初始化 IOC 容器了。这里一定要注意，先刷新父容器，再刷新子容器。如果直接刷新子容器，会抛出 `ApplicationEventMulticaster` 没有初始化的异常：

```
Exception in thread "main" java.lang.IllegalStateException: ApplicationEventMulticaster not initialized - call 'refresh' before multicasting events via the context: org.springframework.context.annotation.AnnotationConfigApplicationContext@26a1ab54

```

刷新完容器后，下面就可以广播事件了，我们分别用父容器和子容器都发送一次事件，看控制台的打印是如何，就像这样写：

```java
public static void main(String[] args) throws Exception {
    AnnotationConfigApplicationContext parentCtx = new AnnotationConfigApplicationContext();
    parentCtx.addApplicationListener(new HierarchicalEventListener());

    AnnotationConfigApplicationContext childCtx = new AnnotationConfigApplicationContext();
    childCtx.setParent(parentCtx);
    childCtx.addApplicationListener(new HierarchicalEventListener());

    parentCtx.refresh();
    childCtx.refresh();

    parentCtx.publishEvent(new HierarchicalEvent("父容器发布的HierarchicalEvent"));
   System.out.println("--------");
    childCtx.publishEvent(new HierarchicalEvent("子容器发布的HierarchicalEvent"));
}
```

运行 main 方法，控制台打印了三行信息：

```
监听到HierarchicalEvent：org.clxmm.event.c_hierarchical.component.HierarchicalEvent[source=父容器发布的HierarchicalEvent]
--------
监听到HierarchicalEvent：org.clxmm.event.c_hierarchical.component.HierarchicalEvent[source=子容器发布的HierarchicalEvent]
监听到HierarchicalEvent：org.clxmm.event.c_hierarchical.component.HierarchicalEvent[source=子容器发布的HierarchicalEvent]
```

注意看，父容器广播的事件只触发了一次监听，而子容器广播的事件触发了两次监听。

由此我们可以得出结论：**子容器的事件会向上传播到父容器，父容器的事件不会向下传播**。至于其中的原理，在后半部分咱深入源码中来分析，现在先别着急，先把一些特性都了解完。

## 2. PayloadApplicationEvent【了解】

### 2.1 PayloadApplicationEvent的出现

`PayloadApplicationEvent` 是在 SpringFramework 4.2 才出现的事件，它基于 `ApplicationEvent` 之上扩展，能承载**任何类型**的数据。从源码的结构中也能看得出来：

```java
public class PayloadApplicationEvent<T> extends ApplicationEvent implements ResolvableTypeProvider {

	private final T payload;

	public PayloadApplicationEvent(Object source, T payload) {
		super(source);
		Assert.notNull(payload, "Payload must not be null");
		this.payload = payload;
	}
```

注意这里还有泛型哦，说明它可以指定只监听某个特定类型的 payload 事件。

另外，在`PayloadApplicationEvent` 的 javadoc 中有一句话蛮有意思

> Mainly intended for internal use within the framework.
>
> 主要供框架内部使用。

然而这个事件却没有在 SpringFramework 的内部用到过。。。

不过话又说回来，这个事件的设计倒是蛮不错的，有了这种机制，可能在具体的事件开发中，都不需要编写自定义事件了，只靠 `PayloadApplicationEvent` + 泛型就可以搞定了。下面我们还是来演示一下 `PayloadApplicationEvent` 的使用。

### 2.2 PayloadApplicationEvent的使用

使用 `PayloadApplicationEvent` 根本不需要自定义事件，只用监听器就可以。

#### 2.2.1 自定义监听器

声明监听器的套路，跟之前是一模一样的：

```java
public class PayloadObjectApplicationListener implements ApplicationListener<PayloadApplicationEvent> {
    
    @Override
    public void onApplicationEvent(PayloadApplicationEvent event) {
        System.out.println("监听到PayloadApplicationEvent ------> " + event.getPayload());
    }
}
```

注意 `PayloadApplicationEvent` 本身是有泛型的哦，如果不指定具体的泛型，则会监听所有的 `PayloadApplicationEvent` 事件。

像下面这样，指定了泛型为 `Integer` ，那就只会监听 `Integer` 类型的 payload 事件了。

```java
public class PayloadIntegerApplicationListener implements ApplicationListener<PayloadApplicationEvent<Integer>> {
    
    @Override
    public void onApplicationEvent(PayloadApplicationEvent event) {
        System.out.println("监听到PayloadApplicationEvent[Integer] ------> " + event.getPayload());
    }
}
```

#### 2.2.2 测试运行

声明完监听器就可以编写测试类了，这样我们还是用编程式驱动 IOC 来测试效果：

```java
public class PayloadEventApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
        ctx.addApplicationListener(new PayloadObjectApplicationListener());
        ctx.addApplicationListener(new PayloadIntegerApplicationListener());
        ctx.refresh();
        
        // 广播事件
        ctx.publishEvent("hahaha");
        ctx.publishEvent(123456789);
        ctx.publishEvent(new Person());
    }
}
```

这里测试代码中广播 3 种不同类型的 payload 事件，运行 main 方法，控制台会打印 4 行监听器的输出：

```
监听到PayloadApplicationEvent ------> hahaha
监听到PayloadApplicationEvent ------> 123456789
监听到PayloadApplicationEvent[Integer] ------> 123456789
监听到PayloadApplicationEvent ------> Person(name=null)
```

由此可以说明前面 payload 事件的监听规则：如果不指定具体的泛型，则会监听所有的 `PayloadApplicationEvent` 事件；在 `PayloadApplicationEvent` 的事件上指定具体的泛型类型，则只会监听该泛型类型的 `PayloadApplicationEvent` 事件。

## 3. 【原理】事件广播原理

> event.b_registerevent

### 3.0 SpringFramework中的事件模型

在 Debug 代码之前，有必要先对 SpringFramework 中的两个事件的核心组件有一个清晰的认识。

**`ApplicationEventPublisher`** 和 **`ApplicationEventMulticaster`** ，它们分别代表**事件发布器**和**事件广播器**。注意这两个组件可不是一回事哦，**事件发布器是用来接受事件，并交给事件广播器处理；事件广播器拿到事件发布器的事件，并广播给监听器**。在观察者模式中，**观察者**就是这两者的合体，只不过在 SpringFramework 中把职责拆分开了而已。

`ApplicationContext` 的结构不？`ApplicationContext` 接口继承了 `ApplicationEventPublisher` ，拥有事件发布的功能；`ApplicationContext` 的第一个抽象实现类 `AbstractApplicationContext` 组合了一个 `ApplicationEventMulticaster` ，拥有事件广播的能力。综合来看，`ApplicationContext` 的落地实现就已经能够完成事件驱动模型中的 “观察者” 身份了。

### 3.1 发布事件

在 `RegisterEventApplication` 中，我们调用了 `RegisterService` 去注册用户，发布事件：

```java
registerService.register("张大三");

public void register(String username) {
    // 用户注册的动作。。。
    System.out.println(username + "注册成功。。。");
    // 发布事件
    publisher.publishEvent(new RegisterSuccessEvent(username));
}
```

这个 `publishEvent` 方法，就是发布事件的核心方法，我们进去看一下它的具体实现。

#### 3.1.1 publishEvent的重载

```java
public void publishEvent(ApplicationEvent event) {
    publishEvent(event, null);
}
```

它调了一个重载的 `publishEvent` 方法，我们先不要着急点进去看，稍微留意一下它下面的方法：

```java
public void publishEvent(Object event) {
    publishEvent(event, null);
}

```

可以传 `Object` 进去哦，这不就是发布 `PayloadApplicationContext` 的地方嘛，所以最终的 `publishEvent` 方法肯定是接收 `Object` 才行了。

#### 3.1.2 publishEvent的实现

往里进入 `publishEvent` 的具体实现，终于看到大篇的实现了，先大体看一下处理的逻辑结构吧：（关键注释已标注在源码中）

```java
protected void publishEvent(Object event, @Nullable ResolvableType eventType) {
    Assert.notNull(event, "Event must not be null");

    // Decorate event as an ApplicationEvent if necessary
    // 这里要给普通的对象封装为PayloadApplicationEvent
    ApplicationEvent applicationEvent;
    if (event instanceof ApplicationEvent) {
        applicationEvent = (ApplicationEvent) event;
    }
    else {
        applicationEvent = new PayloadApplicationEvent<>(this, event);
        if (eventType == null) {
            eventType = ((PayloadApplicationEvent<?>) applicationEvent).getResolvableType();
        }
    }

    // Multicast right now if possible - or lazily once the multicaster is initialized
    // 添加事件广播（earlyApplicationEvents太过于复杂，会考虑后续加餐内容解释）
    if (this.earlyApplicationEvents != null) {
        this.earlyApplicationEvents.add(applicationEvent);
    }
    else {
        getApplicationEventMulticaster().multicastEvent(applicationEvent, eventType);
    }

    // Publish event via parent context as well...
    // 通知父容器发布事件
    if (this.parent != null) {
        if (this.parent instanceof AbstractApplicationContext) {
            ((AbstractApplicationContext) this.parent).publishEvent(event, eventType);
        }
        else {
            this.parent.publishEvent(event);
        }
    }
}
```

分开来看，广播事件的行为可以分为三部分：

- 适配 payload 类型的 ApplicationEvent
- 在本容器中广播事件
- 通知父容器发布事件（正好知道了为什么子容器的事件会广播到父容器）

这里面，第 1 步和第 3 步都很容易理解了，关键是 `ApplicationEventMulticaster` 又是怎么通知监听器的呢？下面咱进到里面去继续探究。

### 3.2 ApplicationEventMulticaster广播事件

来到 `ApplicationEventMulticaster` 的唯一落地实现类 `SimpleApplicationEventMulticaster` 中：

```java
public void multicastEvent(final ApplicationEvent event, @Nullable ResolvableType eventType) {
    ResolvableType type = (eventType != null ? eventType : resolveDefaultEventType(event));
    Executor executor = getTaskExecutor();
    for (ApplicationListener<?> listener : getApplicationListeners(event, type)) {
        if (executor != null) {
            executor.execute(() -> invokeListener(listener, event));
        }
        else {
            invokeListener(listener, event);
        }
    }
}
```

这里有几个动作，我们一一来看。

#### 3.2.1 包装事件类型

方法的第一行代码，它执行了一个 `resolveDefaultEventType` 方法，它用来包装 `ApplicationEvent` 的具体类型，目的是可以更方便的获取对象和类的一些信息（父类、接口、泛型等）。这个方法的返回值类型是 `ResolvableType` ，这个东西我们还是拿来说一下的。

`ResolvableType` 原本是在 SpringFramework 4.0 出现的，用来处理泛型类型的便捷的 API 。使用 `ResolvableType` 可以更方便的解析、获取到指定类、属性、方法中的泛型类型。注意，它只能简化操作，并不能在 Java 原生的反射上做更多的事。

简单的演示一下 `ResolvableType` 的使用吧，它主要是能方便的取出类、对象、继承的抽象类、实现的接口等等，上面标注的泛型类型：

```java
public static void main(String[] args) throws Exception {
    // 此处的Listener取自16章的quickstart部分
    ResolvableType resolvableType = ResolvableType.forClass(ContextRefreshedApplicationListener.class);
    System.out.println(resolvableType.getInterfaces()[0].resolveGeneric(0));
}
```

那既然源码中将 `ApplicationEvent` 包装成 `ResolvableType` ，基本就可以猜测出是为了获取 Event 中的泛型。

#### 3.2.2 获取异步执行的线程池

```java
    Executor executor = getTaskExecutor();

```

获取 `TastExecutor` ，任务执行器，这个 `Executor` 是 JUC 中的，它的具体实现想必小伙伴们可能不陌生：`ExecuteService` 线程池。而在这里具体要获取到的 `TaskExecutor` 是 SpringFramework 基于 `Executor` 扩展的，而且作了函数式接口标记，方法还是 `Executor` 的方法，没有变过。

```java
@FunctionalInterface
public interface TaskExecutor extends Executor {
	void execute(Runnable task);
}
```

它就是用来执行异步事件的。从源码下面的判断中也能看得出来：

```java
     if (executor != null) {
            executor.execute(() -> invokeListener(listener, event));
        }
```

那我们继续往下看。

#### 3.2.3 获取匹配的监听器，广播事件

下一步就是要取监听器了，注意传入的参数有两个哦：`getApplicationListeners(event, type)` ，包含事件本身，和事件的类型。这个地方我们暂时不深入看了，先把整体流程看完。

```java
protected void invokeListener(ApplicationListener<?> listener, ApplicationEvent event) {
    ErrorHandler errorHandler = getErrorHandler();
    if (errorHandler != null) {
        try {
            doInvokeListener(listener, event);
        }
        catch (Throwable err) {
            errorHandler.handleError(err);
        }
    }
    else {
        doInvokeListener(listener, event);
    }
}
```

外头的分支逻辑我们不关心，注意最核心的方法：`doInvokeListener` ，又看到 **do** 开头了，它就是真正执行功能的方法。

```java
private void doInvokeListener(ApplicationListener listener, ApplicationEvent event) {
    try {
        listener.onApplicationEvent(event);
    } // catch ......
}
```

到这里，看到 `ApplicationListener` 的 `onApplicationEvent` 方法被调用了，至此完成事件的广播。

### 3.3 获取监听器的逻辑

最后我们来看看获取监听器的内部实现，这一段源码比较长，咱来分析一下：（关键注释已标注在源码中）

```java
final Map<ListenerCacheKey, ListenerRetriever> retrieverCache = new ConcurrentHashMap<>(64);

protected Collection<ApplicationListener<?>> getApplicationListeners(
        ApplicationEvent event, ResolvableType eventType) {

    Object source = event.getSource();
    Class<?> sourceType = (source != null ? source.getClass() : null);
    ListenerCacheKey cacheKey = new ListenerCacheKey(eventType, sourceType);

    // Quick check for existing entry on ConcurrentHashMap...
    // 此处使用监听器缓存+双检锁，保证快速取出监听器
    ListenerRetriever retriever = this.retrieverCache.get(cacheKey);
    if (retriever != null) {
        return retriever.getApplicationListeners();
    }

    if (this.beanClassLoader == null ||
            (ClassUtils.isCacheSafe(event.getClass(), this.beanClassLoader) &&
                    (sourceType == null || ClassUtils.isCacheSafe(sourceType, this.beanClassLoader)))) {
        // Fully synchronized building and caching of a ListenerRetriever
        synchronized (this.retrievalMutex) {
            retriever = this.retrieverCache.get(cacheKey);
            if (retriever != null) {
                return retriever.getApplicationListeners();
            }
            // 双检锁通过，确认没有缓存，则真正执行获取监听器的逻辑
            retriever = new ListenerRetriever(true);
            Collection<ApplicationListener<?>> listeners =
                    retrieveApplicationListeners(eventType, sourceType, retriever);
            this.retrieverCache.put(cacheKey, retriever);
            return listeners;
        }
    }
    else {
        // No ListenerRetriever caching -> no synchronization necessary
        return retrieveApplicationListeners(eventType, sourceType, null);
    }
}
```

仔细观察这段源码的设计，很明显这是一个**缓存的双检锁设计**呀！`retrieverCache` 中保存了指定事件对应的监听器，而缓存的来源就是真正获取监听器的 `retrieveApplicationListeners` 方法。下面我们来进入这个方法：

（方法比较长，这里只截取重要的部分）

```java
private Collection<ApplicationListener<?>> retrieveApplicationListeners(
        ResolvableType eventType, @Nullable Class<?> sourceType, @Nullable ListenerRetriever retriever) {

    List<ApplicationListener<?>> allListeners = new ArrayList<>();
    Set<ApplicationListener<?>> listeners;
    Set<String> listenerBeans;
    synchronized (this.retrievalMutex) {
        // defaultRetriever中存放了所有的监听器
        listeners = new LinkedHashSet<>(this.defaultRetriever.applicationListeners);
        listenerBeans = new LinkedHashSet<>(this.defaultRetriever.applicationListenerBeans);
    }

    // Add programmatically registered listeners, including ones coming
    // from ApplicationListenerDetector (singleton beans and inner beans).
    // 逐个检查监听器是否支持当前事件，此处的监听器来源是编程式添加
    // ( addApplicationListener )
    for (ApplicationListener<?> listener : listeners) {
        if (supportsEvent(listener, eventType, sourceType)) {
            if (retriever != null) {
                retriever.applicationListeners.add(listener);
            }
            allListeners.add(listener);
        }
    }

    // Add listeners by bean name, potentially overlapping with programmatically
    // registered listeners above - but here potentially with additional metadata.
    // 同样是检查监听器是否支持当前事件，不过此处的监听器来源是声明式/配置式
    // ( @Component、<bean>等 )
    if (!listenerBeans.isEmpty()) {
        ConfigurableBeanFactory beanFactory = getBeanFactory();
        for (String listenerBeanName : listenerBeans) {
            try {
                if (supportsEvent(beanFactory, listenerBeanName, eventType)) {
                    ApplicationListener<?> listener =
                            beanFactory.getBean(listenerBeanName, ApplicationListener.class);
                    if (!allListeners.contains(listener) && supportsEvent(listener, eventType, sourceType)) {
                        if (retriever != null) {
                            if (beanFactory.isSingleton(listenerBeanName)) {
                                retriever.applicationListeners.add(listener);
                            }
                            else {
                                retriever.applicationListenerBeans.add(listenerBeanName);
                            }
                        }
                        allListeners.add(listener);
                    }
                } // else 移除监听
            } // catch ......
        }
    }

    // 监听器排序
    AnnotationAwareOrderComparator.sort(allListeners);
    if (retriever != null && retriever.applicationListenerBeans.isEmpty()) {
        retriever.applicationListeners.clear();
        retriever.applicationListeners.addAll(allListeners);
    }
    return allListeners;
}
```

整体概括一下这个过程，它可以分为三个步骤：

1. 筛选出由**编程式**注入到 IOC 容器的，监听当前发布事件的监听器

2. 筛选出由**声明式 / 配置式**注入到 IOC 容器的，监听当前发布事件的监听器

3. 监听器排序

   