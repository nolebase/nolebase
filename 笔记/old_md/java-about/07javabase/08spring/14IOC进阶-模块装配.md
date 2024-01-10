---
title: 14IOC进阶-模块装配
---

接下来的两章，咱来介绍关于 IOC 进阶部分，模块装配与条件装配的使用。这一部分相当重要，对于以后学习 SpringBoot 的核心**自动装配**有巨大的帮助（ **SpringBoot 的自动装配，基础就是模块装配 + 条件装配**）

> 如果小伙伴之前有学习或接触过 SSH 或者 SSM 的框架整合，应该还记得那些配置文件有多烦吧，又多又不好记真的很让人头大。在处理配置文件的同时，小伙伴是否有想过：如果能有一种方式，可以使用很少的配置，甚至不配置就可以完成一个功能的装载，那岂不是省了很多事？这个疑问在 SpringBoot 中得以解决，而这个解决的核心技术就是模块装配 + 条件装配。

## 1. 原生手动装配【回顾】

在最原始的 SpringFramework 中，是不支持注解驱动开发的（当时最低支持版本是 1.3 、1.4 ），直到 SpringFramework 2.0 版本，才初步出现了模式注解（ `@Repository` ），到了 SpringFramework 2.5 出现了 `@Component` 和它的几个派生注解，到了 SpringFramework 3.0 才完全的支持注解驱动开发（当时最低支持版本已经升级到 1.5）。

使用 `@Configuration` + `@Bean` 注解组合，或者 `@Component` + `@ComponentScan` 注解组合，可以实现编程式 / 声明式的手动装配。这两种方式咱前面已经写过很多了，不再赘述。

不过，咱思考一个问题：如果使用这两种方式，如果要注册的 Bean 很多，要么一个一个的 `@Bean` 编程式写，要么就得选好包进行组件扫描，而且这种情况还得每个类都标注好 `@Component` 或者它的衍生注解才行。面对数量很多的 Bean ，这种装配方式很明显会比较麻烦，需要有一个新的解决方案。

## 2. 模块装配【掌握】

SpringFramework 3.0 的发布，全面支持了注解驱动开发，随之而来的就是快速方便的模块装配。在正式了解模块装配之前，咱先思考一个问题。

### 2.1 什么是模块【理解】

通常理解下，模块可以理解成一个一个的可以分解、组合、更换的独立的单元，模块与模块之间可能存在一定的依赖，模块的内部通常是高内聚的，一个模块通常都是解决一个独立的问题（如引入事务模块是为了解决数据库操作的最终一致性）。其实按照这个理解来看，我们平时写的一个一个的功能，也可以看成一个个的模块；封装的一个个组件，可以看做是模块。

简单总结下，模块通常具有以下几个特征：

- 独立的
- 功能高内聚
- 可相互依赖
- 目标明确

### 2.2 什么是模块装配【掌握】

明确了模块的定义，下面就可以思考下一个问题了：什么是模块装配？

既然模块是功能单元，那模块装配，就可以理解为**把一个模块需要的核心功能组件都装配好**，当然如果能有尽可能简便的方式那最好。

### 2.3 SpringFramework中的模块装配【了解】

SpringFramework 中的模块装配，是在 **3.1** 之后引入大量 **`@EnableXXX`** 注解，来快速整合激活相对应的模块。

从现在 5.x 的官方文档中已经很难找到 `@EnableXXX` 的介绍了，小伙伴们可以回溯到 SpringFramework 3.1.0 的官方文档：

