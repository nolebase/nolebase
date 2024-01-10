---
title: 04rabbitmq
---

## 5. RabbitMQ 消息有效期

RabbitMQ 中的消息长期未被消费会过期吗？

### 5.1 默认情况

默认情况下，消息是不会过期的，也就是我们平日里在消息发送时，如果不设置任何消息过期的相关参数，那么消息是不会过期的，即使消息没被消费掉，也会一直存储在队列中。

### 5.2 TTL

TTL（Time-To-Live），消息存活的时间，即消息的有效期。如果我们希望消息能够有一个存活时间，那么我们可以通过设置 TTL 来实现这一需求。如果消息的存活时间超过了 TTL 并且还没有被消息，此时消息就会变成`死信`，关于`死信`以及`死信队列`，松哥后面再和大家介绍。

TTL 的设置有两种不同的方式：

1. 在声明队列的时候，我们可以在队列属性中设置消息的有效期，这样所有进入该队列的消息都会有一个相同的有效期。
2. 在发送消息的时候设置消息的有效期，这样不同的消息就具有不同的有效期。

那如果两个都设置了呢？

**以时间短的为准。**

当我们设置了消息有效期后，消息过期了就会被从队列中删除了（进入到死信队列，后文一样，不再标注），但是两种方式对应的删除时机有一些差异：

1. 对于第一种方式，当消息队列设置过期时间的时候，那么消息过期了就会被删除，因为消息进入 RabbitMQ 后是存在一个消息队列中，队列的头部是最早要过期的消息，所以 RabbitMQ 只需要一个定时任务，从头部开始扫描是否有过期消息，有的话就直接删除。
2. 对于第二种方式，当消息过期后并不会立马被删除，而是当消息要投递给消费者的时候才会去删除，因为第二种方式，每条消息的过期时间都不一样，想要知道哪条消息过期，必须要遍历队列中的所有消息才能实现，当消息比较多时这样就比较耗费性能，因此对于第二种方式，当消息要投递给消费者的时候才去删除。

介绍完 TTL 之后，接下来我们来看看具体用法。

#### 5.2.1 单条消息过期

首先创建一个 Spring Boot 项目，引入 Web 和 RabbitMQ 依赖，如下：

```properties

spring.rabbitmq.host=127.0.0.1
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
spring.rabbitmq.virtual-host=/
```

接下来稍微配置一下消息队列：

```java
package org.clxmm.messagettl;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitConfig {


    static final String CLXMM_MSG_DELAY_QUEUE_NAME = "clxmm_msg_delay_queue_name";
    static final String CLXMM_MSG_DELAY_EXCHANGE_NAME = "clxmm_msg_delay_exchange_name";


    @Bean
    Queue msgQueue() {
        return new Queue(CLXMM_MSG_DELAY_QUEUE_NAME, true, false, false);
    }

    @Bean
    DirectExchange msgDirectExchange() {
        return new DirectExchange(CLXMM_MSG_DELAY_EXCHANGE_NAME, true, false);
    }

    @Bean
    Binding msgBinding() {
        return BindingBuilder.bind(msgQueue())
                .to(msgDirectExchange())
                .with(CLXMM_MSG_DELAY_QUEUE_NAME);
    }

}

```

1. 首先配置一个消息队列，new 一个 Queue：第一个参数是消息队列的名字；第二个参数表示消息是否持久化；第三个参数表示消息队列是否排他，一般我们都是设置为 false，即不排他；第四个参数表示如果该队列没有任何订阅的消费者的话，该队列会被自动删除，一般适用于临时队列。
2. 配置一个 DirectExchange 交换机。
3. 将交换机和队列绑定到一起。

> 关于排他性，如果设置为 true，则该消息队列只有创建它的 Connection 才能访问，其他的 Connection 都不能访问该消息队列，如果试图在不同的连接中重新声明或者访问排他性队列，那么系统会报一个资源被锁定的错误。另一方面，对于排他性队列而言，当连接断掉的时候，该消息队列也会自动删除（无论该队列是否被声明为持久性队列都会被删除）。

