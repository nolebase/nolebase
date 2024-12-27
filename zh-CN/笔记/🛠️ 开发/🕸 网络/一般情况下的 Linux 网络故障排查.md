---
tags:
  - 计算机/操作系统/Linux
  - 计算机/网络
  - 开发/故障排查
---
## ICMP 包检查

### 是否能连到主路由？

```shell
ping <主路由>
```

```shell
ping 10.0.0.1
```

### 是否能解析域名并与互联网通信？

```shell
ping <互联网 域名>
```

```shell
ping baidu.com
```

### 是否能直连到某个互联网 IP？

```shell
ping <互联网 IP>
```

```shell
ping 8.8.8.8
```

### 如果在墙背后，是否能解析国际互联网上的域名并通信？

```shell
ping <外网 互联网 域名>
```

```shell
ping google.com
```

### 如果在墙背后，是否能直接连接到某个国际互联网上的 IP？

```shell
ping <外网 互联网 IP>
```

```shell
ping 8.8.8.8
```
