---
title: 16IOC进阶-资源管理
---

前面咱在学习 `ApplicationContext` 的章节中，有看到 `ClassPathXmlApplicationContext` 的直接父类 `AbstractXmlApplicationContext` 中组合了一个 `XmlBeanDefinitionReader` 组件来解析 xml 配置文件。其中，`XmlBeanDefinitionReader` 接收的 xml 配置文件是一组 **`Resource`** ：

```java
protected void loadBeanDefinitions(XmlBeanDefinitionReader reader) throws BeansException, IOException {
    Resource[] configResources = getConfigResources();
    if (configResources != null) {
        reader.loadBeanDefinitions(configResources);
    }
    // ......
}
```

这个 **`Resource`** 就是 SpringFramework 中定义的资源模型。这一章咱就来学习 SpringFramework 中的资源管理部分。

> 本章基本上没什么代码，对于实际开发中可能重要程度不是非常高，小伙伴们以了解为主即可。

## 1. SpringFramework为什么要自己造【了解】

一看到资源管理，或许会有小伙伴立马想到 `ClassLoader` 的 `getResource` 和 `getResourceAsStream` 方法，它们本身就是 jdk 内置的加载资源文件的方式。然而 SpringFramework 中并没有直接拿它的这一套，而是自己重新造了一套比原生 jdk 更强大的资源管理。既然是造了，那就肯定有原因（人家的挺好你为啥不用呢，肯定是你觉得它不好），而这个原因，咱们可以翻看 SpringFramework 的官方文档：

