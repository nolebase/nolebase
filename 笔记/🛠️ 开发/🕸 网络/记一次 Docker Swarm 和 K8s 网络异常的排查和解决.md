---
tags:
  - 命令行/docker
  - 开发/容器化/Docker
  - 开发/云原生/Docker
  - 软件/云原生/docker
  - 计算机/网络
  - 计算机/网络/网关/Nginx
  - 计算机/网络/网关/OpenResty
  - 软件/Wireshark
  - 计算机/网络/抓包/Wireshark
  - 计算机/网络/抓包
  - 运维/云原生/Kubernetes
  - 运维/云原生/Kubernetes/K8s
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 开发/容器化/Docker/Docker-Swarm
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
status: 尚未完成
---
# 记一次 Docker Swarm 和 K8s 网络异常的排查和解决

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2022-08-15 | 创建 |

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Debian | 11/5.10.127-1/amd64 |  |
| Docker | 20.10.17 | [Docker Documentation](https://docs.docker.com/) |
| OpenResty | openresty/1.21.4.1 | [OpenResty® - Official Site](https://openresty.org/en/) |

![a-docker-swarm-and-k8s-networking-issue-troubleshooting-and-fix-record-screenshot-01](assets/a-docker-swarm-and-k8s-networking-issue-troubleshooting-and-fix-record-screenshot-01.png)

![a-docker-swarm-and-k8s-networking-issue-troubleshooting-and-fix-record-screenshot-02](assets/a-docker-swarm-and-k8s-networking-issue-troubleshooting-and-fix-record-screenshot-02.png)

## 参考资料

[深入kube-proxy ipvs模式的conn_reuse_mode问题 - MAAO的博客](https://maao.cloud/2021/01/15/%E6%B7%B1%E5%85%A5kube-proxy%20ipvs%E6%A8%A1%E5%BC%8F%E7%9A%84conn_reuse_mode%E9%97%AE%E9%A2%98/)

[IPVS 在 k8s 中连接保持引发的问题 - Program Life](https://joyous-x.gitbook.io/mbook/part-devops/ipvs_in_k8s)

[[SWARM] Very poor performance for ingress network with lots of parallel requests · Issue #35082 · moby/moby](
https://github.com/moby/moby/issues/35082)

[Overlay network not working not working between two containers - Part II - General Discussions / General - Docker Community Forums](https://forums.docker.com/t/overlay-network-not-working-not-working-between-two-containers-part-ii/116222/3)

[https://github.com/moby/moby/issues/35082#issuecomment-668762331](https://github.com/moby/moby/issues/35082#issuecomment-668762331)
