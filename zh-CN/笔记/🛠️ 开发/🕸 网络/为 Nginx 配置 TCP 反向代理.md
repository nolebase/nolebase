---
tags:
  - 计算机/网络/网关/Nginx
  - 计算机/网络/网关
  - 计算机/网络/网关/OpenResty
  - 命令行/systemd
  - 计算机/操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Linux
  - 操作系统/Debian
  - 数学/密码学/证书/TLS
  - 数学/密码学/证书/TLS/mTLS
  - 命令行/kubectl
  - 软件/云原生/kubectl
  - 计算机/网络/协议/TCP
---

# 为 Nginx 配置 TCP 反向代理

## 在 Nginx 主配置中添加可复用配置

::: code-group

```nginx [输出日志为 JSON]
stream {
	log_format tcp_json '{'
		'"@timestamp": "$time_iso8601",'
        '"remote_addr": "$remote_addr",'
		'"protocol": "$protocol",'
		'"status": "$status",'
		'"bytes_sent": "$bytes_sent",'
		'"bytes_received": "$bytes_received",'
		'"session_time": "$session_time",'
		'"upstream_addr": "$upstream_addr",'
        '"upstream_bytes_sent": "$upstream_bytes_sent",'
		'"upstream_bytes_received": "$upstream_bytes_received",'
		'"upstream_connect_time": "$upstream_connect_time"'
	'}';

	access_log /var/log/nginx/tcp-access.log tcp_json buffer=512k flush=1m;
	include /etc/nginx/tcp.d/*.conf;
}
```

```nginx [输出日志为普通纯文本]
stream {
	log_format tcp_plain '$remote_addr [$time_local] '
	        '$protocol $status $bytes_sent $bytes_received '
            '$session_time "$upstream_addr" '
            '"$upstream_bytes_sent" "$upstream_bytes_received" "$upstream_connect_time"';

	access_log /var/log/nginx/tcp-access.log tcp_plain buffer=512k flush=1m;
	include /etc/nginx/tcp.d/*.conf;
}
```

:::

说明：

- `log_format`：这里我使用的 JSON 为格式的日志输出，方便采集和处理，如果你不需要 JSON 格式，也可以在上方切换换成非 JSON 格式的配置文件然后参考配置。
- `access_log`：输出到 `/var/log/nginx/tcp-access.log`，与 HTTP 请求的日志不同，HTTP 的放在 `/var/log/nginx/access.log` 里面，当然你也可以混合存放。
- `include`：与普通的 HTTP 虚拟主机配置通常存放在 `/etc/nginx/conf.d` 或者在 Debian 系列的发行版中的 `/etc/nginx/sites-enabled` 和 `/etc/nginx/sites-available` 类似，我们也创建一个 `/etc/nginx/tcp.d` 来存放我们的 TCP 代理。

你可以通过下面的命令来检查配置文件是否配置正确：

```shell
sudo nginx -t
```

配置保存后我们可以通过下面的命令更新配置：

::: code-group

```shell [重载配置]
sudo nginx -s reload
```

```shell [重启 Nginx Systemd 单元]
sudo systemctl restart nginx
```

:::

然后这个时候可以添加我们的 TCP 反向代理目标了。


## 添加 TCP 反向代理配置模块

::: code-group

```nginx [配置反代理其他各种服务]
upstream <上游名称> {
	server <IP>:<端口>;
}

server {
    listen <网关层希望暴露的端口>;
    proxy_connect_timeout 30s;
    proxy_pass <上游名称>;
}
```

```nginx [配置 TLS 反代理其他各种服务]
upstream <上游名称> {
	server <IP>:<端口>;
}

server {
    listen <网关层希望暴露的端口> ssl;

	ssl_certificate      <证书路径>;
    ssl_certificate_key  <证书私钥路径>;

    proxy_connect_timeout 30s;
    proxy_pass <上游名称>;
}
```

```nginx [配置 mTLS 反代理其他各种服务]
upstream <上游名称> {
	server <IP>:<端口>;
}

server {
    listen <网关层希望暴露的端口> ssl;

	ssl_certificate      <证书路径>;
    ssl_certificate_key  <证书私钥路径>;

	ssl_client_certificate  <用于验证客户端证书的证书 CA 链或者单 CA 证书路径>;
    ssl_verify_client on;
    ssl_verify_depth 2;

    proxy_connect_timeout 30s;
    proxy_pass <上游名称>;
}
```

:::

以暴露 Kubernetes 集群为例：

```nginx
upstream kubernetes_api_server_tcp {
	server <控制平面（Control Plane）节点 IP>:6443;
	# 如果部署了多个控制平面的话
	server <控制平面（Control Plane）节点 IP 2>:6443;
	server <控制平面（Control Plane）节点 IP 3>:6443;
}

server {
    listen 6443;
    proxy_connect_timeout 30s;
    proxy_pass kubernetes_api_server_tcp;
}
```

## 观察日志输出

比如对 Kubernetes 的 API Server 配置了 TCP 反向代理进行暴露之后可以运行 `kubectl` 来获取集群资源看看效果：

```shell
kubectl get nodes
```

这个时候就可以通过下面的命令同步输出 Nginx 的 TCP 反向代理日志：

```shell
sudo tail -f /var/log/nginx/tcp-access.log
```

```shell
$ sudo tail -f /var/log/nginx/tcp-access.log

{"@timestamp": "2023-10-14T16:09:35+08:00","remote_addr": "10.0.2.145","protocol": "TCP","status": "200","bytes_sent": "44205","bytes_received": "3690","session_time": "0.351","upstream_addr": "10.24.0.2:6443","upstream_bytes_sent": "3690","upstream_bytes_received": "44205","upstream_connect_time": "0.000"}
{"@timestamp": "2023-10-14T16:09:37+08:00","remote_addr": "10.0.2.145","protocol": "TCP","status": "200","bytes_sent": "13264","bytes_received": "1909","session_time": "0.029","upstream_addr": "10.24.0.2:6443","upstream_bytes_sent": "1909","upstream_bytes_received": "13264","upstream_connect_time": "0.000"}
```
