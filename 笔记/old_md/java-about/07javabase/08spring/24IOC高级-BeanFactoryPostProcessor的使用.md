---
title: 24IOC高级-BeanFactoryPostProcessor的使用
---

前面两章，咱把 `BeanPostProcessor` 以及它的扩展都学习了一遍，这一章要学习的，是给 `BeanDefinition` 用的后置处理器了：`BeanFactoryPostProcessor` 。或许小伙伴会很懵逼：名是 `BeanFactoryPostProcessor` ，但是给 `BeanDefinition` 用的，是不是有搞错呢？不要方，跟着小册学习就完事啦！

## 1. BeanFactoryPostProcessor概述【理解】

老套路了，先看官方文档的描述吧。

### 1.1 官方文档

> The next extension point that we look at is the org.springframework.beans.factory.config.BeanFactoryPostProcessor. The semantics of this interface are similar to those of the BeanPostProcessor, with one major difference: BeanFactoryPostProcessor operates on the bean configuration metadata. That is, the Spring IoC container lets a BeanFactoryPostProcessor read the configuration metadata and potentially change it before the container instantiates any beans other than BeanFactoryPostProcessor instances.
>
> 该接口的语义与 `BeanPostProcessor` 的语义相似，但有一个主要区别：`BeanFactoryPostProcessor` 对 Bean 的配置元数据进行操作。也就是说，IOC 容器允许 `BeanFactoryPostProcessor` 读取配置元数据，并有可能在容器实例化除 `BeanFactoryPostProcessor` 实例以外的任何 bean 之前更改它。

果然，官方文档也说了，它操作的是 **Bean 的配置元信息**。而且这里面还有一个非常关键的点：**它可以在 bean 实例的初始化之前修改定义信息**，换句话说，它可以对原有的 `BeanDefinition` 进行修改。由于 SpringFramework 中设计的**所有 bean 在没有实例化之前都是以 `BeanDefinition` 的形式存在**，如果提前修改了 `BeanDefinition` ，那么在 bean 的实例化时，最终创建出的 bean 就会受到影响。这个设计，我们在下面会有演示，小伙伴们先记住 `BeanFactoryPostProcessor` 的这个功能就好。

### 1.2 javadoc

同样的，看看 javadoc 中怎么描述 `BeanFactoryPostProcessor` ：

> Allows for custom modification of an application context's bean definitions, adapting the bean property values of the context's underlying bean factory. Application contexts can auto-detect BeanFactoryPostProcessor beans in their bean definitions and apply them before any other beans get created. ... A BeanFactoryPostProcessor may interact with and modify bean definitions, but never bean instances. Doing so may cause premature bean instantiation, violating the container and causing unintended side-effects. If bean instance interaction is required, consider implementing BeanPostProcessor instead.
>
> 允许自定义修改 `ApplicationContext` 中的 `BeanDefinition` ，以适应上下文基础 `BeanFactory` 的 Bean 属性值。 `ApplicationContext` 可以在其 Bean 的定义信息中自动检测 `BeanFactoryPostProcessor` 的 Bean，并在创建任何其他 Bean 之前应用它们。 `BeanFactoryPostProcessor` 可以与 `BeanDefinition` 进行交互并进行修改，但不能与 bean 的实例进行交互。这样做可能会导致 bean 实例化过早，从而违反了容器的规矩并造成了意外的副作用。如果需要与 bean 实例交互，请考虑实现 `BeanPostProcessor` 。

`BeanFactoryPostProcessor` 本身也属于 `BeanFactory` 中的 bean ，但是由于它的特殊性，所以 `ApplicationContext` 可以检查、获取它们，并且将其应用到 `BeanFactory` 中。

`BeanFactoryPostProcessor` 的作用是在 `BeanDefinition` 已经注册到 `BeanFactory` 后，对 `BeanDefinition` 进行修改 / 配置。除此之外，`BeanFactoryPostProcessor` 与 `BeanPostProcessor` **没有任何关联**，一个是影响 `BeanDefinition` 的，一个是影响 bean 实例的。

`BeanFactoryPostProcessor` 中原则上不允许访问、创建任何 bean 实例（此时 IOC 容器还没初始化好，`BeanPostProcessor` 都没有准备好，会导致创建的 bean 实例产生残缺）。

