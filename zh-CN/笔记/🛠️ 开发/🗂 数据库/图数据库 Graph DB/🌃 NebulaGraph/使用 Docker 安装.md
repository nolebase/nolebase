---
tags:
  - 命令行/docker
  - 开发/容器化/Docker
  - 开发/云原生/Docker
  - 软件/云原生/docker
  - 计算机/数据库/图数据库/nebulagraph
  - 开发/容器化/Docker/Docker-Compose
---
# 使用 Docker 安装

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2021-12-01 | |

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| --- | ----- | --------------- |
| NebulaGraph | v2.6.0 | [https://docs.nebula-graph.com.cn/2.6.0/](https://docs.nebula-graph.com.cn/2.6.0/) |

## 克隆 Docker Compose 配置仓库

```shell
git clone https://github.com/vesoft-inc/nebula-docker-compose.git
```

切换目录到克隆好的仓库目录

```shell
cd nebula-docker-compose
```

## 切换到版本对应的分支

![](assets/image_20211125141616.png)

在[官方仓库](https://github.com/vesoft-inc/nebula-docker-compose)上查看当前最新的和最推荐的版本，此处写下文档时，最新版本是 2.6.0（对应的分支应该是 v2.6.0），我们切换到 2.6.0 分支

```shell
git checkout v2.6.0
```

## 启动容器

使用 `docker-compose` 命令启动容器
参数说明：

- `up`，表示启动，相当于 `docker start` 或者 `docker run`
- `-d`，表示在背景（分离模式）运行，不将容器内日志和运行状态、结果输出到命令行上

```shell
docker-compose up -d
```

成功之后应该会看到类似的字样：

```shell
Status: Downloaded newer image for vesoft/nebula-graphd:v2.6.0
Creating nebula-docker-compose_metad0_1 ... done
Creating nebula-docker-compose_metad1_1 ... done
Creating nebula-docker-compose_metad2_1 ... done
Creating nebula-docker-compose_storaged1_1 ... done
Creating nebula-docker-compose_storaged2_1 ... done
Creating nebula-docker-compose_storaged0_1 ... done
Creating nebula-docker-compose_graphd1_1   ... done
Creating nebula-docker-compose_graphd2_1   ... done
Creating nebula-docker-compose_graphd_1    ... done
```

## 连接到 NebulaGraph

### 选项一：使用 Nebula Console 镜像启动一个容器，并连接到 NebulaGraph 服务所在的网络（`nebula-docker-compose_nebula-net`）中

此处 `nebula-docker-compose_nebula-net` 是 Docker 网络名称，实际情况可能与安装的环境名称不符，在执行前建议使用 `docker network` 命令查看一下是否有该网络存在：

```shell
docker network ls
NETWORK ID     NAME                               DRIVER    SCOPE
46dac257ca7e   bridge                             bridge    local
96ccba416ac1   host                               host      local
f353ba5e0af0   nebula-docker-compose_nebula-net   bridge    local
4532a99fd21b   none                               null      local
```

找到正确的网络名称（此处我的网络名为 `nebula-docker-compose_nebula-net`）之后填入到下面的 `--network` 参数后面
示例：

```shell
docker run --rm -ti --network nebula-docker-compose_nebula-net --entrypoint=/bin/sh vesoft/nebula-console:v2-nightly
```

连接之后输入 `SHOW HOSTS` 即可获取当前的集群信息

```shell
nebula> SHOW HOSTS;
(root@nebula) [(none)]> SHOW HOSTS;
+-------------+------+----------+--------------+----------------------+------------------------+
| Host        | Port | Status   | Leader count | Leader distribution  | Partition distribution |
+-------------+------+----------+--------------+----------------------+------------------------+
| "storaged0" | 9779 | "ONLINE" | 0            | "No valid partition" | "No valid partition"   |
| "storaged1" | 9779 | "ONLINE" | 0            | "No valid partition" | "No valid partition"   |
| "storaged2" | 9779 | "ONLINE" | 0            | "No valid partition" | "No valid partition"   |
| "Total"     |      |          | 0            |                      |                        |
+-------------+------+----------+--------------+----------------------+------------------------+
Got 4 rows (time spent 16965/24580 us)

Thu, 25 Nov 2021 13:43:14 CST
```

### 选项二：通过本地的 nebula-console 命令连接到 NebulaGraph

如果此前没有安装过 nebula-console（Docker 镜像和 docker-compose 不会附带安装这个命令），则需要去 [nebula-console 官方仓库 - 发行页面](https://github.com/vesoft-inc/nebula-console/releases/)下载对应的版本（我安装的镜像版本是 2.6.0，此处我也下载 2.6.0 的 nebula-console 程序）。

下载后是一个对应系统 CPU 类型和架构的二进制可执行文件，在我们执行下一个命令之前我们需要先授权和移动到适合我们运行的地方。
使用 `mv` 命令移动下载好的文件到 `/usr/local/bin` 目录下面：

```shell
mv nebula-console-darwin-amd64-v2.6.0 /usr/local/bin/nebula-console
```

授予可执行权限

```shell
sudo chmod a+x /usr/local/bin/nebula-console
```

执行连接操作

```shell
nebula-console -u root -p password --address=graphd --port=9669
```

## 延伸阅读

[什么是 Nebula Graph - Nebula Graph Database 手册](https://docs.nebula-graph.com.cn/2.6.1/1.introduction/1.what-is-nebula-graph/)

[Docker Compose部署Nebula Graph - Nebula Graph Database 手册](https://docs.nebula-graph.com.cn/2.0.1/2.quick-start/2.deploy-nebula-graph-with-docker-compose/#nebula_graph)

[nebula-docker-compose/README_zh-CN.md at v2.0.0 · vesoft-inc/nebula-docker-compose](https://github.com/vesoft-inc/nebula-docker-compose/blob/v2.0.0/README_zh-CN.md)
