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
  - 运维/云原生/Kubernetes/K8s
  - 开发/云原生/Kubernetes/K8s
  - 运维/云原生/Kubernetes
  - 计算机/网络
  - 运维/Cilium
  - 命令行/cilium
  - 软件/云原生/Cilium
  - 软件/云原生/kube-proxy
  - 计算机/网络/Calico
  - 运维/Calico
  - 软件/云原生/Calico
  - 计算机/网络/Cilium
  - 开发/标记语言/YAML
---
# ”灾难性“地将 Homelab K8s 的 Calico 迁移到 Cilium

### 文档兼容性

| 主体         | 版本号 | 文档地址（如果有）                |
| ------------ | ------ | --------------------------------- |
| Debian       | 11     |                                   |
| Kubernetes   | 1.28   | <https://v1-28.docs.kubernetes.io/> |
| Docker       | 24.0.2 | <https://docs.docker.com/>          |
| containerd   | 1.7.6  |                                   |
| Linux kernel | 5.10.0 |                                   |
| Calico       |        |                                   |
| Cilium       | 1.14.2 | <https://docs.cilium.io/en/v1.14/>  |
| helm         | v3.9.0 | <https://helm.sh/docs/>             |

## 简单删除 Calico 之后安装 Cilium

### 安装 Cilium

根据 [Cilium Quick Installation](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/) 的要求运行：

```shell
sudo cilium install --version 1.14.2
```

来安装 Cilium。

等待一段时间之后发现我们的 KubeSphere 面板不再响应了，而是返回了 502 错误，这个时候我们检查一下 KubeSphere 的 API 服务器：

```shell
$ sudo kubectl describe pods -n kubesphere-system ks-apiserver-6cd95fb98f-kvdkb

...

Events:
  Type     Reason                  Age                From     Message
  ----     ------                  ----               ----     -------
  Warning  Unhealthy               22m (x8 over 23m)  kubelet  Liveness probe failed: Get "http://10.233.90.228:9090/kapis/version": dial tcp 10.233.90.228:9090: connect: invalid argument
  Normal   Killing                 22m                kubelet  Container ks-apiserver failed liveness probe, will be restarted
  Normal   Pulled                  22m                kubelet  Container image "kubesphere/ks-apiserver:v3.3.1" already present on machine
  Normal   Created                 22m                kubelet  Created container ks-apiserver
  Normal   Started                 22m                kubelet  Started container ks-apiserver
  Warning  FailedCreatePodSandBox  20m                kubelet  Failed to create pod sandbox: rpc error: code = Unknown desc = failed to set up sandbox container "ed593ddb9cd630d2fc136e83c31d464cb97fa70712b2f4f85f0f5f73b38f055b" network for pod "ks-apiserver-6cd95fb98f-kvdkb": networkPlugin cni failed to set up pod "ks-apiserver-6cd95fb98f-kvdkb_kubesphere-system" network: unable to connect to Cilium daemon: failed to create cilium agent client after 30.000000 seconds timeout: Get "http://localhost/v1/config": dial unix /var/run/cilium/cilium.sock: connect: no such file or directory
Is the agent running?
  Warning  FailedCreatePodSandBox  18m  kubelet  Failed to create pod sandbox: rpc error: code = Unknown desc = failed to set up sandbox container "5001e5aa69fecab537abe27c5900d84a6049f50883695d04a9c9f1ed734a1b20" network for pod "ks-apiserver-6cd95fb98f-kvdkb": networkPlugin cni failed to set up pod "ks-apiserver-6cd95fb98f-kvdkb_kubesphere-system" network: unable to connect to Cilium daemon: failed to create cilium agent client after 30.000000 seconds timeout: Get "http://localhost/v1/config": dial unix /var/run/cilium/cilium.sock: connect: no such file or directory
Is the agent running?
```

可以发现 Cilium 其实没有正常运行起来，让我们看看 `kubelet` 怎么样：

