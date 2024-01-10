---
title: 13MyBatis中的一些API
---

## 1. 反射系工具类

首先我们先来了解一些 MyBatis 内置的反射系工具类。反射是框架最最喜欢也最最常用的特性了，有了反射，框架可以完成非常多的底层工作，以支撑起我们自己开发的功能。MyBatis 的反射系工具比较多，大概有 SpringFramework 的那些反射相关工具的两倍多，不过难度相比较于 SpringFramework 的要低，我们选择其中比较重要的来看。

### 1.1 Reflector

`Reflector` 是 MyBatis 中反射的基础，我们可以先这么简单的理解一句话：**一个 `Reflector` 对象对应了一个 Class 的反射信息**。怎么理解这句话呢？这样吧，咱先看下 Reflector 的结构：

```java
public class Reflector {

    private final Class<?> type;
    private final String[] readablePropertyNames;
    private final String[] writablePropertyNames;
    private final Map<String, Invoker> setMethods = new HashMap<>();
    private final Map<String, Invoker> getMethods = new HashMap<>();
    private final Map<String, Class<?>> setTypes = new HashMap<>();
    private final Map<String, Class<?>> getTypes = new HashMap<>();
    private Constructor<?> defaultConstructor;
```

好家伙，一个类中的信息几乎都解释全了

#### 1.1.1 可读&可写

上面 Reflector 的类成员中有两个数组：`readablePropertyNames` 和 `writablePropertyNames` ，它们会分别存储一个类中可读的属性和可写的属性，何为可读与可写？其实就是 get 和 set 。按照规范来讲，我们在声明实体模型类时，通常都是这么来写的：

```java
public class Department {
    
    private String name;
    
    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

MyBatis 在解析这个 `Department` 类时，发现这里面定义了一个 name 属性，随后又发现了一个 `getName` 方法，则会认定这个 name 属性可读；后面解析时又发现了 `setName` 方法，则会认定这个 name 属性可写。

#### 1.1.2 getTypes & setTypes

这一对属性记录的是 getter 与 setter 方法，它们对应的属性类型是什么，比方说我们之前定义的 `User` 类，它的 `department` 属性的 get 方法，就是 `Department` 类型：

包括其余的属性，都会有所记录（如 id 的返回值是 String ），可它记录这些是为了什么呢？

不为别的，反射一次，**缓存**起来，以后就不用费劲了。

#### 1.1.3 Reflector的构造方法

了解了 `Reflector` 中的几个成员，下面我们简单的看一下 `Reflector` 的构造方法：（注释已标全）

```java
public Reflector(Class<?> clazz) {
    // 缓存当前Reflector对应的类
    type = clazz;
    // 如果有的话，记录下默认无参构造器
    addDefaultConstructor(clazz);
    // 缓存所有的getter方法
    addGetMethods(clazz);
    // 缓存所有的setter方法
    addSetMethods(clazz);
    // 缓存所有的属性字段(主要是处理没有getter/setter的)
    addFields(clazz);
    // Map转数组，都是为了缓存
    readablePropertyNames = getMethods.keySet().toArray(new String[0]);
    writablePropertyNames = setMethods.keySet().toArray(new String[0]);
    for (String propName : readablePropertyNames) {
        caseInsensitivePropertyMap.put(propName.toUpperCase(Locale.ENGLISH), propName);
    }
    for (String propName : writablePropertyNames) {
        caseInsensitivePropertyMap.put(propName.toUpperCase(Locale.ENGLISH), propName);
    }
}
```

可见，一个 Class 的所有属性方法信息，在 `Reflector` 的构造阶段就全部准备好了，之后再读取的时候就是走内部加载好的缓存了，这种设计，就是典型的**拿空间换时间**（MyBatis 认为时间更宝贵）。

### 1.2 ReflectorFactory

反射工厂，依照 MyBatis 的编码风格，凡是 **Factory** 最终都是**创建前面的单词的对象**，所以 `ReflectorFactory` 就是负责创建 `Reflector` 的了。这个家伙本身是一个接口：

```java
public interface ReflectorFactory {
    boolean isClassCacheEnabled();
    void setClassCacheEnabled(boolean classCacheEnabled);
    Reflector findForClass(Class<?> type);
}
```

核心方法是 `findForClass` ，在它的默认实现（也是唯一实现）`DefaultReflectorFactory` 中是这样的：

```java
private boolean classCacheEnabled = true;
private final ConcurrentMap<Class<?>, Reflector> reflectorMap = new ConcurrentHashMap<>();

