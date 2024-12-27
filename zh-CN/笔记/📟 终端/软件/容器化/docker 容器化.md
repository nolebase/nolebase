---
status: 尚未完成
---
## 安装 Docker

### CentOS

移除老版本的安装

```shell
$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

安装 `yum-utils` 包（提供 `yum-config-manager` 实用工具程序）并设置 Docker 的稳定发行版软件存储库

```shell
$ sudo yum install -y yum-utils
$ sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

安装 Docker

```shell
sudo yum install docker-ce docker-ce-cli containerd.io
```
