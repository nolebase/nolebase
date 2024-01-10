---
title: 01 spring 
---
## 1、开始

### 1、简介

-  前身 interface21      [https://www.interface21.io/](https://www.interface21.io/)
- Spring 框架以interface21 框架为基础，经过重新设计，不断丰富
- spring理念： 使现有的技术更加容易使用，本身是一个打杂烩，整合了现有的技术框架



- ssh  struts2 spring hibernate
- ssm springmvc spring mybatis

官网 [https://spring.io/projects/spring-framework#overview](https://spring.io/projects/spring-framework#overview)

中文 [https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference](https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference)

### 2、优点

- 开源的免费框架
- 轻量级，非入侵
- 控制反转（ioc） 面向切面编程（aop）
- 支持事物的处理，对框架整合的支持

**轻量级的控制反转和面向切面编程的框架**

### 3、组成

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210719202613.png)

### 4、扩展

Projects    [https://spring.io/projects](https://spring.io/projects)

## 2、ioc理论

- Userdao 接口
- userdaoimpl
- userservice
- userserviceimpl

在之前的业务中，用户中的需求可能会影响代码，

```java
private UserDao userDao

// set 注入
public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
}

```

- 之前，程序是主动创建对象，
- 可以被动的接受对象

不用在去管理对象的创建，降低系统的耦合，可以更加专注在业务上的实现，这是ioc的原型

## 3 、 hello spring

[https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#spring-core](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#spring-core)





## 4、ioc 创建对象的方法

- 默认是无参的构造方法

- 可以指定有参的

  - 构造函数参数索引 **索引从 0 开始。**

  ```xml
  <bean id="exampleBean" class="examples.ExampleBean">
      <constructor-arg index="0" value="7500000"/>
      <constructor-arg index="1" value="42"/>
  </bean>
  ```

  - 构造函数参数类型匹配,如果您使用`type`属性显式指定了构造函数参数的类型，则容器可以使用简单类型的类型匹配

  ```xml
  <bean id="exampleBean" class="examples.ExampleBean">
      <constructor-arg type="int" value="7500000"/>
      <constructor-arg type="java.lang.String" value="42"/>
  </bean>
  ```

  - 构造函数参数名称,使用构造函数参数名称来消除歧义，如以下示例所示：

  ```xml
  <bean id="exampleBean" class="examples.ExampleBean">
      <constructor-arg name="years" value="7500000"/>
      <constructor-arg name="ultimateAnswer" value="42"/>
  </bean>
  ```

**在配置问价加载的守候，容器对象已经初始化了**

## 5、spring 配置

### 1、别名

```xml
    <!--        使用spring 来创建对象
        类型 变量名 = new 类型（）；

        id = 变量名
        class = new 的对象
        properties 相当于给对象中的属性设置一个值
     -->
    <bean id="hello" class="org.clxmm.Hello">
        <property name="str" value="Spring"/>
    </bean>
    <!--    别名-->
    <alias name="hello" alias="helloNew"/>
```



```java
    public static void main(String[] args) {
        // 获取spring 的上下文对象
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");

        Hello hello = (Hello) context.getBean("helloNew");

        System.out.println(hello.toString());

    }
```

可以使用别名去获取对象

### 2、bean的配置

id: bean的唯一标识符

class：bean对象的全限定名

name: 也是别名，name可以起多个用，分割

### 3、import

可以将多个配置文件，导入合并为一个

```xml
 <import resource="beans.xml"/>
```



## 6、依赖注入，di

[https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference/core.html#%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5](https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference/core.html#%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5)

DI 存在两个主要变体：[基于构造函数的依赖注入](https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference/core.html#beans-constructor-injection)和[基于 Setter 的依赖注入](https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference/core.html#beans-setter-injection)。

[https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#spring-core](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#spring-core)



### 1、构造器注入

### 2、set方式注入[重点]

- 依赖：bean对象的创建依赖于容器
- 注入：bean对象中的所有属性，由容器来注入

```java
public class Student {


    private String name;

    private Address address;

    private String[] book;

    private List<String> list;

    private Map<String, String> map;

    private Set<String> sets;
    private String npoint;

    private Properties properties;
    
    // set 
   }
   
   
   public class Address {
    private String address;
    // set
    }
```



```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">


    <bean name="address" class="org.clxmm.Address">

    </bean>

    <bean id="student" class="org.clxmm.Student">
        <!--        普通值注入   -->
        <property name="name" value="clxmm"/>
        <!--        bean注入  ref-->
        <property name="address" ref="address"/>
        <!--        数组  array-->
        <property name="book">
            <array>
                <value>array1</value>
                <value>array2</value>
                <value>array3</value>
            </array>
        </property>

        <!--        list  array-->
        <property name="list">
            <list>
                <value>1</value>
                <value>2</value>
                <value>3</value>
            </list>
        </property>

        <property name="map">
            <map>
                <entry key="k1" value="v1"/>
                <entry key="k2" value="v1"/>
            </map>
        </property>


        <property name="sets">
            <set>
                <value>s1</value>
                <value>s2</value>
            </set>
        </property>

        <!--        注入null-->
        <property name="npoint">
            <null></null>
        </property>


        <property name="properties">
            <props>
                <prop key="name">clxmm</prop>
                <prop key="add">clxmm11</prop>
            </props>
        </property>


    </bean>


</beans>
```



```java
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        Student student = (Student) context.getBean("student");

        System.out.println(student);
		//Student{name='clxmm', address=org.clxmm.Address@2df9b86, book=[array1, array2, array3], list=[1, 2, 3], map={k1=v1, k2=v1}, sets=[s1, s2], npoint='null', properties={add=clxmm11, name=clxmm}}

    }
```

**命名空间**

​    xmlns:p="http://www.springframework.org/schema/p"

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="classic" class="com.example.ExampleBean">
        <property name="email" value="someone@somewhere.com"/>
    </bean>

    <bean name="p-namespace" class="com.example.ExampleBean"
        p:email="someone@somewhere.com"/>
</beans>
```



**c命名空间**

在 Spring 3.1 中引入的 c-namespace 允许使用内联属性来配置构造函数参数，而不是嵌套的`constructor-arg`元素。

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="beanTwo" class="x.y.ThingTwo"/>
    <bean id="beanThree" class="x.y.ThingThree"/>

    <!-- traditional declaration with optional argument names -->
    <bean id="beanOne" class="x.y.ThingOne">
        <constructor-arg name="thingTwo" ref="beanTwo"/>
        <constructor-arg name="thingThree" ref="beanThree"/>
        <constructor-arg name="email" value="something@somewhere.com"/>
    </bean>

    <!-- c-namespace declaration with argument names -->
    <bean id="beanOne" class="x.y.ThingOne" c:thingTwo-ref="beanTwo"
        c:thingThree-ref="beanThree" c:email="something@somewhere.com"/>

</beans>
```

`c:`名称空间使用与`p:`相同的约定(对于 Bean 引用，尾随`-ref`)以其名称设置构造函数参数。同样，即使未在 XSD 模式中定义它(也存在于 Spring 内核中)也需要声明它。

使用要先倒入约束

### 3、拓展方式



## 7、Bean Scopes

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210724203203.png)



### 1、单例范围

```
<bean id="accountService" class="com.something.DefaultAccountService" scope="singleton"/>
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210724203557.png)

### 2、The Prototype Scope

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210724203650.png)

```
<bean id="accountService" class="com.something.DefaultAccountService" scope="prototype"/>

```

### 3、Request, Session, Application, and WebSocket Scopes

request，session，application和websocket范围仅在使用 Web 感知的 Spring ApplicationContext实现(例如XmlWebApplicationContext)时可用。如果将这些作用域与常规的 Spring IoC 容器(例如ClassPathXmlApplicationContext)一起使用，则会引发抱怨未知 bean 作用域的IllegalStateException

## 7、bean的自动装配（1.4.5. Autowiring Collaborators）

spring的三种装配方式

- xml中手动显示的配置
- java代码的现实配置
- 隐式的自动装配

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210724210604.png)

### 1、基于注解的自动装配
（1.9. Annotation-based Container Configuration）

在xml中配置注解支持和约束

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210725141800.png)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>

</beans>
```



### 2、@Autowired

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"

       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <!--    <bean name="cat" class="org.pojo.Cat"/>-->
    <!--    <bean name="dog" class="org.pojo.Dog"/>-->

    <!--    &lt;!&ndash;    显示的配置&ndash;&gt;-->
    <!--    &lt;!&ndash;    <bean name="people" class="org.pojo.People" >&ndash;&gt;-->
    <!--    &lt;!&ndash;        <property name="name" value="clxmm"/>&ndash;&gt;-->
    <!--    &lt;!&ndash;        <property name="cat" ref="cat"/>&ndash;&gt;-->
    <!--    &lt;!&ndash;        <property name="dog" ref="dog"/>&ndash;&gt;-->
    <!--    &lt;!&ndash;    </bean>&ndash;&gt;-->

    <!--    &lt;!&ndash;    自动装配&ndash;&gt;-->
    <!--    <bean name="people" class="org.pojo.People" autowire="byName">-->
    <!--        <property name="name" value="clxmm"/>-->
    <!--    </bean>-->

    <!--    基于注解的方式-->

    <context:annotation-config/>

    <bean name="cat" class="org.pojo.Cat"/>
    <bean name="dog" class="org.pojo.Dog"/>
    <bean name="people" class="org.pojo.People"/>

</beans>
```



可以在属性或者set方法上使用

还可以将注解应用于具有任意名称和多个参数的方法，



```java
    @Autowired
    private Dog dog;

    @Autowired
    private Cat cat;
```

```java
public class MovieRecommender {

    private MovieCatalog movieCatalog;

    private CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    public void prepare(MovieCatalog movieCatalog,
            CustomerPreferenceDao customerPreferenceDao) {
        this.movieCatalog = movieCatalog;
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

还可以使用`@Nullable`注解

```java
public class SimpleMovieLister {

    @Autowired
    public void setMovieFinder(@Nullable MovieFinder movieFinder) {
        ...
    }
}
```

The default behavior is to treat annotated methods and fields as indicating required dependencies. You can change this behavior as demonstrated in the following example, enabling the framework to skip a non-satisfiable injection point through marking it as non-required (i.e., by setting the `required` attribute in `@Autowired` to `false`):

[默认情况下，只要有零个候选 bean 可用，自动装配就会失败。默认行为是将带注解的方法，构造函数和字段视为指示所需的依赖项。在下面的示例中，您可以按照说明更改此行为：]

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Autowired(required = false)
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

### 3、@Qualifier

[1.9.4. 使用限定符对基于注解的自动装配进行微调]

`@Primary` is an effective way to use autowiring by type with several instances when one primary candidate can be determined. When you need more control over the selection process, you can use Spring’s `@Qualifier` annotation. You can associate qualifier values with specific arguments, narrowing the set of type matches so that a specific bean is chosen for each argument. In the simplest case, this can be a plain descriptive value, as shown in the following example:

(当可以确定一个主要候选对象时，`@Primary`是在几种情况下按类型使用自动装配的有效方法。当您需要对选择过程进行更多控制时，可以使用 Spring 的`@Qualifier`注解。您可以将限定符值与特定的参数相关联，从而缩小类型匹配的范围，以便为每个参数选择特定的 bean。在最简单的情况下，这可以是简单的描述性值，如以下示例所示：)

```
public class MovieRecommender {

    @Autowired
    @Qualifier("main")
    private MovieCatalog movieCatalog;

    // ...
}
```

您还可以在各个构造函数参数或方法参数上指定`@Qualifier`注解，如以下示例所示：

```
public class MovieRecommender {

    private MovieCatalog movieCatalog;

    private CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    public void prepare(@Qualifier("main")MovieCatalog movieCatalog,
            CustomerPreferenceDao customerPreferenceDao) {
        this.movieCatalog = movieCatalog;
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

### 4、@Resource 

Spring 还通过在字段或 bean 属性设置器方法上使用 JSR-250 `@Resource`注解 来支持注入。这是 Java EE 5 和 6 中的常见模式(例如，在 JSF 1.2 托管 Bean 或 JAX-WS 2.0 端点中)。 Spring 也为 SpringManagement 的对象支持此模式。

`@Resource`具有名称属性。默认情况下，Spring 将该值解释为要注入的 Bean 名称。换句话说，它遵循名称语义，如以下示例所示

```
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Resource(name="myMovieFinder") (1)
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}
```

- **(1)** 此行注入`@Resource`。

如果未明确指定名称，则默认名称是从字段名称或 setter 方法派生的。如果是字段，则采用字段名称。在使用 setter 方法的情况下，它采用 bean 属性名称。以下示例将名为`movieFinder`的 bean 注入其 setter 方法中：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Resource
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}
```

在未使用`@Resource`且未指定显式名称且与`@Autowired`类似的特殊情况下，`@Resource`查找主类型匹配而不是特定的命名 bean，并解析众所周知的可解决依赖项：`BeanFactory`，`ApplicationContext`，`ResourceLoader`，`ApplicationEventPublisher`和`MessageSource`接口。

@Resource装配顺序

  　　1. 如果同时指定了name和type，则从Spring上下文中找到唯一匹配的bean进行装配，找不到则抛出异常
  　　2. 如果指定了name，则从上下文中查找名称（id）匹配的bean进行装配，找不到则抛出异常
  　　3. 如果指定了type，则从上下文中找到类型匹配的唯一bean进行装配，找不到或者找到多个，都会抛出异常
  　　4. 如果既没有指定name，又没有指定type，则自动按照byName方式进行装配；如果没有匹配，则回退为一个原始类型进行匹配，如果匹配则自动装配；

### 6、@Required

`@Required`注解 适用于 bean 属性设置器方法，如以下示例所示：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Required
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

此注解指示必须在配置时通过 bean 定义中的显式属性值或通过自动装配来填充受影响的 bean 属性。如果受影响的 bean 属性尚未填充，则容器将引发异常。这允许急切和显式的故障，避免以后再出现`NullPointerException`个实例等。

### 7、@Primary 

使用@Primary 微调基于注解的自动装配

由于按类型自动布线可能会导致多个候选对象，因此通常有必要对选择过程进行更多控制。实现此目的的一种方法是使用 Spring 的`@Primary`注解。 `@Primary`表示当多个 bean 可以自动连接到单值依赖项的候选对象时，应优先考虑特定的 bean。如果候选中恰好存在一个主 bean，则它将成为自动装配的值。

考虑以下将`firstMovieCatalog`定义为主`MovieCatalog`的配置

```java
@Configuration
public class MovieConfiguration {

    @Bean
    @Primary
    public MovieCatalog firstMovieCatalog() { ... }

    @Bean
    public MovieCatalog secondMovieCatalog() { ... }

    // ...
}
```

使用前面的配置，下面的`MovieRecommender`与`firstMovieCatalog`自动连接：

```java
public class MovieRecommender {

    @Autowired
    private MovieCatalog movieCatalog;

    // ...
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>

    <bean class="example.SimpleMovieCatalog" primary="true">
        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean class="example.SimpleMovieCatalog">
        <!-- inject any dependencies required by this bean -->
    </bean>

    <bean id="movieRecommender" class="example.MovieRecommender"/>

</beans>
```



## 8、使用注解开发

在spring4 之后，如果要使用注解开发，要有aop的包、添加content约束和配置注解支持

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"

       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">


    <!--    基于注解的方式-->

    <context:annotation-config/>

    <!--    Classpath 扫描和托管组件-->
    <context:component-scan base-package="org.clxmm.pojo"/>

</beans>
```



### 1、bean

- @Component：组件
  - @Component 和其他构造型 注解,

### 2、属性如何注入

​	- @Value

```
@Value("xl")
    private String name;
```

### 3、@Component 的衍生注解

`@Repository`，`@Service`和`@Controller`是`@Component`的特化，用于更具体的用例(分别在持久层，服务层和表示层中)。因此，您可以使用`@Component`注解 组件类，但是通过使用`@Repository`，`@Service`或`@Controller`注解 组件类，则您的类更适合于通过工具进行处理或与方面相关联。例如，这些构造型注解成为切入点的理想目标。 `@Repository`，`@Service`和`@Controller`在 Spring 框架的 Future 发行版中还可包含其他语义。因此，如果在服务层使用`@Component`或`@Service`之间进行选择，则`@Service`显然是更好的选择。同样，如前所述，`@Repository`已被支持作为持久层中自动异常转换的标记。

 ### 4、 自动装配

- @Autowired
- @Nullable
- @Resource 

### 5、作用域

- @Scope