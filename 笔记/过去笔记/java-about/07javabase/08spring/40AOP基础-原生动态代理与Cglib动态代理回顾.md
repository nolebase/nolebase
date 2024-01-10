---
title: 40AOP基础-原生动态代理与Cglib动态代理回顾
---

## 1. 【需求】动态代理场景演绎

本章咱要演绎的场景，是一个普通玩家寻找陪玩的过程。

## 2. 基本代码场景演绎

#### 2.1 模型预设计

首先我们要先有一名普通玩家：

```java
public class Player {
    
    private String name;
    
    public Player(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
}
```

这个设计相当简单了，只有一个 name 作为标识就好啦。

然后要有一名游戏陪玩：

```java
public class Partner {
    
    private String name;
    
    public Partner(String name) {
        this.name = name;
    }
}
```

设计与游戏玩家一样，只需要拥有 name 即可。

#### 2.2 给陪玩设计行为

按照最简单的操作来看，陪玩应该有两个行为：**收钱**、**陪玩**。那我们就可以在 Partner 中定义这两个方法：

```java
public class Partner {
    
    private String name;
    
    public Partner(String name) {
        this.name = name;
    }
    
    /**
     * 收钱
     * @param money
     */
    public void receiveMoney(int money) {
        System.out.println(name + "收到佣金：" + money + "元 ~ ");
    }
    
    /**
     * 陪玩
     * @param player
     */
    public void playWith(Player player) {
        System.out.println(name + "与" + player.getName() + "一起愉快地玩耍 ~ ");
    }
}
```

#### 2.3 模拟场景

接下来就来演示真实场景了：假设有一个游戏玩家，名为 “郝武辽” ，他去找一个名为 “肖洁洁” 的陪玩陪他一起玩游戏。对应的代码就可以这样编写：

```java
public class Client {
    
    public static void main(String[] args) throws Exception {
        Player player = new Player("郝武辽");
        Partner partner = new Partner("肖洁洁");
        
        partner.receiveMoney(200);
        partner.playWith(player);
    }
}
```

运行 `main` 方法，控制台打印出了 肖洁洁 陪 郝武辽 玩游戏：

```
肖洁洁收到佣金：200元 ~ 
肖洁洁与郝武辽一起愉快地玩耍 ~ 
```

## 3. jdk动态代理的使用【掌握】

仔细观察一下上面的代码，先思考一个问题：这个 郝武辽 是怎么找到的 肖洁洁 呢？

很明显，是在 `Client` 的 `main` 方法中，由 `main` 方法把他们俩搞到一起的吧，那如果不看 `Client` 的话，那就可以理解为，**郝武辽 直接去 肖洁洁 的家里找的她，然后让她陪她一起玩游戏**。

但现实情况中，通常都是玩家去陪玩的平台上找陪玩，下面我们就来搞一个陪玩平台。

#### 3.1 陪玩平台的设计

陪玩平台中入驻了一些陪玩的选手，这里咱可以使用静态代码块来初始化一下：

```java
public class PartnerPlatform {
    
    private static List<Partner> partners = new ArrayList<>();
    
    static {
        partners.add(new Partner("肖洁洁"));
        partners.add(new Partner("田苟"));
        partners.add(new Partner("高总裁"));
    }
}
```

然后，陪玩平台要根据玩家的预算，推荐合适的陪玩。不过这里我们就不给 陪玩 的模型添加单价的设计了，只是做一下形式：

```java
    public static Partner getPartner(int money) {
        Partner partner = partners.remove(0);
        return partner;
    }
```

#### 3.2 代理的引入

本来到这里只是工厂模式的思维，还没有引入动态代理，那接下来我们要引入动态代理了。

我们在这里定义一个陪玩平台的额外规则：**如果一开始指定预算后，但付费时没给够，则这个陪玩直接 “装死” 不干了**。

于是我们可以这样设计

```java
public static Partner getPartner(int money) {
    Partner partner = partners.remove(0);
    return (Partner) Proxy.newProxyInstance(partner.getClass().getClassLoader(), partner.getClass().getInterfaces(), ......);
}
```

呃。。。等一下，`Partner` 还没有接口呢，所以我们需要给 `Partner` 抽取一个接口出来了。

#### 3.3 Partner抽取接口

```java
public interface Partner {

    void receiveMoney(int money);
    
    void playWith(Player player);
}
```

以及 `Partner` 的实现类 `IndividualPartner` ，代表个人陪玩：（个人的意思是区别于平台）

```java
public class IndividualPartner implements Partner {
    
    private String name;
    
    public IndividualPartner(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    @Override
    public void receiveMoney(int money) {
        System.out.println(name + "收到佣金：" + money + "元 ~ ");
    }
    
    @Override
    public void playWith(Player player) {
        System.out.println(name + "与" + player.getName() + "一起愉快地玩耍 ~ ");
    }
}
```

然后，在 `PartnerPlatform` 中修改静态代码块的初始化：

```java
    static {
        partners.add(new IndividualPartner("肖洁洁"));
        partners.add(new IndividualPartner("田苟"));
        partners.add(new IndividualPartner("高总裁"));
    }
```

这样就算抽取接口完成了。

#### 3.4 生成Partner的代理对象

抽取完接口后，就可以完成 `getPartner` 的逻辑编写了：

