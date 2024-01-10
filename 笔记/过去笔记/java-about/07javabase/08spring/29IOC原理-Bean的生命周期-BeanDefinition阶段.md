---
title: 29IOC原理-Bean的生命周期-BeanDefinition阶段
---

好我们开始来研究 bean 完整生命周期的 `BeanDefinition` 阶段了，这一阶段主要发生了以下几件事情：

- 加载配置文件、配置类
- 解析配置文件、配置类并封装为 BeanDefinition
- 编程式注入额外的 BeanDefinition
- BeanDefinition 的后置处理

## 1. 加载xml配置文件

来，跟着小册来到 `LifecycleSourceXmlApplication` 的测试代码：

```java
public static void main(String[] args) throws Exception {
    ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext();
    ctx.setConfigLocation("lifecycle/bean-source.xml");

```

### 1.1 保存配置文件路径

这里 xml 配置文件的加载会使用 `ClassPathXmlApplicationContext` 的 `setConfigLocation` 方法，点进去可以发现它只是在 `AbstractRefreshableConfigApplicationContext` 中，给 `configLocations` 设置了配置文件的路径存放而已。

通过源码，也能看出来最终是将传入的路径切分，并顺序存入 `configLocations` 中：（关键注释已标注在源码中）

```java
public void setConfigLocation(String location) {
    // 切分配置文件路径
    setConfigLocations(StringUtils.tokenizeToStringArray(location, CONFIG_LOCATION_DELIMITERS));
}

public void setConfigLocations(@Nullable String... locations) {
    if (locations != null) {
        // assert ......
        this.configLocations = new String[locations.length];
        for (int i = 0; i < locations.length; i++) {
            // 存入ApplicationContext中
            this.configLocations[i] = resolvePath(locations[i]).trim();
        }
    }
    else {
        this.configLocations = null;
    }
}
```

Debug 时，也能发现，它最终把测试代码中设置的 xml 配置文件的路径都保存了。

![image-20220509195507836](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220509195507.png)

### 1.2 加载配置文件并解析

当执行 `ApplicationContext` 的 `refresh` 方法后，会开始刷新（初始化）IOC 容器，这里面有 13 个步骤，前面已经看过不少次了：

```java
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        prepareRefresh();
        // 2. 初始化BeanFactory
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
        prepareBeanFactory(beanFactory);
        
        // ......
    }
}
```

这里面我把第 2 步 `obtainFreshBeanFactory` 方法标注出来了，加载配置文件并解析的动作就在这里面，我们可以来研究一下。

```java
protected ConfigurableListableBeanFactory obtainFreshBeanFactory() {
    refreshBeanFactory();
    return getBeanFactory();
}
```

这个方法只有两个动作：刷新 `BeanFactory` ，然后获取它。毫无疑问，刷新的动作中包含配置文件的加载和解析，我们继续往里看。

`refreshBeanFactory` 方法是 `AbstractApplicationContext` 定义的抽象方法，很明显这里又是**模板方法模式**的体现了。由于当前我们正在研究的是基于 xml 配置文件的 `ApplicationContext` ，所以要进入 `AbstractRefreshableApplicationContext` 中：

```java
protected final void refreshBeanFactory() throws BeansException {
    // 存在BeanFactory则先销毁
    if (hasBeanFactory()) {
        destroyBeans();
        closeBeanFactory();
    }
    try {
        // 创建BeanFactory
        DefaultListableBeanFactory beanFactory = createBeanFactory();
        beanFactory.setSerializationId(getId());
        customizeBeanFactory(beanFactory);
        // 【1.3】加载配置文件
        loadBeanDefinitions(beanFactory);
        this.beanFactory = beanFactory;
    } // catch ......
}
```

，**基于 xml 配置文件的 `ApplicationContext` 可以反复刷新加载 IOC 容器**，所以此处有已经存在的判断：如果当前 `ApplicationContext` 中组合的 `BeanFactory` 已经存在，则销毁原来的 `BeanFactory` ，并重新创建。

关注重点，这里面加载配置文件的动作是 `loadBeanDefinitions` 。这个方法相当复杂且困难，小册会选取最重要的部分来解析。

### 1.3 loadBeanDefinitions

点进去，发现 `loadBeanDefinitions` 又是一个抽象方法，在 `AbstractXmlApplicationContext` 中可以找到对应的实现：（关键注释已标注在源码中）

```java
protected void loadBeanDefinitions(DefaultListableBeanFactory beanFactory) throws BeansException, IOException {
    // xml配置文件由XmlBeanDefinitionReader解析
    XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReader(beanFactory);

    // 配置上下文环境、资源加载器等
    beanDefinitionReader.setEnvironment(this.getEnvironment());
    beanDefinitionReader.setResourceLoader(this);
    beanDefinitionReader.setEntityResolver(new ResourceEntityResolver(this));

    initBeanDefinitionReader(beanDefinitionReader);
    // 使用xml解析器 解析xml配置文件
    loadBeanDefinitions(beanDefinitionReader);
}
```

