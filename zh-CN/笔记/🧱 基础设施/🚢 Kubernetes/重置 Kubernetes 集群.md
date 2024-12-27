---
tags:
  - 命令行/kubeadm
  - 软件/云原生/kubeadm
  - 开发/云原生/容器网络接口
  - 开发/云原生/容器网络接口/CNI
  - 命令行/systemd
  - 命令行/docker
  - 开发/容器化/Docker
  - 开发/云原生/Docker
  - 软件/云原生/docker
  - 命令行/containerd
  - 软件/云原生/containerd
  - 命令行/ipvsadm
  - 软件/云原生/ipvsadm
  - 计算机/操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Linux
---
# 重置 Kubernetes 集群

### 文档兼容性

| 主体         | 版本号 | 文档地址（如果有）                |
| ------------ | ------ | --------------------------------- |
| kubeadm   | 1.28   | https://v1-28.docs.kubernetes.io/ |

用于删除集群，删除 CNI 配置，清空 IPVS，重设 Docker 和 containerd 的命令：

::: code-group

```shell [多行]
sudo kubeadm reset --force
sudo rm -rf /etc/cni/net.d
sudo ipvsadm --clear
sudo systemctl restart docker
sudo systemctl restart containerd
```

```shell [单行]
sudo kubeadm reset --force && sudo rm -rf /etc/cni/net.d && sudo ipvsadm --clear && sudo systemctl restart docker && sudo systemctl restart containerd
```

:::
