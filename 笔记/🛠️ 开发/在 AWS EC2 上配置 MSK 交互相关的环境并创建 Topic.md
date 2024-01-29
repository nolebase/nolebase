---
tags:
  - 基础设施/云服务商/亚马逊云/AWS
  - 基础设施/消息中间件/Kafka/亚马逊云/AWS/MSK
  - 基础设施/消息中间件/Kafka
  - 开发/后端/消息队列/Kafka
  - 操作系统/CentOS
  - 操作系统/CentOS/CentOS-8
  - 命令行/wget
  - 开发/语言/Java
  - 开发/语言/Java/JDK
---
# 在 AWS EC2 上配置 MSK 交互相关的环境并创建 Topic

## 安装 Java

```shell
sudo yum -y install java-11
```

## 下载 Kafka

用下面的命令下载 Kafka，Kafka 的版本号应该要与 AWS Console 中的版本号一一对应

```shell
wget https://archive.apache.org/dist/kafka/<Kafka 版本号>/kafka_2.13-<Kafka 版本号>.tgz
```

以集群为 3.5.1 版本的 Kafka 为例：

```shell
wget https://archive.apache.org/dist/kafka/3.5.1/kafka_2.13-3.5.1.tgz
```

这样下载就好了

```shell
$ wget https://archive.apache.org/dist/kafka/3.5.1/kafka_2.13-3.5.1.tgz
--2024-01-28 10:03:13--  https://archive.apache.org/dist/kafka/3.5.1/kafka_2.13-3.5.1.tgz
Resolving archive.apache.org (archive.apache.org)... 65.108.204.189, 2a01:4f9:1a:a084::2
Connecting to archive.apache.org (archive.apache.org)|65.108.204.189|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 106748875 (102M) [application/x-gzip]
Saving to: ‘kafka_2.13-3.5.1.tgz’

100%[=====================================================================================================>] 106,748,875 11.2MB/s   in 13s    

2024-01-28 10:03:27 (7.86 MB/s) - ‘kafka_2.13-3.5.1.tgz’ saved [106748875/106748875]
```

然后解压缩

```shell
tar -xzf kafka_2.13-3.5.1.tgz
[ec2-user@ip-10-100-105-95 ~]$ ls
app  etoplus-mds  home  kafka_2.13-3.5.1  kafka_2.13-3.5.1.tgz
```

## 为环境进行额外配置

### 下载 AWS MSK 拓展库

在 EC2 上与 MSK 交互，需要使用到 AWS IAM 在 EC2 上的认证和鉴权机制，而这样的机制是要求我们安装额外的鉴权拓展类的，可以通过下面的命令下载

```shell
wget https://github.com/aws/aws-msk-iam-auth/releases/download/v1.1.1/aws-msk-iam-auth-1.1.1-all.jar
```

下载好之后应该是这样的

```shell
wget https://github.com/aws/aws-msk-iam-auth/releases/download/v1.1.1/aws-msk-iam-auth-1.1.1-all.jar
--2024-01-28 10:03:56--  http://wget/
Resolving wget (wget)... failed: Name or service not known.
wget: unable to resolve host address ‘wget’
--2024-01-28 10:03:57--  https://github.com/aws/aws-msk-iam-auth/releases/download/v1.1.1/aws-msk-iam-auth-1.1.1-all.jar
Resolving github.com (github.com)... 20.205.243.166
Connecting to github.com (github.com)|20.205.243.166|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/292053394/b0314dc8-42a6-4855-8114-7de9dc35c48b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240128%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240128T100357Z&X-Amz-Expires=300&X-Amz-Signature=47a72642671b2a24eca100c163ab3030a02fa51b7ca2e7c9bf321b14f33199e7&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=292053394&response-content-disposition=attachment%3B%20filename%3Daws-msk-iam-auth-1.1.1-all.jar&response-content-type=application%2Foctet-stream [following]
--2024-01-28 10:03:57--  https://objects.githubusercontent.com/github-production-release-asset-2e65be/292053394/b0314dc8-42a6-4855-8114-7de9dc35c48b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240128%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240128T100357Z&X-Amz-Expires=300&X-Amz-Signature=47a72642671b2a24eca100c163ab3030a02fa51b7ca2e7c9bf321b14f33199e7&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=292053394&response-content-disposition=attachment%3B%20filename%3Daws-msk-iam-auth-1.1.1-all.jar&response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.111.133, 185.199.108.133, 185.199.109.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.111.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 12417891 (12M) [application/octet-stream]
Saving to: ‘aws-msk-iam-auth-1.1.1-all.jar’

100%[=====================================================================================================>] 12,417,891  2.82MB/s   in 4.8s   

2024-01-28 10:04:04 (2.47 MB/s) - ‘aws-msk-iam-auth-1.1.1-all.jar’ saved [12417891/12417891]

FINISHED --2024-01-28 10:04:04--
Total wall clock time: 7.5s
Downloaded: 1 files, 12M in 4.8s (2.47 MB/s)
```

