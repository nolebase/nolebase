---
title: 02 spring 
---

## 1、基于java代码的方式配置spring

不使用xml配置，使用java代码的方式来配置

```java
public class User {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


}
```

```java
@Configuration
// 也会被spring容器托管，
// 配置类，applicationContext。xml
//@ComponentScan
public class AppConfig {

    /**
     * 注册一个bean
     * 方法名，相当于bean标签的id
     * 返回值，相当于class属性
     * @return
     */
    @Bean
    public User user() {
        return new User();
    }
}
```

```java
public class Test {

    public static void main(String[] args) {
        // 修改回去上下文的实现类
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        User user = context.getBean("user", User.class);
        System.out.println(user);
    }
}
```

## 2、aop

### 1、代理模式

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210725203829.png)

springaop的底层

分类

- 静态代理
- 动态代理



- 

### 2、静态代理模式

角色分析：

- 抽象角色
- 真实角色
- 代理角色：代理真实角色，代理后，一般由一些附属角色
- 客户

代码；

1.接口

```java
// 租房
public interface Rent {

    public void rent();
}

```

2.真实角色

```java
// 房东
public class Host implements Rent {
    @Override
    public void rent() {
        System.out.println(" 房东出租房子 ");
    }
}
```

3.代理角色

```java
public class Proxy implements Rent {


    private Host host;


    public Proxy() {
    }

    public Proxy(Host host) {
        this.host = host;
    }


    @Override
    public void rent() {
        seeHouse();
        host.rent();
        heTong();
        fare();
    }

    // 看房
    public void seeHouse() {
        System.out.println("中介带人看房");
    }

    // 收中介费
    public void fare() {
        System.out.println("中介收中介费");
    }

    // 合同
    public void heTong() {
        System.out.println("中介和你牵租赁合同");
    }

}
```



4.客户端访问代理角色

```java
public class Client {

    public static void main(String[] args) {
//        Host host = new Host();
//        host.rent();


        Host host = new Host();
        // 中介帮房东租房子
        // 中介的附属操作
        Proxy proxy = new Proxy(host);
        
        proxy.rent();

    }
}
```



好处：

- 使真实的角色更加纯粹，不用去关注公共业务
- 公共业务交给代理角色，业务分工
- 公共业务发生扩展，方便集中管理

缺点：

- 一个真实角色就会产生一个代理角色；代码量会增加

  

代码2:模拟给原有的代码添加一下日志

```java
public interface UserService {
    public void add();

    public void delete();

    public void update();

    public void query();
}

// 相当于真实对象
public class UserServiceImpl implements UserService{

    @Override
    public void add() {
        System.out.println("add");
    }

    @Override
    public void delete() {

        System.out.println("delete");
    }

    @Override
    public void update() {
        System.out.println("update");
    }

    @Override
    public void query() {
        System.out.println("query");
    }
}

```



```java
public class UserServiceProxy implements UserService {

    private UserServiceImpl userService;

    public UserServiceProxy(UserServiceImpl userService) {
        this.userService = userService;
    }

    @Override
    public void add() {
        log("add");
        userService.add();
    }

    @Override
    public void delete() {
        log("delete");
        userService.delete();
    }

    @Override
    public void update() {
        log("update");
        userService.update();
    }

    @Override
    public void query() {
        log("query");
        userService.query();

    }


    public void log(String msg) {
        System.out.println("[debug]:" + msg + "method" + new Date());
    }
}
```

client

```java
    public static void main(String[] args) {

//        UserService userService = new UserServiceImpl();
        UserService userService = new UserServiceProxy(new UserServiceImpl());
        userService.add();
    }
```

### 3、动态代理

- 动态代理和静态代理的角色一样
- 动态代理的代理类是动态生成的，不是直接写好的
- 动态代理可以分为两大类
  - 基于接口的。（jdk）
  - 基于类的。cglib
  - java字节码



- proxy 代理
- InvocationHandler  



代码1

