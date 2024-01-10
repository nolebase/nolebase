---
title: 05 MyBatis 介绍(二)
---

## 1、 Lombok

官网 [https://projectlombok.org/](https://projectlombok.org/)

```
Project Lombok is a java library that automatically plugs into your editor and build tools, spicing up your java.
Never write another getter or equals method again, with one annotation your class has a fully featured builder, Automate your logging variables, and much more.
```

- java library 
- plugs
- build tools
-  with one annotation your class

### 1、idea的使用

[https://projectlombok.org/setup/intellij](https://projectlombok.org/setup/intellij)

- 安装插件

- 引入maven的依赖

  ```xml
  <dependency>
      <scope>compile</scope>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <version>1.18.20</version>
  </dependency>
  ```

## 2、多对一处理

数据表

```sql
CREATE TABLE `teacher` (
  `id` INT(10) NOT NULL,
  `name` VARCHAR(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB 

INSERT INTO teacher(`id`, `name`) VALUES (1, '秦老师');


CREATE TABLE `student` (
  `id` INT(10) NOT NULL,
  `name` VARCHAR(30) DEFAULT NULL,
  `tid` INT(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fktid` (`tid`),
  CONSTRAINT `fktid` FOREIGN KEY (`tid`) REFERENCES `teacher` (`id`)
) ENGINE=INNODB 

INSERT INTO `student` (`id`, `name`, `tid`) VALUES (1, '小明', 1); 
INSERT INTO `student` (`id`, `name`, `tid`) VALUES (2, '小红', 1); 
INSERT INTO `student` (`id`, `name`, `tid`) VALUES (3, '小张', 1); 
INSERT INTO `student` (`id`, `name`, `tid`) VALUES (4, '小李', 1); 
INSERT INTO `student` (`id`, `name`, `tid`) VALUES (5, '小王', 1);
```



![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/myb20210715210144.png)



### 按照查询嵌套处理

```xml
    <resultMap id="stuTea" type="Student">
        <result property="id" column="id"/>
        <result property="name" column="name"/>

<!--        复杂属性 -->
        <association property="teacher" javaType="Teacher" column="tid" select="getTeacher"/>
    </resultMap>

    <select id="getStudent" resultMap="stuTea">
        SELECT *
        FROM student s
    </select>

    <select id="getTeacher" resultType="Teacher">
        select  * from teacher where  id = #{tid}
    </select>
```

### 按照结果嵌套处理

```xml
<!--    按照结果-->
    <select id="getStudent2" resultMap="stuTea">
        SELECT s.id sid,s.name sname ,t.id tid ,t.name tname
        FROM student s
         LEFT JOIN teacher t ON s.tid = t.id
    </select>


    <resultMap id="student2" type="Student">
        <result property="id" column="sid"/>
        <result property="name" column="sname"/>
        <association property="teacher" javaType="Teacher" >
            <result property="name" column="tname"/>
            <result property="id" column="tid"/>
        </association>
    </resultMap>
```



## 3、一对多

复杂的属性，单独处理

association：对象         javaType.指定属性类型

collection：集合，   集合中的泛型信息 ofType



```java
@Data
public class Student {

    private int id;

    private String name;

    private int tid;
}

@Data
public class Teacher {
    private int id;
    private String name;
    List<Student> students;
}


public interface TeacherMapper {
    
    Teacher getTeacherById(@Param("tid") int id);
  Teacher getTeacherById2(@Param("tid") int id);
}
```

###  结果嵌套查询

```xml
		<!-- 结果嵌套查询-->
    <resultMap id="mTs" type="Teacher">
        <result property="id" column="id"/>
        <result property="name" column="name"/>
        <collection property="students" ofType="Student">
            <result property="id" column="sid"/>
            <result property="name" column="sname"/>
        </collection>
    </resultMap>
    <select id="getTeacherById"    resultMap="mTs">
        select t.*,s.name sname,s.id sid from student s ,teacher t
        where s.tid = t.id and t.id = #{tid}
    </select>
```

### 按照查询嵌套处理

```xml
    <resultMap id="myTeacher" type="Teacher">

        <collection property="students" javaType="ArrayList" ofType="Student" select="getStudent2" column="id"/>
    </resultMap>

    <select id="getTeacherById2" resultMap="myTeacher">

        select  * from teacher where id = #{tid}

    </select>
    <select id="getStudent2" resultType="Student">
        select  * from student s where  s.tid = #{tid}
    </select>
```



## 4、动态sql

[https://mybatis.org/mybatis-3/zh/dynamic-sql.html](https://mybatis.org/mybatis-3/zh/dynamic-sql.html)

通过 if, choose, when, otherwise, trim, where, set, foreach等标签，可组合成非常灵活的SQL语句，

```sql
 CREATE TABLE `blog`(
`id` VARCHAR(50) NOT NULL COMMENT '博客id',
`title` VARCHAR(100) NOT NULL COMMENT '博客标题',
`author` VARCHAR(30) NOT NULL COMMENT '博客作者',
`create_time` DATETIME NOT NULL COMMENT '创建时间',
`views` INT(30) NOT NULL COMMENT '浏览量'
)ENGINE=INNODB
```





```xml
    <settings>
<!--        标准的日志工厂实现-->
<!--        <setting name="logImpl" value="STDOUT_LOGGING"/>-->
        <setting name="logImpl" value="LOG4J"/>
<!--        开启驼峰-->
        <setting name="mapUnderscoreToCamelCase" value="true" />
    </settings>
```



```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Blog {

    private String id;
    private String title;
    private String author;
    private Date createTime;
    private int views;
    
}
```



### if

```xml
    <select id="selectById" resultType="pojo.Blog" parameterType="map">
        select * from blog where 1=1
        <if test="id != null">
            and id = #{id}
        </if>
    </select>
```

### choose、when、otherwise

有时候，我们不想使用所有的条件，而只是想从多个条件中选择一个使用。针对这种情况，MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。

还是上面的例子，但是策略变为：传入了 “title” 就按 “title” 查找，传入了 “author” 就按 “author” 查找的情形。若两者都没有传入，就返回标记为 featured 的 BLOG（这可能是管理员认为，与其返回大量的无意义随机 Blog，还不如返回一些由管理员精选的 Blog）。

```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1 
    </otherwise>
  </choose>
</select>
```



### trim、where、set

*where* 元素只会在子元素返回任何内容的情况下才插入 “WHERE” 子句。而且，若子句的开头为 “AND” 或 “OR”，*where* 元素也会将它们去除。

```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  <where>
    <if test="state != null">
         state = #{state}
    </if>
    <if test="title != null">
        AND title like #{title}
    </if>
    <if test="author != null and author.name != null">
        AND author_name like #{author.name}
    </if>
  </where>
</select>
```

用于动态更新语句的类似解决方案叫做 *set*。*set* 元素可以用于动态包含需要更新的列，忽略其它不更新的列。比如：

```xml
<update id="updateAuthorIfNecessary">
  update Author
    <set>
      <if test="username != null">username=#{username},</if>
      <if test="password != null">password=#{password},</if>
      <if test="email != null">email=#{email},</if>
      <if test="bio != null">bio=#{bio}</if>
    </set>
  where id=#{id}
</update>
```

这个例子中，*set* 元素会动态地在行首插入 SET 关键字，并会删掉额外的逗号（这些逗号是在使用条件语句给列赋值时引入的）。



### foreach

动态 SQL 的另一个常见使用场景是对集合进行遍历（尤其是在构建 IN 条件语句的时候）。比如：

```xml
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  WHERE ID in
  <foreach item="item" index="index" collection="list"
      open="(" separator="," close=")">
        #{item}
  </foreach>
</select>
```

### script

要在带注解的映射器接口类中使用动态 SQL，可以使用 *script* 元素。比如:

```xml
    @Update({"<script>",
      "update Author",
      "  <set>",
      "    <if test='username != null'>username=#{username},</if>",
      "    <if test='password != null'>password=#{password},</if>",
      "    <if test='email != null'>email=#{email},</if>",
      "    <if test='bio != null'>bio=#{bio}</if>",
      "  </set>",
      "where id=#{id}",
      "</script>"})
    void updateAuthorValues(Author author);
```

### bind

`bind` 元素允许你在 OGNL 表达式以外创建一个变量，并将其绑定到当前的上下文。比如：

```xml
<select id="selectBlogsLike" resultType="Blog">
  <bind name="pattern" value="'%' + _parameter.getTitle() + '%'" />
  SELECT * FROM BLOG
  WHERE title LIKE #{pattern}
</select>
```

### 多数据库支持

如果配置了 databaseIdProvider，你就可以在动态代码中使用名为 “_databaseId” 的变量来为不同的数据库构建特定的语句。比如下面的例子：

```xml
<insert id="insert">
  <selectKey keyProperty="id" resultType="int" order="BEFORE">
    <if test="_databaseId == 'oracle'">
      select seq_users.nextval from dual
    </if>
    <if test="_databaseId == 'db2'">
      select nextval for seq_users from sysibm.sysdummy1"
    </if>
  </selectKey>
  insert into users values (#{id}, #{name})
</insert>
```

### SQL 代码片段

```xml
<sql id="userColumns"> ${alias}.id,${alias}.username,${alias}.password </sql>
<select id="selectUsers" resultType="map">
  select
    <include refid="userColumns"><property name="alias" value="t1"/></include>,
    <include refid="userColumns"><property name="alias" value="t2"/></include>
  from some_table t1
    cross join some_table t2
</select>
```

也可以在 include 元素的 refid 属性或内部语句中使用属性值，例如：

```xml
<sql id="sometable">
  ${prefix}Table
</sql>

<sql id="someinclude">
  from
    <include refid="${include_target}"/>
</sql>

<select id="select" resultType="map">
  select
    field1, field2, field3
  <include refid="someinclude">
    <property name="prefix" value="Some"/>
    <property name="include_target" value="sometable"/>
  </include>
</select>
```



## 5、缓存

### 缓存

- 存在内存中的临时数据
- 减少和数据库得瑟交互次数，减少系统开销
- 经常查询切不经常改变的数据



### 2、mybatis 缓存

[https://mybatis.org/mybatis-3/zh/sqlmap-xml.html#cache](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html#cache)

- MyBatis定义了两个级别的缓存：** 一级和二级**
  - 默认情况下，只有一级缓存（SqlSession级别的缓存，也称本地缓存）
  - 二级缓存需要手动开启和配置，基于namespace级别的缓存
  - 为了提高扩展性，Mybatis定义了接口cache。可以通过实现cache来实现二级缓存



### 3、一级缓存

- 与数据库同一次会话期间查询到的数据会放在本地缓存中，
- 以后如果需要获取相同的数据，直接从缓存中拿，没有必要去查询数据库了；

```java
    @Test
    public void test01() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        // 方式一 ：getMapper 推荐使用
        UserDao mapper = sqlSession.getMapper(UserDao.class);
        User user = mapper.getUserById(1);
      	// 更新，会使一级缓存失效
      	mapper.update(new User("1","clxc"));
              // 手动清理缓存
//        sqlSession.clearCache();
      
        User user1 = mapper.getUserById(1);
        System.out.println(user == user1);
        sqlSession.close();
    }
```

打开日志，可以查看到sql只查询了一次

 缓存失效

- 查询不同的东西
- 增删改，改变原来的数据，缓存刷新
- 查询不同的 mapper。xml
- 手动清除缓存





### 4、二级缓存

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/myb20210718181703.png)

```xml
 <!--        显示的开启二级缓存，默认的开启　-->
        <setting name="cacheEnabled" value="true"/>
```





- 二级缓存也叫全局缓存，
- ，基于namespace级别的缓存,一个空间名称对应一个二级缓存
- 工作机制
  - 几个回话查询一条数据，这个数据就相当于放在当前会话的一级缓存中；
  - 如果当前回话被关闭，这个回话对应的一级缓存就没有
  - 新的回话查询信息，可以从二级缓存中获取
  - 不同的mapper查询出的数据会放在自己对应的缓存中（map）

默认情况下，只启用了本地的会话缓存，它仅仅对一个会话中的数据进行缓存。 要启用全局的二级缓存，只需要在你的 SQL 映射文件中添加一行：

```xml
<cache/>
```

基本上就是这样。这个简单语句的效果如下:

- 映射语句文件中的所有 select 语句的结果将会被缓存。
- 映射语句文件中的所有 insert、update 和 delete 语句会刷新缓存。
- 缓存会使用最近最少使用算法（LRU, Least Recently Used）算法来清除不需要的缓存。
- 缓存不会定时进行刷新（也就是说，没有刷新间隔）。
- 缓存会保存列表或对象（无论查询方法返回哪种）的 1024 个引用。
- 缓存会被视为读/写缓存，这意味着获取到的对象并不是共享的，可以安全地被调用者修改，而不干扰其他调用者或线程所做的潜在修改。

**提示** 缓存只作用于 cache 标签所在的映射文件中的语句。如果你混合使用 Java API 和 XML 映射文件，在共用接口中的语句将不会被默认缓存。你需要使用 @CacheNamespaceRef 注解指定缓存作用域。

这些属性可以通过 cache 元素的属性来修改。比如：

```xml
<cache
  eviction="FIFO"
  flushInterval="60000"
  size="512"
  readOnly="true"/>
```

这个更高级的配置创建了一个 FIFO 缓存，每隔 60 秒刷新，最多可以存储结果对象或列表的 512 个引用，而且返回的对象被认为是只读的，因此对它们进行修改可能会在不同线程中的调用者产生冲突。

可用的清除策略有：

- `LRU` – 最近最少使用：移除最长时间不被使用的对象。
- `FIFO` – 先进先出：按对象进入缓存的顺序来移除它们。
- `SOFT` – 软引用：基于垃圾回收器状态和软引用规则移除对象。
- `WEAK` – 弱引用：更积极地基于垃圾收集器状态和弱引用规则移除对象。

默认的清除策略是 LRU。

flushInterval（刷新间隔）属性可以被设置为任意的正整数，设置的值应该是一个以毫秒为单位的合理时间量。 默认情况是不设置，也就是没有刷新间隔，缓存仅仅会在调用语句时刷新。

size（引用数目）属性可以被设置为任意正整数，要注意欲缓存对象的大小和运行环境中可用的内存资源。默认值是 1024。

readOnly（只读）属性可以被设置为 true 或 false。只读的缓存会给所有调用者返回缓存对象的相同实例。 因此这些对象不能被修改。这就提供了可观的性能提升。而可读写的缓存会（通过序列化）返回缓存对象的拷贝。 速度上会慢一些，但是更安全，因此默认值是 false。

**提示** 二级缓存是事务性的。这意味着，当 SqlSession 完成并提交时，或是完成并回滚，但没有执行 flushCache=true 的 insert/delete/update 语句时，缓存会获得更新。

```java
    @Test
    public void test01() {


        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        // 方式一 ：getMapper 推荐使用
        UserDao mapper = sqlSession.getMapper(UserDao.class);
        User user = mapper.getUserById(1);

        // 手动清理缓存
//        sqlSession.clearCache();

        User user1 = mapper.getUserById(1);
        System.out.println(user == user1);
        sqlSession.close();

        SqlSession sqlSession2 = MyBatisUtils.getSqlSession();

        UserDao mapper1 = sqlSession2.getMapper(UserDao.class);
        System.out.println(mapper1.getUserById(1));
        sqlSession2.close();
        
    }
```

测试的时候，用注解写的sql不行，sql要在mapper.xml中



### 小结

- 回话提交的时候，会放到二级缓存中

### 5、自定义缓存

ehcache

ehcache。x m l

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="http://ehcache.org/ehcache.xsd" updateCheck="false">

    <!--
    diskStore: 缓存路径, ehcache分为内存和磁盘两级, 此属性定义磁盘的缓存位置
    参数:
    user.home - 用户主目录
    user.dir - 用户当前工作目录
    java.io.tmpdir - 默认临时文件路径
    -->

    <!--当二级缓存的对象 超过内存限制时（缓存对象的个数>maxElementsInMemory），存放入的硬盘文件 -->
    <diskStore path="./tempdir/Tmp_Ehcache"/>

    <!--default 默认缓冲策略, 当ehcache找不到定义的缓存时, 则使用这个缓存策略, 这个只能定义一个-->
    <defaultCache
            eternal="false"
            maxElementsInMemory="10000"
            overflowToDisk="false"
            diskPersistent="false"
            timeToIdleSeconds="1800"
            timeToLiveSeconds="259200"
            memoryStoreEvictionPolicy="LRU"/>

    <cache
            name="cloud_user"
            eternal="false"
            maxElementsInMemory="5000"
            overflowToDisk="false"
            diskPersistent="false"
            timeToIdleSeconds="1800"
            timeToLiveSeconds="1800"
            memoryStoreEvictionPolicy="LRU"/>

    <!--
     maxElementsInMemory:设置 在内存中缓存 对象的个数
     maxElementsOnDisk：设置 在硬盘中缓存 对象的个数
     eternal：设置缓存是否 永远不过期
     overflowToDisk：当系统宕机的时候是否保存到磁盘上
     maxElementsInMemory的时候，是否转移到硬盘中
     timeToIdleSeconds：当2次访问 超过该值的时候，将缓存对象失效
     timeToLiveSeconds：一个缓存对象 最多存放的时间（生命周期）
     diskExpiryThreadIntervalSeconds：设置每隔多长时间，通过一个线程来清理硬盘中的缓存
     clearOnFlush: 内存数量最大时是否清除
     memoryStoreEvictionPolicy：当超过缓存对象的最大值时，处理的策略；LRU (最少使用)，FIFO (先进先出), LFU (最少访问次数)
     -->
</ehcache>
```


- 实现mybatis 的cache接口