接下来提供一个消息发送接口，如下：

```java

    @Autowired
    RabbitTemplate rabbitTemplate;


    @GetMapping("/send")
    public void hello() {
        Message build = MessageBuilder.withBody("hello world".getBytes()).setExpiration("10000").build();
        rabbitTemplate.send(RabbitConfig.CLXMM_MSG_DELAY_EXCHANGE_NAME, RabbitConfig.CLXMM_MSG_DELAY_QUEUE_NAME, build);
    }
```

在创建 Message 对象的时候我们可以设置消息的过期时间，这里设置消息的过期时间为 10 秒。

![image-20220410191755840](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410191755mq.png)

单条消息设置过期时间，就是在消息发送的时候设置一下消息有效期即可。

#### 5.2.2 队列消息过期

给队列设置消息过期时间，方式如下：

```java
   @Bean
    Queue msgQueue() {
        Map<String, Object> arguments = new HashMap<>();
        // ttl 设置过期时间  10s 后过期
        arguments.put("x-message-ttl", 10000);
        return new Queue(CLXMM_QUEUE_DELAY_QUEUE_NAME, true, false, false, arguments);
    }
```



```java

    @GetMapping("/send")
    public void hello() {

        rabbitTemplate.convertAndSend(RabbitConfig.CLXMM_QUEUE_DELAY_EXCHANGE_NAME,
                RabbitConfig.CLXMM_QUEUE_DELAY_QUEUE_NAME, "hello");
    }
```



OK，启动项目，发送一条消息进行测试。查看 RabbitMQ 管理页面，如下：

![image-20220410192437177](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410192437mq.png)

可以看到，消息队列的 Features 属性为 D 和 TTL，D 表示消息队列中消息持久化，TTL 则表示消息会过期。10s 之后刷新页面，发现消息数量已经恢复为 0。这就是给消息队列设置消息过期时间，一旦设置了，所有进入到该队列的消息都有一个过期时间了。

#### 5.2.3 特殊情况

还有一种特殊情况，就是将消息的过期时间 TTL 设置为 0，这表示如果消息不能立马消费则会被立即丢掉，这个特性可以部分替代 RabbitMQ3.0 以前支持的 immediate 参数，之所以所部分代替，是因为 immediate 参数在投递失败会有 basic.return 方法将消息体返回（这个功能可以利用死信队列来实现）。

### 5.3 死信队列

有小伙伴不禁要问，被删除的消息去哪了？真的被删除了吗？非也非也！这就涉及到死信队列了，接下来我们来看看死信队列。]

#### 5.3.1 死信交换机

死信交换机，Dead-Letter-Exchange 即 DLX。

死信交换机用来接收死信消息（Dead Message）的，那什么是死信消息呢？一般消息变成死信消息有如下几种情况：

- 消息被拒绝(Basic.Reject/Basic.Nack) ，井且设置requeue 参数为false
- 消息过期
- 队列达到最大长度

当消息在一个队列中变成了死信消息后，此时就会被发送到 DLX，绑定 DLX 的消息队列则称为死信队列。

DLX 本质上也是一个普普通通的交换机，我们可以为任意队列指定 DLX，当该队列中存在死信时，RabbitMQ 就会自动的将这个死信发布到 DLX 上去，进而被路由到另一个绑定了 DLX 的队列上（即死信队列）。

#### 5.3.2 死信队列

这个好理解，绑定了死信交换机的队列就是死信队列。

#### 5.3.3 实践

首先我们来创建一个死信交换机，接着创建一个死信队列，再将死信交换机和死信队列绑定到一起：

