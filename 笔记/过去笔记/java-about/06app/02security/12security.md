---
title: 12security 微服务权限
---

## 1.微服务

### 1、微服务优势

-  (1)微服务每个模块就相当于一个单独的项目，代码量明显减少，遇到问题也相对来说比 较好解决
-  微服务每个模块都可以使用不同的存储方式(比如有的用 redis，有的用 mysql等)，数据库也是单个模块对应自己的数据库。
- 微服务每个模块都可以使用不同的开发技术，开发模式更灵活。

### 2、微服务本质

- 微服务，关键其实不仅仅是微服务本身，而是系统要提供一套基础的架构，这种架构

  使得微服务可以独立的部署、运行、升级，不仅如此，这个系统架构还让微服务与微服务 之间在结构上“松耦合”，而在功能上则表现为一个统一的整体。这种所谓的“统一的整

  体”表现出来的是统一风格的界面，统一的权限管理，统一的安全策略，统一的上线过

  程，统一的日志和审计方法，统一的调度方式，统一的访问入口等等

- 微服务的目的是有效的拆分应用，实现敏捷开发和部署

## 2.微服务认证与授权实现思路

- 如果是基于 Session，那么 Spring-security 会对 cookie 里的 sessionid 进行解析，找 到服务器存储的 session 信息，然后判断当前用户是否符合请求的要求。
- 如果是 token，则是解析出 token，然后将当前请求加入到 Spring-security 管理的权限 信息中去

![image-20220417115643497](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220417115643sc.png)

### 2、权限模型

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220417120933sc.png)



### 3.项目结构

![image-20220417130642463](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220417130642sc.png)


```
-- 11security-cloud. : 父工程pom文件，定义依赖版本
-- common
---- service-base。  工具类 md5....
---- spring-security  SpringSecurity相关配置
-- infrastructure
---- api-gateway。配置网关
-- service。
---- service-acl。权限管理功能代码
```

## 4.基本流程

Spring Security 采取过滤链实现认证与授权，只有当前过滤器通过，才能进入下一个过滤器:

![image-20220419195959794](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220419195959sc.png)

绿色部分是认证过滤器，需要我们自己配置，可以配置多个认证过滤器。认证过滤器可以使用 Spring Security 提供的认证过滤器，也可以自定义过滤器(例如:短信验证)。认证过滤器要在 configure(HttpSecurity http)方法中配置，没有配置不生效。下面会重点介绍以下三个过滤器:

UsernamePasswordAuthenticationFilter 过滤器:该过滤器会拦截前端提交的 POST 方式的登录表单请求，并进行身份认证。

ExceptionTranslationFilter 过滤器:该过滤器不需要我们配置，对于前端提交的请求会直接放行，捕获后续抛出的异常并进行处理(例如:权限访问限制)。

FilterSecurityInterceptor 过滤器:该过滤器是过滤器链的最后一个过滤器，根据资源权限配置来判断当前请求是否有权限访问对应的资源。如果访问受限会抛出相关异常，并由 ExceptionTranslationFilter 过滤器进行捕获和处理。





### 1.认证流程

认证流程是在 UsernamePasswordAuthenticationFilter 过滤器中处理的，具体流程如下

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220419200139sc.png" alt="image-20220419200139681" style="zoom:67%;" />

### UsernamePasswordAuthenticationFilter 源码

当前端提交的是一个 POST 方式的登录表单请求，就会被该过滤器拦截，并进行身份认证。该过滤器的 doFilter() 方法实现在其抽象父类

AbstractAuthenticationProcessingFilter 中，查看相关源码:

AbstractAuthenticationProcessingFilter

```java
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest)req;
        HttpServletResponse response = (HttpServletResponse)res;
      // 	过滤的方法，判断提交方式是否post提交
        if (!this.requiresAuthentication(request, response)) { 	
            chain.doFilter(request, response);
        } else {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Request is to process authentication");
            }
						// 2。Authentication 存储用户信息，
            Authentication authResult;
            try {
              	// 调用子类UsernamePasswordAuthenticationFilter重写的方法进行身份认证，
              	// 返回认证对象的信息
                authResult = this.attemptAuthentication(request, response);
                if (authResult == null) {
                    return;
                }
								// 3.session策略的处理
                this.sessionStrategy.onAuthentication(authResult, request, response);
            } catch (InternalAuthenticationServiceException var8) {
                this.logger.error("An internal error occurred while trying to authenticate the user.", var8);
                //  4 认证失败异常处理
              	this.unsuccessfulAuthentication(request, response, var8);
                return;
            } catch (AuthenticationException var9) {
                this.unsuccessfulAuthentication(request, response, var9);
                return;
            }
						// 4.2 认证成功的处理
            if (this.continueChainBeforeSuccessfulAuthentication) {
                chain.doFilter(request, response);
            }

            this.successfulAuthentication(request, response, chain, authResult);
        }
    }

```

