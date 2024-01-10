---
title: 02rabbitmq
---



## 1. 常见消息中间件

说到消息中间件，估计大伙多多少少都能讲出来一些，ActiveMQ、RabbitMQ、RocketMQ、Kafka 等等各种以及 JMS、AMQP 等各种协议，然而这些消息中间件各自都有什么特点，我们在开发中又该选择哪种呢？今天松哥就来和小伙伴们梳理一下。

### 1.1 几种协议

先来说说消息中间件中常见的几个协议。

#### 1.1.1 JMS

##### 1.1.1.1 JMS 介绍

先来说说 JMS。

JMS 全称 Java Message Service，类似于 JDBC，不同于 JDBC，JMS 是 JavaEE 的消息服务接口，JMS 主要有两个版本：

- 1.1
- 2.0。

两者相比，后者主要是简化了收发消息的代码。

考虑到消息中间件是一个非常常用的工具，所以 JavaEE 为此制定了专门的规范 JMS。

不过和 JDBC 一样，JMS 作为规范，他只是一套接口，并不包含具体的实现，如果我们要使用 JMS，那么一般还需要对应的实现，这就像使用 JDBC 需要对应的驱动一样。

##### 1.1.1.2 JMS 模型

JMS 消息服务支持两种消息模型：

- 点对点或队列模型
- 发布/订阅模型

在点对点或队列模型下，一个生产者向一个特定的队列发布消息，一个消费者从该队列中读取消息。这里，生产者知道消费者的队列，并直接将消息发送到对应的队列。这是一种点对点的消息模型，这种模式被概括为：

1. 只有一个消费者将获得消息。
2. 生产者不需要在消费者消费该消息期间处于运行状态，消费者也同样不需要在消息发送时处于运行状态，即消息的生产者和消费者是完全解耦的。
3. 每一个成功处理的消息都由消息消费者签收。

发布者/订阅者模型支持向一个特定的消息主题发布消息，消费者则可以定义自己感兴趣的主题，这是一种点对面的消息模型，这种模式可以被概括为：

- 多个消费者可以消费消息。
- 在发布者和订阅者之间存在时间依赖性，发布者需要创建一个订阅（subscription），以便客户能够订阅；订阅者必须保持在线状态以接收消息；当然，如果订阅者创建了持久的订阅，那么在订阅者未连接时，消息生产者发布的消息将会在订阅者重新连接时重新发布。

##### 1.1.1.3 JMS 实现

开源的支持 JMS 的消息中间件有：

- Kafka
- Apache ActiveMQ
- JBoss 社区的 HornetQ
- Joram
- Coridan 的 MantaRay
- OpenJMS

一些商用的支持 JMS 的消息中间件有：

- WebLogic Server JMS
- EMS
- GigaSpaces
- iBus
- IONA JMS
- IQManager（2005 年 8 月被Sun Microsystems并购）
- JMS+
- Nirvana
- SonicMQ
- WebSphere MQ

#### 1.1.2 AMQP

##### 1.1.2.1 AMQP 简介

另一个和消息中间件有关的协议就是 AMQP 了。

Message Queue 的需求由来已久，80 年代最早在金融交易中，高盛等公司采用 Teknekron 公司的产品，当时的 Message Queue 软件叫做：the information bus（TIB）。TIB 被电信和通讯公司采用，路透社收购了 Teknekron 公司。之后，IBM 开发了 MQSeries，微软开发了 Microsoft Message Queue（MSMQ）。这些商业 MQ 供应商的问题是厂商锁定，价格高昂。2001 年，Java Message Service 试图解决锁定和交互性的问题，但对应用来说反而更加麻烦了。

于是 2004 年，摩根大通和 iMatrix 开始着手 Advanced Message Queuing Protocol （AMQP）开放标准的开发。2006 年，AMQP 规范发布。2007 年，Rabbit 技术公司基于 AMQP 标准开发的 RabbitMQ 1.0 发布。

