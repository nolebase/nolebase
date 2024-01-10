---
title: 22IOC高级-后置处理器入门与使用
---

## 1. 后置处理器概述【理解】

### 1.1 官方文档

官方文档的 `1.8 Container Extension Points (容器扩展点)` 章节中，专门拿出了一个小节讲解 `BeanPostProcessor` 的使用。由于这段内容比较长，小册将其拆解开解释。

[https://docs.spring.io/spring/docs/5.2.x/spring-framework-reference/core.html#beans-factory-extension-bpp](https://docs.spring.io/spring/docs/5.2.x/spring-framework-reference/core.html#beans-factory-extension-bpp)

#### 1.1.1 BeanPostProcessor是一个容器扩展点

> The BeanPostProcessor interface defines callback methods that you can implement to provide your own (or override the container’s default) instantiation logic, dependency resolution logic, and so forth. If you want to implement some custom logic after the Spring container finishes instantiating, configuring, and initializing a bean, you can plug in one or more custom BeanPostProcessor implementations.
>
> `BeanPostProcessor` 接口定义了回调方法，您可以实现这些回调方法以提供自己的（或覆盖容器默认的）实例化逻辑、依赖处理 / 解析逻辑等。如果您想在 IOC 容器完成实例化、配置、初始化 bean 之后实现一些自定义逻辑，则可以注册一个或多个自定义的 `BeanPostProcessor` 实现。

这段话已经解释的非常清楚了，`BeanPostProcessor` 是一个回调机制的扩展点，它的核心工作点是在 **bean 的初始化前后**做一些额外的处理（预初始化 bean 的属性值、注入特定的依赖，甚至扩展生成代理对象等）。

#### 1.1.2 BeanPostProcessor的执行可以指定先后顺序

> You can configure multiple BeanPostProcessor instances, and you can control the order in which these BeanPostProcessor instances run by setting the order property. You can set this property only if the BeanPostProcessor implements the Ordered interface. If you write your own BeanPostProcessor, you should consider implementing the Ordered interface, too.
>
> 您可以配置多个 `BeanPostProcessor` 实例，并且可以通过设置 order 属性来控制这些 `BeanPostProcessor` 实例的运行顺序。仅当 `BeanPostProcessor` 实现 `Ordered` 接口时，才可以设置此属性。如果您编写自己的 `BeanPostProcessor` ，则也应该考虑实现 `Ordered` 接口。

与监听器一样，后置处理器也可以指定多个，并且可以通过实现 `Ordered` 接口，指定后置处理器工作的先后顺序。这看上去似乎不是特别有必要，小册举一个比较简单的例子：

如果有两个后置处理器，分别处理 IOC 容器中的 Service 层实现类，一个负责注入 Dao 层的接口，一个负责统一控制事务，那这个时候就需要先让注入 Dao 接口的后置处理器先工作，让控制事务的后置处理器往后稍稍。

> 多提一嘴，控制事务的底层原理是使用了 **AOP** ，生成了**代理对象**，后面 AOP 篇和 Dao 编程篇会讲解事务控制及其原理。

#### 1.1.3 BeanPostProcessor在IOC容器间互不影响

> BeanPostProcessor instances operate on bean (or object) instances. That is, the Spring IoC container instantiates a bean instance and then BeanPostProcessor instances do their work. BeanPostProcessor instances are scoped per-container. This is relevant only if you use container hierarchies. If you define a BeanPostProcessor in one container, it post-processes only the beans in that container. In other words, beans that are defined in one container are not post-processed by a BeanPostProcessor defined in another container, even if both containers are part of the same hierarchy. To change the actual bean definition (that is, the blueprint that defines the bean), you instead need to use a BeanFactoryPostProcessor, as described in Customizing Configuration Metadata with a BeanFactoryPostProcessor.
>
> `BeanPostProcessor` 在 bean（或对象）实例上运行。也就是说，Spring 的 IOC 容器会实例化出一个 bean 的对象实例，然后 `BeanPostProcessor` 完成它的工作。 `BeanPostProcessor` 是按容器划分作用域的（仅在使用容器层次结构时，这种设定才有意义）。如果在一个容器中定义 `BeanPostProcessor` ，它将仅对该容器中的 bean 进行后置处理。换句话说，一个容器中定义的 bean 不会由另一个容器中定义的 `BeanPostProcessor` 进行后处理，即使这两个容器是同一层次结构的一部分。 要更改实际的 `BeanDefinition` 信息，您需要使用 `BeanFactoryPostProcessor` ，如使用 `BeanFactoryPostProcessor` 自定义配置元数据中的信息。

从这一长串文档中，提取出几个关键信息：**`BeanPostProcessor` 作用于 bean 对象的创建后**；**不同 IOC 容器中的 `BeanPostProcessor` 不会互相起作用**。这些特性，在下面的演示中都会有体现，小伙伴们无需着急。

另外，最后一句话它提到了，如果要处理 `BeanDefinition` ，要使用 `BeanFactoryPostProcessor` ，这也是上一章我们用的那个陌生的 API 了，它的使用，小册放到下一章来讲解，本章只讲解 `BeanPostProcessor` 的使用。

### 1.2 javadoc

翻看 `BeanPostProcessor` 的 javadoc ，发现它的篇幅也很长，小册只摘取总体描述的部分来阅读。

> Factory hook that allows for custom modification of new bean instances — for example, checking for marker interfaces or wrapping beans with proxies. Typically, post-processors that populate beans via marker interfaces or the like will implement postProcessBeforeInitialization, while post-processors that wrap beans with proxies will normally implement postProcessAfterInitialization.
>
> `BeanPostProcessor` 是一种工厂的回调钩子，它允许对 bean 实例进行自定义修改（例如检查 bean 实现的标记接口，或使用代理包装 bean ）。 通常，通过标记接口等填充 bean 的后置处理器将实现 `postProcessBeforeInitialization` 方法，而使用代理包装 bean 的后置处理器通常将实现 `postProcessAfterInitialization` 方法。

javadoc 更倾向于教我们怎么用，它也说了，`BeanPostProcessor` 提供了两个回调时机：**bean 的初始化之前**和 **bean 的初始化之后**，它们分别适合做**填充**和**代理**的工作。下面咱结合 `BeanPostProcessor` 的接口设计来看看。

### 1.3 BeanPostProcessor的设计

`BeanPostProcessor` 是一个接口，它只定义了两个方法，也就是上面 javadoc 中提到的两个方法：

```java
public interface BeanPostProcessor {
    
    default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }

    default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }
}
```

> SpringFramework 5.x 之前由于最低支持 Java6 ，此处并没有默认的方法实现。

这两个方法的文档注释也写的非常完善：`postProcessBeforeInitialization` 方法会在任何 bean 的初始化回调（例如 `InitializingBean` 的 `afterPropertiesSet` 或自定义 `init-method` ）之前执行，而 `postProcessAfterInitialization` 方法会在任何 bean 的初始化回调（例如 `InitializingBean` 的 `afterPropertiesSet` 或自定义 `init-method` ）之后。

此外，对于 `postProcessAfterInitialization` 方法，还可以对那些 `FactoryBean` 创建出来的真实对象进行后置处理，这个我们下面也会有演示。

### 1.4 【面试题】面试中如何概述BeanPostProcessor

**`BeanPostProcessor` 是一个容器的扩展点，它可以在 bean 的生命周期过程中，初始化阶段前后添加自定义处理逻辑，并且不同 IOC 容器间的 `BeanPostProcessor` 不会相互干预。**

## 2. BeanPostProcessor的使用【掌握】

### 2.1 快速体会使用

最初的案例不需要太花里胡哨的 bean ，就简单整两个吧：

```java
@Component
public class Cat {
    
}

@Component
public class Dog {
    
}
```

#### 2.1.2 编写后置处理器

声明一个 `AnimalBeanPostProcessor` ，让它实现 `BeanPostProcessor` ，然后啥也不干，只打印语句就好：

```java
@Component
public class AnimalBeanPostProcessor implements BeanPostProcessor {
    
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("拦截到Bean的初始化之前：" + beanName);
        return bean;
    }
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("拦截到Bean的初始化之后：" + beanName);
        return bean;
    }
}
```

这里注意一个非常重要的设计：它的入参有一个 **bean** ，类型是 **`Object`** ，返回值也是 **`Object`** ，似乎有暗示返回的 bean 可以任意替换的意思了，是不是这样呢，我们过会可以试一试。

#### 2.1.3 测试运行

使用注解驱动 IOC 容器，直接扫描包即可。由于我们只是测试后置处理器的功能，所以在初始化 IOC 容器后不需要做任何操作，那就顺手关掉吧：

```java
public class BeanPostProcessorQuickstartApplication {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = 
                new AnnotationConfigApplicationContext("org.clxmm.postprocessor.a_quickstart");
        context.close();
    }
}
```

运行 `main` 方法，控制台的打印也说明，cat 和 dog 的初始化被 `AnimalBeanPostProcessor` 监测到了。

```
拦截到Bean的初始化之前：cat
拦截到Bean的初始化之后：cat
拦截到Bean的初始化之前：dog
拦截到Bean的初始化之后：dog
```

#### 2.1.4 修改后置处理器的返回值为任意

既然 `BeanPostProcessor` 的两个后置处理方法都可以返回任意 `Object` ，那我们就搞几个特殊的情况试一试。

##### 2.1.4.1 返回null

修改 `AnimalBeanPostProcessor` 的 `postProcessBeforeInitialization` 方法，让返回值改为 null ，并在 `postProcessAfterInitialization` 中打印 bean 的引用：

```java
@Override
public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
    System.out.println("拦截到Bean的初始化之前：" + bean);
    return null;
}

@Override
public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
    System.out.println("拦截到Bean的初始化之后：" + bean);
    return bean;
}
```

重新运行 `main` 方法，发现 `postProcessAfterInitialization` 中并没有打印 null ，而是打印了与 `postProcessBeforeInitialization` 方法中一样的对象：

```
拦截到Bean的初始化之前：org.clxmm.postprocessor.a_quickstart.bean.Cat@5bb21b69
拦截到Bean的初始化之后：org.clxmm.postprocessor.a_quickstart.bean.Cat@5bb21b69
拦截到Bean的初始化之前：org.clxmm.postprocessor.a_quickstart.bean.Dog@6b9651f3
拦截到Bean的初始化之后：org.clxmm.postprocessor.a_quickstart.bean.Dog@6b9651f3

```

为什么会是这样呢？我都返回了 null 了，你咋又给我找回来了呢？

这里面的原理，可以向上追溯一层方法调用。借助 IDEA ，发现 SpringFramework 调用 `BeanPostProcessor` 的 `postProcessBeforeInitialization` 方法，是在 `AbstractAutowireCapableBeanFactory` 中的，这里面有一个兜底保护：

```java
@Override
public Object applyBeanPostProcessorsBeforeInitialization(Object existingBean, String beanName)
        throws BeansException {

    Object result = existingBean;
    for (BeanPostProcessor processor : getBeanPostProcessors()) {
        Object current = processor.postProcessBeforeInitialization(result, beanName);
        // 兜底保护
        if (current == null) {
            return result;
        }
        result = current;
    }
    return result;
}
```

可见框架都帮我们做好了，如果真的返回了 null ，那框架就会认为：**你这是一个误操作，我当你没发生过**，于是就把原来的 bean 又找回来了。

##### 2.1.4.2 返回其它类型的对象

```java
@Override
public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
    System.out.println("拦截到Bean的初始化之前：" + bean);
    if (bean instanceof Cat) {
        return new Dog();
    }
    return bean;
}

```

重新运行 `main` 方法，发现 `Cat` 真的变成了 `Dog` ！

```
拦截到Bean的初始化之前：org.clxmm.postprocessor.a_quickstart.bean.Cat@5bb21b69
拦截到Bean的初始化之后：org.clxmm.postprocessor.a_quickstart.bean.Dog@6b9651f3
拦截到Bean的初始化之前：org.clxmm.postprocessor.a_quickstart.bean.Dog@38bc8ab5
拦截到Bean的初始化之后：org.clxmm.postprocessor.a_quickstart.bean.Dog@38bc8ab5
```

所以由这个设计，是不是有一点慌呢？万一真返回错了类型，那岂不是出大问题？

但是话又说回来，谁会搞这种操作呢。。。所以这个担心是多余的，如果真的要限制住 `BeanPostProcessor` 的类型控制，我们可以在后面尝试搞一个简单的扩展，小伙伴可以到时候一起写一写，体会一下简单的框架再封装。

### 2.2 修改bean的属性

既然能拿到 bean 的本体了，那获取 、修改属性这种操作也就很简单啦，咱们也来简单的写一下。

```java
@Component
public class Cat {
    
    private String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    @Override
    public String toString() {
        return "Cat{" + "name='" + name + '\'' + '}';
    }
}
```

#### 2.2.2 编写后置处理器

这次我们在后置处理器中添加对属性的操作，可以在后置处理之前修改一下属性，看修改之后是否生效：

```java
@Component
public class CatBeanPostProcessor implements BeanPostProcessor {
    
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof Cat) {
            Cat cat = (Cat) bean;
            System.out.println("初始化之前，cat的name为：" + cat.getName());
            cat.setName("zhangsan");
        }
        return bean;
    }
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof Cat) {
            Cat cat = (Cat) bean;
            System.out.println("初始化之后，cat的name为：" + cat.getName());
        }
        return bean;
    }
}
```

#### 2.2.3 测试运行

测试运行类的写法与上面完全一致，不多解释啦：

```java
public class PostProcessorGetPropertyApplication {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext context =
                new AnnotationConfigApplicationContext("org.clxmm.postprocessor.b_getproperty");
        context.close();

    }
}
```

运行 `main` 方法，控制台打印出修改前后的属性，说明后置处理器确实在 bean 的初始化阶段修改属性。

```
初始化之前，cat的name为：null
初始化之后，cat的name为：zhangsan
```

### 2.3 执行时机探究

既然文档和 javadoc 中说了，它分别在 bean 的初始化阶段前后执行，具体又是什么样呢？咱也来探究一下。

> 现有的知识中，我们知道的 bean 的生命周期应该是这样的：
>
> ![image-20220504200530161](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220504200530.png)

#### 2.3.1 声明bean

像之前研究 bean 的生命周期那样，搞一个三种初始化方法都带的 `Dog` 出来：

```java
ublic class Dog implements InitializingBean {
    
    public void initMethod() {
        System.out.println("initMethod ...");
    }
    
    @PostConstruct
    public void postConstruct() {
        System.out.println("PostConstruct ...");
    }
    
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("InitializingBean ...");
    }
}
```

#### 2.3.2 编写后置处理器

后置处理器里就不搞花里胡哨了，只打印一下执行时机就好：

```java
public class ExecuteTimeBeanPostProcessor implements BeanPostProcessor {
    
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof Dog) {
            System.out.println("postProcessBeforeInitialization ...");
        }
        return bean;
    }
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof Dog) {
            System.out.println("postProcessAfterInitialization ...");
        }
        return bean;
    }
}
```

#### 2.3.3 编写xml配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <bean id="dog" class="org.clxmm.postprocessor.c_executetime.bean.Dog" init-method="initMethod"/>

    <bean class="org.clxmm.postprocessor.c_executetime.config.ExecuteTimeBeanPostProcessor"/>

    <!-- 记得开注解配置，否则@PostConstruct不生效 -->
    <context:annotation-config/>
</beans>
```

#### 2.3.4 测试运行

既然用了 xml 配置文件，那就不要再用注解驱动的 IOC 容器啦，要换用 `ClassPathXmlApplicationContext` 了：

```java
public class BeanPostProcessorExecuteTimeApplication {
    
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext(
                "postprocessor/processor-executetime.xml");
        ctx.close();
    }
}
```

```
postProcessBeforeInitialization ...
PostConstruct ...
InitializingBean ...afterPropertiesSet
initMethod ...
postProcessAfterInitialization ...
```

操作是一样的，初始化好就不用管了，直接关闭就好。

运行 `main` 方法，控制台打印如下信息：

```
postProcessBeforeInitialization ...
PostConstruct ...
InitializingBean ...afterPropertiesSet
initMethod ...
postProcessAfterInitialization ...
```

由此可以总结出 bean 的初始化阶段的全流程：**`BeanPostProcessor#postProcessBeforeInitialization` → `@PostConstruct` → `InitializingBean` → `init-method` → `BeanPostProcessor#postProcessAfterInitialization`**

