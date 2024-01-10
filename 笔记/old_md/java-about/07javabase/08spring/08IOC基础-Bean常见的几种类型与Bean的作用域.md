---
title: 08IOC基础-Bean常见的几种类型与Bean的作用域
--- 

## 1. Bean的类型【掌握】

在 SpringFramework 中，对于 Bean 的类型，一般有两种设计：**普通 Bean 、工厂 Bean** 。以下分述这两种类型。

### 1.1 普通Bean

### 1.2 FactoryBean

SpringFramework 考虑到一些特殊的设计：Bean 的创建需要指定一些策略，或者依赖特殊的场景来分别创建，也或者一个对象的创建过程太复杂，使用 xml 或者注解声明也比较复杂。这种情况下，如果还是使用普通的创建 Bean 方式，以咱现有的认知就搞不定了。于是，SpringFramework 在一开始就帮我们想了办法，可以借助 **`FactoryBean`** 来使用工厂方法创建对象。如：`SqlSessionFactoryBean`

#### 1.2.1 FactoryBean是什么

`FactoryBean` 本身是一个接口，它本身就是一个创建对象的工厂。如果 Bean 实现了 `FactoryBean` 接口，则它本身将不再是一个普通的 Bean ，不会在实际的业务逻辑中起作用，而是由创建的对象来起作用。

`FactoryBean` 接口有三个方法：

```java
public interface FactoryBean<T> {
    // 返回创建的对象
    @Nullable
    T getObject() throws Exception;

    // 返回创建的对象的类型（即泛型类型）
    @Nullable
    Class<?> getObjectType();

    // 创建的对象是单实例Bean还是原型Bean，默认单实例
    default boolean isSingleton() {
        return true;
    }
}
```

#### 1.2.2 FactoryBean的使用

咱构造一个场景：小孩子要买玩具，由一个玩具生产工厂来给这个小孩子造玩具。

##### 1.2.2.1 创建小孩子+玩具

小孩子的类在上面已经创建好了，咱给这里面加一个属性，代表现在想要玩的玩具：

```java
public class ToyFactoryBean implements FactoryBean<Toy> {
    
    private Child child;
    
    @Override
    public Toy getObject() throws Exception {
        return null;
    }
    
    @Override
    public Class<Toy> getObjectType() {
        return Toy.class;
    }
    
    public void setChild(Child child) {
        this.child = child;
    }
}
```

剩下的就是编写创建逻辑了，咱根据 `Child` 中的 `wantToy` 属性，来决定创建哪个玩具：

```java
@Override
    public Toy getObject() throws Exception {
        switch (child.getWantToy()) {
            case "ball":
                return new Ball("ball");
            case "car":
                return new Car("car");
            default:
                // SpringFramework2.0开始允许返回null
                // 之前的1.x版本是不允许的
                return null;
        }
    }
```

##### 1.2.2.3 注册工厂类

注解方式配置Bean

```java
    @Bean
    public Child child() {
        return new Child();
    }
    
    @Bean
    public ToyFactoryBean toyFactory() {
        ToyFactoryBean toyFactory = new ToyFactoryBean();
        toyFactory.setChild(child());
        return toyFactory;
    }
```

##### 1.2.2.4 测试运行

```java
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(BeanTypeConfiguration.class);
        Toy toy = ctx.getBean(Toy.class);
        System.out.println(toy);
    }
```

运行 `main` 方法，发现打印的 `Toy` 跟我们预想的一致：

```
Toy{name='ball'}

```

#### 1.2.3 FactoryBean与Bean同时存在

修改配置文件 / 配置类，向 IOC 容器预先的创建一个 `Ball` ，这样 `FactoryBean` 再创建一个，IOC 容器里就会同时存在两个 `Toy` 了：

```java
    @Bean
    public Toy ball() {
        return new Ball("ball");
    }
    
    @Bean
    public ToyFactoryBean toyFactory() {
        ToyFactoryBean toyFactory = new ToyFactoryBean();
        toyFactory.setChild(child());
        return toyFactory;
    }
```

再次运行 `main` 方法，发现控制台抛出了 `NoUniqueBeanDefinitionException` 异常，提示有两个 `Toy` 了，说明 **`FactoryBean` 创建的 Bean 是直接放在 IOC 容器中**了。

咱打印一下 IOC 容器中现有的 `Toy` ：

```java
        Map<String, Toy> toys = ctx.getBeansOfType(Toy.class);
        toys.forEach((name, toy) -> {
            System.out.println("toy name : " + name + ", " + toy.toString());
        });
```

```java
toy name : toyFactoryBean, Toy{name='ball'}
toy name : ball, Toy{name='ball'}
```