[docs.spring.io/spring/docs…](https://docs.spring.io/spring-framework/docs/3.1.0.RELEASE/reference/htmlsingle/)

在 3.1.5 节中，它有介绍 `@EnableXXX` 注解的使用，并且它还举了不少例子，这里面不乏有咱可能熟悉的：

-  EnableTransactionManagement ：开启注解事务驱动
- EnableWebMvc ：激活 SpringWebMvc
- EnableAspectJAutoProxy ：开启注解 AOP 编程
- EnableScheduling ：开启调度功能（定时任务）

### 2.4 快速体会模块装配【掌握】

先记住使用模块装配的核心原则：**自定义注解 + `@Import` 导入组件。**

#### 2.4.1 模块装配场景概述

下面咱构建一个场景：使用代码模拟构建出一个**酒馆**，酒馆里得有**吧台**，得有**调酒师**，得有**服务员**，还得有**老板**。这里面具体的设计咱不过多深入，小伙伴自己练习时可以自由发挥。

在这个场景中，`ApplicationContext` 看作一个酒馆，酒馆里的吧台、调酒师、服务员、老板，这些元素统统看作一个一个的**组件**。咱用代码模拟实现的最终目的，是可以**通过一个注解，同时把这些元素都填充到酒馆中**。

目的明确了，下面就开始动手吧。一开始咱先实现最简单的装配方式。

#### 2.4.2 声明自定义注解

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface EnableTavern {
    
}
```

注意注解上面要标注三个元注解，代表它在运行时起效，并且只能标注在类上。

还没完事，模块装配需要一个最核心的注解是 **`@Import`** ，它要标注在 `@EnableTavern` 上。不过这个 `@Import` 中需要传入 `value` 值，点开看一眼它的源码吧：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Import {

	/**
	 * {@link Configuration @Configuration}, {@link ImportSelector},
	 * {@link ImportBeanDefinitionRegistrar}, or regular component classes to import.
	 */
	Class<?>[] value();
}
```

看，文档注释已经写得非常明白了：它可以导入**配置类**、**`ImportSelector` 的实现类**，**`ImportBeanDefinitionRegistrar` 的实现类**，或者**普通类**。咱这里先来快速上手，所以咱先选择使用**普通类**导入。

#### 2.4.3 声明老板类

既然先导入普通类，那咱就来整一个老板的类吧，毕竟酒馆必须有老板经营才是呀！

```java
public class Boss {

}
```

没了，这点代码就够了，连 `@Component` 注解都不用标注。

然后！咱在上面 `@EnableTavern` 的 `@Import` 注解中，填入 Boss 的类：

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Import(Boss.class)
public @interface EnableTavern {
    
}
```

这样就代表，如果**标注了 `@EnableTavern` 注解，就会触发 `@Import` 的效果，向容器中导入一个 `Boss` 类型的 Bean** 。

#### 2.4.4 创建配置类

注解驱动，自然少不了配置类。咱声明一个 `TavernConfiguration` 的配置类，并在类上标注 `@Configuration` 和 `@EnableTavern` 注解：

```java
@Configuration
@EnableTavern
public class TavernConfiguration {
    
}
```

配置类中什么都不用写，只要标注好注解即可。

#### 2.4.5 编写启动类测试

下面就可以编写启动类测试装配的效果了，咱新建一个 `TavernApplication` ，并用刚写的 `TavernConfiguration` 驱动初始化 IOC 容器：

```java
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(TavernConfiguration.class);
        Boss boss = ctx.getBean(Boss.class);
        System.out.println(boss);
    }
```

运行 `main` 方法，可以发现使用 `getBean` 能够正常取到 `Boss` 的对象，说明 `Boss` 类已经被注册到 IOC 容器生成了一个对象。

```
org.clxmm.configuration.a_module.bean.Boss@45afc369
```

这样我们就完成了最简单的模块装配。

这个时候可能有小伙伴开始不耐烦了：我去原本我可以用 `@Configuration` + `@Bean` 就能完事的，你非得给我整这么一堆，这不是**徒增功耗**吗？别着急，往上翻一翻 `@Import` 可以传入的东西，是不是发现普通类是最简单的呀？下面咱就来学习剩下几种更复杂的方式。

### 2.5 模块装配的四种方式【掌握】

#### 2.5.1 导入普通类

上面的方式就是导入普通类。

#### 2.5.2 导入配置类

如果需要直接导入一些现有的配置类，使用 `@Import` 也可以直接加载进来。下面咱来把调酒师搞定。

##### 2.5.2.1 声明调酒师类

调酒师的模型，咱加一个 **`name`** 的属性吧，暗示着咱要搞不止一个调酒师咯：

```java
public class Bartender {
    
    private String name;
    