```java

public interface Rent {

    public void rent();
}

public class Host implements Rent {
    @Override
    public void rent() {
        System.out.println(" 房东出租房子 ");
    }
}

// 自动生成代理
public class ProxyInvocationHandler implements InvocationHandler {

    // 被代理的接口
    private Rent rent;


    // 处理代理实例，并返回结果
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

        seeHouse();
        // 利用反射机制执行，得到结果
        Object result = method.invoke(rent, args);

        fare();
        heTong();

        return result;
    }


    // 生成得到代理类
    public Object getProxy() {
        Object o = Proxy.newProxyInstance(this.getClass().getClassLoader(), rent.getClass().getInterfaces(), this);
        return o;
    }


    public Rent getRent() {
        return rent;
    }

    public void setRent(Rent rent) {
        this.rent = rent;
    }



    // 看房
    public void seeHouse() {
        System.out.println("中介带人看房");
    }

    // 收中介费
    public void fare() {
        System.out.println("中介收中介费");
    }

    // 合同
    public void heTong() {
        System.out.println("中介和你牵租赁合同");
    }

}


public class Client {


    public static void main(String[] args) {

        // 真实角色
        Host host = new Host();

        // 代理角色：现在没有


        ProxyInvocationHandler pih = new ProxyInvocationHandler();
        // 通过调用程序处理角色，来处理要调用的接口对象
        pih.setRent(host);

        Rent rent = (Rent) pih.getProxy();  // rent动态生成的
        rent.rent();

    }
}
```





代码2 

```
// 自动生成代理
public class ProxyInvocationHandler implements InvocationHandler {

    // 被代理的接口
    private Object target;


    // 处理代理实例，并返回结果
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

        // other ....
        // 利用反射机制执行，得到结果
        Object result = method.invoke(target, args);
    
        // other ...

        return result;
    }


    // 生成得到代理类
    public Object getProxy() {
        Object o = Proxy.newProxyInstance(this.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
        return o;
    }


    public void setTarget(Object target) {
        this.target = target;
    }
}


public class Client {

    public static void main(String[] args) {
        UserService userService = new UserServiceImpl();



        ProxyInvocationHandler pih = new ProxyInvocationHandler();

        pih.setTarget(userService);

        UserService proxy = (UserService) pih.getProxy();

        proxy.add();


    }
}
```



动态代理的好处：

- 可以直接使用真实对象，不用去关注公共业务
- 公共业务交个代理角色
- 公共业务发生扩展，方便集中管理
- 一个动态代理类代理的是一个接口，一般就是对应的一类业务
- 一个动态代理类可以代理多个类，只要实现其接口



## 3、AOP

aop： 面向切面编程



![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210726164703.png) 

1、aop在spring

**提供声明使事物，允许用户自定义切面**

- 横切关注点：跨应用程序多个模块的方法或功能，即：与我们的业务逻辑无关，我梦需要关注的部分，就是横切关注点，如：日志，安全，缓存，事物等
- 切面（aspect）：横切关注点被模块化的特殊对象。即，它是一个类
- 通知（advice）： 切面要完成的工作。即，它是一个方法
- 目标（Target）：被通知对象
- 代理（proxy）：向目标对象应用通知后创建的对象
- 切入点（pointcut）：切面通知，执行的‘地点’的定义
- 连接点（jointPoint）：与切入点匹配的执行点

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210726175758.png)

### 2、spring中xml的方式使用aop

添加所需依赖

```xml
<dependency>
  <groupId>org.aspectj</groupId>
  <artifactId>aspectjweaver</artifactId>
  <version>1.9.2</version>
</dependency>
```



```java
public interface UserService {

    public void add();

    public void delete();

    public void update();

    public void query();
}

public class UserServiceImpl implements UserService {

    @Override
    public void add() {
        System.out.println("add");
    }

    @Override
    public void delete() {

        System.out.println("delete");
    }

    @Override
    public void update() {
        System.out.println("update");
    }

    @Override
    public void query() {
        System.out.println("query");
    }
}
```



```java
public class Log implements MethodBeforeAdvice {
    /**
     * @param method  目标方法
     * @param objects 参数
     * @param target  目标对象
     * @throws Throwable
     */
    @Override
    public void before(Method method, Object[] objects, Object target) throws Throwable {
        System.out.println(target.getClass().getName() + ":" + method.getName());
    }


}

public class AfterLog implements AfterReturningAdvice {

    @Override
    public void afterReturning(Object returnValue, Method method, Object[] objects, Object target) throws Throwable {


        System.out.println(method.getName() + ": return " + returnValue);
    }
}
```