#### 1.2.4 FactoryBean创建Bean的时机

咱已经学过了，`ApplicationContext` 初始化 Bean 的时机默认是容器加载时就已经创建，那 `FactoryBean` 创建 Bean 的时机又是什么呢？咱下面来探究这个问题。

##### 1.2.4.1 FactoryBean的加载时机

给 `Toy` 的构造方法中添加一个控制台打印：

```java
    public Toy(String name) {
        System.out.println("生产了一个" + name);
        this.name = name;
    }
```

同时，给 `ToyFactoryBean` 也添加默认构造方法，加一句控制台打印：

```java
    
    public ToyFactoryBean() {
        System.out.println("ToyFactoryBean 初始化了。。。");
    }
```

注释掉利用注解创建的bean

```java
    @Bean
    public ToyFactoryBean toyFactoryBean() {
        ToyFactoryBean toyFactoryBean = new ToyFactoryBean();
        toyFactoryBean.setChild(child());
        return toyFactoryBean;
    }

//    @Bean
//    public Toy ball() {
//        return new Ball("ball");
//    }
```



接下来，咱修改 `main` 方法，只初始化 IOC 容器：

```java
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(BeanTypeConfiguration.class);
    }
```

```
ToyFactoryBean 初始化了。。。
```

只有 `ToyFactoryBean` 被初始化，说明 **`FactoryBean` 本身的加载是伴随 IOC 容器的初始化时机一起的**。

##### 1.2.4.2 创建Bean的时机

与此同时，发现控制台并没有打印生产玩具，说明 `FactoryBean` 中要创建的 Bean 还没有被加载，也就得出：**`FactoryBean` 生产 Bean 的机制是延迟生产**。

修改 `main` 方法，添加 `getBean` 的调用：

```java
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(BeanTypeConfiguration.class);
        Toy toy = ctx.getBean(Toy.class);
    }
```

再次运行 `main` 方法，发现这次生产出了玩具：

```
ToyFactoryBean 初始化了。。。
生产了一个ball
```

#### 1.2.5 FactoryBean创建Bean的实例数

咱上面看到了，`FactoryBean` 接口中有一个默认的方法 `isSingleton` ，默认是 true ，代表默认是单实例的。

修改 `main` 方法，连续取出两次 `Toy` ，并对比内存地址：

```java
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(BeanTypeConfiguration.class);
        Toy toy1 = ctx.getBean(Toy.class);
        Toy toy2 = ctx.getBean(Toy.class);
        System.out.println(toy1 == toy2);
    }
```

运行，发现控制台打印 true ，说明 **`FactoryBean` 默认生成的 Bean 确实是单实例的**。

#### 1.2.6 取出FactoryBean本体

咱刚才一直都是拿 `Toy` 本体去取，取到的都是 `FactoryBean` 生产的 Bean 。一般情况下咱也用不到 `FactoryBean` 本体，但如果真的需要取，使用的方法也很简单：要么直接传 `FactoryBean` 的 class （很容易理解），也可以传 ID 。不过，如果真的靠传 ID 的话，传配置文件 / 配置类声明的 ID 就不好使了，因为那样只会取出生产出来的 Bean ：

```java
System.out.println(ctx.getBean("toyFactory"));
// 输出：Toy{name='ball'}
```

取 `FactoryBean` 的方式，需要在 Bean 的 id 前面加 **“&”** 符号：

```java
        System.out.println(applicationContext.getBean("&toyFactoryBean"));
// org.clxmm.bean.a_type.bean.ToyFactoryBean@51b7e5df

```

## BeanFactory与FactoryBean的区别

`BeanFactory` ：SpringFramework 中实现 IOC 的最底层容器（此处的回答可以从两种角度出发：从类的继承结构上看，它是最顶级的接口，也就是最顶层的容器实现；从类的组合结构上看，它则是最深层次的容器，`ApplicationContext` 在最底层组合了 `BeanFactory` ）

`FactoryBean` ：创建对象的工厂 Bean ，可以使用它来直接创建一些初始化流程比较复杂的对象

## 2. Bean的作用域【掌握】

提到作用域，咱先回顾一下这个概念，彻底理解这个概念，对学习 SpringFramework 中 Bean 的作用域很有帮助。

### 2.1 作用域的概念

回想一下在学习 Java 基础的时候，咱学过一些基础的概念：**成员变量、方法变量、局部变量**。我下边列一段代码，小伙伴们来复习一下每一个变量的作用范围：

