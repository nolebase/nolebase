---
typora-root-url: ../../../../../../../Documents/截图/typora
---

---
title: 02spring源码环境本地测试
--- 

## 一下载源码(基于5.3.18版本)

下载地址

[https://github.com/spring-projects/spring-framework](https://github.com/spring-projects/spring-framework)

可以先克隆到Gitee，提高下载速度



## 二，国内镜像源修改：

找到build.gradle,文件

```
		repositories {
			mavenCentral()
			maven { url 'https://maven.aliyun.com/nexus/content/groups/public/' }
			maven { url "https://repo.spring.io/libs-spring-framework-build" }
		}
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409162542mybatis.png)

之后，用idea打开项目，进行构建

## 3，新建gradle测试项目

修改依赖：

添加

```groovy
apply plugin: "kotlin"
 implementation(project(":spring-context"))
```

![image-20220409163323166](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409163331mybatis.png)

查看依赖是否添加成功：

![image-20220409163447910](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409163452mybatis.png)

## 四，测试

新建一个bean

```java
ublic class Book {

	private String name;

	private String id;

  // get /set 
}
```

pei配置xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	   xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
	<bean class="org.clxmm.bean.Book" id="book">
		<property name="id" value="12"/>
		<property name="name" value="三国演义"/>
	</bean>
</beans>
```

测试

```java
	public static void main(String[] args) {
		ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:beans.xml");

		Book book = (Book) ctx.getBean("book");
		System.out.println(book);
	}
```

输出：

```java
Book{name='三国演义', id='12'}
```

![image-20220409164921349](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409164921mybatis.png)