配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"

       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <bean id="userService" class="org.clxmm.UserServiceImpl"/>
    <bean id="log" class="org.clxm.log.Log"/>
    <bean id="afterLog" class="org.clxm.log.AfterLog"/>


    <!--    方式一：使用 spring     API 接口-->
    <!--       配置aop :   添加约束 -->
    <aop:config>
        <!--        切入点  expression 表达式   execution要执行的位置    -->
        <aop:pointcut id="pointcut" expression="execution(* org.clxmm.UserServiceImpl.*(..))"/>

        <!--        执行环绕增加 -->

        <aop:advisor advice-ref="log" pointcut-ref="pointcut"/>
        <aop:advisor advice-ref="afterLog" pointcut-ref="pointcut"/>
    </aop:config>

</beans>
```



测试

```java
    public static void main(String[] args) {

        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");

//        UserService userService = (UserService) context.getBean("userService");
        // 动态代理，代理的是接口
        UserService userService = context.getBean("userService",UserService.class);
        userService.add();
    }
```

### 3、自定义来实现aop（切面定义）

```java
public class MyPointCut {

    public void before() {
        System.out.println("=====before===");
    }

    public void after() {
        System.out.println("=====after===");
    }
}
```



```xml
    <!--    方式二：自定义 -->

    <bean id="myPoint" class="org.config.MyPointCut"/>

    <aop:config>
        <!--        自定义切面  -->
        <aop:aspect ref="myPoint">
            <!--    切入点        -->
            <aop:pointcut id="point" expression="execution(* org.clxmm.UserServiceImpl.*(..))"/>
            <!--       通知   -->
            <aop:before method="before" pointcut-ref="point"/>
            <aop:after method="after" pointcut-ref="point"/>
        </aop:aspect>
    </aop:config>
```

### 4、使用注解的方式aop

```java
package org.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

/**
 * @author clxmm
 * @Description
 * @create 2021-07-26 7:13 下午
 */

@Aspect
// 标注这个类是一个切面
public class AnnoPoint {


    @Before("execution(* org.clxmm.UserServiceImpl.*(..))")
    public void before() {
        System.out.println("=====before===");
    }


    @After("execution(* org.clxmm.UserServiceImpl.*(..))")
    public void after() {
        System.out.println("=====after===");
    }



    @Around("execution(* org.clxmm.UserServiceImpl.*(..))")
    public void around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("before");

        // 执行方法
        joinPoint.proceed();

        System.out.println("after");
    }
}

```

 

配置

```xml

    <bean id="annoPoint" class="org.config.AnnoPoint"/>


    <!--    开启注解支持     jdk 默认（proxy-target-class="false"）  cglib (proxy-target-class="true")-->
    <aop:aspectj-autoproxy  />
```

测试输出

before
=====before===
add
after
=====after===



## 4、 整合Mybatis

[https://mybatis.org/spring/zh/index.html](https://mybatis.org/spring/zh/index.html)





倒入依赖

```xml
    <dependencies>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
            <scope>test</scope>
        </dependency>


        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>

        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.2</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.2.10.RELEASE</version>
        </dependency>


        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.10.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.9.2</version>
        </dependency>


        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.2</version>
        </dependency>


    </dependencies>
```



### 1、mybatis 原来的方式

实体类

```java
public class User {

    private String id;

    private String name;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
```

Mapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">


<mapper namespace="org.clxmm.mapper.UserMapper">
    <select id="getUser" resultType="user">
        select * from user
    </select>
</mapper>
```

Mybatis的配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>


    <typeAliases>
        <package name="org.clxmm.pojo"/>
    </typeAliases>
    <environments default="development">

        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url"
                          value="jdbc:mysql://127.0.0.1:3306/mybatis?useSSL=false&amp;useEncode=true&amp;characterEncoding=UTF-8"/>
                <property name="username" value="root"/>
                <property name="password" value="root"/>
            </dataSource>
        </environment>
    </environments>