    public Bartender(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
}
```

##### 2.5.2.2 注册调酒师的对象

如果要注册多个相同类型的 Bean ，现在咱能想到的办法就是通过配置类了。下面咱编写一个 `BartenderConfiguration` ：

```java
@Configuration
public class BartenderConfiguration {
    
    @Bean
    public Bartender zhangxiaosan() {
        return new Bartender("张小三");
    }
    
    @Bean
    public Bartender zhangdasan() {
        return new Bartender("张大三");
    }
    
}
```

注意哦，如果小伙伴用 **IDEA** 开发的话，此时这个类会报黄，提示这个配置类还没有被用到过，事实上也确实是这样，咱在驱动 IOC 容器初始化时，用的是只传入一个配置类的方式，所以它肯定不会用到。那想让它起作用，只需要在 `@EnableTavern` 的 `@Import` 中把这个配置类加上即可：

```java
@Import({Boss.class, BartenderConfiguration.class})
public @interface EnableTavern {
    
}
```

> 注意这里有一个小细节，有小伙伴在学习的时候，启动类里或者配置类上用了**包扫描**，恰好把这个类扫描到了，导致即使没有 `@Import` 这个 `BartenderConfiguration` ，`Bartender` 调酒师也被注册进 IOC 容器了。这里一定要细心哈，包扫描本身就会扫描配置类，并且让其生效的。如果既想用包扫描，又不想扫到这个类，很简单，把这些配置类拿到别的包里，让包扫描找不到它就好啦。

##### 2.5.2.3 测试运行

修改启动类，使用 `ApplicationContext` 的 `getBeansOfType` 方法可以一次性取出 IOC 容器指定类型的所有 Bean ：

```java
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(TavernConfiguration.class);
        Stream.of(ctx.getBeanDefinitionNames()).forEach(System.out::println);
        System.out.println("--------------------------");
        Map<String, Bartender> bartenders = ctx.getBeansOfType(Bartender.class);
        bartenders.forEach((name, bartender) -> System.out.println(bartender));
    }
```

```
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.event.internalEventListenerProcessor
org.springframework.context.event.internalEventListenerFactory
tavernConfiguration
org.clxmm.configuration.a_module.bean.Boss
org.clxmm.configuration.a_module.config.BartenderConfiguration
zhangxiaosan
zhangdasan
--------------------------
Bartender(name=张小三)
Bartender(name=张大三)
```

注意里面一个小细节，`BartenderConfiguration` 配置类也被注册到 IOC 容器成为一个 Bean 了。

#### 2.5.3 导入ImportSelector

借助 IDE 打开 `ImportSelector` ，会发现它是一个**接口**，它的功能可以从文档注释中读到一些信息：

> Interface to be implemented by types that determine which @Configuration class(es) should be imported based on a given selection criteria, usually one or more annotation attributes.
>
> 它是一个接口，它的实现类可以根据指定的筛选标准（通常是一个或者多个注解）来决定导入哪些配置类。

文档注释中想表达的是可以导入配置类，但其实 `ImportSelector` 也可以导入普通类。下面咱先演示如何使用。

##### 2.5.3.1 声明吧台类

吧台的模型类咱就不搞花里胡哨了，最简单的类模型即可：

```java
public class Bar {
    
}
```

##### 2.5.3.2 声明注册吧台的配置类

咱为了说明 `ImportSelector` 不止可以导入配置类，也可以导入普通类，所以这里咱也造一个配置类，来演示两种类型皆可的效果。

```java
@Configuration
public class BarConfiguration {
    
     @Bean
    public Bar aBar() {
        return new Bar();
    }
}
```

##### 2.5.3.3 编写ImportSelector的实现类

咱编写一个 `BarImportSelector` ，来实现 `ImportSelector` 接口，实现 `selectImports` 方法：

```java
public class BarImportSelector implements ImportSelector {
    
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[0];
    }
}
```

注意，`selectImports` 方法的返回值是一个 String 类型的数组，它这样设计的目的是什么呢？咱来看看 selectImports 方法的文档注释：

> Select and return the names of which class(es) should be imported based on the AnnotationMetadata of the importing @Configuration class.
>
> 根据导入的 `@Configuration` 类的 `AnnotationMetadata` 选择并返回要导入的类的类名。

哦，合着它要的是一组类名呀，自然肯定是**全限定类名**咯（没有全限定类名没办法定位具体的类）。那既然这样，咱就在这里面把上面的 `Bar` 和 `BarConfiguration` 的类名写进去：

```java
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[] {Bar.class.getName(), BarConfiguration.class.getName()};
    }
