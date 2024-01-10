---
title: 03mapper映射文件
---

## 映射-mapper映射文件详解

## 1. select - DQL

select 可能是我们最最常用的 mapper 元素（没有之一）了，增删改查中，查询可能是最复杂的，也是我们操心比较多的操作。MyBatis 中对于 select 标签下了比较多的功夫

### 1.1 标签的属性含义

| 属性          |                                                     |                                                              |
| ------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| id            | 一个 namespace 下的 statement 的唯一标识            | 不同的 namespace 下可以定义相同的 id                         |
| parameterType | 执行 statement 传入的参数的类型                     | 该属性可以不填，MyBatis 会根据 TypeHandler 自动推断传入的参数类型 |
| resultType    | 从执行的 SQL 查询结果集的封装实体类型全限定名或别名 | 如果返回的是集合，那应该设置为集合包含的类型，而不是集合本身的类型；resultType 和 resultMap 之间只能同时使用一个 |
| resultMap     | mapper.xml 中定义的任意 resultMap 的 id 引用        | 如果引用的 resultMap 是在其他 mapper.xml 中，则引用的 id 为 [命名空间 + '.' + id] ；resultType 和 resultMap 之间只能同时使用一个 |
| useCache      | 查询结果是否保存至二级缓存                          | 默认 true                                                    |
| flushCache    | 执行 SQL 后会清空一级缓存（本地缓存）和二级缓存     | 默认 false ；所有 namespace 的一级缓存和当前 namespace 的二级缓存均会清除【1.2】 |
| timeout       | SQL 请求的最大等待时间（单位: 秒）                  | 默认无限制，推荐定义全局最大等待时间（ settings → defaultStatementTimeout ） |
| fetchSize     | 底层数据库驱动一次查询返回的结果行数                | 无默认值（依赖不同的数据库驱动），该配置与 MyBatis 无关，仅与底层数据库驱动有关【1.3】 |
| statementType | 底层使用的 Statement 的类型                         | 可选值：STATEMENT , PREPARED , CALLABLE ，默认 PREPARED ，底层使用 `PreparedStatement` |
| resultSetType | 控制 jdbc 中 ResultSet 对象的行为                   | 可选值：FORWARD_ONLY , SCROLL_SENSITIVE , SCROLL_INSENSITIVE , DEFAULT【1.4】 |
| databaseId    | 用于部分不同数据库厂商下使用的 SQL                  | 会加载所有不带 databaseId 的，以及匹配激活的数据源对应的数据库厂商的 databaseId 的 statement |

### 1.2 flushCache

有关 `flushCache` 到底是清除哪些缓存，如果小册前面不特意说明是所有 namespace 的话，可能会有小伙伴认为，一个 namespace 下的 `flushCache` 只会清除当前 namespace 下的一级缓存与二级缓存，但这个想法是错误的。下面我们可以来测试一下效果。

为了测试方便，我们在 `user.xml` 中再定义一个 select ，将其 `flushCache` 声明为 `true` （当然使用任意 insert 、update 、delete 也都是可以的，它们的 `flushCache` 本身就是 true ）：

```xml
<select id="cleanCache" resultType="int" flushCache="true">
        select count(id) from tbl_user
    </select>
```

> 把这个 `cleanCache` 定义在 `user.xml` 中的目的，是为了确定清除 user 的二级缓存后，department 的二级缓存是否会被一起清除。

```java
public class SelectUseCacheApplication {

  public static void main(String[] args) throws Exception {
    InputStream xml = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(xml);

    SqlSession sqlSession = sqlSessionFactory.openSession();
    // 连续查询两次同一个Department
    DepartmentMapper departmentMapper = sqlSession.getMapper(DepartmentMapper.class);
    Department department = departmentMapper.findById("18ec781fbefd727923b0d35740b177ab");
    System.out.println(department);
    Department department2 = departmentMapper.findById("18ec781fbefd727923b0d35740b177ab");
    System.out.println("department == department2 : " + (department == department2));
    // 关闭第一个SqlSession使二级缓存保存
    sqlSession.close();

    SqlSession sqlSession2 = sqlSessionFactory.openSession();
    DepartmentMapper departmentMapper2 = sqlSession2.getMapper(DepartmentMapper.class);
    // 再次查询Department
    Department department3 = departmentMapper2.findById("18ec781fbefd727923b0d35740b177ab");
    departmentMapper2.findAll();

    UserMapper userMapper = sqlSession2.getMapper(UserMapper.class);
    // 触发缓存清除
    userMapper.cleanCache();
    System.out.println("==================cleanCache====================");

    // 再再次查询Department
    Department department4 = departmentMapper2.findById("18ec781fbefd727923b0d35740b177ab");
    System.out.println("department3 == department4 : " + (department3 == department4));

    sqlSession2.close();

    /**
     *  1) 首先我们先开一个 SqlSession ，查询 id 为 18ec781fbefd727923b0d35740b177ab 的 Department ，
     * 然后关闭 SqlSession 使一级缓存持久化到二级缓存；
     * 2) 然后再开一个新的 SqlSession ，再次查询同样的 Department ，观察二级缓存是否生效；
     * 3) 接着触发缓存清除，再查询一个相同的 Department ，观察二级缓存是否被清除。
     */
  }
}
```

