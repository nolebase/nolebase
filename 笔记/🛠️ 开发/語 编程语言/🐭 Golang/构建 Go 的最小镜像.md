---
tags:
  - 开发/容器化/Docker
  - 开发/云原生/Docker
  - 软件/云原生/docker
  - 开发/语言/Golang
  - 开发/容器化/Docker/Dockerfile
---

# 构建 Go 的最小镜像

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2022-04-09 | 创建 |

可以参考下面的案例

```docker
# syntax=docker/dockerfile:1

# ------ [ 构建步骤 ] ------

# 设定构建步骤所使用的来源镜像为基于 Alpine 发行版的 Go 1.18 版本镜像
FROM golang:1.18-alpine as builder

# 安装构建所需要的必要二进制文件，如果你不需要，可以不安装
RUN apk add bash git

# 设定 Go 使用 模块化依赖 管理方式：GO111MODULE
RUN GO111MODULE=on

# 创建路径 /app
RUN mkdir /app

# 复制 <组织旗下的其他依赖仓库> 到 /app 下面方便构建
COPY ./<组织旗下的其他依赖仓库> /app/<组织旗下的其他依赖仓库>

# 复制当前目录下 go-src 到 /app/go-src
COPY ./go-src /app/go-src

# 切换到 /app/go-src 目录
WORKDIR /app/go-src

# 执行编译
RUN CGO_ENABLED=0 go build -a -o "release/go-src"

# ------ [ 运行步骤 ] ------

# 设定运行步骤所使用的镜像为基于 Alpine 发行版镜像
FROM alpine as runner

# 创建路径 /app
RUN mkdir /app

# 创建路径 /app/go-src/bin
RUN mkdir -p /app/go-src/bin

# 创建路径 /app/go-src/bin
RUN mkdir -p /app/go-src/logs

# 将编译产物和其他需要的文件放入 /app/go-src 中
COPY --from=builder /app/go-src/release/go-src /app/go-src/bin/

# 映射配置文件路径
VOLUME [ "/etc/go-src" ]

# 映射日志文件路径
VOLUME [ "/app/go-src/logs" ]

# 入点是编译好的 neve-service 应用程序
ENTRYPOINT [ "/app/go-src/bin/go-src" ]

# 暴露 8080 端口
EXPOSE 8080
```

## 延伸阅读

[构建 Golang 应用最小 Docker 镜像 - 掘金](https://juejin.cn/post/6844904174396637197)
[使用scratch构建最小化Go程序的docker image - Go语言中文网 - Golang中文社区](https://studygolang.com/articles/24854)
[为Go应用程序构建最小的Docker容器_danpob13624的博客-CSDN博客](https://blog.csdn.net/danpob13624/article/details/106778642)
[「推荐阅读」- 如何给go项目打最小docker镜像，足足降低99%_Scoful的博客-CSDN博客](https://blog.csdn.net/Scoful/article/details/120729102)
[golang 打包到docker运行，最小镜像 - 知乎](https://zhuanlan.zhihu.com/p/382175578)
[打造最小 Go Docker Image | Container](https://tachingchen.com/tw/blog/building-minimal-docker-image-for-go-applications/)
[hesion3d/slimage: Make slim docker image for golang applications.](https://github.com/hesion3d/slimage)
