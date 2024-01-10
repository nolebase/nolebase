---
title: 01mybatis
---

##  1基于Mapper动态代理的开发方式

使用 Mapper 动态代理的方式开发，需要满足以下几个规范：

- mapper.xml 中的 namespace 与 Mapper 接口的全限定名完全相同
- mapper.xml 中定义的 statement ，其 id 与 Mapper 接口的方法名一致
- Mapper 接口方法的方法参数类型，与 mapper.xml 中定义的 statement 的 parameterType 类型一致
- Mapper 接口方法的返回值类型，与 mapper.xml 中定义的 statement 的 resultType 类型相同

## 2.配置-全局配置文件



- properties（属性）
- settings（设置）
- typeAliases（类型别名）
- typeHandlers（类型处理器）
- objectFactory（对象工厂）
- plugins（插件）
- environments（环境配置）
  - environment（环境变量）
    - transactionManager（事务管理器）
    - dataSource（数据源）
- databaseIdProvider（数据库厂商标识）
- mappers（映射器）

### 1. properties-属性

properties 属性，它的作用是**定义全局配置变量**，并且它可以**加载外部化的 properties 配置文件**。下面我们来简单演示一下 properties 的使用。

在 xml 中编写 `<properties>` 时，下面就会发现只有一个 `<property>` 标签，而且是标准的 key-value 格式：

```xml
<properties>
        <property name="" value=""/>
    </properties>
```

所以我们可以来试着提取一下下面数据源的几个配置：

```xml
  <properties>
    <property name="jdbc.driverClassName" value="com.mysql.cj.jdbc.Driver"/>
    <property name="jdbc.url" 
              value="jdbc:mysql://localhost:3306/mybatis?characterEncoding=utf-8&amp;useSSL=false"/>
    <property name="jdbc.username" value="root"/>
    <property name="jdbc.password" value="root"/>
  </properties>
  
    <settings>
    <setting name="logImpl" value="LOG4J"/>
  </settings>


  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">
        <property name="driver" value="${jdbc.driverClassName}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
      </dataSource>
    </environment>
  </environments>
  <mappers>
```

### 2.加载外部化配置文件

如果仅仅是为了在上面定义 property 的话，那这未免显得有那么一点点鸡肋，我们也没必要把它单独拎出来讲。`<properties>` 标签是可以直接声明 resource 或者 url 来加载外部化配置文件的。下面我们也简单演示一下。

先把 properties 文件编写出来：

```sql
jdbc.driverClassName=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/mybatis?characterEncoding=utf-8
jdbc.username=root
jdbc.password=123456
```

然后，使用 `<properties>` 标签把这个 properties 文件加载进来即可：

```xml
    <properties resource="jdbc.properties" />

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driverClassName}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>
```

### 3.配置优先级

所以总结下来，配置属性的方式有 3 种：

- 直接在 `<properties>` 中定义配置属性
- 借助 `<properties>` 的 resource / url 属性加载外部化配置文件
- 编程式加载外部化配置文件

所以这三种方式定义的配置属性，谁的优先级更高呢？按照官方文档的说法，MyBatis 会按照上面所述的顺序读取配置属性，而下面的属性会覆盖上面的，所以优先级的顺序就刚好与上面列举的顺序相反：

- 编程式加载的外部化配置文件
- 借助 `<properties>` 的 resource / url 属性加载的外部化配置文件
- 在 `<properties>` 中定义的配置属性



## 3. setting-配置

setting 配置，这里面提供了 MyBatis 中可供调整的所有内部配置项的全局设置。全部的配置项，我们都可以参照[官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fmybatis.org%2Fmybatis-3%2Fzh%2Fconfiguration.html%23settings)来配置，这里我们列出几个相对重要的配置项看一看，先混个脸熟：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220319210929mybatis.png)

## 4. typeAliases-类型别名

typeAliases 类型别名的设置，是考虑到 mapper.xml 中我们每次写实体类的时候，都要写它们的全限定类名，太麻烦，于是 MyBatis 提供了类型别名的机制。这部分应当属于学习 MyBatis 就应该一并学习了的知识，所以这里我们快速过一下就 OK 了。

```xml
    <typeAliases>
        <!-- 逐个声明 -->
        <typeAlias alias="Department" type="com.linkedbear.mybatis.entity.Department"/>
        
        <!-- 包扫描
             以此法被扫描的实体类，别名为类名的首字母小写形式(类似于Bean -> bean)
        -->
        <package name="com.linkedbear.mybatis.entity"/>
    </typeAliases>
```

