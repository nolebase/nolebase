---
title: 15IOC进阶-条件装配
--- 

## 1. 模块装配考虑不到的地方

还是拿上一章的酒馆为例。如果这套代码模拟的环境放到**一片荒野**，那这个时候可能吧台还在，老板还在，但是**调酒师**肯定就**不干活了**（荒郊野外哪来那些闲情雅致的人去喝酒呢），所以这个时候调酒师就不应该注册到 IOC 容器了。这种情况下，如果只是模块装配，那就没办法搞定了：只要配置类中声明了 `@Bean` 注解的方法，那这个方法的返回值就一定会被注册到 IOC 容器成为一个 Bean 。

所以，有没有办法解决这个问题呢？当然是有（不然咱这一章讲个啥呢），先来学习第一种方式：**Profile** 。

## 2. Profile【掌握】

SpringFramework 3.1 中就已经引入 Profile 的概念了，可它是什么意思呢？咱先了解一下。

### 2.1 什么是Profile【理解】

从字面上理解，并不能 get 到它真正的含义（外形？简介？概述？），实际上如果小伙伴借助词典查看网络翻译，profile 有“配置文件”的意思，倒不是说一个 profile 是一个配置文件，它更像是一个标识。最具权威的描述，自然还是去找官方文档和 javadoc 吧。