    <mappers>
        <mapper class="org.clxmm.mapper.UserMapper"/>

    </mappers>

</configuration>

```

测试

```java

    /**
     * mybatis 的方式
     * @throws IOException
     */
    @Test
    public void test1() throws IOException {

        InputStream in = Resources.getResourceAsStream("mybatis-config.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(in);

        SqlSession sqlSession = sqlSessionFactory.openSession(true);

        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        List<User> user = mapper.getUser();

        System.out.println(user.size());
    }
```



### 2、mybatis-spring

在spring.xml配置

1、编写数据源

2、sqlSessionFactory

3、sqlSession（SqlSessionTemplate实现）

4、给接口添加实现类

5、将自己写的实现类，注入到spring中

6、测试

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"

       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">


    <!--    spring 的数据源替换mybatis 的配置，
        使用spring 的jdbc   spring-jdbc
   -->
    <!--    DataSource-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url"
                  value="jdbc:mysql://127.0.0.1:3306/mybatis?useSSL=false&amp;useEncode=true&amp;characterEncoding=UTF-8"/>
        <property name="username" value="root"/>
        <property name="password" value="root"/>
    </bean>


    <!--    SqlSessionFactory-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <!--        绑定mybatis-config.xml 配置 -->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>

        <!--        代替mybatis 的配置-->
        <property name="mapperLocations" value="classpath:org/clxmm/mapper/*Mapper.xml"/>

    </bean>
    <!--    SqlSessionTemplate 就是 sqlSession -->
    <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
        <!--        通过构造器注入 sqlSessionFactory  ，没有set方法 -->
        <constructor-arg name="sqlSessionFactory" ref="sqlSessionFactory"/>
    </bean>


    <bean id="userMapper" class="org.clxmm.mapper.UserMapperImpl">
        <property name="sqlSessionTemplate" ref="sqlSession"/>
    </bean>


</beans>
```

可以注释掉mybatis中的配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>


    <typeAliases>
        <package name="org.clxmm.pojo"/>
    </typeAliases>
<!--    <environments default="development">-->

<!--        <environment id="development">-->
<!--            <transactionManager type="JDBC"/>-->
<!--            <dataSource type="POOLED">-->
<!--                <property name="driver" value="com.mysql.jdbc.Driver"/>-->
<!--                <property name="url"-->
<!--                          value="jdbc:mysql://127.0.0.1:3306/mybatis?useSSL=false&amp;useEncode=true&amp;characterEncoding=UTF-8"/>-->
<!--                <property name="username" value="root"/>-->
<!--                <property name="password" value="root"/>-->
<!--            </dataSource>-->
<!--        </environment>-->
<!--    </environments>-->


<!--    <mappers>-->
<!--        <mapper class="org.clxmm.mapper.UserMapper"/>-->

<!--    </mappers>-->

</configuration>
```

UserMapperImpl. 实现类（业务类代替）

```java
public class UserMapperImpl implements UserMapper {



    private SqlSessionTemplate sqlSessionTemplate;

    @Override
    public List<User> getUser() {

        UserMapper mapper = sqlSessionTemplate.getMapper(UserMapper.class);
        List<User> user = mapper.getUser();

        return user;
    }


    public void setSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate) {
        this.sqlSessionTemplate = sqlSessionTemplate;
    }
}
```

测试

```java
    /**
     * spring 的方式
     */
    @Test
    public void test2() {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring-dao.xml");
        UserMapper userMapper = context.getBean("userMapper", UserMapper.class);
        List<User> user = userMapper.getUser();
        System.out.println(user.size());
    }
```

### 3、mybatis-spring 方式二

继承SqlSessionDaoSupport

```java
public class UserMapperImpl2  extends SqlSessionDaoSupport implements  UserMapper{
    @Override
    public List<User> getUser() {
        System.out.println("usermapper2");
        SqlSession sqlSession = getSqlSession();

        List<User> user = sqlSession.getMapper(UserMapper.class).getUser();

        return user;
    }

}
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210726212807.png)