> 另外，不要忘记一点，MyBatis 的别名是不区分大小写的。

## 5. typeHandlers-类型处理器

typeHandlers 类型处理器，它的意义是针对一个特定的 Java 类型，或者 jdbc 类型，采用特定的处理器来处理这个类型的字段。听起来这个概念很陌生，但实际上 MyBatis 本身内部就已经预置了好多好多类型处理器了，举几个例子吧：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220319211120mybatis.png)

可见，Java 类型和 jdbc 类型之间，用什么类型进行转换，都是这些 typeHandler 干的活。

一般情况下，我们只需要使用 MyBatis 内置的这些 typeHandler 就完全够用，如果实在是满足不了需求，也没关系，我们可以针对某些特定的类型，自定义 typeHandler 来处理。下面我们简单介绍下如何自定义 typeHandler 。

### 1 定义DepartmentTypeHandler

我们自己定义的 `TypeHandler` ，都需要实现 `TypeHandler` 接口，并声明其泛型，泛型就是要处理的目标类型。

`TypeHandler` 接口中定义了 4 个方法，大面上分两类：**当 mapper.xml 中定义的 statement 中出现指定泛型类型的参数时，如何对 `PreparedStatement` 操作**；**查询动作封装结果集时，对于实体类中出现的指定泛型类型的属性时，应该如何从 ResultSet 中取到数据，并转换为指定类型**。所以按照这个思路，我们在实现这些方法时，思路就比较简单了：

```java
public class DepartmentTypeHandler implements TypeHandler<Department> {
    
    @Override
    public void setParameter(PreparedStatement ps, int i, Department department, JdbcType jdbcType) 
      throws SQLException {
        ps.setString(i, department.getId());
    }
    
    @Override
    public Department getResult(ResultSet rs, String columnName) throws SQLException {
        Department department = new Department();
        department.setId(rs.getString(columnName));
        return department;
    }
    
    @Override
    public Department getResult(ResultSet rs, int columnIndex) throws SQLException {
        Department department = new Department();
        department.setId(rs.getString(columnIndex));
        return department;
    }
    
    @Override
    public Department getResult(CallableStatement cs, int columnIndex) throws SQLException {
        Department department = new Department();
        department.setId(cs.getString(columnIndex));
        return department;
    }
}
```

### 2 注册、使用DepartmentTypeHandler

```xml
  <!-- 注册 TypeHandler -->
  <typeHandlers>
    <typeHandler handler="org.clxmm.handler.DepartmentTypeHandler"
                 javaType="org.clxmm.entity.Department" jdbcType="VARCHAR"/>
  </typeHandlers>
```

只注册好还不够，如果此时直接在 mapper.xml 中声明 statement ：

```xml
<select id="findAllUseTypeHandler" resultType="org.clxmm.entity.User">
    select * from tbl_user
  </select>
```

调用查询时，`department` 属性只会为 null ：

```
User{id='09ec5fcea620c168936deee53a9cdcfb', name='阿熊', department=null}
User{id='5d0eebc4f370f3bd959a4f7bc2456d89', name='老狗', department=null}
```

出现这个情况，是因为 **MyBatis 只知道查询回来一个 `department_id` ，并不知道它要跟 `department` 属性挂钩**。所以我们需要手动声明一个新的 resultMap ，来告诉 MyBatis ，这个 `department` 属性的类型是 `Department` ，可以使用刚刚定义的 `DepartmentTypeHandler` ：

```xml
  <resultMap id="userHandlerMap" type="org.clxmm.entity.User">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="age" column="age"/>
    <result property="birthday" column="birthday"/>
    <association property="department" javaType="org.clxmm.entity.Department"/>
  </resultMap>


<!--  <select id="findAllUseTypeHandler" resultType="org.clxmm.entity.User">-->
  <select id="findAllUseTypeHandler" resultMap="userHandlerMap">
    select * from tbl_user
  </select>
```

以此法编写完成后，接下来我们编写测试代码，从数据库中查出所有的 `User` ：

```java
  public static void main(String[] args) throws Exception {
    System.out.println(111);

    InputStream xml = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(xml);
    SqlSession sqlSession = sqlSessionFactory.openSession();

    // 获取Mapper接口的代理
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
    userMapper.findAllUseTypeHandler().forEach(System.out::println);
  }
```