注意这里面，它创建了一个 `XmlBeanDefinitionReader` ，小伙伴们一定不陌生吧，我们说它就是加载和解析 xml 配置文件的核心 API 。直接看最底下吧，它把这个 `XmlBeanDefinitionReader` 作为参数传入重载的 `loadBeanDefinitions` 方法：

```java
protected void loadBeanDefinitions(XmlBeanDefinitionReader reader) throws BeansException, IOException {
    Resource[] configResources = getConfigResources();
    if (configResources != null) {
        reader.loadBeanDefinitions(configResources);
    }
    String[] configLocations = getConfigLocations();
    if (configLocations != null) {
        // 【1.4】加载配置文件资源路径的xml配置文件
        reader.loadBeanDefinitions(configLocations);
    }
}
```

注意这段逻辑分两部分，一个是处理已经加载好的现成的 `Resource` ，一个是处理指定好的配置文件资源路径。由于测试代码中并没有直接指定 Resource ，故此处主要研究第 8 行的 `loadBeanDefinitions(configLocations)` 。

Debug 至此处，同样也能发现 `reader` 与 `configLocations` 都准备好了：

### 1.4 XmlBeanDefinitionReader加载配置文件

```java
public int loadBeanDefinitions(String... locations) throws BeanDefinitionStoreException {
    // assert ......
    int count = 0;
    for (String location : locations) {
        count += loadBeanDefinitions(location);
    }
    return count;
}

```

点进来，发现它传入的是一组配置文件，那自然就会循环一个个的加载咯。循环自然不是重点，我们进入内部的 `loadBeanDefinitions(location)` 中：（源码篇幅略长，不过逻辑比较简单）

```java
public int loadBeanDefinitions(String location) throws BeanDefinitionStoreException {
    return loadBeanDefinitions(location, null);
}

public int loadBeanDefinitions(String location, @Nullable Set<Resource> actualResources) throws BeanDefinitionStoreException {
    ResourceLoader resourceLoader = getResourceLoader();
    if (resourceLoader == null) {
        // throw ex ......
    }

    if (resourceLoader instanceof ResourcePatternResolver) {
        try {
            // 根据传入的路径规则，匹配所有符合的xml配置文件
            Resource[] resources = ((ResourcePatternResolver) resourceLoader).getResources(location);
            int count = loadBeanDefinitions(resources);
            if (actualResources != null) {
                Collections.addAll(actualResources, resources);
            }
            // logger ......
            return count;
        } // catch ......
    }
    else {
        // 每次只能解析一个xml配置文件
        Resource resource = resourceLoader.getResource(location);
        // 【解析】
        int count = loadBeanDefinitions(resource);
        if (actualResources != null) {
            actualResources.add(resource);
        }
        // logger ......
        return count;
    }
}
```

可以发现，这里的核心逻辑只有两个动作：**1) 根据传入的资源路径，获取 xml 配置文件**；**2) 解析 xml 配置文件**。其余的动作都是保证程序正常执行的代码，咱就不研究了，还是核心关注 `loadBeanDefinitions` 的方法实现。

```java
public int loadBeanDefinitions(Resource resource) throws BeanDefinitionStoreException {
    return loadBeanDefinitions(new EncodedResource(resource));
}
```

这一步给原有的 xml 配置文件的 `Resource` 封装包装了一层编码而已，没啥需要关注的，继续往里看。

```java
public int loadBeanDefinitions(EncodedResource encodedResource) throws BeanDefinitionStoreException {
    // assert logger ......
    Set<EncodedResource> currentResources = this.resourcesCurrentlyBeingLoaded.get();
    if (!currentResources.add(encodedResource)) {
        // throw ex ......
    }

    try (InputStream inputStream = encodedResource.getResource().getInputStream()) {
        InputSource inputSource = new InputSource(inputStream);
        if (encodedResource.getEncoding() != null) {
            inputSource.setEncoding(encodedResource.getEncoding());
        }
        // 【真正干活的】
        return doLoadBeanDefinitions(inputSource, encodedResource.getResource());
    } // catch ......
    finally {
        currentResources.remove(encodedResource);
        if (currentResources.isEmpty()) {
            this.resourcesCurrentlyBeingLoaded.remove();
        }
    }
}
```

### 1.5 doLoadBeanDefinitions - 读取配置文件

```java
protected int doLoadBeanDefinitions(InputSource inputSource, Resource resource)
        throws BeanDefinitionStoreException {
    try {
        Document doc = doLoadDocument(inputSource, resource);
        int count = registerBeanDefinitions(doc, resource);
        // logger ......
        return count;
    } // catch ......
}
```