目前 RabbitMQ 的最新版本为 3.5.7，基于 AMQP 0-9-1。

在 AMQP 协议中，消息收发涉及到如下一些概念：

- Broker: 接收和分发消息的应用，我们日常所用的 RabbitMQ 就是一个 Message Broker。
- Virtual host: 出于多租户和安全因素设计的，把 AMQP 的基本组件划分到一个虚拟的分组中，类似于网络中的 namespace 概念。当多个不同的用户使用同一个 RabbitMQ 提供的服务时，可以划分出多个 vhost，每个用户在自己的 vhost 中创建 `exchange／queue` 等，
- Connection: publisher／consumer 和 broker 之间的 TCP 连接，断开连接的操作只会在 client 端进行，Broker 不会断开连接，除非出现网络故障或 broker 服务出现问题。
- Channel: 如果每一次访问 RabbitMQ 都建立一个 Connection，在消息量大的时候建立 TCP Connection 的开销将是巨大的，效率也较低。Channel 是在 Connection 内部建立的逻辑连接，如果应用程序支持多线程，通常每个 Thread 创建单独的 Channel 进行通讯，AMQP method 包含了 Channel id 帮助客户端和 Message Broker 识别 Channel，所以 Channel 之间是完全隔离的。Channel 作为轻量级的 Connection 极大减少了操作系统建立 TCP Connection 的开销，关于 Channel，
- Exchange: Message 到达 Broker 的第一站，根据分发规则，匹配查询表中的 routing key，分发消息到 queue 中去。常用的类型有：direct (点对点), topic(发布订阅) 以及 fanout (广播)。
- Queue: 消息最终被送到这里等待 Consumer 取走，一个 Message 可以被同时拷贝到多个 queue 中。
- Binding: Exchange 和 Queue 之间的虚拟连接，binding 中可以包含 routing key，Binding 信息被保存到 Exchange 中的查询表中，作为 Message 的分发依据。

##### 1.1.2.2 AMQP 实现

来看看实现了 AMQP 协议的一些具体的消息中间件产品都有哪些。

- Apache Qpid
- Apache ActiveMQ
- RabbitMQ

#### 1.1.3 MQTT

做物联网开发的小伙伴应该会经常接触这个协议，MQTT（Message Queuing Telemetry Transport，消息队列遥测传输）是 IBM 开发的一个即时通讯协议，目前看来算是物联网开发中比较重要的协议之一了，该协议支持所有平台，几乎可以把所有联网物品和外部连接起来，被用来当做传感器和 Actuator（比如通过 Twitter 让房屋联网）的通信协议，它的优点是格式简洁、占用带宽小、支持移动端通信、支持 PUSH、适用于嵌入式系统。

#### 1.1.4 XMPP

XMPP（可扩展消息处理现场协议，Extensible Messaging and Presence Protocol）是一个基于 XML 的协议，多用于即时消息（IM）以及在线现场探测，适用于服务器之间的准即时操作。核心是基于 XML 流传输，这个协议可能最终允许因特网用户向因特网上的其他任何人发送即时消息，即使其操作系统和浏览器不同。 它的优点是通用公开、兼容性强、可扩展、安全性高，缺点是 XML 编码格式占用带宽大。

#### 1.1.5 JMS Vs AMQP

对于我们 Java 工程师而言，大家日常接触较多的应该是 JMS 和 AMQP 协议，既然 JMS 和 AMQP 都是协议，那么两者有什么区别呢？来看下面一张图：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409205239rabbitmq.png)

### 1.2. 重要产品

#### 1.2.1 ActiveMQ

ActiveMQ 是 Apache 下的一个子项目，使用完全支持 JMS1.1 和 J2EE1.4 规范的 JMS Provider 实现，少量代码就可以高效地实现高级应用场景，并且支持可插拔的传输协议，如：`in-VM`, `TCP`, `SSL`, `NIO`, `UDP`, `multicast`, `JGroups and JXTA transports`。

