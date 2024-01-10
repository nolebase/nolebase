---
title: 06IOC基础-依赖注入-属性注入和自动注入
---



## 1.setter属性注入【掌握】

### 1.1 xml方式的setter注入

```xml
<bean id="person" class="com.linkedbear.spring.basic_di.a_quickstart_set.bean.Person">
    <property name="name" value="test-person-byset"/>
    <property name="age" value="18"/>
</bean>
```

### 1.2 注解方式的setter注入

注解形式的 setter 注入，咱之前学过的是在 bean 的创建时，编程式设置属性：

```java
@Bean
public Person person() {
    Person person = new Person();
    person.setName("test-person-anno-byset");
    person.setAge(18);
    return person;
}
```

## 2. 构造器注入【掌握】

有一些 bean 的属性依赖，需要在调用构造器（构造方法）时就设置好；或者另一种情况，有一些 bean 本身没有无参构造器，这个时候就必须使用**构造器注入**了。

### 2.1 修改Bean

为了演示构造器注入，需要给 `Person` 添加一个全参数构造方法：

```java
public Person(String name, Integer age) {
    this.name = name;
    this.age = age;
}
```

加上这个构造方法后，默认的无参构造方法就没了，这样原来的 `<bean>` 标签创建时就会失效，提示没有默认的构造方法：

```
Caused by: java.lang.NoSuchMethodException: com.linkedbear.spring.basic_di.b_constructor.bean.Person.<init>()

```

### 2.2 xml方式的构造器注入

在 `<bean>` 标签的内部，可以声明一个子标签：`constructor-arg` ，顾名思义，它是指构造器参数，由它可以指定构造器中的属性，来进行属性注入。`constructor-arg` 标签的编写规则如下：

```xml
<bean id="person" class="com.linkedbear.spring.basic_di.b_constructor.bean.Person">
    <constructor-arg index="0" value="test-person-byconstructor"/>
    <constructor-arg index="1" value="18"/>
</bean>
```

一个标签中有两部分，分别指定构造器的参数索引和参数值。这个地方真的能体现出 IDEA 的强大，如果没有在 `<bean>` 标签中声明 `constructor-arg` ，它会直接报红并提示帮你生成：

由此，可以对这些属性进行注入。

### 2.3 注解式构造器属性注入

注解驱动的 bean 注册中，也是直接使用编程式赋值即可：

```java
@Bean
public Person person() {
    return new Person("test-person-anno-byconstructor", 18);
}
```

## 3. 注解式属性注入【掌握】

看到这里，是不是突然有点迷？哎，上面不是都介绍了注解式的 setter 和构造器的注入了吗？为什么又突然开了一节介绍呢？

回想一下，注册 bean 的方式不仅有 `@Bean` 的方式，还有组件扫描呢！那些声明式注册好的组件，它们的属性怎么处理呢？所以这一节咱就专门拿出来介绍这部分，如果这部分出现了一些新的内容，咱也同样在 xml 的方式下演示。

### 3.1 @Component下的属性注入

先介绍最简单的属性注入方式：**`@Value`** 

新建一个 `Black` 类，并声明 `name` 和 `order` ，不过这次咱不设置 setter 方法了：

实现注解式属性注入，可以直接在要注入的字段上标注 **`@Value`** 注解：

```java
@ToString
@Component
public class Black {

    @Value("black-value-anno")
    private String name;

    @Value("0")
    private String order;
}
```

随后，咱使用组件扫描的形式，将这个 `Black` 类扫描到 IOC 容器，并取出打印：

```java
public static void main(String[] args) throws Exception {

  ApplicationContext context = new AnnotationConfigApplicationContext("org.clxmm.basic_di.c_value_spel.bean");
  Black black = context.getBean(Black.class);
  System.out.println(black);

}
```

输出

```
Black(name=black-value-anno, order=0)
```

### 3.2 外部配置文件引入-@PropertySource

用于导入外部的配置文件：`@PropertySource` 。

#### 3.2.1 创建Bean+配置文件

新建一个 `Red` 类，结构与 `Black` 完全一致。

之后在工程的 resources 目录下新建一个 `red.properties` ，用于存放 `Red` 的属性的配置：

```properties
red.name=red-value-byproperties
red.order=1

```

#### 3.2.2 引入配置文件

使用时，只需要将 **`@PropertySource`** 注解标注在配置类上，并声明 properties 文件的位置，即可导入外部的配置文件：

```java
@Configuration
// 顺便加上包扫描
@ComponentScan("org.clxmm.basic_di.c_value_spel.bean")
@PropertySource("classpath:basic_di/value/red.properties")
public class InjectValueConfiguration {
}
```



