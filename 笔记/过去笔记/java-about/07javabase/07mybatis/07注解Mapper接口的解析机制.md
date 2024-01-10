---
title: 07注解Mapper接口的解析机制
---

## 1. 注册Mapper接口

在 MyBatis 全局配置文件的解析时，解析 `<mapper>` 标签的阶段中，有两处是处理 Mapper 接口的：（注意源码中标注的【注意看这里】

```java
private void mapperElement(XNode parent) throws Exception {
    if (parent != null) {
        for (XNode child : parent.getChildren()) {
            // 包扫描Mapper接口
            if ("package".equals(child.getName())) {
                String mapperPackage = child.getStringAttribute("name");
                // 【注意看这里】
                configuration.addMappers(mapperPackage);
            } else {
                // ......
                } else if (resource == null && url == null && mapperClass != null) {
                    // 注册单个Mapper接口
                    // 【注意看这里】
                    Class<?> mapperInterface = Resources.classForName(mapperClass);
                    configuration.addMapper(mapperInterface);
                } // ......
            }
        }
    }
}
```

这两个位置，是会将 Mapper 接口注册到全局 `Configuration` 中的！

### 1.1 addMapper

我们看看 `addMapper` 都做了什么吧，`addMappers` 方法的套路肯定是一堆 `addMapper` 方法嘛，核心还是走 `addMapper` ：

```java
protected final MapperRegistry mapperRegistry = new MapperRegistry(this);

public <T> void addMapper(Class<T> type) {
    mapperRegistry.addMapper(type);
}
```

注意看，它利用了一个 `MapperRegistry` 去注册和管理 MyBatis 中的所有 Mapper 接口（学习了 Spring 小册的小伙伴是不是可以联想到 `BeanDefinitionRegistry` 呢？），它的底层一定是一个 `Map` 吧（那是当然）！我们重点来看 `MapperRegistry` 的 `addMapper` 方法，这里面还是有些道道的：（重要注释已标注在源码中）

```java
public <T> void addMapper(Class<T> type) {
  // 只有接口才会解析
  if (type.isInterface()) {
    // 重复注册的检查
    if (hasMapper(type)) {
      throw new BindingException("Type " + type + " is already known to the MapperRegistry.");
    }
    boolean loadCompleted = false;
    try {
      // 记录在Map中，留意value的类型是MapperProxyFactory
      knownMappers.put(type, new MapperProxyFactory<>(type));
      // It's important that the type is added before the parser is run
      // otherwise the binding may automatically be attempted by the
      // mapper parser. If the type is already known, it won't try.
      MapperAnnotationBuilder parser = new MapperAnnotationBuilder(config, type);
      // 利用MapperAnnotationBuilder解析Mapper接口
      parser.parse();
      loadCompleted = true;
    } finally {
      if (!loadCompleted) {
        knownMappers.remove(type);
      }
    }
  }
}
```

> It's important that the type is added before the parser is run otherwise the binding may automatically be attempted by the mapper parser. If the type is already known, it won't try.
>
> 重要的是，必须在运行 Mapper 解析器之前添加 Mapper 接口类型，否则 Mapper 的解析器可能会自动尝试进行绑定。如果 Mapper 类型是已知的，则不会尝试。

这个地方提到的 “运行 Mapper 解析器之前添加 Mapper 接口类型” 如何理解呢？其实就是上面代码中的 `knownMappers.put(type, new MapperProxyFactory<>(type));` 与 `parser.parse();` 

下面我们要详细解析的 `MapperAnnotationBuilder` 了，它是解析 Mapper 接口的核心 API 。

### 1.2 MapperAnnotationBuilder

`bindMapperForNamespace` 的小节中就提到了用于解析 Mapper 接口的解析类 `MapperAnnotationBuilder` ，这里 MyBatis 就是利用的它，去解析 Mapper 接口的。

#### 1.2.1 内部成员

首先我们还是先来看一下内部结构，因为它是专门解析 Mapper 接口中的注解的，所以它不会继承 `XMLMapperBuilder` ，不过必要的 `Configuration` 和 `MapperBuilderAssistant` 倒是都有啦：