ActiveMQ 支持常用的多种语言客户端如 C++、Java、.Net,、Python、 Php、 Ruby 等。

现在的 ActiveMQ 分为两个版本：

- ActiveMQ Classic
- ActiveMQ Artemis

这里的 ActiveMQ Classic 就是原来的 ActiveMQ，而 ActiveMQ Artemis 是在 RedHat 捐赠的 HornetQ 服务器代码的基础上开发的，两者代码完全不同，后者支持 JMS2.0，使用基于 Netty 的异步 IO，大大提升了性能，更为神奇的是，后者不仅支持 JMS 协议，还支持 AMQP 协议、STOMP 以及 MQTT，可以说后者的玩法相当丰富。

因此大家在使用时，建议直接选择 ActiveMQ Artemis。

#### 1.2.2 RabbitMQ

RabbitMQ 算是 AMQP 体系下最为重要的产品了，它基于 Erlang 语言开发实现，

RabbitMQ 支持 AMQP、XMPP、SMTP、STOMP 等多种协议，功能强大，适用于企业级开发。

来看一张 RabbitMQ 的结构图：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409213920nq.png)

#### 1.2.3 RocketMQ

RocketMQ 是阿里开源的一款分布式消息中间件，原名 Metaq，从 3.0 版本开始改名为 RocketMQ，是阿里参照 Kafka 设计思想使用 Java 语言实现的一套 MQ。RocketMQ 将阿里内部多款 MQ 产品（Notify、Metaq）进行整合，只维护核心功能，去除了所有其他运行时依赖，保证核心功能最简化，在此基础上配合阿里上述其他开源产品实现不同场景下 MQ 的架构，目前主要用于订单交易系统。

RocketMQ 具有以下特点：

- 保证严格的消息顺序。
- 提供针对消息的过滤功能。
- 提供丰富的消息拉取模式。
- 高效的订阅者水平扩展能力。
- 实时的消息订阅机制。
- 亿级消息堆积能力

#### 1.2.4 Kafka

Kafka 是 Apache 下的一个开源流处理平台，由 Scala 和 Java 编写。Kafka 是一种高吞吐量的分布式发布订阅消息系统，它可以处理消费者在网站中的所有动作（网页浏览，搜索和其他用户的行动）流数据。Kafka 的目的是通过 Hadoop 的并行加载机制来统一线上和离线的消息处理，也是为了通过集群来提供实时的消息。

Kafka 具有以下特性：

- 快速持久化：通过磁盘顺序读写与零拷贝机制，可以在O(1)的系统开销下进行消息持久化。
- 高吞吐：在一台普通的服务器上既可以达到 10W/s 的吞吐速率。
- 高堆积：支持 topic 下消费者较长时间离线，消息堆积量大。
- 完全的分布式系统：Broker、Producer、Consumer 都原生自动支持分布式，通过 Zookeeper 可以自动实现更加复杂的负载均衡。
- 支持 Hadoop 数据并行加载。

#### 1.2.5 ZeroMQ

ZeroMQ 号称最快的消息队列系统，它专门为高吞吐量/低延迟的场景开发，在金融界的应用中经常使用，偏重于实时数据通信场景。ZeroMQ 不是单独的服务，而是一个嵌入式库，它封装了网络通信、消息队列、线程调度等功能，向上层提供简洁的 API，应用程序通过加载库文件，调用 API 函数来实现高性能网络通信。

- 无锁的队列模型：对于跨线程间的交互（用户端和 session）之间的数据交换通道 pipe，采用无锁的队列算法 CAS，在 pipe 的两端注册有异步事件，在读或者写消息到 pipe 时，会自动触发读写事件。
- 批量处理的算法：对于批量的消息，进行了适应性的优化，可以批量的接收和发送消息。
- 多核下的线程绑定，无须 CPU 切换：区别于传统的多线程并发模式，信号量或者临界区，ZeroMQ 充分利用多核的优势，每个核绑定运行一个工作者线程，避免多线程之间的 CPU 切换开销。

