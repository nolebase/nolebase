---
tags:
  - 运维/云原生/Kubernetes
  - 运维/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
  - 计算机/操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Linux
  - 开发/云原生/容器网络接口/CNI
  - 命令行/kubeadm
  - 软件/云原生/kubeadm
  - 命令行/kubectl
  - 软件/云原生/kubelet
  - 软件/云原生/kubectl
  - 运维
  - 开发/标记语言/YAML
---
# 为安装 CNI 使用 Kubeadm 准备一个 Kubernetes 集群

### 文档兼容性

| 主体         | 版本号 | 文档地址（如果有）                |
| ------------ | ------ | --------------------------------- |
| Debian       | 11     |                                   |
| Kubernetes   | 1.28   | <https://v1-28.docs.kubernetes.io/> |
| Docker       | 24.0.2 | <https://docs.docker.com/>          |
| containerd   | 1.7.6  |                                   |
| Linux kernel | 5.10.0 |                                   |

## 先决条件

- [[重置 Kubernetes 集群]]
- [[准备 Kubernetes 节点裸金属虚拟机]]

## 准备配置文件

我们用配置文件的形式来安装和部署 Kubernetes 集群，首先我们产出一下 部署用的配置文件：

```shell
sudo kubeadm config print init-defaults --kubeconfig ClusterConfiguration > kubeadm.yml
```

::: code-group

```yaml [高亮修改的部分]
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
bootstrapTokens:
- groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: abcdef.0123456789abcdef
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
localAPIEndpoint:
  # 这里填写控制平面节点的 IP
  advertiseAddress: 10.24.0.2 # [!code hl]
  bindPort: 6443
nodeRegistration:
  # 记得确认一下是否是使用的 containerd 和 UNIX Socket 是否配置到了这个路径上
  criSocket: unix:///var/run/containerd/containerd.sock
  imagePullPolicy: IfNotPresent
  # 这里填写我们的节点 1 的名字
  name: node1 # [!code hl]
  taints: null
---
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
apiServer:
  timeoutForControlPlane: 20m0s # 这里我们可以稍微调大一些 # [!code hl]
  # 这里可以添加一下你期望在生成 Kubernetes API Server
  # 证书的时候额外支持的 SAN（Subject Alternative Names）
  certSANs: # [!code hl]
   - node01 # [!code hl]
   - 10.24.0.2 # [!code hl]
   - k8s.ihome.cat # [!code hl]
certificatesDir: /etc/kubernetes/pki
clusterName: homelab-kubernetes-1 # 可以改成自己期望的集群名字 # [!code hl]
controllerManager: {}
dns: {}
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: registry.k8s.io
kubernetesVersion: 1.28.0
networking:
  # 选择一个喜欢的 Pod 使用的 CIDR，之后安装 Cilium 的时候也会用到
  podSubnet: 10.244.0.0/16 # [!code hl]
  dnsDomain: cluster.local
  serviceSubnet: 10.96.0.0/12
scheduler: {}
```

```yaml [高亮与默认配置对比后的差异]
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
bootstrapTokens:
- groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: abcdef.0123456789abcdef
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
localAPIEndpoint:
  # 这里填写控制平面节点的 IP
  advertiseAddress: 1.2.3.4 # [!code --]
  advertiseAddress: 10.24.0.2 # [!code ++]
  bindPort: 6443
nodeRegistration:
  # 记得确认一下是否是使用的 containerd 和 UNIX Socket 是否配置到了这个路径上
  criSocket: unix:///var/run/containerd/containerd.sock
  imagePullPolicy: IfNotPresent
  # 这里填写我们的节点 1 的名字
  name: node # [!code --]
  name: node1 # [!code ++]
  taints: null
---
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
apiServer:
  timeoutForControlPlane: 4m0s # 这里我们可以稍微调大一些 # [!code --]
  timeoutForControlPlane: 20m0s # 这里我们可以稍微调大一些 # [!code ++]
  # 这里可以添加一下你期望在生成 Kubernetes API Server
  # 证书的时候额外支持的 SAN（Subject Alternative Names）
  certSANs: # [!code ++]
   - node01 # [!code ++]
   - 10.24.0.2 # [!code ++]
   - k8s.ihome.cat # [!code ++]
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes # [!code --]
clusterName: homelab-kubernetes-1 # 可以改成自己期望的集群名字 # [!code ++]
controllerManager: {}
dns: {}
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: registry.k8s.io
kubernetesVersion: 1.28.0
networking:
  # 选择一个喜欢的 Pod 使用的 CIDR，之后安装 Cilium 的时候也会用到
  podSubnet: 10.244.0.0/16 # [!code ++]
  dnsDomain: cluster.local
  serviceSubnet: 10.96.0.0/12
scheduler: {}
```

:::

## 准备镜像

