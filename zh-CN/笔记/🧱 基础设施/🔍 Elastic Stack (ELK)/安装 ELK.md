---
tags:
  - 命令行/docker
  - 开发/容器化/Docker
  - 开发/云原生/Docker
  - 软件/云原生/docker
  - 开发/云原生/可观测
  - 软件/Elastic
  - 软件/Elastic/ELK
  - 软件/Elastic/ElasticStack
  - 软件/Elastic/ElasticSearch
  - 软件/Elastic/Kibana
  - 软件/Elastic/Logstash
  - 开发/云原生/可观测/日志
  - 开发/云原生/可观测/指标
  - 开发/云原生/可观测/监控
  - 基础设施
  - 命令行/apt
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 开发/标记语言/YAML
  - 开发/容器化/Docker/Docker-Compose
  - 命令行/sysctl
  - 命令行/curl
---
# 使用 Docker 安装和部署 ELK

**ELK 即 ElasticSearch、Logstash、Kibana 栈，用于日志分析、日志搜索。**

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| ElasticSearch Docker 镜像 | 7.16.3 | [https://www.elastic.co/guide/en/elasticsearch/reference/current/setup.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup.html) |
| Kibana | 7.16.3 | [https://www.elastic.co/guide/en/kibana/current/docker.html](https://www.elastic.co/guide/en/kibana/current/docker.html) |
| Docker | 20.10.5+dfsg1 | [https://docs.docker.com/](https://docs.docker.com/) |
| docker-compose | 1.25.0 | [https://docs.docker.com/compose/](https://docs.docker.com/compose/) |

## 机器参数要求

最少 3 GB 内存，两个 node 至少会需要 1 G 的运存，还要考虑到对 ElasticSearch 节点的监控（使用 node-exporter 进行节点监控）

## 前置工作

### 安装 Docker

可以参考官方指南在 Debian 11 上安装 Docker：[Install Docker Engine on Debian | Docker Documentation](https://docs.docker.com/engine/install/debian/)

也可以执行下面的脚本，每次一行：

```shell
sudo apt update
```

```shell
sudo apt install ca-certificates curl gnupg lsb-release
```

```shell
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```shell
sudo apt update
```

```shell
sudo apt install docker-ce docker-ce-cli containerd.io
```

### 安装 docker-compose

```shell
sudo apt install docker-compose
```

## 部署 ElasticSearch 搜索引擎

### 拉取 ElasticSearch 镜像

此处引用了 `docker.elastic.co/elasticsearch/elasticsearch:7.16.3` 镜像，大家可以前往 [Elastic Docker 注册中心](https://www.docker.elastic.co/r/elasticsearch) 查看当前可用的 ElasticSearch 镜像标签。

```shell
sudo docker pull docker.elastic.co/elasticsearch/elasticsearch:7.16.3
```

### 撰写 ElasticSearch 的 docker-compose.yaml 文件
通过 `docker-compose.yaml` 配置文件，我们可以同时部署多个服务，并且创建对应的网络将这些网络连接到一起。

`docker-compose.yaml` 文件如下：

```yaml
version: '2.2'
services:
  es01:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.16.3
    container_name: es01
    environment:
      - node.name=es01
      - cluster.name=es-docker-cluster
      - discovery.seed_hosts=es02
      - cluster.initial_master_nodes=es01,es02
      - bootstrap.memory_lock=true
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data01:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
    networks:
      - elastic
  es02:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.16.3
    container_name: es02
    environment:
      - node.name=es02
      - cluster.name=es-docker-cluster
      - discovery.seed_hosts=es01
      - cluster.initial_master_nodes=es01,es02
      - bootstrap.memory_lock=true
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data02:/usr/share/elasticsearch/data
    networks:
      - elastic

volumes:
  data01:
    driver: local
  data02:
    driver: local

networks:
  elastic:
    driver: bridge
```

我把这个文件保存到了 `/opt/elk/elasticsearch/docker-compose.yaml` 路径，安装时按需调整即可。

### 预设定参数

由于是在 Docker 环境中运行，我们还需要调整一下 `vm.max_map_count` 参数值，该参数的含义：限制一个进程可以拥有的VMA（虚拟内存区域）的数量。

> The `vm.max_map_count` kernel setting must be set to at least `262144` for production use.

按照官方文档的说法，我们需要把 `vm.max_map_count` 的参数值设定到 `262144` 以在生产环境中使用。

```shell
sudo sysctl -w vm.max_map_count=262144
```

## 开始运行 ElasticSearch 节点

```shell
sudo docker-compose up -d
```

### 测试效果

通过 SSH 自带的端口转发来转发服务端的端口到本地进行访问：

```shell
ssh elastic-node-01 -L 9200:127.0.0.1:9200
```

访问节点信息：

```shell
curl -X GET "localhost:9200/_cat/nodes?v=true&pretty"
```

## 部署 Kibana 搜索 UI

访问 `http://localhost:5601` 即可

### 拉取 Kibana 镜像

```shell
sudo docker pull docker.elastic.co/kibana/kibana:7.16.3
```

### 撰写 Kibana 配置文件

`kibana.yml`:

```yaml
server.host: 0.0.0.0
server.shutdownTimeout: 5s
elasticsearch.hosts: ['http://es01:9200']
monitoring.ui.container.elasticsearch.enabled: true

# 中文本地化
i18n.locale: zh-CN
```

我把这个配置文件放到了 `/opt/elk/kibana/config/kibana.yml`

### 创建容器

```shell
sudo docker run --name kib01 --net elasticsearch_elastic -p 127.0.0.1:5601:5601 -e "ELASTICSEARCH_HOSTS=http://es01:9200" -d -v /opt/elk/kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml docker.elastic.co/kibana/kibana:7.16.3
```

### 测试效果

通过 SSH 自带的端口转发来转发服务端的端口到本地进行访问：

```shell
ssh elastic-node-01 -L 5601:127.0.0.1:5601
```

浏览器访问 `http://localhost:5601` 即可看到效果

### Kibana 错误排查

#### Something went wrong

如果你遇到了这个错误，并且下方红框内错误提示为：**Request must contain a kbn-xsrf header.** 则说明当前 Header 头部中需要添加 `kbn-xsrf` 头部字段。

Chrome 浏览器可以用 ModHeader 插件来完成。
服务端可以设定一个返回的 Header 来解决该问题。
