---
tags:
  - 命令行/docker
  - 开发/容器化/Docker
  - 开发/云原生/Docker
  - 软件/云原生/docker
  - 命令行
  - 命令行/jq
status: 尚未完成
---
# Docker 快捷操作 Cheat Sheet

## Docker 查看容器的挂载信息

```shell
docker inspect <容器 ID 或 Hash> | jq ".[0].Mounts"
```