然后我们可以列出一下我们需要的镜像：

```shell
sudo kubeadm config images list --config kubeadm.yml
```

```shell
$ sudo kubeadm config images list --config kubeadm.yml
registry.k8s.io/kube-apiserver:v1.28.0
registry.k8s.io/kube-controller-manager:v1.28.0
registry.k8s.io/kube-scheduler:v1.28.0
registry.k8s.io/kube-proxy:v1.28.0
registry.k8s.io/pause:3.9
registry.k8s.io/etcd:3.5.9-0
registry.k8s.io/coredns/coredns:v1.10.1
```

提前预备好镜像：

```shell
sudo kubeadm config images pull --config kubeadm.yml
```

## 开始部署

```shell
sudo kubeadm init --config=kubeadm.yml --upload-certs --skip-phases=addon/kube-proxy --v=5 | tee kubeadm-init.log
```

- `--upload-certs`：方便后续同步和加入节点
- `--skip-phases=addon/kube-proxy`：根据 Cilium 的文档 [Installation using kubeadm — Cilium 1.14.2 documentation](https://docs.cilium.io/en/stable/installation/k8s-install-kubeadm/) 要求的添加参数 `--skip-phases`，如果你安装的是 Calico 或者其他的 CNI，请多阅读和参考他们的文档
- `--v=5`：将输出等级调到 5，这样的话，如果我们中途遇到了什么报错，可以看到准确的调用栈

执行：

```shell
$ sudo kubeadm init --config=kubeadm.yml --upload-certs --skip-phases=addon/kube-proxy --v=5 | tee kubeadm-init.log

...

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 10.24.0.2:6443 --token <加入集群使用的 TOKEN> \
	--discovery-token-ca-cert-hash sha256:365eab797f1503ad6d24809ad253323aa9c6990069d8b3b367078bdf188e0296
```

当我们看到 `Your Kubernetes control-plane has initialized successfully!` 字样之后就代表我们准备好了。

## 分发凭据

现在我们可以把 `kubectl` 需要的凭据文件复制给用户了。

> [!WARNING] ⚠️ 注意
> 这样的操作仅适用于部署和维护 Kubernetes 集群的第一个用户，或者 root 用户，对于其他用户而言，请参照 Kubernetes 文档中对于多用户和授权的描述来分配权限。

### 仅 root 用户使用或普通用户需要 sudoer 权限才能使用

有两个选择：

1. 复制为 `/root/.kube/config`
2. 我们在 root 用户下配置 `.bash_profile` 或者 `.zshrc`

#### 复制为 `/root/.kube/config`

```shell
mkdir -p /root/.kube
sudo cp -i /etc/kubernetes/admin.conf /root/.kube/config
sudo chown root:root /root/.kube/config
```

#### 复用配置文件路径

::: code-group

```shell [bash]
echo "export KUBECONFIG=/etc/kubernetes/admin.conf" > .bashrc
source .bashrc
```

```shell [zsh]
echo "export KUBECONFIG=/etc/kubernetes/admin.conf" > .zshrc
source .zshrc
```

:::

### 仅授权用户使用

```shell
mkdir -p $USERNAME/.kube
sudo cp -i /etc/kubernetes/admin.conf $USERNAME/.kube/config
sudo chown $USERNAME:$USERGROUP $USERNAME/.kube/config
```

### 仅我们自己使用

```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## 验证安装

这个时候我们使用 `kubectl` 验证安装：

### 查看 Node 列表

::: code-group

```shell [仅 root 用户使用]
sudo kubectl get nodes
```

```shell [仅我们自己使用]
kubectl get nodes
```

:::

如果看到输出了 `NotReady`，是正常的，因为我们跳过了 `kube-proxy` 安装和暂时没有配置 CNI，如果你现在通过

```shell
sudo systemctl status kubelet
```

观察 `kubelet` 的日志输出的话能够发现它会报错说 `cni plugin not initialized`。我们之后安装像是 Cilium 或者 Calico 这样的 CNI 插件之后就会恢复正常了。

### 查看 Pod 列表

::: code-group

```shell [仅 root 用户使用]
sudo kubectl get pods -n kube-system
```

```shell [仅我们自己使用]
kubectl get nodes -n kube-system
```

:::

## 添加其他节点

接下来可以在别的节点机器上执行它在上面的结果中输出的

```shell
kubeadm join 10.24.0.2:6443 --token <加入集群使用的 TOKEN> \
	--discovery-token-ca-cert-hash sha256:365eab797f1503ad6d24809ad253323aa9c6990069d8b3b367078bdf188e0296
```

命令来加入到集群。

当然如果你错过了这条消息，也可以通过[[创建加入集群的 Token 并输出命令]]中提到的：

```shell
sudo kubeadm token create --print-join-command
```

来创建和打印加入集群需要的 Token 和命令。