一上来又是一个 **do** 开头的方法，得了，我就看你。。。诶等一下，`doLoadDocument` 这很明显是解析文档吧，这我们也没必要看吧（也看不懂），重点是下面的那句 `registerBeanDefinitions` ，这才是我们最关心的吧！

```java
public int registerBeanDefinitions(Document doc, Resource resource) throws BeanDefinitionStoreException {
    BeanDefinitionDocumentReader documentReader = createBeanDefinitionDocumentReader();
    int countBefore = getRegistry().getBeanDefinitionCount();
    // 【解析】
    documentReader.registerBeanDefinitions(doc, createReaderContext(resource));
    return getRegistry().getBeanDefinitionCount() - countBefore;
}
```

注意，此处构造了一个 `DefaultBeanDefinitionDocumentReader` ，然后调用它的 `registerBeanDefinitions` 方法（不再是 `XmlBeanDefinitionReader` 的方法了）：

```java
public void registerBeanDefinitions(Document doc, XmlReaderContext readerContext) {
    this.readerContext = readerContext;
    doRegisterBeanDefinitions(doc.getDocumentElement());
}
```

又又又是这个套路！**xxx 方法最终调 doXxx 方法干活**，得了那咱继续往里走：

```java
protected void doRegisterBeanDefinitions(Element root) {
    BeanDefinitionParserDelegate parent = this.delegate;
    this.delegate = createDelegate(getReaderContext(), root, parent);

    if (this.delegate.isDefaultNamespace(root)) {
        // 取<beans>上的profile属性
        String profileSpec = root.getAttribute(PROFILE_ATTRIBUTE);
        if (StringUtils.hasText(profileSpec)) {
            String[] specifiedProfiles = StringUtils.tokenizeToStringArray(
                    profileSpec, BeanDefinitionParserDelegate.MULTI_VALUE_ATTRIBUTE_DELIMITERS);
            if (!getReaderContext().getEnvironment().acceptsProfiles(specifiedProfiles)) {
                // logger ......
                return;
            }
        }
    }

    preProcessXml(root);
    // 【解析xml】
    parseBeanDefinitions(root, this.delegate);
    postProcessXml(root);

    this.delegate = parent;
}
```

注意看这段源码，上面它会先把 xml 配置文件中声明的 **profile** 取出来，并根据 `Environment` 中配置好的 **profile** 决定是否继续解析（ profile 的过滤）.

接下来，后面就是 xml 配置文件的解析动作了，在这前后有一个预处理和后处理动作，不过默认情况下这里是没有实现的（模板方法罢了），所以我们只需要看 `parseBeanDefinitions` 就可以

### 1.6 parseBeanDefinitions - 解析xml

```java
protected void parseBeanDefinitions(Element root, BeanDefinitionParserDelegate delegate) {
    if (delegate.isDefaultNamespace(root)) {
        NodeList nl = root.getChildNodes();
        for (int i = 0; i < nl.getLength(); i++) {
            Node node = nl.item(i);
            if (node instanceof Element) {
                Element ele = (Element) node;
                // 解析<beans>中的元素
                if (delegate.isDefaultNamespace(ele)) {
                    parseDefaultElement(ele, delegate);
                }
                else {
                    // 解析其它命名空间中的元素
                    delegate.parseCustomElement(ele);
                }
            }
        }
    }
    else {
        delegate.parseCustomElement(root);
    }
}
```

Spring 如何解析 xml ，我们不关心，但是**如何从解析完的 xml 中获取关键信息，以及封装 `BeanDefinition`** ，这才是我们要关注的。

这个方法一进来的时候，我们在此 Debug 停一下，可以发现它已经是解析并封装成 `Element` 的形式了，而且根节点是 `<beans>` ，它还有几个默认属性等等，我们都比较熟悉了：

OK ，继续回到源码，源码中可以看到，每次循环出来的 `Node` 都会尝试着转成 `Element` 去解析，而解析的动作主要是 `parseDefaultElement` ，它会解析 `<beans>` 标签下的 xml 元素。马上就要水落石出了，我们点进去看：

```java
private void parseDefaultElement(Element ele, BeanDefinitionParserDelegate delegate) {
    if (delegate.nodeNameEquals(ele, IMPORT_ELEMENT)) {
        importBeanDefinitionResource(ele);
    }
    else if (delegate.nodeNameEquals(ele, ALIAS_ELEMENT)) {
        processAliasRegistration(ele);
    }
    else if (delegate.nodeNameEquals(ele, BEAN_ELEMENT)) {
        processBeanDefinition(ele, delegate);
    }
    else if (delegate.nodeNameEquals(ele, NESTED_BEANS_ELEMENT)) {
        // recurse
        doRegisterBeanDefinitions(ele);
    }
}
```