```
User(id=09ec5fcea620c168936deee53a9cdcfb, name=阿熊, age=18, birthday=Fri Aug 08 18:00:00 CST 2003, 
department=Department(id=09ec5fcea620c168936deee53a9cdcfb, name=null, tel=null))
User(id=5d0eebc4f370f3bd959a4f7bc2456d89, name=老狗, age=30, birthday=Wed Feb 20 23:27:20 CST 1991, 
department=Department(id=5d0eebc4f370f3bd959a4f7bc2456d89, name=null, tel=null))

```

### 3约定大于配置

上面的问题其实可以不用声明 `resultMap` 也能解决，如果 `User` 类中能有一个 `department_id` 的属性，那 MyBatis 就可以识别了，我们自己定义的 `DepartmentTypeHandler` 也还是可以派上用场的。

```
public class User {
    // ......
    private Department department;
    private Department department_id;
    // ......
}
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220319213037mybatis.png)

### 4.保存动作的使用

之前我们在写插入的时候，SQL 中不能直接放对象，得取对象的属性 ( `#{department.id}` ) ，但有了 `TypeHandler` 之后，我们就可以直接把整个 `Department` 对象传进去了：

```xml
  <insert id="saveUser" parameterType="org.clxmm.entity.User">
    insert into tbl_user (id, name, department_id) VALUES (#{id}, #{name}, #{department})
  </insert>
```

看，像这样直接传入整个 `Departmet` 对象，我们自己定义的 `DepartmentTypeHandler` 就会帮我们把其中的 id 取出来，设置进 `PreparedStatement` 中了。

```java
public static void main(String[] args) throws Exception {
  System.out.println(111);

  InputStream xml = Resources.getResourceAsStream("mybatis-config.xml");
  SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(xml);
  SqlSession sqlSession = sqlSessionFactory.openSession();

  // 获取Mapper接口的代理
  UserMapper userMapper = sqlSession.getMapper(UserMapper.class);

  User user = new User();
  user.setId(UUID.randomUUID().toString().replaceAll("-", ""));
  user.setName("hahahaha");
  Department department = new Department();
  department.setId("18ec781fbefd727923b0d35740b177ab");
  user.setDepartment(department);
  userMapper.saveUser(user);


  // commit才能使数据库操作生效
  sqlSession.commit();
 sqlSession.close();
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220319213752mybatis.png)

## 6.objectFactory-对象工厂

objectFactory 对象工厂，要聊这个东西，我们要先了解一下，我们每次查询出来的对象数据都是如何封装出来的。

每次查询动作中，数据库返回 `ResultSet` 时，MyBatis 会根据 statemet 的定义，创建对应的结果对象（跟表对应的实体类对象）。而创建结果对象的工厂，是一个叫 `ObjectFactory` 的家伙负责的。默认情况下，MyBatis 内置了一个 **`DefaultObjectFactory`** 来实现结果对象的创建，而我们定义的结果对象通常都有默认的无参构造器，或者有显式定义无参构造器，这样也是方便 `DefaultObjectFactory` 帮我们创建结果对象。

既然 MyBatis 的全局配置文件中提供了 objectFactory 标签，就说明 MyBatis 允许我们自定义 `ObjectFactory` 以代替默认的 `DefaultObjectFactory` 。下面我们也来试试水，自定义一个。

先说下需求，我们要实现的功能是这样的：**每次创建的 User 对象，如果数据库中的 age 属性为空，则初始化值为 0** 。

### 1 定义ExtendsObjectFactory

自定义的 objectFactory ，类型必须是 `org.apache.ibatis.reflection.factory.ObjectFactory` ，不过我们肯定不会这么干，MyBatis 已经帮我们实现好基础的创建对象的逻辑了，我们只需要在此基础上扩展即可，所以我们都是继承默认的 `DefaultObjectFactory` 即可。

```java
public class ExtendsObjectFactory extends DefaultObjectFactory {