```java
public class MapperAnnotationBuilder {
    private final Configuration configuration;
    private final MapperBuilderAssistant assistant;
    private final Class<?> type;
    
    public MapperAnnotationBuilder(Configuration configuration, Class<?> type) {
        String resource = type.getName().replace('.', '/') + ".java (best guess)";
        this.assistant = new MapperBuilderAssistant(configuration, resource);
        this.configuration = configuration;
        this.type = type;
    }
  
  .....
    
}
```

不过它的功能跟 `XMLConfigBuilder` 、`XMLMapperBuilder` 相似，解析 Mapper 接口都是一个 Builder 负责一个，所以每解析一个 Mapper 接口，就要 new 一个全新的 `MapperAnnotationBuilder` 。同样的，`MapperBuilderAssistant` 在 `MapperAnnotationBuilder` 构造时就已经创建。

#### 1.2.2 核心parse方法

最重要的还是工作的核心方法 `parse` （貌似这些 Builder 的核心工作方法都叫 `parse` 哦），这里面还是分为几个步骤的，小册先把注释标注在源码上，重要的环节我们再逐条拆解：

```java
public void parse() {
    String resource = type.toString();
    // 2. 检查接口是否已经加载
    if (!configuration.isResourceLoaded(resource)) {
      // 加载Mapper接口对应的mapper.xml
      loadXmlResource();
      configuration.addLoadedResource(resource);
      assistant.setCurrentNamespace(type.getName());
      // 3. 解析注解配置的缓存
      parseCache();
      parseCacheRef();
      // 解析Mapper方法
      Method[] methods = type.getMethods();
      for (Method method : methods) {
        try {
          // issue #237
          if (!method.isBridge()) {
            // 4. 构造statement
            parseStatement(method);
          }
        } catch (IncompleteElementException e) {
          configuration.addIncompleteMethod(new MethodResolver(this, method));
        }
      }
    }
    parsePendingMethods();
  }
```

，整个思路其实跟解析 mapper.xml 大同小异，这里它是根据接口去找对应的 mapper.xml ，解析 mapper.xml 的时候也会去绑定对应的 Mapper 接口，下面的那些动作，跟解析 mapper.xml 的也大差不离。

## 2. 解析对应的mapper.xml

首先一上来，它会先把当前要解析的 Mapper 接口全限定名，对应的 mapper.xml 找出来解析。

### 2.1 重复加载的检查

注意看一下源码，它在加载对应的 mapper.xml 之前会先检查一下该接口是否已经加载：

```java
    String resource = type.toString();
    if (!configuration.isResourceLoaded(resource)) {
        loadXmlResource();
```

`loadXmlResource` 方法会**检查 mapper.xml 中的 namespace 对应的 Mapper 接口是否已经加载**，但请注意这里的检查规则，它是**直接检查的 Mapper 接口全限定名**哦，下一句的 **`loadXmlResource` 方法中才是判断 namespace** 的：

```java
  private void loadXmlResource() {
    // Spring may not know the real resource name so we check a flag
    // to prevent loading again a resource twice
    // this flag is set at XMLMapperBuilder#bindMapperForNamespace
    if (!configuration.isResourceLoaded("namespace:" + type.getName())) {
      // 注意上面的判断多了一个namespace的前缀
      String xmlResource = type.getName().replace('.', '/') + ".xml";
      // #1347
      InputStream inputStream = type.getResourceAsStream("/" + xmlResource);
      if (inputStream == null) {
        // Search XML mapper that is not in the module but in the classpath.
        try {
          inputStream = Resources.getResourceAsStream(type.getClassLoader(), xmlResource);
        } catch (IOException e2) {
          // ignore, resource is not required
        }
      }
      if (inputStream != null) {
        XMLMapperBuilder xmlParser = 
          new XMLMapperBuilder(inputStream, assistant.getConfiguration(), 
                               xmlResource, configuration.getSqlFragments(), type.getName());
        xmlParser.parse();
      }
    }
  }
```

为什么非要判断两次呢？想必小伙伴的心里也有答案了吧：

- 检查 Mapper 接口全限定名，是**怕我们真的重复配置 Mapper 接口**
  - 实际情况下可能会出现一种情况，单独配置了某个 Mapper 接口，后来配置 Mapper 扫描的时候又把它扫描进来了，这样就引发 Mapper 接口的重复注册了