```shell
$ sudo systemctl status kubelet

● kubelet.service - kubelet: The Kubernetes Node Agent
     Loaded: loaded (/etc/systemd/system/kubelet.service; enabled; vendor preset: enabled)
    Drop-In: /etc/systemd/system/kubelet.service.d
             └─10-kubeadm.conf
     Active: active (running) since Sat 2023-09-30 20:10:16 CST; 34min ago
       Docs: http://kubernetes.io/docs/
   Main PID: 506 (kubelet)
      Tasks: 175 (limit: 9830)
     Memory: 325.8M
        CPU: 4min 55.659s
     CGroup: /system.slice/kubelet.service
             ├─  506 /usr/local/bin/kubelet --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf --config=/var/lib/kubelet/config.yaml --cgroup-driver=s>
             ├─50849 /opt/cni/bin/cilium-cni
             ├─50935 /opt/cni/bin/cilium-cni
             ├─50971 /opt/cni/bin/cilium-cni
             ├─50972 /opt/cni/bin/cilium-cni
             ├─51015 /opt/cni/bin/cilium-cni
             ├─51283 /opt/cni/bin/cilium-cni
             ├─51306 /opt/cni/bin/cilium-cni
             ├─51323 /opt/cni/bin/cilium-cni
             ├─51337 /opt/cni/bin/cilium-cni
             ├─51381 /opt/cni/bin/cilium-cni
             ├─51398 /opt/cni/bin/cilium-cni
             └─51414 /opt/cni/bin/cilium-cni

9月 30 20:44:17 node1 kubelet[506]: E0930 20:44:17.246138     506 cni.go:361] "Error adding pod to network" err="unable to connect to Cilium daemon: failed to create cilium agent client after 30.000000 seconds timeout: Get \"http://localhost/v1/config\": dial unix /var/run/cilium/cilium.sock: connect: no such file or directory\nIs the agent running?" pod="kubesphere-monitoring-system/kube-state-metrics-687d66b747-5s6rt"
9月 30 20:44:17 node1 kubelet[506]: E0930 20:44:17.614511     506 kubelet_volumes.go:245] "There were many similar errors. Turn up verbosity to see them." err="orphaned pod \"1f1a54f9-7023-4995-a4c0-de78>
9月 30 20:44:17 node1 kubelet[506]: E0930 20:44:17.986337     506 cni.go:361] "Error adding pod to network" err="unable to connect to Cilium daemon: failed to create cilium agent client after 30.000000 s>
9月 30 20:44:18 node1 kubelet[506]: E0930 20:44:18.428698     506 cni.go:361] "Error adding pod to network" err="unable to connect to Cilium daemon: failed to create cilium agent client after 30.000000 seconds timeout: Get \"http://localhost/v1/config\": dial unix /var/run/cilium/cilium.sock: connect: no such file or directory\nIs the agent running?" pod="kubesphere-monitoring-system/kube-state-metrics-687d66b747-5s6rt"
9月 30 20:44:19 node1 kubelet[506]: E0930 20:44:19.582819     506 kubelet_volumes.go:245] "There were many similar errors. Turn up verbosity to see them." err="orphaned pod \"1f1a54f9-7023-4995-a4c0-de78>
9月 30 20:44:20 node1 kubelet[506]: E0930 20:44:20.573676     506 remote_runtime.go:116] "RunPodSandbox from runtime service failed" err="rpc error: code = Unknown desc = failed to set up sandbox contain>
9月 30 20:44:20 node1 kubelet[506]: E0930 20:44:20.573860     506 kuberuntime_sandbox.go:70] "Failed to create sandbox for pod" err="rpc error: code = Unknown desc = failed to set up sandbox container \">
9月 30 20:44:20 node1 kubelet[506]: E0930 20:44:20.573973     506 kuberuntime_manager.go:819] "CreatePodSandbox for pod failed" err="rpc error: code = Unknown desc = failed to set up sandbox container \">
9月 30 20:44:20 node1 kubelet[506]: E0930 20:44:20.574210     506 pod_workers.go:951] "Error syncing pod, skipping" err="failed to \"CreatePodSandbox\" for \"kube-state-metrics-687d66b747-5s6rt_kubespher>
9月 30 20:44:21 node1 kubelet[506]: E0930 20:44:21.601638     506 kubelet_volumes.go:245] "There were many similar errors. Turn up verbosity to see them." err="orphaned pod \"1f1a54f9-7023-4995-a4c0-de78>
```

可以发现也是一样的报错：

```shell
9月 30 20:44:18 node1 kubelet[506]: E0930 20:44:18.428698     506 cni.go:361] "Error adding pod to network" err="unable to connect to Cilium daemon: failed to create cilium agent client after 30.000000 seconds timeout: Get \"http://localhost/v1/config\": dial unix /var/run/cilium/cilium.sock: connect: no such file or directory\nIs the agent running?" pod="kubesphere-monitoring-system/kube-state-metrics-687d66b747-5s6rt"
```

这说明我们的 Cilium 无法运行起来，也许是 Calico 相关的资源没有清理干净。

## 移除冲突的，尚未完全清理干净的 Calico 相关的资源

可以根据文档[[完全卸载使用 KubeKey 安装的 Calico]] 中建议的方式和步骤来进行删除。

然后我们需要重新安装一下 Cilium。

## 卸载 Cilium

我们再运行一下 `cilium uninstall` 试试看，然后删除 Cilium 的 CNI 配置：

```shell
sudo rm -rf /etc/cni/net.d/05-cilium.conflist
sudo rm -rf /etc/cni/net.d/10-calico.conflist.cilium_bak
```

移除之后发现容器还是在报错，我们用 `kubectl describe` 看看配置和事件：