```xml
    <bean id="userMapper2" class="org.clxmm.mapper.UserMapperImpl2">
        <property name="sqlSessionTemplate" ref="sqlSession"/>
    </bean>
```

**本质上也是注入sqlsession，是注入到父类中了**



## 5、声明式事物

### 1、回顾

- 要么都成功，要么都失败
- 涉及到数据一致性和完整性

**事物的acid原则**

- 原子性
- 一致性
- 隔离型
  - 多个业务可能操作同一个资源，防止数据损坏
- 持久性
  - 失去一旦提交，就被持久的写到存储器中

### 2、spring中mybatis 中的事务

[https://mybatis.org/spring/zh/transactions.html](https://mybatis.org/spring/zh/transactions.html)

- 声明式事务：aop
- 编程式事务：在代码中进行事物管理



   在声明式的事务处理中，要配置一个切面，其中就用到了propagation，表示打算对这些方法怎么使用事务，是用还是不用，其中propagation有七种配置，REQUIRED、SUPPORTS、MANDATORY、REQUIRES_NEW、NOT_SUPPORTED、NEVER、NESTED。默认是REQUIRED。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/spring20210727203646.png)

代码

在接口中添加两个操作数据库的接口

```java
  public int addUser(User user);

    public int deleteUser(int id);
    public void testTx() ;
```

```xml

    <insert id="addUser" parameterType="user">

            insert into  user (id,name) values (#{id},#{name})

    </insert>

    <delete id="deleteUser" parameterType="int">
      <!-- 错误的sql -->
                deletes  user where id = #{id}

    </delete>

```



实现类

```java
    public void testTx() {

        User user = new User();
        user.setName("clxmm");
        user.setId("4");
        UserMapper mapper = sqlSessionTemplate.getMapper(UserMapper.class);

        mapper.addUser(user);

        mapper.deleteUser(1);
        
    }
```



不使用事物时，添加成功，删除失败

配置声明式事物,

添加事物约束

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"

       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">


    <!--    spring 的数据源替换mybatis 的配置，
        使用spring 的jdbc   spring-jdbc
   -->
    <!--    DataSource-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url"
                  value="jdbc:mysql://127.0.0.1:3306/mybatis?useSSL=false&amp;useEncode=true&amp;characterEncoding=UTF-8"/>
        <property name="username" value="root"/>
        <property name="password" value="root"/>
    </bean>


    <!--    SqlSessionFactory-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <!--        绑定mybatis-config.xml 配置 -->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>

        <!--        代替mybatis 的配置-->
        <property name="mapperLocations" value="classpath:org/clxmm/mapper/*Mapper.xml"/>

    </bean>
    <!--    SqlSessionTemplate 就是 sqlSession -->
    <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
        <!--        通过构造器注入 sqlSessionFactory  ，没有set方法 -->
        <constructor-arg name="sqlSessionFactory" ref="sqlSessionFactory"/>
    </bean>


    <bean id="userMapper" class="org.clxmm.mapper.UserMapperImpl">
        <property name="sqlSessionTemplate" ref="sqlSession"/>
    </bean>

    <!--   p配置声明式事物 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <constructor-arg ref="dataSource"/>
    </bean>
    <!--    结合aop实现事物约束-->
    <!--    配置事物通知-->

    <tx:advice id="myTxAdvice" transaction-manager="transactionManager">
        <!--        给那些方法配置事物  -->
        <!--        配置事物传播特性  propagation="REQUIRED" 默认-->
        <tx:attributes>
            <tx:method name="add" propagation="REQUIRED"/>
            <tx:method name="delete"/>
            <tx:method name="update"/>
            <tx:method name="query" read-only="true"/>

            <tx:method name="*" propagation="REQUIRED"/>
        </tx:attributes>
    </tx:advice>


    <!--    配置事物切入-->
    <aop:config>
        <aop:pointcut id="txPoint" expression="execution(* org.clxmm.mapper.*.*(..))"/>
        <aop:advisor advice-ref="myTxAdvice" pointcut-ref="txPoint"/>
    </aop:config>


</beans>
```







为什么需要事物

- 不配置事物，可能数据提交不一致
- 不再spirng中配置声明式事物，要在代码中配置



