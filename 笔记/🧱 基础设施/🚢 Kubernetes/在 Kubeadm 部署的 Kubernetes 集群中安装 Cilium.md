---
tags:
  - 运维/云原生/Kubernetes
  - 运维/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes
  - 运维/Cilium
  - 命令行/cilium
  - 软件/云原生/Cilium
  - 命令行/kubeadm
  - 软件/云原生/kubeadm
  - 软件/云原生/kube-proxy
  - 计算机/网络/Cilium
  - 命令行/helm
  - 软件/云原生/helm
  - 开发/标记语言/YAML
---
# 在 Kubeadm 部署的 Kubernetes 集群中安装 Cilium

### 文档兼容性

| 主体       | 版本号 | 文档地址（如果有）                |
| ---------- | ------ | --------------------------------- |
| Kubernetes | 1.28   | [https://v1-28.docs.kubernetes.io/](https://v1-28.docs.kubernetes.io/) |
| Cilium     | 1.14.2 | [https://docs.cilium.io/en/v1.14/](https://docs.cilium.io/en/v1.14/)  |
| helm         | v3.9.0 | [https://helm.sh/docs/](https://helm.sh/docs/)             |

## 先决条件

- [[为安装 CNI 使用 Kubeadm 准备一个 Kubernetes 集群]]

## 准备配置文件

创建一个名为 `cilium-values.yml` 的配置文件并放到你喜欢的地方，之后我们需要使用 `cilium install` 根据这份配置文件产出最终 `helm install` 需要的配置文件。[^1]

对于一个根据[先决条件](#先决条件)中的要求，我们可以撰写如下的文件内容：

```shell
# 默认打开 Hubble 的 Relay 和 UI，这样之后我们就不用再单独执行 cilium hubble enable 来启用了
hubble:
  relay:
    enabled: true
  ui:
    enabled: true


ipam:
  # 可以阅读 https://docs.cilium.io/en/stable/network/concepts/ipam/kubernetes/ 了解更多
  mode: 'kubernetes'
  operator:
    # 此处的字面量需要和我们的 Kubernetes 在创建的时候指定的 Pod CIDR 相同
    # 对于先决条件中提及的安装流程，我们在 kubeadm.yaml 中配置了这个相同的字面量，所以到这里我们也使用相同的字面量即可
    clusterPoolIPv4PodCIDRList: '10.244.0.0/16'

# 如果上面指定了 ipam.operator.clusterPoolIPv4PodCIDRList 那么这里就也得配置成一样的字面量
ipv4NativeRoutingCIDR: '10.244.0.0/16'

# 如果 tunnel 保持打开（没有安装 kube-proxy 的默认情况下），那么需要开启下面的两个选项
enableIPv4Masquerade: true
enableIPv6Masquerade: true
```

对于 `ipam.mode` 为 `kubernetes`，你可以在 [Cluster Scope (Default) — Cilium 1.14.2 documentation](https://docs.cilium.io/en/stable/network/concepts/ipam/cluster-pool/) 和 [Kubernetes Host Scope — Cilium 1.14.2 documentation](https://docs.cilium.io/en/stable/network/concepts/ipam/kubernetes/) 了解更多。

## 产出 `helm` 所需的配置文件

```shell
sudo cilium install --version 1.14.2 --values cilium-values.yml --dry-run-helm-values > cilium-values-initial.yml
```

我们可以使用

```shell
cat cilium-values-initial.yml
```

来预览我们的配置文件：

```yaml
cluster:
  name: kubernetes
enableIPv4Masquerade: true
enableIPv6Masquerade: true
hubble:
  relay:
    enabled: true
  ui:
    enabled: true
ipam:
  mode: kubernetes
  operator:
    clusterPoolIPv4PodCIDRList: 10.244.0.0/16
ipv4NativeRoutingCIDR: 10.244.0.0/16
# 注意确认一下 Kubernetes API Server 的 IP 是否是这个
k8sServiceHost: 10.24.0.2 # [!code hl]
# 注意确认一下 Kubernetes API Server 的端口是否是这个
k8sServicePort: 6443 # [!code hl]
kubeProxyReplacement: strict
operator:
  replicas: 1
serviceAccounts:
  cilium:
    name: cilium
  operator:
    name: cilium-operator
tunnel: vxlan
```

## 使用 `helm` 安装

先添加一下 Repo

```shell
sudo helm repo add cilium https://helm.cilium.io/
```

然后我们可以使用

```shell
sudo helm install cilium cilium/cilium --namespace kube-system --values cilium-values-initial.yaml
```

来进行安装：

```shell
$ sudo helm install cilium cilium/cilium --namespace kube-system --values cilium-values-initial.yaml
NAME: cilium
LAST DEPLOYED: Sun Oct  8 11:56:57 2023
NAMESPACE: kube-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
You have successfully installed Cilium with Hubble Relay and Hubble UI.

Your release version is 1.14.2.

For any further help, visit https://docs.cilium.io/en/v1.14/gettinghelp
```

然后我们过一会儿之后就可以用

```shell
sudo cilium status --wait
```

来查看 cilium 的状态啦[^2]：

```shell
$ sudo cilium status --wait
    /¯¯\
 /¯¯\__/¯¯\    Cilium:             OK
 \__/¯¯\__/    Operator:           OK
 /¯¯\__/¯¯\    Envoy DaemonSet:    disabled (using embedded mode)
 \__/¯¯\__/    Hubble Relay:       OK
    \__/       ClusterMesh:        disabled

Deployment             hubble-relay       Desired: 1, Ready: 1/1, Available: 1/1
Deployment             hubble-ui          Desired: 1, Ready: 1/1, Available: 1/1
Deployment             cilium-operator    Desired: 1, Ready: 1/1, Available: 1/1
DaemonSet              cilium             Desired: 3, Ready: 3/3, Available: 3/3
Containers:            cilium             Running: 3
                       hubble-relay       Running: 1
                       hubble-ui          Running: 1
                       cilium-operator    Running: 1
Cluster Pods:          4/6 managed by Cilium
Helm chart version:    1.14.2
Image versions         cilium             quay.io/cilium/cilium:v1.14.2@sha256:6263f3a3d5d63b267b538298dbeb5ae87da3efacf09a2c620446c873ba807d35: 3
                       hubble-relay       quay.io/cilium/hubble-relay:v1.14.2@sha256:a89030b31f333e8fb1c10d2473250399a1a537c27d022cd8becc1a65d1bef1d6: 1
                       hubble-ui          quay.io/cilium/hubble-ui:v0.12.0@sha256:1c876cfa1d5e35bc91e1025c9314f922041592a88b03313c22c1f97a5d2ba88f: 1
                       hubble-ui          quay.io/cilium/hubble-ui-backend:v0.12.0@sha256:8a79a1aad4fc9c2aa2b3e4379af0af872a89fcec9d99e117188190671c66fc2e: 1
                       cilium-operator    quay.io/cilium/operator-generic:v1.14.2@sha256:52f70250dea22e506959439a7c4ea31b10fe8375db62f5c27ab746e3a2af866d: 1
```

## 运行连接可用性测试

接下来我们就可以进行测试了，这个测试过程中 Cilium 会利用自己内置的一些用例来对网络策略，网络可用性，连接可达性来进行测试：

```shell
sudo cilium connectivity test
```

只要看到下面的信息就说明安装好了：

```shell
$ sudo cilium connectivity test

...

✅ All 42 tests (295 actions) successful, 13 tests skipped, 0 scenarios skipped.
```

## 错误排查

如果测试失败，我们可以用

```shell
sudo kubectl get pods -n kube-system
```

查看 `cilium` 和 `cilium-operator` 的运行状况，也可以通过

```shell
sudo systemctl status kubelet
```

查看一下 `kubelet` 的运行状况，然后针对性进行排查。

### 因为 CIDR 冲突导致的 Host 网络异常

#### 我的集群配置

在我的例子中，我的主路由在 `10.0.0.1`，我的 Kubernetes 有两个 IP：

1. 一个是依附于主路由的 DHCP 分配的 `10.0.1.24`
2. 一个是我专门为构建 Kubernetes 集群所配置静态 IP `10.24.0.2`，使用的网段 CIDR 是 `10.24.0.0/16`

#### 表层异常

如果安装 Cilium 之后用

```shell
sudo kubectl get pods -n kube-system
```

去检查 `kube-system`（Kubernetes 重要组件所处的命名空间）或者别的业务 Pod 所处的命名空间下面的 Pod 的时候，你可能会发现 `coredns` 的 Pod 或者业务 Pod 无法创建了，他们可能会处于下面几种错误状态中：

- `ImagePullBackOff`：比如 `docker.io` 或者 `quay.io` 或者 `ghcr.io` 的镜像拉不动（前提是你也得确定你的网络是有上层代理帮你加速到国际互联网的）
- `ErrImagePull`：如果上面的 `ImagePullBackOff` 状态一直无法解决就会这样
- `CrashLoopBackOff`：比如业务 Pod 中会尝试访问外部互联网拉取信息，或者依赖的别的 Pod 出现了异常，无法建立与另一个 Pod 的 TCP 连接或者进行 HTTP 请求；在我的例子中是：
	- 一个服务 Pod 连不到 Redis 所在的 Pod 了，因为 Redis Pod 的镜像拉不下来
	- 一个基于互联网拉取配置的 Pod 连不到互联网了，无法拉取到它希望的配置文件，写了 panic 和 fatal 所以一直在 crash

#### 深层原因

如果我们这个时候检查一下路由表：

```shell
$ ip route
default via 10.0.0.1 dev eth0
10.0.0.0/24 via 10.0.2.208 dev cilium_host proto kernel src 10.0.2.208 mtu 1450
10.0.0.0/16 dev eth0 proto kernel scope link src 10.0.0.124
10.0.1.0/24 via 10.0.2.208 dev cilium_host proto kernel src 10.0.2.208 mtu 1450
10.0.2.0/24 via 10.0.2.208 dev cilium_host proto kernel src 10.0.2.208
10.0.2.208 dev cilium_host proto kernel scope link
10.24.0.0/24 dev eth1 proto kernel scope link src 10.24.0.2
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown
```

我们可以发现 `10.0.0.1` 的路由被改变了，如果你的网关路由和我一样是 `eth0` 上的 `10.0.0.1` 的话，那说明我们的 CIDR 冲突了，我们得解决一下 Cilium 可分配和应该接管的 CIDR。所以综上所述，出现这个问题最主要的原因可能是 Cilium 和 Kubernetes 节点所属的主路由所使用的 CIDR，或者说和 DNS 和网关路由器所使用的 CIDR 和 IP 冲突了。
但这个问题也许会体现在 `ImagePullBackOff` 和 `ErrImagePull` 上，也许不会，但是由于 Cilium 安装之后会尝试接管 Pod，并且重新创建 Pod，所以相比之下 `ImagePullBackOff` 的错误会更加容易发现，所以如果你也遇到了不知道是不是这样的原因的问题，你也可以试着看看是不是和镜像相关，看看路由表是不是也是有一样的问题。

#### 为什么会冲突？

如果你按照 Cilium 官方的指南直接用

```shell
sudo cilium install --version 1.14.2
```

这样的命令在 Kubernetes 集群中安装，那 `cilium` 是默认使用的 [Cluster Scope (Default)](https://docs.cilium.io/en/stable/network/concepts/ipam/cluster-pool/#ipam-crd-cluster-pool) 作为 IPAM 的模式来运行，而 [Cluster Scope (Default)](https://docs.cilium.io/en/stable/network/concepts/ipam/cluster-pool/#ipam-crd-cluster-pool) 好巧不巧使用的默认的 CIDR 是 `10.0.0.0/8`[^3]，如果你学过 CIDR（没有学过也不要紧，可以看看[[IP 后面的斜杠是什么？]]），你可以看出来 `10.0.0.0/8` 意味着 `10.` 后面的数字都是可以被分配的，这也就意味着 `10.0.0.1` 也是 `cilium` 接管的流量的一部分了，所以会出现这样的问题。

正确的做法是我们在安装的时候给参数或者在给 `cilium install` 使用的或者 `helm install` 使用的配置文件中配置一下 `ipam.operator.clusterPoolIPv4PodCIDRList` 和 `ipv4NativeRoutingCIDR` 这两个字段，配置的字面量与 Kubernetes 集群的配置相同即可。如果你想要删除 Cilium 重新部署，可以参考一下[[完全卸载使用 Helm 安装的 Cilium]] 这篇文档的指引。

### Pod 网络异常

#### 我的集群配置

在我的例子中，我的主路由在 `10.0.0.1`，我的 Kubernetes 有两个 IP：

1. 一个是依附于主路由的 DHCP 分配的 `10.0.1.24`
2. 一个是我专门为构建 Kubernetes 集群所配置静态 IP `10.24.0.2`，使用的网段 CIDR 是 `10.24.0.0/16`

这样的问题有以下几个病症体现。

#### Hubble Relay 组件报错

输出：

```shell
$ sudo cilium connectivity test
... # 省略

ℹ️  Skipping IPCache check
🔭 Enabling Hubble telescope...
⚠️  Unable to contact Hubble Relay, disabling Hubble telescope and flow validation: rpc error: code = Unavailable desc = connection error: desc = "transport: Error while dialing: dial tcp [::1]:4245: connect: connection refused"
ℹ️  Expose Relay locally with:
   cilium hubble enable
   cilium hubble port-forward&
ℹ️  Cilium version: 1.14.2
🏃 Running tests...
```

这说明在进行 Hubble 相关组件的连接可用性测试的时候出现了问题（前提是你确实配置了要开启 Hubble）

#### `[no-policies]` 用例测试失败

::: details 输出

```shell
[=] Test [no-policies]
.
  [-] Scenario [no-policies/pod-to-world]
  [.] Action [no-policies/pod-to-world/http-to-one.one.one.one-0: cilium-test/client-78f9dffc84-846qk (10.244.1.121) -> one.one.one.one-http (one.one.one.one:80)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 http://one.one.one.one:80" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client-78f9dffc84-846qk during action http-to-one.one.one.one-0
  📄 No flows recorded for peer one.one.one.one-http during action http-to-one.one.one.one-0
  [.] Action [no-policies/pod-to-world/https-to-one.one.one.one-0: cilium-test/client-78f9dffc84-846qk (10.244.1.121) -> one.one.one.one-https (one.one.one.one:443)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 https://one.one.one.one:443" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client-78f9dffc84-846qk during action https-to-one.one.one.one-0
  📄 No flows recorded for peer one.one.one.one-https during action https-to-one.one.one.one-0
  [.] Action [no-policies/pod-to-world/https-to-one.one.one.one-index-0: cilium-test/client-78f9dffc84-846qk (10.244.1.121) -> one.one.one.one-https-index (one.one.one.one:443)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 https://one.one.one.one:443/index.html" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client-78f9dffc84-846qk during action https-to-one.one.one.one-index-0
  📄 No flows recorded for peer one.one.one.one-https-index during action https-to-one.one.one.one-index-0
  [.] Action [no-policies/pod-to-world/http-to-one.one.one.one-1: cilium-test/client2-59b578d4bb-hv5b2 (10.244.1.252) -> one.one.one.one-http (one.one.one.one:80)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 http://one.one.one.one:80" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client2-59b578d4bb-hv5b2 during action http-to-one.one.one.one-1
  📄 No flows recorded for peer one.one.one.one-http during action http-to-one.one.one.one-1
  [.] Action [no-policies/pod-to-world/https-to-one.one.one.one-1: cilium-test/client2-59b578d4bb-hv5b2 (10.244.1.252) -> one.one.one.one-https (one.one.one.one:443)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 https://one.one.one.one:443" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client2-59b578d4bb-hv5b2 during action https-to-one.one.one.one-1
  📄 No flows recorded for peer one.one.one.one-https during action https-to-one.one.one.one-1
  [.] Action [no-policies/pod-to-world/https-to-one.one.one.one-index-1: cilium-test/client2-59b578d4bb-hv5b2 (10.244.1.252) -> one.one.one.one-https-index (one.one.one.one:443)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 https://one.one.one.one:443/index.html" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client2-59b578d4bb-hv5b2 during action https-to-one.one.one.one-index-1
  📄 No flows recorded for peer one.one.one.one-https-index during action https-to-one.one.one.one-index-1
```

:::

#### `[to-entities-world]` 用例失败

::: details 输出

```
[=] Test [to-entities-world]
.
  ℹ️  📜 Applying CiliumNetworkPolicy 'client-egress-to-entities-world' to namespace 'cilium-test'..
  [-] Scenario [to-entities-world/pod-to-world]
  [.] Action [to-entities-world/pod-to-world/http-to-one.one.one.one-0: cilium-test/client-78f9dffc84-846qk (10.244.1.121) -> one.one.one.one-http (one.one.one.one:80)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 http://one.one.one.one:80" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client-78f9dffc84-846qk during action http-to-one.one.one.one-0
  📄 No flows recorded for peer one.one.one.one-http during action http-to-one.one.one.one-0
  [.] Action [to-entities-world/pod-to-world/https-to-one.one.one.one-0: cilium-test/client-78f9dffc84-846qk (10.244.1.121) -> one.one.one.one-https (one.one.one.one:443)]
  [.] Action [to-entities-world/pod-to-world/https-to-one.one.one.one-index-0: cilium-test/client-78f9dffc84-846qk (10.244.1.121) -> one.one.one.one-https-index (one.one.one.one:443)]
  [.] Action [to-entities-world/pod-to-world/http-to-one.one.one.one-1: cilium-test/client2-59b578d4bb-hv5b2 (10.244.1.252) -> one.one.one.one-http (one.one.one.one:80)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 http://one.one.one.one:80" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client2-59b578d4bb-hv5b2 during action http-to-one.one.one.one-1
  📄 No flows recorded for peer one.one.one.one-http during action http-to-one.one.one.one-1
  [.] Action [to-entities-world/pod-to-world/https-to-one.one.one.one-1: cilium-test/client2-59b578d4bb-hv5b2 (10.244.1.252) -> one.one.one.one-https (one.one.one.one:443)]
  [.] Action [to-entities-world/pod-to-world/https-to-one.one.one.one-index-1: cilium-test/client2-59b578d4bb-hv5b2 (10.244.1.252) -> one.one.one.one-https-index (one.one.one.one:443)]
  ℹ️  📜 Deleting CiliumNetworkPolicy 'client-egress-to-entities-world' from namespace 'cilium-test'..
```

:::

#### `[to-cidr-external]` 用例失败

::: details 输出

```shell
[=] Test [to-cidr-external]
.
  ℹ️  📜 Applying CiliumNetworkPolicy 'client-egress-to-cidr' to namespace 'cilium-test'..
  [-] Scenario [to-cidr-external/pod-to-cidr]
  [.] Action [to-cidr-external/pod-to-cidr/external-1111-0: cilium-test/client-78f9dffc84-846qk (10.244.1.121) -> external-1111 (1.1.1.1:443)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 https://1.1.1.1:443" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client-78f9dffc84-846qk during action external-1111-0
  📄 No flows recorded for peer external-1111 during action external-1111-0
  [.] Action [to-cidr-external/pod-to-cidr/external-1111-1: cilium-test/client2-59b578d4bb-hv5b2 (10.244.1.252) -> external-1111 (1.1.1.1:443)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 https://1.1.1.1:443" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client2-59b578d4bb-hv5b2 during action external-1111-1
  📄 No flows recorded for peer external-1111 during action external-1111-1
  [.] Action [to-cidr-external/pod-to-cidr/external-1001-0: cilium-test/client-78f9dffc84-846qk (10.244.1.121) -> external-1001 (1.0.0.1:443)]
  [.] Action [to-cidr-external/pod-to-cidr/external-1001-1: cilium-test/client2-59b578d4bb-hv5b2 (10.244.1.252) -> external-1001 (1.0.0.1:443)]
  ℹ️  📜 Deleting CiliumNetworkPolicy 'client-egress-to-cidr' from namespace 'cilium-test'..
```

:::

#### `[to-cidr-external-knp]` 用例失败

::: details 输出

```shell
[=] Test [to-cidr-external-knp]
.
  ℹ️  📜 Applying KubernetesNetworkPolicy 'client-egress-to-cidr' to namespace 'cilium-test'..
  [-] Scenario [to-cidr-external-knp/pod-to-cidr]
  [.] Action [to-cidr-external-knp/pod-to-cidr/external-1111-0: cilium-test/client-78f9dffc84-846qk (10.244.1.121) -> external-1111 (1.1.1.1:443)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 https://1.1.1.1:443" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client-78f9dffc84-846qk during action external-1111-0
  📄 No flows recorded for peer external-1111 during action external-1111-0
  [.] Action [to-cidr-external-knp/pod-to-cidr/external-1111-1: cilium-test/client2-59b578d4bb-hv5b2 (10.244.1.252) -> external-1111 (1.1.1.1:443)]
  ❌ command "curl -w %{local_ip}:%{local_port} -> %{remote_ip}:%{remote_port} = %{response_code} --silent --fail --show-error --output /dev/null --connect-timeout 2 --max-time 10 --retry 3 --retry-all-errors --retry-delay 3 https://1.1.1.1:443" failed: command terminated with exit code 28
  ℹ️  curl output:


  📄 No flows recorded for peer cilium-test/client2-59b578d4bb-hv5b2 during action external-1111-1
  📄 No flows recorded for peer external-1111 during action external-1111-1
```

:::

#### 在 Pod 中使用 `curl` 直接访问 `baidu.com` 和 `1.1.1.1` 也都失败

```shell
sudo kubectl run -it --rm test --image=curlimages/curl --restart=Never -- /bin/sh
```

如果使用上面的命令进入到一个用于测试网络连接的 `curl` 镜像中请求 `baidu.com` 和 `1.1.1.1`，你也可以发现我们的请求要么被挂起然后超时，要么直接返回说无法解析，或者没有路由。

#### 在 Pod 中使用 `cilium-health status` 是正常的

Cilium 提供了 `cilium-health status` 命令可以用于测试集群内的通信，我们可以先用

```shell
sudo kubectl get pods -n kube-system
```

找到 Cilium 的容器，然后执行：

```shell
sudo kubectl -n kube-system exec -ti <Pod ID> -- cilium-health status
```

效果：

``` shell
$ sudo kubectl -n kube-system exec -ti cilium-8l4r7 -- cilium-health status
Defaulted container "cilium-agent" out of: cilium-agent, config (init), mount-cgroup (init), apply-sysctl-overwrites (init), mount-bpf-fs (init), clean-cilium-state (init), install-cni-binaries (init)
Probe time:   2023-10-06T11:03:33Z
Nodes:
  cluster.local/node3 (localhost):
    Host connectivity to 10.24.0.5:
      ICMP to stack:   OK, RTT=682.798µs
      HTTP to agent:   OK, RTT=372.599µs
    Endpoint connectivity to 10.233.66.239:
      ICMP to stack:   OK, RTT=545.998µs
      HTTP to agent:   OK, RTT=652.498µs
  cluster.local/node1:
    Host connectivity to 10.24.0.2:
      ICMP to stack:   OK, RTT=890.197µs
      HTTP to agent:   OK, RTT=921.697µs
    Endpoint connectivity to 10.233.64.91:
      ICMP to stack:   OK, RTT=927.897µs
      HTTP to agent:   OK, RTT=879.597µs
  cluster.local/node2:
    Host connectivity to 10.24.0.4:
      ICMP to stack:   OK, RTT=896.297µs
      HTTP to agent:   OK, RTT=798.897µs
    Endpoint connectivity to 10.233.65.82:
      ICMP to stack:   OK, RTT=880.497µs
      HTTP to agent:   OK, RTT=1.102096ms
```

#### 是什么造成的？

上面的几个问题都体现在外部网络的访问，无论是基于 CIDR 的访问，还是域名访问，无论是有规则还是无规则都无法通过 `curl` 去请求成功，如果我们仔细观察这几个测试用例的话我们能发现测试目标都是 `one.one.one.one` 和 `1.1.1.1` ，是 Cloudflare 的 DNS，那这里可能会有几种情况：

1. 如果说我们宿主机也无法访问
	1. 如果是在中国大陆部署的机器，是不是因为 `1.1.1.1` 被墙了，如果是的话，可以检查一下代理是否配置正确，节点是否选择正确
	2. 如果说代理正确的话，那可能你可以参考一下 [因为 CIDR 冲突导致的 Host 网络异常](#因为-cidr-冲突导致的-host-网络异常)部分是否匹配你正在遭遇的故障，也许是因为 CIDR 的冲突导致 DNS 或者路由挂了
2. 如果宿主机可以访问
	1. `kubelet` 正常吗？`cilium` 正常吗？如果 `kubelet` 报错说 `cni plugin not initialized`，也许是 `cilium` 的问题，可以先用 `sudo kubectl get pods -n kube-system` 寻找一下 `cilium` 的 Pod，然后通过 `sudo kubectl logs -f <Cilium Pod 的 ID>` 来排查
	2. 如果都正常的话，你可能遭遇了我也遭遇的问题。

我遭遇相似问题的时候使用了下面的配置去安装的 Cilium：

```yaml
hubble:
  relay:
    enabled: true
  ui:
    enabled: true

ipam:
  mode: 'kubernetes'
  operator:
    clusterPoolIPv4PodCIDRList: '10.244.0.0/16'

ipv4NativeRoutingCIDR: '10.244.0.0/16'
enableIPv4Masquerade: false # [!code hl]
enableIPv6Masquerade: false # [!code hl]
autoDirectNodeRoutes: true # [!code hl]
tunnel: disabled # [!code hl]
```

可以看到高亮的这几个选项和我在上面提到的安装的选项是不一样的。

1. 我提及到说我的 Kubernetes 集群中的节点都在同一个 `10.24.0.0/16` 子网，我以为这符合文档中的 L2 层网络，毕竟这个子网是直接由 Hyper-V 的虚拟网卡提供的，所以我打开了 `autoDirectNodeRoutes`，然后关掉 `tunnel`，也没有安装 `kube-proxy`
2. 又因为 `enableIPv4Masquerade` 和 `enableIPv6Masquerade` 和 `tunnel` 是相关的，因为 `tunnel` 打开之后也需要打开这两个选项，所以我错误地理解为关掉 `tunnel` 的时候也需要关闭这两个选项，所以也都配置为了 `false`

但是不知道为什么，这样的配置会导致 Pod 的网络出现问题，包括 Pod 到 Pod 的网络也会故障，我目前还不得而知原因。

#### 如何解决？

解决这个问题的关键就在于：

1. 我们如果没有安装 `kube-proxy`，我们需要激活 `tunnel`，你可以保持 `tunnel` 的配置为默认值（比如你可以删掉然后让 `cilium install` 帮你判断）
2. 因为我们激活了 `tunnel`，`autoDirectNodeRoutes` 和 `tunnel` 是互斥的，我们需要把 `autoDirectNodeRoutes` 关掉
3. 因为我们激活了 `tunnel`，`enableIPv4Masquerade` 和 `enableIPv6Masquerade` 都要开启，所以我们都配置为 `true`

#### 延伸阅读

- [Cannot reach external endpoint with service ip when the external endpoint is one of k8s node · Issue #16235 · cilium/cilium](https://github.com/cilium/cilium/issues/16235)
- [kubernetes - Can’t access the external network from pod (nginx-pod) - Stack Overflow](https://stackoverflow.com/questions/76432743/cant-access-the-external-network-from-pod-nginx-pod)
- [linux - Kubernetes Nodes are not reachable and cannot reach local network after installing cilium - Server Fault](https://serverfault.com/questions/1103034/kubernetes-nodes-are-not-reachable-and-cannot-reach-local-network-after-installi)
- [Pod cannot access external network · Issue #20085 · cilium/cilium](https://github.com/cilium/cilium/issues/20085)
- [CI: ConformanceAKS: curl succeeded while it should have failed due to incorrect exit code · Issue #22162 · cilium/cilium](https://github.com/cilium/cilium/issues/22162)
- [cilium connectivity test failures · Issue #673 · cilium/cilium-cli](https://github.com/cilium/cilium-cli/issues/673)
- [Cilium deployment fails to pass conn test and sonobuoy · Issue #8546 · kubernetes-sigs/kubespray](https://github.com/kubernetes-sigs/kubespray/issues/8546)

[^1]: 虽然 [Migrating a cluster to Cilium](https://docs.cilium.io/en/stable/installation/k8s-install-migration/) 是专门为迁移到 Cilium 准备的文档，如果我们是全新的安装，那这里面有的步骤是不需要遵循的，但是我们可以借鉴一下部分的操作。
[^2]: 在 [Installation using Helm](https://docs.cilium.io/en/stable/installation/k8s-install-helm/) 中讲解了如何使用 `helm` 进行安装，`helm` 安装和直接用 `cilium` 安装其实底层上而言是一样的，但是配置的过程不同，也可以阅读一下这篇文档来了解区别。
[^3]: 对于默认的 [Cluster Scope (Default)](https://docs.cilium.io/en/stable/network/concepts/ipam/cluster-pool/#check-for-conflicting-node-cidrs) 模式而言，Cilium 默认使用 `10.0.0.0/8` 作为 Pod 的 CIDR，不得不说是真的太野了，这样的 CIDR 返回将会覆盖整个 `10` IP 段，很多内网基础设施都是选择的 `10` 段，如果直接用默认配置肯定会出大问题。
