---
title: 04映射-mapper.xml的解析机制.md
--- 

解析是 mapper ，也就是解析 MyBatis 全局配置文件中，引入的 mapper.xml 的那些路径。而这里面的解析，都是使用一个 **`XMLMapperBuilder`** 的 API 完成的。：

```java
private void mapperElement(XNode parent) throws Exception {
    if (parent != null) {
        for (XNode child : parent.getChildren()) {
            // 包扫描Mapper接口
            if ("package".equals(child.getName())) {
                String mapperPackage = child.getStringAttribute("name");
                configuration.addMappers(mapperPackage);
            } else {
                String resource = child.getStringAttribute("resource");
                String url = child.getStringAttribute("url");
                String mapperClass = child.getStringAttribute("class");
                // 处理resource加载的mapper.xml
                if (resource != null && url == null && mapperClass == null) {
                    ErrorContext.instance().resource(resource);
                    InputStream inputStream = Resources.getResourceAsStream(resource);
                    XMLMapperBuilder mapperParser 
                      = new XMLMapperBuilder(inputStream, configuration,
                                             resource, configuration.getSqlFragments());
                    mapperParser.parse();
                } else if (resource == null && url != null && mapperClass == null) {
                    // 处理url加载的mapper.xml
                    ErrorContext.instance().resource(url);
                    InputStream inputStream = Resources.getUrlAsStream(url);
                    XMLMapperBuilder mapperParser = 
                      new XMLMapperBuilder(inputStream, configuration, url, configuration.getSqlFragments());
                    mapperParser.parse();
                } else if (resource == null && url == null && mapperClass != null) {
                    // 注册单个Mapper接口
                    Class<?> mapperInterface = Resources.classForName(mapperClass);
                    configuration.addMapper(mapperInterface);
                } else {
                    throw new BuilderException("A mapper element may only specify a url, 
                                               resource or class, but not more than one.");
                }
            }
        }
    }
}
```

## 1. XMLMapperBuilder

先大体看一下 `XMLMapperBuilder` 本身吧，它的内部构造还是比较值得研究的。

### 1.1 继承关系和内部成员

`XMLMapperBuilder` ，也是继承自 `BaseBuilder` 的：

**`BaseBuilder` 是一个基础的构造器**啊。

- `XPathParser parser` ：很熟悉了，它是解析 xml 文件的解析器，此处也用来解析 mapper.xml
- `MapperBuilderAssistant builderAssistant` ：构造 Mapper 的建造器助手（至于为什么是助手，简单地说，它的内部使用了一些 Builder ，帮我们构造 `ResultMap` 、`MappedStatement` 等，不需要我们自己操纵，所以被称之为 “助手” ）
- `Map<String, XNode> sqlFragments` ：封装了可重用的 SQL 片段
- `String resource` ：mapper.xml 的文件路径

### 1.2 构造方法定义

```java
public XMLMapperBuilder(InputStream inputStream, Configuration configuration, String resource, 
                        Map<String, XNode> sqlFragments) {
    this(new XPathParser(inputStream, true, configuration.getVariables(), new XMLMapperEntityResolver()),
            configuration, resource, sqlFragments);
}

private XMLMapperBuilder(XPathParser parser, Configuration configuration, String resource, 
                         Map<String, XNode> sqlFragments) {
    super(configuration);
    this.builderAssistant = new MapperBuilderAssistant(configuration, resource);
    this.parser = parser;
    this.sqlFragments = sqlFragments;
    this.resource = resource;
}
```

只需要注意一个小细节即可：`MapperBuilderAssistant` 在此处创建。这个 `MapperBuilderAssistant` 

### 1.3 核心parse方法

构造完成后就可以调用 `parse` 方法了（此时 mapper.xml 已经被 IO 读取封装为 `InputStream` ），而这个方法的信息量有点大，我们一行一行解析。先留个大体的注释在源码中：

```java
  public void parse() {
    // 如果当前xml资源还没有被加载过
    if (!configuration.isResourceLoaded(resource)) {
      // 2. 解析mapper元素
      configurationElement(parser.evalNode("/mapper"));
      configuration.addLoadedResource(resource);
      // 3. 解析和绑定命名空间
      bindMapperForNamespace();
    }

    // 4. 解析resultMap
    parsePendingResultMaps();
    // 5. 解析cache-ref
    parsePendingCacheRefs();
    // 6. 解析声明的statement
    parsePendingStatements();
  }
```