```java
package org.clxmm.dlx;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;


@Configuration
public class RabbitDlxConfig {
    public static final String DLX_EXCHANGE_NAME = "dlx_exchange_name";
    public static final String DLX_QUEUE_NAME = "dlx_queue_name";
    public static final String DLX_ROUTING_KEY = "dlx_routing_key";


    /**
     * 配置死信交换机
     *
     * @return
     */
    @Bean
    DirectExchange dlxDirectExchange() {
        return new DirectExchange(DLX_EXCHANGE_NAME, true, false);
    }

    /**
     * 配置死信队列
     *
     * @return
     */
    @Bean
    Queue dlxQueue() {
        Map<String, Object> args = new HashMap<>();

        return new Queue(DLX_QUEUE_NAME, true, false, false, args);
    }

    /**
     * 绑定死信队列和死信交换机
     *
     * @return
     */
    @Bean
    Binding dlxBinding() {
        return BindingBuilder.bind(dlxQueue())
                .to(dlxDirectExchange())
                .with(DLX_ROUTING_KEY);
    }

}

```

这其实跟普通的交换机，普通的消息队列没啥两样。

接下来为消息队列配置死信交换机，如下：

```java
package org.clxmm.dlx;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

/**
 * @author clxmm
 * @Description
 * @create 2022-04-10 20:02
 */
@Configuration
public class RabbitConfig {
    public static final String N1_EXCHANGE_NAME = "n1_exchange_name";
    public static final String N1_QUEUE_NAME = "n1_queue_name";
    public static final String N1_ROUTING_KEY = "n1_routing_key";


    /**
     * 配置死信交换机
     *
     * @return
     */
    @Bean
    DirectExchange directExchange() {
        return new DirectExchange(N1_EXCHANGE_NAME, true, false);
    }

    /**
     * 配置死信队列
     *
     * @return
     */
    @Bean
    Queue queue() {
        Map<String, Object> args = new HashMap<>();

        //设置消息过期时间
        args.put("x-message-ttl", 0);
        //设置死信交换机
        args.put("x-dead-letter-exchange", RabbitDlxConfig.DLX_EXCHANGE_NAME);
        //设置死信 routing_key
        args.put("x-dead-letter-routing-key", RabbitDlxConfig.DLX_ROUTING_KEY);
        return new Queue(N1_QUEUE_NAME, true, false, false, args);
    }

    /**
     * 绑定死信队列和死信交换机
     *
     * @return
     */
    @Bean
    Binding binding() {
        return BindingBuilder.bind(queue())
                .to(directExchange())
                .with(N1_ROUTING_KEY);
    }

}

```

- x-dead-letter-exchange：配置死信交换机。
- x-dead-letter-routing-key：配置死信 `routing_key`。

这就配置好了。

将来发送到这个消息队列上的消息，如果发生了 nack、reject 或者过期等问题，就会被发送到 DLX 上，进而进入到与 DLX 绑定的消息队列上。

死信消息队列的消费和普通消息队列的消费并无二致：



## 6. RabbitMQ 实现延迟队列

定时任务各种各样，常见的定时任务例如日志备份，我们可能在每天凌晨 3 点去备份，这种固定时间的定时任务我们一般采用 cron 表达式就能轻松的实现，还有一些比较特殊的定时任务，向大家看电影中的定时炸弹，3分钟后爆炸，这种定时任务就不太好用 cron 去描述，因为开始时间不确定，我们开发中有的时候也会遇到类似的需求，例如：

- 在电商项目中，当我们下单之后，一般需要 20 分钟之内或者 30 分钟之内付款，否则订单就会进入异常处理逻辑中，被取消，那么进入到异常处理逻辑中，就可以当成是一个延迟队列。
- 我买了一个智能砂锅，可以用来煮粥，上班前把素材都放到锅里，然后设置几点几分开始煮粥，这样下班后就可以喝到香喷喷的粥了，那么这个煮粥的指令也可以看成是一个延迟任务，放到一个延迟队列中，时间到了再执行。
- 公司的会议预定系统，在会议预定成功后，会在会议开始前半小时通知所有预定该会议的用户。

很多场景下我们都需要延迟队列。

本文以 RabbitMQ 为例来和大家聊一聊延迟队列的玩法。

整体上来说，在 RabbitMQ 上实现定时任务有两种方式：