- 检查带着 namespace 前缀的 Mapper 接口全限定名，是**为了避免重复加载 mapper.xml** 的问题
  - mapper.xml 中配置了相同的 Mapper 接口名，在 MyBatis 初始化的时候先加载了 mapper.xml ，顺便记录了对应的 Mapper 接口，后来包扫描的时候又把这个 Mapper 接口扫描到了，这样也会引发 Mapper 接口的重复注册

### 2.2 加载mapper.xml

```java
private void loadXmlResource() {
    // Spring may not know the real resource name so we check a flag
    // to prevent loading again a resource twice
    // this flag is set at XMLMapperBuilder#bindMapperForNamespace
    if (!configuration.isResourceLoaded("namespace:" + type.getName())) {
        String xmlResource = type.getName().replace('.', '/') + ".xml";
        InputStream inputStream = type.getResourceAsStream("/" + xmlResource);
        if (inputStream == null) {
            // Search XML mapper that is not in the module but in the classpath.
            try {
                inputStream = Resources.getResourceAsStream(type.getClassLoader(), xmlResource);
            } catch (IOException e2) {
                // ignore, resource is not required
            }
        }
        if (inputStream != null) {
            XMLMapperBuilder xmlParser = new XMLMapperBuilder(inputStream, 
                    assistant.getConfiguration(), xmlResource, 
                                  configuration.getSqlFragments(), type.getName());
            xmlParser.parse();
        }
    }
}
```

：首先它将 Mapper 接口的全限定名中的 . 改为 / ，并拼上 .xml 的后缀，然后尝试加载一下，如果加载不到，拉倒（注释中标注了，mapper.xml 不是必需的），如果能加载到，那就新构造一个 `XMLMapperBuilder` ，并解析对应的 mapper.xml 。

## 3. 解析注解配置的缓存

接下来的重点部分是解析缓存配置了，这里着重强调的是二级缓存，

```java
  // 3. 解析注解配置的缓存
    parseCache();
    parseCacheRef();
```

首先是二级缓存的配置，可以发现它是检查 Mapper 接口有没有标注 `@CacheNamespace` 注解，如果有的话再处理：

```java
private void parseCache() {
    CacheNamespace cacheDomain = type.getAnnotation(CacheNamespace.class);
    if (cacheDomain != null) {
        // ......
    }
}
```

同样的，二级缓存引用的配置，是检查 Mapper 接口上有没有 `@CacheNamespaceRef` 注解：

```java
private void parseCacheRef() {
    CacheNamespaceRef cacheDomainRef = type.getAnnotation(CacheNamespaceRef.class);
    if (cacheDomainRef != null) {
        // ......
    }
}
```

## 4. 解析Mapper方法的ResultMap

接下来是解析 Mapper 接口中的方法了，这里面有一种比较特殊的配置，就是使用注解组合定义 `ResultMap` ：

```java
// 解析Mapper方法
Method[] methods = type.getMethods();
for (Method method : methods) {
  try {
    // issue #237
    if (!method.isBridge()) {
      // 4. 构造statement
      parseStatement(method);
    }
  } catch (IncompleteElementException e) {
    configuration.addIncompleteMethod(new MethodResolver(this, method));
  }
}
```

解析 `@ResultMap` 是基于方法的（毕竟每个方法都可能定义新的结果集映射规则），我们先来快速过一遍源码的总体逻辑（关键注释已标注在源码中）：

```java

  private String parseResultMap(Method method) {
    // 5.1 解析方法返回值
    Class<?> returnType = getReturnType(method);
    // 获取结果集封装引用的构造器参数定义（类比于<resultMap>中的<constructor>标签）
    Arg[] args = method.getAnnotationsByType(Arg.class);
    // 获取结果集映射规则
    Result[] results = method.getAnnotationsByType(Result.class);
    // 获取类型鉴别器（类比于<discriminator>标签）
    TypeDiscriminator typeDiscriminator = method.getAnnotation(TypeDiscriminator.class);
    // 5.2 生成ResultMap的名称
    String resultMapId = generateResultMapName(method);
    // 5.3 构造ResultMap
    applyResultMap(resultMapId, returnType, args, results, typeDiscriminator);
    return resultMapId;
  }
```