下面我们就源码中标注了序号的关键代码，逐行解析。不过具体特别深入的我们不做探究，后面小册有专门解析生命周期和执行流程的章节，到那时候我们再展开仔细研究 MyBatis 内部的细节。

## 2. configurationElement

`configurationElement(parser.evalNode("/mapper"));` 这句代码只从最后的参数，就知道是解析 mapper.xml 的最顶层 `<mapper>` 标签了。这部分的解析，会把所有的标签都扫一遍，具体我们可以先看一眼源码和注释：

```java
 private void configurationElement(XNode context) {
    try {
      // 提取mapper.xml对应的命名空间
      String namespace = context.getStringAttribute("namespace");
      if (namespace == null || namespace.equals("")) {
        throw new BuilderException("Mapper's namespace cannot be empty");
      }
      builderAssistant.setCurrentNamespace(namespace);
      // 解析cache、cache-ref
      cacheRefElement(context.evalNode("cache-ref"));
      cacheElement(context.evalNode("cache"));

      // 解析提取parameterMap(官方文档称已废弃，不看了)
      parameterMapElement(context.evalNodes("/mapper/parameterMap"));

      // 解析提取resultMap
      resultMapElements(context.evalNodes("/mapper/resultMap"));
      // 解析封装SQL片段
      sqlElement(context.evalNodes("/mapper/sql"));
      // 构造Statement
      buildStatementFromContext(context.evalNodes("select|insert|update|delete"));
    } catch (Exception e) {
      throw new 
        BuilderException("Error parsing Mapper XML. The XML location is '" + resource + "'. Cause: " + e, e);
    }
  }
```

### 2.1 提取命名空间

```java
// 提取mapper.xml对应的命名空间
    String namespace = context.getStringAttribute("namespace");
    if (namespace == null || namespace.isEmpty()) {
        throw new BuilderException("Mapper's namespace cannot be empty");
    }
    builderAssistant.setCurrentNamespace(namespace);
```

初学 MyBatis 的时候，我们就知道，每个 mapper.xml 都需要声明 `namespace` ，哪怕是我们瞎写那种 abcdefg 的都行，但不能没有，源码中这里就体现了非空检查。命名空间非空的设计，一方面是考虑到二级缓存（一个 `namespace` 对应一个二级缓存），另一方面也是考虑到可能不同的 mapper.xml 中存在同名的 statement （比方说 department 和 user 都有 `findAll` ，这个时候通过 `namespace` 就可以很好地区分开这两个 statement 了）

### 2.2 解析cache、cache-ref

```java
cacheRefElement(context.evalNode("cache-ref"));
    cacheElement(context.evalNode("cache"));

```

这两步的核心动作，是解析看一下 mapper.xml 中有没有引用其他 `namespace` 的二级缓存，以及看一下本 `namespace` 下有没有开启二级缓存，如果有的话，自己配置一下。至于底层的配置，我们放到后面二级缓存中再探讨。

### 2.3 解析提取resultMap【复杂】

```java
 // 解析提取resultMap
    resultMapElements(context.evalNodes("/mapper/resultMap"));
```

```java
private void resultMapElements(List<XNode> list) {
    for (XNode resultMapNode : list) {
        try {
            resultMapElement(resultMapNode);
        } catch (IncompleteElementException e) {
            // ignore, it will be retried
        }
    }
}
```

一个 mapper.xml 文件可能不止一个 `<resultMap>` 标签，

> 注意这里的 try-catch 结构是放在 for 循环体里的，这么做是为了防止某一个 resultMap 解析失败时，导致连带着 mapper.xml 中其他的 resultMap 也没法解析。这样设计后，即便某一个 resultMap 解析挂掉了，也可以继续解析剩余的 resultMap 。

进入单个 resultMap 的解析方法，这里面的逻辑看上去挺多，但实际上条理还是很清晰的