#### 1.2.6 其他

另外还有如 Redis 也能做消息队列

### 1.3. 比较

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409205139rabbitmq.png)



## 2. RabbitMQ 管理页面

![image-20220409220345864](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409220346mq.png)

1. Overview：这里可以概览 RabbitMQ 的整体情况，如果是集群，也可以查看集群中各个节点的情况。包括 RabbitMQ 的端口映射信息等，都可以在这个选项卡中查看。
2. Connections：这个选项卡中是连接上 RabbitMQ 的生产者和消费者的情况。
3. Channels：这里展示的是“通道”信息，关于“通道”和“连接”的关系，松哥在后文再和大家详细介绍。
4. Exchange：这里展示所有的交换机信息。
5. Queue：这里展示所有的队列信息。
6. Admin：这里展示所有的用户信息。

右上角是页面刷新的时间，默认是 5 秒刷新一次，展示的是所有的 Virtual host。

### 2.2 Overview

Overview 中分了如下一些功能模块：

![image-20220409220612311](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409220612mq.png)

分别是：

- **Totals：**:Totals 里面有 准备消费的消息数、待确认的消息数、消息总数以及消息的各种处理速率（发送速率、确认速率、写入硬盘速率等等）。
- **Nodes：**:Nodes 其实就是支撑 RabbitMQ 运行的一些机器，相当于集群的节点。点击每个节点，可以查看节点的详细信息。
- **Churn statistics：**:里边展示的是 Connection、Channel 以及 Queue 的创建/关闭速率。
- **Ports and contexts：**这个里边展示了端口的映射信息以及 Web 的上下文信息。
  - 5672 是 RabbitMQ 通信端口。
  - 15672 是 Web 管理页面端口。
  - 25672 是集群通信端口。
- **Export definitions** && **Import definitions：**:最后面这两个可以导入导出当前实例的一些配置信息：

### 2.3 Connections

![image-20220409220859912](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409220900mq.png)

这里主要展示的是当前连接上 RabbitMQ 的信息，无论是消息生产者还是消息消费者，只要连接上来了这里都会显示出来。

注意协议中的 AMQP 0-9-1 指的是 AMQP 协议的版本号。

其他属性含义如下：

- User name：当前连接使用的用户名。
- State：当前连接的状态，running 表示运行中；idle 表示空闲。
- SSL/TLS：表示是否使用 ssl 进行连接。
- Channels：当前连接创建的通道总数。
- From client：每秒发出的数据包。
- To client：每秒收到的数据包。

点击连接名称可以查看每一个连接的详情。

在详情中可以查看每一个连接的通道数以及其他详细信息，也可以强制关闭一个连接。

### 2.4 Channels

![image-20220409221015796](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409221015mq.png)

这个地方展示的是通道的信息：

那么什么是通道呢？

一个连接（IP）可以有多个通道，如上图，一共是两个连接，但是一共有 12 个通道。

一个连接可以有多个通道，这个多个通道通过多线程实现，一般情况下，我们在通道中创建队列、交换机等。

生产者的通道一般会立马关闭；消费者是一直监听的，通道几乎是会一直存在。

上面各项参数含义分别如下：

- Channel：通道名称。
- User name：该通道登录使用的用户名。
- Model：通道确认模式，C 表示 confirm；T 表示事务。
- State：通道当前的状态，running 表示运行中；idle 表示空闲。
- Unconfirmed：待确认的消息总数。
- Prefetch：Prefetch 表示每个消费者最大的能承受的未确认消息数目，简单来说就是用来指定一个消费者一次可以从 RabbitMQ 中获取多少条消息并缓存在消费者中，一旦消费者的缓冲区满了，RabbitMQ 将会停止投递新的消息到该消费者中直到它发出有消息被 ack 了。总的来说，消费者负责不断处理消息，不断 ack，然后只要 unAcked 数少于 prefetch * consumer 数目，RabbitMQ 就不断将消息投递过去。
- Unacker：待 ack 的消息总数。
- publish：消息生产者发送消息的速率。
- confirm：消息生产者确认消息的速率。
- unroutable (drop)：表示未被接收，且已经删除了的消息。
- deliver/get：消息消费者获取消息的速率。
- ack：消息消费者 ack 消息的速率。