```shell
sudo kubectl describe pod redis-v1-fb59985cc-lj4j2 -n bots

Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason            Age    From               Message
  ----     ------            ----   ----               -------
  Warning  FailedScheduling  45m    default-scheduler  0/3 nodes are available: 3 node(s) had taint {node.cilium.io/agent-not-ready: }, that the pod didn't tolerate.
  Warning  FailedScheduling  44m    default-scheduler  0/3 nodes are available: 3 node(s) had taint {node.cilium.io/agent-not-ready: }, that the pod didn't tolerate.
```

可以发现有两个污点和关于 `node.cilium.io/agent-not-ready` 污点的报错，但是我们已经把 Cilium 移除了，所以这里的污点我们不清楚是哪里配置上来的，我们可以用：

```shell
sudo kubectl taint nodes node1 node.cilium.io/agent-not-ready-
sudo kubectl taint nodes node2 node.cilium.io/agent-not-ready-
sudo kubectl taint nodes node3 node.cilium.io/agent-not-ready-
```

给移除了，移除之后再次重启全部节点的 `kubelet` 试试看是否还有残余：

```shell
sudo systemctl restart kubelet
```

这个时候我们再次观察就能发现只剩下我们预期内的 `node.kubernetes.io/not-ready`（K8s 节点未准备好）污点了：

```shell
$ sudo kubectl describe pods redis-v1-fb59985cc-p2r5r -n bots

...

Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason            Age    From               Message
  ----     ------            ----   ----               -------
  Warning  FailedScheduling  46m    default-scheduler  0/3 nodes are available: 3 node(s) had taint {node.cilium.io/agent-not-ready: }, that the pod didn't tolerate.
  Warning  FailedScheduling  44m    default-scheduler  0/3 nodes are available: 3 node(s) had taint {node.cilium.io/agent-not-ready: }, that the pod didn't tolerate.
  Warning  FailedScheduling  5m51s  default-scheduler  0/3 nodes are available: 3 node(s) had taint {node.kubernetes.io/not-ready: }, that the pod didn't tolerate.
```

这个时候由于我们在之前已经删除了 Calico，也删除了有冲突配置的 Cilium，这个时候预期情况下我们会出现 CNI 插件缺失的报错：

```shell
$ sudo systemctl status kubelet

● kubelet.service - kubelet: The Kubernetes Node Agent
     Loaded: loaded (/etc/systemd/system/kubelet.service; enabled; vendor preset: enabled)
    Drop-In: /etc/systemd/system/kubelet.service.d
             └─10-kubeadm.conf
     Active: active (running) since Sat 2023-09-30 21:48:45 CST; 5min ago
       Docs: http://kubernetes.io/docs/
   Main PID: 23191 (kubelet)
      Tasks: 19 (limit: 9830)
     Memory: 52.4M
        CPU: 47.656s
     CGroup: /system.slice/kubelet.service
             └─23191 /usr/local/bin/kubelet --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf --config=/var/lib/kubelet/config.yaml --cgroup-driver=s>

9月 30 21:53:55 node1 kubelet[23191]: E0930 21:53:55.698482   23191 pod_workers.go:951] "Error syncing pod, skipping" err="network is not ready: container runtime network not ready: NetworkReady=false NetworkReady=false reason:NetworkPluginNotReady message:docker: network plugin is not ready: cni config uninitialized" pod="kubesphere-monitoring-system/kube-state-metrics-687d66b747-5s6rt" podUID=ba43f196-a8c9-4d87-a18c-e847cef665d0
```

## 安装 Cilium

这是正常的，这个时候我们再次执行一下 Cilium 官方文档教的安装：

```shell
$ sudo cilium install --version 1.14.2

ℹ️  Using Cilium version 1.14.2
🔮 Auto-detected cluster name: cluster.local
🔮 Auto-detected kube-proxy has been installed
```

等待一会儿在执行：

```shell
sudo cilium status --wait
```

然后就能看到我们的 cilium 现在状态正常了：

```shell
$ sudo cilium status --wait
    /¯¯\
 /¯¯\__/¯¯\    Cilium:             OK
 \__/¯¯\__/    Operator:           OK
 /¯¯\__/¯¯\    Envoy DaemonSet:    disabled (using embedded mode)
 \__/¯¯\__/    Hubble Relay:       disabled
    \__/       ClusterMesh:        disabled

DaemonSet              cilium             Desired: 3, Ready: 3/3, Available: 3/3
Deployment             cilium-operator    Desired: 1, Ready: 1/1, Available: 1/1
Containers:            cilium-operator    Running: 1
                       cilium             Running: 3
Cluster Pods:          1/55 managed by Cilium
Helm chart version:    1.14.2
Image versions         cilium             quay.io/cilium/cilium:v1.14.2@sha256:6263f3a3d5d63b267b538298dbeb5ae87da3efacf09a2c620446c873ba807d35: 3
                       cilium-operator    quay.io/cilium/operator-generic:v1.14.2@sha256:52f70250dea22e506959439a7c4ea31b10fe8375db62f5c27ab746e3a2af866d: 1
```

## 出现网络问题

### 联通性测试不通过

安装之后我们执行：

```shell
sudo cilium connectivity test
```