用这样三段话，配合官方文档，基本上就可以把 `BeanFactoryPostProcessor` 的作用都解释到位了，小伙伴们如果还是觉得不好理解，也没有关系，马上下面就会通过实例来研究 `BeanFactoryPostProcessor` 的使用。

### 1.3 接口方法定义

`BeanFactoryPostProcessor` 中只定义了一个方法，就是对 `BeanFactory` 的后置处理：

```java
void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException;

```

> 注意看这里的设计，即便 `ConfigurableListableBeanFactory` 的最终实现类只有 `DefaultListableBeanFactory` ，这里的入参也是接口，可见**依赖倒转**的设计在 SpringFramework 中体现得淋漓尽致呀！



这个方法上的 javadoc 可谓是把 `BeanFactoryPostProcessor` 的作用时机和使用方法都说明白了：

> Modify the application context's internal bean factory after its standard initialization. All bean definitions will have been loaded, but no beans will have been instantiated yet. This allows for overriding or adding properties even to eager-initializing beans.
>
> 在标准初始化之后，修改 `ApplicationContext` 内部的 `BeanFactory` 。此时所有 `BeanDefinition` 都将被加载，但尚未实例化任何 bean 。在此可以给 bean 覆盖或添加属性，甚至可以用于初始化 bean 。

![image-20220505201254609](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220505201254.png)

### 1.4 【面试题】面试中如何概述BeanFactoryPostProcessor

**`BeanFactoryPostProcessor` 是容器的扩展点，它用于 IOC 容器的生命周期中，所有 `BeanDefinition` 都注册到 `BeanFactory` 后回调触发，用于访问 / 修改已经存在的 `BeanDefinition` 。与 `BeanPostProcessor` 相同，它们都是容器隔离的，不同容器中的 `BeanFactoryPostProcessor` 不会相互起作用。**

关键回答点：**改变 Bean 的定义信息**

## 2. BeanFactoryPostProcessor的使用【熟悉】

下面我们来实际使用一下 `BeanFactoryPostProcessor` ，来体会它对 `BeanDefinition` 的访问和修改。

先说下需求吧：构造几个 `Color` 的类对象，并在 bean 还没有创建之前，把 bean 的名称设置到 bean 的属性上。

### 2.1 声明bean

咱不搞那么复杂的模型，一个 `Color` 的抽象类加两个子类就好：（注意两个子类要标注 `@Component` 注解注册到 IOC 容器）

```java
public abstract class Color {

    protected String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

```java
@Component
public class Red extends Color {
    
    @Override
    public String toString() {
        return "Red{" + "name='" + name + '\'' + "}";
    }
}

@Component
public class Green extends Color {
    
    @Override
    public String toString() {
        return "Green{" + "name='" + name + '\'' + "}";
    }
}
```

### 2.2 编写后置处理器

先理一下思路：后置处理器中，既然拿到的参数是 `BeanFactory` ，那就可以取出里面的 `BeanDefinition` ，并给它们添加属性值了。

先把架子写出来，由于 `ConfigurableListableBeanFactory` 无法通过类型取出指定的 bean ，所以只能取出全部，挨个判断了：

```java
@Component
public class ColorNameSetterFactoryPostProcessor implements BeanFactoryPostProcessor {
    
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        Stream.of(beanFactory.getBeanDefinitionNames()).forEach(beanName -> {
            BeanDefinition beanDefinition = beanFactory.getBeanDefinition(beanName);
            
        });
    }
}
```

之后就是判断 `BeanDefinition` 内部生成 bean 的类型了，由于只能获取到 `beanClassName` ，没有办法取父类，所以只能借助反射来搞定了：

```java
public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    Stream.of(beanFactory.getBeanDefinitionNames()).forEach(beanName -> {
        BeanDefinition beanDefinition = beanFactory.getBeanDefinition(beanName);
        if (StringUtils.hasText(beanDefinition.getBeanClassName())) {
            if (Class.forName(beanDefinition.getBeanClassName()).getSuperclass().equals(Color.class)) {

            }
        }
    });
}
```

不过这样写，`Class.forName()` 方法会提示需要捕捉 `ClassNotFoundException` 。最简单的方法是在整个 foreach 外层套一个 `try-catch` ，不过我们可以利用 SpringFramework 中的工具类 `ClassUtils` 来避免异常捕捉：

```
ClassUtils.resolveClassName(beanDefinition.getBeanClassName(), this.getClass().getClassLoader())