终于看到真实的面貌了！！！这里它会解析 `<import>` 标签、`<alias>` 标签、`<bean>` 标签，以及递归解析嵌套的 `<beans>` 标签！

### 1.7 processBeanDefinition - 解析 `<bean>` 标签

既然我们还是在研究 `BeanDefinition` ，那我们就研究 `processBeanDefinition` 方法啦，翻开源码，可以发现逻辑还是比较简单的：（关键注释已标注在源码中

```java
protected void processBeanDefinition(Element ele, BeanDefinitionParserDelegate delegate) {
    // 解析xml元素为BeanDefinition
    BeanDefinitionHolder bdHolder = delegate.parseBeanDefinitionElement(ele);
    if (bdHolder != null) {
        // 解析<bean>中嵌套的自定义标签
        bdHolder = delegate.decorateBeanDefinitionIfRequired(ele, bdHolder);
        try {
            // BeanDefinition注册到BeanDefinitionRegistry
            BeanDefinitionReaderUtils.registerBeanDefinition(bdHolder, getReaderContext().getRegistry());
        } // catch ......
        // Send registration event.
        getReaderContext().fireComponentRegistered(new BeanComponentDefinition(bdHolder));
    }
}

```

可以发现，整个动作一气呵成，其中第一个步骤会把 xml 元素封装为 `BeanDefinitionHolder` ，且不说 holder 是干嘛用，只从名字上就能知道，它内部肯定组合了一个 `BeanDefinition` 。

Debug 至此，可以发现，这个 `Element` 中已经包含了一个 `<bean>` 标签中定义的那些属性了：

不过源码是如何将 xml 元素封装为 `BeanDefinitionHolder` 的呢？我们还是进去看看为好。（以下源码篇幅略长，只关注有注释的部分即可）

```java
public BeanDefinitionHolder parseBeanDefinitionElement(Element ele) {
    return parseBeanDefinitionElement(ele, null);
}

public BeanDefinitionHolder parseBeanDefinitionElement(Element ele, @Nullable BeanDefinition containingBean) {
    // 取出bean的id
    String id = ele.getAttribute(ID_ATTRIBUTE);
    // 取出bean的name
    String nameAttr = ele.getAttribute(NAME_ATTRIBUTE);

    // 取出bean的alias
    List<String> aliases = new ArrayList<>();
    if (StringUtils.hasLength(nameAttr)) {
        String[] nameArr = StringUtils.tokenizeToStringArray(nameAttr, MULTI_VALUE_ATTRIBUTE_DELIMITERS);
        aliases.addAll(Arrays.asList(nameArr));
    }
    // 如果没有给bean赋name，则第一个alias视为name
    String beanName = id;
    if (!StringUtils.hasText(beanName) && !aliases.isEmpty()) {
        beanName = aliases.remove(0);
        // logger ......
    }

    // 检查bean的name是否有重复
    if (containingBean == null) {
        checkNameUniqueness(beanName, aliases, ele);
    }

    // 解析其余的bean标签元素属性
    AbstractBeanDefinition beanDefinition = parseBeanDefinitionElement(ele, beanName, containingBean);
    if (beanDefinition != null) {
        // 如果没有给bean赋name，且没有alias，则生成默认的name
        if (!StringUtils.hasText(beanName)) {
            try {
                if (containingBean != null) {
                    beanName = BeanDefinitionReaderUtils.generateBeanName(
                            beanDefinition, this.readerContext.getRegistry(), true);
                } else {
                    beanName = this.readerContext.generateBeanName(beanDefinition);
                    String beanClassName = beanDefinition.getBeanClassName();
                    if (beanClassName != null &&
                            beanName.startsWith(beanClassName) && beanName.length() > beanClassName.length() &&
                            !this.readerContext.getRegistry().isBeanNameInUse(beanClassName)) {
                        aliases.add(beanClassName);
                    }
                }
                // logger ......
            } // catch ......
        }
        String[] aliasesArray = StringUtils.toStringArray(aliases);
        return new BeanDefinitionHolder(beanDefinition, beanName, aliasesArray);
    }

    return null;
}

```

虽说源码篇幅比较长，但总体还是比较容易理解和接受的，而且每一步干的活也都容易看明白。不过看完这段源码之后，小伙伴们可能会疑惑：只有 `id` 和 `name` ，`class` 呢？`scope` 呢？`lazy-init` 呢？莫慌，看到中间还有一个封装好的 `parseBeanDefinitionElement` 方法了吧，这些属性的封装都在这里可以找得到，我们继续往里进。同样的，这段源码篇幅较长，只需要关注带注释的即可：

