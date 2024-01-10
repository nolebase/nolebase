---
title: webflux 前置一
---

JDK8 中引入了 Lambda，为了学习 WebFlux，我们还是先来回顾一下 Lambda 表达式的几种写法。

## 1.Lambda 表达式的四种写法

先来说说，如果要用 Lambda，必须是只有一个需要强制实现方法的接口，我们可以使用 **@FunctionalInterface** 注解去标记该接口：

```java
@FunctionalInterface
public interface BiFunction<T, U, R> {

    /**
     * Applies this function to the given arguments.
     *
     * @param t the first function argument
     * @param u the second function argument
     * @return the function result
     */
    R apply(T t, U u);

    /**
     * Returns a composed function that first applies this function to
     * its input, and then applies the {@code after} function to the result.
     * If evaluation of either function throws an exception, it is relayed to
     * the caller of the composed function.
     *
     * @param <V> the type of output of the {@code after} function, and of the
     *           composed function
     * @param after the function to apply after this function is applied
     * @return a composed function that first applies this function and then
     * applies the {@code after} function
     * @throws NullPointerException if after is null
     */
    default <V> BiFunction<T, U, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t, U u) -> after.apply(apply(t, u));
    }
}
```
此时如果该接口中有多个空方法，编译期间就会报错。

现在我们建议尽量将一个接口设计的小一些，这样也满足单一职责原则。

不过 JDK8 中引入了 default 方法，就是自带默认实现的那种，自带默认实现的方法可以有多个，这个并不影响 Lambda，并且 **@FunctionalInterface** 注解也不会去检查默认方法的数量。

### 1.1 单个参数的
如果只是一个参数，那么直接写参数即可，例如如下代码：

```java
public class flux_test01 {


    public static void main(String[] args) {
        ICalculator ic = i -> i * i;
        int square = ic.square(2);
        System.out.println("square: "+ square);
    }

}

interface ICalculator {
    int square(int i);
}
```
当函数只有一个参数的时候，直接写即可，不需要添加 ()。

### 1.2 多个参数
多个参数的话，就需要写上 () 了，以 Spring Security 中登录成功的回调为例
```java
.defaultLogoutSuccessHandlerFor((req,resp,auth)->{
    resp.setContentType("application/json;charset=utf-8");
    Map<String, Object> result = new HashMap<>();
    result.put("status", 200);
    result.put("msg", "使用 logout1 注销成功!");
    ObjectMapper om = new ObjectMapper();
    String s = om.writeValueAsString(result);
    resp.getWriter().write(s);
},new AntPathRequestMatcher("/logout1","GET"))
.defaultLogoutSuccessHandlerFor((req,resp,auth)->{
    resp.setContentType("application/json;charset=utf-8");
    Map<String, Object> result = new HashMap<>();
    result.put("status", 200);
    result.put("msg", "使用 logout2 注销成功!");
    ObjectMapper om = new ObjectMapper();
    String s = om.writeValueAsString(result);
    resp.getWriter().write(s);
},new AntPathRequestMatcher("/logout2","POST"))
.and()
.csrf().disable();

```

这种情况，方法有多个参数，此时使用 Lambda 表达式就需要加上 ()。

### 1.3 要写参数类型的
正常来说用 Lambda 时候不需要写上参数类型，但是如果你需要写，就要加上 ()，还是上面那个例子，如下：
```java
interface ICalculator{
    int square(int i);
}
public class LambdaDemo01 {
    public static void main(String[] args) {
        ICalculator ic = (int i) -> i * i;
        int square = ic.square(5);
        System.out.println("square = " + square);
    }
}

```
### 1.4 方法体不止一行的

如果方法体不止一行，需要用上 {}，如果方法体只有一行，则不需要 {}，参考上面 2、3。

## 2.函数接口
JDK8 中自带了函数式接口，使用起来也非常方便。


### 2.1基本应用
假设我有一个打招呼的接口 SayHello，SayHello 接口中只有一个 sayHello 方法，然后在 User 类中调用该接口对应的方法，最终用法如下：
```java
public class flux_test02 {


    public static void main(String[] args) {
        User user = new User();
        user.setUsername("clxmm");
        String say = user.say((username) -> "hello:" + username);
        System.out.println(say);
    }

}

@FunctionalInterface
interface SayHello {
    String sayHello(String name);
}

class User {
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String say(SayHello sayHello) {
        return sayHello.sayHello(this.username);
    }
}
```

分析 main 方法中的调用过程之后，我们发现，在调用时最核心的是如下一行代码：