```java
  private ResultMap resultMapElement(XNode resultMapNode) {
    return resultMapElement(resultMapNode, Collections.emptyList(), null);
  }

  private ResultMap resultMapElement(XNode resultMapNode, List<ResultMapping> 
                                     additionalResultMappings, Class<?> enclosingType) {
    ErrorContext.instance().activity("processing " + resultMapNode.getValueBasedIdentifier());
    // 解析resultMap映射的目标结果集实体类型
    String type = resultMapNode.getStringAttribute("type",
      resultMapNode.getStringAttribute("ofType",
        resultMapNode.getStringAttribute("resultType",
          resultMapNode.getStringAttribute("javaType"))));

    // 加载目标结果集实体类型
    Class<?> typeClass = resolveClass(type);
    if (typeClass == null) {
      typeClass = inheritEnclosingType(resultMapNode, enclosingType);
    }
    Discriminator discriminator = null;
    List<ResultMapping> resultMappings = new ArrayList<>(additionalResultMappings);
    List<XNode> resultChildren = resultMapNode.getChildren();
    // 解析resultMap的子标签，并封装为resultMapping
    for (XNode resultChild : resultChildren) {
      if ("constructor".equals(resultChild.getName())) {
        processConstructorElement(resultChild, typeClass, resultMappings);
      } else if ("discriminator".equals(resultChild.getName())) {
        discriminator = processDiscriminatorElement(resultChild, typeClass, resultMappings);
      } else {
        List<ResultFlag> flags = new ArrayList<>();
        if ("id".equals(resultChild.getName())) {
          flags.add(ResultFlag.ID);
        }
        resultMappings.add(buildResultMappingFromContext(resultChild, typeClass, flags));
      }
    }
    // 获取resultMap的id、继承的resultMap id、autoMapping
    String id = resultMapNode.getStringAttribute("id",
      resultMapNode.getValueBasedIdentifier());
    String extend = resultMapNode.getStringAttribute("extends");
    Boolean autoMapping = resultMapNode.getBooleanAttribute("autoMapping");
    // 利用ResultMapResolver处理resultMap
    ResultMapResolver resultMapResolver = 
      new ResultMapResolver(builderAssistant, id, typeClass, extend, 
                            discriminator, resultMappings, autoMapping);
    try {
      return resultMapResolver.resolve();
    } catch (IncompleteElementException e) {
      // 解析失败，说明resultMap标签的信息不完整，记录在全局Configuration中，并抛出异常
      configuration.addIncompleteResultMap(resultMapResolver);
      throw e;
    }
  }
```

#### 2.3.1 解析结果集目标类型

```java
    ErrorContext.instance().activity("processing " + resultMapNode.getValueBasedIdentifier());
    String type = resultMapNode.getStringAttribute("type",
                         resultMapNode.getStringAttribute("ofType", 
                         resultMapNode.getStringAttribute("resultType", 
                         resultMapNode.getStringAttribute("javaType"))));
    Class<?> typeClass = resolveClass(type);
    if (typeClass == null) {
        typeClass = inheritEnclosingType(resultMapNode, enclosingType);
    }
    // ......
```

这一段的目的就是解析目标结果集的实体类类型，上面提到的 4 个属性都可以写，而且必定得有一个写，如果都不写，在解析 xml 时就会报 DTD 异常（需要属性 `"type"` , 并且必须为元素类型 `"resultMap"` 指定该属性）。优先级依次是 `type > ofType > resultType > javaType` 。

#### 2.3.2 解析结果集映射配置

```java
    // ......
    Discriminator discriminator = null;
    List<ResultMapping> resultMappings = new ArrayList<>(additionalResultMappings);
    List<XNode> resultChildren = resultMapNode.getChildren();
    // 解析resultMap的子标签，并封装为resultMapping
    for (XNode resultChild : resultChildren) {
        if ("constructor".equals(resultChild.getName())) {
            processConstructorElement(resultChild, typeClass, resultMappings);
        } else if ("discriminator".equals(resultChild.getName())) {
            discriminator = processDiscriminatorElement(resultChild, typeClass, resultMappings);
        } else {
            List<ResultFlag> flags = new ArrayList<>();
            if ("id".equals(resultChild.getName())) {
                flags.add(ResultFlag.ID);
            }
            resultMappings.add(buildResultMappingFromContext(resultChild, typeClass, flags));
        }
    }
    // ......
```

