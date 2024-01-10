---
title: 09IOC基础-Bean的实例化方式.md
---

SpringFramework 中实例化 Bean 的方法有好多种，这里面还涉及到一个非常经典的设计模式：**工厂模式**。下面咱逐个介绍创建 Bean 的方式。

**实例化指调用构造方法，创建新的对象**，**初始化指创建好新的对象后的属性赋值、组件注入等后续动作**

## 1. 普通Bean实例化

其实咱前面创建的所有 `<bean>` 标签、`@Bean` 注解的方式，都是普通 Bean 的对象，它们默认是单实例的，在 IOC 容器初始化时就已经被初始化了。咱已经足够熟悉了，不多赘述。

## 2. 借助FactoryBean创建Bean【掌握】

### 2.1 普通Bean+FactoryBean

```java
public class Ball {
    
}

public class BallFactoryBean implements FactoryBean<Ball> {
    
    @Override
    public Ball getObject() {
        return new Ball();
    }
    
    @Override
    public Class<Ball> getObjectType() {
        return Ball.class;
    }
}
```

### 2.2 注册Bean

```java
@Bean
public BallFactoryBean ballFactoryBean() {
    return new BallFactoryBean();
}
```

注册 Bean 时，只需要注入 `FactoryBean` ，IOC 容器会自动识别，并默认在第一次获取时创建对应的 Bean 并缓存（针对默认的单实例 `FactoryBean` ）。

## 3. 借助静态工厂创建Bean【掌握】

### 3.1 创建Bean+静态工厂

咱创建一个 `Car` ，为了能看见它被创建，咱加一个构造方法：

```java
public class Car {
    
    public Car() {
        System.out.println("Car constructor run ...");
    }
}
```

之后，仿照上面的设计，咱直接写一个 `CarStaticFactory` 类，加上静态方法，返回 `Car` 即可：

```java
public class CarStaticFactory {
    
    public static Car getCar() {
        return new Car();
    }
}
```

### 3.2 配置xml

静态工厂的使用通常运用于 xml 方式比较多（主要是注解驱动没有直接能让它起作用的注解，编程式配置又可以直接调用，显得没那么大必要，下面会演示），咱下面创建一个 `bean-instantiate.xml` 文件，在这里面编写关于静态工厂的使用方法：

```xml
    <bean id="car1" class="org.clxmm.bean.c_instantiate.bean.Car"/>
    <bean id="car2" class="org.clxmm.bean.c_instantiate.bean.CarStaticFactory" factory-method="getCar"/>
```

可以看出来，上面的注册方式是普通的 Bean 注册方式，下面的方式会直接引用静态工厂，并声明要创建对象的工厂方法 `factory-method` 即可。SpringFramework 会依照这个 xml 的方式，解析出规则并调用静态工厂的方法来创建实际的 Bean 对象。

### 3.3 测试运行

```java
    
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("bean/bean-instantiate.xml");
        ctx.getBeansOfType(Car.class).forEach((beanName, car) -> {
            System.out.println(beanName + " : " + car);
        });
    }
```

运行 `main` 方法，发现控制台上打印了两次 `Car` 的构造方法运行，并且创建了两个 `Car` 对象：

```
Car constructor run ...
Car constructor run ...
car1 : org.clxmm.bean.c_instantiate.bean.Car@5700d6b1
car2 : org.clxmm.bean.c_instantiate.bean.Car@6fd02e5
```

### 3.4 静态工厂本身在工厂吗

```
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("bean/bean-instantiate.xml");
        ctx.getBeansOfType(Car.class).forEach((beanName, car) -> {
            System.out.println(beanName + " : " + car);
        });
        // 尝试取一下试试
        System.out.println(ctx.getBean(CarInstanceFactory.class));
    }
```

```
Exception in thread "main" org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'com.linkedbear.spring.bean.c_instantiate.bean.CarStaticFactory' available

```

由此可以得出一个结论：**静态工厂本身不会被注册到 IOC 容器中**。

### 3.5 编程式使用静态工厂

由于 SpringFramework 中并没有提供关于静态工厂相关的注解，所以只能使用注解配置类+编程式使用静态工厂了，而这个使用方式相当的简单：

```java
    @Bean
    public Car car2() {
        return CarStaticFactory.getCar();
    }
```

## 4. 借助实例工厂创建Bean【掌握】

跟静态工厂类似，SpringFramework 也支持咱用实例工厂来创建 Bean ，下面咱也来体会一下。

### 4.1 创建实例工厂

创建一个 `CarInstanceFactory` 代表实例工厂，它跟静态工厂唯一的区别是方法不再是 **static** 方法了：

```java
public class CarInstanceFactory {
    
    public Car getCar() {
        return new Car();
    }
}
```

### 4.2 配置xml

对于实例工厂，要想调用对象的方法，那自然得先把对象实例化才行了，所以咱就需要先在 xml 中注册实例工厂，随后才能创建真正的目标 Bean ：

```xml
    <bean id="carInstanceFactory" class="org.clxmm.bean.c_instantiate.bean.CarInstanceFactory"/>
    <bean id="car3" factory-bean="carInstanceFactory" factory-method="getCar"/>
```

可以发现，`<bean>` 标签可以不传入 class 属性，用 `factory-bean` 和 `factory-method` 属性也可以完成 Bean 的创建。

### 4.3 测试运行

去掉 `BeanInstantiateXmlApplication` 的 `main` 方法里面的静态工厂取出，之后运行，可以发现控制台这次打印了三次 `Car` 的构造方法打印：

```
Car constructor run ...
Car constructor run ...
Car constructor run ...
car1 : org.clxmm.bean.c_instantiate.bean.Car@6fd02e5
car2 : org.clxmm.bean.c_instantiate.bean.Car@5bcab519
car3 : org.clxmm.bean.c_instantiate.bean.Car@e45f292
```

这个时候再问那个问题：这次实例工厂在 IOC 容器中吗？那肯定不用思考就知道答案是存在了（都 `<bean>` 注册进去了。。。）

### 4.4 编程式使用实例工厂

跟上面的配置类中使用静态工厂一样，实例工厂的使用也是很蹂躏智商了：

```java
    @Bean
    public Car car3(CarInstanceFactory carInstanceFactory) {
        return carInstanceFactory.getCar();
    }
```