public Reflector findForClass(Class<?> type) {
    if (classCacheEnabled) {
        // synchronized (type) removed see issue #461
        return reflectorMap.computeIfAbsent(type, Reflector::new);
    } else {
        return new Reflector(type);
    }
}
```

可以发现这个 `ReflectorFactory` 还有缓存的能力呢，这么做也是充分的体现了**空间换时间**的设计方式。

至于创建 `Reflector` 的方式，那简直朴实的不能再朴实了。。。

### 1.3 Invoker

上面的 `Reflector` 中，属性 `getMethods` 和 `setMethods` 都是一个 `Map` ，注意这个 `Map` 的 value 类型是 `Invoker` ，这家伙是个啥呢？

```java
public interface Invoker {
    Object invoke(Object target, Object[] args) throws IllegalAccessException, InvocationTargetException;
    Class<?> getType();
}
```

这家伙又是一个接口，注意它的核心方法 `invoke` ，咋看上去那么像反射中 `Method` 的 `invoke` 呢？哎没错，它其实就有一个落地实现，里面套了一个 `Method` 。这个接口一共有 3 个主要实现，我们可以简单地都看一下。

#### 1.3.1 MethodInvoker

`MethodInvoker` ，基于方法的 `Invoker` ，它的核心就是执行 `method.invoke()` ，还真就是套了层壳，没啥好说的哈。

```java
public class MethodInvoker implements Invoker {

    private final Class<?> type;
    private final Method method;

