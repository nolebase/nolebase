---
title: 10IOC基础-Bean的生命周期-初始化与销毁
--- 

Bean 创建出来之后，也就到了咱正常理解的生命周期中的初始化阶段了，整个 Bean 的生命周期也是非常重要的，小伙伴需要好好理解这部分知识。

## 1. 生命周期的意义【掌握】

### 1.1 生命周期的阶段

![image-20220427204604428](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220427204604.png)

一个对象从被创建，到被垃圾回收，可以宏观的划分为 5 个阶段：

- 创建 / 实例化阶段：此时会调用类的构造方法，产生一个新的对象
- 初始化阶段：此时对象已经创建好，但还没有被正式使用，可能这里面需要做一些额外的操作（如预初始化数据库的连接池）
- 运行使用期：此时对象已经完全初始化好，程序正常运行，对象被使用
- 销毁阶段：此时对象准备被销毁，已不再使用，需要预先的把自身占用的资源等处理好（如关闭、释放数据库连接）
- 回收阶段：此时对象已经完全没有被引用了，被垃圾回收器回收

由此可见，把控好生命周期的步骤，可以在恰当的时机处理一些恰当的逻辑。

### 1.2 SpringFramework能干预的生命周期阶段

仔细观察上面的 5 个阶段，思考一个问题：作为一个框架，它能干预的是哪几个阶段呢？

很明显，只有对象的回收动作不行吧。

那再思考一个问题：我们使用 SpringFramework 来获取 Bean 的前提下，又能干预哪几个阶段呢？

这次 Bean 的创建应该是咱也干预不了了，只剩下**初始化和销毁两个阶段**可以干预了吧。

再思考，SpringFramework 如何能让我们干预 Bean 的初始化和销毁呢？

回想一下 **Servlet** ，`Servlet` 里面有两个方法，分别叫 `init` 和 `destroy` ，咱之前在使用 Servlet 开发时，有自己调过这两个方法吗？肯定没有吧。但是这两个方法有真实的被调用过吗？肯定有吧，不然咋设计出来的呢？这两个方法都是**被 Web 容器（ Tomcat 等）调用的吧，用来初始化和销毁 Servlet 的**。这种方法的设计思想其实就是 “**回调机制**” ，它**都不是自己设计的，而是由父类 / 接口定义好的，由第三者（框架、容器等）来调用**。回调机制跟前面咱学的那些 `Aware` 接口的回调注入，在核心思想上其实是一样的。

理解了生命周期的阶段，以及回调的机制，下面咱就可以来学习 SpringFramework 中提供的初始化和销毁的回调开口了。

> 生命周期的触发，更适合叫回调，因为生命周期方法是咱定义的，但方法被调用，是框架内部帮我们调的，那也就可以称之为 “回调” 了。

## 2. init-method&destroy-method【掌握】

### 2.1 创建Bean

```java
public class Cat {
    
    private String name;
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void init() {
        System.out.println(name + "被初始化了。。。");
    }
    public void destroy() {
        System.out.println(name + "被销毁了。。。");
    }
}

public class Dog {
    
    private String name;
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void init() {
        System.out.println(name + "被初始化了。。。");
    }
    public void destroy() {
        System.out.println(name + "被销毁了。。。");
    }
}
```

### 2.2 创建配置文件/配置类

xml 方式，咱使用 `<bean>` 标签来注册 `Cat` ：

```xml
    <bean class="com.linkedbear.spring.lifecycle.a_initmethod.bean.Cat"
          init-method="init" destroy-method="destroy">
        <property name="name" value="mimi"/>
    </bean>
```

#### 2.2.2 注解配置

类似于 xml ，`@Bean` 注解中也有类似的属性，只不过 Java 中的属性名不能带短横线，所以就改用驼峰命名咯：

```java
    @Bean(initMethod = "init", destroyMethod = "destroy")
    public Dog dog() {
        Dog dog = new Dog();
        dog.setName("wangwang");
        return dog;
    }
```

#### 2.2.3 初始化销毁方法的要求特征

注意一点，这些配置的初始化和销毁方法必须具有以下特征：（原因一并解释）

- 方法访问权限无限制要求（ SpringFramework 底层会反射调用的）
- 方法无参数（如果真的设置了参数，SpringFramework 也不知道传什么进去）
- 方法无返回值（返回给 SpringFramework 也没有意义）
- 可以抛出异常（异常不由自己处理，交予 SpringFramework 可以打断 Bean 的初始化 / 销毁步骤）

### 2.3 测试效果

