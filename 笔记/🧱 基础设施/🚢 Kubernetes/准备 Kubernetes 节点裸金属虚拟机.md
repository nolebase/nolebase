---
tags:
  - 开发/云原生
  - 计算机/计算机科学/CS/虚拟化
  - 开发/云原生/Kubernetes
  - 开发/容器化
  - 开发/虚拟化
  - 开发/容器化/Docker
  - 开发/云原生/Docker
  - 命令行/kubectl
  - 命令行/kubeadm
  - 命令行/containerd
  - 命令行/docker
  - 软件/云原生/kubeadm
  - 软件/云原生/kubelet
  - 软件/云原生/kubectl
  - 软件/云原生/containerd
  - 软件/云原生/docker
  - 开发/虚拟化/cgroup
  - 命令行/systemd
  - 命令行/journalctl
  - 计算机/操作系统/Linux
  - 操作系统/Linux
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 命令行/sysctl
  - 计算机科学/内核/内核参数
  - 运维/内核
  - 命令行/apt
---
# 准备 Kubernetes 节点裸金属虚拟机

### 文档兼容性

| 主体         | 版本号 | 文档地址（如果有）                |
| ------------ | ------ | --------------------------------- |
| Debian       | 11     |                                   |
| Kubernetes   | 1.28   | https://v1-28.docs.kubernetes.io/ |
| Docker       | 24.0.2 | https://docs.docker.com/          |
| containerd   | 1.7.6  |                                   |
| Linux kernel | 5.10.0 |                                   |

## 配置内核参数

```shell
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF
```

```shell
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
```

```shell
sudo sysctl --system
```

## 配置用于下载 `kubectl`，`kubeadm` 和 `kubelet` 的 `apt` 源

::: code-group

```shell [多行]
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl
sudo mkdir -p /etc/apt/keyrings/
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt update
```

```shell [单行]
sudo apt update && sudo apt install -y apt-transport-https ca-certificates curl && sudo mkdir -p /etc/apt/keyrings/ && curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg && echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list && sudo apt update
```

:::

安装并保持其版本号：

::: code-group

```shell [多行]
sudo apt install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

```shell [单行]
sudo apt install -y kubelet kubeadm kubectl && sudo apt-mark hold kubelet kubeadm kubectl
```

:::

## 初始化 `containerd` 的配置

::: code-group

```shell [多行]
sudo rm -rf /etc/containerd/config.toml
sudo containerd config default | sudo tee /etc/containerd/config.toml
sudo systemctl restart containerd
sudo systemctl restart docker
```

```shell [单行]
sudo rm -rf /etc/containerd/config.toml && sudo containerd config default | sudo tee /etc/containerd/config.toml && sudo systemctl restart containerd && sudo systemctl restart docker
```

:::
## 配置 CGroup

查看 Docker 用的 CGroup：

```shell
sudo docker info | grep -i cgroup
```

```shell
$ sudo docker info | grep -i cgroup
 Cgroup Driver: systemd
 Cgroup Version: 2
  cgroupns
```

如果是 `systemd` 的话，我们需要同步配置 `containerd` 也是 `systemd` 作为 CGroup Driver[^1] ：

::: code-group

```shell [多行]
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml
export PAUSE_IMAGE="$(kubeadm config images list | grep pause)"
sudo sed -i 's,sandbox_image = .*,sandbox_image = '\"$PAUSE_IMAGE\"',' /etc/containerd/config.toml
```

```shell [单行]
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml && export PAUSE_IMAGE="$(kubeadm config images list | grep pause)" && sudo sed -i 's,sandbox_image = .*,sandbox_image = '\"$PAUSE_IMAGE\"',' /etc/containerd/config.toml
```

:::

然后重启 `docker` 和 `containerd` 的 `systemd` 服务：

::: code-group

```shell [多行]
sudo systemctl restart containerd
sudo systemctl restart docker
```

```shell [单行]
sudo systemctl restart containerd && sudo systemctl restart docker
```

:::

[^1]: 对于，CGroup Driver，在 [容器运行时 | Kubernetes](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/) 和 [配置 cgroup 驱动 | Kubernetes](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) 文档中有讲解到，是 CRI 的一部分。