```java
public AbstractBeanDefinition parseBeanDefinitionElement(
        Element ele, String beanName, @Nullable BeanDefinition containingBean) {
    this.parseState.push(new BeanEntry(beanName));

    // 解析class的全限定名
    String className = null;
    if (ele.hasAttribute(CLASS_ATTRIBUTE)) {
        className = ele.getAttribute(CLASS_ATTRIBUTE).trim();
    }
    // 解析parent的definition名称
    String parent = null;
    if (ele.hasAttribute(PARENT_ATTRIBUTE)) {
        parent = ele.getAttribute(PARENT_ATTRIBUTE);
    }

    try {
        // 构造BeanDefinition
        AbstractBeanDefinition bd = createBeanDefinition(className, parent);

        // 解析其余的<bean>标签属性
        parseBeanDefinitionAttributes(ele, beanName, containingBean, bd);
        bd.setDescription(DomUtils.getChildElementValueByTagName(ele, DESCRIPTION_ELEMENT));

        // 解析property属性
        parseMetaElements(ele, bd);
        // 解析其它的属性 ......

        bd.setResource(this.readerContext.getResource());
        bd.setSource(extractSource(ele));

        return bd;
    } // catch finally ......

    return null;
}
```

从这部分，我们终于看到了最最底层的操作：调用 `createBeanDefinition` 方法创建了一个 `BeanDefinition` （它的底层就是第 24 章提到的 `BeanDefinitionReaderUtils.createBeanDefinition` 方法），之后把 `<bean>` 标签中的其它属性、`<bean>` 的子标签的内容都封装起来，而封装 `<bean>` 其它属性的 `parseBeanDefinitionAttributes` 方法中，已经把这些内容都解析到位了：

```java
ublic AbstractBeanDefinition parseBeanDefinitionAttributes(Element ele, String beanName,
        @Nullable BeanDefinition containingBean, AbstractBeanDefinition bd) {

    // 解析scope
    if (ele.hasAttribute(SINGLETON_ATTRIBUTE)) {
        error("Old 1.x 'singleton' attribute in use - upgrade to 'scope' declaration", ele);
    } else if (ele.hasAttribute(SCOPE_ATTRIBUTE)) {
        bd.setScope(ele.getAttribute(SCOPE_ATTRIBUTE));
    } else if (containingBean != null) {
        // Take default from containing bean in case of an inner bean definition.
        bd.setScope(containingBean.getScope());
    }

    // 解析abstract属性
    if (ele.hasAttribute(ABSTRACT_ATTRIBUTE)) {
        bd.setAbstract(TRUE_VALUE.equals(ele.getAttribute(ABSTRACT_ATTRIBUTE)));
    }

    // 省略部分相似的封装属性的动作 ......
    return bd;
}
```

到这里，xml 配置文件中的 `<bean>` 标签就可以转换为 `BeanDefinition` 了。

#### 1.7.1 BeanDefinitionHolder的意义

最后补充一下前面略过的 `BeanDefinitionHolder` ，我们说它是持有 `BeanDefinition` 的一个包装而已，不过它除了持有之外，还包含了另外的重要信息：**bean 的名称**。

翻看 `BeanDefinitionHolder` 的源码结构，可以发现这里面还组合了 bean 的 **name** 和 alias ：

```java
public class BeanDefinitionHolder implements BeanMetadataElement {

	private final BeanDefinition beanDefinition;

	private final String beanName;

	@Nullable
	private final String[] aliases;
```

是不是突然回过神了，`BeanDefinition` 的结构中是没有 name 的！所以才需要这样一个 holder 帮它持有。

### 1.8 小结

简单总结一下这个流程吧：**首先 `ClassPathXmlApplicationContext` 在 `refresh` 之前，会指定传入的 xml 配置文件的路径，执行 `refresh` 方法时，会初始化 `BeanFactory` ，触发 xml 配置文件的读取、加载和解析。其中 xml 的读取需要借助 `XmlBeanDefinitionReader` ，解析 xml 配置文件则使用 `DefaultBeanDefinitionDocumentReader` ，最终解析 xml 中的元素，封装出 `BeanDefinition` ，最后注册到 `BeanDefinitionRegistry` 。**

## 2. 加载注解配置类

相比较于 xml 配置文件，注解配置类的加载时机会晚一些，它用到了一个至关重要的 `BeanDefinitionRegistryPostProcessor` ，而且无论如何，这个后置处理器都是最最优先执行的，它就是 **`ConfigurationClassPostProcessor`** 。

下面我们还是通过实例来研究注解配置类的加载机制（注意此处要换用 `LifecycleSourceAnnotationApplication` 了哦）。

### 2.1 BeanDefinitionRegistryPostProcessor的调用时机

还是回到 `AbstractApplicationContext` 的 `refresh` 方法中，这次我们要看的是 `BeanFactoryPostProcessor` 和 `BeanDefinitionRegistryPostProcessor` 的执行时机，而它们的执行都在下面所示的第 5 步 `invokeBeanFactoryPostProcessors` 中执行：

