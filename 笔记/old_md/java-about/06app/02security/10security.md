---
title: security开始
--- 

## 1.入门

创建springboot工程，在项目中引入security依赖

```xml
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

创建一个测试的controller

```java
  @GetMapping("hello")
    public String hello() {
        return "hello security";
    }
```

启动项目，访问hello接口，会出现登陆界面

![image-20220411203736178](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220411203736sc.png)

在启动的时候，如果没有任何关于用户的配置，会有一个默认的账户，用户名为`user`，密码打印在控制台

```
Using generated security password: 91eba42f-c0bc-4137-ac5c-f95e1a6b325f
```

## 2.原理初探

![s1](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202105/sec20210608211652.png)

### 2.1 springsecurity 的流程

springsecurity 的流程就是一条过滤器链，包含了各种功能的过滤器

**UsernamePasswordAuthenticationFilter**用于处理来自表单提交的认证。该表单必须提供对应的用户名和密码，其内部还有登录成功或失败后进行处理的 AuthenticationSuccessHandler 和AuthenticationFailureHandler，这些都可以根据需求做相关改变;

**FilterSecurityInterceptor** 是用于保护web资源的，使用AccessDecisionManager对当前用户进行授权访问

**ExceptionTranslationFilter** 能够捕获来自 FilterChain 所有的异常，并进行处理。但是它只会处理两类异常:AuthenticationException 和 AccessDeniedException，其它的异常它会继续抛出。

默认的过滤器链

![image-20220411205536117](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220411205536sc.png)

### 2.2 认证的流程

**UsernamePasswordAuthenticationFilter**

![image-20220411210711316](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220411210711sc.png)

![image-20220411211208081](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220411211208sc.png)

### 2.3 自定义用户登陆

t添加依赖

```xml
 <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.62</version>
        </dependency>

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.0</version>
        </dependency>
```

**需要的工具类**

```java
package org.cxmm.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.ParserConfig;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;

import java.nio.charset.Charset;


public class FastJsonRedisSerializer<T> implements RedisSerializer<T> {
    public static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");

    private Class<T> clzaa;

    static {
        ParserConfig.getGlobalInstance().setAutoTypeSupport(true);
    }

    public FastJsonRedisSerializer(Class<T> clzaa) {
        super();
        this.clzaa = clzaa;
    }


    @Override
    public byte[] serialize(T t) throws SerializationException {
        if (t == null) {
            return new byte[0];
        }
        return JSON.toJSONString(t, SerializerFeature.WriteClassName).getBytes(DEFAULT_CHARSET);
    }

    @Override
    public T deserialize(byte[] bytes) throws SerializationException {

        if (bytes == null || bytes.length == 0) {
            return null;
        }

        String str = new String(bytes, DEFAULT_CHARSET);

        return JSON.parseObject(str, clzaa);
    }


    protected JavaType getJavaType(Class<?> clazz) {
        return TypeFactory.defaultInstance().constructType(clazz);
    }
}

```

```java
  @Bean
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();

        FastJsonRedisSerializer fastJsonRedisSerializer = new FastJsonRedisSerializer(Object.class);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(fastJsonRedisSerializer);

        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(fastJsonRedisSerializer);

        template.afterPropertiesSet();
        return template;
    }
```

```java
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Result<T> {


    private Integer code;

    private String msg;


    private T data;

}

```

```sql
CREATE TABLE `sys_user` (
  `id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) DEFAULT NULL,
  `nick_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` varchar(1) DEFAULT '0' COMMENT '0正常，1停用  账号状态',
  `email` varchar(255) DEFAULT NULL,
  `phonenumber` varchar(0) DEFAULT NULL,
  `sex` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `userType` varchar(255) DEFAULT '0' COMMENT '用户类型 0管理员，1普通用户',
  `createBy` bigint(255) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateBy` bigint(20) DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `delFlag` varchar(1) DEFAULT '0' COMMENT '0未删除，1已经删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.4 整合mybatis

```xml
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.5.1</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
```

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("sys_user")
public class User implements Serializable {


    private static final long serialVersionUID = 3309065109498798402L;

    @TableId
    private Long id;


    private String userName;

    private String nickName;

    private String password;

    // 0正常，1停用  账号状态
    private String status;

    private String email;

    private String phonenumber;

    // 1男，2女
    private String sex;


    // 头像
    private String avatar;

    // 用户类型 0管理员，1普通用户
    @TableField(value = "user_type")
    private String userType;


    private Long createBy;

    private Date createTime;

    private Long updateBy;

    private Date updateTime;

    /**
     * 0未删除，1已经删除
     */
    private Integer delFlag;


}


public interface UserMapper extends BaseMapper<User> {


}

```

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/security?serverTimezone=GMT%2B8&useSSL=false
    username: root
    password: root
  redis:
    host: 127.0.0.1
    port: 6379


mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    map-underscore-to-camel-case: true
```

