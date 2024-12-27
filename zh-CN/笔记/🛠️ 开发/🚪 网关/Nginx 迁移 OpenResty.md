---
tags:
  - 计算机/网络/网关/Nginx
  - 计算机/网络/网关/OpenResty
  - 操作系统/Debian
  - 开发/迁移
---

# Nginx 迁移 OpenResty

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2022-08-17 | 创建 |

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Debian | 11/5.10.127-1/amd64 |  |
| Nginx | nginx/1.21.1 | [NGINX Documentation](https://docs.nginx.com/) |
| OpenResty | openresty/1.21.4.1 | [OpenResty® - Official Site](https://openresty.org/en/) |

## Debian 11

### 安装前置软件包

```shell
sudo apt install -y libpcre3-dev libssl-dev perl make build-essential curl
```

### 安装导入 GPG 公钥时所需的几个依赖包（整个安装过程完成后可以随时删除它们）

```shell
sudo apt-get -y install --no-install-recommends wget gnupg ca-certificates
```

### 导入我们的 GPG 密钥

```shell
wget -O - https://openresty.org/package/pubkey.gpg | sudo apt-key add -
```

### 添加 OpenResty 官方 APT 仓库

对于 `x86_64` 或 `amd64` 系统，可以使用下面的命令：

```shell
export codename=`grep -Po 'VERSION="[0-9]+ \(\K[^)]+' /etc/os-release`
```

```shell
echo "deb http://openresty.org/package/debian $codename openresty" | sudo tee /etc/apt/sources.list.d/openresty.list
```

而对于 `arm64` 或 `aarch64` 系统，则可以使用下面的命令:

```shell
export codename=`grep -Po 'VERSION="[0-9]+ \(\K[^)]+' /etc/os-release`
```

```shell
echo "deb http://openresty.org/package/arm64/debian $codename openresty" | sudo tee /etc/apt/sources.list.d/openresty.list
```

### 更新 APT 索引

```shell
sudo apt update
```

### 先停止 Nginx

```shell
sudo systemctl stop nginx
```

### 安装 OpenResty 软件包

```shell
sudo apt install -y openresty openresty-opm openresty-restydoc
```

这个包同时也推荐安装 `openresty-opm` 和 `openresty-restydoc` 包，所以后面两个包会缺省安装上。 如果你不想自动关联安装，可以用下面方法关闭自动关联安装：

```shell
sudo apt -y install --no-install-recommends openresty
```

### 停止安装好的 OpenResty

```shell
sudo systemctl stop openresty
```

### 更新 OpenResty 的配置文件

```shell
sudo vim /etc/openresty/nginx.conf
```

可以参考我的配置：

```nginx
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log notice;
pid        /usr/local/openresty/nginx/logs/nginx.pid;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format json '{'
        '"@timestamp":"$time_iso8601",'
        '"client_ip": "$remote_addr",'
        '"request_uri": "$uri",'
        '"host":"$host",'
        '"method": "$request_method",'
        '"request": "$request",'
        '"status": "$status",'
        '"body_bytes_sent": $body_bytes_sent,'
        '"referer": "$http_referer",'
        '"ua": "$http_user_agent",'
        '"request_time": $request_time,'
        '"upstream_connect_time": $upstream_connect_time,'
        '"upstream_header_time": $upstream_header_time,'
        '"upstream_response_time": $upstream_response_time'
    '}';

    access_log  /var/log/nginx/access.log json;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/openresty/conf.d/*.conf;
    include /etc/openresty/sites-enabled/*;
}
```

### 开始迁移剩余的网站配置文件

创建必要的目录

- `/etc/openresty/conf.d`
- `/etc/openresty/sites-available`
- `/etc/openresty/sites-enabled`

- 复制 `/etc/nginx/conf.d/` 下面的文件到 `/etc/openresty/conf.d`
- 复制 `/etc/nginx/sites-available/` 下面的文件到 `/etc/openresty/sites-available`
- 手动为每一个 `/etc/openresty/sites-available` 下的配置文件创建软链接

使用下面的命令检查配置文件有效性：

```shell
sudo /usr/local/openresty/nginx/sbin/nginx -t
```

使用下面的命令重载配置文件：

```shell
sudo /usr/local/openresty/nginx/sbin/nginx -s reload
```

### 服务切换

准备好之后，停止 Nginx，开启 OpenResty：

```shell
sudo systemctl stop nginx
sudo systemctl start openresty
```

### 更新开机自启策略

```shell
sudo systemctl disable nginx
sudo systemctl enable openresty
```

### 卸载 Nginx

```shell
sudo apt remove nginx
```

### 创建新的 Nginx 二进制文件软链接

```shell
sudo ln -s /usr/local/openresty/nginx/sbin/nginx /usr/local/bin/nginx
```

### 其他的关联配置

#### Logrotate

如果是使用软件管理器安装的 Nginx，其安装脚本可能会自动为 Nginx 配置 Logrotate 策略，且如果你在上述的 OpenResty 配置文件（`/etc/openresty/nginx.conf`）中修改了 `pid` （OpenResty 的进程 ID 文件）字段对应的值，或者说你的 OpenResty 配置文件中 `pid` 字段的值和原先 Nginx 配置文件（`/etc/nginx/nginx.conf`）中配置的 `pid` 字段的值不一样的话，请一定检查并在必要情况下修改 Logrotate 策略配置脚本。
