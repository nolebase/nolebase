---
title: 11security
---

## 1.权限管理中的相关概念

### 1.主体

英文单词:principal

使用系统的用户或设备或从其他系统远程登录的用户等等。简单说就是谁使用系统谁就是主体。

### 2认证

英文单词:authentication

权限管理系统确认一个主体的身份，允许主体进入系统。简单说就是“主体”证明自己是谁。

  笼统的认为就是以前所做的登录操作。

### 3授权

英文单词:authorization

将操作系统的“权力”“授予”“主体”，这样主体就具备了操作系统中特定功能的能力。

所以简单来说，授权就是给用户分配权限。

## 2.SpringSecurity基本原理

SpringSecurity 本质是一个过滤器链:

从启动是可以获取到过滤器链:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220411205536sc.png)

### 1FilterSecurityInterceptor,

是一个方法级的权限过滤器, 基本位于过滤链的最底部。

![image-20220414201502887](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220414201503sc.png)

```java

	@Override
	public Class<?> getSecureObjectClass() {
		return FilterInvocation.class;
	}

	public void invoke(FilterInvocation filterInvocation) throws IOException, ServletException {
		if (isApplied(filterInvocation) && this.observeOncePerRequest) {
			// filter already applied to this request and user wants us to observe
			// once-per-request handling, so don't re-do security checking
			filterInvocation.getChain().doFilter(filterInvocation.getRequest(), filterInvocation.getResponse());
			return;
		}
		// first time this request being called, so perform security checking
		if (filterInvocation.getRequest() != null && this.observeOncePerRequest) {
			filterInvocation.getRequest().setAttribute(FILTER_APPLIED, Boolean.TRUE);
		}
		InterceptorStatusToken token = super.beforeInvocation(filterInvocation);
		try {
			filterInvocation.getChain().doFilter(filterInvocation.getRequest(), filterInvocation.getResponse());
		}
		finally {
			super.finallyInvocation(token);
		}
		super.afterInvocation(token, null);
	}
```

super.beforeInvocation(fi) 表示查看之前的 filter 是否通过。

fi.getChain().doFilter(fi.getRequest(), fi.getResponse());表示真正的调用后台的服务。

### 2.ExceptionTranslationFilter:

是个异常过滤器，用来处理在认证授权过程中抛出的异常

```java
	private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		try {
			chain.doFilter(request, response);
		}
		catch (IOException ex) {
			throw ex;
		}
		catch (Exception ex) {
			// Try to extract a SpringSecurityException from the stacktrace
			Throwable[] causeChain = this.throwableAnalyzer.determineCauseChain(ex);
			RuntimeException securityException = (AuthenticationException) this.throwableAnalyzer
					.getFirstThrowableOfType(AuthenticationException.class, causeChain);
			if (securityException == null) {
				securityException = (AccessDeniedException) this.throwableAnalyzer
						.getFirstThrowableOfType(AccessDeniedException.class, causeChain);
			}
			if (securityException == null) {
				rethrow(ex);
			}
			if (response.isCommitted()) {
				throw new ServletException("Unable to handle the Spring Security Exception "
						+ "because the response is already committed.", ex);
			}
			handleSpringSecurityException(request, response, chain, securityException);
		}
	}
```

### 3.UsernamePasswordAuthenticationFilter

对/login 的 POST 请求做拦截，校验表单中用户 名，密码。

```java
@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		if (this.postOnly && !request.getMethod().equals("POST")) {
			throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
		}
		String username = obtainUsername(request);
		username = (username != null) ? username : "";
		username = username.trim();
		String password = obtainPassword(request);
		password = (password != null) ? password : "";
		UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
		// Allow subclasses to set the "details" property
		setDetails(request, authRequest);
		return this.getAuthenticationManager().authenticate(authRequest);
	}
```

### 4.过滤器是如何加载的

1.使用springsecurity配置过滤器

* DelegatingFilterProxy

```java
@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		// Lazily initialize the delegate if necessary.
		Filter delegateToUse = this.delegate;
		if (delegateToUse == null) {
			synchronized (this.delegateMonitor) {
				delegateToUse = this.delegate;
				if (delegateToUse == null) {
					WebApplicationContext wac = findWebApplicationContext();
					if (wac == null) {
						throw new IllegalStateException("No WebApplicationContext found: " +
								"no ContextLoaderListener or DispatcherServlet registered?");
					}
					delegateToUse = initDelegate(wac);
				}
				this.delegate = delegateToUse;
			}
		}

		// Let the delegate perform the actual doFilter operation.
		invokeDelegate(delegateToUse, request, response, filterChain);
	}
```



