---
tags:
  - 开发/容器化
  - 命令行/docker
  - 运维/云原生/Docker
  - 开发/容器化/Docker/Dockerfile
  - 命令行/aws
  - 基础设施/云服务商/亚马逊云/AWS
  - 基础设施/应用容器/亚马逊云/AWS/ElaticContainerService/ECS
  - 命令行/ps
  - 操作系统/Debian
  - 计算机/操作系统/Linux/内核/procfs
---
# 容器里没有 `ps` 怎么办？

今天去基于 `node:20-slim` 的容器里排查问题的时候发现容器里连 `ps` 都没有，想要观察当前运行的进程的时候会变的困难。

因为容器是部署在 AWS ECS 上的，没有办法像 Kubernetes 的 `kubectl debug` 那样可以简单轻松地复制出来一个共享的 sidecar 容器，所以我们只能硬着头皮解决一下这个问题了。

不过好在如果我们直接观察 [`Dockerfile`](https://github.com/nodejs/docker-node/blob/375d663fe34b3e76ee41bff8bcac583da32fe0cb/20/bookworm-slim/Dockerfile) 的话（如果需要看别的 Dockerfile 可以在 [node - Official Image | Docker Hub](https://hub.docker.com/_/node) 里点击其他的 Tag 然后 inspect），可以发现 `node:20-slim` 是基于 `debian:bookworm-slim` 构建的，这意味着我们起码能有 `apt` 可以用。

所以我们可以用 `apt` 安装  [`procps`](https://packages.debian.org/sid/procps) 补全 `ps` 缺失的问题：

```shell
apt update && apt install procps
```

当然如果连 `apt` 都没有的话... 也许可以试试看 [ps - Command to display only running processes in Linux - Unix & Linux Stack Exchange](https://unix.stackexchange.com/a/542202) 介绍的：

```shell
grep -w R /proc/[0-9]*/stat
```

或者参考一下 [c - Programmatically read all the processes status from /proc - Stack Overflow](https://stackoverflow.com/a/29992237/19954520)

## 参考资料

- [debian - ps command doesn't work in docker container - Stack Overflow](https://stackoverflow.com/questions/26982274/ps-command-doesnt-work-in-docker-container)

## 延伸阅读

- [node.js - What is the difference between node images for Docker and when to use which? - Stack Overflow](https://stackoverflow.com/questions/71422772/what-is-the-difference-between-node-images-for-docker-and-when-to-use-which)
- [嗯嗯對，用 slim 或是 alpine 確實可以省下很多空間，但同時他們也少裝了很多東西，可能會導致一些問題 完整的 node image 是建立在 buildpack-deps:jessie 上，而 slim 版本是建立在 buildpack-deps:jessie-curl 上，後者比前者少裝了很多東西像是 g++、gcc、python 等等，這會導致 node:slim 沒辦法編譯… - Larry Lu - Medium](https://larry850806.medium.com/%E5%97%AF%E5%97%AF%E5%B0%8D-%E7%94%A8-slim-%E6%88%96%E6%98%AF-alpine-%E7%A2%BA%E5%AF%A6%E5%8F%AF%E4%BB%A5%E7%9C%81%E4%B8%8B%E5%BE%88%E5%A4%9A%E7%A9%BA%E9%96%93-%E4%BD%86%E5%90%8C%E6%99%82%E4%BB%96%E5%80%91%E4%B9%9F%E5%B0%91%E8%A3%9D%E4%BA%86%E5%BE%88%E5%A4%9A%E6%9D%B1%E8%A5%BF-%E5%8F%AF%E8%83%BD%E6%9C%83%E5%B0%8E%E8%87%B4%E4%B8%80%E4%BA%9B%E5%95%8F%E9%A1%8C-93c4cfa7b024)
- [Debug Scratch Docker Containers](https://gist.github.com/DavidJFelix/1fff395f478fdcb36cb7780dc0c6ad7d)
- [hightouchio/injecto: Debug `FROM scratch` containers by injecting contents of another image](https://github.com/hightouchio/injecto)
- [Debugging “FROM scratch” on Kubernetes](https://ahmet.im/blog/debugging-scratch/)