#### 3.2.3 Red类的属性注入

对于 properties 类型的属性，`@Value` 需要配合**占位符**来表示注入的属性，我先写，写完你一下子就明白了：

```java
 @Value("${red.name}")
    private String name;
    
    @Value("${red.order}")
    private Integer order;
```

是不是突然熟悉！这不跟 jsp 里的 el 表达式一个样吗？哎没错，还真就这样！

#### 3.2.4 测试启动类

修改启动类，将包扫描启动改为配置类启动，随后将 `Red` 取出：

```java
    public static void main(String[] args) throws Exception {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(InjectValueConfiguration.class);
        Red red = ctx.getBean(Red.class);
        System.out.println("properties value : " + red);
    }
```

```
properties value : Red(name=black-value-anno, order=0)
```

#### 3.2.5 xml中使用占位符

对于 xml 中，占位符的使用方式与 `@Value` 是一模一样的：

```xml
<bean class="com.linkedbear.spring.basic_di.c_value_spel.bean.Red">
    <property name="name" value="${red.name}"/>
    <property name="order" value="${red.order}"/>
</bean>
```



## 1. 自动注入【掌握】

xml 中的 `ref` 属性可以在一个 Bean 中注入另一个 Bean ，注解同样也可以这样做，它可以使用的注解有很多种，咱一一来学习。

### 1.1 @Autowired

在 Bean 中直接在 **属性 / setter 方法** 上标注 `@Autowired` 注解，IOC 容器会**按照属性对应的类型，从容器中找对应类型的 Bean 赋值到对应的属性**上，实现自动注入。

#### 1.1.1 创建Bean

```java
@Component("administrator")
public class Person {

    private String name = "administrator";

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Person{" + "name='" + name + '\'' + '}';
    }
}
```

#### 1.1.2 给Dog注入Person的三种方式

```java
@Component
public class Dog {
    
    @Value("dogdog")
    private String name;
    
    @Autowired
    @Qualifier("administrator")
    private Person person;
    
    @Autowired
    private List<Person> persons;
    
    @Override
    public String toString() {
        return "Dog{" + "name='" + name + '\'' + ", person=" + person + ", persons=" + persons + '}';
    }
}
```

#### 1.1.3 测试启动类

```java
    public static void main(String[] args) {
        ApplicationContext ctx = new AnnotationConfigApplicationContext("org.clxmm.basic_di.d_autowired.bean");
        Dog dog = ctx.getBean(Dog.class);
        System.out.println(dog);
    }
```

```
Dog{name='dogdog', person=Person{name='administrator'}, persons=[Person{name='administrator'}]}
```

#### 1.1.4 注入的Bean不存在

将 `Person` 上面的 `@Component` 暂时的注释掉，此时 IOC 容器中应该没有 `Person` 了吧，再次运行启动类，可以发现

```
Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'com.linkedbear.spring.basic_di.d_autowired.bean.Person' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {}

```

简单概括这个异常，就是说**本来想找一个类型为 `Person` 的 Bean ，但一个也没找到**！那必然没找到啊，`@Component` 注解被注释掉了，自然就不会注册了。如果出现这种情况下又不想让程序抛异常，就需要在 `@Autowired` 注解上加一个属性：**`required = false`** 。

```java
    @Autowired(required = false)
    private Person person;
```

再次运行启动类，可以发现控制台打印 `person=null` ，但没有抛出异常：

```java
    @Autowired(required = false)
    private Person person;
```

再次运行启动类，可以发现控制台打印 `person=null` ，但没有抛出异常：

### 1.2 @Autowired在配置类的使用

`@Autowired` 不仅可以用在普通 Bean 的属性上，在配置类中，注册 `@Bean` 时也可以标注：

```java
@Configuration
@ComponentScan("org.clxmm.basic_di.d_autowired.bean")
public class InjectComplexFieldConfiguration {

    @Bean
//    @Autowired // 高版本可不标注
    public Cat cat(Person person) {
        Cat cat = new Cat();
        cat.setName("mimi");
        cat.setPerson(person);
        return cat;
    }
}
```

由于配置类的上下文中没有 `Person` 的注册了（使用了 `@Component` 模式注解），自然也就没有 `person()` 方法给咱调，那就可以使用 `@Autowired` 注解来进行自动注入了。（其实不用标，SpringFramework 也知道自己得注入了）

### 1.3 多个相同类型Bean的自动注入

