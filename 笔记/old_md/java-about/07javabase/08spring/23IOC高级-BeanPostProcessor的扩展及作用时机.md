---
title: 23IOC高级-BeanPostProcessor的扩展及作用时机
---

上一章，咱对 `BeanPostProcessor` 有一个大体的认识，也做了几个练习和探究。这一章我们来研究 `BeanPostProcessor` 的扩展，内容难度会更高，

借助 IDEA ，发现 `BeanPostProcessor` 有如下的接口扩展：

![image-20220504203634187](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220504203634.png)

## 1. InstantiationAwareBeanPostProcessor【熟悉】

从类名上看，它与**实例化**有关系，而且它又带着一个 **aware** ，难道是在暗示我们又跟回调注入什么的相关吗？还是先看下文档注释吧。

### 1.1 javadoc理解

> Subinterface of BeanPostProcessor that adds a before-instantiation callback, and a callback after instantiation but before explicit properties are set or autowiring occurs. Typically used to suppress default instantiation for specific target beans, for example to create proxies with special TargetSources (pooling targets, lazily initializing targets, etc), or to implement additional injection strategies such as field injection. NOTE: This interface is a special purpose interface, mainly for internal use within the framework. It is recommended to implement the plain BeanPostProcessor interface as far as possible, or to derive from InstantiationAwareBeanPostProcessorAdapter in order to be shielded from extensions to this interface.
>
> `BeanPostProcessor` 的子接口，它添加了实例化之前的回调，以及在实例化之后但在设置显式属性或自动装配发生之前的回调。 通常用于抑制特定目标 bean 的默认实例化，例如创建具有特殊 `TargetSource` 的代理（池目标，延迟初始化目标等），或实现其他注入策略，例如字段注入。 注意：此接口是专用接口，主要供框架内部使用。建议尽可能实现普通的 `BeanPostProcessor` 接口，或从 `InstantiationAwareBeanPostProcessorAdapter` 派生，以免对该接口进行扩展。

文档注释已经写得很明白了，它的作用有两个：

- 拦截并替换 Bean 的默认实例化动作
- 拦截 Bean 的属性注入和自动装配，并在此之前扩展

所以，我们是不是可以先试着猜想一波，它对 bean 的生命周期的干预应该是在这两个时机：

![image-20220504203754843](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220504203754.png)

是不是真的这样，咱来看看 `InstantiationAwareBeanPostProcessor` 中定义了什么方法，从中获取信息来检验猜想是否正确。

### 1.2 接口方法定义

`InstantialtionAwareBeanPostProcessor` 中定义了 4 个方法（ 5.1 之前是 3 个）：

```java
default Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName) throws BeansException {
    return null;
}

default boolean postProcessAfterInstantiation(Object bean, String beanName) throws BeansException {
    return true;
}

default PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName)
        throws BeansException {
    return null;
}

// 已过时，被上面的方法代替
@Deprecated
default PropertyValues postProcessPropertyValues(
        PropertyValues pvs, PropertyDescriptor[] pds, Object bean, String beanName) throws BeansException {
    return pvs;
}
```

分别看这三个方法，它们的作用分别是：

- postProcessBeforeInstantiation ：在 bean 的实例化之前处理
  - 非常容易理解，它可以拦截 bean 原本的实例化方法，转为用这里的实例化
- postProcessAfterInstantiation ：在 bean 的实例化之后处理
  - 这个方法比较奇怪，返回值是 boolean ，它有代表什么意思吗？
  - 其实，它与下面的 postProcessProperties 方法有关，如果返回 false ，则 postProcessProperties 方法不会执行
- postProcessProperties ：在设置属性时处理 ？？？（好像不大对劲）
  - 根据 javadoc 得知，这个方法是在属性赋值之前触发的，而 PropertyValues 又是一组 field - value 的键值对
  - 由此可以断定，postProcessProperties 方法最终会返回一组属性和值的 PropertyValues ，让它参与 bean 的属性赋值环节