```java
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        // ......
        try {
            postProcessBeanFactory(beanFactory);
            // 5. 执行BeanFactoryPostProcessor
            invokeBeanFactoryPostProcessors(beanFactory);
            registerBeanPostProcessors(beanFactory);
            // ......
        }
        // catch finally .....
    }
}
```

进来这个方法，发现核心的方法就一句话：

```java
protected void invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory beanFactory) {
    // 交给代理执行
    PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(beanFactory, getBeanFactoryPostProcessors());

    // 下面是支持AOP的部分（暂时不读）
}
```

好吧，它又是交给一个 **Delegate** 执行，那就进去看这个方法的实现吧。

### 2.2 PostProcessorRegistrationDelegate的实现

**前方高能**！`invokeBeanFactoryPostProcessors` 方法的篇幅实在太长了！！！小册只截取关键的部分吧。。。（只关注有注释的部分即可）

```java
public static void invokeBeanFactoryPostProcessors(
        ConfigurableListableBeanFactory beanFactory, List<BeanFactoryPostProcessor> beanFactoryPostProcessors) {

    Set<String> processedBeans = new HashSet<>();

    if (beanFactory instanceof BeanDefinitionRegistry) {
        BeanDefinitionRegistry registry = (BeanDefinitionRegistry) beanFactory;
        List<BeanFactoryPostProcessor> regularPostProcessors = new ArrayList<>();
        List<BeanDefinitionRegistryPostProcessor> registryProcessors = new ArrayList<>();

        // 该部分会将BeanFactoryPostProcessor与BeanDefinitionRegistryPostProcessor分离开
        for (BeanFactoryPostProcessor postProcessor : beanFactoryPostProcessors) {
            if (postProcessor instanceof BeanDefinitionRegistryPostProcessor) {
                BeanDefinitionRegistryPostProcessor registryProcessor =
                        (BeanDefinitionRegistryPostProcessor) postProcessor;
                registryProcessor.postProcessBeanDefinitionRegistry(registry);
                registryProcessors.add(registryProcessor);
            }
            else {
                regularPostProcessors.add(postProcessor);
            }
        }
        List<BeanDefinitionRegistryPostProcessor> currentRegistryProcessors = new ArrayList<>();

        // 首先，执行实现了PriorityOrdered接口的BeanDefinitionRegistryPostProcessors
        String[] postProcessorNames =
                beanFactory.getBeanNamesForType(BeanDefinitionRegistryPostProcessor.class, true, false);
        for (String ppName : postProcessorNames) {
            if (beanFactory.isTypeMatch(ppName, PriorityOrdered.class)) {
                currentRegistryProcessors.add(beanFactory.getBean(ppName, BeanDefinitionRegistryPostProcessor.class));
                processedBeans.add(ppName);
            }
        }
        sortPostProcessors(currentRegistryProcessors, beanFactory);
        registryProcessors.addAll(currentRegistryProcessors);
        invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
        currentRegistryProcessors.clear();

        // 接下来，执行实现了Ordered接口的BeanDefinitionRegistryPostProcessors
        postProcessorNames = beanFactory.getBeanNamesForType(BeanDefinitionRegistryPostProcessor.class, true, false);
        for (String ppName : postProcessorNames) {
            if (!processedBeans.contains(ppName) && beanFactory.isTypeMatch(ppName, Ordered.class)) {
                currentRegistryProcessors.add(beanFactory.getBean(ppName, BeanDefinitionRegistryPostProcessor.class));
                processedBeans.add(ppName);
            }
        }
        sortPostProcessors(currentRegistryProcessors, beanFactory);
        registryProcessors.addAll(currentRegistryProcessors);
        invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
        currentRegistryProcessors.clear();

        // 最后，执行所有其他BeanDefinitionRegistryPostProcessor
        boolean reiterate = true;
        while (reiterate) {
            reiterate = false;
            postProcessorNames = beanFactory.getBeanNamesForType(BeanDefinitionRegistryPostProcessor.class, true, false);
            for (String ppName : postProcessorNames) {
                if (!processedBeans.contains(ppName)) {
                    currentRegistryProcessors.add(beanFactory.getBean(ppName, BeanDefinitionRegistryPostProcessor.class));
                    processedBeans.add(ppName);
                    reiterate = true;
                }
            }
            sortPostProcessors(currentRegistryProcessors, beanFactory);
            registryProcessors.addAll(currentRegistryProcessors);
            invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
            currentRegistryProcessors.clear();
        }

        invokeBeanFactoryPostProcessors(registryProcessors, beanFactory);
        invokeBeanFactoryPostProcessors(regularPostProcessors, beanFactory);
    }

    else {
        invokeBeanFactoryPostProcessors(beanFactoryPostProcessors, beanFactory);
    }

    // 执行BeanFactoryPostProcessor ......
}
```