可以发现，大体的逻辑，跟解析 mapper.xml 中的 `resultMapElements` 步骤类似，下面我们还是分步来解析源码中的关键步骤。

### 4.1 解析返回值

本来吧，对于 Mapper 接口而言，返回值就已经定义在方法上了，应该也不用再解析了，直接取 `method.getReturnType()` 方法就可以吧！其实这远远没有我们想的那么简单，我们可以先来举几个例子：

- 返回数组怎么办？
- 返回 `List<T>` / `Set<T>` 怎么办？
- 返回 `Map<K, V>` 怎么办？
- 返回 `Optional<T>` 怎么办？

对比起 mapper.xml 中的 `resultType` 可以直接写实体类的全限定类名，是不是发现 Mapper 接口方法的返回值并不能直接拿来用了？因为方法的返回值类型实在是太多了，MyBatis 需要针对这些情况一一处理。

#### 4.1.1 解析实体模型类

`getReturnType` 方法的第一个 if 分支就是判断返回值是否为普通的实体类：

```java
private Class<?> getReturnType(Method method) {
    Class<?> returnType = method.getReturnType();
    Type resolvedReturnType = TypeParameterResolver.resolveReturnType(method, type);
    if (resolvedReturnType instanceof Class) {
        returnType = (Class<?>) resolvedReturnType;
        if (returnType.isArray()) {
            returnType = returnType.getComponentType();
        }
        // gcode issue #508
        if (void.class.equals(returnType)) {
            ResultType rt = method.getAnnotation(ResultType.class);
            if (rt != null) {
                returnType = rt.value();
            }
        }
// .... 
```

可以看出，只要返回值属于 `Class<?>` 类型，MyBatis 都会认定是我们自己定义的实体类，不过这里面还有两种特殊情况：实体类数组的话，会取出当中具体的实体类型；如果是返回 void 的话，MyBatis 会使用 `@ResultType` 注解的类型当做返回值类型。这部分比较简单，也很好理解。

#### 4.1.2 解析单列集合泛型

接下来要解析泛型了，上面我们举的例子中提到过，`List` 、`Set` 等集合有泛型，`Optional` 也是有泛型的，所以这几种情况需要分别处理。

首先我们看到的 else-if 结构中，下面的这段源码是处理单列集合 ( `Collection` ) 和 `Cursor` 游标的：（源码中有部分注释）

```java
 } else if (resolvedReturnType instanceof ParameterizedType) {
        // 取出泛型的类型
        ParameterizedType parameterizedType = (ParameterizedType) resolvedReturnType;
        Class<?> rawType = (Class<?>) parameterizedType.getRawType();
        if (Collection.class.isAssignableFrom(rawType) || Cursor.class.isAssignableFrom(rawType)) {
            Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
            // 注意这里只会处理泛型个数为1个的
            if (actualTypeArguments != null && actualTypeArguments.length == 1) {
                Type returnTypeParameter = actualTypeArguments[0];
                // 泛型类型为实体模型类
                if (returnTypeParameter instanceof Class<?>) {
                    returnType = (Class<?>) returnTypeParameter;
                }
                // 套娃泛型
                else if (returnTypeParameter instanceof ParameterizedType) {
                    // (gcode issue #443) actual type can be a also a parameterized type
                    returnType = (Class<?>) ((ParameterizedType) returnTypeParameter).getRawType();
                }
                // 泛型数组
                else if (returnTypeParameter instanceof GenericArrayType) {
                    Class<?> componentType = 
                      (Class<?>) ((GenericArrayType) returnTypeParameter).getGenericComponentType();
                    // (gcode issue #525) support List<byte[]>
                    returnType = Array.newInstance(componentType, 0).getClass();
                }
            }
```

注意下面的大 if 结构中，中间有一个套娃泛型，这其实说的是类似这种情况：`List<List<T>>` （类似于二维数组）（当然小册只是举一个栗子），这种情况最终我们应该获取到的是里面的 T ，而不是外头的 `List<T>` ；最下面的泛型数组，最常见的就是 `byte[]` 了，源码中的注释也是说了，这是专门为了支持 `byte[]` 而添加的额外判断分支。

#### 4.1.3 解析Map集合泛型