分别初始化 xml 和注解驱动的容器，不过需要注意的是，这次咱接收的类型不再用 `ApplicationContext` ，而是用实现类本身，目的是为了调用 `close` 方法对容器进行关闭，以触发 Bean 的销毁动作。至于为什么实现类会有 `close` 方法，`ApplicationContext` 本身没有，这个咱后面放到 IOC进阶部分讲解。

```java
public class InitMethodXmlApplication {
    
    public static void main(String[] args) throws Exception {
        System.out.println("准备初始化IOC容器。。。");
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("lifecycle/bean-initmethod.xml");
        System.out.println("IOC容器初始化完成。。。");
        
        System.out.println();
        
        System.out.println("准备销毁IOC容器。。。");
        ctx.close();
        System.out.println("IOC容器销毁完成。。。");
    }
}
```

```
准备初始化IOC容器。。。
mimi被初始化了。。。
IOC容器初始化完成。。。

准备销毁IOC容器。。。
mimi被销毁了。。。
IOC容器销毁完成。。。
```

由此可以得出结论：**在 IOC 容器初始化之前，默认情况下 Bean 已经创建好了，而且完成了初始化动作；容器调用销毁动作时，先销毁所有 Bean ，最后 IOC 容器全部销毁完成。**

### 2.4 Bean的初始化流程顺序探究

上面的编码中，只能看出来 Bean 在 IOC 容器初始化阶段就创建并初始化好，那每个 Bean 的初始化动作又是如何呢？咱修改一下 Cat ，分别在构造方法和 `setName` 方法中加入控制台打印，这样在触发这些方法时，会在控制台上得以体现：

```java
public class Cat {
    
    private String name;
    
    public Cat() {
        System.out.println("Cat 构造方法执行了。。。");
    }
    
    public void setName(String name) {
        System.out.println("setName方法执行了。。。");
        this.name = name;
    }
```

重新运行启动类的 `main` 方法，控制台会打印如下内容：（省略销毁部分）

```
准备初始化IOC容器。。。
Cat 构造方法执行了。。。
setName方法执行了。。。
mimi被初始化了。。。
IOC容器初始化完成。。。

```

由此可以得出结论：**Bean 的生命周期中，是先对属性赋值，后执行 `init-method` 标记的方法**。

## 3. JSR250规范【掌握】

上面的方法，都是咱手动声明注册的 Bean ，对于那些使用模式注解的 Bean ，这种方式就不好使了，因为**没有可以让你声明 `init-method` 和 `destroy-method` 的地方了，`@Component` 注解上也只有一个 `value` 属性而已**。这个时候咱就需要学习一种新的方式，这种方式专门配合注解式注册 Bean 以完成全注解驱动开发，那就是如标题所说的 **JSR250 规范**。

SR250 规范中除了有 `@Resource` 这样的自动注入注解，还有负责生命周期的注解，包括 **`@PostConstruct`** 、**`@PreDestroy`** 两个注解，分别对应 `init-method` 和 `destroy-method` 。

### 3.1 创建Bean

这次咱模拟另一种场景：钢笔与墨水，刚买来的动作代表实例化，加墨水的动作代表初始化，倒掉所有墨水的动作代表销毁，于是这个 `Pen` 可以这样设计：

```java
@Component
public class Pen {
    
    private Integer ink;
    
    public void addInk() {
        this.ink = 100;
    }
    
    public void outwellInk() {
        this.ink = 0;
    }
    
    @Override
    public String toString() {
        return "Pen{" + "ink=" + ink + '}';
    }
}

```

对于 JSR250 规范的这两个注解的使用，直接标注在 Bean 的方法上即可：（顺便加上控制台打印以便观察）

```java
    @PostConstruct
    public void addInk() {
        System.out.println("钢笔中已加满墨水。。。");
        this.ink = 100;
    }
    
    @PreDestroy
    public void outwellInk() {
        System.out.println("钢笔中的墨水都放干净了。。。");
        this.ink = 0;
    }
```

被 `@PostConstruct` 和 `@PreDestroy` 注解标注的方法，与 `init-method` / `destroy-method` 方法的声明要求是一样的，访问修饰符也可以是 private 。

### 3.2 测试效果

编写启动类，直接扫描这个 Pen 类：

```java
public class JSR250AnnoApplication {
    
    public static void main(String[] args) throws Exception {
        System.out.println("准备初始化IOC容器。。。");
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                "com.linkedbear.spring.lifecycle.b_jsr250.bean");
        System.out.println("IOC容器初始化完成。。。");
        System.out.println();
        System.out.println("准备销毁IOC容器。。。");
        ctx.close();
        System.out.println("IOC容器销毁完成。。。");
    }
}
```