看来与上面一开始的猜想大差不离，那加入 `InstantiationAwareBeanPostProcessor` 后的 bean 的生命周期就是这样子咯：

![image-20220504204012387](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220504204012.png)

### 1.3 InstantiationAwareBeanPostProcessor拦截bean创建

先来试一下第一个 `postProcessBeforeInstantiation` 方法吧，既然它能直接拦截 bean 的创建，那正常的 bean 里头的东西，或许被它一拦截，就没了吧。

#### 1.3.1 声明bean

这次我们来玩个球，给球声明一个 id 的属性就够了：（不要忘记写 `toString` 方法，方便打印查看）

```java
public class Ball {
    
    private String id;
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    @Override
    public String toString() {
        return "Ball{" + "id='" + id + '\'' + '}';
    }
}
```

#### 1.3.2 编写后置处理器

既然是拦截创建，那我就希望，能在后置处理器中单独创建一个球，不要配置声明的。于是后置处理器就可以这样编写：

```java
public class BallFactoryInstantiationProcessor implements InstantiationAwareBeanPostProcessor {
    
    @Override
    public Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName) throws BeansException {
        if ("ball".equals(beanName)) {
            // 返回非null，代表拦截创建
            Ball ball = new Ball();
            ball.setId("工厂球~");
            return ball;
        }
        // 默认直接返回null，代表不拦截
        return null;
    }
}
```

这里我在 `postProcessBeforeInstantiation` 中显式的 new 了一个球，这样回头如果真的走了这个分支，那将返回后置处理器创建的球。

#### 1.3.3 编写xml配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="ball" class="org.clxmm.postprocessor.e_instantiation.bean.Ball">
        <property name="id" value="123456"/>
    </bean>



    <bean class="org.clxmm.postprocessor.e_instantiation.config.BallFactoryInstantiationProcessor"/>

</beans>
```

#### 1.3.4 测试运行

好了，可以编写测试类来检验效果了，使用 xml 配置文件来驱动 IOC 容器：

```java
public class InstantiationAwareApplication {
    
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext(
                "postprocessor/processor-instantiation.xml");
        Ball ball = (Ball) ctx.getBean("ball");
        System.out.println(ball);
    }
}
```

运行 `main` 方法，控制台打印的是 “工厂球” ，证明 `BallFactoryInstantiationProcessor` 已经成功拦截了 xml 配置文件中声明的 `Ball` 的创建，转而使用后置处理器的逻辑创建了。

```
Ball{id='工厂球~'}

```

### 1.4 InstantiationAwareBeanPostProcessor给bean做属性赋值

继续顺延上面的 Demo ，我们来试试如果不给 bean 的属性赋值，交由 `InstantiationAwareBeanPostProcessor` 来做，它真的能做到吗？

#### 1.4.1 扩展xml配置文件

再声明一个 `Ball` ，这次只创建对象，不给 id 赋值：

```xml
    <bean id="ball2" class="org.clxmm.postprocessor.e_instantiation.bean.Ball"/>

```

#### 1.4.2 扩展BallFactoryInstantiationProcessor

这次要做属性赋值了，对应的接口方法是 `postProcessProperties` ，我们来重写它：

```java
    @Override
    public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName)
            throws BeansException {
        if ("ball2".equals(beanName)) {
            MutablePropertyValues values = new MutablePropertyValues(pvs);
            values.addPropertyValue("id", "拦截球~");
            return values;
        }
        return null;
    }
```

> 由于 `PropertyValues` 设计为接口且只暴露可读方法，此处选用实现类重新包装并添加 id 属性（强转也可以，但此种写法更稳妥）

#### 1.4.3 测试运行

修改测试代码，添加 ball2 的获取，并打印出来：

```java
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext(
                "postprocessor/processor-instantiation.xml");
        Ball ball = (Ball) ctx.getBean("ball");
        System.out.println(ball);
        
        Ball ball2 = (Ball) ctx.getBean("ball2");
        System.out.println(ball2);
    }
