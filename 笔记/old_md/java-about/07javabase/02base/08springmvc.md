---
title: 01 spring mvc
---

## 1、mvc

mvc. 模型。视图。控制器，是一种软件设计规范



### 1、回顾servlet应用

- 创建一个空的maven项目
- 添加web框架的支持(右键项目，添加框架支持,选择web项目,成功后会创建web相关目录)

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/springmvc20210727213127.png" style="zoom:33%;" />

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/springmvc20210727213342.png" style="zoom:50%;" />

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/springmvc20210727213503.png)


- 带入依赖

```xml
    <dependencies>

        <dependency>
            <scope>compile</scope>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
        </dependency>
        <dependency>
            <scope>compile</scope>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>jsp-api</artifactId>
            <version>2.2</version>
        </dependency>
    </dependencies>
```




- 代码

```java
public class HelloServlet extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 1.获取前端参数

        req.getParameter("agr");

        // 2.业务逻辑

        req.getSession().setAttribute("msg", "success");


        // 3.转发


        req.getRequestDispatcher("/WEB-INF/jsp/test.jsp").forward(req, resp);

    }


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }


}


```

web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">


    <servlet>
        <servlet-name>hello</servlet-name>
        <servlet-class>org.servlet.HelloServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>hello</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>


    <session-config>

    </session-config>
    
</web-app>
```

test.jsp

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>


$("msg")
</body>
</html>
```



## 2、spring mvc

中文:  [https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference/web.html](https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference/web.html)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/springmvc20210728205034.png)

### 1 hello springmvc

创建一个maven项目，添加web框架支持

1、添加依赖

```xml
    <!--依赖-->
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.3.4</version>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
        </dependency>
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>jsp-api</artifactId>
            <version>2.0</version>
            <scope>provided</scope>
        </dependency>
        <!-- https://mvnrepository.com/artifact/javax.servlet/jstl -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
    </dependencies>
```

2、controller接口实现

```java
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author clxmm
 * @Description
 * @create 2021-07-28 9:29 下午
 */
public class HelloController implements Controller {

    @Override
    public ModelAndView handleRequest(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        //ModelAndView 模型和视图
        ModelAndView mv = new ModelAndView();
        //封装对象，放在ModelAndView中。
        mv.addObject("msg", "HelloSpringMVC");
        //封装要跳转的视图，放在ModelAndView中 /WEB-INF/jsp/hello.jsp
        mv.setViewName("hello");
        return mv;
    }
}
```

3、web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">


    <!--1.注册DispatcherServlet-->
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!--        关联一个springMVC的配置文件：【servlet-name】-servlet.xml-->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springmvc-servlet.xml</param-value>
        </init-param>
        <!--  启动级别-1-->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <!--/匹配所有的请求：（不包括.jsp）    -->
    <!--    /*匹配所有的请求：（包括.jsp）-->
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>


</web-app>

```

4、在resource文件夹下创建springmvc-servlet.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>
    <bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"/>
    <!-- 注册视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" id="InternalResourceViewResolver">
        <!-- 视图资源url的前缀 -->
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <!-- 视图资源url的后缀 -->
        <property name="suffix" value=".jsp"/>
    </bean>
    <!--    handler-->
    <bean id="/hello" class="org.controller.HelloController"/>
</beans>
```

5、配置项目

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202107/springmvc20210728215149.png)

右键项目，打开模块设置，看一下web-inf下lib文件夹是否如上图，没有的话自行创建，添加我们倒入的依赖jar包

6、 运行，配置tomcat

访问 [http://localhost:8080/hello](http://localhost:8080/hello)



### 2、springmvc 注解开发

添加依赖

```xml

    <!--依赖-->
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.3.4</version>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
        </dependency>
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>jsp-api</artifactId>
            <version>2.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/javax.servlet/jstl -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
    </dependencies>
```

Springmvc-servlet.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">


    <!-- 开启注解扫描 -->
    <context:component-scan base-package="org.controller"/>

    <!--    不处理静态资源 -->
    <mvc:default-servlet-handler/>
    <!-- 开启SpringMVC框架注解的支持 -->
    <mvc:annotation-driven/>

    <!-- 视图解析器对象 -->
    <bean id="internalResourceViewResolver"
          class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <property name="suffix" value=".jsp"/>
    </bean>
</beans>
```

Web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">



    <!--1.注册DispatcherServlet-->
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!--        关联一个springMVC的配置文件：【servlet-name】-servlet.xml-->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springmvc-servlet.xml</param-value>
        </init-param>
        <!--  启动级别-1-->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <!--/匹配所有的请求：（不包括.jsp）    -->
    <!--    /*匹配所有的请求：（包括.jsp）-->
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
    
</web-app>
```

controller

```java
@Controller
public class HelloController {


    @RequestMapping("/h1")
    public String test(Model model) {
        System.out.println("test");
        model.addAttribute("msg","123");
        return "test";
    }
}
```



## 3、springmvc 返回字符串（json）

### 1、 json

```html
    <script type="text/javascript">
        
        
        var user = {
            name : 'clxmm',
            age: 3,
            sex: "男"
        }
        
        // json 对象转字符串
        var jsonString = JSON.stringify(user);
        console.log(user)
        // json 字符串转对象
        var jsonObject = JSON.parse(jsonString);
        
        
    </script>
```



Java 的json工具

- jackson
- Fastjson

###  2、jackson

导入依赖

```xml
<dependency>
  <scope>compile</scope>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.13.0-rc1</version>
</dependency>
```



在springmvc 中在类上标注@RestController 或者在方法上用@ResponseBody 返回不走是图解析器，直接会返回字符串

```java
package org.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.Data;
import org.pojo.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

/**
 * @author clxmm
 * @Description
 * @create 2021-08-01 9:34 下午
 */
@Controller
@RestController
public class UserController {


//    @RequestMapping(value = "/t1",produces = "application/json;charset=utf-8")
    @RequestMapping(value = "/t1")
    @ResponseBody
    public String json1() throws JsonProcessingException {

        User user = new User();
        user.setAge(20);
        user.setName("clxmm");
        user.setSex("男");

        ObjectMapper mapper = new ObjectMapper();
        String s = mapper.writeValueAsString(user);
        return s;
    }


    @GetMapping("/t2")
    @ResponseBody
    public String json3() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS,false);
        Date date = new Date();



        return mapper.writeValueAsString(date);
    }



}

```

**中文乱码**

在springmvc的配置中加入转换器

```xml
    <!--    <mvc:annotation-driven/>-->
    <mvc:annotation-driven>
        <!--     解决乱码   -->
        <mvc:message-converters register-defaults="true">
            <bean class="org.springframework.http.converter.StringHttpMessageConverter">
                <constructor-arg value="UTF-8"/>
            </bean>
            <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
                <property name="objectMapper">
                    <bean class="org.springframework.http.converter.json.Jackson2ObjectMapperFactoryBean">
                        <property name="failOnEmptyBeans" value="false"/>
                    </bean>
                </property>
            </bean>
        </mvc:message-converters>
    </mvc:annotation-driven>
```