[https://docs.spring.io/spring/docs/5.2.x/spring-framework-r](https://docs.spring.io/spring/docs/5.2.x/spring-framework-reference/core.html#resources-introduction)

原文咱就不在这里贴了，概述一下就是说，jdk 原生的 URL 那一套资源加载方式，对于加载 classpath 或者 `ServletContext` 中的资源来说没有标准的处理手段，而且即便是实现起来也很麻烦，倒不如我自己写一套。（大佬就是强啊）

如果对比原生 jdk 和 SpringFramework 中的资源管理，可能 SpringFramework 的资源管理真的要更强大吧，下面咱来了解下 SpringFramework 中定义的资源模型都有什么结构，分别负责哪些功能。

## 2. SpringFramework中的资源模型【了解】

![image-20220502210012071](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220502210012.png)

可以发现，SpringFramework 中资源模型最顶级的其实不是 `Resource` ，而是一个叫 `InputStreamSource` 的接口：

#### 2.1 InputStreamSource

```java
public interface InputStreamSource {
	InputStream getInputStream() throws IOException;
}
	
```

这个接口只有一个 `getInputStream` 方法，很明显它表达了一件事情：实现了 `InputStreamSource` 接口的实现类，都可以从中取到资源的输入流。

#### 2.2 Resource

然后就是 `InputStreamSource` 的子接口 `Resource` 了，它的文档注释中有写到这么一句话：

> Interface for a resource descriptor that abstracts from the actual type of underlying resource, such as a file or class path resource.
>
> 它是资源描述符的接口，它可以从基础资源的实际类型中抽象出来，例如文件或类路径资源。

这个翻译看起来很生硬，不过咱只需要关注到一个点：**文件或类路径的资源**，仅凭这一个点，咱就可以说，`Resource` 确实更适合 SpringFramework 做资源加载（配置文件通常都放到类路径下）。

#### 2.3 EncodedResource

在 `Resource` 的旁边，有一个 `EncodedResource` 直接实现了 `InputStreamSource` 接口，从类名上也能看得出来它是编码后的资源。通过源码，发现它内部组合了一个 `Resource` ，说明它本身并不是直接加载资源的。

```java
public class EncodedResource implements InputStreamSource {
	private final Resource resource;
    // ......
```

#### 2.4 WritableResource

继续往下看，自打 SpringFramework 3.1 之后，`Resource` 有了一个新的子接口：`WritableResource` ，它代表着“可写的资源”，那 `Resource` 就可以理解为“可读的资源”（有木有想起来 `BeanFactory` 与 `ConfigurableBeanFactory` ？）。

#### 2.5 ContextResource

跟 `WritableResource` 并列的还有一个 `ContextResource` ，看到类名是不是突然一阵狂喜？它肯定是跟 `ApplicationContext` 有关系吧！打开源码，看一眼文档注释

> Extended interface for a resource that is loaded from an enclosing 'context', e.g. from a javax.servlet.ServletContext but also from plain classpath paths or relative file system paths (specified without an explicit prefix, hence applying relative to the local ResourceLoader's context).
>
> 从一个封闭的 “上下文” 中加载的资源的扩展接口，例如来自 `javax.servlet.ServletContext` ，也可以来自普通的类路径路径或相对的文件系统路径（在没有显式前缀的情况下指定，因此相对于本地 `ResourceLoader` 的上下文应用）。

emmm它是跟 `ServletContext` 有关的？那跟 `ApplicationContext` 没关系咯。。。是的，它强调的是从一个**封闭的 “上下文” 中加载**，这其实就是说像 `ServletContext` 这种域（当然文档也说了只是举个例子）。

以上就是 SpringFramework 中设计的资源模型，不过平时咱用的只有 `Resource` 接口而已

## 3. SpringFramework中的资源模型实现【熟悉】

说完了接口，下面说说实现类。不过在说实现类之前，咱先说另外一件事，就是 Java 原生的资源加载方式。

### 3.1 Java原生资源加载方式

回想一下，Java 原生能加载到哪些地方的资源？应该大致上分 3 种吧：

- 借助 ClassLoader 加载类路径下的资源
- 借助 File 加载文件系统中的资源
- 借助 URL 和不同的协议加载本地 / 网络上的资源

这三种方式基本上就囊括了大部分的加载方式了。为什么要提它呢？那是因为，SpringFramework 中的资源模型实现，就是这三种的体现。

### 3.2 SpringFramework的实现

SpringFramework 分别对上面提到的这三种情况提供了三种不同的实现：

- ClassLoader → ClassPathResource [ classpath:/ ]
- File → FileSystemResource [ file:/ ]
- URL → UrlResource [ xxx:/ ]

注意每一行最后的方括号，它代表的是资源路径的前缀：如果是 **classpath** 开头的资源路径，SpringFramework 解析到后会自动去类路径下找；如果是 **file** 开头的资源路径，则会去文件系统中找；如果是 URL 支持的协议开头，则底层会使用对应的协议，去尝试获取相应的资源文件。

除了这三种实现，还有对应于 `ContextResource` 的实现：`ServletContextResource` ，它意味着资源是去 `ServletContext` 域中寻找。

## 4. SpringFramework加载资源的方式【了解】

`ResourcePatternResolver` ，它的父接口 `ResourceLoader` 就是那个真正负责加载资源的角色。`AbstractApplicationContext` 中，通过类继承关系可以得知它继承了 `DefaultResourceLoader` ，也就是说，**`ApplicationContext` 具有加载资源的能力**。

下面咱简单了解一下 `DefaultResourceLoader` 是如何根据一个路径，加载到相应的资源的。

### 4.1 DefaultResourceLoader组合了一堆ProtocolResolver

```java
private final Set<ProtocolResolver> protocolResolvers = new LinkedHashSet<>(4);

public Resource getResource(String location) {
    Assert.notNull(location, "Location must not be null");

    for (ProtocolResolver protocolResolver : getProtocolResolvers()) {
        Resource resource = protocolResolver.resolve(location, this);
        if (resource != null) {
            return resource;
        }
    }
    // ......
}
```

这一段，它会先取它内部组合的几个 `ProtocolResolver` 来尝试着加载资源，而这个 `ProtocolResolver` 的设计也是跟 `ResourceLoader` 有关。

#### 4.1.1 ProtocolResolver

它的设计倒是蛮简单了：

```java
// @since 4.3
@FunctionalInterface
public interface ProtocolResolver {
	Resource resolve(String location, ResourceLoader resourceLoader);
}
```

它只有一个接口，而且是在 SpringFramework 4.3 版本才出现的（蛮年轻哦），它本身可以搭配 `ResourceLoader` ，在 `ApplicationContext` 中实现**自定义协议的资源加载**，但它还可以脱离 `ApplicationContext` ，直接跟 `ResourceLoader` 搭配即可。这个特性蛮有趣的，咱可以稍微写点代码演示一下效果。

#### 4.1.2 ProtocolResolver使用方式

在工程的 `resources` 目录下新建一个 `Dog.txt` 文件（随便放哪儿都行，只要能找得到），然后写一个 `DogProtocolResolver` ，实现 `ProtocolResolver` 接口：

```java
public class DogProtocolResolver implements ProtocolResolver {

    public static final String DOG_PATH_PREFIX = "dog:";

    @Override
    public Resource resolve(String location, ResourceLoader resourceLoader) {
        if (!location.startsWith(DOG_PATH_PREFIX)) {
            return null;
        }
        // 把自定义前缀去掉
        String realpath = location.substring(DOG_PATH_PREFIX.length());
        String classpathLocation = "classpath:resource/" + realpath;
        return resourceLoader.getResource(classpathLocation);
    }
}
```

然后，编写启动类，分别实例化 `DefaultResourceLoader` 与 `DogProtocolResolver` ，并将 `DogProtocolResolver` 加入到 `ResourceLoader` 中：

```java
public class ProtocolResolverApplication {

    public static void main(String[] args) throws Exception {
        DefaultResourceLoader resourceLoader = new DefaultResourceLoader();
        DogProtocolResolver dogProtocolResolver = new DogProtocolResolver();
        resourceLoader.addProtocolResolver(dogProtocolResolver);
    }
}
```

然后，用 `ResourceLoader` 获取刚编写好的 `Dog.txt` ，并用缓冲流读取：

```java
public static void main(String[] args) throws Exception {
    DefaultResourceLoader resourceLoader = new DefaultResourceLoader();
    DogProtocolResolver dogProtocolResolver = new DogProtocolResolver();
    resourceLoader.addProtocolResolver(dogProtocolResolver);

    Resource resource = resourceLoader.getResource("dog:Dog.txt");
    InputStream inputStream = resource.getInputStream();
    InputStreamReader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
    BufferedReader br = new BufferedReader(reader);
    String readLine;
    while ((readLine = br.readLine()) != null) {
        System.out.println(readLine);
    }
    br.close();
}
```

运行 `main` 方法，控制台打印出 `Dog.txt` 的内容，证明 `DogProtocolResolver` 已经起到了作用：

```
wangwangwang

```

### 4.2 DefaultResourceLoader可自行加载类路径下的资源

```java
public Resource getResource(String location) {
    // ......
    if (location.startsWith("/")) {
        return getResourceByPath(location);
    } else if (location.startsWith(CLASSPATH_URL_PREFIX)) {
        return new ClassPathResource(location.substring(CLASSPATH_URL_PREFIX.length()), getClassLoader());
    }
    // ......
}

```

这部分，且不看上面的 `startsWith` ，只看中间的 else if 部分返回的类型，就知道它能解析类路径下的资源了，而上面的 `getResourceByPath` 方法，点进去发现默认还是加载类路径下：

```java
protected Resource getResourceByPath(String path) {
    return new ClassPathContextResource(path, getClassLoader());
}
```

不过这个不是绝对的，如果小伙伴现在手头的工程还有引入 `spring-web` 模块的 pom 依赖，会发现 `DefaultResourceLoader` 的几个 Web 级子类中有重写这个方法，以 `GenericWebApplicationContext` 为例：

```java
protected Resource getResourceByPath(String path) {
    Assert.state(this.servletContext != null, "No ServletContext available");
    return new ServletContextResource(this.servletContext, path);
}
```

可以发现这里创建的不再是类路径下了，Web 环境下 SpringFramework 更倾向于从 `ServletContext` 中加载。

### 4.3 DefaultResourceLoader可支持特定协议

```java
public Resource getResource(String location) {
    // ......
    else {
        try {
            // Try to parse the location as a URL...
            URL url = new URL(location);
            return (ResourceUtils.isFileURL(url) ? new FileUrlResource(url) : new UrlResource(url));
        }
        catch (MalformedURLException ex) {
            // No URL -> resolve as resource path.
            return getResourceByPath(location);
        }
    }
}
```

如果上面它不能处理类路径的文件，就会尝试通过 URL 的方式加载，这里面包含文件系统的资源，和特殊协议的资源。这里面咱就不进一步深入了，小伙伴们了解 `DefaultResourceLoader` 能加载的资源类型和大体的流程即可。