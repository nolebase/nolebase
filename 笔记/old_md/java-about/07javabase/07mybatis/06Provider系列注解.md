---
title: 06Provider系列注解
---

MyBatis 还提供了 4 种 Provider 注解，使用它们同样可以实现 CRUD 操作

## 1. @SelectProvider

所有的 Provider 型注解，都有两个属性：type 和 method ，它们分别指代一个提供 SQL 的类和方法，被引用的提供 SQL 语句的方法都需要有一个 String 类型的返回值，参数可以根据实际情况定义。下面我们可以先举几个简单的例子。

### 1.1 基本使用

本章的内容我们都写在 `UserAnnotationMapper` 中吧！我们还是先来定义一个 `findAll` 方法，并标注 `@SelectProvider` 注解：

```java
public interface UserAnnotationMapper {
    
    @SelectProvider(type = UserMapperProvider.class, method = "findAll")
    List<User> findAll();
}
```

相应的，我们需要定义一个 `UserMapperProvider` 类：

```java
public class UserMapperProvider {
    
    public String findAll() {
        return null;
    }
}
```

这里面的 SQL 该怎么写呢？很简单，可以直接写 `select * from tbl_user` ，但这样未免也太多此一举了。。。MyBatis 为我们提供了一组新的 API ，可以用这组 API 构建 SQL ：

```java
 public String findAll() {
        SQL sql = new SQL();
        sql.SELECT("*").FROM("tbl_user");
        return sql.toString();
    }
```

### 1.2 复杂SQL的拼装

本身 `@SelectProvider` 注解的使用是简单的，不过里面如何拼装 SQL ，这个我们可以再多接触一点。

```xml
 <select id="findAll" resultType="User">
        select * from tbl_user
        <where>
            <if test="id != null">
                and id = #{id}
            </if>
            <if test="name != null and name != ''">
                and name like concat('%', #{name}, '%')
            </if>
        </where>
        order by id asc
    </select>
```

```java
   public String findAllByExample(User example) {
        SQL sql = new SQL();
        sql.SELECT("*").FROM("tbl_user");
        if (example.getId() != null) {
            sql.AND().WHERE("id = #{id}");
        }
        if (example.getName() != null && example.getName().trim().length() > 0) {
            sql.AND().WHERE("name like concat('%', #{name}, '%')");
        }
        sql.ORDER_BY("id asc");
        return sql.toString();
    }
```

理解起来倒是不难，不过这应该给我们一个启发：编程式构造 SQL 还是有一定的好处的，它相较于 mapper.xml 中的动态 SQL 编写**更为自由**，相对应的，它的**可维护性会差一些**（毕竟每次改动都需要重新编译）。

### 1.3 使用时要注意的

尽管看上去使用动态 SQL 的这个 API 很酷炫（并没有？），不过话又说回来，要使用 Provider 系列注解的时候，这个提供 SQL 语句的 Provider 类是有几个注意事项的：

- 必须有无参构造器（不存在则会报构造器找不到的异常）
- Mapper 接口中的参数列表跟 Provider 类中的方法参数列表原则上一致

默认情况下，我们在调用 Mapper 接口传入参数时，MyBatis 发现我们使用了 Provider 系列的注解，会把这些参数直接转交给 Provider 类的方法，让它来负责生成 SQL 语句，如果这个时候方法参数列表对不上，会抛出异常（底层执行会调用 `method.invoke(target, args)` 方法，`args` 对不上就挂了）。

## 2. DML类Provider注解

### 2.1 @InsertProvider

```java
 @InsertProvider(type = UserMapperProvider.class, method = "save")
    void save(User user);

    public String save(User user) {
        SQL sql = new SQL();
        sql.INSERT_INTO("tbl_user");
        sql.VALUES("id", "'" + UUID.randomUUID().toString().replaceAll("-", "") + "'");
        sql.VALUES("name", "#{name}");
        sql.VALUES("age", "#{age}");
        sql.VALUES("department_id", "#{department.id}");
        return sql.toString();
    }
```

### 2.2 @UpdateProvider

```java
    @UpdateProvider(type = UserMapperProvider.class, method = "updateByExample")
    int updateByExample(User user);

    public String updateByExample(User user) {
        SQL sql = new SQL();
        sql.UPDATE("tbl_user");
        if (user.getName() != null && user.getName().trim().length() > 0) {
            sql.SET("name = #{name}");
        }
        if (user.getAge() != null) {
            sql.SET("age = #{age}");
        }
        sql.WHERE("id = #{id}");
        return sql.toString();
    }
```

### 2.3 @DeleteProvider

```java
  @DeleteProvider(type = UserMapperProvider.class, method = "deleteById")
    int deleteById(String id);

    public String deleteById(String id) {
        SQL sql = new SQL();
        sql.DELETE_FROM("tbl_user");
        sql.WHERE("id = #{id}");
        return sql.toString();
    }
```