  @Override
  public <T> T create(Class<T> type) {
    T t = super.create(type);
    // 判断是否为User类型，如果是，则预初始化值
    if (User.class.equals(type)) {
      User user = (User) t;
      user.setAge(0);
    }
    return t;
  }


}
```

逻辑还是很容易编写的吧！编写完成后记得注册进 MyBatis 的全局配置文件中：

```xml
<objectFactory type="org.clxmm.factory.ExtendsObjectFactory"/>
```

## 6. plugins-插件

plugins 插件，这是我们比较熟悉的节点了。我们都知道，MyBatis 的插件实际上就是**拦截器**，它可以拦截 MyBatis 的执行流程，并在特定的位置上提供扩展。可供扩展的位置有 4 个

- Executor (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed)
- ParameterHandler (getParameterObject, setParameters)
- ResultSetHandler (handleResultSets, handleOutputParameters)
- StatementHandler (prepare, parameterize, batch, update, query)

如果小伙伴有过 MyBatis 的使用经验，应该知道一个比较有名的分页插件 PageHelper ，它就是基于 MyBatis 的插件机制来实现的。

## 7. environments-环境

environments 环境，它类似于 SpringFramework 中的 profiles 的概念，它允许我们定义多个环境，以分别定义不同的数据库连接配置。这种场景在我们平时开发中是很常见的：开发、测试、生产分别要用到 3 种不同的环境，连接 3 个不同的数据库，这个时候就需要分别配置了。

不过，尽管我们可以定义多个环境配置，但激活生效的只允许选择一个，激活的方式是在 `<environments>` 标签上声明 `default` 属性。

## 8. databaseIdProvider-数据库厂商标识

databaseIdProvider 数据库厂商标识，它为我们提供了数据库可移植性的支持。了解 Hibernate 的小伙伴应该知道，Hibernate 的数据库可移植性是天然的，MyBatis 虽然不像 Hibernate 那样全自动，但它也提供了支持的方案：我们在编写 mapper.xml 时，针对不同的 statement ，声明不同的数据库厂商标识，MyBatis 即会动态的根据数据库厂商标识，使用不同的 statement ，从而达到不同的数据库发送不同 SQL 的效果。

下面我们来实际演示一下 databaseIdProvider 的使用。

### 1 初始化一个新的数据库环境

为了区分出不同的数据库环境，我们要在现有的数据库环境之外，再初始化一个新的数据库，而且还不能是相同的数据库厂商，小伙伴们可以任意选择 Oracle 、SQLServer 、DB2 、PostgreSQL 等数据库，小册选择使用 PostgreSQL 作为第二数据库。

数据表的话，我们只初始化一个 users 表，对标 tbl_user 表即可：

```sql
CREATE TABLE users (
    id varchar(32) NOT NULL,
    name varchar(32) NOT NULL,
    age int4,
    department_id varchar(32) NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

INSERT INTO users(id, name, age, department_id) VALUES ('09ec5fcea620c168936deee53a9cdcfb', '阿熊', 
                                                        18, '18ec781fbefd727923b0d35740b177ab');
INSERT INTO users(id, name, age, department_id) VALUES ('5d0eebc4f370f3bd959a4f7bc2456d89', '老狗', 
                                                        30, 'ee0e342201004c1721e69a99ac0dc0df');
```

### 2 配置databaseIdProvider

```xml
 <databaseIdProvider type="DB_VENDOR"> <!-- DB_VENDOR是固定的 -->
        <property name="MySQL" value="mysql"/>
        <property name="Oracle" value="oracle"/>
        <property name="PostgreSQL" value="postgresql"/>
    </databaseIdProvider>
```

这里面针对每个数据库厂商的名称，定义好对应的别名即可，这个别名在下面的 `mapper.xml` 中就会用到。

### 3 修改mapper.xml

`mapper.xml` 中，我们要分别定义两个 statement ，它们的 id 相同，SQL 不同，对应的 `databaseId` 不同：

```xml
    <select id="findAllByDepartmentId" parameterType="string" 
            resultType="com.linkedbear.mybatis.entity.User" databaseId="mysql">
        select * from tbl_user where department_id = #{departmentId}
    </select>

    <select id="findAllByDepartmentId" parameterType="string" 
            resultType="com.linkedbear.mybatis.entity.User" databaseId="postgresql">
        <!-- 注意这里查的表不一样 -->
        select * from users where department_id = #{departmentId}
    </select>
```

## 9. mappers-映射器

```xml
  <mappers>

    <mapper resource="mapper/department3.xml"/>
    <mapper resource="mapper/user.xml"/>

  </mappers>
```