    @Override
    public Object invoke(Object target, Object[] args) throws 
      IllegalAccessException, InvocationTargetException {
        try {
            return method.invoke(target, args);
        } catch (IllegalAccessException e) {
            if (Reflector.canControlMemberAccessible()) {
                method.setAccessible(true);
                return method.invoke(target, args);
            } else {
                throw e;
            }
        }
```

#### 1.3.2 GetFieldInvoker

`GetFieldInvoker` ，基于 `Field` 的 `get` 动作封装，这就是上面 `Reflector` 中考虑到某些属性本身没有 getter 方法，但 MyBatis 可能还需要获取它的值，所以就使用了这样一层 `Invoker` 去获取属性的值，底层核心是 `field.get()` 。

```java
public class GetFieldInvoker implements Invoker {
    private final Field field;

    @Override
    public Object invoke(Object target, Object[] args) throws IllegalAccessException {
        try {
            return field.get(target);
        } catch (IllegalAccessException e) {
            if (Reflector.canControlMemberAccessible()) {
                field.setAccessible(true);
                return field.get(target);
            } else {
                throw e;
            }
        }
    }
```

#### 1.3.3 SetFieldInvoker

`SetFieldInvoker` ，同样是考虑到类中的某些属性没有 setter 方法，MyBatis 采取的措施，它的底层是 `field.set()` 。

```java
public class SetFieldInvoker implements Invoker {
    private final Field field;

    @Override
    public Object invoke(Object target, Object[] args) throws IllegalAccessException {
        try {
            field.set(target, args[0]);
        } catch (IllegalAccessException e) {
            if (Reflector.canControlMemberAccessible()) {
                field.setAccessible(true);
                field.set(target, args[0]);
            } else {
                throw e;
            }
        }
        return null;
    }
```

以上就是 `Invoker` 的三个基本实现，后面我们还会遇到它们

### 1.4 PropertyTokenizer

乍一看，这个 `PropertyTokenizer` 跟上面的几个类都没有关联，从字面意思上理解，它是叫**属性分词器**，那它的作用是什么呢？

#### 1.4.1 复杂result映射

假设有一张表的表结构如下：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220327205333.png)

这表也是够奇葩的了吧，对应的实体模型类也有点奇葩：

```java
public class Model {
    private String id;
    private String name;
    private List<Entry> props;
    
    private static class Entry {
        private String key;
        private Object value;
    }
}
```

上面的一条记录对应下面的一个 `Model` ，两对自定义属性放到 `props` 这个集合中。

像这样的一个奇葩的场景，resultMap 应该怎么写呢？MyBatis 表示这根本不在话下：

```xml
<resultMap id=="model" class="test.Model">
    <id property="id" column="id" />
    <property name="name" column="name" />
    <property name="props[0].key" column="key1" />
    <property name="props[0].value" column="value1" />
    <property name="props[1].key" column="key2" />
    <property name="props[1].value" column="value2" />
</resultMap>
```

看，使用 `[0]` 的写法，就可以精准定义好映射了，回头表中的数据也都能封装过去。

#### 1.4.2 写法的底层设计支持

MyBatis 怎么支持这种诡异的写法呢？这既是我们要说的这个 `PropertyTokenizer` 了。

从类名上看，`PropertyTokenizer` 译为 “属性分词器” ，它可以将 resultMap 中定义的复杂属性拆解为多个属性段，以便 MyBatis 对这些属性段分别解析处理。

我们可以简单看一下它的设计，这个家伙比较有趣，它实现了 `Iterator` 接口：

```java
public class PropertyTokenizer implements Iterator<PropertyTokenizer> {
    private String name;
    private final String indexedName;
    private String index;
    private final String children;
```

而且迭代的类型是它自身，说明 `PropertyTokenizer` 本身是**自迭代**的，这个设计相当巧妙，我们可以设想一下有这样一个复杂的 OGNL 表达式：`users[0].department.name` ，如果使用自迭代的模式解析，则可以有如下的迭代过程：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220327205540.png)

可以发现，这种迭代方式每次迭代一个 “节点” ，迭代一层之后就像 “扒掉一层衣服” 一样，并包装成另一个全新的对象，`PropertyTokenizer` 就是这么设计的。

#### 1.4.3 具体逻辑支持

明白了 `PropertyTokenizer` 的逻辑实现，下面我们来简单看一下代码的逻辑实现。

首先是 `PropertyTokenizer` 的构造方法：（关键逻辑的注释已标注）

```java
public PropertyTokenizer(String fullname) {
    // 试图将表达式拆分为多块
    int delim = fullname.indexOf('.');
    if (delim > -1) {
        name = fullname.substring(0, delim);
        children = fullname.substring(delim + 1);
    } else {
        // 没有级联属性
        name = fullname;
        children = null;
    }
    indexedName = name;
    // 处理可能存在的索引下标[]
    delim = name.indexOf('[');
    if (delim > -1) {
        index = name.substring(delim + 1, name.length() - 1);
        name = name.substring(0, delim);
    }
}
```

构造方法中，它会事先把属性名拆分为两部分，以便往下迭代解析。

再就是往下迭代的时候，由于实现了 `Iterator` 接口，所以只需要关注它的 `hasNext` 与 `next` 方法即可：

```java
@Override
public boolean hasNext() {
    return children != null;
}

@Override
public PropertyTokenizer next() {
    return new PropertyTokenizer(children);
}
```

可见，它直接用 `children` 属性构造新的 `PropertyTokenizer` 对象，这样就实现了自迭代。

### 1.5 MetaClass

完了 `PropertyTokenizer` ，下面就可以继续往下聊这个 `MetaClass` 了

`MetaClass` ，类名译为 “类的元信息” ，它的底层其实就是利用 `Reflector` 与 `PropertyTokenizer` ，实现了对类以及其中复杂的属性表达式的解析，并且还能获取这些属性的一些描述信息。

#### 1.5.1 findProperty

`findProperty` ，它就是去尝试着获取一个 `Class` 中的指定属性是否存在，换句话说，它的目的是**检验**指定的 `Class` 中是否**存在**指定的属性。我们简单看一下它的方法实现：

```java
public String findProperty(String name, boolean useCamelCaseMapping) {
    if (useCamelCaseMapping) {
        // 如果使用了下划线转驼峰，则这个name要去掉下划线(但没有将下划线后的字母改为大写!)
        name = name.replace("_", "");
    }
    return findProperty(name);
}

public String findProperty(String name) {
    StringBuilder prop = buildProperty(name, new StringBuilder());
    return prop.length() > 0 ? prop.toString() : null;
}
```

上面的方法会处理下划线转驼峰的情况，下面的方法是处理和判断，只要经过 `buildProperty` 方法后，`StringBuilder` 中有内容，就代表找到了属性，否则直接返回 null ，而调用 `findProperty` 方法的代码，都有一个是否为 null 的判断，这也就证实了我们上面说的 `findProperty` 是**检验属性是否存在**的功能。

如何解析属性是否存在呢？工作逻辑都在 `buildProperty` 中，我们进去一探究竟：（关键逻辑已标注注释））

```java
private StringBuilder buildProperty(String name, StringBuilder builder) {
    // 借助PropertyTokenizer解析
    PropertyTokenizer prop = new PropertyTokenizer(name);
    if (prop.hasNext()) {
        String propertyName = reflector.findPropertyName(prop.getName());
        if (propertyName != null) {
            builder.append(propertyName);
            builder.append(".");
            // 多级属性，再new一个MetaClass继续递归解析
            MetaClass metaProp = metaClassForProperty(propertyName);
            metaProp.buildProperty(prop.getChildren(), builder);
        }
    } else {
        // 单层属性，直接借助反射判断是否存在
        String propertyName = reflector.findPropertyName(name);
        if (propertyName != null) {
            builder.append(propertyName);
        }
    }
    return builder;
}
```

可以发现逻辑不算复杂，它利用了 `PropertyTokenizer` 可以解析多层级属性的特性，可以实现级联属性的检查，可能只从源码层面上不是特别好理解，小伙伴们可以实际动手测试一下，Debug 跟一遍流程体会一下。

#### 1.5.2 hasGetter & hasSetter

这两个方法，可以快速检查指定的属性是否包含 getter / setter 方法，它同样支持多层级属性的检查。由于源码的逻辑比较相似，所以这里我们以 `hasGetter` 方法为例简单过一下：（注释已标注在源码，不再配文字解读）

```java
public boolean hasGetter(String name) {
    PropertyTokenizer prop = new PropertyTokenizer(name);
    if (prop.hasNext()) {
        // 借助迭代和递归，逐层检查是否有getter
        if (reflector.hasGetter(prop.getName())) {
            MetaClass metaProp = metaClassForProperty(prop);
            return metaProp.hasGetter(prop.getChildren());
        } else {
            return false;
        }
    } else {
        // 单层属性，直接借助Reflector检查是否有getter方法
        return reflector.hasGetter(prop.getName());
    }
}
```

### 1.6 ObjectWrapper

与 `MetaClass` 类似的还有一个 `MetaObject` ，不过 `MetaObject` 针对的是对象实例。`MetaObject` 的反射，底层其实还是借助 `MetaClass` ，不过从对象到类，中间有一个过程，MyBatis 设计了一个 **`ObjectWrapper`** 包装需要反射处理的对象，所以我们先看下这个 `ObjectWrapper` 。

#### 1.6.1 接口核心方法

`ObjectWrapper` 本身是一个接口，这里面定义的核心方法，各位一眼便知：

```java
public interface ObjectWrapper {
    // 根据指定属性取值
    Object get(PropertyTokenizer prop);
    // 根据指定属性赋值
    void set(PropertyTokenizer prop, Object value);
    // 检查对象是否包含指定属性
    String findProperty(String name, boolean useCamelCaseMapping);
    // 检查对象是否包含指定属性的getter方法
    boolean hasSetter(String name);
    // 检查对象是否包含指定属性的setter方法
    boolean hasGetter(String name);

    // ......
}
```

除了上面的两个方法之外，下面的方法我们不用点进去源码实现，都应该有一种强烈的感觉吧：它不就是调用 `MetaClass` 吗？对的，它还真就是直接调用的 `MetaClass` 的方法：（举例）

```java
@Override
public String findProperty(String name, boolean useCamelCaseMapping) {
    return metaClass.findProperty(name, useCamelCaseMapping);
}
```

#### 1.6.2 核心实现BeanWrapper

接口只定义行为，具体的实现还是得找实现类，`ObjectWrapper` 有 3 个实现类：

- `BeanWrapper` ：基于 Bean 对象的包装
- `MapWrapper` ：基于 Map 的包装
- `CollectionWrapper` ：基于 Collection 集合的包装

下面两种我们不是很关心，主要还是研究基于 Bean 对象的 `BeanWrapper` ，毕竟这才是我们平时用的比较多的。

##### 1.6.2.1 结构和构造方法

```java
public class BeanWrapper extends BaseWrapper {

    private final Object object;
    private final MetaClass metaClass;

    public BeanWrapper(MetaObject metaObject, Object object) {
        super(metaObject);
        this.object = object;
        this.metaClass = MetaClass.forClass(object.getClass(), metaObject.getReflectorFactory());
    }
```

诶？怎么这里又传入了一个 `MetaObject` 呢？先不要着急，后面我们马上就讲到了，我们只需要注意一点，构造方法中它会将 bean 对象传入，并保存在对象内部。

##### 1.6.2.2 get & set

上面在看 `ObjectWrapper` 的 `get` 方法时我们就很容易得知，它是根据一个属性表达式，去对象中获取对应的属性值，`BeanWrapper` 中实现了该方法：

```java
@Override
public Object get(PropertyTokenizer prop) {
    // 检查属性表达式中是否有 [index] 索引下标值
    if (prop.getIndex() != null) {
        // 有的话，先解析成集合，再取值
        Object collection = resolveCollection(prop, object);
        return getCollectionValue(prop, collection);
    } else {
        // 取普通属性值，往下走
        return getBeanProperty(prop, object);
    }
}

private Object getBeanProperty(PropertyTokenizer prop, Object object) {
    try {
        // 直接取出Invoker，调用相应的方法(getter，或者直接反射取值)
        Invoker method = metaClass.getGetInvoker(prop.getName());
        try {
            return method.invoke(object, NO_ARGUMENTS);
        } catch (Throwable t) {
            throw ExceptionUtil.unwrapThrowable(t);
        }
    } // catch ......
}
```

纵观整段方法实现，其实难度不大，但关键的一点是，注意观察下面的 `getBeanProperty` ，它并没有做递归处理，说明这个 `get` 方法**只支持单层级属性获取**。

```java
@Override
public void set(PropertyTokenizer prop, Object value) {
    if (prop.getIndex() != null) {
        Object collection = resolveCollection(prop, object);
        setCollectionValue(prop, collection, value);
    } else {
        setBeanProperty(prop, object, value);
    }
}

private void setBeanProperty(PropertyTokenizer prop, Object object, Object value) {
    try {
        Invoker method = metaClass.getSetInvoker(prop.getName());
        Object[] params = {value};
        try {
            method.invoke(object, params);
        } // catch ......
    } // catch ......
}
```

### 1.7 MetaObject

既然 `ObjectWrapper` 只支持单层级的属性获取 / 设置，那遇到复杂的属性表达式怎么办呢？所以 MyBatis 有对标 `MetaClass` 的对象级处理：`MetaObject` 。

#### 1.7.1 MetaObject的创建

```java
private MetaObject(Object object, ObjectFactory objectFactory, 
         ObjectWrapperFactory objectWrapperFactory, ReflectorFactory reflectorFactory) {
    this.originalObject = object;
    this.objectFactory = objectFactory;
    this.objectWrapperFactory = objectWrapperFactory;
    this.reflectorFactory = reflectorFactory;

    // 根据被包装的object决定如何包装
    if (object instanceof ObjectWrapper) {
        this.objectWrapper = (ObjectWrapper) object;
    } else if (objectWrapperFactory.hasWrapperFor(object)) {
        this.objectWrapper = objectWrapperFactory.getWrapperFor(this, object);
    } else if (object instanceof Map) {
        this.objectWrapper = new MapWrapper(this, (Map) object);
    } else if (object instanceof Collection) {
        this.objectWrapper = new CollectionWrapper(this, (Collection) object);
    } else {
        this.objectWrapper = new BeanWrapper(this, object);
    }
}

// 静态方法创建MetaObject
public static MetaObject forObject(Object object, ObjectFactory objectFactory, 
         ObjectWrapperFactory objectWrapperFactory, ReflectorFactory reflectorFactory) {
    if (object == null) {
        return SystemMetaObject.NULL_META_OBJECT;
    } else {
        return new MetaObject(object, objectFactory, objectWrapperFactory, reflectorFactory);
    }
}
```

#### 1.7.2 getValue & setValue

既然 `ObjectWrapper` ，那 `MetaObject` 就有必要承担起递归获取的责任了。就跟 `MetaClass` 递归获取属性一样，`MetaObject` 递归获取属性值的套路，简直是一个模子出来的：

```java
public Object getValue(String name) {
    // 借助PropertyTokenizer拆分属性
    PropertyTokenizer prop = new PropertyTokenizer(name);
    if (prop.hasNext()) {
        // MetaObject递归获取
        MetaObject metaValue = metaObjectForProperty(prop.getIndexedName());
        if (metaValue == SystemMetaObject.NULL_META_OBJECT) {
            return null;
        } else {
            return metaValue.getValue(prop.getChildren());
        }
    } else {
        // 单层级属性，直接调用ObjectWrapper
        return objectWrapper.get(prop);
    }
}
```

相应的，`setValue` 的套路是几乎一样的，