```
2022-03-20 19:40:30,652 514    [           main] DEBUG source.pooled.PooledDataSource  - Created connection 1159114532. 
2022-03-20 19:40:30,653 515    [           main] DEBUG ansaction.jdbc.JdbcTransaction  - Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@4516af24] 
2022-03-20 19:40:30,664 526    [           main] DEBUG pper.DepartmentMapper.findById  - ==>  Preparing: select * from tbl_department where id = ?  
2022-03-20 19:40:30,705 567    [           main] DEBUG pper.DepartmentMapper.findById  - ==> Parameters: 18ec781fbefd727923b0d35740b177ab(String) 
2022-03-20 19:40:30,764 626    [           main] DEBUG pper.DepartmentMapper.findById  - <==      Total: 1 
// --------------------第一次执行完departmentMapper.findById-------------------------
Department(id=18ec781fbefd727923b0d35740b177ab, name=null, tel=null)

// --------------------第二次执行完departmentMapper.findById-------------------------
department == department2 : true
2022-03-20 19:40:30,765 627    [           main] DEBUG ansaction.jdbc.JdbcTransaction  - Resetting autocommit to true on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@4516af24] 
2022-03-20 19:40:30,770 632    [           main] DEBUG ansaction.jdbc.JdbcTransaction  - Closing JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@4516af24] 
2022-03-20 19:40:30,770 632    [           main] DEBUG source.pooled.PooledDataSource  - Returned connection 1159114532 to pool. 
2022-03-20 19:40:30,771 633    [           main] DEBUG ansaction.jdbc.JdbcTransaction  - Opening JDBC Connection 
2022-03-20 19:40:30,771 633    [           main] DEBUG source.pooled.PooledDataSource  - Checked out connection 1159114532 from pool. 
2022-03-20 19:40:30,771 633    [           main] DEBUG ansaction.jdbc.JdbcTransaction  - Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@4516af24] 
2022-03-20 19:40:30,775 637    [           main] DEBUG pper.DepartmentMapper.findById  - ==>  Preparing: select * from tbl_department where id = ?  
2022-03-20 19:40:30,775 637    [           main] DEBUG pper.DepartmentMapper.findById  - ==> Parameters: 18ec781fbefd727923b0d35740b177ab(String) 
2022-03-20 19:40:30,781 643    [           main] DEBUG pper.DepartmentMapper.findById  - <==      Total: 1 
2022-03-20 19:40:30,782 644    [           main] DEBUG apper.DepartmentMapper.findAll  - ==>  Preparing: select * from tbl_department  
2022-03-20 19:40:30,782 644    [           main] DEBUG apper.DepartmentMapper.findAll  - ==> Parameters:  
2022-03-20 19:40:30,787 649    [           main] DEBUG apper.DepartmentMapper.findAll  - <==      Total: 4 
2022-03-20 19:40:30,789 651    [           main] DEBUG m.mapper.UserMapper.cleanCache  - ==>  Preparing: select count(id) from tbl_user  
2022-03-20 19:40:30,790 652    [           main] DEBUG m.mapper.UserMapper.cleanCache  - ==> Parameters:  
2022-03-20 19:40:30,804 666    [           main] DEBUG m.mapper.UserMapper.cleanCache  - <==      Total: 1 
==================cleanCache====================
2022-03-20 19:40:30,804 666    [           main] DEBUG pper.DepartmentMapper.findById  - ==>  Preparing: select * from tbl_department where id = ?  
2022-03-20 19:40:30,805 667    [           main] DEBUG pper.DepartmentMapper.findById  - ==> Parameters: 18ec781fbefd727923b0d35740b177ab(String) 
2022-03-20 19:40:30,809 671    [           main] DEBUG pper.DepartmentMapper.findById  - <==      Total: 1 
department3 == department4 : false
2022-03-20 19:40:30,809 671    [           main] DEBUG ansaction.jdbc.JdbcTransaction  - Resetting autocommit to true on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@4516af24] 
2022-03-20 19:40:30,811 673    [           main] DEBUG ansaction.jdbc.JdbcTransaction  - Closing JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@4516af24] 
2022-03-20 19:40:30,811 673    [           main] DEBUG source.pooled.PooledDataSource  - Returned connection 1159114532 to pool. 
```