```

> `ClassUtils.resolveClassName()` 方法内部已经帮我们搞定了 try-catch ，所以不会再出现异常类型检查和捕捉的提示。

如果这样判断后，bean 的父类确实是 `Color` ，那就可以添加属性值了：（以下是完整写法）

```java
public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    Stream.of(beanFactory.getBeanDefinitionNames()).forEach(beanName -> {
        BeanDefinition beanDefinition = beanFactory.getBeanDefinition(beanName);
        if (StringUtils.hasText(beanDefinition.getBeanClassName())) {
            if (ClassUtils.resolveClassName(beanDefinition.getBeanClassName(), this.getClass().getClassLoader())
                .getSuperclass().equals(Color.class)) {
                beanDefinition.getPropertyValues().add("name", beanName);
            }
        }
    });
}
```

### 2.3 测试运行

```java
public class FactoryProcessorApplication {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                "org.clxmm.postprocessor.h_factoryprocessor");
        Red red = ctx.getBean(Red.class);
        System.out.println(red);
    }
}
```

运行 `main` 方法，控制台打印出 red 的 `name` 属性，证明 `ColorNameSetterFactoryPostProcessor` 已经起到了作用。

### 2.4 替代方案

可能会有小伙伴察觉到哪里不对劲了：哎，这个策略如果用 `BeanPostProcessor` 实现，岂不是更简单？

```java
public class ColorNameSetterPostProcessor implements BeanPostProcessor {
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof Color) {
            Color color = (Color) bean;
            color.setName(beanName);
        }
        return bean;
    }
}
```

显然，这种写法更简单是吧。对于这种需求来讲，固然是使用 `BeanPostProcessor` 更好。小伙伴辩证的根据需求确定解决方案，这个非常好！赞赏之余，小册想多说一句：既然 SpringFramework 中有这个设计，自然也有它的使用场景，而且我们最好对比着来看这两种不同的后置处理器。

### 2.5 【面试题】对比BeanPostProcessor与BeanFactoryPostProcessor

|              | **BeanPostProcessor**                       | **BeanFactoryPostProcessor**                                 |
| ------------ | ------------------------------------------- | ------------------------------------------------------------ |
| 处理目标     | bean 实例                                   | BeanDefinition                                               |
| 执行时机     | bean 的初始化阶段前后（已创建出 bean 对象） | `BeanDefinition` 解析完毕，注册进 `BeanFactory` 的阶段（ bean 未实例化） |
| 可操作的空间 | 给 bean 的属性赋值、创建代理对象等          | 给 `BeanDefinition` 中增删属性、移除 `BeanDefinition` 等     |

### 2.6 BeanDefinition剔除的案例回顾

我们演示的 `BeanDefinition` 剔除吗？当时那个案例是把所有的性别为 male 的 `Person` 都剔除掉，这样容器初始化的时候不会创建这些 `Person` 对象。

 对象。不过那里面用的是强转到 `BeanDefinitionRegistry` 了，这个操作虽然没什么危险，但编程原则上还是不太合适的。so ，有没有针对 `BeanDefinitionRegistry` 的后置处理器呢？哎，还真有，接下来我们继续往下学习。

## 3. BeanDefinitionRegistryPostProcessor概述【理解】

关于 `BeanDefinitionRegistryPostProcessor` ，在官方文档上没有任何的信息可以供我们参考，so 只能靠 javadoc 了。

### 3.1 javadoc

> Extension to the standard BeanFactoryPostProcessor SPI, allowing for the registration of further bean definitions before regular BeanFactoryPostProcessor detection kicks in. In particular, BeanDefinitionRegistryPostProcessor may register further bean definitions which in turn define BeanFactoryPostProcessor instances.
>
> 对标准 `BeanFactoryPostProcessor` 的 SPI 的扩展，允许在进行常规 `BeanFactoryPostProcessor` 检测之前注册其他 Bean 的定义信息。特别是， `BeanDefinitionRegistryPostProcessor` 可以注册其他 Bean 的定义，这些定义又定义了 `BeanFactoryPostProcessor` 实例。

抓住注释中最关键的一句话：**允许在 `BeanFactoryPostProcessor` 之前注册其他的 `BeanDefinition`** ，这个才是重中之重！这句话想表达的 **`BeanDefinitionRegistryPostProcessor` 的执行时机比 `BeanFactoryPostProcessor` 更早**，`BeanFactoryPostProcessor` 一般只用来修改、扩展 `BeanDefinition` 中的信息，而 `BeanDefinitionRegistryPostProcessor` 则可以在 `BeanFactoryPostProcessor` 处理 `BeanDefinition` 之前，向 `BeanFactory` 注册新的 `BeanDefinition` ，甚至注册新的 `BeanFactoryPostProcessor` 用于下一个阶段的回调。

![image-20220505203827355](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220505203827.png)

这样就好理解多了吧！不过实际执行的机制跟上面的图还有一点点小差别：由于实现了 `BeanDefinitionRegistryPostProcessor` 的类同时也实现了 `BeanFactoryPostProcessor` 的 `postProcessBeanFactory` 方法，所以在执行完所有 `BeanDefinitionRegistryPostProcessor` 的接口方法后，会**立即执行**这些类的 `postProcessBeanFactory` 方法，之后才是执行那些普通的只实现了 `BeanFactoryPostProcessor` 的 `postProcessBeanFactory` 方法。

> （简单概括：扩展接口的优先执行机制）

### 3.2 【面试题】面试中如何概述BeanDefinitionRegistryPostProcessor

**`BeanDefinitionRegistryPostProcessor` 是容器的扩展点，它用于 IOC 容器的生命周期中，所有 `BeanDefinition` 都准备好，即将加载到 `BeanFactory` 时回调触发，用于给 `BeanFactory` 中添加新的 `BeanDefinition` 。`BeanDefinitionRegistryPostProcessor` 也是容器隔离的，不同容器中的 `BeanDefinitionRegistryPostProcessor` 不会相互起作用。**

关键回答点：**注册新的 Bean 的定义信息**

## 4. BeanDefinitionRegistryPostProcessor的使用【熟悉】

下面咱也来实际使用一下 `BeanDefinitionRegistryPostProcessor` ，来体会它是如何向 `BeanFactory` 中注册新的 `BeanDefinition` 。

同样也是先说下需求：有一个 `Animal` 的抽象动物类，两个具体的动物类 `Cat` 和 `Dog` 。一开始 IOC 容器中只注册 `Cat` ，没有 `Dog` ，使用 `BeanDefinitionRegistryPostProcessor` 注册一个 `Dog` 的对象，然后利用 `BeanFactoryPostProcessor` 给所有的 `Animal` 对象的属性赋值。

### 4.1 声明bean

先把抽象类 `Animal` 搞出来吧，这次不需要再搞 `Person` 的依赖了，只定义 name 属性就好啦：

```java
public abstract class Animal {
    