```

重新运行 `main` 方法，控制台打印出了 “拦截球” ，证明 `postProcessProperties` 方法的确能给 bean 注入属性。

```
Ball{id='工厂球~'}
Ball{id='拦截球~'}
```

#### 1.4.4 postProcessProperties不会影响postProcessBeforeInstantiation

突然意识到一个伏笔是吧，前面编写后置处理器的时候，一直都是拿 bean 的 name 做匹配。如果在 `postProcessBeforeInstantiation` 方法中，我们把判断条件改为所有 Ball 都拦截，那效果会怎么样呢？

```java
 @Override
    public Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName) throws BeansException {
        if (Ball.class.equals(beanClass)) {
            Ball ball = new Ball();
            ball.setId("工厂球~");
            return ball;
        }
        return null;
    }
```

修改为上述代码后，重新运行 `main` 方法，控制台打印了两个工厂球：

```
Ball{id='工厂球~'}
Ball{id='工厂球~'}
```

说明 `postProcessBeforeInstantiation` 方法执行完毕后，并不会再执行 `postProcessProperties` （换句话说，`postProcessProperties` 方法没有机会能再影响 `postProcessBeforeInstantiation` 方法创建出来的对象）

### 1.5 postProcessAfterInstantiation的作用

上面的分析中我们也说了，`postProcessAfterInstantiation` 方法如果返回 false ，则 `postProcessProperties` 方法就不会执行，下面简单验证一下。

在 `BallFactoryInstantiationProcessor` 中加入 `postProcessAfterInstantiation` 方法的重写：

```java
@Override
public boolean postProcessAfterInstantiation(Object bean, String beanName) throws BeansException {
    return false;
}

```

重新运行 `main` 方法，发现 ball2 已经没有 id 了：

```
Ball{id='工厂球~'}
Ball{id='null'}
```

## 2. SmartInstantiationAwareBeanPostProcessor【了解】

相较于 `InstantiationAwareBeanPostProcessor` 只多了一个 **smart** ，意思是它更聪明咯？还真是，这个接口扩展了 3 个额外的方法，而且每个方法还都挺有用的，我们可以来简单的看看

```java
default Class<?> predictBeanType(Class<?> beanClass, String beanName) throws BeansException {
    return null;
}

default Constructor<?>[] determineCandidateConstructors(Class<?> beanClass, String beanName) throws BeansException {
    return null;
}

default Object getEarlyBeanReference(Object bean, String beanName) throws BeansException {
    return bean;
}
```

- predictBeanType ：预测 bean 的类型（不能预测时返回 null ）
- determineCandidateConstructors ：根据 bean 对应 Class 中的构造器定义，决定使用哪个构造器进行对象实例化
  - 这个方法很重要，如果 bean 没有声明任何构造器，则此处会拿到默认的无参构造器；如果声明了多个构造器，则该处会根据 IOC 容器中的 bean 和指定的策略，选择最适合的构造器
- getEarlyBeanReference ：提早暴露出 bean 的对象引用

看着这么高大上，但是讲真，这个接口在现阶段不是很好演示，而且它本身属于 SpringFramework 内部的接口，通常我们根本用不到，所以这个小伙伴们知道下就可以了，不要在这上面耗费太多的时间和精力。

到后面 IOC 原理中，bean 的完整生命周期会涉及 `SmartInstantiationAwareBeanPostProcessor` 的

## 3. DestructionAwareBeanPostProcessor【了解】

顾名思义，它可以在 bean 的**销毁**前拦截处理。这个接口的方法定义也很简单：

```java
void postProcessBeforeDestruction(Object bean, String beanName) throws BeansException;