对于 `Map` 来讲，value 列肯定是数据库中查询出来的数据对象，但 key 是啥呢？哎，这个地方是细节吧，key 通常来讲肯定是主键没错了，但 MyBatis 不知道谁是主键呀，所以需要我们告诉它，而告诉它的方法是在定义好的 ResultMap 方法上标注 `@MapKey` 注解。

下面是一个简单的示例，用这种方式可以将查询结果封装为 `Map` 。

```java
    @MapKey("id")
    @ResultType(Department.class)
    @Select("select * from tbl_department")
    Map<String, Department> findAllUseMap();
```

了解了返回 `Map` 的方式，下面我们就可以看源码的处理逻辑了：

```java
} else if (method.isAnnotationPresent(MapKey.class) && Map.class.isAssignableFrom(rawType)) {
  // (gcode issue 504) Do not look into Maps if there is not MapKey annotation
  Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
  // 泛型个数必须为2个
  if (actualTypeArguments != null && actualTypeArguments.length == 2) {
    // 解析第1个，即value类型
    Type returnTypeParameter = actualTypeArguments[1];
    if (returnTypeParameter instanceof Class<?>) {
      returnType = (Class<?>) returnTypeParameter;
    } else if (returnTypeParameter instanceof ParameterizedType) {
      // (gcode issue 443) actual type can be a also a parameterized type
      returnType = (Class<?>) ((ParameterizedType) returnTypeParameter).getRawType();
    }
  }
```

注意第一行，它必须要同时满足返回值为 `Map` ，并且方法上有 `@MapKey` 注解的标注，这样才算一个有效的 ResultMap 定义。解析的逻辑中，它主要是处理 value 的类型，而这个解析类型跟上面解析单列集合的套路基本一致，咱就不多啰嗦了。

#### 4.1.4 解析Optional类型

最后一部分是对 jdk8 中引入的 `Optional` 类型单独处理：

```java
        } else if (Optional.class.equals(rawType)) {
            Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
            Type returnTypeParameter = actualTypeArguments[0];
            if (returnTypeParameter instanceof Class<?>) {
                returnType = (Class<?>) returnTypeParameter;
            }
        }
    }

    return returnType;
}
```

这里面的解析依然是非常简单，只不过这里面不可能出现套娃泛型，以及泛型数组的情况了。

最后我们简单总结一下这一段源码解析的思路，无非就是为了获取类似于 mapper.xml 中定义的 `parameterType` ，只不过因为 Mapper 接口中的返回值类型情况有点多，MyBatis 为了顾及所有可能出现的情况，在底层设计了足够多的解析逻辑罢了。



### 4.2 生成ResultMap的名称

解析完返回值之后，之后又解析了 `@Arg` 注解、`@Result` 注解、`@TypeDiscriminator` 注解，然后一个比较大的动作是生成 ResultMap 的名称，也就是 `resultMapId` ，这个 id 类比于 mapper.xml 中的【 namespace + `<resultMap>` 标签中的 id 】。

```java
  private String generateResultMapName(Method method) {
    Results results = method.getAnnotation(Results.class);
    // 有定义，直接取
    if (results != null && !results.id().isEmpty()) {
      return type.getName() + "." + results.id();
    }
    // 没有定义，自动生成
    StringBuilder suffix = new StringBuilder();
    for (Class<?> c : method.getParameterTypes()) {
      suffix.append("-");
      suffix.append(c.getSimpleName());
    }
    if (suffix.length() < 1) {
      suffix.append("-void");
    }
     return type.getName() + "." + method.getName() + suffix;
  }
```

在演示 `@Results` 注解的时候就发现了，这个注解可以声明 id 属性，它就相当于 `<resultMap>` 标签的 id ，那么它最终生成的 resultMapId 就是 【 Mapper 接口的全限定名 + `@Results` 注解声明的 id 属性】。

但还有没定义的情况，它会利用 OOP 的方法重载特性，直接取方法的参数列表类型并组装起来，以构成 ResultMap 的 id 

- `List<Department> findAll()` ：`findAll-void`
- `Department findById(String id)` ：`findById-String`
- `List<User> findByUsernameAndPassword(String username, String password)` ：`findByUsernameAndPassword-String-String`