这里主要干的活是解析 `<resultMap>` 的子标签们，由于只有 3 种标签可以写（普通映射、构造器映射、鉴别器映射），所以这里的 if-else 结构也看上去比较简单，当然也仅限于看上去。内部解析这几个子标签的内容又比较复杂了，我们先从最简单的 else 中看起。

##### 2.3.2.1 解析普通映射标签



```java

  private ResultMapping buildResultMappingFromContext(XNode context, Class<?> resultType, 
                                                      List<ResultFlag> flags) {
    String property;
    if (flags.contains(ResultFlag.CONSTRUCTOR)) {
      property = context.getStringAttribute("name");
    } else {
      property = context.getStringAttribute("property");
    }
    String column = context.getStringAttribute("column");
    String javaType = context.getStringAttribute("javaType");
    String jdbcType = context.getStringAttribute("jdbcType");
    String nestedSelect = context.getStringAttribute("select");
    String nestedResultMap = context.getStringAttribute("resultMap", () ->
      processNestedResultMappings(context, Collections.emptyList(), resultType));
    String notNullColumn = context.getStringAttribute("notNullColumn");
    String columnPrefix = context.getStringAttribute("columnPrefix");
    String typeHandler = context.getStringAttribute("typeHandler");
    String resultSet = context.getStringAttribute("resultSet");
    String foreignColumn = context.getStringAttribute("foreignColumn");
    boolean lazy = 
      "lazy".equals(context.getStringAttribute("fetchType", 
                                               configuration.isLazyLoadingEnabled() ? "lazy" : "eager"));
       // 结果集类型、typeHandler类型的解析
    Class<?> javaTypeClass = resolveClass(javaType);
    Class<? extends TypeHandler<?>> typeHandlerClass = resolveClass(typeHandler);
    JdbcType jdbcTypeEnum = resolveJdbcType(jdbcType);
    return 
      builderAssistant.buildResultMapping(resultType, property, column, javaTypeClass, 
                                          jdbcTypeEnum, nestedSelect, 
                                          nestedResultMap, notNullColumn, columnPrefix, 
                                          typeHandlerClass, flags, resultSet, foreignColumn, lazy);
  }
```

，就是**将一行 `<result property="" column="" />` 标签解析封装为一个 `ResultMapping`** 即可。

##### 2.3.2.2 处理constructor

我们已经接触了 `<constructor>` 标签的使用，也知道它的内部其实还是封装类似于 `<id>` 、`<result>` 等标签，所以它的处理逻辑基本上是大同小异：

```java
private void processConstructorElement(XNode resultChild, Class<?> resultType, 
                                       List<ResultMapping> resultMappings) {
    List<XNode> argChildren = resultChild.getChildren();
    for (XNode argChild : argChildren) {
        List<ResultFlag> flags = new ArrayList<>();
        flags.add(ResultFlag.CONSTRUCTOR);
        if ("idArg".equals(argChild.getName())) {
            flags.add(ResultFlag.ID);
        }
        resultMappings.add(buildResultMappingFromContext(argChild, resultType, flags));
    }
}
```

最终还是调用的 `buildResultMappingFromContext` 方法，把那一行一行的结果集映射都封装为 `ResultMapping` 完事。

不过这里要额外注意一个细节，上面的每一行结果集映射中，都会对应一个 `List<ResultFlag> flags` 的家伙，而且在解析 `<constructor>` 标签的时候，它会先给 `flags` 集合中添加一个 `ResultFlag.CONSTRUCTOR` 的元素，这个元素会在 `buildResultMappingFromContext` 方法中起作用：

```java
private ResultMapping buildResultMappingFromContext(XNode context, Class<?> resultType, 
                                                    List<ResultFlag> flags) {
    String property;
    if (flags.contains(ResultFlag.CONSTRUCTOR)) {
        // <constructor>标签用name
        property = context.getStringAttribute("name");
    } else {
        // 普通的标签用property
        property = context.getStringAttribute("property");
    }
```



可以发现，`<constructor>` 标签中取属性名要用 `name` 而不是 `property` ，这个小细节我们可以在 mapper.xml 中发现：