```

最后，把 `@EnableTavern` 的 `@Import` 中把这个 `BarImportSelector` 导入进去即可。

```java
@Import({Boss.class, BartenderConfiguration.class, BarImportSelector.class})
public @interface EnableTavern {
    
}
```

##### 2.5.3.4 测试运行

修改启动类的 `main` 方法，这次只打印 IOC 容器中所有 bean 的 name 吧（主要是 bean 真的越来越多了）。运行 `main` 方法，控制台会打印出两个 `Bar` 

```
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.event.internalEventListenerProcessor
org.springframework.context.event.internalEventListenerFactory
tavernConfiguration
org.clxmm.configuration.a_module.bean.Boss
org.clxmm.configuration.a_module.config.BartenderConfiguration
zhangxiaosan
zhangdasan
org.clxmm.configuration.a_module.bean.Bar
org.clxmm.configuration.a_module.config.BarConfiguration
aBar
--------------------------
```

另外注意一点，`BarImportSelector` 本身没有注册到 IOC 容器哦。

#### 2.5.4 导入ImportBeanDefinitionRegistrar

如果说 `ImportSelector` 更像声明式导入的话，那 `ImportBeanDefinitionRegistrar` 就可以解释为编程式向 IOC 容器中导入 Bean 。不过由于它导入的实际是 `BeanDefinition` （ Bean 的定义信息），这部分咱还没有接触到，就先不展开大篇幅解释了（如果要解释，那可真的是大篇幅的）。咱先对 `ImportBeanDefinitionRegistrar` 有一个快速的使用入门即可，后面在讲到 IOC 高级和原理部分，会回过头来详细解析 `ImportBeanDefinitionRegistrar` 的使用和原理。

##### 2.5.4.1 声明服务员类

```java
public class Waiter {
    
}
```

> 这里就先不把服务员的模型类搞得很复杂了，咱的目的是学会模块装配，而不是搞 `BeanDefinition` 的复杂操作。

##### 2.5.4.2 编写ImportBeanDefinitionRegistrar的实现类

```java
public class WaiterRegistrar implements ImportBeanDefinitionRegistrar {
    
    @Override
    public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
        registry.registerBeanDefinition("waiter", new RootBeanDefinition(Waiter.class));
    }
}
```

这里面的写法小伙伴们先不要过度纠结，跟着写就完事了。简单解释下，这个 `registerBeanDefinition` 方法传入的两个参数，第一个参数是 Bean 的名称（id），第二个参数中传入的 `RootBeanDefinition` 要指定 Bean 的字节码（ **`.class`** ）。

最后，把 `WaiterRegistrar` 标注在 `@EnableTavern` 的 `@Import` 中：

```java
@Import({Boss.class, BartenderConfiguration.class, BarImportSelector.class, WaiterRegistrar.class})
public @interface EnableTavern {
    
}
```

##### 2.5.4.3 测试运行

直接重新运行 `main` 方法，控制台可以打印出服务员（最后一行）：

```
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.event.internalEventListenerProcessor
org.springframework.context.event.internalEventListenerFactory
tavernConfiguration
org.clxmm.configuration.a_module.bean.Boss
org.clxmm.configuration.a_module.config.BartenderConfiguration
zhangxiaosan
zhangdasan
org.clxmm.configuration.a_module.bean.Bar
org.clxmm.configuration.a_module.config.BarConfiguration
aBar
waiter
--------------------------
```

注意这里 `WaiterRegistrar` 也没有注册到 IOC 容器中。

到这里，`@Import` 的四种导入的方式也就全部过了一遍，**模块装配**说白了**就是这四种方式的综合使用**。