刚才咱已经使用 `@Component` 模式注解，在 `Person` 类上标注过了，此时 IOC 容器就应该有一个 `Person` 类型的 Bean 了。下面咱在配置类中再注册一个 ：

```java
    @Bean
    public Person master() {
        Person master = new Person();
        master.setName("master");
        return master;
    }
```

这样 IOC 容器就应该有两个 `Person` 对象了吧！接下来咱改一个地方，给 `Person` 的 `@Component` 加一个名称：

```java
@Component("administrator")
```

此时，两个 person 一个叫 master ，一个叫 administrator 。

下面咱直接运行测试启动类，可以发现控制台会报这样一个错误：

```
No qualifying bean of type 'org.clxmm.basic_di.d_autowired.bean.Person' available: expected single matching bean but found 2: administrator,master
```

IOC 容器发现有两个类型相同的 `Person` ，它也不知道注入哪一个了，索性直接 “我选择死亡” ，就挂了。

出现这个问题不能就这样不管啊，得先办法啊。SpringFramework 针对这种情况专门提供了两个注解，可以使用两种方式解决该问题。

#### 1.3.1 @Qualifier：指定注入Bean的名称

`@Qualifier` 注解的使用目标是要注入的 Bean ，它配合 `@Autowired` 使用，可以显式的指定要注入哪一个 Bean ：

```java
    @Autowired
    @Qualifier("administrator")
    private Person person;
```

#### 1.3.2 @Primary：默认Bean

`@Primary` 注解的使用目标是被注入的 Bean ，在一个应用中，一个类型的 Bean 注册只能有一个，它配合 `@Bean` 使用，可以指定默认注入的 Bean ：

```java
    @Bean
    @Primary
    public Person master() {
        Person master = new Person();
        master.setName("master");
        return master;
    }
```

#### 1.3.3 另外的办法

其实，如果不用上面的注解，也是可以解决问题的，只需要改一下变量名即可：

```java
    @Autowired
    private Person administrator;
```

### @Autowired注入的原理逻辑

**先拿属性对应的类型，去 IOC 容器中找 Bean ，如果找到了一个，直接返回；如果找到多个类型一样的 Bean ， 把属性名拿过去，跟这些 Bean 的 id 逐个对比，如果有一个相同的，直接返回；如果没有任何相同的 id 与要注入的属性名相同，则会抛出 `NoUniqueBeanDefinitionException` 异常。**

### 1.4 多个相同类型Bean的全部注入

上面都是注入一个 Bean 的方式，通过两种不同的办法来保证注入的唯一性。但如果需要一下子把所有指定类型的 Bean 都注入进去应该怎么办呢？其实答案也挺简单的，**注入一个用单个对象接收，注入一组对象就用集合来接收**：

```java
@Component
public class Dog {
    // ......
    
    @Autowired
    private List<Person> persons;
```

如上就可以实现一次性把所有的 `Person` 都注入进来，重新运行启动类，可以发现 persons 中有两个对象：

### 1.5 JSR250-@Resource

介绍 JSR250 规范之前，先简单了解下 JSR 。