- 可以看出来，当第一次执行完 `findById` 后，一级缓存中已经存在数据了，所以第二次执行时没有打印 SQL 。之后 `SqlSession` 关闭，一级缓存持久化到二级缓存。
- 再次开启一个新的 `SqlSession` 时，可以发现再次调用 `findById` 时依然没有 SQL 发送，说明二级缓存已经生效；然后调用 `findAll` 方法，让全部的 `Department` 查询加载到一级缓存；
- 接下来执行 `UserMapper` 的 `cleanCache` ，清除掉二级缓存后，再次调用 `findById` 方法，日志中依然没有打印 SQL 发送，说明 `UserMapper` 清除的二级缓存不会影响到 `DepartmentMapper` ；但与此同时，`findAll` 方法重新打印了 SQL ，说明一级缓存被全部清除了！

**`flushCache` 会清除全局一级缓存，以及本 namespace 下的二级缓存**。

### 1.3 fetchSize

这个配置本来不是 MyBatis 的，是 jdbc 的。要说这个，我们需要先了解一下 jdbc 的一些原生操作。

### 1.3.1 fetchSize本身存在于jdbc

```java
public class JdbcFetchSizeApplication {
    
    public static void main(String[] args) throws Exception {
        Class.forName("com.mysql.jdbc.Driver");
        Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/mybatis", 
                                                            "root", "123456");
        PreparedStatement ps = connection.prepareStatement("select * from tbl_department");
        // 在PreparedStatement上设置一次性抓取的结果行数
        ps.setFetchSize(2);
        ResultSet resultSet = ps.executeQuery();
        while (resultSet.next()) {
            System.out.println(resultSet.getString("name"));
        }
        resultSet.close();
        ps.close();
        connection.close();
    }
}
```

如上述代码中所呈现的，`fetchSize` 本来是 `Statement` 的一个属性配置，可以在执行 `executeQuery` 方法之前设置。

### 1.3.2 fetchSize的设计之初

由于 MySQL 本身不支持 `fetchSize` 的设置，所以我们可以参考 **Oracle** 或者 **PostgreSQL** 。默认情况下，数据库驱动在发送 DQL 查询时，会一次性拉取整个查询结果到内存中（即 `executeQuery` ），当一次查询的数据量过大时，内存放不下那么多数据，就有可能造成 OOM 现象。这个时候， `fetchSize` 的作用就得以体现：**数据库驱动查询到数据后，每次只从数据库拉取 `fetchSize` 指定量的数据，当这批数据都 next 完成后，再继续拉取下一批数据，以此来避免 OOM 现象的发生**。

### 1.3.3 fetchSize的适用条件和场景

- 数据库环境支持（ Oracle 可以，高版本的 PostgreSQL (7.4+) 也可以，但 MySQL 不行）
- 执行 DQL 时，`Connection` 的 `autoCommit` 必须为 false （即开启事务）
- 查询结果的 `ResultSet` ，类型必须为 `TYPE_FORWARD_ONLY` （无法向相反的迭代方向滚动）（下面马上会提到）
- 只有一次发送一条 DQL 时才有用，如果用分号隔开一次性发送多条 DQL ，也不好使（ 如 `select * from tbl_department; select * from tbl_user;`）

### 1.4 resultSetType

`resultSetType` ，这个属性也不是 MyBatis 的，刚才在上面提到了 `ResultSet` 的类型，在 MyBatis 中就是利用这个属性来配置，不过我们一般根本不会用到它，只是作一下了解即可。

不过说到它，我们又得提一下 jdbc 的规范了

### 1.4.1 默认情况下的结果集读取缺陷

根据 jdbc 的规范，`Connection` 对象在创建 `Statement` 时，可以指定 `ResultSet` 的类型参数，来控制查询动作执行的返回 `ResultSet` 类型。从 API 的角度来看，`prepareStatement` 方法有重载的可以传入 `resultSetType` 的方法：

