---
title: 23MyBatis中的设计模式-工厂方法、建造器模式
---

都是属于创建型模式，我们知道，**创建型模式提供了一种隐藏了创建逻辑的创建对象的方式**，这种设计使得**对象创建的时候，创建了什么、谁创建、如何创建、何时创建等方面提供了很大的灵活性**，

## 1. 工厂方法模式

工厂系列的模式，在 GoF 23 设计模式中有三种：**简单工厂、工厂方法、抽象工厂**，它们的抽象程度依次升高，难度也依次升高。MyBatis 中体现的比较多的是工厂方法模式，我们就重点来看它。

### 1.1 UML类图

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220405185232mybatis.png)

工厂方法模式强调的是创建对象的工厂有多个，与简单工厂不同的点在于，**简单工厂强调的是一个 `Product` 接口的多个实现类，由工厂决定创建哪个实现类对象**，而**工厂方法模式则是在创建对象工厂的时候，就已经决定了要创建的对象是什么了**。

我们可以写一个简单的伪代码体会一下。

### 1.2 伪代码思路

简单工厂的核心设计，用简单的伪代码实现如下：

```java
interface Animal {
    void eat();
}

class Cat implements Animal {}
class Dog implements Animal {}

class AnimalFactory {
    Animal create(String type) {
        switch type {
            case "cat": return new Cat();
            case "dog": return new Dog();
        }
    }
}
```

由代码可知，简单工厂只有一个工厂。

```java
interface Animal {
    void eat();
}

class Cat implements Animal {}
class Dog implements Animal {}

interface AnimalFactory {
    Animal create();
}

class CatFactory implements AnimalFactory {
    Animal create() {
        return new Cat();
    }
}

class DogFactory implements AnimalFactory {
    Animal create() {
        return new Dog();
    }
}
```



由此可知，**工厂方法模式中有多个工厂**，而且这些**工厂跟具体的实现类一一对应**。

### 1.3 MyBatis中的体现

回顾了工厂方法模式的核心，我们来看一个 MyBatis 中的体现。还记得在 MyBatis 全局配置文件解析的过程中，有一个解析环境信息的步骤吧，那个步骤会解析出事务管理器（ `TransactionFactory` ），以及数据源 `DataSource` 的配置：

```java
private void environmentsElement(XNode context) throws Exception {
    if (context != null) {
        if (environment == null) {
            environment = context.getStringAttribute("default");
        }
        for (XNode child : context.getChildren()) {
            String id = child.getStringAttribute("id");
            if (isSpecifiedEnvironment(id)) {
                TransactionFactory txFactory = transactionManagerElement(child.evalNode("transactionManager"));
                // 注意看这里！！！
                DataSourceFactory dsFactory = dataSourceElement(child.evalNode("dataSource"));
                DataSource dataSource = dsFactory.getDataSource();
                Environment.Builder environmentBuilder = new Environment.Builder(id)
                    .transactionFactory(txFactory)
                    .dataSource(dataSource);
                configuration.setEnvironment(environmentBuilder.build());
            }
        }
    }
}
```

注意看上面源码中标注的那一行注释，它是先创建了一个 `DataSourceFactory` ，然后由 `DataSourceFactory` 创建具体的 `DataSource` 。而这个 `DataSourceFactory` ，本身是一个接口，它有 3 个实现类：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220405185617mybatis.png)

从类名上，我们就可以非常容易的猜测出，它们分别创建出来的数据源都是什么。而且对应的工厂方法模式的 UML 类图，应该也就非常容易的浮现出来了吧：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220405204435mybatis.png)

是不是就是我们前面说的，一个工厂对应一个具体的实现类呀！

我们以 `UnpooledDataSourceFactory` 为例，它本身是一个没有连接池结构的数据源创建工厂，它的核心逻辑如下：

```java
    protected DataSource dataSource;

    public UnpooledDataSourceFactory() {
        // 这里创建了数据源的实现类
        this.dataSource = new UnpooledDataSource();
    }

    @Override
    public void setProperties(Properties properties) {
        Properties driverProperties = new Properties();
        // 应用配置文件中的属性配置(driverClassName  username  password等)
        MetaObject metaDataSource = SystemMetaObject.forObject(dataSource);
        for (Object key : properties.keySet()) {
            String propertyName = (String) key;
            if (propertyName.startsWith(DRIVER_PROPERTY_PREFIX)) {
                String value = properties.getProperty(propertyName);
                driverProperties.setProperty(propertyName.substring(DRIVER_PROPERTY_PREFIX_LENGTH), value);
            } else if (metaDataSource.hasSetter(propertyName)) {
                String value = (String) properties.get(propertyName);
                Object convertedValue = convertValue(metaDataSource, propertyName, value);
                metaDataSource.setValue(propertyName, convertedValue);
            } else {
                throw new DataSourceException("Unknown DataSource property: " + propertyName);
            }
        }
        if (driverProperties.size() > 0) {
            metaDataSource.setValue("driverProperties", driverProperties);
        }
    }
```