default boolean requiresDestruction(Object bean) {
    return true;
}
```

很明显它就是一个回调的处理而已，没什么花里胡哨的。

### 3.1 DestructionAwareBeanPostProcessor的使用

#### 3.1.1 声明Bean

```java
@Data
@Component
public class Pen implements DisposableBean {

    private Integer ink = 100;

    @PreDestroy
    public void outwellInk() {
        System.out.println("Pen @PreDestroy 钢笔中的墨水都放干净了。。。");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("Pen DisposableBean 写完字了。。。");
    }

}
```

#### 3.1.2 编写后置处理器

既然是在 bean 的销毁阶段回调，那我们可以在这里针对 Pen 给它放干墨水（模拟操作）：

```java
@Component
public class DestructionPenPostProcessor implements DestructionAwareBeanPostProcessor {
    @Override
    public void postProcessBeforeDestruction(Object bean, String beanName) throws BeansException {
        if (bean instanceof Pen) {
            System.out.println("DestructionPenPostProcessor postProcessBeforeDestruction run ......");
            Pen pen = (Pen) bean;
            pen.setInk(0);
        }
    }
}
```

#### 3.1.3 测试运行

编写测试代码，直接包扫描，驱动 IOC 容器。驱动完成后啥也不用干，直接销毁 IOC 容器就可以：

```java
public class DestructionPostProcessorApplication {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                "org.clxmm.postprocessor.f_destruction");
        ctx.close();
    }
}
```

运行 `main` 方法，控制台打印如下信息：

```
DestructionPenPostProcessor postProcessBeforeDestruction run ......
Pen @PreDestroy 钢笔中的墨水都放干净了。。。
Pen DisposableBean 写完字了。。。
```

### 3.2 Spring中的DestructionAwareBeanPostProcessor

关于这个接口的使用，在 SpringFramework 中有个蛮经典的：**监听器的引用释放回调**。由于 `ApplicationContext` 中会注册一些 `ApplicationListener` ，而这些 `ApplicationListener` 与 `ApplicationContext` **互相引用**，所以在 IOC 容器销毁之前，就需要将这些引用断开，这样才可以进行对象的销毁和回收。

## 4. MergedBeanDefinitionPostProcessor【了解】

咱有学习 `BeanDefinition` 的合并，这个 `BeanDefinition` 合并的过程，在后置处理器中也有对应的拦截处理。

### 4.1 回顾BeanDefinition的合并

回想一下，`BeanDefinition` 合并的意义是啥来着？是为了将父 bean 继承或者已经定义好的注入属性一块拿过来，这样就不用子 bean 再定义一次了吧！这种合并是一种情况，不过还有一种情况，它发生在基于注解的类继承上：

```java
public abstract class Animal {

    @Autowired
    private Person person;
}

public class Cat extends Animal {
    
    private String name;
}
```

这种情况下，向 IOC 容器注册 `Cat` 时，Spring 在底层也会把 person 需要注入的定义信息合并进去，并标注它需要自动注入处理。

### 4.2 接口方法定义

再来看 `MergedBeanDefinitionPostProcessor` 的接口，它只定义了一个方法：

```java
void postProcessMergedBeanDefinition(RootBeanDefinition beanDefinition, Class<?> beanType, String beanName);

```

（ 5.1 后又定义了一个 `resetBeanDefinition` 方法，仅用于清除 `BeanFactory` 内部缓存，此处不对此展开）

这个方法的 javadoc 出奇的少，甚至都没给什么有用的信息，那这咋研究呢？得了，我们写个 Demo 测一下吧。

### 4.3 MergedBeanDefinitionPostProcessor的使用

为了还原出 `BeanDefinition` 的合并，这里把上面举的例拿过来测试用吧。

#### 4.3.1 声明bean

声明的 bean 就是上面的一个 `Animal` ，一个 `Cat` ，当然还得有 `Person` ：

```java
public abstract class Animal {
    
    @Autowired
    private Person person;
    
    public Person getPerson() {
        return person;
    }
    