```java
(username) -> "hello " + username
```
在这段代码中，我们只关心方法的输入和输出，其他的都不是我所考虑的，为了一个简单的输入输出，我还要额外定义一个接口，这显然不太划算。

JDK8 中提供了函数接口，可以帮助我们简化上面的接口定义。如下：

```java
public class flux_test03 {

    public static void main(String[] args) {
        User2 user2 = new User2();
        user2.setUsername("clx");
        String say = user2.say((username) -> "hello:" + username);
        System.out.println(say);


    }
}


class User2 {
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String say(Function<String, String> sayHello) {
        return sayHello.apply(this.username);
    }
}
```
可以用 **Function<String,String>** 代替我们前面的接口定义，这里有两个泛型，第一个泛型表示接口输入的参数类型，第二个泛型表示接口输出的参数类型，而且大家注意，我们最终 main 方法中的调用方式是不变的。有了 Function 函数之后，以后我们就不需要定义一些简单的接口了。

而且 Function 函数还支持链式操作，如下：

```java
public class flux_test04 {


    public static void main(String[] args) {
        User2 user2 = new User2();
        user2.setUsername("clxmm");
        Function<String,String> func = (username) -> "hello:" + username;
        String say = user2.say(func.andThen(s -> "hi " + s));
        System.out.println(say);
    }
}
```

输出： hi hello:clxmm
 
 ### 2.2 其他函数接口

|   接口   | 输入参数     |    返回类型  |   说明   |
| ---- | ---- | ---- | ---- |
|   UnaryOperator   |  T    |  T    |   一元函数，输入输出类型相同   |
|   Predicate   |   T   |    boolean  |   断言   |
|   Consumer   |     T |    	/  |   消费一个数据，只有输入没有输出   |
|   Function<T,R>	   |   T   |   R   |  输入 T 返回 R，有输入也有输出    |
|   Supplier	   |   /   |   T   |  提供一个数据，没有输入只有输出    |
|   BiFunction<T,U,R>   |  (T,U)    |  R    |  两个输入参数    |
|   BiPredicate<L, R>   |  (L,R)    |   boolean   | 两个输入参数     |
|   BiConsumer<T, U>   |   (T,U)  |  void    |  两个输入参数    |
|   BinaryOperator	   |   (T,T)   |  T    |   二元函数，输入输出类型相同   |

接下来我们来看看这些函数接口。

#### 2.2.1 UnaryOperator
当输入输出类型相同时，可以使用 UnaryOperator 函数接口，
```java
public class flux_test05 {

    public static void main(String[] args) {
        User5 user5 = new User5();
        user5.setUsername("clx");
        UnaryOperator<String> func = (username) -> "helloo " + username;
        String say = user5.say(func);
        System.out.println(say);
    }
}


class User5 {
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String say(UnaryOperator<String> sayHello) {
        return sayHello.apply(this.username);
    }
}
```

#### 2.2.2 Predicate
Predicate 输入一个 T 类型的参数，输出一个 boolean 类型的值。

举一个简单的例子，例如如下代码，我们定义一个 List 集合中存放着用户姓名，现在要过滤出所有姓张的用户，代码如下：

```java
public class flux_test06 {

    public static void main(String[] args) {
        List<String> names = Arrays.asList("张三", "里斯", "张五");

        List<String> list = names.stream().filter(s -> s.startsWith("张")).collect(Collectors.toList());
        list.stream().forEach(System.out::println);
    }
}
```   
filter 中传入的就是一个 Predicate 函数接口，这个接口接收 String 类型的数据，返回一个 boolean。

**注意**
```
一些常用类型的函数接口，JDK 中直接提供了相关的类供我们使用，例如 Predicate<Integer> 
可以用 IntPredicate 代替；Consumer<Integer> 可以用 IntConsumer 代替。
```
#### 2.2.3 Consumer
看名字就知道，这个是消费数据，只有输入没有输出。

例如集合的遍历就可以使用 Consumer 函数接口。

```java
   public static void main(String[] args) {
        List<String> names = Arrays.asList("张三", "里斯", "张五");
        // void forEach(Consumer<? super T> action);
        names.stream().forEach(s -> System.out.println(s));
    }
```

#### 2.2.4 Supplier

Supplier 刚好和 Consumer 相反，它只有输出没有输入。有的时候我们的工厂方法没有输入只有输出，这个时候就可以考虑使用 Supplier（如果有输入参数，则可以考虑使用 Function 函数接口）。

```java
Supplier<Connection> supplier = ()->{
    Connection con = null;
    try {
        con = DriverManager.getConnection("", "", "");
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return con;
};
Connection connection = supplier.get();

```