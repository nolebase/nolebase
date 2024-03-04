---
tags:
  - 计算机/网络/网关/Nginx
  - 计算机/网络/网关
  - 命令行/apt
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 操作系统/Debian/Debian-12
  - 计算机/网络/协议/TCP
  - 计算机/网络/协议/UDP
  - 命令行/终端
  - 运维/网络
  - 基础设施/Homelab
  - 开发/故障排查
---

# 激活 Debian 上安装的 Nginx 的 Stream 模块来支持转发 TCP 和 UDP 请求

## TL;DR

安装 `libnginx-mod-stream` 模块来支持 Nginx 的 `stream` 功能：

```shell
sudo apt install libnginx-mod-stream
```

把 Nginx 根配置文件关联的 `/etc/nginx/modules-enabled/*.conf` 的 `50-mod-stream.conf.removed` 恢复为 `50-mod-stream.conf`

```shell
sudo mv /etc/nginx/modules-enabled/50-mod-stream.conf.removed /etc/nginx/modules-enabled/50-mod-stream.conf
```

然后继续使用 `stream` 块就好了。
## 背景

今天在刚升级过的 Debian 网关设备之后访问 TCP/UDP 服务的时候遭遇了发起连接的客户端报错

```
Couldn't connect to server
```

的问题，检查了一下之后发现是因为之前编写和补充进去的 TCP/UDP 代理用到的 `stream` 块失踪了，我怀疑可能和升级之后的 Nginx 版本下的配置文件修改有一定的关系。

在升级之前，我是这样编写的 Nginx 根配置文件 `nginx.conf`：

```nginx
stream {
	include /etc/nginx/tcp.d/*.conf;
}
```

如果直接把 `stream` 修补进来，执行

```shell
sudo nginx -t
```

去检查 Nginx 配置文件有效性的话，就会发现下面这样的错误

```shell
$ sudo nginx -t
2023/12/03 19:11:44 [emerg] 2855#2855: unknown directive "stream" in /etc/nginx/nginx.conf:62
nginx: configuration file /etc/nginx/nginx.conf test failed
```

那 `stream` 丢失的话应该是和 Nginx 的编译模块相关？

我又检查了一下

```shell
sudo nginx -V
```

的输出，发现 `--with-stream=dynamic` 是存在的：

```shell
$ sudo nginx -V
nginx version: nginx/1.22.1
built with OpenSSL 3.0.8 7 Feb 2023 (running with OpenSSL 3.0.11 19 Sep 2023)
TLS SNI support enabled
configure arguments: --with-cc-opt='-g -O2 -ffile-prefix-map=/build/nginx-AoTv4W/nginx-1.22.1=. -fstack-protector-strong -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-z,relro -Wl,-z,now -fPIC' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=stderr --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-compat --with-debug --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_flv_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_mp4_module --with-http_random_index_module --with-http_secure_link_module --with-http_sub_module --with-mail_ssl_module --with-stream_ssl_module --with-stream_ssl_preread_module --with-stream_realip_module --with-http_geoip_module=dynamic --with-http_image_filter_module=dynamic --with-http_perl_module=dynamic --with-http_xslt_module=dynamic --with-mail=dynamic --with-stream=dynamic --with-stream_geoip_module=dynamic
```

但是我似乎太久没有搞过这部分的配置了，不太记得 `dynamic` 代表了什么，于是去搜索了一下这个问题，发现在 `--with-stream=dynamic` 的情况下，需要通过用户手动引入依赖的 `so` 库文件才能让这个模块正常工作：

```nginx
load_module /usr/lib/nginx/modules/ngx_stream_module.so;
```

## 解决

我又检查了一下 Nginx 的根配置文件 `nginx.conf`，发现内部是对模块有可选配置的文件定义的：

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;
include /etc/nginx/modules-enabled/*.conf; # [!code hl]

events {
	worker_connections 768;
	# multi_accept on;
}
```

这个时候我去 `/etc/nginx/modules-enabled/` 目录下面找到了这个 `stream` 模块相关的定义文件：`/etc/nginx/modules-enabled/50-mod-stream.conf.removed`，但如果直接通过

```shell
sudo mv /etc/nginx/modules-enabled/50-mod-stream.conf.removed /etc/nginx/modules-enabled/50-mod-stream.conf
```

这个文件去尝试将 `removed` 的模块激活的话，会遇到 `没有那个文件或目录` 的错误，这个时候我又去检查了这个文件具体是链接到了哪里：

```shell
$ ls -la /etc/nginx/modules-enabled/50-mod-stream.conf.removed
lrwxrwxrwx 1 root root 50 2022年 6月14日 /etc/nginx/modules-enabled/50-mod-stream.conf.removed -> /usr/share/nginx/modules-available/mod-stream.conf
```

发现它确实是一个软链接，这个时候如果我们通过 `cat` 来观察 `/usr/share/nginx/modules-available/mod-stream.conf` 的话就可以验证没有这个配置文件的问题：

```shell
$ sudo cat /usr/share/nginx/modules-available/mod-stream.conf
cat: /usr/share/nginx/modules-available/mod-stream.conf: 没有那个文件或目录
```

我用

```shell
sudo apt search nginx
```

找到了 `stream` 模块需要的包，接下来安装就好了：

```shell
sudo apt install libnginx-mod-stream
```

安装结束之后我们再次恢复原先 Nginx 根配置文件 `nginx.conf` 下面的 `stream` 模块相关的定义：

```nginx
stream {
	include /etc/nginx/tcp.d/*.conf;
}
```

再次运行

```shell
sudo nginx -t
```

最终就发现它能正常工作了！

## 参考资料

- [udp - NGINX Unknown Directive Stream - Stack Overflow](https://stackoverflow.com/questions/50850900/nginx-unknown-directive-stream)
- [unknown directive "stream" in /etc/nginx/nginx.conf:86 - Server Fault](https://serverfault.com/questions/858067/unknown-directive-stream-in-etc-nginx-nginx-conf86)