来进行网络连接测试，会发现 `cilium-test/client` 部署失败了：

```shell
$ sudo cilium connectivity test

ℹ️  Monitor aggregation detected, will skip some flow validation steps
✨ [cluster.local] Creating namespace cilium-test for connectivity check...
✨ [cluster.local] Deploying echo-same-node service...
✨ [cluster.local] Deploying DNS test server configmap...
✨ [cluster.local] Deploying same-node deployment...
✨ [cluster.local] Deploying client deployment...
✨ [cluster.local] Deploying client2 deployment...
✨ [cluster.local] Deploying echo-other-node service...
✨ [cluster.local] Deploying other-node deployment...
✨ [host-netns] Deploying cluster.local daemonset...
✨ [host-netns-non-cilium] Deploying cluster.local daemonset...
✨ [cluster.local] Deploying echo-external-node deployment...
⌛ [cluster.local] Waiting for deployment cilium-test/client to become ready...
connectivity test failed: timeout reached waiting for deployment cilium-test/client to become ready (last error: only 0 of 1 replicas are available)
```

我们可以观察一下事件：

```shell
$ sudo kubectl -n cilium-test describe deployment client

...

Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  13m   deployment-controller  Scaled up replica set client-7dccdf9bdf to 1
```

看起来我们的 `deployment` 失败在扩容到 1 份 Replica，那我们看看 Pod 这边是卡在哪个环节了：

```shell
$ sudo kubectl -n cilium-test get pods
NAME                                  READY   STATUS              RESTARTS   AGE
client-7dccdf9bdf-tmc5h               0/1     ImagePullBackOff    0          20m
client2-5fd767c97f-bl84c              0/1     ImagePullBackOff    0          20m
...
```

### 镜像拉取失败

看起来是 `ImagePullBackoff` 了，无法拉取镜像，我们看看具体的事件吧：

```shell
$ sudo kubectl describe pods -n cilium-test client-7dccdf9bdf-tmc5h

...

Events:
  Type     Reason     Age                  From               Message
  ----     ------     ----                 ----               -------
  Normal   Scheduled  20m                  default-scheduler  Successfully assigned cilium-test/client-7dccdf9bdf-tmc5h to node1
  Warning  Failed     6m41s                kubelet            Failed to pull image "quay.io/cilium/alpine-curl:v1.7.0@sha256:ccd0ed9da1752bab88a807647ad3cec65d460d281ab88988b60d70148783e751": rpc error: code = Unknown desc = Error response from daemon: Get "https://quay.io/v2/": net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
  Warning  Failed     6m41s                kubelet            Error: ErrImagePull
  Normal   BackOff    6m40s                kubelet            Back-off pulling image "quay.io/cilium/alpine-curl:v1.7.0@sha256:ccd0ed9da1752bab88a807647ad3cec65d460d281ab88988b60d70148783e751"
  Warning  Failed     6m40s                kubelet            Error: ImagePullBackOff
  Normal   Pulling    6m27s (x2 over 19m)  kubelet            Pulling image "quay.io/cilium/alpine-curl:v1.7.0@sha256:ccd0ed9da1752bab88a807647ad3cec65d460d281ab88988b60d70148783e751"
```

看起来也许是 Homelab 这边网络有点爆炸。在调整了 Clash 节点选择之后依然不行，我们得深入调查一下。

### 排查 coredns 和相关的 Pod

```shell
$ sudo kubectl get pods -n kube-system

NAME                                           READY   STATUS             RESTARTS       AGE
cilium-mdtzl                                   1/1     Running            0              8h
cilium-mmh9j                                   1/1     Running            0              8h
cilium-operator-8bf9464bf-xdb7l                1/1     Running            1 (8h ago)     8h
cilium-rqhvs                                   1/1     Running            0              8h
coredns-b5648d655-d8ltm                        0/1     ImagePullBackOff   0              11h
coredns-b5648d655-p5j5d                        0/1     ImagePullBackOff   0              8h
hubble-relay-85cff75759-hlpk4                  0/1     ErrImagePull       0              7h19m
hubble-ui-78b9fbc9cb-hqmw6                     0/2     ErrImagePull       0              7h19m
kube-apiserver-node1                           1/1     Running            19 (9h ago)    308d
kube-controller-manager-node1                  1/1     Running            30 (8h ago)    308d
kube-proxy-bjrg4                               1/1     Running            19 (9h ago)    308d
kube-proxy-h6cqw                               1/1     Running            17 (9h ago)    308d
kube-proxy-s9pbw                               1/1     Running            16 (9h ago)    308d
kube-scheduler-node1                           1/1     Running            28 (8h ago)    308d
nodelocaldns-56lvx                             1/1     Running            16 (9h ago)    308d
nodelocaldns-h5hf4                             1/1     Running            17 (9h ago)    308d
nodelocaldns-rk2fh                             1/1     Running            19 (9h ago)    308d
openebs-localpv-provisioner-57bbf864d5-2hkzr   0/1     ErrImagePull       15 (10h ago)   308d
snapshot-controller-0                          1/1     Running            15 (10h ago)   308d
```