或许我们没有感知到，一是因为一般情况下结果集映射的实体类都只有缺省的无参构造器，用不到 `<constructor>` 属性；二是写的时候也没有特别的去找，看到 name 或许也会理所当然的觉得它就是

##### 2.3.2.3 处理discriminator

```java
  private Discriminator processDiscriminatorElement(XNode context, Class<?> resultType, 
                                                    List<ResultMapping> resultMappings) {
    String column = context.getStringAttribute("column");
    String javaType = context.getStringAttribute("javaType");
    String jdbcType = context.getStringAttribute("jdbcType");
    String typeHandler = context.getStringAttribute("typeHandler");
    Class<?> javaTypeClass = resolveClass(javaType);
    // 解析<discriminator>的<case>子标签，并封装到Map中
    Class<? extends TypeHandler<?>> typeHandlerClass = resolveClass(typeHandler);
    JdbcType jdbcTypeEnum = resolveJdbcType(jdbcType);
    Map<String, String> discriminatorMap = new HashMap<>();
    for (XNode caseChild : context.getChildren()) {
      String value = caseChild.getStringAttribute("value");
      String resultMap = caseChild.getStringAttribute("resultMap",
                            processNestedResultMappings(caseChild, resultMappings, resultType));
      discriminatorMap.put(value, resultMap);
    }
    // 注意构造的是Discriminator而不是ResultMapping
    return builderAssistant.buildDiscriminator(resultType, column, javaTypeClass, 
                                               jdbcTypeEnum, typeHandlerClass, discriminatorMap);
  }
```

1）最终封装的是一个 `Discriminator` 对象，同样由 `MapperBuilderAssistant` 构建；2）`<discriminator>` 的子标签 `<case>` 最终会封装到一个 `Map` 中。至于封装的 `Map` 里到底是啥，我们也是放到后面生命周期的章节中讲解。

#### 2.3.3 封装构建ResultMap

`<resultMap>` 标签解析的最后一部分，它会用一个 `ResultMapResolver` 来处理，并最终构造出 `ResultMap` 对象

```java
    // ......
    // 获取resultMap的id、继承的resultMap id、autoMapping
    String id = resultMapNode.getStringAttribute("id", resultMapNode.getValueBasedIdentifier());
    String extend = resultMapNode.getStringAttribute("extends");
    Boolean autoMapping = resultMapNode.getBooleanAttribute("autoMapping");
    // 利用ResultMapResolver处理resultMap
    ResultMapResolver resultMapResolver = new ResultMapResolver(builderAssistant, id, 
            typeClass, extend, discriminator, resultMappings, autoMapping);
    try {
        return resultMapResolver.resolve();
    } catch (IncompleteElementException e) {
        // 解析失败，说明resultMap标签的信息不完整，记录在全局Configuration中，并抛出异常
        configuration.addIncompleteResultMap(resultMapResolver);
        throw e;
    }
}
```

这个 `ResultMapResolver` ，它的 `resolve` 方法，就是调了 `MapperBuilderAssistant` 的方法：

```java
public ResultMap resolve() {
  return assistant.addResultMap(this.id, this.type, this.extend, this.discriminator, 
                                this.resultMappings, this.autoMapping);
}
```

### 2.4 提取SQL片段

```java
  // 解析封装SQL片段
sqlElement(context.evalNodes("/mapper/sql"));
// 构造Statement
buildStatementFromContext(context.evalNodes("select|insert|update|delete"));
```



接下来是提取各个 mapper.xml 中的 SQL 片段了，这里面的大规则我们都很清楚了：**如果有显式声明 databaseId ，那只有符合当前全局 databaseId 的 SQL 片段会提取；如果没有声明 databaseId ，则会全部提取**。

所以下面的源码中，我们会发现，它解析了两遍 SQL 片段，而且在每一次循环解析中，都会判断一次 SQL 片段是否匹配当前 databaseId ，匹配的话就会放到一个 `sqlFragments` 的 `Map` 中：（关键代码已标有注释）