也就是下图所示：

![image-20220504201404134](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220504201404.png)

### 2.4 FactoryBean的影响

对于那些 `FactoryBean` ，我们都是只拿它里面创建的真实对象，不要 `FactoryBean` 本身的，这种情况 `BeanPostProcessor` 能一起考虑进去吗？我们也来试一下。

#### 2.4.1 声明Bean+FactoryBean

这次我们搞一个比较符合场景的写法：母鸡下蛋，让 **Hen** 去生产 **Egg** 。

```java
public class Egg {
    
}

@Component
public class Hen implements FactoryBean<Egg> {
    
    @Override
    public Egg getObject() throws Exception {
        return new Egg();
    }
    
    @Override
    public Class<Egg> getObjectType() {
        return Egg.class;
    }
}
```

这样只把母鸡塞进 IOC 容器，我们就可以得到鸡蛋了。

#### 2.4.2 编写后置处理器

后置处理器里面不打算搞花里胡哨的操作了，只打印 bean 的初始化拦截触发就好啦：

```java
@Component
public class FactoryBeanPostProcessor implements BeanPostProcessor {
    
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("拦截到Bean的初始化之前：" + bean);
        return bean;
    }
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("拦截到Bean的初始化之后：" + bean);
        return bean;
    }
}
```

#### 2.4.3 测试运行