可传入的值，在 `ResultSet` 接口中有定义：

```
    // 一般默认的类型，仅支持结果集向下迭代
    int TYPE_FORWARD_ONLY = 1003;
    // 可支持任何方向的滚动取得记录，对其他连接的修改不敏感
    int TYPE_SCROLL_INSENSITIVE = 1004;
    // 可支持任何方向的滚动取得记录，对其他连接的修改敏感
    int TYPE_SCROLL_SENSITIVE = 1005;
```





我们在执行 DQL ，获得 `ResultSet` 后，封装结果集也好，直接遍历结果集处理数据也好，我们都是这么写的：

```java
  ResultSet resultSet = ps.executeQuery();
    // 遍历游标向下迭代
    while (resultSet.next()) {
        System.out.println(resultSet.getString("name"));
    }
```

每次获取一行新的数据，都是**执行 `ResultSet` 的 `next` 方法，从上往下迭代**，迭代完成后，这个 `ResultSet` 的使命就结束了。如果有特殊的需求，需要再倒回去走一遍呢？

```java
  // 遍历游标向下迭代
    while (resultSet.next()) {
        System.out.println(resultSet.getString("name"));
    }

    // 遍历游标向上迭代
    while (resultSet.previous()) {
        System.out.println("倒序 --- " + resultSet.getString("name"));
    }
```

对不起，不好使，默认情况下 `ResultSet` 只能从上往下走。怎么解决这个问题呢？就是改变 `ResultSet` 的类型，也就是上面提到的那 3 个常量。

### 1.4.2 jdbc中的resultSetType

刚上面说过了，在 `prepareStatement` 时，可以指定返回的 `ResultSet` 的类型，这里我们指定它的类型为 `TYPE_SCROLL_INSENSITIVE` ，也即允许滚动获取：

```java
 PreparedStatement ps = connection.prepareStatement("select * from tbl_department",
            ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
```

与 `TYPE_SCROLL_INSENSITIVE` 相似的还有 `TYPE_SCROLL_SENSITIVE` ，它们的区别在于，如果在读取结果集时，数据库内的数据发生了改变，`ResultSet` 内的数据是否也跟着变。

### 1.4.3 MyBatis中配置resultSetType

在 MyBatis 中，默认情况下是不会主动设置 `resultSetType` 的，完全由数据库驱动决定；当然也可以指定，它指定的值有 3 种，分别与 jdbc 中的一一对应：

- `FORWARD_ONLY` → `TYPE_FORWARD_ONLY`
- `SCROLL_INSENSITIVE` → `TYPE_SCROLL_INSENSITIVE`
- `SCROLL_SENSITIVE` → `TYPE_SCROLL_SENSITIVE`

### 1.5 select标签的SQL编写

需要参数的地方用 `#{}` 设置好，遇到复杂的场景就使用动态 SQL 组合拼装。

## 2. insert, update 和 delete - DML

### 2.1 标签的属性含义

| **属性**         |                                                              |                                                              |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| flushCache       | 执行 SQL 后会清空一级缓存（本地缓存）和二级缓存              | 默认值 true                                                  |
| useGeneratedKeys | 开启使用，则 MyBatis 会使用 jdbc 底层的 getGeneratedKeys 方法，取出自增主键的值 | 仅适用于 insert 和 update ，默认值 false                     |
| keyProperty      | 配合 useGeneratedKeys 使用，需要指定传入参数对象的属性名，MyBatis 会使用 getGeneratedKeys 的返回值，或 insert 语句中的 selectKey 子元素，填充至指定属性中 | 仅适用于 insert 和 update ，无默认值                         |
| keyColumn        | 设置 useGeneratedKeys 生效的值对应到数据库表中的列名，在某些数据库（像 PostgreSQL）中，当主键列不是数据库表的第一列时，需要显式配置该属性 | 仅适用于 insert 和 update ，如果主键列不止一个，可以用逗号分隔多个属性名 |

### 2.2 useGeneratedKeys

这个说白了，就是在插入数据时，用数据库表的自增 id 作为主键。如果这个属性设置为 true ，则主键可以不用传，MyBatis 会在底层使用 jdbc 的 `getGeneratedKeys` 方法帮我们查出 id ，然后放入 id 属性中，并回填进实体类。这个属性可以跟 `keyProperty` 和 `keyColumn` 配合使用，

`useGeneratedKeys` 和 `keyProperty` 属性可以让我们在 insert 操作执行完成后，自动回填 id （当然前提是 id 自增）。



## 3. resultMap - 结果集映射