```java
public class ScopeReviewDemo {
    // 类级别成员
    private static String classVariable = "";
    
    // 对象级别成员
    private String objectVariable = "";
    
    public static void main(String[] args) throws Exception {
        // 方法级别成员
        String methodVariable = "";
        for (int i = 0; i < args.length; i++) {
            // 循环体局部成员
            String partVariable = args[i];
            
            // 此处能访问哪些变量？
        }
        
        // 此处能访问哪些变量？
    }
    
    public void test() {
        // 此处能访问哪些变量？
    }
    
    public static void staticTest() {
        // 此处能访问哪些变量？
    }
}

```

想必基础扎实的小伙伴很容易就能回答这个问题了吧。上面的四个问题，访问的成员作用域级别依次升高，这也就说明了**不同的作用域，可访问的位置是不一样的**。

那再思考一个问题：为什么会出现多种不同的作用域呢？肯定是它可以被使用的范围不同了。那为什么不都统一成一样的作用范围呢？说白了，**资源是有限的，如果一个资源允许同时被多个地方访问（如全局常量），那就可以把作用域提的很高；反之，如果一个资源伴随着一个时效性强的、带强状态的动作，那这个作用域就应该局限于这一个动作，不能被这个动作之外的干扰。**这段话理解起来可能有点困难，接下来咱配合着 SpringFramework 的作用域来学习，会更容易理解一些。

### 2.2 SpringFramework中内置的作用域

SpringFramework 中内置了 6 种作用域（5.x 版本）：

| 作用域类型  |                                              |
| ----------- | -------------------------------------------- |
| singleton   | 一个 IOC 容器中只有一个【默认值】            |
| prototype   | 每次获取创建一个                             |
| request     | 一次请求创建一个（仅Web应用可用）            |
| session     | 一个会话创建一个（仅Web应用可用）            |
| application | 一个 Web 应用创建一个（仅Web应用可用）       |
| websocket   | 一个 WebSocket 会话创建一个（仅Web应用可用） |

讲真还是比较好理解的吧，下面咱先介绍原生的两种作用域：**singleton** 和 **prototype** 。

### 2.3 singleton：单实例Bean

SpringFramework 官方文档中有一张图，解释了单实例 Bean 的概念：

![image-20220426211905167](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220426211905.png)

左边的几个定义的 Bean 同时引用了右边的同一个 `accountDao` ，对于这个 `accountDao` 就是单实例 Bean 。

SpringFramework 中默认所有的 Bean 都是单实例的，即：**一个 IOC 容器中只有一个**。

### 2.4 prototype：原型Bean

Spring 官方的定义是：**每次对原型 Bean 提出请求时，都会创建一个新的 Bean 实例。**这里面提到的 ”提出请求“ ，包括任何依赖查找、依赖注入的动作，都算做一次 ”提出请求“ 。由此咱也可以总结一点：如果连续 `getBean()` 两次，那就应该创建两个不同的 Bean 实例；向两个不同的 Bean 中注入两次，也应该注入两个不同的 Bean 实例。SpringFramework 的官方文档中也给出了一张解释原型 Bean 的图：

![image-20220426211956428](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220426211956.png)

图中的 3 个 `accountDao` 是 3 个不同的对象，由此可以体现出原型 Bean 的意思。

> 其实对于**原型**这个概念，在设计模式中也是有对应的：**原型模式**。原型模式实质上是使用对象深克隆，乍看上去跟 SpringFramework 的原型 Bean 没什么区别，但咱仔细想，每一次生成的原型 Bean 本质上都还是一样的，只是可能带一些特殊的状态等等，这个可能理解起来比较抽象，可以跟下面的 request 域结合着理解。

#### 2.4.3 原型Bean的创建时机

仔细思考一下，单实例 Bean 的创建咱已经知道，是在 `ApplicationContext` 被初始化时就已经创建好了，那这些原型 Bean 又是什么时候被创建的呢？其实也不难想出，它都是什么时候需要，什么时候创建。

### 2.5 Web应用的作用域们

上面表中还涉及到几个关于 Web 应用的作用域，它们都是在 Web 应用中才会有的，这个咱放到后面介绍 SpringWebMvc 时再介绍，这里只是简单介绍一下。

- request ：请求Bean，每次客户端向 Web 应用服务器发起一次请求，Web 服务器接收到请求后，由 SpringFramework 生成一个 Bean ，直到请求结束
- session ：会话Bean，每个客户端在与 Web 应用服务器发起会话后，SpringFramework 会为之生成一个 Bean ，直到会话过期
- application ：应用Bean，每个 Web 应用在启动时，SpringFramework 会生成一个 Bean ，直到应用停止（有的也叫 global-session ）
- websocket ：WebSocket Bean ，每个客户端在与 Web 应用服务器建立 WebSocket 长连接时，SpringFramework 会为之生成一个 Bean ，直到断开连接