```java
public class FactoryBeanPostProcessorApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                "org.clxmm.postprocessor.d_factorybean");
        ctx.close();
    }
}
```

运行 `main` 方法，发现控制台只打印了 `Hen` 的拦截：

```
拦截到Bean的初始化之前：org.clxmm.postprocessor.d_factorybean.bean.Hen@1500955a
拦截到Bean的初始化之后：org.clxmm.postprocessor.d_factorybean.bean.Hen@1500955a
```

咦？为什么没有 Egg 的初始化触发呢？（短暂的思考一下~）

**`FactoryBean` 的生命周期与 IOC 容器一致，而 `FactoryBean` 生产 bean 的时机是延迟创建的**。

#### 2.4.4 修改测试

```java
public class FactoryBeanPostProcessorApplication {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext context =
                new AnnotationConfigApplicationContext("org.clxmm.postprocessor.d_factorybean");

        System.out.println("---");
        Egg egg = context.getBean(Egg.class);
        System.out.println(egg);
        context.close();
    }
}
```

注意哦，这里**只打印了初始化之后，并没有初始化之前**的动作，这也就回应了上面 `BeanPostProcessor` 的 javadoc 内容。

```
拦截到Bean的初始化之前：org.clxmm.postprocessor.d_factorybean.bean.Hen@1500955a
拦截到Bean的初始化之后：org.clxmm.postprocessor.d_factorybean.bean.Hen@1500955a
---
拦截到Bean的初始化之后：org.clxmm.postprocessor.d_factorybean.bean.Egg@43738a82
org.clxmm.postprocessor.d_factorybean.bean.Egg@43738a82
```