`<resultMap>` 负责结果集映射，MyBatis 将其称为最重要、最强大的标签元素，可见重视程度之高。

### 3.1 使用pojo的构造方法

一般情况来讲，对于一个 pojo 来讲，它是不允许有任何显式定义的构造方法的，换句话说，它只能有本身的默认无参构造方法。当然，少数情况下，我们在配置 resultMap 的时候，还是会遇到一些特殊的场景，需要返回一些 VO 而非实体模型类，这个时候就需要 MyBatis 去调用它的有参构造方法了。MyBatis 对它的支持也是逐渐变好，在当下主流的 MyBatis 3.5 版本中，已经可以很好地处理有参构造方法的结果集映射了。下面我们来简单演示一下。

### 3.1.1 简单使用

我们直接拿现有的 `Department` 来做演示吧，我们分别显式的声明一个无参的构造方法，以及带 id 的有参构造方法：

```java
public class Department implements Serializable {
    private String id;
    private String name;
    private String tel;
    
    public Department() {
    }
    
    public Department(String id) {
        this.id = id;
    }
```

接下来，我们定义一个新的 resultMap ，并使用构造方法的 `<constructor>` 标签：

```xml

  <resultMap id="departmentWithConstructor" type="Department">
    <constructor>
      <idArg column="id" javaType="String"/>
    </constructor>
    <result property="name" column="name"/>
    <result property="tel" column="tel"/>
  </resultMap>

<!--  <select id="findAll" resultType="org.clxmm.entity.Department">-->
  <select id="findAll" resultMap="departmentWithConstructor">
    select *
    from tbl_department
  </select>
```

### 3.2 引用其他resultMap

#### 3.2.1 现成的resultMap+prefix

比方说，我们之前在 `department.xml` 中不是已经定义过最基本的 department 映射关系了嘛：

```xml
<resultMap id="department" type="com.linkedbear.mybatis.entity.Department">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="tel" column="tel"/>
</resultMap>
```

那么，我们就可以直接拿来用了。找到 `user.xml` 中的 `findAll` ，我们改一下 resultMap ：

```xml
<resultMap id="userWithPrefix" type="com.linkedbear.mybatis.entity.User">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="age" column="age"/>
    <result property="birthday" column="birthday"/>
    <association property="department" javaType="com.linkedbear.mybatis.entity.Department"
                 resultMap="com.linkedbear.mybatis.mapper.DepartmentMapper.department" 
                 columnPrefix="department_"/>
</resultMap>

<select id="findAll" resultMap="userWithPrefix"> <!-- 注意这里的resultMap是上面新定义的 -->
    select usr.*, dep.name as department_name, dep.tel as department_tel
    from tbl_user usr
    left join tbl_department dep on usr.department_id = dep.id
</select>
```

注意看上面的 `userWithPrefix` 定义，`<association>` 标签中直接引用了上面的那个 department 的 resultMap ，只不过多了一个 **`columnPrefix="department_"`** 的配置。它的用途想必小册不用多解释，小伙伴也能猜得到，它可以在封装结果集时，自动取出 `"指定前缀 + column"` 的列封装到指定的 resultMap 中。

#### 3.2.2 直接引用resultMap

当然，如果查出来的列中，对应到 `Department` 实体类的属性不完全都带前缀的话（例如 department_id 、department_name 、tel ），那 resultMap + prefix 的办法就不奏效了，这种情况我们只能再定义一个新的 resultMap ，然后直接引用，就像这样：

```xml
<resultMap id="userWithPrefix" type="com.linkedbear.mybatis.entity.User">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="age" column="age"/>
    <result property="birthday" column="birthday"/>
    <association property="department" javaType="com.linkedbear.mybatis.entity.Department"
                 resultMap="com.linkedbear.mybatis.mapper.DepartmentMapper.departmentWithPrefix"/>
</resultMap>

<resultMap id="departmentWithPrefix" type="com.linkedbear.mybatis.entity.Department">
    <id property="id" column="department_id"/>
    <result property="name" column="department_name"/>
    <result property="tel" column="tel"/>
</resultMap>
```

## 3.3 resultMap的继承

跟 SpringFramework 中的 `BeanDefinition` 继承类似，resultMap 也有继承的概念。引入继承，使 resultMap 具备了层次性和通用性。我们可以通过一个例子来体会一下 resultMap 继承的特性有什么好处。

