---
tags:
  - 运维/云原生/Kubernetes
  - 运维/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes
  - 开发/云原生/Kubernetes/K8s
  - 命令行/systemd
  - 命令行/journalctl
  - 计算机/操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Linux
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 开发/虚拟化/cgroup
  - 命令行/kubeadm
  - 软件/云原生/kubeadm
  - 命令行/kubectl
  - 软件/云原生/kubectl
  - 软件/云原生/kubelet
  - 计算机/网络
---
# 通过 `kubeadm` 部署 Kubernetes 集群的时候的问题排查

### 文档兼容性

| 主体         | 版本号 | 文档地址（如果有）                |
| ------------ | ------ | --------------------------------- |
| Debian       | 11     |                                   |
| Kubernetes   | 1.28   | https://v1-28.docs.kubernetes.io/ |
| Docker       | 24.0.2 | https://docs.docker.com/          |
| containerd   | 1.7.6  |                                   |
| Linux kernel | 5.10.0 |                                   |

### `malformed header: missing HTTP content-type`

```shell
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
I1007 18:04:31.944913   61969 kubeletfinalize.go:134] [kubelet-finalize] Restarting the kubelet to enable client certificate rotation
rpc error: code = Unknown desc = malformed header: missing HTTP content-type
unable to create deployment
```

请通过 `systemd` 检查 `kubelet` 是否运行正常，也可以直接通过 `journalctl -xeu kubelet` 来查看 `kubelet` 最后的日志。

首先确定你是否有添加 `--skip-phases=addon/kube-proxy` 参数去执行 `kubeadm init`，如果没有，你可能需要先排查一下 `kube-proxy` 或者说 HAProxy 的问题。

### `net/http: request canceled (Client.Timeout exceeded while awaiting headers)`

```shell
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
I1007 17:25:43.478404   54691 kubeletfinalize.go:134] [kubelet-finalize] Restarting the kubelet to enable client certificate rotation
Put "https://10.24.0.2:6443/api/v1/namespaces/kube-system/services/kube-dns?timeout=10s": net/http: request canceled (Client.Timeout exceeded while awaiting headers)
unable to create/update the DNS service
```

请通过 `systemd` 检查 `kubelet` 是否运行正常，也可以直接通过 `journalctl -xeu kubelet` 来查看 `kubelet` 最后的日志。

首先确定你是否有添加 `--skip-phases=addon/kube-proxy` 参数去执行 `kubeadm init`，如果没有，你可能需要先排查一下 `kube-proxy` 或者说 HAProxy 的问题。
### `failed to allocate IP <IP>: provided IP is already allocated`

```shell
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
I1007 18:02:10.780271   60063 kubeletfinalize.go:134] [kubelet-finalize] Restarting the kubelet to enable client certificate rotation
Service "kube-dns" is invalid: spec.clusterIPs: Invalid value: []string{"10.96.0.10"}: failed to allocate IP 10.96.0.10: provided IP is already allocated
unable to create/update the DNS service
```

请通过 `systemd` 检查 `kubelet` 是否运行正常，也可以直接通过 `journalctl -xeu kubelet` 来查看 `kubelet` 最后的日志。

首先确定你是否有添加 `--skip-phases=addon/kube-proxy` 参数去执行 `kubeadm init`，如果没有，你可能需要先排查一下 `kube-proxy` 或者说 HAProxy 的问题。

### `kubelet` 在 `journalctl` 日志中的的 `Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory` 错误

```shell
E1007 18:12:48.784251   62982 remote_runtime.go:294] "ListPodSandbox with filter from runtime service failed" err="rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory\"" filter="nil"
10月 07 18:12:48 node1 kubelet[62982]: E1007 18:12:48.784310   62982 kuberuntime_sandbox.go:297] "Failed to list pod sandboxes" err="rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory\""
10月 07 18:12:48 node1 kubelet[62982]: E1007 18:12:48.784346   62982 generic.go:238] "GenericPLEG: Unable to retrieve pods" err="rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory\""
10月 07 18:12:49 node1 kubelet[62982]: E1007 18:12:49.785335   62982 remote_runtime.go:294] "ListPodSandbox with filter from runtime service failed" err="rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory\"" filter="nil"
10月 07 18:12:50 node1 kubelet[62982]: E1007 18:12:50.786291   62982 kuberuntime_sandbox.go:297] "Failed to list pod sandboxes" err="rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory\""
10月 07 18:12:50 node1 kubelet[62982]: E1007 18:12:50.786324   62982 generic.go:238] "GenericPLEG: Unable to retrieve pods" err="rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory\""
10月 07 18:12:51 node1 kubelet[62982]: E1007 18:12:51.182257   62982 remote_runtime.go:633] "Status from runtime service failed" err="rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory\""
10月 07 18:12:51 node1 kubelet[62982]: E1007 18:12:51.213930   62982 remote_runtime.go:407] "ListContainers with filter from runtime service failed" err="rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory\"" filter="&ContainerFilter{Id:,State:nil,PodSandboxId:,LabelSelector:map[string]string{},}"
10月 07 18:12:51 node1 kubelet[62982]: E1007 18:12:51.213991   62982 container_log_manager.go:185] "Failed to rotate container logs" err="failed to list containers: rpc error: code = Unavailable desc = connection error: desc = \"transport: Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory\""
10月 07 18:12:51 node1 kubelet[62982]: W1007 18:12:51.787660   62982 logging.go:59] [core] [Channel #1 SubChannel #2] grpc: addrConn.createTransport failed to connect to {
10月 07 18:12:51 node1 kubelet[62982]:   "Addr": "/run/containerd/containerd.sock",
10月 07 18:12:51 node1 kubelet[62982]:   "ServerName": "/run/containerd/containerd.sock",
10月 07 18:12:51 node1 kubelet[62982]:   "Attributes": null,
10月 07 18:12:51 node1 kubelet[62982]:   "BalancerAttributes": null,
10月 07 18:12:51 node1 kubelet[62982]:   "Type": 0,
10月 07 18:12:51 node1 kubelet[62982]:   "Metadata": null
10月 07 18:12:51 node1 kubelet[62982]: }. Err: connection error: desc = "transport: Error while dialing: dial unix /run/containerd/containerd.sock: connect: no such file or directory"
```

是否有参照 [配置 cgroup 驱动 | Kubernetes](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) 配置过 CGroup Driver？如果没有，可以参考 [[准备 Kubernetes 节点裸金属虚拟机]] 或者 [Error during kubeadm init - addon phase with coreDNS · Issue #2699 · kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues/2699) Issue 中的脚本进行配置：

> ```shell
> # make a copy of the default containerd configuration
> containerd config default \| sudo tee /etc/containerd/config.toml
>
> # set to use systemd
> sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml
>
> # adjust pause image to what's actually installed
> PAUSE_IMAGE=$(kubeadm config images list \| grep pause)
> sudo -E sed -i "s,sandbox_image = .*,sandbox_image = \"$PAUSE_IMAGE\",g" /etc/containerd/config.toml
>
> # restart the containerd service
> sudo systemctl enable containerd
> sudo systemctl restart container
> ```
## 参考资料

[Error during kubeadm init - addon phase with coreDNS · Issue #2699 · kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues/2699)