SpringFramework 的官方文档中并没有对 Profile 进行过多的描述，而是借助了一篇官网的博客来详细介绍 Profile 的使用：[spring.io/blog/2011/0…](https://spring.io/blog/2011/02/14/spring-3-1-m1-introducing-profile/) ，咱这里的讲解也会参考这篇博客的内容。另外的，javadoc 中有对 `@Profile` 注解的介绍，这个介绍可以说是把 Profile 的设计思想介绍的很到位了：

> Indicates that a component is eligible for registration when one or more specified profiles are active. A profile is a named logical grouping that may be activated programmatically via ConfigurableEnvironment.setActiveProfiles or declaratively by setting the spring.profiles.active property as a JVM system property, as an environment variable, or as a Servlet context parameter in web.xml for web applications. Profiles may also be activated declaratively in integration tests via the @ActiveProfiles annotation.
>
> `@Profile` 注解可以标注一些组件，当应用上下文的一个或多个指定配置文件处于活动状态时，这些组件允许被注册。
>
> 配置文件是一个命名的逻辑组，可以通过 `ConfigurableEnvironment.setActiveProfiles` 以编程方式激活，也可以通过将 `spring.profiles.active` 属性设置为 JVM 系统属性，环境变量或 `web.xml` 中用于 Web 应用的 `ServletContext` 参数来声明性地激活，还可以通过 `@ActiveProfiles` 注解在集成测试中声明性地激活配置文件。

简单理解下这段文档注释的意思：`@Profile` 注解可以标注在组件上，当一个配置属性（并不是文件）激活时，它才会起作用，而激活这个属性的方式有很多种（启动参数、环境变量、`web.xml` 配置等）。

如果小伙伴看完这段话开始有点感觉了，那说明你可能已经知道它的作用了。说白了，profile 提供了一种可以理解成“**基于环境的配置**”：**根据当前项目的运行时环境不同，可以动态的注册当前运行环境匹配的组件**。

下面咱就上一章的场景，为酒馆添加外置的环境因素。

### 2.2 @Profile的使用【掌握】

![image-20220502132630056](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220502132637.png)

#### 2.2.1 Bartender添加@Profile

刚在上面说了，荒郊野外下，调酒师率先不干了，跑路了，此时调酒师就不会在荒郊野外的环境下存在，只会在城市存在。用代码来表达，就是在注册调酒师的配置类上标注 `@Profile` ：

```java
@Configuration
@Profile("city")
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

#### 2.2.2 编程式设置运行时环境

如果现在直接运行 `TavernProfileApplication` 的 `main` 方法，控制台中不会打印 `zhangxiaosan` 和 `zhangdasan` ：（已省略一些内部的组件打印）

```
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.event.internalEventListenerProcessor
org.springframework.context.event.internalEventListenerFactory
tavernConfiguration
org.clxmm.configuration.b_profile.bean.Boss
org.clxmm.configuration.b_profile.bean.Bar
org.clxmm.configuration.b_profile.config.BarConfiguration
aBar
waiter
--------------------------
```

默认情况下，`ApplicationContext` 中的 profile 为 **“default”**，那上面 `@Profile("city")` 不匹配，`BartenderConfiguration` 不会生效，那这两个调酒师也不会被注册到 IOC 容器中。要想让调酒师注册进 IOC 容器，就需要给 `ApplicationContext` 中设置一下：

```java
public static void main(String[] args) throws Exception {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(TavernConfiguration.class);
    // 给ApplicationContext的环境设置正在激活的profile
    ctx.getEnvironment().setActiveProfiles("city");
    Stream.of(ctx.getBeanDefinitionNames()).forEach(System.out::println);
}
```

重新运行 `main` 方法，发现控制台还是只打印上面那些，两个调酒师还是没有被注册到 IOC 容器中。

？如果你还记得有个 **`refresh`** 方法的话，那这个地方就可以大胆猜测了：**是不是在 `new AnnotationConfigApplicationContext` 的时候，如果传入了配置类，它内部就自动初始化完成了，那些 Bean 也就都创建好了？**如果小伙伴能意识到这一点，说明对前面 `ApplicationContext` 的学习足够的认真了！

那应该怎么写才行呢？既然在构造方法中传入配置类就自动初始化完成了，那我不传呢？

诶？这也不报错啊！那我先这样 new 一个空的呗？然后再设置 profile 是不是就好使了呢？赶紧来试试：



```java
public static void main(String[] args) throws Exception {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.getEnvironment().setActiveProfiles("city");
    ctx.register(TavernConfiguration.class);
    ctx.refresh();
    Stream.of(ctx.getBeanDefinitionNames()).forEach(System.out::println);
}
```



```
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.event.internalEventListenerProcessor
org.springframework.context.event.internalEventListenerFactory
tavernConfiguration
org.clxmm.configuration.b_profile.bean.Boss
org.clxmm.configuration.b_profile.config.BartenderConfiguration
zhangxiaosan
zhangdasan
org.clxmm.configuration.b_profile.bean.Bar
org.clxmm.configuration.b_profile.config.BarConfiguration
aBar
waiter
```

#### 2.2.3 声明式设置运行时环境

上面编程式配置虽然可以用了，但仔细思考一下，这种方式似乎不实用吧！我都把 profile 硬编码在 .java 里了，那要是切换环境，我还得重新编译来，那图个啥呢？所以肯定还有更好的办法。上面的文档注释中也说了，它可以使用的方法很多，下面咱来演示最容易演示的一种：命令行参数配置。

测试命令行参数的环境变量，需要在 IDEA 中配置启动选项：

![image-20220502133255208](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220502133255.png)

这样配置好之后，在 `main` 方法中改回原来的构造方法传入配置类的形式，运行，控制台仍然会打印 zhangxiaosan 和 zhangdasan 。

修改传入的 jvm 参数，将 city 改成 **wilderness** ，重新运行 `main` 方法，发现控制台不再打印 zhangxiaosan 和 zhangdasan ，说明使用 jvm 命令行参数也可以控制 profile 。

除了 jvm 命令行参数，通过 web.xml 的方式也可以设置，不过咱还没有学习到集成 web 开发环境，所以这部分先放一放，后续讲 SpringWebMvc 时会提到它的。

### 2.3 @Profile在实际开发的用途【熟悉】

以数据源为例，在开发环境、测试环境、生产环境中，项目连接的数据库都是不一样的。如果每切换一个环境都要重新改一遍配置文件，那真的是太麻烦了，所以咱就可以采用 @Profile 的方式来解决。下面咱来模拟演示这种配置。

声明一个 `DataSourceConfiguration` 类，并一次性声明 3 个 `DataSource` ：（实际创建数据源的部分咱就不写了，还没学到 jdbc 部分不好剧透）

```java
@Configuration
public class DataSourceConfiguration {

    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return null;
    }

    @Bean
    @Profile("test")
    public DataSource testDataSource() {
        return null;
    }

    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        return null;
    }
}
```

这样写完之后，通过 `@PropertySource` 注解 + 外部配置文件，就可以做到**只切换 profile 即可切换不同的数据源**。

### 2.4 profile控制不到的地方

profile 强大吗？当然很强大，但它还有一些无法控制的地方。下面咱把场景进一步复杂化：

**吧台应该是由老板安置好的，如果酒馆中连老板都没有，那吧台也不应该存在。**

这种情况下，用 profile 就不好使了：因为 **profile 控制的是**整个项目的运行**环境**，无法根据单个 Bean 的因素决定是否装配。也是因为这个问题，出现了第二种条件装配的方式：**`@Conditional` 注解**。

## 3. Conditional【掌握】

看这个注解的名，condition ，很明显就是条件的意思啊，这也太直白明了了。按照惯例，咱先对 Conditional 有个清楚的认识。

### 3.1 什么是Conditional【理解】

`@Conditional` 是在 SpringFramework 4.0 版本正式推出的，它可以让 Bean 的装载基于一些指定的条件，换句话说，被标注 `@Conditional` 注解的 Bean 要注册到 IOC 容器时，必须全部满足 `@Conditional` 上指定的所有条件才可以。

在 SpringFramework 的官方文档中，并没有花什么篇幅介绍 `@Conditional` ，而是让咱们直接去看 javadoc ，不过有一说一，javadoc 里基本上把 `@Conditional` 的作用都描述明白了：

> Indicates that a component is only eligible for registration when all specified conditions match.
>
> A condition is any state that can be determined programmatically before the bean definition is due to be registered (see Condition for details).
>
> The @Conditional annotation may be used in any of the following ways:
>
> - as a type-level annotation on any class directly or indirectly annotated with @Component, including @Configuration classes
> - as a meta-annotation, for the purpose of composing custom stereotype annotations
> - as a method-level annotation on any @Bean method
>
> If a @Configuration class is marked with @Conditional, all of the @Bean methods, @Import annotations, and @ComponentScan annotations associated with that class will be subject to the conditions.
>
> 被 `@Conditional` 注解标注的组件，只有所有指定条件都匹配时，才有资格注册。条件是可以在要注册 `BeanDefinition` 之前以编程式确定的任何状态。
>
> `@Conditional` 注解可以通过以下任何一种方式使用：
>
> - 作为任何直接或间接用 `@Component` 注解的类的类型级别注解，包括 `@Configuration` 类
> - 作为元注解，目的是组成自定义注解
> - 作为任何 `@Bean` 方法上的方法级注解
>
> 如果 `@Configuration` 配置类被 `@Conditional` 标记，则与该类关联的所有 `@Bean` 的工厂方法，`@Import` 注解和 `@ComponentScan` 注解也将受条件限制。

简单理解下这段文档注释：`@Conditional` 注解可以指定匹配条件，而被 `@Conditional` 注解标注的 组件类 / 配置类 / 组件工厂方法 必须满足 `@Conditional` 中指定的所有条件，才会被创建 / 解析。

下面咱改造上面提到的场景，来体会 `@Conditional` 条件装配的实际使用。

### 3.2 @Conditional的使用【掌握】

#### 3.2.1 Bar的创建要基于Boss

在 `BarConfiguration` 的 Bar 注册中，要指定 Bar 的创建需要 Boss 的存在，反映到代码上就是在 bbbar 方法上标注 `@Conditional` ：

```java
    @Bean
    @Conditional(???)
    public Bar bbbar() {
        return new Bar();
    }
