---

title: 01 GateWay 网关组件

---

## 1.Spring Cloud Gateway
 Spring cloud gateway是spring官方基于Spring 5.0和Spring Boot2.0等技术开发的网关，Spring Cloud Gateway旨在为微服务架构提供简单、有效和统一的API路由管理方式，Spring Cloud Gateway作为Spring Cloud生态系统中的网关，目标是替代Netflix Zuul，其不仅提供统一的路由方式，并且还基于Filer链的方式提供了网关基本的功能，例如：安全、监控/埋点、限流等。

## 2.Spring Cloud Gateway 核心概念
下面介绍一下Spring Cloud Gateway中几个重要的概念。

（1）路由。路由是网关最基础的部分，路由信息有一个ID、一个目的URL、一组断言和一组Filter组成。如果断言路由为真，则说明请求的URL和配置匹配

（2）断言。Java8中的断言函数。Spring Cloud Gateway中的断言函数允许开发者去定义匹配来自于http request中的任何信息，比如请求头和参数等。

（3）过滤器。一个标准的Spring webFilter。Spring cloud gateway中的filter分为两种类型的Filter，分别是Gateway Filter和Global Filter。过滤器Filter将会对请求和响应进行修改处理。

## 3,特点
* 性能强劲：是第一代网关Zuul的1.6倍
* 功能强大：内置了很多实用的功能，例如转发、监控、限流等
* 设计优雅，容易扩展

* 其实现依赖Netty与WebFlux，不是传统的Servlet编程模型，学习成本高
* 不能将其部署在Tomcat、Jetty等Servlet容器里，只能打成jar包执行
* 需要Spring Boot 2.0及以上的版本，才支持

## 4 实践
创建基础工程
1. 创建maven工程
2. pom 依赖
```xml
 <!-- 网关 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```
3.  配置文件
```yml
server:
  port: 9110
spring:
  profiles:
    active: dev
  application:
    name: infrastructure-apigateway # 服务名
```

4.  启动类
```java
@SpringBootApplication
public class InfrastructureApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(InfrastructureApiGatewayApplication.class, args);
    }
}
```