> JSR 全程 **Java Specification Requests** ，它定义了很多 Java 语言开发的规范，有专门的一个组织叫 JCP ( Java Community Process ) 来参与定制。
>
> 有关 JSR250 规范的说明文档可参考官方文档：[jcp.org/en/jsr/deta…](https://link.juejin.cn/?target=https%3A%2F%2Fjcp.org%2Fen%2Fjsr%2Fdetail%3Fid%3D250)

回到正题，`@Resource` 也是用来属性注入的注解，它与 `@Autowired` 的不同之处在于：**`@Autowired` 是按照类型注入，`@Resource` 是直接按照属性名 / Bean的名称注入**。

是不是突然有点狂喜，这个 **`@Resource` 注解相当于标注 `@Autowired` 和 `@Qualifier`** 了！实际开发中，`@Resource` 注解也是用的很多的，可以根据情况来进行选择。

为了不与上面的代码起冲突，咱另创建一个 `Bird` ，也注入 `Person` ，不过这次咱直接用 `@Resource` 注解指定要注入的 Person ：

```java
@Component
public class Bird {
    
    @Resource(name = "master")
    private Person person;
```

之后在启动类中取出 `Bird` 并打印，可以发现确实正常注入了 name 为 "master" 的 `Person` 。

```
Bird{person=Person{name='master'}}

```

### 1.6 JSR330-@Inject

JSR330 也提出了跟 `@Autowired` 一样的策略，它也是**按照类型注入**。不过想要用 JSR330 的规范，需要额外导入一个依赖：

```xml
<!-- jsr330 -->
<dependency>
    <groupId>javax.inject</groupId>
    <artifactId>javax.inject</artifactId>
    <version>1</version>
</dependency>

```

剩下的使用方式就跟 SpringFramework 原生的 `@Autowired` + `@Qualifier` 一样了：

```java
@Component
public class Cat {
    
    @Inject // 等同于@Autowired
    @Named("admin") // 等同于@Qualifier
    private Person master;
```

可能会有小伙伴问了，那这个 `@Inject` 都跟 SpringFramework 原生的 `@Autowired` 一个作用，那我还用它干嘛？来看一眼包名：

```
import org.springframework.beans.factory.annotation.Autowired;

import javax.inject.Inject;
```

是不是突然明白了点什么？如果万一项目中没有 SpringFramework 了，那么 `@Autowired` 注解将失效，但 `@Inject` 属于 **JSR 规范，不会因为一个框架失效而失去它的意义**，只要导入其它支持 JSR330 的 IOC 框架，它依然能起作用。

## 依赖注入的注入方式

| 注入方式   | 被注入成员是否可变 | 是否依赖IOC框架的API                                         | 使用场景                           |
| ---------- | ------------------ | ------------------------------------------------------------ | ---------------------------------- |
| 构造器注入 | 不可变             | 否（xml、编程式注入不依赖）                                  | 不可变的固定注入                   |
| 参数注入   | 不可变             | 否（高版本中注解配置类中的 `@Bean` 方法参数注入可不标注注解） | 注解配置类中 `@Bean` 方法注册 bean |
| 属性注入   | 不可变             | 是（只能通过标注注解来侵入式注入）                           | 通常用于不可变的固定注入           |
| setter注入 | 可变               | 否（xml、编程式注入不依赖）                                  | 可选属性的注入                     |

## 自动注入的注解对比

| **注解**   | 注入方式     | 是否支持@Primary | **来源**                   | Bean不存在时处理                   |
| ---------- | ------------ | ---------------- | -------------------------- | ---------------------------------- |
| @Autowired | 根据类型注入 | 是               | SpringFramework原生注解    | 可指定required=false来避免注入失败 |
| @Resource  | 根据名称注入 | 是               | JSR250规范                 | 容器中不存在指定Bean会抛出异常     |
| @Inject    | 根据类型注入 | 是               | JSR330规范 ( 需要导jar包 ) | 容器中不存在指定Bean会抛出异常     |

`@Qualifier` ：如果被标注的成员/方法在根据类型注入时发现有多个相同类型的 Bean ，则会根据该注解声明的 name 寻找特定的 bean

`@Primary` ：如果有多个相同类型的 Bean 同时注册到 IOC 容器中，使用 “根据类型注入” 的注解时会注入标注 `@Primary` 注解的 bean

## 2. 复杂类型注入

这部分咱介绍的复杂类型注入包括如下几种：

```
数组
List / Set
Map
Properties
```

### 2.1 创建复杂对象

咱这次构造一个复杂的 Person ，里面的属性涵盖了上面涉及到的所有类型：

```java
public class Person {

    private String[] names;
    private List<String> tels;
    private Set<Cat> cats;
    private Map<String, Object> events;
    private Properties props;
    // setter
```

下面咱先来使用 xml 的方式注入属性。

### 2.2 xml复杂注入【掌握】

xml 注入复杂类型相对比较简单，咱先在 xml 中注册一个 `Person` （不要扫描 `Person` 所在的包）：

```xml
<bean id="mimi" class="com.linkedbear.spring.basic_di.g_complexfield.bean.Cat"/>
<property name="cats">
    <set>
        <bean class="com.linkedbear.spring.basic_di.g_complexfield.bean.Cat"/>
        <ref bean="mimi"/>
    </set>
  <property name="events">
    <map>
        <entry key="8:00" value="起床"/>
        <!-- 撸猫 -->
        <entry key="9:00" value-ref="mimi"/>
        <!-- 买猫 -->
        <entry key="14:00">
            <bean class="com.linkedbear.spring.basic_di.g_complexfield.bean.Cat"/>
        </entry>
        <entry key="18:00" value="睡觉"/>
    </map>
</property>
</property>

<bean class="com.linkedbear.spring.basic_di.g_complexfield.bean.Person">
  <property name="names">
    <array>
      <value>张三</value>
      <value>三三来迟</value>
    </array>
  </property>
  <property name="tels">
    <list>
        <value>13888</value>
        <value>15999</value>
    </list>
</property>
</bean>

```