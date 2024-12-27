---
tags:
  - 开发/云原生/Kubernetes
  - 命令行/kubectl
  - 软件/云原生/kubelet
  - 命令行/systemd
  - 命令行/journalctl
  - 计算机科学/内存/虚拟内存
  - 计算机科学/内存/虚拟内存/swap
  - 命令行/docker
  - 开发/容器化/Docker
  - 开发/云原生/Docker
  - 软件/云原生/docker
  - 计算机/操作系统/Linux
  - 操作系统/Linux
---
# 因打开了 swap 导致的 Kubernetes 重启后无法自愈问题

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Kubernetes | v1.22.1 | [https://v1-22.docs.kubernetes.io/](https://v1-22.docs.kubernetes.io/) |

## 说明

机器重启之后发现 docker 里面和 k8s 相关的容器都没有启动起来，等了好久也没有见有反应。

## 排查

通过 `systemctl status docker` 和 `journalctl -xef -u docker` 查看 docker 的状态和日志也没有发现问题。

使用 `kubectl get nodes` 时能看到节点的状态是 `NotReady`，如果使用 `kubectl describe node <节点名称>` 的话还能在 `MemoryPressure` 和其他状态栏中看到 `NodeStatusUnknown` 和 `kubelet stopped posting node status` 的报错。

查阅资料的时候发现有人推荐用 `journalctl` 看一下 `kubectl` 的日志和报错问题：

```shell
sudo journalctl -u kubelet -f
```

然后就发现了下面的日志：

```
11月 26 16:37:46 node01 systemd[1]: kubelet.service: Main process exited, code=exited, status=1/FAILURE
11月 26 16:37:46 node01 systemd[1]: kubelet.service: Failed with result 'exit-code'.
11月 26 16:37:56 node01 systemd[1]: kubelet.service: Scheduled restart job, restart counter is at 66.
11月 26 16:37:56 node01 systemd[1]: Stopped kubelet: The Kubernetes Node Agent.
11月 26 16:37:56 node01 systemd[1]: Started kubelet: The Kubernetes Node Agent.
11月 26 16:37:56 node01 kubelet[5885]: Flag --cgroup-driver has been deprecated, This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.
11月 26 16:37:56 node01 kubelet[5885]: Flag --network-plugin has been deprecated, will be removed along with dockershim.
11月 26 16:37:56 node01 kubelet[5885]: Flag --cgroup-driver has been deprecated, This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.
11月 26 16:37:56 node01 kubelet[5885]: Flag --network-plugin has been deprecated, will be removed along with dockershim.
11月 26 16:37:56 node01 kubelet[5885]: I1126 16:37:56.617346    5885 server.go:440] "Kubelet version" kubeletVersion="v1.22.12"
11月 26 16:37:56 node01 kubelet[5885]: I1126 16:37:56.617883    5885 server.go:868] "Client rotation is on, will bootstrap in background"
11月 26 16:37:56 node01 kubelet[5885]: I1126 16:37:56.625503    5885 certificate_store.go:130] Loading cert/key pair from "/var/lib/kubelet/pki/kubelet-client-current.pem".
11月 26 16:37:56 node01 kubelet[5885]: I1126 16:37:56.627583    5885 dynamic_cafile_content.go:155] "Starting controller" name="client-ca-bundle::/etc/kubernetes/pki/ca.crt"
11月 26 16:37:56 node01 kubelet[5885]: W1126 16:37:56.627625    5885 manager.go:159] Cannot detect current cgroup on cgroup v2
11月 26 16:37:56 node01 kubelet[5885]: I1126 16:37:56.750278    5885 server.go:687] "--cgroups-per-qos enabled, but --cgroup-root was not specified.  defaulting to /"
11月 26 16:37:56 node01 kubelet[5885]: E1126 16:37:56.750615    5885 server.go:294] "Failed to run kubelet" err="failed to run Kubelet: running with swap on is not supported, please disable swap! or set --fail-swap-on flag to false. /proc/swaps contained: [Filename\t\t\t\tType\t\tSize\t\tUsed\t\tPriority /dev/sda3                               partition\t999420\t\t0\t\t-2]"
11月 26 16:37:56 node01 systemd[1]: kubelet.service: Main process exited, code=exited, status=1/FAILURE
11月 26 16:37:56 node01 systemd[1]: kubelet.service: Failed with result 'exit-code'.
```

最关键的信息是这一条：

> Failed to run kubelet" err="failed to run Kubelet: running with swap on is not supported, please disable swap! or set --fail-swap-on flag to false.

该报错指明了 Kubernetes 无法在 swap 开启的时候运行 kubelet，我们要么关闭 swap，要么在 kubelet 相关的设置中配置其命令行参数 `--fail-swap-on`。
我们可以通过 `swapoff -a` 命令快速关闭 swap 来测试是否能恢复，如果可以，我们还能进一步配置其命令行参数 `--fail-swap-on` 来避免不正确的配置导致的 Kubernetes 自愈问题。

通过执行 `swapoff  -a` 之后我们再次使用 `docker ps` 来检查容器运行状态就能发现已经有部分容器开始重启并恢复到 UP 状态了。

## 解决

### 关闭 swap

在采用这样的方法解决问题的时候，我们得先知道什么是 swap 以及关掉之后的副作用以避免额外的问题导致悲剧的发生：

> swap 是磁盘上的一块区域，可以是一个分区，也可以是一个文件，或者是他们的组合。简单点说，当系统物理内存吃紧时，Linux会将内存中不常访问的数据保存到swap上，这样系统就有更多的物理内存为各个进程服务，而当系统需要访问swap上存储的内容时，再将swap上的数据加载到内存中。

所以如果你在 **内存不够用**、**内存勉强够用** 的情况下，请勿关闭 swap，这可能导致出现 out of memory（内存耗尽）的错误从而导致更难从灾难中恢复服务甚至是恢复系统。反之，如果你在 **内存充裕** 的情况下，是可以考虑关闭 swap 的，但依然需要注意的是，如果内存用量吃紧而此时此刻又没有配置 swap 的话会发生什么呢？系统内核的 OOM Killer 会被触发，并将耗内存的进程优先终止掉，此时可能是终止的部分的容器内进程，也许会影响到服务的运作，如果还有部分的 k8s 或者是 systemd 守护进程存活，那可能其会再次将原先被杀掉的进程拉活，这个过程会有一个等待时间；如果配置了 swap，那内存压力会扩散到 swap 区域的压力上，并使服务器苟延残喘一会儿，通常会发生服务降级，这个时候也会需要运维人员尽快扩容并排查内存消耗的问题。

#### 如果没有 swap 分区

::: warning 注意

下面步骤中使用的 `swapoff -a` 的命令并不是完全有效的，在系统中有配置 `systemd` ，且系统盘中有 swap 分区的情况下（通过执行 `sudo fdisk -l` 或者在 `/etc/fstab` 中可以查询），`systemd` 在启动后扫描到 swap 分区时就会自动挂载 swap 分区，并且将一个名为 `dev-<dev 名称>.swap` 的 `systemd` 单元加载并激活，这会导致 swap 重新被开启，这导致 `swapoff -a` 命令的结果只会在本次已经启动的系统中生效，这个时候如果需要永久性关闭 swap，我们需要执行额外的操作。

:::

要了解当前的 swap 使用情况，我们可以：

```shell
sudo swapon -s
```

在了解完上述情况之后如果仍需要临时关闭 swap，我们可以：

```shell
sudo swapoff -a
```

如果需要撤销上一步操作，我们可以：

```shell
sudo swapon -a
```

这个时候我们执行下面的命令重启 `kubelet`

```shell
sudo systemctl restart kubelet
```

然后我们在集群内其他节点中可以执行下面的命令查看节点状态

```shell
sudo kubectl get nodes
```

这个时候就能看到目标节点的状态变更为 `Ready` 了。

#### 如果有 swap 分区

在现代的绝大多数 Linux 系统中，系统安装时的自动分区可能已经帮你分区好了 swap 分区，这个时候我们需要做一些额外的操作。

首先我们需要检查我们是否有 swap 分区和 swap 分区是否被 `systemd` 控制，可以通过执行以下命令了解到：

通过 `fdisk` 查询硬盘的分区：

```shell
$ sudo fdisk -l


Disk /dev/sda: 40 GiB, 42949672960 bytes, 83886080 sectors
Disk model: Virtual Disk
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: gpt
Disk identifier: 438E101B-2565-4003-948F-454B7A695D32

Device        Start      End  Sectors  Size Type
/dev/sda1      2048  1050623  1048576  512M EFI System
/dev/sda2   1050624 81885183 80834560 38.5G Linux filesystem
/dev/sda3  81885184 83884031  1998848  976M Linux swap
```

可以看到 `/dev/sda3` 在设备上有一个 Linux swap 分区。

查看 `/etc/fstab`：

```
$ sudo cat /etc/fstab | grep swap
# swap was on /dev/sda3 during installation
UUID=ec583562-8777-45cb-9512-e19b7ae96ee3 none            swap    sw              0       0
```

为了方便了解 UUID 对应的设备是哪个，我们可以用 `ls -la` 命令查看 `/dev/disk/by-uuid` 目录下的映射，可以发现 `ec583562-8777-45cb-9512-e19b7ae96ee3` 是 `/dev/sda3` 的软链接，与 `fdisk -l` 获得的信息一致：

```shell
$ sudo ls -la /dev/disk/by-uuid
总用量 0
drwxr-xr-x 2 root root 100  3月  8 01:11 .
drwxr-xr-x 6 root root 120  3月  8 01:11 ..
lrwxrwxrwx 1 root root  10  3月  8 01:11 325D-4C1F -> ../../sda1
lrwxrwxrwx 1 root root  10  3月  8 01:11 c10110c9-c86b-4020-ad6c-78e46ec3e642 -> ../../sda2
lrwxrwxrwx 1 root root  10  3月  8 01:11 ec583562-8777-45cb-9512-e19b7ae96ee3 -> ../../sda3
```

通过 `systemctl --all --type swap` 筛选出所有类型为 `swap` 的 `systemd` 单元：

```shell
$ sudo systemctl --all --type swap
  UNIT          LOAD   ACTIVE   SUB  DESCRIPTION
● dev-sda3.swap loaded active mounted dev-sda3.swap

LOAD   = Reflects whether the unit definition was properly loaded.
ACTIVE = The high-level unit activation state, i.e. generalization of SUB.
SUB    = The low-level unit activation state, values depend on unit type.
1 loaded units listed.
To show all installed unit files use 'systemctl list-unit-files'.
```

我们发现命令返回了一个名为 `dev-sda3.swap` 的 `systemd` 单元，名称与我们之前通过 `fdisk` 和查询 `/etc/fstab` 获得的一致。
接下来我们就需要一步一步操作，将 swap 完全禁用。

先执行一下 `swapoff -a` 使本次启动的系统停止 swap：

```shell
sudo swapoff -a
```

接下来，需要编辑 `/etc/fstab` 将系统启动后自动挂载 swap 分区的指令注释起来或者整行删除掉，如果指令过多，你也可以在 `/etc/fstab` 查找 swap 相关的关键字并且把指令删除。
最终达到类似下面这样的结果：

```
# swap was on /dev/sda3 during installation
# UUID=ec583562-8777-45cb-9512-e19b7ae96ee3 none            swap    sw              0       0
```

接下来，我们将上面通过 `systemctl --all --type swap` 获得的单元 mask 掉：

```shell
sudo systemctl mask dev-sd3.swap
```

最后我们执行下面的命令重启 `kubelet`

```shell
sudo systemctl restart kubelet
```

然后我们在集群内其他节点中可以执行下面的命令查看节点状态

```shell
sudo kubectl get nodes
```

这个时候就能看到目标节点的状态变更为 `Ready` 了。

### 配置 k8s 相关组件以支持不报错

在采用这样的方案之前我建议对相关的文档进行阅读以了解 kubernetes 为何不支持在 swap 开启的时候运行：

[ERROR Swap: running with swap on is not supported. Please disable swap · Issue #610 · kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues/610)
[Kubernetes 1.22: Reaching New Peaks | Kubernetes](https://kubernetes.io/blog/2021/08/04/kubernetes-1-22-release-announcement/#node-system-swap-support)

使用下列命令来查看 kubelet 的 systemd 配置：

```shell
sudo systemctl cat kubelet
```

我们可以在打印出来的行中找到这样一条：

> `# /etc/systemd/system/kubelet.service.d/10-kubeadm.conf`

这代表 kubelet systemd 是多文件组成的，我们需要直接编辑 `/etc/systemd/system/kubelet.service.d` 并添加额外参数才能解决问题：

源文件：

```ini
# Note: This dropin only works with kubeadm and kubelet v1.11+
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably, the user should use
# the .NodeRegistration.KubeletExtraArgs object in the configuration files instead. KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
Environment="KUBELET_EXTRA_ARGS=--node-ip=10.24.0.2 --hostname-override=node01 "
ExecStart=
ExecStart=/usr/local/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

我们在行

> Environment="KUBELET_EXTRA_ARGS=--node-ip=10.24.0.2 --hostname-override=node01 "

尾部添加 `--fail-swap-on=false` 来进行配置

变更后的文件：

```ini
# Note: This dropin only works with kubeadm and kubelet v1.11+
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably, the user should use
# the .NodeRegistration.KubeletExtraArgs object in the configuration files instead. KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
Environment="KUBELET_EXTRA_ARGS=--node-ip=10.24.0.2 --hostname-override=node01 --fail-swap-on=false"
ExecStart=
ExecStart=/usr/local/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

#### 额外说明

我们也可以在创建 k8s 控制平面的时候所执行的 `kubeadm init` 命令后添加 `--ignore-preflight-errors=Swap` 参数来为集群中每一个 kubelet 进行配置。

## 参考资料

[How can I turn off swap permanently? - Ask Ubuntu](https://askubuntu.com/questions/440326/how-can-i-turn-off-swap-permanently/1292453#1292453)

[How can I turn off swap permanently? - Ask Ubuntu](https://askubuntu.com/questions/440326/how-can-i-turn-off-swap-permanently/984777#984777)
