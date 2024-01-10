---
title: 03rabbitmq
---

## 3. RabbitMQ 七种消息收发方式

大部分情况下，我们可能都是在 Spring Boot 或者 Spring Cloud 环境下使用 RabbitMQ，因此本文我也主要从这两个方面来和大家分享 RabbitMQ 的用法。

### 3.1 RabbitMQ 架构简介

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409222113mq.png)

这张图中涉及到如下一些概念：

1. 生产者（Publisher）：发布消息到 RabbitMQ 中的交换机（Exchange）上。
2. 交换机（Exchange）：和生产者建立连接并接收生产者的消息。
3. 消费者（Consumer）：监听 RabbitMQ 中的 Queue 中的消息。
4. 队列（Queue）：Exchange 将消息分发到指定的 Queue，Queue 和消费者进行交互。
5. 路由（Routes）：交换机转发消息到队列的规则。

### 3.2 准备工作

RabbitMQ 是 AMQP 阵营里的产品，Spring Boot 为 AMQP 提供了自动化配置依赖 spring-boot-starter-amqp，因此首先创建 Spring Boot 项目并添加该依赖，

项目创建成功后，在 application.properties 中配置 RabbitMQ 的基本连接信息，如下：

```properties
# rabbitmq 配置
spring.rabbitmq.host=localhost
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
spring.rabbitmq.port=5672

```

RabbitMQ 官网介绍了如下几种消息分发的形式：