```

发现 `@Conditional` 注解中需要传入一个 `Condition` 接口的实现类数组，说明咱还需要编写条件匹配类做匹配依据。那咱就先写一个匹配条件：

#### 3.2.2 条件匹配规则类的编写

在 `BarConfiguration` 的 Bar 注册中，要指定 Bar 的创建需要 Boss 的存在，反映到代码上就是在 bbbar 方法上标注 `@Conditional` ：

```java
    @Bean
    @Conditional(???)
    public Bar bbbar() {
        return new Bar();
    }
```

发现 `@Conditional` 注解中需要传入一个 `Condition` 接口的实现类数组，说明咱还需要编写条件匹配类做匹配依据。那咱就先写一个匹配条件：

#### 3.2.2 条件匹配规则类的编写

声明一个 `ExistBossCondition` 类，表示它用来判断 IOC 容器中是否存在 `Boss` 的对象：

```java
public class ExistBossCondition implements Condition {

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return context.getBeanFactory().containsBeanDefinition(Boss.class.getName());
    }
}
```

注意这个地方用 **`BeanDefinition`** 做判断而不是 **Bean** ，考虑的是当条件匹配时，可能 `Boss` 还没被创建，导致条件匹配出现偏差。

然后，把这个 `ExistBossCondition` 规则类放入 `@Conditional` 注解中。

#### 3.2.3 测试运行

运行启动类的 `main` 方法，发现吧台被成功创建：

所以上面的 `@Conditional` 到底真的起作用了吗？咱把 `@EnableTavern` 中导入的 `Boss` 类去掉：

```java
@Import({BartenderConfiguration.class, BarImportSelector.class, WaiterRegistrar.class})
public @interface EnableTavern {
    
}
```

重新运行 `main` 方法，发现 `Boss` 和 `bbbar` 都没了，说明 `@Conditional` 真的起作用了。

```
org.springframework.context.event.internalEventListenerFactory
tavernConfiguration
org.clxmm.configuration.c_conditional.config.BartenderConfiguration
zhangxiaosan
zhangdasan
org.clxmm.configuration.c_conditional.bean.Bar
org.clxmm.configuration.c_conditional.config.BarConfiguration
waiter
```

### 3.3 通用抽取【熟悉】

思考一个问题：如果一个项目中，有比较多的组件需要依赖另一些不同的组件，如果每个组件都写一个 `Condition` 条件，那工程量真的太大了。这个时候咱就要想想了：如果能把这个匹配的规则抽取为通用的方式，那岂不是让条件装配变得容易得多？抱着这个想法，咱来试着修改一下现有的代码。

#### 3.3.1 抽取传入的beanName

由于上面咱在文档注释中看到了 `@Conditional` 可以派生，那就来写一个新的注解吧：`@ConditionalOnBean` ，意为**“存在指定的 Bean 时匹配”**：

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@Conditional(OnBeanCondition.class)
public @interface ConditionalOnBean {

    String[] beanNames() default {};
}
```

