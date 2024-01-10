---
title: 15IOC进阶-组件扫描高级
---

## 1. 包扫描的路径【掌握】

`@ComponentScan` 注解可以指定包扫描的路径（而且还可以声明不止一个），它的写法是使用 `@ComponentScan` 的 `value` / `basePackages` 属性：

```java
@Configuration
@ComponentScan("com.linkedbear.spring.annotation.e_basepackageclass.bean")
public class BasePackageClassConfiguration {
    
}
```

这种方式是最常用的，也是最推荐使用的。除此之外，还有一种声明方式，它使用的是类的 Class 字节码：

```java
@Repeatable(ComponentScans.class)
public @interface ComponentScan {
	@AliasFor("basePackages")
	String[] value() default {};

	@AliasFor("value")
	String[] basePackages() default {};

    // 注意这个
	Class<?>[] basePackageClasses() default {};
```

它的这个 `basePackageClasses` 属性，可以传入一组 Class 进去，它代表的意思，是扫描**传入的这些 Class 所在包及子包下的所有组件**。

### 1.1 声明几个组件类+配置类

![image-20220502194408239](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220502194408.png)

### 1.2 标注配置类的包扫描规则

配置类中，声明包扫描配置，咱先拿 `DemoService` 传进去：

```java
@Configuration
@ComponentScan(basePackageClasses = DemoService.class)
public class BasePackageClassConfiguration {
    
}
```

### 1.3 测试运行

编写启动类，驱动 IOC 容器，并打印容器中所有的 Bean 的名称：

```java
public static void main(String[] args) throws Exception {
  AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(BasePackageClassConfiguration.class);
  String[] beanDefinitionNames = ctx.getBeanDefinitionNames();
  Stream.of(beanDefinitionNames).forEach(System.out::println);
}
```

运行 `main` 方法，发现控制台中只打印了 `DemoService` 与 `DemoDao` ：

```
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.event.internalEventListenerProcessor
org.springframework.context.event.internalEventListenerFactory
basePackageClassConfiguration
demoDao
demoService
```

说明它确实以 `DemoService` 所在的包为基准扫描了，不过没有扫描到 `DemoComponent` 。

### 1.4 加入DemoComponent

在 `@ComponentScan` 中，再加入 `DemoComponent` 的字节码：

```java
@Configuration
@ComponentScan(basePackageClasses = {DemoService.class, DemoComponent.class})
public class BasePackageClassConfiguration {
    
}
```

重新运行 `main` 方法，控制台中多了 `DemoComponent` 与 `InnerComponent` 的打印，由此体现出 `basePackageClasses` 的作用。

## 2. 包扫描的过滤【掌握】

在实际开发的场景中，我们用包扫描拿到的组件不一定全部都需要，也或者只有一部分需要，这个时候就需要用到包扫描的过滤了。

> 如果小伙伴之前有用 SpringWebMvc 的 xml 配置开发 Web 应用的话，应该印象蛮深刻吧！`spring-mvc.xml` 中配置只能扫描 `@Controller` 注解，`applicationContext.xml` 中又要设置不扫描 `@Controller` 注解，这就是扫描过滤的规则设置。

### 2.1 声明好多组件类+配置类

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220502194408.png)

简单说一下这些组件的编写。

- @Animal 是一个普通的注解，它可以标注在类上

  - Cat 、Dog 、Pikachu 是三个最简单的类，其中 Cat 和 Dog 上除了标注 @Component 注解外，还标注 @Animal

- color 包下的 Color 是一个父类

  - 下面的红黄绿三个类均标注 @Component ，不过只有 Red 和 Yellow 继承 Color

- bean 包的 DemoService 与 DemoDao 均是普通的类，且都没有标注任何注解

  

下面咱开始介绍过滤的几种方式。

### 2.2 按注解过滤包含

**includeFilters**

### 2.3 按注解排除

**excludeFilters**

在 `TypeFilterConfiguration` 中，声明 `@ComponentScan` 注解，扫描整个 `f_typefilter` 包，之后在 `@ComponentScan` 注解中声明 `includeFilters` 属性，让它把含有 `@Animal` 注解的类带进来：

```java
@Configuration
@ComponentScan(basePackages = "org.clxmm.annotation.f_typefilter"
//        , includeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, value = Animal.class )
        , excludeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, value = Animal.class)
)
public class TypeFilterConfiguration {
}
```

### 2.3 按类型过滤

```java
@Configuration
@ComponentScan(basePackages = "org.clxmm.annotation.f_typefilter"
//        , includeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, value = Animal.class )
        , excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ANNOTATION, value = Animal.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = Color.class)
}
)
public class TypeFilterConfiguration {
}
```

### 2.4 正则表达式过滤