### 4.3 构造ResultMap

上面的准备工作都就绪了，下面就可以构造 `ResultMap` 对象了。这个构建的 `ResultMap` 对象，跟解析 mapper.xml 的那个 `ResultMap` 对象是一样的，与 mapper.xml 中封装构建 `ResultMap` 不同，Mapper 接口的处理稍有不同：

```java
  private void applyResultMap(String resultMapId, Class<?> returnType, Arg[] args, 
                              Result[] results, TypeDiscriminator discriminator) {
    // 处理resultMapping
    List<ResultMapping> resultMappings = new ArrayList<>();
    applyConstructorArgs(args, returnType, resultMappings);
    applyResults(results, returnType, resultMappings);
    // 处理鉴别器
    Discriminator disc = applyDiscriminator(resultMapId, returnType, discriminator);
    // TODO add AutoMappingBehaviour
    // 构造ResultMap
    assistant.addResultMap(resultMapId, returnType, null, disc, resultMappings, null);
    createDiscriminatorResultMaps(resultMapId, returnType, discriminator);
  }
```

1、首先是 resultMapping 的处理，还记得之前在 mapper.xml 中什么时机解析的 `<result>` 标签吗？在解析 mapper.xml 中，它会取出那些 `<resultMap>` 标签，并逐个解析子标签，这里面就有解析 `<id>` 、`<result>` 标签的逻辑。在 Mapper 接口中，它选择在此处处理：

```java
    List<ResultMapping> resultMappings = new ArrayList<>();
    applyConstructorArgs(args, returnType, resultMappings);
    applyResults(results, returnType, resultMappings);
```

可见处理的思路是一样的，都是取构造器参数，和不同的属性映射关系。

2、鉴别器的处理，mapper.xml 中使用鉴别器，用的是 `<case>` 标签，对应的 Mapper 接口中用的就是 `@Case` 注解。具体 Mapper 接口中如何使用鉴别器，小册就不展开了，估计阅读小册的你们连这家伙本身都不用

3、构造 ResultMap ，这里没有再用之前 mapper.xml 中那么“做作”的手段（当然人家做作是有原因的），而是直接借助 `MapperBuilderAssistant` 构建了，至于原因嘛，各位可以想一下，Mapper 接口中的 ResultMap 在一定义时，是不是**基本的元素就都有了**？不会像 mapper.xml 那样出现一些元素不全、漏写的问题吧！所以在这里大可不必做兜底处理，直接构造即可。

## 5. 构造statement

最后的部分才是本章的核心（压轴？！），那就是解析我们定义的那些 statement 方法了：

```java
    try {
        // 5. 构造statement
        parseStatement(method);
    } catch (IncompleteElementException e) {
        configuration.addIncompleteMethod(new MethodResolver(this, method));
    }
```

这个方法超级复杂，直接一次性贴出源码有点不大合适，

### 5.1 解析参数类型

```java
void parseStatement(Method method) {
    final Class<?> parameterTypeClass = getParameterType(method);
    final LanguageDriver languageDriver = getLanguageDriver(method);
    // ......
```

一上来第一句代码就是复杂逻辑，它要先把这个 statement 的入参类型提取出来。有关入参的类型，大概有以下几种：

- `List<Department> findAll()` → 无入参
- `Department findById(String id)` → 单参数
- `List<User> findByUsernameAndPassword(String username, String password)` → 多参数

针对这几种情况，MyBatis 会指定不同的入参类型，下面我们来看源码中的实现：

```java
  private Class<?> getParameterType(Method method) {
    Class<?> parameterType = null;
    Class<?>[] parameterTypes = method.getParameterTypes();
    for (Class<?> currentParameterType : parameterTypes) {
      if (!RowBounds.class.isAssignableFrom(currentParameterType) && 
          !ResultHandler.class.isAssignableFrom(currentParameterType)) {
        if (parameterType == null) {
          parameterType = currentParameterType;
        } else {
          // issue #135
          parameterType = ParamMap.class;
        }
      }
    }
    return parameterType;
  }
```

通过简单的推演，可以大概判断出上面提到的三种情况，最终获取到的 parameterType 为：

- 无入参 → null
- 单参数 → `Class<?>`
- 多参数 → `ParamMap.class`