```
准备初始化IOC容器。。。
钢笔中已加满墨水。。。
IOC容器初始化完成。。。

准备销毁IOC容器。。。
钢笔中的墨水都放干净了。。。
IOC容器销毁完成。。。
```

可见这两个注解也完成了像 `init-method` 和 `destroy-method` 一样的效果。

### 3.3 JSR250规范与init-method共存

如果不使用 `@Component` 注解来注册 Bean 而转用 `<bean>` / `@Bean` 的方式，那 `@PostConstruct` 与 `@PreDestroy` 注解是可以与 `init-method` / `destroy-method` 共存的，下面咱来演示.

```java
    public void open() {
        System.out.println("init-method - 打开钢笔。。。");
    }
    
    public void close() {
        System.out.println("destroy-method - 合上钢笔。。。");
    }
    
    @PostConstruct
    public void addInk() {
        System.out.println("@PostConstruct - 钢笔中已加满墨水。。。");
        this.ink = 100;
    }
    
    @PreDestroy
    public void outwellInk() {
        System.out.println("@PreDestroy - 钢笔中的墨水都放干净了。。。");
        this.ink = 0;
    }

```

```
@Configuration
public class JSR250Configuration {

    @Bean(initMethod = "open", destroyMethod = "close")
    public Pen2 pen() {
        return new Pen2();
    }
}
```

之后修改启动类，驱动这个配置类，观察控制台的打印：

```
准备初始化IOC容器。。。
@PostConstruct - 钢笔中已加满墨水。。。
init-method - 打开钢笔。。。
IOC容器初始化完成。。。

准备销毁IOC容器。。。
@PreDestroy - 钢笔中的墨水都放干净了。。。
destroy-method - 合上钢笔。。。
IOC容器销毁完成。。。
```

虽然打印的逻辑有点怪怪的，但透过逻辑看执行顺序，可以得出结论：**JSR250 规范的执行优先级高于 init / destroy**。

## 4. InitializingBean&DisposableBean【掌握】

这两个家伙实际上是两个接口，而且是 SpringFramework 内部预先定义好的两个关于生命周期的接口。他们的触发时机与上面的 `init-method` / `destroy-method` 以及 JSR250 规范的两个注解一样，都是在 Bean 的初始化和销毁阶段要回调的。下面咱演示这两个接口的使用。

### 4.1 创建Bean

```java
@Component
public class Pen implements InitializingBean, DisposableBean {
    
    private Integer ink;
    
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("钢笔中已加满墨水。。。");
        this.ink = 100;
    }
    
    @Override
    public void destroy() throws Exception {
        System.out.println("钢笔中的墨水都放干净了。。。");
        this.ink = 0;
    }
    
    @Override
    public String toString() {
        return "Pen{" + "ink=" + ink + '}';
    }
}
```

### 4.2 测试效果

```
public class InitializingDisposableAnnoApplication {
    
    public static void main(String[] args) throws Exception {
        System.out.println("准备初始化IOC容器。。。");
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                "com.linkedbear.spring.lifecycle.c_initializingbean.bean");
        System.out.println("IOC容器初始化完成。。。");
        System.out.println();
        System.out.println("准备销毁IOC容器。。。");
        ctx.close();
        System.out.println("IOC容器销毁完成。。。");
    }
}
```



```
准备初始化IOC容器。。。
钢笔中已加满墨水。。。
IOC容器初始化完成。。。

准备销毁IOC容器。。。
钢笔中的墨水都放干净了。。。
IOC容器销毁完成。。
```

### 4.3 三种生命周期并存

与上面一样，咱测试一下，当一个 Bean 同时使用这三种生命周期共同控制时，执行顺序是怎样的。

再复制出一个 `Pen` 来，命名为 `Pen3` ，并同时实现三种生命周期的控制：（三种方式的顺序按照讲解的顺序从上到下排列）

```java
    public void open() {
        System.out.println("init-method - 打开钢笔。。。");
    }
    
    public void close() {
        System.out.println("destroy-method - 合上钢笔。。。");
    }
    
    @PostConstruct
    public void addInk() {
        System.out.println("@PostConstruct - 钢笔中已加满墨水。。。");
        this.ink = 100;
    }
    
    @PreDestroy
    public void outwellInk() {
        System.out.println("@PreDestroy - 钢笔中的墨水都放干净了。。。");
        this.ink = 0;
    }
    
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("InitializingBean - 准备写字。。。");
    }
    
    @Override
    public void destroy() throws Exception {
        System.out.println("DisposableBean - 写完字了。。。");
    }
```

