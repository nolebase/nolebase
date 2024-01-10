---
title: 43AOP基础-基于AspectJ实现AOP
---

上一章咱学习的是基于 xml 配置文件的方式配置 AOP ，本章咱继续学习使用注解驱动的方式来配置 AOP 。

## 1. Spring AOP与AspectJ【了解】

在 SpringFramework 的官方文档中，AOP 的介绍下面有一个段落，它说明了 Spring AOP 与 AspectJ 的关系：

[https://docs.spring.io/spring-framework/docs/5.2.x/spring-framework-reference/core.html#aop](https://docs.spring.io/spring-framework/docs/5.2.x/spring-framework-reference/core.html#aop)

> Spring provides simple and powerful ways of writing custom aspects by using either a schema-based approach or the @AspectJ annotation style. Both of these styles offer fully typed advice and use of the AspectJ pointcut language while still using Spring AOP for weaving.
>
> Spring 通过使用基于模式的方法或 `@AspectJ` 注解样式，提供了编写自定义切面的简单而强大的方法。这两种样式都提供了完全类型化的通知，并使用了 AspectJ 切入点表达式语言，同时仍使用 Spring AOP 进行通知的织入。

由此可知，SpringFramework 实现注解配置 AOP ，是整合了 AspectJ 完成的。在第 41 章中，小册也提到了 SpringFramework 中的通知类型就是基于 AspectJ 制定的：

- Before 前置通知：目标对象的方法调用之前触发
- After 后置通知：目标对象的方法调用之后触发
- AfterReturning 返回通知：目标对象的方法调用完成，在返回结果值之后触发
- AfterThrowing 异常通知：目标对象的方法运行中抛出 / 触发异常后触发
- Around 环绕通知：编程式控制目标对象的方法调用

其实咱上一章在编写 Demo 或者自行练习时，小伙伴们就可以很强烈的感觉到它其实就是用的这 5 种。

## 2. 基于注解的AOP配置【掌握】

好了咱下面可以开始学习基于注解的 AOP 配置了，跟上一章一样，咱还是分步骤进行。

### 2.1 标注@Component注解

上一章中咱注册 Bean 是使用 `<bean>` 标签的方式注册，这一章咱使用注解驱动，那就在两个 Service 类上标注 `@Component` 注解：

```java
@Component
public class FinanceService {
    public void addMoney(double money) {
        System.out.println("FinanceService 收钱 === " + money);
    }

    @Log
    public double subtractMoney(double money) {
        System.out.println("FinanceService 付钱 === " + money);
        return money;
    }

    public double subtractMoney(double money, String id) throws Exception {
        System.out.println("FinanceService 付钱 === " + money);
        return money;
    }

    public double getMoneyById(String id) {
        System.out.println("FinanceService 查询账户，id为" + id);
        return Math.random();
    }
}

@Component
public class OrderServiceImpl implements OrderService {

    @Override
    public void createOrder() {
        System.out.println("OrderServiceImpl 创建订单。。。");
    }

    @Override
    public void deleteOrderById(String id) {
        System.out.println("OrderServiceImpl 删除订单，id为" + id);
    }

    @Override
    public String getOrderById(String id) {
        System.out.println("OrderServiceImpl 查询订单，id为" + id);
        return id;
    }

    @Override
    public List<String> findAll() {
        System.out.println("OrderServiceImpl 查询所有订单。。。");
        return Arrays.asList("111", "222", "333");
    }
}
```

### 2.2 修改Logger切面类

这次使用 AspectJ 注解配置，切面类上也得做改动了。

首先，在 Logger 上标注 `@Component` 注解，将其注册到 IOC 容器中。然后还得标注一个 **`@Aspect`** 注解，代表该类是一个切面类：

```java
@Aspect
@Component
public class Logger { ... }
```

接下来，就是给这些方法标注通知注解了。小册先写一个，小伙伴们一下子就知道了：

```java
@Aspect
@Component
public class Logger {

    @Before("execution(public * org.clxmm.spring.b_aspectj.service.FinanceService.*(..))")
    public void beforePrint() {
        System.out.println("Logger beforePrint run ......");
    }
}
```

嚯，这也太简单了是吧！那前置通知叫 `@Before` ，那后置通知就是 `@After` 咯？当然啦，相应的，返回通知 `@AfterReturning` ，异常通知 `@AfterThrowing` ，环绕通知 `@Around` 。

```java

@Aspect
@Component
public class Logger {

    @Before("execution(public * org.clxmm.spring.b_aspectj.service.FinanceService.*(..))")
    public void beforePrint() {
        System.out.println("Logger beforePrint run ......");
    }

    @After("execution(* org.clxmm.spring.b_aspectj.service.*.*(String)))")
    public void afterPrint() {
        System.out.println("Logger afterPrint run ......");
    }

    @AfterReturning("execution(* org.clxmm.spring.b_aspectj.service.*.*(String)))")
    public void afterReturningPrint() {
        System.out.println("Logger afterReturningPrint run ......");
    }

    @AfterThrowing("execution(* org.clxmm.spring.b_aspectj.service.*.*(String)))")
    public void afterThrowingPrint() {
        System.out.println("Logger afterThrowingPrint run ......");
    }
}
```

### 2.3 编写配置类

配置类中，无需做任何多余的操作，只需要几个注解即可：

```java
@Configuration
@ComponentScan("org.clxmm.spring.b_aspectj")
@EnableAspectJAutoProxy
public class AspectJAOPConfiguration {


}
```

注意这里用了一个新的注解：**`@EnableAspectJAutoProxy`** ，是不是突然产生了一点亲切感（模块装配 + 条件装配）！用它可以开启基于 AspectJ 的自动代理，简言之，就是**开启注解 AOP** 。

如果要使用 xml 配置文件开启注解 AOP ，则需要添加一个 `<aop:aspectj-autoproxy/>` 的标签声明（它等价于 `@EnableAspectJAutoProxy` 注解）。

### 2.4 测试运行

```java
public class AnnotationAspectJApplication {
    
    public static void main(String[] args) throws Exception {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(AspectJAOPConfiguration.class);
        FinanceService financeService = ctx.getBean(FinanceService.class);
        financeService.addMoney(123.45);
        financeService.subtractMoney(543.21);
        financeService.getMoneyById("abc");
    }
}
```

运行 `main` 方法，控制台打印出了 `Logger` 的前置 、后置 、返回通知：

```
Logger beforePrint run ......
FinanceService 收钱 === 123.45
Logger beforePrint run ......
FinanceService 付钱 === 543.21
Logger beforePrint run ......
FinanceService 查询账户，id为abc
Logger afterReturningPrint run ......
Logger afterPrint run ......
```

## 3. 环绕通知的编写

除了前面提到的 4 种基本的通知类型之外，还有环绕通知没有说。环绕通知的编写其实在第 40 章回顾动态代理的时候就已经写过了，对，`InvocationHandler` 和 `MethodInterceptor` 的编写本身就是环绕通知的体现。换做使用 AspectJ 的写法，又要如何来编写呢？咱也要来学习一下。

### 3.1 添加新的环绕通知方法

在 `Logger` 类中，咱添加一个 `aroundPrint` 方法：（切入的方法就不覆盖那么多了，一个就好）

```java
@Around("execution(public * org.clxmm.spring.b_aspectj.service.FinanceService.addMoney(..))")
public void aroundPrint() {

}
```

然后咱回想一下，`InvocationHandler` 的结构是什么来着？得有入参，里面有对应的方法、参数，还得有返回值 `Object` 。。。可是这里啥也没有呀，这咱怎么写呢？

所以我们要先学习一个通知方法中的特殊参数：`ProceedingJoinPoint` 。

在 `aroundPrint` 方法的参数中添加 `ProceedingJoinPoint` ，并把方法的返回值类型改为 `Object` ：

```java
@Around("execution(public * org.clxmm.spring.b_aspectj.service.FinanceService.addMoney(..))")
public Object aroundPrint(ProceedingJoinPoint joinPoint) {

}
```

然后来看，`ProceedingJoinPoint` 有一个 `proceed` 方法，执行了它，就相当于之前咱在动态代理中写的 `method.invoke(target, args);` 方法了：

```java
@Around("execution(public * org.clxmm.spring.b_aspectj.service.FinanceService.addMoney(..))")
public Object aroundPrint(ProceedingJoinPoint joinPoint) {
  return joinPoint.proceed(); // 此处会抛出Throwable异常
}
```

之后剩下的部分，咱就很熟悉了，快速的来编写一下吧：

```java
@Around("execution(public * org.clxmm.spring.b_aspectj.service.FinanceService.addMoney(..))")
public Object aroundPrint(ProceedingJoinPoint joinPoint) throws Throwable {
  System.out.println("Logger aroundPrint before run ......");
  try {
    Object retVal = joinPoint.proceed();
    System.out.println("Logger aroundPrint afterReturning run ......");
    return retVal;
  } catch (Throwable e) {
    System.out.println("Logger aroundPrint afterThrowing run ......");
    throw e;
  } finally {
    System.out.println("Logger aroundPrint after run ......");
  }
}
```

### 3.2 测试运行

直接重新运行 `main` 方法，可以发现在控制台有同时打印环绕通知和前置通知：

```
Logger aroundPrint before run ......
Logger beforePrint run ......
FinanceService 收钱 === 123.45
Logger aroundPrint afterReturning run ......
Logger aroundPrint after run ......
```

由此也得出了一个小小的结论：**同一个切面类中，环绕通知的执行时机比单个通知要早**。

## 4. 切入点表达式的更多使用方法【掌握】

上一章咱只是在切入点表达式的学习中接触了一些比较简单的写法和用法，这一章咱继续学习更多的使用方法。

### 4.1 抽取通用切入点表达式

注意上面咱在 `Logger` 类中标注的切入点表达式：

```java

@After("execution(* org.clxmm.spring.b_aspectj.service.*.*(String)))")
public void afterPrint() {
  System.out.println("Logger afterPrint run ......");
}

@AfterReturning("execution(* org.clxmm.spring.b_aspectj.service.*.*(String)))")
public void afterReturningPrint() {
  System.out.println("Logger afterReturningPrint run ......");
}
```

这两个切入点表达式是一样的，如果这种同样的切入点表达式一多起来，回头修改起来那岂不是太费劲了？Spring 当然也为我们考虑到这一点了，所以它分别就 xml 和注解的方式提供了抽取通用表达式的方案。

#### 4.1.1 AspectJ注解抽取

在注解 AOP 切面中，定义通用的切入点表达式只需要声明一个空方法，并标注 `@Pointcut` 注解即可：

```java
    @Pointcut("execution(* org.clxmm.spring.b_aspectj.service.*.*(String)))")
    public void defaultPointcut() {

    }
```



其它的通知要引用这个切入点表达式，只需要标注方法名即可，效果是一样的。

```java
    @After("defaultPointcut()")
    public void afterPrint() {
        System.out.println("Logger afterPrint run ......");
    }

    @AfterReturning("defaultPointcut()")
    public void afterReturningPrint() {
        System.out.println("Logger afterReturningPrint run ......");
    }
```



在引用通用切入点表达式的时候，IDEA 会有特殊的提示：

![image-20220512201907488](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220512201907.png)

#### 4.1.2 xml抽取

```xml
<aop:config>
    <aop:aspect id="loggerAspect" ref="logger">
        <aop:pointcut id="defaultPointcut" 
                      expression="execution(public * com.linkedbear.spring.aop.a_xmlaspect.service.*.*(..))"/>
        <!-- ... -->
        <aop:after-returning method="afterReturningPrint"
                             pointcut-ref="defaultPointcut"/>
    </aop:aspect>
</aop:config>

```

注意，要引用 xml 的切入点表达式，需要使用 `pointcut-ref` 而不是 `pointcut` 属性！

### 4.2 @annotation的使用

它的使用方式就非常简单了，只需要在括号中声明注解的全限定名即可。下面咱简单演示一下。

咱还是使用 `Logger` 作为切面类，这次咱声明一个 `@Log` 注解，用于标注要打印日志的方法：

然后，切入点表达式中只需要以下声明即可：

```
@annotation(org.clxmm.spring.b_aspectj.component.Log)

```

以此法声明的切入点表达式会**搜索整个 IOC 容器中标注了 @Log 注解的所有 bean 全部增强**。

咱把这个切入点表达式代替之前的

接下来咱就在 `FinanceService` 的 `subtractMoney` 方法中标注一个 `@Log` 注解：

```java
@Log
public double subtractMoney(double money) {
    System.out.println("FinanceService 付钱 === " + money);
    return money;
}
```

重新运行 `main` 方法，发现只有 `subtractMoney` 方法有打印后置通知的日志了：

```
Logger beforePrint run ......
FinanceService 收钱 === 123.45
Logger beforePrint run ......
FinanceService 付钱 === 543.21
Logger afterPrint run ......      // 此处打印了
Logger beforePrint run ......
FinanceService 查询账户，id为abc
Logger afterReturningPrint run ......
```

