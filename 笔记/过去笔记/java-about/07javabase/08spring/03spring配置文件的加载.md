---
title: 03spring配置文件的加载
--- 

## 简单的案例（ioc的依赖查找）

```java
@Data
public class Book {

	private String name;

	private String id;
	
}
```

resource目录下创建配置文件

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

加载配置配件

```java
	public static void main(String[] args) {
		ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:beans.xml");

		Book book = (Book) ctx.getBean("book");
		System.out.println(book);
	}
```

首先要做的事情就是先把 XML 配置文件加载到内存中，再去解析它，再去。。。。。

一步一步来吧，先来看 XML 文件如何被加入到内存中去。



读取配置文件，需要一个载体来加载它，这里咱选用 `ClassPathXmlApplicationContext` 来加载。加载完成后咱直接使用 `BeanFactory` 接口来接收（多态思想）。下一步就可以从 `BeanFactory` 中获取 book 了，由于咱在配置文件中声明了 id ，故这里就可以直接把 id 传入，`BeanFactory` 就可以给我们返回 `Book` 对象。

### 2文件读取

文件读取在 Spring 中很常见，也算是一个比较基本的功能，而且 Spring 提供的文件加载方式，不仅仅在 Spring 框架中可以使用，我们在项目中有其他文件加载需求也可以使用。

首先，Spring 中使用 Resource 接口来封装底层资源，Resource 接口本身实现自 InputStreamSource 接口：

