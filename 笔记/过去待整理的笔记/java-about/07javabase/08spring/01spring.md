---
title: 01 BeanFactory  ApplicationContext 的区别
--- 

## 容器与 bean

### 1) 容器接口

* BeanFactory 接口，典型功能有：
  * getBean

* ApplicationContext 接口，是 BeanFactory 的子接口。它扩展了 BeanFactory 接口的功能，如：
  * 国际化
  * 通配符方式获取一组 Resource 资源
  * 整合 Environment 环境（能通过它获取各种来源的配置信息）
  * 事件发布与监听，实现组件之间的解耦

可以看到，我们课上讲的，都是 BeanFactory 提供的基本功能，ApplicationContext 中的扩展功能都没有用到。

## 1: BeanFactory 和ApplicationContext 的区别

1. 到底什么是 BeanFactory

   - 它是 ApplicationContext 的父接口
   - 它才是 Spring 的核心容器, 主要的 ApplicationContext 实现都【组合】了它的功能，【组合】是指 ApplicationContext 的一个重要成员变量就是 BeanFactory
   
   ![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220325212747spring.png)
   
   
   
2. BeanFactory 能干点啥
   - 表面上只有 getBean
   - 实际上控制反转、基本的依赖注入、直至 Bean 的生命周期的各种功能，都由它的实现类提供
   - 例子中通过反射查看了它的成员变量 singletonObjects，内部包含了所有的单例 bean

   beanfactory的主要方法

   <img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220325212842spring.png" style="zoom:67%;" />

3. ApplicationContext 比 BeanFactory 多点啥

   * ApplicationContext 组合并扩展了 BeanFactory 的功能
   * 国际化、通配符方式获取一组 Resource 资源、整合 Environment 环境、事件发布与监听
   * 新学一种代码之间解耦途径，事件解耦



```java
public static void main(String[] args) throws IOException {
        ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);


        /** 1： BeanFactory：
         *   - BeanFactory 是ApplicationContext 的父接口
         *   - BeanFactory是spring的核心容器，主要的是ApplicationContext实现都【组合】了它的功能
         */

//        context.getBean("aaa");

        /**
         * 2:BeanFactory 的功能
         *
         */
        


        /**
         * ApplicationContext 的扩展功能
         *
         */

        // 1：国际化(MessageSource)
        String hi = context.getMessage("hi", null, Locale.CHINA);
        String hi1 = context.getMessage("hi", null, Locale.ENGLISH);
        System.out.println(hi);
        System.out.println(hi1);

        // 2 通配符方式获取一组 Resource 资源
        Resource[] resources = context.getResources("classpath:application.properties");
        for (Resource resource : resources) {
            System.out.println(resource); // class path resource [application.properties]
        }
        // classpath* 可以区jar包下查找资源路径的文件
        Resource[] resources1 = context.getResources("classpath*:META-INF/spring.factories");
        for (Resource resource : resources1) {
            System.out.println(resource);
        }

        //3 整合 Environment 环境(EnvironmentCapable)
        System.out.println(context.getEnvironment().getProperty("java_home"));
        System.out.println(context.getEnvironment().getProperty("server.port"));

        // 4.事件发布(ApplicationEventPublisher)
        // 发送事件
        context.publishEvent(new UserRegister(context));


    }

public class UserRegister extends ApplicationEvent {
    public UserRegister(Object source) {
        super(source);
    }
}
// 接收事件
@EventListener
public void add(UserRegister event) {
  System.out.println(event);

}
```

> ***注意***
>
> * ApplicationContext 中 MessageSource bean 的名字固定为 messageSource
> * 使用 SpringBoot 时，国际化文件名固定为 messages
> * 空的 messages.properties 也必须存在



## 2.容器的实现

Spring 的发展历史较为悠久，因此很多资料还在讲解它较旧的实现，这里出于怀旧的原因，把它们都列出来，供大家参考

* DefaultListableBeanFactory，是 BeanFactory 最重要的实现，像**控制反转**和**依赖注入**功能，都是它来实现
* ClassPathXmlApplicationContext，从类路径查找 XML 配置文件，创建容器（旧）
* FileSystemXmlApplicationContext，从磁盘路径查找 XML 配置文件，创建容器（旧）
* XmlWebApplicationContext，传统 SSM 整合时，基于 XML 配置文件的容器（旧）
* AnnotationConfigWebApplicationContext，传统 SSM 整合时，基于 java 配置类的容器（旧）
* AnnotationConfigApplicationContext，Spring boot 中非 web 环境容器（新）
* AnnotationConfigServletWebServerApplicationContext，Spring boot 中 servlet web 环境容器（新）
* AnnotationConfigReactiveWebServerApplicationContext，Spring boot 中 reactive web 环境容器（新）

