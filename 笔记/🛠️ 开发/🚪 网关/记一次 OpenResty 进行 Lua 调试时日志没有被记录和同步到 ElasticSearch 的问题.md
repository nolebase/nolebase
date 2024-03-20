---
tags:
  - 计算机/网络/网关/Nginx
  - 计算机/网络/网关/OpenResty
  - 开发/语言/Lua
  - 开发/后端/日志
  - 开发/云原生/可观测
  - 开发/云原生/日志
  - 软件/Elastic/ElasticSearch
  - 软件/Elastic/ElasticStack
  - 软件/Elastic/ELK
  - 开发/故障排查
status: 尚未完成
---

# 记一次 OpenResty 进行 Lua 调试时日志没有被记录和同步到 ElasticSearch 的问题

> [!WARNING]
> ⚠️ 该文档尚未完成，仍在编写中...

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Debian | 11/5.10.127-1/amd64 |  |
| OpenResty | openresty/1.21.4.1 | [OpenResty® - Official Site](https://openresty.org/en/) |
| ElasticSearch | 8.3.2 | |
| FileBeat | 1.6.0 | |
| Logstash | 8.3.2 | |