### 2.5 Exchange

![image-20220409221120991](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409221121mq.png)

这里会展示交换机的各种信息。

Type 表示交换机的类型。

Features 有两个取值 D 和 I。

D 表示交换机持久化，将交换机的属性在服务器内部保存，当 MQ 的服务器发生意外或关闭之后，重启 RabbitMQ 时不需要重新手动或执行代码去建立交换机，交换机会自动建立，相当于一直存在。

I 表示这个交换机不可以被消息生产者用来推送消息，仅用来进行交换机和交换机之间的绑定。

Message rate in 表示消息进入的速率。Message rate out 表示消息出去的速率。

点击下方的 **Add a new exchange** 可以创建一个新的交换机。

### 2.6 Queue

这个选项卡就是用来展示消息队列的：

![image-20220409221229464](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409221229mq.png)

- Name：表示消息队列名称。
- Type：表示消息队列的类型，除了上图的 classic，另外还有一种消息类型是 Quorum。两个区别如下图：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409221303.png)

- Features：表示消息队列的特性，D 表示消息队列持久化。
- State：表示当前队列的状态，running 表示运行中；idle 表示空闲。
- Ready：表示待消费的消息总数。
- Unacked：表示待应答的消息总数。
- Total：表示消息总数 Ready+Unacked。
- incoming：表示消息进入的速率。
- deliver/get：表示获取消息的速率。
- ack：表示消息应答的速率。

点击下方的 Add a new queue 可以添加一个新的消息队列。

点击每一个消息队列的名称，可以进入到消息队列中。进入到消息队列后，可以完成对消息队列的进一步操作，例如：

- 将消息队列和某一个交换机进行绑定。
- 发送消息。
- 获取一条消息。
- 移动一条消息（需要插件的支持）。
- 删除消息队列。
- 清空消息队列中的消息。

![image-20220409221401527](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409221401mq.png)

### 2.7 Admin

这里是做一些用户管理操作，

![image-20220409221451263](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/04/20220409221451mq.png)

- Name：表示用户名称。
- Tags：表示角色标签，只能选取一个。
- Can access virtual hosts：表示允许进入的虚拟主机。
- Has password：表示这个用户是否设置了密码。

常见的两个操作时管理用户和虚拟主机。

点击下方的 Add a user 可以添加一个新的用户，添加用户的时候需要给用户设置 Tags，其实就是用户角色，如下：

- none：不能访问 management plugin
- management：用户可以通过 AMQP 做的任何事 列出自己可以通过 AMQP 登入的 virtual hosts 查看自己的 virtual hosts 中的 queues, exchanges 和 bindings 查看和关闭自己的 channels 和 connections 查看有关自己的 virtual hosts 的“全局”的统计信息，包含其他用户在这些 virtual hosts 中的活动
- policymaker：management 可以做的任何事 查看、创建和删除自己的 virtual hosts 所属的 policies 和 parameters
- monitoring：management 可以做的任何事 列出所有 virtual hosts，包括他们不能登录的 virtual hosts 查看其他用户的 connections 和 channels 查看节点级别的数据如 clustering 和 memory 使用情况 查看真正的关于所有 virtual hosts 的全局的统计信息
- administrator：policymaker 和 monitoring 可以做的任何事 创建和删除 virtual hosts 查看、创建和删除 users 查看创建和删除 permissions 关闭其他用户的 connections
- impersonator(模拟者) 模拟者，无法登录管理控制台。

另外，这里也可以进行虚拟主机 virtual host 的操作，