除了按注解过滤、按类型过滤，它内置的模式还有两种表达式的过滤规则，分别是 “切入点表达式过滤” 和 “正则表达式过滤” 。关于切入点表达式的概念咱放到 AOP 中再讲，这里先讲正则表达式的方式。

这次咱想通过正则表达式的方式，把那两个 Demo 开头的组件加载进来，正则表达式就可以这样编写：

```java
@Configuration
@ComponentScan(basePackages = "org.clxmm.annotation.f_typefilter"
//        , includeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, value = Animal.class )
        , includeFilters = {
            @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.clxmm.annotation.f_typefilter.+Demo.+")
        }
        , excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ANNOTATION, value = Animal.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = Color.class)
}
)
public class TypeFilterConfiguration {
}
```

这样编写好后，重新运行 `main` 方法，`DemoService` 和 `DemoDao` 就会被注册到 IOC 容器了：

### 2.5 自定义过滤

如果预设的几种模式都不能满足要求，那就需要用编程式过滤方式了，也就是自定义过滤规则。

先定个目标吧，这次编写自定义过滤后，咱们把 green 也过滤掉。

#### 2.5.1 TypeFilter接口

编程式自定义过滤，需要编写过滤策略，实现 `TypeFilter` 接口。这个接口只有一个 `match` 方法：

```java
@FunctionalInterface
public interface TypeFilter {
	boolean match(MetadataReader metadataReader, MetadataReaderFactory metadataReaderFactory) throws IOException;
}
```

这个 `match` 方法有两个参数，咱是一个也看不懂呀！好在文档注释中有描述，咱可以来参考一下：

- metadataReader ：the metadata reader for the target class
  - 通过这个 Reader ，可以读取到正在扫描的类的信息（包括类的信息、类上标注的注解等）
- metadataReaderFactory ：a factory for obtaining metadata readers for other classes (such as superclasses and interfaces)
  - 借助这个 Factory ，可以获取到其他类的 Reader ，进而获取到那些类的信息
  - 可以这样理解：借助 ReaderFactory 可以获取到 Reader ，借助 Reader 可以获取到指定类的信息

#### 2.5.2 编写自定义过滤规则

`MetadataReader` 中有一个 `getClassMetadata` 方法，可以拿到正在扫描的类的基本信息，咱可以由此取到全限定类名，进而与咱需求中的 `Green` 类做匹配：

```java
public class GreenTypeFilter implements TypeFilter {
    @Override
    public boolean match(MetadataReader metadataReader, MetadataReaderFactory metadataReaderFactory) throws IOException {
        ClassMetadata classMetadata = metadataReader.getClassMetadata();
        return classMetadata.getClassName().equals(Green.class.getName());
    }
}
```

返回 true ，则说明已经匹配上了。

#### 2.5.3 添加过滤规则声明

`TypeFilter` 写完了，不要忘记加在 `@ComponentScan` 上：

```java
@Configuration
@ComponentScan(basePackages = "org.clxmm.annotation.f_typefilter"
//        , includeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, value = Animal.class )
        , includeFilters = {
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.clxmm.annotation.f_typefilter.+Demo.+")
}
        , excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ANNOTATION, value = Animal.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = Color.class),
        @ComponentScan.Filter(type = FilterType.CUSTOM, value = GreenTypeFilter.class),
}
)
public class TypeFilterConfiguration {
}
```

重新运行启动类的 `main` 方法，可以发现 `Green` 也没了，自定义 `TypeFilter` 生效。

更多的 `MetadataReader` 和 `MetadataReaderFactory` 的使用，小伙伴们可以自行探索

#### 2.5.4 metadata的概念

回想一下 JavaSE 的反射，它是不是可以根据咱写好的类，获取到类的全限定名、属性、方法等信息呀。好，咱现在就建立起这么一个概念：咱定义的类，它叫什么名，它有哪些属性，哪些方法，这些信息，统统叫做**元信息**，**元信息会描述它的目标的属性和特征**。

在 SpringFramework 中，元信息大量出现在框架的底层设计中，不只是 **metadata** ，前面咱屡次见到的 **definition** ，也是元信息的体现。后面到了 IOC 高级部分，咱会整体的学习 SpringFramework 中的元信息、元定义设计，以及 `BeanDefinition` 的全解析。

## 3. 包扫描的其他特性【熟悉】

两个比较重头的特性咱说完之后，还有一些小零碎，咱也盘点盘点。

### 3.1 包扫描可以组合使用

小伙伴们在写 `@ComponentScan` 注解时一定有发现还有一个 `@ComponentScans` 注解吧！不过比较靠前的版本是看不到它的，它起源自 4.3 ：

```java
// @since 4.3
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
public @interface ComponentScans {
	ComponentScan[] value();
}
```

其实它就是一次性组合了一堆 `@ComponentScan` 注解而已了，没啥好说的。

### 3.2 包扫描的组件名称生成