传入的 `Condition` 类型为自己声明的 `OnBeanCondition` ：

```java
public class OnBeanCondition implements Condition {

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // 先获取目标自定义注解ConditionalOnBean上的beanNames属性
        String[] beanNames = (String[]) metadata.getAnnotationAttributes(ConditionalOnBean.class.getName()).get("beanNames");
        // 逐个校验IOC容器中是否包含传入的bean名称
        for (String beanName : beanNames) {
            if (!context.getBeanFactory().containsBeanDefinition(beanName)) {
                return false;
            }
        }
        return true;
    }
}
```

#### 3.3.2 替换上面的原生@Conditional注解

在 `BarConfiguration` 中，将 `bbbar` 方法上的 `@Conditional(ExistBossCondition.class)` 去掉，换用 `@ConditionalOnBean` 注解：



```java
    @Bean
//    @Conditional(ExistBossCondition.class)
    @ConditionalOnBean(beanNames = "org.clxmm.configuration.c_conditional.bean.Boss")
    public Bar aBar() {
        return new Bar();
    }
```

重新运行 `main` 方法，发现 `bbbar` 依然没有创建（此时 `@EnableTavern` 中已经没有导入 Boss 类了），证明自定义注解已经生效。

#### 3.3.3 加入类型匹配

上面只能是抽取 `beanName` ，传整个类的全限定名真的很费劲。如果当前类路径下本来就有这个类，那直接写进去就好呀。我们希望代码最终改造成这个样子：

```java
@Bean
@ConditionalOnBean(Boss.class)
public Bar bbbar() {
    return new Bar();
}
```

这样子多简洁啊，因为我已经有 `Boss` 类了，所以直接写进去就好嘛。那下面咱来改造这个效果。

给 `@ConditionalOnBean` 注解上添加默认的 `value` 属性，类型为 `Class[]` ，这样就可以传入类型了：

之后，在 `OnBeanCondition` 中添加 `value` 的属性解析：

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@Conditional(OnBeanCondition.class)
public @interface ConditionalOnBean {
    
    Class<?>[] value() default {};

    String[] beanNames() default {};
}
```

之后，在 `OnBeanCondition` 中添加 `value` 的属性解析：

```java
public class OnBeanCondition implements Condition {


    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // 先获取目标自定义注解ConditionalOnBean上的beanNames属性

        Map<String, Object> attributes = metadata.getAnnotationAttributes(ConditionalOnBean.class.getName());

        //匹配 beanNames
        String[] beanNames = (String[]) attributes.get("beanNames");
        // 逐个校验IOC容器中是否包含传入的bean名称
        for (String beanName : beanNames) {
            if (!context.getBeanFactory().containsBeanDefinition(beanName)) {
                return false;
            }
        }


        //匹配类型
        Class<?>[] classes = (Class<?>[]) attributes.get("value");
        for (Class<?> aClass : classes) {
            if (!context.getBeanFactory().containsBeanDefinition(aClass.getName())) {
                return false;
            }
        }


        return true;
    }
}
```

这样，就可以匹配 bean 的名称为默认的全限定名的情况了。

> 最后多说一句，小伙伴们在自己动手练习这部分内容时不要过于纠结这里面的内容，其实咱写的这个 `@ConditionalOnBean` 是参考 SpringBoot 中的 `@ConditionalOnBean` 注解，人家 SpringBoot 官方实现的功能更严密完善，后续你在项目中用到了 SpringBoot ，那这些 `@Conditional` 派生的注解尽情用就好。