看起来 `coredns` 自己就起不来了。深入查看一下 `coredns` 这个 Pod 的 `ImagePullBackOff` 的原因：

```
$ sudo kubectl describe pods coredns-b5648d655-d8ltm -n kube-system

...

Tolerations:                 CriticalAddonsOnly op=Exists
                             node-role.kubernetes.io/control-plane:NoSchedule
                             node-role.kubernetes.io/master:NoSchedule
                             node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason   Age                    From     Message
  ----     ------   ----                   ----     -------
  Warning  Failed   18m (x77 over 8h)      kubelet  Failed to pull image "coredns/coredns:1.8.0": rpc error: code = Unknown desc = Error response from daemon: Get "https://registry-1.docker.io/v2/": net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
  Normal   Pulling  13m (x86 over 8h)      kubelet  Pulling image "coredns/coredns:1.8.0"
  Normal   BackOff  3m28s (x1857 over 8h)  kubelet  Back-off pulling image "coredns/coredns:1.8.0"
```

### 定位到网络问题

看起来不光是 `quay.io` 的镜像服务无法访问到，`docker.io` 也不行。我们可以用 `curl` 直接试试看：

```shell
$ curl https://registry-1.docker.io/v2/ -I
curl: (6) Could not resolve host: registry-1.docker.io
```

发现无法解析了，那我们看看本机的 DNS 呢：

```shell
$ dig registry-1.docker.io @8.8.8.8

; <<>> DiG 9.16.37-Debian <<>> registry-1.docker.io @8.8.8.8
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 19821
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;registry-1.docker.io.		IN	A

;; ANSWER SECTION:
registry-1.docker.io.	1	IN	A	18.215.138.58
registry-1.docker.io.	1	IN	A	52.1.184.176
registry-1.docker.io.	1	IN	A	34.194.164.123

;; Query time: 3 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Sun Oct 01 09:13:02 CST 2023
;; MSG SIZE  rcvd: 86
```

正常，但是 `10.0.0.1` 的 Homelab Gateway 路由器的 DNS 连接不上了：

```shell
$ dig registry-1.docker.io @10.0.0.1

; <<>> DiG 9.16.37-Debian <<>> registry-1.docker.io @10.0.0.1
;; global options: +cmd
;; connection timed out; no servers could be reached
```

```shell
$ ping 10.0.0.1

PING 10.0.0.1 (10.0.0.1) 56(84) bytes of data.
64 bytes from 10.0.0.1: icmp_seq=1 ttl=63 time=0.695 ms
64 bytes from 10.0.0.1: icmp_seq=2 ttl=63 time=0.777 ms
64 bytes from 10.0.0.1: icmp_seq=3 ttl=63 time=0.536 ms
64 bytes from 10.0.0.1: icmp_seq=4 ttl=63 time=0.754 ms
^C
--- 10.0.0.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 5998ms
rtt min/avg/max/mdev = 0.536/0.685/0.777/0.078 ms
```

能 ping 通，但是如果用 mtr 看的话能发现 10.0.0.1 的 hostname 不是我们的 Gateway 路由器会正常返回的 hostname：

```shell
node1 (10.0.2.208) -> 10.0.0.1                                                                                                                                                     2023-10-01T09:18:40+0800
Keys:  Help   Display mode   Restart statistics   Order of fields   quit
                                                                                                                                                                   Packets               Pings
 Host                                                                                                                                                            Loss%   Snt   Last   Avg  Best  Wrst StDev
 1. (waiting for reply)
 2. 10.0.0.1                                                                                                                                                      0.0%     4    0.8   0.8   0.7   0.9   0.0
```

应该是路由到了别的地方去了，可以再检查一下路由表：

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

确实是这样。