[https://www.rabbitmq.com/getstarted.html](https://www.rabbitmq.com/getstarted.html)

![image-20220410133141964](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410133149mq.png)

![image-20220410133214757](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410133214mq.png)

![image-20220410133239712](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410133239mq.png)

### 3.3 消息收发

#### 3.3.1 Hello World

咦？这个咋没有交换机？这个其实是默认的交换机，我们需要提供一个生产者一个队列以及一个消费者。消息传播图如下：

![image-20220410133352111](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410133352.png)

来看看代码实现：

先来看看队列的定义：

```java
@Configuration
public class RabbitMqConfig {

    public static final String QUEUE_NAME = "clxmm_queue";

    @Bean
    public Queue clxmmQueue() {
        /**
         *  1。队列的名称
         *  2 持久化
         *  3 排他性，有排他性的队列只能被创建其的connection处理
         *  4 如果没有消费者，是否删除
         */
        return new Queue(QUEUE_NAME,true,false,false);
    }

}

```

再来看看消息消费者的定义：

```java
@Component
@Slf4j
public class MsgReceiver {


    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME)
    public void handleMsg(String msg) {

        log.info("handle msg :{}", msg);
    }


}
```

消息发送：

```java
@SpringBootTest
class RabbitmqdemoApplicationTests {

    @Autowired
    RabbitTemplate rabbitTemplate;


    @Test
    void contextLoads() {
        rabbitTemplate.convertAndSend(HelloWorldConfig.HELLO_WORLD_QUEUE_NAME, "hello");
    }

}
```

这个时候使用的其实是默认的直连交换机（DirectExchange），DirectExchange 的路由策略是将消息队列绑定到一个 DirectExchange 上，当一条消息到达 DirectExchange 时会被转发到与该条消息 `routing key` 相同的 Queue 上，例如消息队列名为 “hello-queue”，则 routingkey 为 “hello-queue” 的消息会被该消息队列接收。

#### 3.3.2 Work queues

一个生产者，一个默认的交换机（DirectExchange），一个队列，两个消费者，如下图：

![image-20220410135033105](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410135033mq.png)

一个队列对应了多个消费者，默认情况下，由队列对消息进行平均分配，消息会被分到不同的消费者手中。消费者可以配置各自的并发能力，进而提高消息的消费能力，也可以配置手动 ack，来决定是否要消费某一条消息。

先来看并发能力的配置，如下：

```java
  @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME)
    public void handleMsg(String msg) {

        log.info("handle msg :{}", msg);
    }


    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME)
    public void handleMsg2(String msg) {

        log.info("handle msg2 :{}", msg);
    }
```

消息发送方式如下：

```java
    @Test
    void contextLoads() {
        for (int i = 0; i < 20; i++) {

            rabbitTemplate.convertAndSend(RabbitMqConfig.QUEUE_NAME, "hell11o" + i);
        }
    }
```

每个消费者会随机接到消息

- concurrency

```java
@RabbitListener(queues = RabbitMqConfig.QUEUE_NAME)
    public void handleMsg(String msg) {

        log.info("handle msg :{}", msg);
    }


    /**
     * concurrency 并发的数量，将开启20子线程区消费
     * @param msg
     */
    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME,concurrency = "20")
    public void handleMsg2(String msg) {

        log.info("handle msg2 :{}，----> {}", msg,Thread.currentThread().getName());
    }
```

两个加起来一共有21个线程

![image-20220410140231753](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410140231mq.png)

再次发送20条消息，大部分有handleMsg2收到

![image-20220410140805203](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410140805mq.png)

可以看到，消息都被第一个消费者消费了。但是小伙伴们需要注意，事情并不总是这样（多试几次就可以看到差异），消息也有可能被第一个消费者消费（只是由于第二个消费者有二十个线程一起开动，所以第二个消费者消费的消息占比更大）。

当然消息消费者也可以开启手动 ack，这样可以自行决定是否消费 RabbitMQ 发来的消息，配置手动 ack 的方式如下：

```properties
spring.rabbitmq.listener.simple.acknowledge-mode=manual
```

```java

    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME)
    public void handleMsg(Message msg, Channel channel) throws IOException {

        log.info("handle msg :{}", msg.getPayload());
        // basicAck 确认消息
        // 第二个参数 multiple 是否批量处理
        channel.basicAck(((Long) msg.getHeaders().get(AmqpHeaders.DELIVERY_TAG)), true);

    }


    /**
     * concurrency 并发的数量，将开启20子线程区消费
     *
     * @param msg
     */
    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME, concurrency = "20")
    public void handleMsg2(Message msg, Channel channel) throws IOException {

        log.info("handle msg2 :{}，----> {}", msg.getPayload(), Thread.currentThread().getName());
        // basicReject 拒绝消费
        channel.basicReject(((Long) msg.getHeaders().get(AmqpHeaders.DELIVERY_TAG)), true);

    }
```

此时第二个消费者拒绝了所有消息，第一个消费者消费了所有消息。

#### 3.3.3 Publish/Subscribe

再来看发布订阅模式，这种情况是这样：

![image-20220410142115035](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410142115mq.png)

一个生产者，多个消费者，每一个消费者都有自己的一个队列，生产者没有将消息直接发送到队列，而是发送到了交换机，每个队列绑定交换机，生产者发送的消息经过交换机，到达队列，实现一个消息被多个消费者获取的目的。需要注意的是，如果将消息发送到一个没有队列绑定的 Exchange上面，那么该消息将会丢失，这是因为在 RabbitMQ 中 Exchange 不具备存储消息的能力，只有队列具备存储消息的能力，

这种情况下，我们有四种交换机可供选择，分别是：

- Direct
- Fanout
- Topic
- Header

##### 3.3.3.1 Direct

DirectExchange 的路由策略是将消息队列绑定到一个 DirectExchange 上，当一条消息到达 DirectExchange 时会被转发到与该条消息 routing key 相同的 Queue 上，例如消息队列名为 “hello-queue”，则 routingkey 为 “hello-queue” 的消息会被该消息队列接收。DirectExchange 的配置如下：

```java
package org.clxmm.publishcomsumer;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitDirectConfig {

    /**
     * Direct：这种路由策略，将消息队列绑定到 DirectExchange 上，当消息到达交换机的时候，消息会携带一个 routing_key，
     * 然后交换机会找到名为 routing_key 的队列，将消息路由过去
     */


    public final static String DIRECTNAME = "clxmm-direct";
    public final static String DIRECT_EXCHANGE_NAME = "direct_exchange_name";


    @Bean
    Queue queue() {
        return new Queue("direct-hello-queue", true, false, false);
    }



    @Bean
    Queue queue2() {
        return new Queue("direct-hello-queue2", true, false, false);
    }

    // 直连交换机
    @Bean
    DirectExchange directExchange() {
        // 1。名称
        // 2 交换机持久化
        // 3 自动删除，如果没有队列
        return new DirectExchange(DIRECTNAME, true, false);
    }

    // 绑定，交换机和队列绑定起来
    @Bean
    Binding binding() {
        return BindingBuilder.
                bind(queue())  // 绑定队列
                .to(directExchange())  // 绑定交换机
                .with("direct-hello1");
    }


    @Bean
    Binding binding2() {
        return BindingBuilder.
                bind(queue2())  // 绑定队列
                .to(directExchange())  // 绑定交换机
               .with("direct-hello2");
    }

}

```

```java
    @RabbitListener(queues = "direct-hello-queue")
    public void hdl1(Message message) {
        log.info("hdl1 -- >{}", message.getPayload());
    }

    @RabbitListener(queues = "direct-hello-queue2")
    public void hdl2(Message message) {
        log.info("hdl2 -- >{}", message.getPayload());
    }

```

```java
    @Test
    void contextLoads() {

        rabbitTemplate.convertSendAndReceive(RabbitDirectConfig.DIRECTNAME,"direct-hello1","发给队列1的消息");
        rabbitTemplate.convertSendAndReceive(RabbitDirectConfig.DIRECTNAME,"direct-hello2","发给队列2的消息");
    }
```

```
2022-04-10 14:49:59.725  INFO 3063 --- [ntContainer#1-1] org.clxmm.publishcomsumer.MessageHdl     : hdl1 -- >发给队列1的消息
2022-04-10 14:50:04.718  INFO 3063 --- [ntContainer#0-1] org.clxmm.publishcomsumer.MessageHdl     : hdl2 -- >发给队列2的消息
```

##### 3.3.3.2 Fanout

FanoutExchange 的数据交换策略是把所有到达 FanoutExchange 的消息转发给所有与它绑定的 Queue 上，在这种策略中，routingkey 将不起任何作用，FanoutExchange 配置方式如下：

```java
package org.clxmm.publishcomsumer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class FanoutConfig {


    public static final String FANOUT_OUT_NAME1 = "fanout_out_name1";
    public static final String FANOUT_OUT_NAME2 = "fanout_out_name2";
    public static final String FANOUT_EXCHANGE_NAME = "fanout_exchange_name";


    @Bean
    Queue queue1Fanout() {
        return new Queue(FANOUT_OUT_NAME1, true, false, false);
    }


    @Bean
    Queue queue2Fanout() {
        return new Queue(FANOUT_OUT_NAME2, true, false, false);
    }


    @Bean
    FanoutExchange fanoutExchange() {
        return new FanoutExchange(FANOUT_EXCHANGE_NAME, true, false);
    }

    @Bean
    Binding bindingFanout1() {
        return BindingBuilder.bind(queue1Fanout())
                .to(fanoutExchange());
    }

    @Bean
    Binding bindingFanout2() {
        return BindingBuilder.bind(queue2Fanout())
                .to(fanoutExchange());
    }


}

```

在这里首先创建 FanoutExchange，参数含义与创建 DirectExchange 参数含义一致，然后创建两个 Queue，再将这两个 Queue 都绑定到 FanoutExchange 上。接下来创建两个消费者，如下：

```java
    @RabbitListener(queues =FanoutConfig.FANOUT_OUT_NAME1)
    public void hdl3(Message message) {
        log.info("hdl3 -- >{}", message.getPayload());
    }

    @RabbitListener(queues =FanoutConfig.FANOUT_OUT_NAME2)
    public void hdl4(Message message) {
        log.info("hdl4 -- >{}", message.getPayload());
    }

```

两个消费者分别消费两个消息队列中的消息，然后在单元测试中发送消息，如下：

注意这里发送消息时不需要 `routingkey`，指定 `exchange` 即可，`routingkey` 可以直接传一个 `null`。

```java
   @Test
    void contextLoads2() {
        rabbitTemplate.convertSendAndReceive(FanoutConfig.FANOUT_EXCHANGE_NAME,null,"发给队列1的消息");
        rabbitTemplate.convertSendAndReceive(FanoutConfig.FANOUT_EXCHANGE_NAME,null,"发给队列2的消息");
    }
```

```
2022-04-10 15:54:27.913  INFO 3625 --- [ntContainer#1-1] org.clxmm.publishcomsumer.MessageHdl     : hdl3 -- >发给队列1的消息
2022-04-10 15:54:27.913  INFO 3625 --- [ntContainer#2-1] org.clxmm.publishcomsumer.MessageHdl     : hdl4 -- >发给队列1的消息
2022-04-10 15:54:32.892  INFO 3625 --- [ntContainer#1-1] org.clxmm.publishcomsumer.MessageHdl     : hdl3 -- >发给队列2的消息
2022-04-10 15:54:32.892  INFO 3625 --- [ntContainer#2-1] org.clxmm.publishcomsumer.MessageHdl     : hdl4 -- >发给队列2的消息

```

##### 3.3.3.3 Topic

TopicExchange 是比较复杂但是也比较灵活的一种路由策略，在 TopicExchange 中，Queue 通过 routingkey 绑定到 TopicExchange 上，当消息到达 TopicExchange 后，TopicExchange 根据消息的 routingkey 将消息路由到一个或者多个 Queue 上。TopicExchange 配置如下：

```java
@Configuration
public class TopicConfig {

    static final String TOPIC_XIAOMI_NAME = "topic_xiaomi_name";
    static final String TOPIC_HUAWEI_NAME = "topic_huawei_name";
    static final String TOPIC_PHONE_NAME = "topic_phone_name";
    static final String TOPIC_EXCHANGE_NAME = "topic_exchange_name";


    @Bean
    Queue xiaomiQueue() {
        return new Queue(TOPIC_XIAOMI_NAME, true, false, false);
    }

    @Bean
    Queue huaweiQueue() {
        return new Queue(TOPIC_HUAWEI_NAME, true, false, false);
    }

    @Bean
    Queue phoneQueue() {
        return new Queue(TOPIC_PHONE_NAME, true, false, false);
    }


    @Bean
    TopicExchange topicExchange() {
        return new TopicExchange(TOPIC_EXCHANGE_NAME, true, false);
    }


    @Bean
    Binding xiaomiBinding() {
        return BindingBuilder.bind(xiaomiQueue())
                .to(topicExchange())
                .with("topic_xiaomi.*");
    }

    @Bean
    Binding huaweiBinding() {
        return BindingBuilder.bind(huaweiQueue())
                .to(topicExchange())
                .with("topic_huawei.*");
    }

    @Bean
    Binding phoneBinding() {
        return BindingBuilder.bind(phoneQueue())
                .to(topicExchange())
                .with("topic_phone.*");
    }


}
```

接下来针对三个 Queue 创建三个消费者，如下：

```java


    @RabbitListener(queues = TopicConfig.TOPIC_XIAOMI_NAME)
    public void hdl5(Message message) {
        log.info("TOPIC_XIAOMI_NAME -- >{}", message.getPayload());
    }


    @RabbitListener(queues = TopicConfig.TOPIC_HUAWEI_NAME)
    public void hdl6(Message message) {
        log.info("TOPIC_HUAWEI_NAME -- >{}", message.getPayload());
    }


    @RabbitListener(queues = TopicConfig.TOPIC_PHONE_NAME)
    public void hdl7(Message message) {
        log.info("TOPIC_PHONE_NAME -- >{}", message.getPayload());
    }

```

```java
    @Test
    void contextLoads3() {

//        rabbitTemplate.convertSendAndReceive(TopicConfig.TOPIC_EXCHANGE_NAME,"topic_xiaomi.phone","mi 12 手机");
        rabbitTemplate.convertSendAndReceive(TopicConfig.TOPIC_EXCHANGE_NAME,"topic_huawei.phone","huawei 20 手机");
//        rabbitTemplate.convertSendAndReceive(TopicConfig.TOPIC_EXCHANGE_NAME,"topic_phone.phone","apple 12 手机");
    }
```

```
2022-04-10 16:25:28.687  INFO 3907 --- [ntContainer#5-1] org.clxmm.publishcomsumer.MessageHdl     : TOPIC_HUAWEI_NAME -- >huawei 20 手机
2022-04-10 16:25:28.687  INFO 3907 --- [ntContainer#0-1] org.clxmm.publishcomsumer.MessageHdl     : TOPIC_XIAOMI_NAME -- >huawei 20 手机

```

##### 3.3.3.4 Header

HeadersExchange 是一种使用较少的路由策略，HeadersExchange 会根据消息的 Header 将消息路由到不同的 Queue 上，这种策略也和 routingkey无关，配置如下：

```java
package org.clxmm.publishcomsumer;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.HeadersExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class HeaderConfig {

    static final String HEADER_QUEUE_NAME = "header_queue_name1";
    static final String HEADER_QUEUE_NAME2 = "header_queue_name2";
    static final String HEADER_EXCHANGE_NAME = "header_exchange_name";


    @Bean
    Queue headerQ1() {
        return new Queue(HEADER_QUEUE_NAME, true, false, false);
    }

    @Bean
    Queue headerQ2() {
        return new Queue(HEADER_QUEUE_NAME2, true, false, false);
    }


    @Bean
    HeadersExchange headersExchange() {
        return new HeadersExchange(HEADER_EXCHANGE_NAME, true, false);
    }


    @Bean
    Binding headerBinding() {
        return BindingBuilder.bind(headerQ1())
                .to(headersExchange())
                // 如果头部消息包含name属性
                .where("name").exists();
    }

    @Bean
    Binding headerBinding2() {
        return BindingBuilder.bind(headerQ2())
                .to(headersExchange())
                .whereAny("age", "id").exist();
    }

}

```

```java
    @RabbitListener(queues = HeaderConfig.HEADER_QUEUE_NAME)
    public void hdl8(byte[] msg) {
        System.out.println("HEADER_QUEUE_NAME" + new String(msg, 0, msg.length));
    }


    @RabbitListener(queues = HeaderConfig.HEADER_QUEUE_NAME2)
    public void hdl9(byte[] msg) {
        System.out.println("HEADER_QUEUE_NAME" + new String(msg, 0, msg.length));
    }
```

```java
    @Test
    void contextLoads4() {
        Message msg1 = MessageBuilder.withBody("hello 1".getBytes()).setHeader("name", "123").build();
        rabbitTemplate.convertSendAndReceive(HeaderConfig.HEADER_EXCHANGE_NAME, null, msg1);


        Message msg2 = MessageBuilder.withBody("hello 2".getBytes()).setHeader("age", "12").build();
        rabbitTemplate.convertSendAndReceive(HeaderConfig.HEADER_EXCHANGE_NAME, null, msg2);
    }
```

这里创建两条消息，两条消息具有不同的 header，不同 header 的消息将被发到不同的 Queue 中去。

#### 3.3.4 Routing

一个生产者，一个交换机，两个队列，两个消费者，生产者在创建 Exchange 后，根据 RoutingKey 去绑定相应的队列，并且在发送消息时，指定消息的具体 RoutingKey 即可。

![image-20220410165748240](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410165748mq.png)

这个就是按照 routing key 去路由消息，我这里就不再举例子了，大家可以参考 3.3.1 小结。

#### 3.3.5 Topics

一个生产者，一个交换机，两个队列，两个消费者，生产者创建 Topic 的 Exchange 并且绑定到队列中，这次绑定可以通过 `*` 和 `#` 关键字，对指定 `RoutingKey` 内容，编写时注意格式 `xxx.xxx.xxx` 去编写。

![image-20220410170356403](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410170356mq.png)

这个我也就不举例啦，前面 3.3.3 小节已经举过例子了，不再赘述。

#### 3.3.6 RPC

## 4. RabbitMQ 实现 RPC

说到 RPC（Remote Procedure Call Protocol 远程过程调用协议），小伙伴们脑海里蹦出的估计都是 RESTful API、Dubbo、WebService、Java RMI、CORBA 等。

![image-20220410170522379](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220410170522mq.png)

1. 首先 Client 发送一条消息，和普通的消息相比，这条消息多了两个关键内容：一个是 correlation_id，这个表示这条消息的唯一 id，还有一个内容是 reply_to，这个表示消息回复队列的名字。
2. Server 从消息发送队列获取消息并处理相应的业务逻辑，处理完成后，将处理结果发送到 reply_to 指定的回调队列中。
3. Client 从回调队列中读取消息，就可以知道消息的执行情况是什么样子了。

这种情况其实非常适合处理异步调用。

### 4.2 实践

#### 4.2.1 客户端开发

首先我们来创建一个 Spring Boot 工程名为 producer，作为消息生产者，创建时候添加 web 和 rabbitmq 依赖，如下图：

项目创建成功之后，首先在 application.properties 中配置 RabbitMQ 的基本信息，如下：

```properties
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
spring.rabbitmq.publisher-confirm-type=correlated
spring.rabbitmq.publisher-returns=true
```

这个配置前面四行都好理解，我就不赘述，后面两行：首先是配置消息确认方式，我们通过 correlated 来确认，只有开启了这个配置，将来的消息中才会带 correlation_id，只有通过 correlation_id 我们才能将发送的消息和返回值之间关联起来。最后一行配置则是开启发送失败退回。

接下来我们来提供一个配置类，如下：

```java
package org.clxmm.rpcclient;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitConfig {
    public static final String RPC_MSG_QUEUE = "rpc_msg_queue";
    public static final String RPC_REPLY_MSG_NAME = "rpc_reply_msg_name";
    public static final String RPC_EXCHANGE = "rpc_exchange";


    @Bean
    Queue msgQueue() {
        return new Queue(RPC_MSG_QUEUE);
    }


    @Bean
    Queue replyQueue() {
        return new Queue(RPC_REPLY_MSG_NAME);
    }

    @Bean
    TopicExchange topicExchange() {
        return new TopicExchange(RPC_EXCHANGE);
    }


    @Bean
    Binding msgBinding() {
        return BindingBuilder.bind(msgQueue())
                .to(topicExchange())
                .with(RPC_MSG_QUEUE);
    }

    @Bean
    Binding replyBinding() {
        return BindingBuilder.bind(replyQueue())
                .to(topicExchange())
                .with(RPC_REPLY_MSG_NAME);
    }


    /**
     * 使用 RabbitTemplate发送和接收消息
     * 并设置回调队列地址
     */
    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {

        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setReplyAddress(RPC_REPLY_MSG_NAME);
        rabbitTemplate.setReceiveTimeout(6_000);
        return rabbitTemplate;

    }


    /**
     * 给返回队列设置监听器
     */
    @Bean
    SimpleMessageListenerContainer replyContainer(ConnectionFactory connectionFactory) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(RPC_REPLY_MSG_NAME);
        container.setMessageListener(rabbitTemplate(connectionFactory));
        return container;
    }

}

```

这个配置类中我们分别配置了消息发送队列 msgQueue 和消息返回队列 replyQueue，然后将这两个队列和消息交换机进行绑定。这个都是 RabbitMQ 的常规操作，没啥好说的。

在 Spring Boot 中我们负责消息发送的工具是 RabbitTemplate，默认情况下，系统自动提供了该工具，但是这里我们需要对该工具重新进行定制，**主要是添加消息发送的返回队列**，最后我们还需要给返回队列设置一个监听器。

好啦，接下来我们就可以开始具体的消息发送了：

```java
@RestController
public class Hellocontroller {

    @Autowired
    RabbitTemplate rabbitTemplate;


    @GetMapping("/send")
    public void hello() {
        String msg = "hello";
        Message build = MessageBuilder.withBody(msg.getBytes()).build();

        Message result = rabbitTemplate.sendAndReceive(RabbitConfig.RPC_EXCHANGE, RabbitConfig.RPC_MSG_QUEUE, build);
        if (result != null) {
            System.out.println("correlationId" + build.getMessageProperties().getCorrelationId());
            // 获取响应头信息
            HashMap<String, Object> headers = (HashMap<String, Object>) result.getMessageProperties().getHeaders();
            // 获取 server 返回的消息 id
            String msgId = (String) headers.get("spring_returned_message_correlation");
            System.out.println("返回的id：" + msgId);

            System.out.println("收到的消息" + new String(result.getBody()));
        }


    }


}
```

1. 消息发送调用 sendAndReceive 方法，该方法自带返回值，返回值就是服务端返回的消息。
2. 服务端返回的消息中，头信息中包含了 spring_returned_message_correlation 字段，这个就是消息发送时候的 correlation_id，通过消息发送时候的 correlation_id 以及返回消息头中的 spring_returned_message_correlation 字段值，我们就可以将返回的消息内容和发送的消息绑定到一起，确认出这个返回的内容就是针对这个发送的消息的。

这就是整个客户端的开发，其实最最核心的就是 sendAndReceive 方法的调用。调用虽然简单，但是准备工作还是要做足够。例如如果我们没有在 application.properties 中配置 correlated，发送的消息中就没有 correlation_id，这样就无法将返回的消息内容和发送的消息内容关联起来。

#### 4.2.2 服务端开发

首先创建一个名为 consumer 的 Spring Boot 项目，创建项目添加的依赖和客户端开发创建的依赖是一致的，不再赘述。

然后配置 application.properties 配置文件，该文件的配置也和客户端中的配置一致，不再赘述。

接下来提供一个 RabbitMQ 的配置类，这个配置类就比较简单，单纯的配置一下消息队列并将之和消息交换机绑定起来，如下：

```java
@Configuration
public class RabbitConfig {
    public static final String RPC_MSG_QUEUE = "rpc_msg_queue";
    public static final String RPC_REPLY_MSG_NAME = "rpc_reply_msg_name";
    public static final String RPC_EXCHANGE = "rpc_exchange";


    @Bean
    Queue msgQueue() {
        return new Queue(RPC_MSG_QUEUE);
    }


    @Bean
    Queue replyQueue() {
        return new Queue(RPC_REPLY_MSG_NAME);
    }

    @Bean
    TopicExchange topicExchange() {
        return new TopicExchange(RPC_EXCHANGE);
    }


    @Bean
    Binding msgBinding() {
        return BindingBuilder.bind(msgQueue())
                .to(topicExchange())
                .with(RPC_MSG_QUEUE);
    }

    @Bean
    Binding replyBinding() {
        return BindingBuilder.bind(replyQueue())
                .to(topicExchange())
                .with(RPC_REPLY_MSG_NAME);
    }


}
```

最后我们再来看下消息的消费：

```java

    @Autowired
    RabbitTemplate rabbitTemplate;


    @RabbitListener(queues = RabbitConfig.RPC_MSG_QUEUE)
    public void process(Message message) {
        byte[] body = message.getBody();
        System.out.println(new String(body));

        MessageBuilder builder = MessageBuilder.withBody(("服务端返回：" + new String(body)).getBytes());
        CorrelationData correlationData = new CorrelationData(message.getMessageProperties().getCorrelationId());
        rabbitTemplate.sendAndReceive(RabbitConfig.RPC_EXCHANGE, RabbitConfig.RPC_REPLY_MSG_NAME, builder.build(), correlationData);


    }
```

1. 服务端首先收到消息并打印出来。
2. 服务端提取出原消息中的 correlation_id。
3. 服务端调用 sendAndReceive 方法，将消息发送给 RPC_QUEUE2 队列，同时带上 correlation_id 参数。

服务端的消息发出后，客户端将收到服务端返回的结果。

#### 4.2.3 测试

[http://localhost:8080/send](http://localhost:8080/send)

```
correlationId1
返回的id：1
收到的消息服务端返回：hello
correlationId2
返回的id：2
收到的消息服务端返回：hello
```