另外注意一个小细节，它会过滤掉 `RowBounds` （内存分页用）以及 `ResultHandler` （自定义处理查询结果）类型的参数，原因也很简单，它们不会参与实际的 SQL 拼接中。

### 5.2 解析statement方法

```java
      // 生成statementId
      final String mappedStatementId = type.getName() + "." + method.getName();
      Integer fetchSize = null;
      Integer timeout = null;
      StatementType statementType = StatementType.PREPARED;
      ResultSetType resultSetType = configuration.getDefaultResultSetType();
      SqlCommandType sqlCommandType = getSqlCommandType(method);
      boolean isSelect = sqlCommandType == SqlCommandType.SELECT;
      boolean flushCache = !isSelect;
      boolean useCache = isSelect;

      KeyGenerator keyGenerator;
      String keyProperty = null;
      String keyColumn = null;
      // 处理KeyGenerator
      if (SqlCommandType.INSERT.equals(sqlCommandType) || SqlCommandType.UPDATE.equals(sqlCommandType)) {
        // first check for SelectKey annotation - that overrides everything else
        SelectKey selectKey = method.getAnnotation(SelectKey.class);
        if (selectKey != null) {
          keyGenerator = 
           handleSelectKeyAnnotation(selectKey, mappedStatementId, getParameterType(method), languageDriver);
          keyProperty = selectKey.keyProperty();
        } else if (options == null) {
          keyGenerator = 
            configuration.isUseGeneratedKeys() ? Jdbc3KeyGenerator.INSTANCE : NoKeyGenerator.INSTANCE;
        } else {
          keyGenerator = options.useGeneratedKeys() ? Jdbc3KeyGenerator.INSTANCE : NoKeyGenerator.INSTANCE;
          keyProperty = options.keyProperty();
          keyColumn = options.keyColumn();
        }
      } else {
        keyGenerator = NoKeyGenerator.INSTANCE;
      }

		 // 处理其他的配置
      if (options != null) {
        if (FlushCachePolicy.TRUE.equals(options.flushCache())) {
          flushCache = true;
        } else if (FlushCachePolicy.FALSE.equals(options.flushCache())) {
          flushCache = false;
        }
        useCache = options.useCache();
        fetchSize = options.fetchSize() > -1 || 
          options.fetchSize() == Integer.MIN_VALUE ? options.fetchSize() : null; //issue #348
        timeout = options.timeout() > -1 ? options.timeout() : null;
        statementType = options.statementType();
        if (options.resultSetType() != ResultSetType.DEFAULT) {
          resultSetType = options.resultSetType();
        }
      }
```

通读下来，是不是感觉思路倒是挺清晰的？虽然前面我们没有展开 mapper.xml 的 statement 解析，不过各位也不用担心，小册会在后面的生命周期部分，详细的讲解这两种 statement 的解析和构建的。之所以这里先给各位简单展开，是考虑到注解 statement 的定义解析相对简单一些，理解起来也容易一点。

整段源码没有特别难的部分，最重要的一步是第一行的 `buildSqlSource` 方法，这个方法很复杂，小册放到后面的生命周期部分再讲解。

### 5.3 处理statement的配置

```java
      // 处理resultMapId
      String resultMapId = null;
      // 4. 解析注解配置的ResultMap
      ResultMap resultMapAnnotation = method.getAnnotation(ResultMap.class);
      if (resultMapAnnotation != null) {
        resultMapId = String.join(",", resultMapAnnotation.value());
      } else if (isSelect) {
        resultMapId = parseResultMap(method);
      }
```

### 5.4 生成MappedStatement

```java
    // ......
    assistant.addMappedStatement(
        mappedStatementId,
        sqlSource,
        statementType,
        sqlCommandType,
        fetchSize,
        timeout,
        // ParameterMapID
        null,
        parameterTypeClass,
        resultMapId,
        getReturnType(method),
        resultSetType,
        flushCache,
        useCache,
        // TODO gcode issue #577
        false,
        keyGenerator,
        keyProperty,
        keyColumn,
        statementAnnotation.getDatabaseId(),
        languageDriver,
        // ResultSets
        options != null ? nullOrEmpty(options.resultSets()) : null);
    });
}
```