```java
private void sqlElement(List<XNode> list) {
    if (configuration.getDatabaseId() != null) {
        // 先全部过一遍，提取出匹配SQL片段的statement
        sqlElement(list, configuration.getDatabaseId());
    }
    // 再提取通用的SQL片段
    sqlElement(list, null);
}

private void sqlElement(List<XNode> list, String requiredDatabaseId) {
    for (XNode context : list) {
        String databaseId = context.getStringAttribute("databaseId");
        String id = context.getStringAttribute("id");
        id = builderAssistant.applyCurrentNamespace(id, false);
        // 鉴别当前SQL片段是否匹配
        if (databaseIdMatchesCurrent(id, databaseId, requiredDatabaseId)) {
            sqlFragments.put(id, context);
        }
    }
}
```

```java
  private boolean databaseIdMatchesCurrent(String id, String databaseId, String requiredDatabaseId) {
    // 显式配置了需要databaseId，那就直接匹配
    if (requiredDatabaseId != null) {
      return requiredDatabaseId.equals(databaseId);
    }
    // 不需要databaseId，但这个SQL片段有声明，则一律不收
    if (databaseId != null) {
      return false;
    }
    // 还没有存过这条SQL片段，则直接收下
    if (!this.sqlFragments.containsKey(id)) {
      return true;
    }
    // skip this fragment if there is a previous one with a not null databaseId
    // 已经存过了？拿出来看看是不是有databaseId，如果有，那就说明存在同id但没有配置databaseId的，不管了
    // 存在同id的情况下，有databaseId的优先级比没有的高）
    XNode context = this.sqlFragments.get(id);
    return context.getStringAttribute("databaseId") == null;
  }

```

### 2.5 解析statement【复杂】

最后一部分又是很复杂的了，它会解析 mapper.xml 中声明的 `<select>` 、`<insert>` 、`<update>` 、`<delete>` 标签，并最终封装为一个一个的 **`MappedStatement`** 。有关 databaseId 的处理逻辑，还是跟 SQL 片段一样，

```java
// 构造Statement
      buildStatementFromContext(context.evalNodes("select|insert|update|delete"));

private void buildStatementFromContext(List<XNode> list) {
    if (configuration.getDatabaseId() != null) {
        buildStatementFromContext(list, configuration.getDatabaseId());
    }
    buildStatementFromContext(list, null);
}

private void buildStatementFromContext(List<XNode> list, String requiredDatabaseId) {
    for (XNode context : list) {
        final XMLStatementBuilder statementParser = new XMLStatementBuilder(configuration, 
                builderAssistant, context, requiredDatabaseId);
        try {
            // 【复杂、困难】借助XMLStatementBuilder解析一个一个的statement标签
            statementParser.parseStatementNode();
        } catch (IncompleteElementException e) {
            // statement解析失败，只会记录到Configuration中，但不会抛出异常
            configuration.addIncompleteStatement(statementParser);
        }
    }
}

```

通读一遍源码后，似乎脑子里只有一件事：**它又把活交给别人干了**。。。没错，解析 statement 的工作交给 `XMLStatementBuilder` 了，注意又是一个 **Builder** ！现在我们正在解析使用的 `XmlMapperBuilder` 也是一个 **Builder** ！

## 3. bindMapperForNamespace

接下来要执行的 `bindMapperForNamespace` 方法，本质上是为了 **Mapper 接口动态代理**而设计的，我们都知道，利用 Mapper 动态代理的特性，可以使得我们可以直接取 Mapper 接口，而不用操纵 `SqlSession` 的 API ，写那一堆复杂的 statementId ，而且也相对更容易维护代码了。

这个 `bindMapperForNamespace` 的方法，就是为这个特性做的支撑，我们来看看它的底层实现：

```java
  private void bindMapperForNamespace() {
    String namespace = builderAssistant.getCurrentNamespace();
    if (namespace != null) {
      Class<?> boundType = null;
      try {
        // 尝试加载namespace对应的类
        boundType = Resources.classForName(namespace);
      } catch (ClassNotFoundException e) {
        //ignore, bound type is not required
      }
      // 加载到类了，并且之前没存过这个Mapper接口，那就存起来
      if (boundType != null) {
        if (!configuration.hasMapper(boundType)) {
          // Spring may not know the real resource name so we set a flag
          // to prevent loading again this resource from the mapper interface
          // look at MapperAnnotationBuilder#loadXmlResource
          // Spring可能不知道真实的资源名称，因此设置了一个标志来防止再次从Mapper接口加载此资源
          configuration.addLoadedResource("namespace:" + namespace);
          configuration.addMapper(boundType);
        }
      }
    }
  }
```