我们重新翻阅文档 [Cluster Scope (Default) — Cilium 1.14.2 documentation](https://docs.cilium.io/en/stable/network/concepts/ipam/cluster-pool/#ipam-crd-cluster-pool): 可以发现文档中描述说：

> `10.0.0.0/8` 是默认的 Pod CIDR。如果您的节点网络位于同一范围内，您将失去与其他节点的连接。假定所有出口流量都针对给定节点上的 Pod，而不是其他节点。
>
> 您可以通过两种方式解决：
>
> - 显式将 `clusterPoolIPv4PodCIDRList` 设置为不冲突的 CIDR
> - 为您的节点使用不同的 CIDR

OK，那我们检查一下是不是真的是这样：

```shell
$ sudo kubectl get ciliumnodes

NAME    CILIUMINTERNALIP   INTERNALIP   AGE
node1   10.0.2.208         10.24.0.2    14h
node2   10.0.1.157         10.24.0.4    14h
node3   10.0.0.78          10.24.0.5    14h
```

不太对劲，我们 describe 看看：

```shell
$ sudo kubectl describe ciliumnodes
Name:         node1
Namespace:
Labels:       beta.kubernetes.io/arch=amd64
              beta.kubernetes.io/os=linux
              kubernetes.io/arch=amd64
              kubernetes.io/hostname=node1
              kubernetes.io/os=linux
              node-access=ssh
              node-role.kubernetes.io/control-plane=
              node-role.kubernetes.io/master=
              node-role.kubernetes.io/worker=
              node.kubernetes.io/exclude-from-external-load-balancers=
Annotations:  <none>
API Version:  cilium.io/v2
Kind:         CiliumNode

...

Spec:
  Addresses:
    Ip:    10.24.0.2
    Type:  InternalIP
    Ip:    10.0.2.208
    Type:  CiliumInternalIP
  Alibaba - Cloud:
  Azure:
  Encryption:
  Eni:
  Health:
    ipv4:  10.0.2.140
  Ingress:
  Ipam:
    Pod CID Rs:
      10.0.2.0/24
    Pools:
Status:
  Alibaba - Cloud:
  Azure:
  Eni:
  Ipam:
    Operator - Status:
Events:  <none>
```

```shell
Name:         node2
Namespace:
Labels:       beta.kubernetes.io/arch=amd64
              beta.kubernetes.io/os=linux
              kubernetes.io/arch=amd64
              kubernetes.io/hostname=node2
              kubernetes.io/os=linux
              node-access=ssh
              node-role.kubernetes.io/worker=
Annotations:  <none>
API Version:  cilium.io/v2
Kind:         CiliumNode

...

Spec:
  Addresses:
    Ip:    10.24.0.4
    Type:  InternalIP
    Ip:    10.0.1.157
    Type:  CiliumInternalIP
  Alibaba - Cloud:
  Azure:
  Encryption:
  Eni:
  Health:
    ipv4:  10.0.1.242
  Ingress:
  Ipam:
    Pod CID Rs:
      10.0.1.0/24
    Pools:
Status:
  Alibaba - Cloud:
  Azure:
  Eni:
  Ipam:
    Operator - Status:
Events:  <none>
```

```shell
Name:         node3
Namespace:
Labels:       beta.kubernetes.io/arch=amd64
              beta.kubernetes.io/os=linux
              kubernetes.io/arch=amd64
              kubernetes.io/hostname=node3
              kubernetes.io/os=linux
              node-access=ssh
              node-role.kubernetes.io/worker=
Annotations:  <none>
API Version:  cilium.io/v2
Kind:         CiliumNode

...

Spec:
  Addresses:
    Ip:    10.24.0.5
    Type:  InternalIP
    Ip:    10.0.0.78
    Type:  CiliumInternalIP
  Alibaba - Cloud:
  Azure:
  Encryption:
  Eni:
  Health:
    ipv4:  10.0.0.87
  Ingress:
  Ipam:
    Pod CID Rs:
      10.0.0.0/24
    Pools:
Status:
  Alibaba - Cloud:
  Azure:
  Eni:
  Ipam:
    Operator - Status:
Events:  <none>
```

所以根据文档 [Migrating a cluster to Cilium — Cilium 1.14.2 documentation](https://docs.cilium.io/en/stable/installation/k8s-install-migration/) 的说明，我们还需要在安装的时候额外配置一下 CIDR 才能解决这个问题。

## 为修复 CIDR 冲突重装 Cilium

#### 卸载 Cilium

那我们现在先根据[[完全卸载使用 Helm 安装的 Cilium]] 文档的指引完全删除 cilium 然后再试一次。

#### 检查网络是否恢复

清理之后我们再次检查网络联通性：

```shell
$ ping baidu.com
PING baidu.com (110.242.68.66) 56(84) bytes of data.
64 bytes from 110.242.68.66 (110.242.68.66): icmp_seq=1 ttl=62 time=0.564 ms
64 bytes from 110.242.68.66 (110.242.68.66): icmp_seq=2 ttl=62 time=0.569 ms
64 bytes from 110.242.68.66 (110.242.68.66): icmp_seq=3 ttl=62 time=0.514 ms
64 bytes from 110.242.68.66 (110.242.68.66): icmp_seq=4 ttl=62 time=0.874 ms
^C
--- baidu.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 2998ms
rtt min/avg/max/mdev = 0.514/0.630/0.874/0.142 ms
```

```shell
$ curl baidu.com -L -I
HTTP/1.1 200 OK
Date: Fri, 06 Oct 2023 03:43:26 GMT
Server: Apache
Last-Modified: Tue, 12 Jan 2010 13:48:00 GMT
ETag: "51-47cf7e6ee8400"
Accept-Ranges: bytes
Content-Length: 81
Cache-Control: max-age=86400
Expires: Sat, 07 Oct 2023 03:43:26 GMT
Connection: Keep-Alive
Content-Type: text/html
```

```shell
$ ping google.com
PING google.com (142.250.204.46) 56(84) bytes of data.
64 bytes from hkg07s38-in-f14.1e100.net (142.250.204.46): icmp_seq=1 ttl=62 time=0.660 ms
64 bytes from hkg07s38-in-f14.1e100.net (142.250.204.46): icmp_seq=2 ttl=62 time=0.570 ms
64 bytes from hkg07s38-in-f14.1e100.net (142.250.204.46): icmp_seq=3 ttl=62 time=0.611 ms
64 bytes from hkg07s38-in-f14.1e100.net (142.250.204.46): icmp_seq=4 ttl=62 time=0.609 ms
^C
--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3002ms
rtt min/avg/max/mdev = 0.570/0.612/0.660/0.031 ms
```

```shell
$ curl google.com -L -I
HTTP/1.1 301 Moved Permanently
Location: http://www.google.com/
Content-Type: text/html; charset=UTF-8
Content-Security-Policy-Report-Only: object-src 'none';base-uri 'self';script-src 'nonce-TZgO-fIhEQR2thcKEH04rw' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp
Date: Fri, 06 Oct 2023 03:43:46 GMT
Expires: Sun, 05 Nov 2023 03:43:46 GMT
Cache-Control: public, max-age=2592000
Server: gws
Content-Length: 219
X-XSS-Protection: 0
X-Frame-Options: SAMEORIGIN

HTTP/1.1 200 OK
Content-Type: text/html; charset=ISO-8859-1
Content-Security-Policy-Report-Only: object-src 'none';base-uri 'self';script-src 'nonce-Ln-1anLLMO6ubPnv34o45g' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp
P3P: CP="This is not a P3P policy! See g.co/p3phelp for more info."
Date: Fri, 06 Oct 2023 03:43:46 GMT
Server: gws
X-XSS-Protection: 0
X-Frame-Options: SAMEORIGIN
Transfer-Encoding: chunked
Expires: Fri, 06 Oct 2023 03:43:46 GMT
Cache-Control: private
```

发现正常了。这个时候我们开始重新安装。

#### 填充配置

新的安装流程需要走 Helm，所以这里我们需要给 Cilium 的 Helm 部署参数配置一些额外信息来阻止 Cilium 使用 10.0.0.0/8 作为 CIDR，新建 `cilium-values-migration.yaml` 文件：

```yaml
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
    clusterPoolIPv4PodCIDRList: '10.244.0.0/16'

# 如果上面指定了 ipam.operator.clusterPoolIPv4PodCIDRList 那么这里就也得配置成一样的字面量
ipv4NativeRoutingCIDR: '10.244.0.0/16'

# 如果 tunnel 保持打开，而且我们卸载了 kube-proxy，那么需要开启下面的两个选项
enableIPv4Masquerade: true
enableIPv6Masquerade: true
```

注意这个配置文件里面的 `kubeProxyReplacement` 字段配置，根据 Cilium 的 [Kubernetes Without kube-proxy](https://docs.cilium.io/en/stable/network/kubernetes/kubeproxy-free/#kubeproxy-free) 文档：

> Cilium 的 kube-proxy 替换依赖于 socket-LB 功能，这需要 v4.19.57、v5.1.16、v5.2.0 或更高版本的 Linux 内核。 Linux 内核 v5.3 和 v5.8 添加了其他功能，Cilium 可以使用这些功能来进一步优化 kube-proxy 替换实现。
> 请注意，v5.0.y 内核没有运行 kube-proxy 替换所需的修复程序，因为此时 v5.0.y 稳定内核已终止生命 (EOL)，并且不再在内核上维护.org。对于单独的发行版维护的内核，情况可能有所不同。因此，请检查您的发行版。

所以还请确保 `uname -a` 中输出的内核版本满足需求，如果不满足，可以注释或者删掉此行。

确认无误之后我们用下面的命令输出 Helm 安装用的配置文件：

```shell
sudo cilium install --version 1.14.2 --values cilium-values-migration.yaml --dry-run-helm-values > cilium-values-initial.yaml
```

可以通过 [[cat 输出文件]] 命令检查一下：

```shell
$ cat cilium-values-initial.yaml

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
k8sServiceHost: lb.kubesphere.local # [!code hl]
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

#### 移除原本的 `kube-proxy`

> [!TIP] 如果你选择使用 `kubeProxyReplacement` 参数替代 `kube-proxy`
> 可以跟随[[完全卸载集群内的 `kube-proxy`]] 文档的指引备份和删除 `kube-proxy` 相关的配置和资源。

#### 安装 Cilium

如果你还没有添加 Cilium 的 Repo，可以加一下：

```shell
sudo helm repo add cilium https://helm.cilium.io/
```

然后安装：

```shell
sudo helm install cilium cilium/cilium --namespace kube-system --values cilium-values-initial.yaml
```

然后我们再等等看：

```shell
$ sudo cilium status --wait
    /¯¯\
 /¯¯\__/¯¯\    Cilium:             OK
 \__/¯¯\__/    Operator:           OK
 /¯¯\__/¯¯\    Envoy DaemonSet:    disabled (using embedded mode)
 \__/¯¯\__/    Hubble Relay:       OK
    \__/       ClusterMesh:        disabled

Deployment             cilium-operator    Desired: 1, Ready: 1/1, Available: 1/1
Deployment             hubble-ui          Desired: 1, Ready: 1/1, Available: 1/1
DaemonSet              cilium             Desired: 3, Ready: 3/3, Available: 3/3
Deployment             hubble-relay       Desired: 1, Ready: 1/1, Available: 1/1
Containers:            hubble-ui          Running: 1
                       hubble-relay       Running: 1
                       cilium             Running: 3
                       cilium-operator    Running: 1
Cluster Pods:          10/10 managed by Cilium
Helm chart version:    1.14.2
Image versions         cilium-operator    quay.io/cilium/operator-generic:v1.14.2@sha256:52f70250dea22e506959439a7c4ea31b10fe8375db62f5c27ab746e3a2af866d: 1
                       hubble-ui          quay.io/cilium/hubble-ui:v0.12.0@sha256:1c876cfa1d5e35bc91e1025c9314f922041592a88b03313c22c1f97a5d2ba88f: 1
                       hubble-ui          quay.io/cilium/hubble-ui-backend:v0.12.0@sha256:8a79a1aad4fc9c2aa2b3e4379af0af872a89fcec9d99e117188190671c66fc2e: 1
                       hubble-relay       quay.io/cilium/hubble-relay:v1.14.2@sha256:a89030b31f333e8fb1c10d2473250399a1a537c27d022cd8becc1a65d1bef1d6: 1
                       cilium             quay.io/cilium/cilium:v1.14.2@sha256:6263f3a3d5d63b267b538298dbeb5ae87da3efacf09a2c620446c873ba807d35: 3
```

现在再来测试的话就是正常的了：

```shell
$ sudo cilium connectivity test

...

✅ All 42 tests (295 actions) successful, 13 tests skipped, 0 scenarios skipped.
```

## 参考资料

- [k8s系列15-calico有损迁移至cilium - TinyChen's Studio - 互联网技术学习工作经验分享](https://tinychen.com/20230201-k8s-15-migrate-cni-from-calico-to-cilium/)
- [coredns [ERROR] plugin/errors: 2 read udp 10.244.235.249:55567->10.96.0.10:53: i/o timeout · Issue #86762 · kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues/86762)
- [When using cilium as Kubernetes network CNI, the coredns is running but not-ready, healthcheck failed and plugin/errors HINFO: read udp i/o timeout · Issue #111105 · kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues/111105)
- [cilium在kubernetes中的生产实践二(cilium部署) | Z.S.K.'s Records](https://izsk.me/2023/06/03/cilium-on-kubernetes-install/)
- [Tutorial: How to Migrate to Cilium (Part 1) - Isovalent](https://isovalent.com/blog/post/tutorial-migrating-to-cilium-part-1/)
- [Cilium - Kubernetes指南](https://kubernetes.feisky.xyz/extension/network/cilium)
- [coredns [ERROR] plugin/errors: 2 read udp 10.244.235.249:55567->10.96.0.10:53: i/o timeout · Issue #86762 · kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues/86762)
- [DNS rules don't work anymore on kubernetes 1.18 with cilium 1.8 · Issue #13308 · cilium/cilium](https://github.com/cilium/cilium/issues/13308)
- [I set ipam.operator.clusterPoolIPv4PodCIDR=10.1.0.0/16 why the pod ip allocated is still 10.0 · Issue #23872 · cilium/cilium](https://github.com/cilium/cilium/issues/23872)
- [When using cilium as Kubernetes network CNI, the coredns is running but not-ready, healthcheck failed and plugin/errors HINFO: read udp i/o timeout · Issue #111105 · kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues/111105)
- [linux - Kubernetes Nodes are not reachable and cannot reach local network after installing cilium - Server Fault](https://serverfault.com/questions/1103034/kubernetes-nodes-are-not-reachable-and-cannot-reach-local-network-after-installi)
- [Creating a cluster with kubeadm | Kubernetes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)
- [kubernetes - Container runtime network not ready: cni config uninitialized - Stack Overflow](https://stackoverflow.com/questions/49112336/container-runtime-network-not-ready-cni-config-uninitialized)
- [删除cilium ebpf/bpf程序/完全卸载cilium](https://www.jianshu.com/p/896ec00b9661)
- [无法彻底清理cilium留下的问题](https://gist.github.com/aliasmee/6c7e5fb433c8fd303b07f0081fc83677)
- [使用 Cilium 替换 Calico – 陈少文的网站](https://www.chenshaowen.com/blog/how-to-use-cilium-to-replace-calico.html)
- [Troubleshooting Clusters | Kubernetes](https://kubernetes.io/docs/tasks/debug/debug-cluster/)