initDelegate 

```java
	protected Filter initDelegate(WebApplicationContext wac) throws ServletException {
		String targetBeanName = getTargetBeanName();
		Assert.state(targetBeanName != null, "No target bean name set");
		Filter delegate = wac.getBean(targetBeanName, Filter.class);
		if (isTargetFilterLifecycle()) {
			delegate.init(getFilterConfig());
		}
		return delegate;
	}
```

* FilterChainProxy

```java
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		boolean clearContext = request.getAttribute(FILTER_APPLIED) == null;
		if (!clearContext) {
			doFilterInternal(request, response, chain);
			return;
		}
		try {
			request.setAttribute(FILTER_APPLIED, Boolean.TRUE);
			doFilterInternal(request, response, chain);
		}
		catch (RequestRejectedException ex) {
			this.requestRejectedHandler.handle((HttpServletRequest) request, (HttpServletResponse) response, ex);
		}
		finally {
			SecurityContextHolder.clearContext();
			request.removeAttribute(FILTER_APPLIED);
		}
	}
```

`doFilterInternal`

```java
	private void doFilterInternal(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		FirewalledRequest firewallRequest = this.firewall.getFirewalledRequest((HttpServletRequest) request);
		HttpServletResponse firewallResponse = this.firewall.getFirewalledResponse((HttpServletResponse) response);
		List<Filter> filters = getFilters(firewallRequest);
		if (filters == null || filters.size() == 0) {
			if (logger.isTraceEnabled()) {
				logger.trace(LogMessage.of(() -> "No security for " + requestLine(firewallRequest)));
			}
			firewallRequest.reset();
			chain.doFilter(firewallRequest, firewallResponse);
			return;
		}
		if (logger.isDebugEnabled()) {
			logger.debug(LogMessage.of(() -> "Securing " + requestLine(firewallRequest)));
		}
		VirtualFilterChain virtualFilterChain = new VirtualFilterChain(firewallRequest, chain, filters);
		virtualFilterChain.doFilter(firewallRequest, firewallResponse);
	}
```

`getFilters`

```java
	private List<Filter> getFilters(HttpServletRequest request) {
		int count = 0;
		for (SecurityFilterChain chain : this.filterChains) {
			if (logger.isTraceEnabled()) {
				logger.trace(LogMessage.format("Trying to match request against %s (%d/%d)", chain, ++count,
						this.filterChains.size()));
			}
			if (chain.matches(request)) {
				return chain.getFilters();
			}
		}
		return null;
	}
```

`SecurityFilterChain`

```java
public interface SecurityFilterChain {

	boolean matches(HttpServletRequest request);

	List<Filter> getFilters();

}
```

### 5.登录的相关配置

```java
@Override
protected void configure(HttpSecurity http) throws Exception { // 配置认证
http.formLogin()
.loginPage("/index") // 配置哪个 url 为登录页面 
.loginProcessingUrl("/login") // 设置哪个是登录的 url。 
.successForwardUrl("/success") // 登录成功之后跳转到哪个 url 
.failureForwardUrl("/fail");// 登录失败之后跳转到哪个 url
http.authorizeRequests()
.antMatchers("/layui/**","/index") //表示配置请求路径
.permitAll() // 指定 URL 无需保护。 
.anyRequest() // 其他请求 
.authenticated(); //需要认证
// 关闭 csrf
http.csrf().disable(); }
```



## 3.基于角色或权限进行访问控制

### 1 hasAuthority 方法

如果当前的主体具有指定的权限，则返回 true,否则返回 false

- 配置访问地址需要的权限

  ```java
   @Override
      protected void configure(HttpSecurity http) throws Exception {
  
          http
                  // 关闭csrf
                  .csrf().disable()
                  // 不通过session获取SecurityContext
                  .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                  .and()
                  .authorizeRequests()
                  // 允许匿名访问的接口
                  .antMatchers("/user/login").permitAll()
                  // 只有拥有admins权限才可以访问这个路径
                  .antMatchers("/test/index").hasAnyAuthority("admins")
                  .anyRequest().authenticated();
                  }
  ```

  

- 获取用户对象中取到对应的权限

```java
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();

        queryWrapper.eq(User::getUserName, username);

        User user = userMapper.selectOne(queryWrapper);

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }


        LoginUser loginUser = new LoginUser();
        // 手动设置admins权限
        List<GrantedAuthority> admins = AuthorityUtils.createAuthorityList("admins");
        loginUser.setAuthorities(admins);

        loginUser.setUser(user);
        return loginUser;
    }
```

### 2**hasAnyAuthority** 方法