移动到下载的 Kafka 的目录下的 `libs` 目录下面

```shell
mv aws-msk-iam-auth-1.1.1-all.jar ./kafka_2.13-3.5.1/libs/
```

```shell
vim ./kafka_2.13-3.5.1/bin/client.properties
```

### 配置客户端连接配置

内容如下

```txt
security.protocol=SASL_SSL
sasl.mechanism=AWS_MSK_IAM
sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required; sasl.client.callback.handler.class=software.amazon.msk.auth.iam.IAMClientCallbackHandler
```

而这其中的

```
sasl.client.callback.handler.class=software.amazon.msk.auth.iam.IAMClientCallbackHandler
```

一行就是用于自动通过 EC2 机器上的 IAM 认证机制完成认证的拓展库的关联配置。

### 授予执行权限

```shell
chmod +x ./kafka_2.13-3.5.1/bin/kafka-topics.sh
```

### 创建 Topic

```shell
./kafka_2.13-<Kafka 版本号>/bin/kafka-topics.sh --create --bootstrap-server <连接字符串> --command-config ./kafka_2.13-<Kafka 按版本号>/bin/client.properties --replication-factor <集群 Replica 大小> --partitions <分区号> --topic <Topic 的名字>
```

比如这样

```shell
./kafka_2.13-3.5.1/bin/kafka-topics.sh --create --bootstrap-server <连接字符串> --command-config ./kafka_2.13-3.5.1/bin/client.properties --replication-factor 2 --partitions 1 --topic test.consumer
```

## 问题排查

### 创建时遭遇 `Replication factor: 3 larger than available brokers: 2`

```shell
./kafka_2.13-3.5.1/bin/kafka-topics.sh --create --bootstrap-server <连接字符串> --command-config ./kafka_2.13-3.5.1/bin/client.properties --replication-factor 3 --partitions 1 --topic test.consumer
WARNING: Due to limitations in metric names, topics with a period ('.') or underscore ('_') could collide. To avoid issues it is best to use either, but not both.
Error while executing topic command : Replication factor: 3 larger than available brokers: 2.
[2024-01-28 10:07:56,910] ERROR org.apache.kafka.common.errors.InvalidReplicationFactorException: Replication factor: 3 larger than available brokers: 2.
 (kafka.admin.TopicCommand$)
```

这是因为连接到的集群的 Replica（副本）数量和命令要求的不一致导致的，不可以在创建 Topic 的时候指定超过 Replica（副本）数量的「副本倍率」，需要至少是 Replica（副本）数量的整数倍或者能被整除才行。

### 创建时遭遇 `Class software.amazon.msk.auth.iam.IAMClientCallbackHandler could not be found.`

```shell
$ ./kafka_2.13-3.5.1/bin/kafka-topics.sh --create --bootstrap-server <连接字符串> --command-config ./kafka_2.13-3.5.1/bin/client.properties --replication-factor 3 --partitions 1 --topic test.consumer

Exception in thread "main" org.apache.kafka.common.config.ConfigException: Invalid value software.amazon.msk.auth.iam.IAMClientCallbackHandler for configuration sasl.client.callback.handler.class: Class software.amazon.msk.auth.iam.IAMClientCallbackHandler could not be found.
        at org.apache.kafka.common.config.ConfigDef.parseType(ConfigDef.java:744)
        at org.apache.kafka.common.config.ConfigDef.parseValue(ConfigDef.java:490)
        at org.apache.kafka.common.config.ConfigDef.parse(ConfigDef.java:483)
        at org.apache.kafka.common.config.AbstractConfig.<init>(AbstractConfig.java:112)
        at org.apache.kafka.common.config.AbstractConfig.<init>(AbstractConfig.java:145)
        at org.apache.kafka.clients.admin.AdminClientConfig.<init>(AdminClientConfig.java:245)
        at org.apache.kafka.clients.admin.Admin.create(Admin.java:134)
        at kafka.admin.TopicCommand$TopicService$.createAdminClient(TopicCommand.scala:203)
        at kafka.admin.TopicCommand$TopicService$.apply(TopicCommand.scala:207)
        at kafka.admin.TopicCommand$.main(TopicCommand.scala:51)
        at kafka.admin.TopicCommand.main(TopicCommand.scala)
```

之前下载好的 AWS Auth 拓展类需要移动到  Kafka 安装目录的 `libs` 目录下面：

```shell
mv aws-msk-iam-auth-1.1.1-all.jar ./kafka_2.13-3.5.1/libs/
```

## 参考资料

[Step 4: Create a topic - Amazon Managed Streaming for Apache Kafka](https://docs.aws.amazon.com/msk/latest/developerguide/create-topic.html)