咱在前面刚学习注解驱动时，就知道默认情况下生成的 bean 的名称是类名的首字母小写形式（ Person → person ），可是它为啥就有这个规则呢？这个问题，也可以从 `@ComponentScan` 注解中找到。

在 `@ComponentScan` 注解的属性中，有一个 `nameGenerator` ，它的默认值是 `BeanNameGenerator` 。不过这个 `BeanNameGenerator` 是一个接口，从文档注释中不难找到实现类是 `AnnotationBeanNameGenerator` 。

#### 3.2.1 BeanNameGenerator

从名称上就知道它是 Bean 的名字生成器了，它只有一个 `generateBeanName` 方法：

```
public interface BeanNameGenerator {
	String generateBeanName(BeanDefinition definition, BeanDefinitionRegistry registry);
}
```

又出现 `BeanDefinition` 和 `BeanDefinitionRegistry` 了，可见元信息、元定义在底层真的太常见了！

不过咱先不要把精力放在这里，实现类才是重点。

#### 3.2.2 AnnotationBeanNameGenerator的实现

找到 `AnnotationBeanNameGenerator` 的实现：

```java
public String generateBeanName(BeanDefinition definition, BeanDefinitionRegistry registry) {
    // 组件的注册方式是注解扫描的
    if (definition instanceof AnnotatedBeanDefinition) {
        // 尝试从注解中获取名称
        String beanName = determineBeanNameFromAnnotation((AnnotatedBeanDefinition) definition);
        if (StringUtils.hasText(beanName)) {
            // Explicit bean name found.
            return beanName;
        }
    }
    // Fallback: generate a unique default bean name.
    // 如果没有获取到，则创建默认的名称
    return buildDefaultBeanName(definition, registry);
}
```

看这段源码的实现，整体的逻辑还是非常容易理解的：

1. 只有注解扫描注册进来的 Bean 才会被处理（ `AnnotationBeanNameGenerator` ，看类名 ￣へ￣ ）
2. 既然是注解扫描进来的，那我就要看看有木有在注解中声明好了

> 这种声明方式就是 `@Component("person")`

3. 注解中找不到名，那好吧，我给你构造一个，不过这个名是按照我默认规则来的，你就别挑挑拣拣咯

上面从注解中获取的部分咱留到后面再看，这里咱只看 `buildDefaultBeanName` 的实现。

#### 3.2.3 buildDefaultBeanName的实现

```java
protected String buildDefaultBeanName(BeanDefinition definition, BeanDefinitionRegistry registry) {
    return buildDefaultBeanName(definition);
}

protected String buildDefaultBeanName(BeanDefinition definition) {
    String beanClassName = definition.getBeanClassName();
    Assert.state(beanClassName != null, "No bean class name set");
    String shortClassName = ClassUtils.getShortName(beanClassName);
    return Introspector.decapitalize(shortClassName);
}
```

一路走到最底下的方法中，它会根据组件类的全限定名，截取出短类名（如 `com.linkedbear.Person` → `Person` ），最后用一个叫 `Introspector` 的类，去生成 bean 的名称。那想必这个 `Introspector.decapitalize` 方法肯定就可以把类名的首字母转为小写咯，点进去发现确实如此：

```java
public static String decapitalize(String name) {
    if (name == null || name.length() == 0) {
        return name;
    }
    if (name.length() > 1 && Character.isUpperCase(name.charAt(1)) &&
        Character.isUpperCase(name.charAt(0))){
        return name;
    }
    char chars[] = name.toCharArray();
    // 第一个字母转小写
    chars[0] = Character.toLowerCase(chars[0]);
    return new String(chars);
}
```

原理实现看完了，小伙伴们肯定有一个疑惑：`Introspector` 是个什么鬼哦？？

#### 3.2.4 Java的内省机制【扩展】

说到这个**内省**，或许好多小伙伴都没听说过。其实**它是 JavaSE 中就有的，对 JavaBean 中属性的默认处理规则**。

回想一下咱写的所有模型类，包括 vo 类，是不是都是写好了属性，之后借助 IDE 生成 `getter` 和 `setter` ，或者借助 `Lombok` 的注解生成 `getter` 和 `setter` ？其实这个生成规则，就是利用了 Java 的内省机制。

**Java 的内省默认规定，所有属性的获取方法以 get 开头（ boolean 类型以 is 开头），属性的设置方法以 set 开头。**根据这个规则，才有的默认的 getter 和 setter 方法。

`Introspector` 类是 Java 内省机制中最核心的类之一，它可以进行很多默认规则的处理（包括获取类属性的 get / set 方法，添加方法描述等），当然它也可以处理这种类名转 beanName 的操作。SpringFramework 深知这个设计之妙，就直接利用过来了。

有关更多的 Java 内省机制，小伙伴们可以搜索相关资料学习，小册不多展开讲解了（这部分适当了解即可）。