    protected String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

然后是 `Cat` 和 `Dog` ，只需要继承 `Animal` 就完事了：（记得给 `Cat` 上标注 `@Component` ，`Dog` 不标）

```java
@Component
public class Cat extends Animal {
    
    @Override
    public String toString() {
        return "Cat{" + "name='" + name + '\'' + "}";
    }
}


public class Dog extends Animal {
    
    @Override
    public String toString() {
        return "Dog{" + "name='" + name + '\'' + '}';
    }
}
```

### 4.2 编写后置处理器

上面的需求中，我们说的是注册 `Dog` ，以及给所有的 `Animal` 赋属性值，咱把这两个职责分开：

注册 `Dog` 的后置处理器：

```java
@Component
public class DogRegisterPostProcessor implements BeanDefinitionRegistryPostProcessor {
    
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        if (!registry.containsBeanDefinition("dog")) {
            // 构造BeanDefinition，并注册进BeanFactory
            BeanDefinition dogDefinition = BeanDefinitionBuilder.genericBeanDefinition(Dog.class).getBeanDefinition();
            registry.registerBeanDefinition("dog", dogDefinition);
        }
    }
    
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    }
}

```

给 `Animal` 赋属性值的后置处理器：

```java
@Component
public class AnimalNameSetterPostProcessor implements BeanFactoryPostProcessor {
    
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        String[] animalNames = beanFactory.getBeanNamesForType(Animal.class);
        Stream.of(animalNames).forEach(name -> {
            BeanDefinition beanDefinition = beanFactory.getBeanDefinition(name);
            beanDefinition.getPropertyValues().add("name", name);
        });
    }
}
```

### 4.3 测试运行

编写测试类，使用包扫描驱动 IOC 容器，并从 IOC 容器中取出 Cat 和 Dog ：

```java
public class RegistryPostProcessorApplication {
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(
                "org.clxmm.postprocessor.i_registryprocessor");
        Cat cat = ctx.getBean(Cat.class);
        System.out.println(cat);
        Dog dog = ctx.getBean(Dog.class);
        System.out.println(dog);
    }
}
```

运行 `main` 方法，控制台可以打印出 cat 和 dog 的信息：

```
Cat{name='cat'}
Dog{name='dog'}
```

### 4.4 运行时机分析

两个后置处理器都成功运行了，但是 `DogRegisterPostProcessor` 和 `AnimalNameSetterPostProcessor` 两个后置处理器的 `postProcessBeanFactory` 方法是谁先执行的呢？是有指定的顺序吗，还是 SpringFramework 底层已经确定好了顺序呢？

给两个后置处理器的所有方法都打上控制台输出，就像这样：

```java
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        System.out.println("DogRegisterPostProcessor postProcessBeanDefinitionRegistry run ......");
        // ......
    }
    
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        System.out.println("DogRegisterPostProcessor postProcessBeanFactory run ......");
    }
```

重新运行 `main` 方法，控制台打印出来的顺序如下：

```
DogRegisterPostProcessor postProcessBeanDefinitionRegistry run ......
DogRegisterPostProcessor postProcessBeanFactory run ......
AnimalNameSetterPostProcessor postProcessBeanFactory run ......
Cat{name='cat'}
Dog{name='dog'}
```

由此可得出结论（就是前面在 3.1 章节说到的）：**`BeanDefinitionRegistryPostProcessor` 的 `postProcessBeanDefinitionRegistry` 执行完毕后，会先执行它们的 `postProcessBeanFactory` ，然后才能轮到普通的 `BeanFactoryPostProcessor` 执行**。

### 4.5 注册BeanFactoryPostProcessor

像前面概述中说的那样，`BeanDefinitionRegistryPostProcessor` 还可以在 `postProcessBeanDefinitionRegistry` 方法中，动态的注册 `BeanFactoryPostProcessor` 以支持下面马上要触发的 `postProcessBeanFactory` 阶段回调，我们也可以来试着搞一下。

把 `AnimalNameSetterPostProcessor` 的 `@Component` 注解去掉，并编写一个新的后置处理器：

```java
@Component
public class AnimalProcessorRegisterPostProcessor implements BeanDefinitionRegistryPostProcessor {
    
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        registry.registerBeanDefinition("animalNameSetterPostProcessor", 
                new RootBeanDefinition(AnimalNameSetterPostProcessor.class));
    }
    
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    
    }
}
```

重新运行 `main` 方法，发现运行效果与前面一致，特性得以验证。

## 5. 【面试题】三种后置处理器的对比

|              | **BeanPostProcessor**                       | **BeanFactoryPostProcessor**                                 | BeanDefinitionRegistryPostProcessor                          |
| ------------ | ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 处理目标     | bean 实例                                   | BeanDefinition                                               | `BeanDefinition` 、`.class` 文件等                           |
| 执行时机     | bean 的初始化阶段前后（已创建出 bean 对象） | `BeanDefinition` 解析完毕并注册进 `BeanFactory` 之后（此时 bean 未实例化） | 配置文件、配置类已解析完毕并注册进 `BeanFactory` ，但还没有被 `BeanFactoryPostProcessor` 处理 |
| 可操作的空间 | 给 bean 的属性赋值、创建代理对象等          | 给 `BeanDefinition` 中增删属性、移除 `BeanDefinition` 等     | 向 `BeanFactory` 中注册新的 `BeanDefinition`                 |