- 利用 RabbitMQ 自带的消息过期和私信队列机制，实现定时任务。
- 使用 RabbitMQ 的 rabbitmq_delayed_message_exchange 插件来实现定时任务，这种方案较简单。

### 6.1 用插件

#### 6.1.1 安装插件

首先我们需要下载 rabbitmq_delayed_message_exchange 插件，这是一个 GitHub 上的开源项目，我们直接下载即可：
[https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases)

选择适合自己的版本，我这里选择最新的 3.8.0 版。

下载完成后在命令行执行如下命令将下载文件拷贝到 Docker 容器中去：

```dockerfile
docker cp ./rabbitmq_delayed_message_exchange-3.9.0.ez some-rabbit:/plugins

```

这里第一个参数是宿主机上的文件地址，第二个参数是拷贝到容器的位置。

接下来再执行如下命令进入到 RabbitMQ 容器中：

```cmd
docker exec -it some-rabbit /bin/bash

```

进入到容器之后，执行如下命令启用插件：

```
rabbitmq-plugins enable rabbitmq_delayed_message_exchange

```

启用成功之后，还可以通过如下命令查看所有安装的插件，看看是否有我们刚刚安装过的插件，如下：

```
rabbitmq-plugins list

```

![image-20220410205117243](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410205117mq.png)

OK，配置完成之后，接下来我们执行 `exit` 命令退出 RabbitMQ 容器。然后开始编码。

首先我们创建一个 Spring Boot 项目

项目创建成功后，在 application.properties 中配置 RabbitMQ 的基本信息，如下：

```properties
spring.rabbitmq.host=localhost
spring.rabbitmq.password=guest
spring.rabbitmq.username=guest
spring.rabbitmq.virtual-host=/
```

接下来提供一个 RabbitMQ 的配置类：

```java
package org.clxmm.demoyanchi;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.CustomExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitConfig {
    public static final String QUEUE_NAME = "clxmm_delay_queue";
    public static final String EXCHANGE_NAME = "clxmm_delay_exchange";
    public static final String EXCHANGE_TYPE = "x-delayed-message";

    @Bean
    Queue queue() {
        return new Queue(QUEUE_NAME, true, false, false);
    }

    @Bean
    CustomExchange customExchange() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-delayed-type", "direct");
        return new CustomExchange(EXCHANGE_NAME, EXCHANGE_TYPE, true, false,args);
    }

    @Bean
    Binding binding() {
        return BindingBuilder.bind(queue())
                .to(customExchange()).with(QUEUE_NAME).noargs();
    }
}

```

这里我们使用的交换机是 CustomExchange，这是一个 Spring 中提供的交换机，创建 CustomExchange 时有五个参数，含义分别如下：

- 交换机名称。
- 交换机类型，这个地方是固定的。
- 交换机是否持久化。
- 如果没有队列绑定到交换机，交换机是否删除。
- 其他参数。

最后一个 args 参数中，指定了交换机消息分发的类型，这个类型就是大家熟知的 direct、fanout、topic 以及 header 几种，用了哪种类型，将来交换机分发消息就按哪种方式来。

接下来我们再创建一个消息消费者：

```java
@Component
public class MsgReceiver {
    private static final Logger logger = LoggerFactory.getLogger(MsgReceiver.class);
    @RabbitListener(queues = RabbitConfig.QUEUE_NAME)
    public void handleMsg(String msg) {
        logger.info("handleMsg,{}",msg);
    }
}
```

```
    @Autowired
    RabbitTemplate rabbitTemplate;


    @GetMapping("send")
    public void hello() throws IOException {
        Message msg = MessageBuilder.withBody(("hello clxmm" + new Date()).getBytes("UTF-8")).setHeader("x-delay", 10000).build();
        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE_NAME, RabbitConfig.QUEUE_NAME, msg);
    }
```

```
2022-04-10 21:00:38.831  INFO 6993 --- [ntContainer#0-1] org.clxmm.demoyanchi.MsgReceiver         : handleMsg,hello clxmmSun Apr 10 21:00:28 CST 2022

```

观察时间间隔