嚯，这操作也忒简单了吧！直接把 namespace 拿来，用类加载去加载对应的类，如果加载到了，就把它存起来，完事；如果没加载到，那就当无事发生。是的，这本身的逻辑可以说是相当简单了，不过这里面有个细节，也就是源码中的几行单行注释：

> Spring may not know the real resource name so we set a flag to prevent loading again this resource from the mapper interface.
>
> Spring 可能不知道真实的资源名称，因此设置了一个标志来防止再次从 Mapper 接口加载此资源。

在学习 MyBatis 基础的时候，讲到 Mapper 接口动态代理时，应该各位都记得有一个约定吧：**在 MyBatis 全局配置文件中配置 mapper 时，如果使用包扫描的方式，扫描 Mapper 接口时，需要 Mapper 接口与对应的 mapper.xml 放在同一个目录下，且 Mapper 接口的名称要与 mapper.xml 的名称一致**。这个约定的底层原理，是 **Mapper 接口包扫描时，会自动寻找同目录下的同名称的 mapper.xml 文件并加载解析**（核心代码可参照 `org.apache.ibatis.builder.annotation.MapperAnnotationBuilder#loadXmlResource` ）。但这个时候就有可能出现意外情况：如果我们既配置了 mapper.xml 的资源路径，又配置了 Mapper 接口包扫描，那岂不是要加载两边？这很明显不是很合理吧！所以 MyBatis 帮我们考虑了这一层，就在这里面加了一个额外的标识：**每当解析到一个存在的 Mapper 接口时，会标记这个接口对应的 mapper.xml 文件已加载**，这样即便又进行包扫描时读到了这个 Mapper 接口，当它要去加载 mapper.xml 时检查到已经加载过了，就不会再重复加载了。

## 4. 重新处理不完整的元素

`parse` 方法的最后 3 个步骤其实都是干的同一类事情，那就是重新处理一下前面解析过程中保存的残缺不全的元素们：

```java
    parsePendingResultMaps();
    parsePendingCacheRefs();
    parsePendingStatements();
```

```java
  private void parsePendingResultMaps() {
    Collection<ResultMapResolver> incompleteResultMaps = configuration.getIncompleteResultMaps();
    synchronized (incompleteResultMaps) {
      Iterator<ResultMapResolver> iter = incompleteResultMaps.iterator();
      while (iter.hasNext()) {
        try {
          // 逐个提取，重新解析
          iter.next().resolve();
          iter.remove();
        } catch (IncompleteElementException e) {
          // ResultMap is still missing a resource...
        }
      }
    }
  }
public ResultMap resolve() {
    return assistant.addResultMap(this.id, this.type, this.extend, this.discriminator,
                                  this.resultMappings, this.autoMapping);
}
```

注意这里提取出来的是一组 `ResultMapResolver` ，刚好呼应上面 2.3.3 节提到的那个看似多余的封装操作！可见这个 `ResultMapResolver` 并不是多余的做这么一步，通过 `ResultMapResolver` 这么一个中间层的传递，可以**把一个 resultMap 中涉及到的所有定义信息都存起来**，这样**在重新处理的时候，可以直接把那些解析好的 resultMap 的信息都找回来，并直接让 `MapperBuilderAssistant` 再试一次**。

走完一遍迭代后，能正常解析的会从 `incompleteResultMaps` 中移除，剩余的还在里面继续呆着。当然这个时候再解析不了的 resultMap 也好，statement 也好，MyBatis 还没有彻底放弃它们。在 MyBatis 与 SpringFramework 的整合中，IOC 容器刷新完成后，会最后一次解析这些残缺不全的 resultMap 等等，这部分内容我们放到 MyBatis 整合 SpringFramework 的章节中再展开。

OK ，走到这里，`XMLMapperBuilder` 的整个处理逻辑也就全部执行完毕了，整个 `mapperElement` 的方法处理也就完成了，这也就意味着 `SqlSessionFactory` 已经成功创建出来了。

