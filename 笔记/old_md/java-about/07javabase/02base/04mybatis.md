---
title: 04 MyBatis 介绍(一)
---

## 01.MyBatis 简介

[https://mybatis.org/mybatis-3/zh/index.html](https://mybatis.org/mybatis-3/zh/index.html)


**源码地址**
[https://github.com/mybatis/mybatis-3](https://github.com/mybatis/mybatis-3)


**pack search**

[https://package-search.jetbrains.com/](https://package-search.jetbrains.com/)

**maven**
```xml
<dependency>
  <scope>compile</scope>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>3.5.2</version>
</dependency>
```

### 1.2 持久化

数据持久化

- 持久化就是将程序的数据在持久状态和瞬时状态转化的过程
- 内存 **断电即失**
- 数据库（jdbc），io文件持久化

**为什么持久化？**

​	有一些对象，不能让他丢掉

### 1.3 持久层

dao service controller

- 完成持久化工作的代码块
- 层界限十分明显

### 1.4 为什么需要mybatis

- 传统的jdbc代码太复杂，简化
- 帮助程序将数据存入数据库中



## 2 入门

搭建环境-导入mybatis ---编写代码---测试

### 2.1 搭建环境

```sql
CREATE TABLE `user` (
	`id` INT(20) NOT NULL,
	`name` VARCHAR(30) DEFAULT NULL,
	`pwd` VARCHAR(30) DEFAULT NULL,
	PRIMARY KEY(`id`)
) ENGINE=INNODB ;

INSERT INTO user  ( id, name, pwd )
VALUES
	( 1, 'clx', '123' ),
	( 2, 'clx2','1234');
```



### 2.2 创建项目

创建一个空的maven项目，作为父工程，在父工程中添加依赖

```xml
    <dependencies>
        <!-- 数据卡依赖-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>

        <!--  mybatis-->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.2</version>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
            <scope>test</scope>
        </dependency>

    </dependencies>
```

### 2.3 创建第一个子模块

**mybatis核心配置**

官网(https://mybatis.org/mybatis-3/zh/getting-started.html)[https://mybatis.org/mybatis-3/zh/getting-started.html]

**1。配置xml**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<!--核心配置-->
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://127.0.0.1:3306/mybatis?useSSL=false&amp;useEncode=true&amp;characterEncoding=UTF-8"/>
                <property name="username" value="root"/>
                <property name="password" value="root"/>
            </dataSource>
        </environment>
    </environments>

</configuration>
```

从 XML 文件中构建 SqlSessionFactory 的实例非常简单，建议使用类路径下的资源文件进行配置。 但也可以使用任意的输入流（InputStream）实例，比如用文件路径字符串或 file:// URL 构造的输入流。MyBatis 包含一个名叫 Resources 的工具类，它包含一些实用方法，使得从类路径或其它位置加载资源文件更加容易。





**从 SqlSessionFactory 中获取 SqlSession**

```java
public class MyBatisUtils {
    private static SqlSessionFactory sqlSessionFactory;
    static {
        try {
            //  初始化sqlSessionFactory对象
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    //从 SqlSessionFactory 中获取 SqlSession
    public static SqlSession getSqlSession() {
        SqlSession sqlSession = sqlSessionFactory.openSession();
        return sqlSession;
    }
}
```



**mapper注册**

```
Type interface org.clxmm.dao.UserDao is not known to the MapperRegistry.
```

**maven的资源过滤**

```
The error may exist in org/clxmm/dao/UserDao
```

```
    <build>
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                </includes>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
```

**探究已映射的 SQL 语句**

dao

```java
public interface UserDao {


    List<User> getUserList();
}

```

userMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="org.clxmm.dao.UserDao">
    <select id="getUserList" resultType="org.clxmm.pojo.User">
        select * from user
    </select>
</mapper>
```

测试代码

```java
    @Test
    public void test() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        
        // 方式一 ：getMapper 推荐使用
        UserDao userDao = sqlSession.getMapper(UserDao.class);
        List<User> userList = userDao.getUserList();
        userList.forEach(System.out::println);
        
        // 方式二：
        List<User> objects = sqlSession.selectList("org.clxmm.dao.UserDao.getUserList");
        objects.forEach(System.out::println);
        
        sqlSession.close();
    }
```

两种方式的区别

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/mybatis20210707211020.png)



![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/mybatis20210707210913.png)



**作用域（Scope）和生命周期**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/20210711135100.png)

## 3 crud

### 1、namespace 

namespace中的包名要和Dao/Mapper接口包名一致

### 2、select

选择，查询语句

- id，对应namespace中的方法名
- resultType；sql语句执行的返回值
- parameterType: 参数类型



```xml
   <select id="getUserById" resultType="org.clxmm.pojo.User" parameterType="int">
        select *
        from user s
        where s.id = #{id}
    </select>
```

### 3、insert

```xml
<insert id="addUser" parameterType="org.clxmm.pojo.User">
        insert into user (id, name, pwd)
        values (#{id}, #{name}, #{pwd})
    </insert>
```

### 4、update

```xml
    <update id="upDateUser" parameterType="org.clxmm.pojo.User">
        update user s
        set s.name = #{name},
            pwd=#{pwd}
        where id = #{id}
    </update>
```

### 5、delete

```xml
    <delete id="deleteUserById" parameterType="int">
        delete
        from user
        where id = #{id}
    </delete>
```



**增删改需要提交事物**

### 6 参数为map时

```xml
    <select id="getUserById1" parameterType="map" resultType="org.clxmm.pojo.User" >
        select *
        from user s
        where s.id = #{userId}
    </select>
```



```java
    @Test
    public void test4() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        // 方式一 ：getMapper 推荐使用
        UserDao userDao = sqlSession.getMapper(UserDao.class);

        Map<String,String> map = new HashMap<>();
        map.put("userId","2");
        User userById1 = userDao.getUserById1(map);
        System.out.println(userById1);
        sqlSession.close();
    }
```



**对象参数过多，修改字段少的时候**



- map传参数，直接取出sql中的key即可

- 对象传递参数，直接用对象的属性

- 一个基本类型参数，可以直接获取

  多个参数用map或者**注解**

## 4、配置解析

### 1、核心配置

- mybatis-config.xml
- MyBatis 的配置文件包含了会深深影响 MyBatis 行为的设置和属性信息。 
- configuration（配置）
  - [properties（属性）](https://mybatis.org/mybatis-3/zh/configuration.html#properties)
  - [settings（设置）](https://mybatis.org/mybatis-3/zh/configuration.html#settings)
  - [typeAliases（类型别名）](https://mybatis.org/mybatis-3/zh/configuration.html#typeAliases)
  - [typeHandlers（类型处理器）](https://mybatis.org/mybatis-3/zh/configuration.html#typeHandlers)
  - [objectFactory（对象工厂）](https://mybatis.org/mybatis-3/zh/configuration.html#objectFactory)
  - [plugins（插件）](https://mybatis.org/mybatis-3/zh/configuration.html#plugins)
  - environments（环境配置）
    - environment（环境变量）
      - transactionManager（事务管理器）
      - dataSource（数据源）
  - [databaseIdProvider（数据库厂商标识）](https://mybatis.org/mybatis-3/zh/configuration.html#databaseIdProvider)
  - [mappers（映射器）](https://mybatis.org/mybatis-3/zh/configuration.html#mappers)

**在配置的xml中，节点的顺序不能改变，依照配置的顺序**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/20210711151216.png)

### 2、环境配置（environments）

MyBatis 可以配置成适应多种环境

**不过要记住：尽管可以配置多个环境，但每个 SqlSessionFactory 实例只能选择一种环境。**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/20210711175708.png)

**事务管理器（transactionManager）**

在 MyBatis 中有两种类型的事务管理器（也就是 type="[JDBC|MANAGED]"）：

-  JDBC – 这个配置直接使用了 JDBC 的提交和回滚设施，它依赖从数据源获得的连接来管理事务作用域。（默认的）

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/mybatis20210711175954.png)

**数据源（dataSource）**

默认的连接池： POOLED

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/mybatis20210711180200.png)

### 3、属性（properties）

这些属性可以在外部进行配置，并可以进行动态替换。你既可以在典型的 Java 属性文件中配置这些属性，也可以在 properties 元素的子元素中设置。例如：

```java
<properties resource="org/mybatis/example/config.properties">
  <property name="username" value="dev_user"/>
  <property name="password" value="F2Fa3!33TYyg"/>
</properties>
```

设置好的属性可以在整个配置文件中用来替换需要动态配置的属性值。比如:

```xml
<dataSource type="POOLED">
  <property name="driver" value="${driver}"/>
  <property name="url" value="${url}"/>
  <property name="username" value="${username}"/>
  <property name="password" value="${password}"/>
</dataSource>
```

这个例子中的 username 和 password 将会由 properties 元素中设置的相应值来替换。 driver 和 url 属性将会由 config.properties 文件中对应的值来替换。这样就为配置提供了诸多灵活选择。

**properties例子**

db.properties

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://127.0.0.1:3306/mybatis?useSSL=false&seEncode=true&amp;characterEncoding=UTF-8
#username=root
#password=root
```



**可以在配置文件中定义，或者在xml中定义配置的属性节点，两个都有优先使用外部配置文件的**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/my20210711181959.png)

### 4、类型别名（typeAliases）

类型别名可为 Java 类型设置一个缩写名字。 它仅用于 XML 配置，意在降低冗余的全限定类名书写。例如：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/myb20210711182457.png)

```xml
    <!--    类型别名 -->
    <typeAliases>
        <!--        单个配置-->
        <!--        <typeAlias type="org.clxmm.pojo.User" alias="User" />-->
        <!--        扫描包, 默认为实体类的类名小写 （建议为小写，大写也是可以的）-->
        <package name="org.clxmm.pojo"/>
    </typeAliases>
```



```xml

    <insert id="addUser" parameterType="org.clxmm.pojo.User">
        insert into user (id, name, pwd)
        values (#{id}, #{name}, #{pwd})
    </insert>
```



返回值，参数等等都可以使用

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/myb20210711183510.png)

### 5、设置（settings）

这是 MyBatis 中极为重要的调整设置，它们会改变 MyBatis 的运行时行为。 

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/myb20210711183741.png)



### 6、其他

剩余的其他

- [typeHandlers（类型处理器）](https://mybatis.org/mybatis-3/zh/configuration.html#typeHandlers)
- [objectFactory（对象工厂）](https://mybatis.org/mybatis-3/zh/configuration.html#objectFactory)
- [plugins（插件）](https://mybatis.org/mybatis-3/zh/configuration.html#plugins)
  	- mybatis-generator
  	- Mybatis-plus
  	- 通用mapper

### 7、映射器（mappers）

既然 MyBatis 的行为已经由上述元素配置完了，我们现在就要来定义 SQL 映射语句了。 但首先，我们需要告诉 MyBatis 到哪里去找到这些语句。 在自动查找资源方面，Java 并没有提供一个很好的解决方案，所以最好的办法是直接告诉 MyBatis 到哪里去找映射文件。 你可以使用相对于类路径的资源引用，或完全限定资源定位符（包括 `file:///` 形式的 URL），或类名和包名等。例如：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/myb20210711184614.png)



包扫描与完全限定类名的**注意点**

- 接口与他的mapper配置文件必须同名
- 接口与他的mapper配置文件必须在同一个包下

### 8、作用域（Scope）和生命周期

不同作用域和生命周期类别是至关重要的，因为错误的使用会导致非常严重的并发问题。

**提示** **对象生命周期和依赖注入框架**

依赖注入框架可以创建线程安全的、基于事务的 SqlSession 和映射器，并将它们直接注入到你的 bean 中，因此可以直接忽略它们的生命周期。 如果对如何通过依赖注入框架使用 MyBatis 感兴趣，可以研究一下 MyBatis-Spring 或 MyBatis-Guice 两个子项目。

**SqlSessionFactoryBuilder**

- 一旦创建了 SqlSessionFactory，就不再需要它了。 
- SqlSessionFactoryBuilder 实例的最佳作用域是方法作用域（也就是局部方法变量）

**SqlSessionFactory**

* SqlSessionFactory 一旦被创建就应该在应用的运行期间一直存在，没有任何理由丢弃它或重新创建另一个实例。 
* **SqlSessionFactory 的最佳作用域是应用作用域** （使用 SqlSessionFactory 的最佳实践是在应用运行期间不要重复创建多次，多次重建 SqlSessionFactory 被视为一种代码“坏习惯”）

* 最简单的就是使用单例模式或者静态单例模式

**SqlSession**

* 每个线程都应该有它自己的 SqlSession 实例
* **最佳的作用域是请求或方法作用域** （SqlSession 的实例不是线程安全的，因此是不能被共享的）
* 关闭操作很重要，为了确保每次都能执行关闭操作，你应该把这个关闭操作放到 finally 块中。 

```java
try (SqlSession session = sqlSessionFactory.openSession()) {
  // 你的应用逻辑代码
}
```

## 5、属性名和字段名不一致

```java
    private int id;
    private String name;
    private String password;
```



pw变为password的是

查询结果

```
User{id=2, name='clx2', password='null'}
```

* 起别名
* resultMap

### 1、resultMap

### 结果映射

```
实体类    id    name    pwd
数据库。   id.   name.   password
```

```xml
  <resultMap id="userMapper" type="User">
        <result column="id" property="id"/>
        <result column="name" property="name"/>
        <result column="pwd" property="password" />
    </resultMap>
```

```xml
    <select id="getUserById" resultMap="userMapper" parameterType="int">
        select *
        from user s
        where s.id = #{id}
    </select>
```

- `resultMap` 元素是 MyBatis 中最重要最强大的元素

- ResultMap 的设计思想是，对简单的语句做到零配置，对于复杂一点的语句，只需要描述语句之间的关系就行了。

  ![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/mybatis20210712201405.png)

  

## 6、 日志

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/myb20210712202751.png)

Mybatis 通过使用内置的日志工厂提供日志功能。内置日志工厂将会把日志工作委托给下面的实现之一： 

- SLF4J
- Apache Commons Logging
- Log4j 2
- Log4j
- JDK logging

[https://mybatis.org/mybatis-3/zh/logging.html](https://mybatis.org/mybatis-3/zh/logging.html)

### 1、STDOUT_LOGGING 标准日志输出

### 2、LOG4J

```xml
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
```



配置log4j.properties

```properties
#将等级为DEBUG的日志信息输出到console和file这两个目的地，console和file的定义在下面的代码
log4j.rootLogger=DEBUG,console,file

#控制台输出的相关设置
log4j.appender.console = org.apache.log4j.ConsoleAppender
log4j.appender.console.Target = System.out
log4j.appender.console.Threshold=DEBUG
log4j.appender.console.layout = org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern=[%c]-%m%n

#文件输出的相关设置
log4j.appender.file = org.apache.log4j.RollingFileAppender
log4j.appender.file.File=./log/log.log
log4j.appender.file.MaxFileSize=10mb
log4j.appender.file.Threshold=DEBUG
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.ConversionPattern=[%p][%d{yy-MM-dd}][%c]%m%n

#日志输出级别
log4j.logger.org.mybatis=DEBUG
log4j.logger.java.sql=DEBUG
log4j.logger.java.sql.Statement=DEBUG
log4j.logger.java.sql.ResultSet=DEBUG
log4j.logger.java.sql.PreparedStatement=DEBUG
```

Mybatis-config.xml

```xml
    <settings>
<!--        标准的日志工厂实现-->
<!--        <setting name="logImpl" value="STDOUT_LOGGING"/>-->
        <setting name="logImpl" value="LOG4J"/>
    </settings>
```



### 7、分页 Limit



### 1、limit

```sql
SELECT * FROM `user` LIMIT 0,2
```



```java
    List<User> getUserByLimit(Map<String,Integer> map);
```

xml

```sql
    <select id="getUserByLimit" resultType="User" parameterType="map">

        SELECT *
        FROM `user` LIMIT #{start},#{end}
    </select>
```

### 2、分页插件（pagehelp）

[https://pagehelper.github.io/docs/](https://pagehelper.github.io/docs/)

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>最新版本</version>
</dependency>
```

## 7、使用注解开发

### 1、面向接口编程

### 2、使用注解

注解2主要用反射使用

```java
   @Select("select * from user")
    List<User> getUsers();
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/myb20210713203633.png)

mapper

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/myb20210713203746.png)

### 8 mybatis 的流程

```java
 InputStream inputStream = Resources.getResourceAsStream(resource);
```

1. Resources 获取加载配置文件

```java
  sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

2. 实例化SqlSessionFactoryBuilder

   <img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/myb20210713205224.png" style="zoom:50%;" />

3. 解析文件流XMLConfigBuilder

4. Configuration 所有的配置信息

5. SqlSessionFactory实例化

6. 创建transactional   事物管理

7. 创建executor  执行器

   ![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/20210713210424.png)

8. 创建sqlsession

9. 操作sql。    是否成功和提交事物

10. 关闭

### 3 @Param