```
    @Bean(initMethod = "open", destroyMethod = "close")
    public Pen3 pen() {
        return new Pen3();
    }
```

```
准备初始化IOC容器。。。
@PostConstruct - 钢笔中已加满墨水。。。
InitializingBean - 准备写字。。。
init-method - 打开钢笔。。。
IOC容器初始化完成。。。

准备销毁IOC容器。。。
@PreDestroy - 钢笔中的墨水都放干净了。。。
DisposableBean - 写完字了。。。
destroy-method - 合上钢笔。。。
IOC容器销毁完成。。。
```

这个顺序又有点怪怪的，咱不要关注那些，总结执行顺序才是最关键的：**`@PostConstruct` → `InitializingBean` → `init-method`** 。

## 5. 原型Bean的生命周期【掌握】

对于原型 Bean 的生命周期，使用的方式跟上面是完全一致的，只是它的触发时机就不像单实例 Bean 那样了。

单实例 Bean 的生命周期是陪着 IOC 容器一起的，容器初始化，单实例 Bean 也跟着初始化（当然不绝对，后面会介绍延迟 Bean ）；容器销毁，单实例 Bean 也跟着销毁。原型 Bean 由于每次都是取的时候才产生一个，所以它的生命周期与 IOC 容器无关。

### 5.1 创建Bean+配置类

将上面的 `Pen3` 改名为 `Pen` ，移到一个新的包中，之后创建配置类，注册这个 `Pen` ，并标注原型 Bean ：

```java
@Configuration
public class PrototypeLifecycleConfiguration {
    
    @Bean(initMethod = "open", destroyMethod = "close")
    @Scope(ConfigurableBeanFactroy.SCOPE_PROTOTYPE)
    public Pen pen() {
        return new Pen();
    }
}
```

下面咱开始逐步测试。

### 5.2 IOC容器初始化时原型Bean不初始化

```java
public class PrototypeLifecycleApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                PrototypeLifecycleConfiguration.class);
        System.out.println("IOC容器初始化完成。。。");
    }
}
```

运行 `main` 方法，控制台只打印了 `IOC容器初始化完成。。。` 这一句话，证明**原型 Bean 的创建不随 IOC 的初始化而创建**。

### 5.3 原型Bean的初始化动作与单实例Bean一致

在 `main` 方法中添加如下几行代码，来获取一次 Pen 实例：

```java
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                PrototypeLifecycleConfiguration.class);
        System.out.println("准备获取一个Pen。。。");
        Pen pen = ctx.getBean(Pen.class);
        System.out.println("已经取到了Pen。。。");
    }
```

```
准备获取一个Pen。。。
@PostConstruct - 钢笔中已加满墨水。。。
InitializingBean - 准备写字。。。
init-method - 打开钢笔。。。
已经取到了Pen。。。
```

三种初始化的动作都执行了，证明**原型Bean的初始化动作与单实例Bean完全一致**。

### 5.4 原型Bean的销毁不包括destroy-method

```java
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                PrototypeLifecycleConfiguration.class);
        System.out.println("准备获取一个Pen。。。");
        Pen pen = ctx.getBean(Pen.class);
        System.out.println("已经取到了Pen。。。");
        System.out.println("用完Pen了，准备销毁。。。");
        ctx.getBeanFactroy().destroyBean(pen);
        System.out.println("Pen销毁完成。。。");
    }
```

再次运行 `main` 方法，发现控制台中只打印了 `@PreDestroy` 注解和 `DisposableBean` 接口的执行，没有触发 `destroy-method` 的执行：

```
用完Pen了，准备销毁。。。
@PreDestroy - 钢笔中的墨水都放干净了。。。
DisposableBean - 写完字了。。。
Pen销毁完成。。。
```

## SpringFramework中控制Bean生命周期的三种方式

|            | init-method & destroy-method              | @PostConstruct & @PreDestroy    | InitializingBean & DisposableBean |
| ---------- | ----------------------------------------- | ------------------------------- | --------------------------------- |
| 执行顺序   | 最后                                      | 最先                            | 中间                              |
| 组件耦合度 | 无侵入（只在 `<bean>` 和 `@Bean` 中使用） | 与 JSR 规范耦合                 | 与 SpringFramework 耦合           |
| 容器支持   | xml 、注解原生支持                        | 注解原生支持，xml需开启注解驱动 | xml 、注解原生支持                |
| 单实例Bean | √                                         | √                               | √                                 |
| 原型Bean   | 只支持 init-method                        | √                               | √                                 |