用简单的语言概括，这个方法的执行机制如下：

1. 执行 `BeanDefinitionRegistryPostProcessor` 的 `postProcessBeanDefinitionRegistry` 方法

   1. 执行实现了 `PriorityOrdered` 接口的 `BeanDefinitionRegistryPostProcessor`
   2. 执行实现了 `Ordered` 接口的 `BeanDefinitionRegistryPostProcessor`
   3. 执行普通的 `BeanDefinitionRegistryPostProcessor`

2. 执行 `BeanDefinitionRegistryPostProcessor` 的 `postProcessBeanFactory` 方法

    同上

3. 执行`BeanFactoryPostProcessor` 的 `postProcessBeanFactory` 方法

    同上

   在这个长长的方法中，第一个环节它会执行所有实现了 `PriorityOrdered` 接口的 `BeanDefinitionRegistryPostProcessor` ，这里面第一个执行的处理器就是 `ConfigurationClassPostProcessor` ，咱跟过去看一看。

### 2.3 ConfigurationClassPostProcessor的处理

直接定位到 `postProcessBeanDefinitionRegistry` 方法吧：

```java
public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
    int registryId = System.identityHashCode(registry);
    // check throw ex ......
    this.registriesPostProcessed.add(registryId);

    // 【解析配置类】
    processConfigBeanDefinitions(registry);
}
```

可以发现，在这个方法的最后一行，就是解析配置类中定义的 bean ，并封装为 `BeanDefinition` 。

> 进入超难领域前的 “按摩” 提醒：`processConfigBeanDefinitions` 方法的内容超级复杂哦（不亚于上面的 xml 配置文件加载），考虑到前面的 SpringBoot 小册中对该部分流程**没有全部剖析**（ **boot 的小册**中对于 IOC **更注重整体应用和容器的生命周期**），所以我们在这里**完整的研究一遍配置类的加载原理**。

进入 `processConfigBeanDefinitions` 方法，来吧，超级长的源码又出现了：（小伙伴们还是只关注有注释的源码段落即可）

```java
public void processConfigBeanDefinitions(BeanDefinitionRegistry registry) {
    List<BeanDefinitionHolder> configCandidates = new ArrayList<>();
    String[] candidateNames = registry.getBeanDefinitionNames();

    // 筛选出所有的配置类
    for (String beanName : candidateNames) {
        BeanDefinition beanDef = registry.getBeanDefinition(beanName);
        // full configuration的解释可参考boot小册12章5.2.1.1节
        if (ConfigurationClassUtils.isFullConfigurationClass(beanDef) ||
                ConfigurationClassUtils.isLiteConfigurationClass(beanDef)) {
            // logger ......
        } else if (ConfigurationClassUtils.checkConfigurationClassCandidate(beanDef, this.metadataReaderFactory)) {
            configCandidates.add(new BeanDefinitionHolder(beanDef, beanName));
        }
    }

    // Return immediately if no @Configuration classes were found
    if (configCandidates.isEmpty()) {
        return;
    }

    // 配置类排序
    configCandidates.sort((bd1, bd2) -> {
        int i1 = ConfigurationClassUtils.getOrder(bd1.getBeanDefinition());
        int i2 = ConfigurationClassUtils.getOrder(bd2.getBeanDefinition());
        return Integer.compare(i1, i2);
    });

    // 构造默认的BeanNameGenerator bean的名称生成器
    SingletonBeanRegistry sbr = null;
    if (registry instanceof SingletonBeanRegistry) {
        sbr = (SingletonBeanRegistry) registry;
        if (!this.localBeanNameGeneratorSet) {
            BeanNameGenerator generator = (BeanNameGenerator) sbr.getSingleton(CONFIGURATION_BEAN_NAME_GENERATOR);
            if (generator != null) {
                this.componentScanBeanNameGenerator = generator;
                this.importBeanNameGenerator = generator;
            }
        }
    }

    if (this.environment == null) {
        this.environment = new StandardEnvironment();
    }

    // 真正解析配置类的组件：ConfigurationClassParser
    ConfigurationClassParser parser = new ConfigurationClassParser(
            this.metadataReaderFactory, this.problemReporter, this.environment,
            this.resourceLoader, this.componentScanBeanNameGenerator, registry);

    Set<BeanDefinitionHolder> candidates = new LinkedHashSet<>(configCandidates);
    Set<ConfigurationClass> alreadyParsed = new HashSet<>(configCandidates.size());
    do {
        // 【解析配置类】
        parser.parse(candidates);
        parser.validate();

        Set<ConfigurationClass> configClasses = new LinkedHashSet<>(parser.getConfigurationClasses());
        configClasses.removeAll(alreadyParsed);

        if (this.reader == null) {
            this.reader = new ConfigurationClassBeanDefinitionReader(
                    registry, this.sourceExtractor, this.resourceLoader, this.environment,
                    this.importBeanNameGenerator, parser.getImportRegistry());
        }
        // 【加载配置类的内容】
        this.reader.loadBeanDefinitions(configClasses);
        alreadyParsed.addAll(configClasses);
        
        // 一些额外的处理动作
    }
    while (!candidates.isEmpty());

    // 一些额外的处理 ......
}

```