回顾一下我们之前写一对多时，我们需要在 department 的 resultMap 中添加一个 collection ，来关联加载所有的 User ，但是实际情况下有些场景根本不需要这些 User ，那加载出来就是浪费性能的，徒增功耗！以前我们的解决方法是这样的：

```xml
<resultMap id="department" type="com.linkedbear.mybatis.entity.Department">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="tel" column="tel"/>
</resultMap>

<resultMap id="departmentWithUsers" type="com.linkedbear.mybatis.entity.Department">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="tel" column="tel"/>
    <collection property="users" ofType="com.linkedbear.mybatis.entity.User"
                select="com.linkedbear.mybatis.mapper.UserMapper.findAllByDepartmentId" column="id"/>
</resultMap>
```

这样写倒是没错，但 `tbl_department` 表中的普通字段映射却重复出现了，维护成本会增加。MyBatis 自然帮我们想到了这一点，所以我们可以这样优化一下：

```xml
<resultMap id="department" type="com.linkedbear.mybatis.entity.Department">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="tel" column="tel"/>
</resultMap>

<resultMap id="departmentWithUsers" type="Department" extends="department">
    <collection property="users" ofType="com.linkedbear.mybatis.entity.User"
                select="com.linkedbear.mybatis.mapper.UserMapper.findAllByDepartmentId" column="id"/>
</resultMap>

<select id="findAll" resultMap="departmentWithUsers">
    select * from tbl_department
</select>
```

看，`department` 这个 resultMap 中只配置单表字段的映射，关联集合的查询用 `departmentWithUsers` 这个 resultMap ，让它继承 `department` ，也可以同时拥有单表的字段映射关系。

### 3.4 鉴别器

最后咱再介绍一种比较特殊的结果集映射，叫 **discriminator** 鉴别器映射。鉴别器，无非就是**根据某些条件，决定如何做 / 如何选**。下面我们通过一个简单的需求来讲解 discriminator 的使用。

#### 3.4.1 需求

现有的 `tbl_user` 表中有一个 `deleted` 属性，代表是否逻辑删除。我们的需求是，当 `deleted` 属性值为 0 时，代表未删除，查询用户信息时需要把部门信息一并带出；`deleted` 为 1 时，代表用户已删除，不再连带查询部门信息。

为了区分两种不同的用户，我们先把 `tbl_user` 中的 hahahaha 用户，`deleted` 属性改为 1 ：

```
update tbl_user set deleted = 1 where id = '0e7e237ccac84518914244d1ad47e756';

```

#### 3.4.2 使用鉴别器

根据需求来说，是需要先查出结果，后决定如何封装结果集，所以我们可以先全部查出，后决定如何封装，也可以先查出 tbl_user 的主表，再根据 deleted 属性延迟加载部门信息。

```xml
<select id="findAllUseDiscriminator" resultMap="userWithDiscriminator">
    select * from tbl_user
</select>

<resultMap id="userWithDiscriminator" type="com.linkedbear.mybatis.entity.User">
    <discriminator column="deleted" javaType="boolean">
        <case value="false" resultMap="userlazy"/>
        <case value="true" resultType="com.linkedbear.mybatis.entity.User"/>
    </discriminator>
</resultMap>
```

我们来看一下这种写法，这里面只有一个 `<discriminator>` 的子标签，它可以取出查询结果数据集中的某一列，转换为指定的类型，并进行类似于 `switch-case` 的比较，根据比较的相同的值，使用对应的 resultMap 或者 resultType 。

`tbl_user` 表中的 `deleted` 属性，对应的数据类型是 tinyint ，它就相当于 Java 中的 boolean ，0 代表 false ，1 代表 true 。那我们就可以声明，当 `deleted` 为 false 时，用延迟加载的那个 userlazy 就可以，这样查 `User` 的时候能顺便把 `Department` 也查出来；`deleted` 为 true 时，只查本表的属性，那就直接用 resultType 指定 `User` 类型就够了。

## 4. cache - 缓存

最后我们来简单提一嘴 mapper.xml 中的缓存，默认情况下 MyBatis 只会开启基于 `SqlSession` 的一级缓存，二级缓存默认不会开启。二级缓存，也可以理解为基于 `SqlSessionFactory` 级别的缓存 / namespace 范围的缓存，一个 namespace 对应一块二级缓存。如果需要为特定的 namespace 开启二级缓存，则可以在对应的 mapper.xml 中声明一个 `<cache>` 标签：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.linkedbear.mybatis.mapper.DepartmentMapper">
    <cache />
    
    <!-- ... statement ... -->
</mapper>
```