```java
public static Partner getPartner(int money) {
    Partner partner = partners.remove(0);
    return (Partner) Proxy.newProxyInstance(partner.getClass().getClassLoader(), partner.getClass().getInterfaces(),
            new InvocationHandler() {
                private int budget = money;
                private boolean status = false;
                
                @Override
                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    if (method.getName().equals("receiveMoney")) {
                        int money = (int) args[0];
                        // 平台需要运营，抽成一半
                        args[0] = money / 2;
                        // 如果在付钱时没给够，则标记budget为异常值
                        this.status = money >= budget;
                    }
                    if (status) {
                        return method.invoke(partner, args);
                    }
                    return null;
                }
            });
}
```

这里的代码中引入了一个 `status` 的标志位，来代表玩家的钱有没有给到位。

#### 3.5 模拟场景

`Client` 的测试代码中，只需要把 `Partner` 的获取动作由手动构造改为 `PartnerPlatform` 获取，其余的代码均不需要变动：

```java
public class Client {
    
    public static void main(String[] args) throws Exception {
        Player player = new Player("郝武辽");
        Partner partner = PartnerPlatform.getPartner(50);
    
        partner.receiveMoney(20);
        partner.playWith(player);
    }
}
```

一开始我们先不给足钱，运行 `main` 方法，发现控制台没有任何输出。。。

然后，将 20 改成 200 ，发现控制台可以打印输出了：

```java
肖洁洁收到佣金：100元 ~ 
肖洁洁与郝武辽一起愉快地玩耍 ~ 
```

至此，场景演绎完毕。

#### 3.6 jdk动态代理的核心API

好了，jdk 的动态代理已经实际的运用在代码中了，咱对这里面的用法和核心 API 作一个回顾。

jdk 的动态代理，要求被代理的对象所属类必须实现一个以上的接口，代理对象的创建使用 `Proxy.newProxyInstance` 方法，该方法中有三个参数：

- `ClassLoader loader` ：被代理的对象所属类的类加载器
- `Class<?>[] interfaces` ：被代理的对象所属类实现的接口
- `InvocationHandler h` ：代理的具体代码实现

在这三个参数中，前面两个都容易理解，最后一个 `InvocationHandler` 是一个接口，它的核心方法 `invoke` 中也有三个参数，一一来看：

- Object proxy ：代理对象的引用（代理后的）
- Method method ：代理对象执行的方法
- Object[] args ：代理对象执行方法的参数列表

具体的代理逻辑就在 `InvocationHandler` 的 `invoke` 方法中编写。

## 4. Cglib动态代理的使用【掌握】

前面场景都演绎完了，唯一一个让我们可能不爽的就是这个接口的抽取，不过还好 Cglib 可以直接使用字节码增强的技术，同样实现动态代理。下面我们也来回顾一下。

#### 4.1 引入Cglib

要使用 Cglib ，必须先引入 Cglib 的 jar 包：

```xml
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.1</version>
</dependency>
```

使用 Cglib 时有几个小小的前提：**被代理的类不能是 final 的**（ Cglib 动态代理会创建子类，final 类型的 Class 无法继承），**被代理的类必须有默认的 / 无参构造方法**（底层反射创建对象时拿不到构造方法参数）。

#### 4.2 改造代码

首先，给原来的 `Partner` 添加一个无参构造方法：

```java
public Partner() {
}
```

然后，修改 `PartnerPlatform` 获取 `Partner` 的方式：

```java
public static Partner getPartner(int money) {
    Partner partner = partners.remove(0);
    // 使用Cglib的Enhancer创建代理对象
    return (Partner) Enhancer.create(partner.getClass(), new MethodInterceptor() {
        private int budget = money;
        private boolean status = false;
        
        @Override
        public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy)
                throws Throwable {
            // 如果在付钱时没给够，则标记budget为异常值
            if (method.getName().equals("receiveMoney")) {
                int money = (int) args[0];
                this.status = money >= budget;
            }
            if (status) {
                return method.invoke(partner, args);
            }
            return null;
        }
    });
}
```

之后，在 `Client` 中修改获取代理的方式：

```java
public class Client {
    
    public static void main(String[] args) throws Exception {
        Player player = new Player("郝武辽");
        // 此处的Partner是a_basic包下的，不是接口 是类
        Partner partner = PartnerPlatform.getPartner(50);
        
        partner.receiveMoney(20);
        partner.playWith(player);
        
        partner.receiveMoney(200);
        partner.playWith(player);
    }
}
```

运行 `main` 方法，控制台只会打印拿到 200 之后的玩耍，证明已经成功构造了代理。

```java
肖洁洁收到佣金：200元 ~ 
肖洁洁与郝武辽一起愉快地玩耍 ~ 
```

#### 4.3 Cglib动态代理的核心API

同 jdk 动态代理相似，Cglib 动态代理的内容相对较少，它只需要传入两个东西：

- Class type ：被代理的对象所属类的类型
- Callback callback ：增强的代码实现

由于一般情况下我们都是对类中的方法增强，所以在传入 `Callback` 时通常选择这个接口的子接口 `MethodInterceptor` （所以也就有了上面代码中 new 的 `MethodInterceptor` 的匿名内部类）。

`MethodInterceptor` 的 `intercept` 方法中参数列表与 `InvocationHandler` 的 `invoke` 方法类似，唯独多了一个 `MethodProxy` ，它是对参数列表中的 `Method` 又做了一层封装，利用它可以直接执行被代理对象的方法，就像这样：

```java
// 执行代理对象的方法
method.invoke(proxy, args);

// 执行原始对象(被代理对象)的方法
methodProxy.invokeSuper(proxy, args);
```