两个重要的点，上面的构造方法中，工厂把具体的数据源对象创建出来了，下面的 `setProperties` 方法中，它将数据源所必需的属性，利用 `MetaObject` 封装了反射的特性，设置到 `UnpooledDataSource` 数据源中。

而对于 `PooledDataSource` 来讲，它体现工厂方法模式的特点，也是在构造方法中，创建出来的数据源实现类对象不同：

```java
public class PooledDataSourceFactory extends UnpooledDataSourceFactory {

    public PooledDataSourceFactory() {
        // 这里创建出来的实现类不一样
        this.dataSource = new PooledDataSource();
    }
}
```



## 2. 建造者模式

建造者模式的核心，是**将一个复杂的对象，拆解为多个构建步骤，并将构建与表示分离，我们只需要关心构建的步骤，至于最终怎么构建的，我们不需要关心**。

### 2.1 UML类图

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220405204612mybatis.png)

建造者模式有 4 个核心的角色：**具体的产品 Product** 、**抽象的建造者 ProductBuilder** 、**实际创建产品的建造者实现 ProductBuilderImpl** 、**建造的指挥者 Director** ，建造者的具体实现中会组合一个最终创建出来的对象，它内部会负责复杂的创建逻辑，我们操控的可能是建造者本身，也有可能是负责指挥具体建造过程的 `Director` 

### 2.2 伪代码思路

我们也可以简单的写一个伪代码，体会一下建造者的设计思路。

```java
class Car {
    private String engine; // 发动机
    private String steeringWheel; // 方向盘
    private String wheel; // 轮胎
    
    public static class CarBuilder {
        private String engine = "default";
        private String steeringWheel = "default";
        private String wheel = "default";

        Car build() {
            Car car = new Car();
            car.setEngine(this.engine);
            // ...
            return car;
        }
        
        CarBuilder setEngine(String engine) {
            this.engine = engine;
            return this;
        }
        CarBuilder setSteeringWheel(String steeringWheel) {}
        CarBuilder setWheel(String wheel) {}
    }
}
```

可以发现，`CarBuilder` 起到了一个中间缓冲区的作用，它内部设置了一些默认值，当我们有对这些属性进行操作时，默认值会被覆盖，如果没有操作，则用建造者内部封装的默认值构造。

### 2.3 MyBatis中的体现

MyBatis 中的一个经典的建造者模式设计，是在 `SqlSessionFactory` 的初始化时，我们使用 `SqlSessionFactoryBuilder` ，通过传入全局配置文件来初始化生成 `SqlSessionFactory` 。

翻开 `SqlSessionFactoryBuilder` 的 `build` 方法，可以发现它重载的方法特别多，光是传入 `InputStream` 的方法就 4 个：

```java
ublic SqlSessionFactory build(InputStream inputStream) {
    return build(inputStream, null, null);
}

public SqlSessionFactory build(InputStream inputStream, String environment) {
    return build(inputStream, environment, null);
}

public SqlSessionFactory build(InputStream inputStream, Properties properties) {
    return build(inputStream, null, properties);
}

public SqlSessionFactory build(InputStream inputStream, String environment, Properties properties) {
    try {
        XMLConfigBuilder parser = new XMLConfigBuilder(inputStream, environment, properties);
        return build(parser.parse());
    } // catch finally ......
}
```

无论我们怎么传，最底层都会调用最底下的方法，帮我们构建好 `SqlSessionFactory` 对象。

再一个是在 `Environment` 的构建中，它内部也是有一个建造器：

```java
private void environmentsElement(XNode context) throws Exception {
    if (context != null) {
        if (environment == null) {
            environment = context.getStringAttribute("default");
        }
        for (XNode child : context.getChildren()) {
            String id = child.getStringAttribute("id");
            if (isSpecifiedEnvironment(id)) {
                TransactionFactory txFactory = transactionManagerElement(child.evalNode("transactionManager"));
                DataSourceFactory dsFactory = dataSourceElement(child.evalNode("dataSource"));
                DataSource dataSource = dsFactory.getDataSource();
                // 注意看这里
                Environment.Builder environmentBuilder = new Environment.Builder(id)
                        .transactionFactory(txFactory)
                        .dataSource(dataSource);
                configuration.setEnvironment(environmentBuilder.build());
            }
        }
    }
}
```