如果当前的主体有任何提供的角色(给定的作为一个逗号分隔的字符串列表)的话，返回true.

### 3**hasRole** 方法

如果用户具备给定角色就允许访问,否则出现 403。 如果当前主体具有指定的角色，则返回 true。

注意配置文件中不需要添加”ROLE_“，因为上述的底层代码会自动添加与之进行匹配。

```java
	private final String rolePrefix;


	public ExpressionUrlAuthorizationConfigurer(ApplicationContext context) {
		String[] grantedAuthorityDefaultsBeanNames = context.getBeanNamesForType(GrantedAuthorityDefaults.class);
		if (grantedAuthorityDefaultsBeanNames.length == 1) {
			GrantedAuthorityDefaults grantedAuthorityDefaults = context.getBean(grantedAuthorityDefaultsBeanNames[0],
					GrantedAuthorityDefaults.class);
			this.rolePrefix = grantedAuthorityDefaults.getRolePrefix();
		}
		else {
			this.rolePrefix = "ROLE_";
		}
		this.REGISTRY = new ExpressionInterceptUrlRegistry(context);
	}

public ExpressionInterceptUrlRegistry hasRole(String role) {
			return access(ExpressionUrlAuthorizationConfigurer
					.hasRole(ExpressionUrlAuthorizationConfigurer.this.rolePrefix, role));
		}

	public ExpressionInterceptUrlRegistry hasAnyRole(String... roles) {
			return access(ExpressionUrlAuthorizationConfigurer
					.hasAnyRole(ExpressionUrlAuthorizationConfigurer.this.rolePrefix, roles));
		}
```

### 4hasAnyRole

表示用户具备任何一个条件都可以访问。



## 4基于数据库实现权限认证





## 5注解使用

### 1**@Secured**

判断是否具有角色，另外需要注意的是这里匹配的字符串需要添加前缀“ROLE_“。 使用注解先要开启注解功能!

**@EnableGlobalMethodSecurity(securedEnabled=true)**

判断是否具有角色，另外需要注意的是这里匹配的字符串需要添加前缀“ROLE_“。

在控制器方法上添加注解

```java
    @GetMapping("/testSecured")
    @Secured({"ROLE_admins"})
    public String helloSecured() {
        return "hello secured";
    }


// 拥有的角色
  List<GrantedAuthority> admins = AuthorityUtils.createAuthorityList("admins","ROLE_admins");
        loginUser.setAuthorities(admins);
```

### 2**@PreAuthorize**

先开启注解功能:

**@EnableGlobalMethodSecurity(prePostEnabled = true)**

@PreAuthorize:注解适合进入方法前的权限验证， @PreAuthorize 可以将登录用户的 roles/permissions 参数传到方法中。

```
 @PreAuthorize("hasAnyAuthority('admins')")
 
```

### 3**@PostAuthorize**

@EnableGlobalMethodSecurity(prePostEnabled = true)

@PostAuthorize 注解使用并不多，在方法执行后再进行权限验证，适合验证带有返回值 的权限.

```
@PostAuthorize("hasAnyAuthority('admins')")
```

### 4**@PostFilter**

@PostFilter :权限验证之后对数据进行过滤 留下用户名是 admin1 的数据 表达式中的 filterObject 引用的是方法返回值 List 中的某一个元素

```java
@PreAuthorize("hasRole('ROLE_管理员')") 
@PostFilter("filterObject.username == 'admin1'")
```

### 5**@PreFilter**

@PreFilter: 进入控制器之前对数据进行过滤

```java
@PreFilter(value = "filterObject.id%2==0")
```



## 5CSRF

 

跨站请求伪造(英语:Cross-site request forgery)，也被称为 **one-click-attack** 或者 **session riding**，通常缩写为 **CSRF** 或者 **XSRF**， 是一种挟制用户在当前已

登录的 Web 应用程序上执行非本意的操作的攻击方法。跟跨网站脚本(XSS)相比，**XSS**

利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

跨站请求攻击，简单地说，是攻击者通过一些技术手段欺骗用户的浏览器去访问一个自己曾经认证过的网站并运行一些操作(如发邮件，发消息，甚至财产操作如转账和购买商品)。由于浏览器曾经认证过，所以被访问的网站会认为是真正的用户操作而去运行。这利用了 web 中用户身份验证的一个漏洞:简单的身份验证只能保证请求发自某个用户的浏览器，却不能保证请求本身是用户自愿发出的。

从 Spring Security 4.0 开始，默认情况下会启用 CSRF 保护，以防止 CSRF 攻击应用程序，Spring Security CSRF 会针对 PATCH，POST，PUT 和 DELETE 方法进行防护。