## 5.基本配置
### 1.  路由和断言
application.yml文件中添加路由配置
* -：表示数组元素，可以配置多个节点
* id：配置的唯一标识，可以和微服务同名，也可以起别的名字，区别于其他 Route。
* uri：路由指向的目的地 uri，即客户端请求最终被转发到的微服务。
* predicates：断言的作用是进行条件判断，只有断言都返回真，才会真正的执行路由。
* Path：路径形式的断言。当匹配这个路径时，断言条件成立
* /**：一个或多个层次的路径
如：
```yml
spring:
  cloud:
    gateway:
      routes:
        - id: service-deu
          uri: http://localhost:8110
          predicates:
            - Path=/user/**
```
### 2.  测试网关路由转发
访问：[http://localhost:9110/user/info](http://localhost:9110/user/info) 
    请求转发到：[http://localhost:8110/user/info](http://localhost:8110/user/info)

### 3. 通过nacos注册中心

1. 网关中添加依赖

```xml
<!--服务注册-->
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

2. 主类添加注解
   @EnableDiscoveryClient

3. 添加nacos配置

```yaml
#spring:
#  cloud:
    	nacos:
      	discovery:
        	server-addr: localhost:8848  # nacos服务地址
```



**只要nacos 满足 1 3，条件，服务就能注册到nacos注册中心 **

4. 添加gateway配置

```yaml
gateway:
      discovery:
        locator:
          enabled: true  # gateway可以发现nacos中的微服务
```

5. 修改uri配置

```yaml
#          uri: http://localhost:8110
          uri: lb://service-edu  # lb：表示在集群环境下通过负载均衡的方式调用
```

6. 匹配多个path

```yaml
- Path=/user/**, /*/edu/**
```

7. 测试

   [http://localhost:9110/user/info](http://localhost:9110/user/info)

   [http://localhost:9110/admin/edu/teacher/list](http://localhost:9110/admin/edu/teacher/list)

### 6. 跨域配置

跨域配置

```java

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.util.pattern.PathPatternParser;


@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedMethod("*");
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(new PathPatternParser());
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }

}
```

此时可以删除微服务中的跨域注解 *@CrossOrigin* 

否则会有冲突

### 7. 断言 （内置路由断言工厂）

[https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gateway-request-predicates-factories](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gateway-request-predicates-factories) 官网地址

Predicate(断言) 用于进行条件判断，只有断言都返回真，才会真正的执行路由。

SpringCloud Gateway包括许多内置的断言工厂，所有这些断言都与HTTP请求的不同属性匹配。具体如下：

1. 基于Datetime

   此类型的断言根据时间做判断，主要有三个：

   * AfterRoutePredicateFactory： 接收一个日期参数，判断请求日期是否晚于指定日期
   * BeforeRoutePredicateFactory： 接收一个日期参数，判断请求日期是否早于指定日期
   * BetweenRoutePredicateFactory： 接收两个日期参数，判断请求日期是否在指定时间段内

```yaml
- After=2019-12-31T23:59:59.789+08:00[Asia/Shanghai]
```

2. 基于远程地址

RemoteAddrRoutePredicateFactory：接收一个IP地址段，判断请求主机地址是否在地址段中

- RemoteAddr=192.168.1.1/24

3. 基于Cookie

   CookieRoutePredicateFactory：接收两个参数，cookie 名字和一个正则表达式。 判断请求cookie是否具有给定名称且值与正则表达式匹配。

- Cookie=chocolate, ch.

4. 基于Header

HeaderRoutePredicateFactory：接收两个参数，标题名称和正则表达式。 判断请求Header是否具有给定名称且值与正则表达式匹配。

- Header=X-Request-Id, \d+

5. 基于Host

   HostRoutePredicateFactory：接收一个参数，主机名模式。判断请求的Host是否满足匹配规则。

- Host=**.testhost.org

6. 基于Method请求方法

   MethodRoutePredicateFactory：接收一个参数，判断请求类型是否跟指定的类型匹配。

- Method=GET

7. 基于Path请求路径

PathRoutePredicateFactory：接收一个参数，判断请求的URI部分是否满足路径规则。

- Path=/foo/**

8. 基于Query请求参数

QueryRoutePredicateFactory ：接收两个参数，请求param和正则表达式， 判断请求参数是否具有给定名称且值与正则表达式匹配。

- Query=baz, ba.

9. 基于路由权重

WeightRoutePredicateFactory：接收一个[组名,权重]，然后对于同一个组内的路由按照权重转发

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: weight_high
        uri: https://weighthigh.org
        predicates:
        - Weight=group1, 8
      - id: weight_low
        uri: https://weightlow.org
        predicates:
        - Weight=group1, 2
```

### 8.过滤器

过滤器就是在请求的传递过程中，对请求和响应做一些修改

1. 生命周期

   客户端的请求先经过“pre”类型的filter，然后将请求转发到具体的业务服务，收到业务服务的响应之后，再经过“post”类型的filter处理，最后返回响应到客户端。

   pre： 这种过滤器在请求被路由之前调用。我们可利用这种过滤器实现参数校验、权限校验、流量监控、日志输出、协议转换等；

   post：这种过滤器在路由到达微服务以后执行。这种过滤器可用做响应内容、响应头的修改，日志的输出，流量监控等。

2. 分类

局部过滤器 GatewayFilter：作用在某一个路由上

全局过滤器 GlobalFilter：作用全部路由上

3. 局部过滤器

   3.1内置局部过滤器

   https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gatewayfilter-factories

   | 过滤器工厂                  | 作用                                                         | 参数                                                         |
   | --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
   | AddRequestHeader            | 为原始请求添加Header                                         | Header的名称及值                                             |
   | AddRequestParameter         | 为原始请求添加请求参数                                       | 参数名称及值                                                 |
   | AddResponseHeader           | 为原始响应添加Header                                         | Header的名称及值                                             |
   | DedupeResponseHeader        | 剔除响应头中重复的值                                         | 需要去重的Header名称及去重策略                               |
   | Hystrix                     | 为路由引入Hystrix的断路器保护                                | HystrixCommand 的名称                                        |
   | FallbackHeaders             | 为fallbackUri的请求头中添加具体的异常信息                    | Header的名称                                                 |
   | PreﬁxPath                   | 为原始请求路径添加前缀                                       | 前缀路径                                                     |
   | PreserveHostHeader          | 为请求添加一个preserveHostHeader=true的属性，路由过滤器会检查该属性以决定是否要发送原始的Host | 无                                                           |
   | RequestRateLimiter          | 用于对请求限流，限流算法为令牌桶                             | keyResolver、rateLimiter、statusCode、denyEmptyKey、emptyKeyStatus |
   | RedirectTo                  | 将原始请求重定向到指定的URL                                  | http状态码及重定向的url                                      |
   | RemoveHopByHopHeadersFilter | 为原始请求删除IETF组织规定的一系列Header                     | 默认就会启用，可以通过配置指定仅删除哪些Header               |
   | RemoveRequestHeader         | 为原始请求删除某个Header                                     | Header名称                                                   |
   | RemoveResponseHeader        | 为原始响应删除某个Header                                     | Header名称                                                   |
   | RewritePath                 | 重写原始的请求路径                                           | 原始路径正则表达式以及重写后路径的正则表达式                 |
   | RewriteResponseHeader       | 重写原始响应中的某个Header                                   | Header名称，值的正则表达式，重写后的值                       |
   | SaveSession                 | 在转发请求之前，强制执行WebSession::save 操作                | 无                                                           |
   | secureHeaders               | 为原始响应添加一系列起安全作用的响应头                       | 无，支持修改这些安全响应头的值                               |
   | SetPath                     | 修改原始的请求路径                                           | 修改后的路径                                                 |
   | SetResponseHeader           | 修改原始响应中某个Header的值                                 | Header名称，修改后的值                                       |
   | SetStatus                   | 修改原始响应的状态码                                         | HTTP 状态码，可以是数字，也可以是字符串                      |
   | StripPreﬁx                  | 用于截断原始请求的路径                                       | 使用数字表示要截断的路径的数量                               |
   | Retry                       | 针对不同的响应进行重试                                       | retries、statuses、methods、series                           |
   | RequestSize                 | 设置允许接收最大请求包的大 小。如果请求包大小超过设置的值，则返回 413 Payload TooLarge | 请求包大小，单位为字节，默认值为5M                           |
   | ModifyRequestBody           | 在转发请求之前修改原始请求体内容                             | 修改后的请求体内容                                           |
   | ModifyResponseBody          | 修改原始响应体的内容                                         | 修改后的响应体内容                                           |

   ```yaml
   - id: service-deu
     #          uri: http://localhost:8110
       uri: lb://service-edu  # lb：表示在集群环境下通过负载均衡的方式调用
       predicates:
       - Path=/user/**,/*/edu/**  #
       filters:
       - SetStatus=220 # 修改返回状态码
   ```

   4. 全局过滤器

      内置全局过滤器

      https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#global-filters

      ![01gateway.png](/springcloud/01gatway.png)

      内置全局过滤器的使用举例：负载均衡过滤器

      lb://service-edu

      自定义全局过滤器

      定义一个Filter实现 GlobalFilter 和 Ordered接口

   代码：

   ```java
   package org.clxmm.infrastructure.apigateway.config;
   
   import com.google.gson.JsonObject;
   import org.clxmm.common.base.result.util.JwtUtils;
   import org.springframework.cloud.gateway.filter.GatewayFilterChain;
   import org.springframework.cloud.gateway.filter.GlobalFilter;
   import org.springframework.core.Ordered;
   import org.springframework.core.io.buffer.DataBuffer;
   import org.springframework.http.server.reactive.ServerHttpResponse;
   import org.springframework.http.server.reactive.ServerHttpRequest;
   import org.springframework.stereotype.Component;
   import org.springframework.util.AntPathMatcher;
   import org.springframework.web.server.ServerWebExchange;
   import reactor.core.publisher.Mono;
   
   import java.nio.charset.StandardCharsets;
   import java.util.List;
   
   /**
    * @author clxmm
    * @version 1.0
    * @date 2021/2/27 1:39 下午
    */
   @Component
   public class AuthGlobalFilter  implements GlobalFilter, Ordered {
   
       @Override
       public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
           ServerHttpRequest request = exchange.getRequest();
           String path = request.getURI().getPath();
           //校验用户必须登录
           AntPathMatcher antPathMatcher = new AntPathMatcher();
           if(antPathMatcher.matc("/api/**/auth/**", path)) {
               List<String> tokenList = request.getHeaders().get("token");
   
               //没有token
               if(null == tokenList) {
                   ServerHttpResponse response = exchange.getResponse();
                   return out(response);
               }
   
   
               //token校验失败
               Boolean isCheck = JwtUtils.checkJwtTToken(tokenList.get(0));
               if(!isCheck) {
                   ServerHttpResponse response = exchange.getResponse();
                   return out(response);
               }
   
           }
   
   
           return chain.filter(exchange);    }
   
       // 定义当前过滤器的优先级，值越小，优先级越高
       @Override
       public int getOrder() {
           return 0;
       }
   
   
       // 使用webFlux输出请求信息
       private Mono<Void> out(ServerHttpResponse response) {
           JsonObject message = new JsonObject();
           message.addProperty("success", false);
           message.addProperty("code", 28004);
           message.addProperty("data", "");
           message.addProperty("message", "鉴权失败");
           byte[] bytes = message.toString().getBytes(StandardCharsets.UTF_8);
           DataBuffer buffer = response.bufferFactory().wrap(bytes);
           //指定编码，否则在浏览器中会中文乱码
           response.getHeaders().add("Content-Type", "application/json;charset=UTF-8");
           //输出http响应
           return response.writeWith(Mono.just(buffer));
       }
   
   }
   
   ```

   