另外要注意的是，后面这些带有 ApplicationContext 的类都是 ApplicationContext 接口的实现，但它们是**组合**了 DefaultListableBeanFactory 的功能，并非继承而来

### **DefaultListableBeanFactory**

* beanFactory 可以通过 registerBeanDefinition 注册一个 bean definition 对象
  * 我们平时使用的配置类、xml、组件扫描等方式都是生成 bean definition 对象注册到 beanFactory 当中
  * bean definition 描述了这个 bean 的创建蓝图：scope 是什么、用构造还是工厂创建、初始化销毁方法是什么，等等
* beanFactory 需要手动调用 beanFactory 后处理器对它做增强
  * 例如通过解析 @Bean、@ComponentScan 等注解，来补充一些 bean definition
* beanFactory 需要手动添加 bean 后处理器，以便对后续 bean 的创建过程提供增强
  * 例如 @Autowired，@Resource 等注解的解析都是 bean 后处理器完成的
  * bean 后处理的添加顺序会对解析结果有影响，见视频中同时加 @Autowired，@Resource 的例子
* beanFactory 需要手动调用方法来初始化单例
* beanFactory 需要额外设置才能解析 ${} 与 #{}

```java
public static void main(String[] args) {

        DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();

        // bean的定义
        AbstractBeanDefinition beanDefinition =
            BeanDefinitionBuilder.genericBeanDefinition(Config.class)
            .setScope(BeanDefinition.SCOPE_SINGLETON).getBeanDefinition();
        beanFactory.registerBeanDefinition("config", beanDefinition);
        // 此方法不会注册 @Bean注解定义的bean
        for (String beanDefinitionName : beanFactory.getBeanDefinitionNames()) {
            System.out.println(beanDefinitionName);  // config
        }

        // 给beanFactory添加一些常用的后处理器（扩展）
        AnnotationConfigUtils.registerAnnotationConfigProcessors(beanFactory);

        for (String beanDefinitionName : beanFactory.getBeanDefinitionNames()) {
            System.out.println(beanDefinitionName);
            /*
                config
                org.springframework.context.annotation.internalConfigurationAnnotationProcessor
                org.springframework.context.annotation.internalAutowiredAnnotationProcessor
                org.springframework.context.annotation.internalCommonAnnotationProcessor
                org.springframework.context.event.internalEventListenerProcessor
                org.springframework.context.event.internalEventListenerFactory
             */
        }

        Map<String, BeanFactoryPostProcessor> postProcessorMap = 
          beanFactory.getBeansOfType(BeanFactoryPostProcessor.class);
        // 调用扩展功能
        postProcessorMap.values().forEach(beanFactoryPostProcessor -> {
            beanFactoryPostProcessor.postProcessBeanFactory(beanFactory);
        });

        for (String beanDefinitionName : beanFactory.getBeanDefinitionNames()) {
            System.out.println(beanDefinitionName);
            /*
                config
                org.springframework.context.annotation.internalConfigurationAnnotationProcessor
                org.springframework.context.annotation.internalAutowiredAnnotationProcessor
                org.springframework.context.annotation.internalCommonAnnotationProcessor
                org.springframework.context.event.internalEventListenerProcessor
                org.springframework.context.event.internalEventListenerFactory
                bean1
                bean2
             */
        }

        //
//        System.out.println(beanFactory.getBean(Bean1.class).getBean2());
        /*
        构造 Bean1
        null  还没有依赖注入
         */

        //bean 的后处理器，针对bean的生命周期的各个阶段提供扩展，  如 Autowired 等等

        beanFactory.getBeansOfType(BeanPostProcessor.class).values().forEach(beanPostProcessor -> {
            beanFactory.addBeanPostProcessor(beanPostProcessor);
        });
        beanFactory.preInstantiateSingletons(); // 初始化所有的单列对象
        System.out.println(beanFactory.getBean(Bean1.class).getBean2());
        /*
        构造 Bean2
        com.github.clxmm.c02.TestBeanFactory$Bean2@8b96fde
         */


    }


    @Configuration
    static class Config {
        @Bean
        public Bean1 bean1() {
            return new Bean1();
        }

        @Bean
        public Bean2 bean2() {
            return new Bean2();
        }
    }

    static class Bean1 {
        @Autowired
        private Bean2 bean2;

        public Bean1() {
            System.out.println("构造 Bean1");
        }

        public Bean2 getBean2() {
            return bean2;
        }
    }

    static class Bean2 {
        private String name;

        public Bean2() {
            System.out.println("构造 Bean2");
        }
    }
```

