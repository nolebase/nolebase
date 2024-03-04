---
tags:
  - 开发/云原生/Kubernetes
  - 运维/云原生/Kubernetes
  - 运维/云原生/Kubernetes/K8s
  - 命令行/kubeadm
  - 软件/云原生/kubeadm
  - 开发/云原生
  - 开发/云原生/Kubernetes/K8s
  - 计算机/操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Linux
---
# 创建加入集群的 Token 并输出命令

### 文档兼容性

| 主体    | 版本号 | 文档地址（如果有）                |
| ------- | ------ | --------------------------------- |
| kubeadm | 1.28   | https://v1-28.docs.kubernetes.io/ |

创建集群之后我们可以用下面的命令输出其他节点加入集群时使用的命令：

```shell
sudo kubeadm token create --print-join-command
```

效果：

```shell
$ sudo kubeadm token create --print-join-command
kubeadm join 10.24.0.2:6443 --token abcdef.0123456789abcdef --discovery-token-ca-cert-hash sha256:206e3d7b40a7b52e3ca1f9553a9384f3947b362d4878afcf007671f91e3c3efc
```