    public void setPerson(Person person) {
        this.person = person;
    }
}
```

```java
@Component
public class Cat extends Animal {
    
    @Value("咪咪")
    private String name;
    
    @Override
    public String toString() {
        return "Cat {person: " + this.getPerson() + ", name: " + name + "}";
    }
}
```

```java
@Component
public class Person {
    
}
```

#### 4.3.2 编写后置处理器

后置处理器里面不用写什么花里胡哨的结构，先拦截一下就好：

```java
@Component
public class MergeDefinitionPostProcessor implements MergedBeanDefinitionPostProcessor {
    
    @Override
    public void postProcessMergedBeanDefinition(RootBeanDefinition beanDefinition, Class<?> beanType, String beanName) {
        if (Cat.class.equals(beanType)) {
            System.out.println("MergeDefinitionPostProcessor postProcessMergedBeanDefinition run......");
            System.out.println(beanDefinition);
        }
    }
}
```

> 此处稍微停一下，思考一下此处 `postProcessMergedBeanDefinition` 的参数列表中为什么只有 beanDefinition 和 beanType ？难道 bean 还没有创建吗？

#### 4.3.3 测试运行

测试的代码也很简单，还是直接使用注解 IOC 容器扫描包即可：

```java
public class MergeDefinitionPostProcessorApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                "com.linkedbear.spring.postprocessor.g_mergedefinition");
        ctx.close();
    }
}
```

运行 `main` 方法，控制台有打印 `Cat` 的 `BeanDefinition` 信息，说明确实拦截到 Cat 的定义信息合并了。

可是上面的问题呢？此时 bean 被创建了吗？

#### 4.3.4 给Cat添加无参构造器

重写 Cat 的无参构造器，让它在控制台打印一句话：

```java
@Component
public class Cat extends Animal {
    
    public Cat() {
        System.out.println("Cat constructor run ......");
    }
}
```

重新运行 `main` 方法，发现是先创建的 `Cat` 后打印的后置处理器执行：

```
Cat constructor run ......
MergeDefinitionPostProcessor postProcessMergedBeanDefinition run......
```

这个设计是为什么呢？既然创建出了 bean ，为什么后置处理器的回调中没有把 bean 传给我们呢？

#### 4.3.5 调整Animal的自动注入位置

问题思考不出来没关系，我们来调整一点代码，让 `Animal` 中的 `person` 使用 setter 的自动注入，并在控制台打印一句话：

```java
    @Autowired
    public void setPerson(Person person) {
        System.out.println("Animal setPerson run ......");
        this.person = person;
    }
```

再次运行 `main` 方法，发现 setter 方法的自动注入在最后才打印：

```java
Cat constructor run ......
MergeDefinitionPostProcessor postProcessMergedBeanDefinition run......
Animal setPerson run ......
```

由此可以得出结论了吧：`postProcessMergedBeanDefinition` 方法发生在 **bean 的实例化之后，自动注入之前**。而这个设计，就是为了**在属性赋值和自动注入之前，把要注入的属性都收集好**，这样才能顺利的向下执行注入的逻辑。

而实例化好的 bean 没有传入接口中的原因，其实也很好解释：**人家是合并 `BeanDefinition` 的，跟 bean 的实例有什么关系呢**（**最少知道原则**）？

### 4.4 Spring中的MergeDefinitionPostProcessor

在 SpringFramework 中，一个非常重要的 `MergeDefinitionPostProcessor` 的实现，就是 `AutowiredAnnotationBeanPostProcessor` ，它负责给 bean 实现注解的自动注入，而注入的依据就是 `postProcessMergedBeanDefinition` 后整理的标记（这个标记会在 IOC 原理的 bean 完整生命周期中提及）。

> 当然，通常 `MergedBeanDefinitionPostProcessor` 这个后置处理器也不会在开发中使用，仅仅用于 SpringFramework 的内部，小伙伴们知道下就好，不要在这上面耗费太长时间和精力。