其实如果小伙伴从上往下看的话，应该可以意识到，其实也没那么难吧（当然没那么难，难的在 `parse` 和 `loadBeanDefinitions` 里头）。不过这里面的前置动作还是要注意一下，它初始化了一个 `ConfigurationClassParser` ，这个家伙是用来解析注解配置类的核心 API 。

一大堆前戏都做足了，下面就可以进入 `ConfigurationClassParser` 的 `parse` 方法了。

### 2.4 ConfigurationClassParser#parse - 解析注解配置类

```java
public void parse(Set<BeanDefinitionHolder> configCandidates) {
    for (BeanDefinitionHolder holder : configCandidates) {
        BeanDefinition bd = holder.getBeanDefinition();
        try {
            // 注解配置类
            if (bd instanceof AnnotatedBeanDefinition) {
                parse(((AnnotatedBeanDefinition) bd).getMetadata(), holder.getBeanName());
            }
            // 编程式注入配置类
            else if (bd instanceof AbstractBeanDefinition && ((AbstractBeanDefinition) bd).hasBeanClass()) {
                parse(((AbstractBeanDefinition) bd).getBeanClass(), holder.getBeanName());
            }
            // 其他情况
            else {
                parse(bd.getBeanClassName(), holder.getBeanName());
            }
        } // catch ......
    }
    
    // 回调特殊的ImportSelector
    this.deferredImportSelectorHandler.process();
}
```

先整体看一下这个方法的内容哈。上面的 for 循环中，它会把配置类的全限定名拿出来，扔进重载的 `parse` 方法中（注意无论是执行 if-else-if 的哪个分支，最终都是执行重载的 `parse` 方法）；for 循环调用完成后，最底下会让 `deferredImportSelectorHandler` 执行 `process` 方法，这个东西我们完全没见过，这里有必要说明一下。

#### 2.4.1 ImportSelector的扩展

在 SpringFramework 4.0 中，`ImportSelector` 多了一个子接口：`DeferredImportSelector` ，它的执行时机比 `ImportSelector` 更晚，它会在注解配置类的所有解析工作完成后才执行（其实上面的源码就已经解释了这个原理）。

一般情况下，`DeferredImportSelector` 会跟 `@Conditional` 注解配合使用，完成**条件装配**。

#### 2.4.2 deferredImportSelectorHandler的处理逻辑

进入 `DeferredImportSelectorHandler` 的 `process` 方法：

```java
public void process() {
    List<DeferredImportSelectorHolder> deferredImports = this.deferredImportSelectors;
    this.deferredImportSelectors = null;
    try {
        if (deferredImports != null) {
            DeferredImportSelectorGroupingHandler handler = new DeferredImportSelectorGroupingHandler();
            deferredImports.sort(DEFERRED_IMPORT_COMPARATOR);
            deferredImports.forEach(handler::register);
            handler.processGroupImports();
        }
    }
    finally {
        this.deferredImportSelectors = new ArrayList<>();
    }
}
```

### 2.5 parse解析配置类

回到正题上，上面的 `ConfigurationClassParser` 中最终都会把配置类传入重载的 `parse` 方法中，参数类型注意是 `ConfigurationClass` ：

```java
protected final void parse(AnnotationMetadata metadata, String beanName) throws IOException {
    processConfigurationClass(new ConfigurationClass(metadata, beanName));
}

protected void processConfigurationClass(ConfigurationClass configClass) throws IOException {
    if (this.conditionEvaluator.shouldSkip(configClass.getMetadata(), ConfigurationPhase.PARSE_CONFIGURATION)) {
        return;
    }

    ConfigurationClass existingClass = this.configurationClasses.get(configClass);
    if (existingClass != null) {
        // 如果配置类已经被@Import过了，则跳过
        if (configClass.isImported()) {
            if (existingClass.isImported()) {
                existingClass.mergeImportedBy(configClass);
            }
            return;
        }
        else {
            this.configurationClasses.remove(configClass);
            this.knownSuperclasses.values().removeIf(configClass::equals);
        }
    }

    SourceClass sourceClass = asSourceClass(configClass);
    do {
        // 【真正干活的】
        sourceClass = doProcessConfigurationClass(configClass, sourceClass);
    }
    while (sourceClass != null);

    this.configurationClasses.put(configClass, configClass);
}
```

