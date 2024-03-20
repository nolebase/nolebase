---
tags:
  - 命令行/docker
  - 软件/云原生/docker
  - 运维/内核
  - 运维/云原生/Docker
  - 操作系统/Debian
  - 操作系统/Debian/Debian-12
  - 命令行/containerd
  - 软件/云原生/containerd
  - 操作系统/Unix
  - 计算机/操作系统/Linux
  - 计算机/操作系统/Linux/内核
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Linux
  - 开发/故障排查
  - 运维/云原生/Kubernetes
---
# 一个因为系统没有重启应用更新导致的 Docker 无法启动的乌龙

## 背景

今天有个伙伴问 Docker 的网络故障的问题，就想着正好最近天天看 Docker 和 containerd 的代码和社区，来帮忙 debug 看看好了...

首先系统是这样的

```shell
$ uname -r
6.1.0-10-amd64
```

```shell
$ uname -a
Linux localhost 6.1.0-10-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.38-1 (2023-07-14) x86_64 GNU/Linux
```

```shell
$ lsb_release -a
No LSB modules are available.
Distributor ID:	Debian
Description:	Debian GNU/Linux 12 (bookworm)
Release:	12
Codename:	bookworm
```

在重启了 Docker 的 Systemd 服务

```shell
sudo systemctl restart docker
```

之后发现报错了，报错的日志输出是这样的

```shell
$ sudo journalctl -xeu docker.service

Dec 13 09:22:20 localhost dockerd[352906]: failed to start daemon: Error initializing network controller: Error creating default "bridge" network: Failed to Setup IP tables: Unable to enable NAT rule:  (iptables failed: iptables --wait -t nat -I POSTROUTING -s 172.17.0.0/16 ! -o docker0 -j MASQUERADE: Warning: Extension MASQUERADE revision 0 not supported, missing kernel module?
Dec 13 09:22:20 localhost dockerd[352906]: iptables v1.8.9 (nf_tables):  CHAIN_ADD failed (No such file or directory): chain POSTROUTING
```

单拎出来这段 `iptables` 的命令可以看到这个报错确实是这样的

```shell
$ sudo iptables --wait -t nat -I POSTROUTING -s 172.17.0.0/16 ! -o docker0 -j MASQUERADE
iptables v1.8.9 (nf_tables):  CHAIN_ADD failed (No such file or directory): chain POSTROUTING
```

## 调查

那么，`containerd` 在正常运行吗

```shell
$ sudo systemctl status containerd
● containerd.service - containerd container runtime
     Loaded: loaded (/lib/systemd/system/containerd.service; enabled; preset: enabled)
     Active: active (running) since Wed 2023-12-13 08:36:21 UTC; 19min ago
       Docs: https://containerd.io
   Main PID: 350077 (containerd)
      Tasks: 6
     Memory: 20.8M
        CPU: 3.222s
     CGroup: /system.slice/containerd.service
             └─350077 /usr/bin/containerd

Dec 13 08:36:21 localhost containerd[350077]: time="2023-12-13T08:36:21.662772162Z" level=info msg=serving... address=/run/containerd/containerd.sock.ttrpc
Dec 13 08:36:21 localhost containerd[350077]: time="2023-12-13T08:36:21.662831919Z" level=info msg=serving... address=/run/containerd/containerd.sock
Dec 13 08:36:21 localhost containerd[350077]: time="2023-12-13T08:36:21.668808237Z" level=info msg="Start subscribing containerd event"
Dec 13 08:36:21 localhost containerd[350077]: time="2023-12-13T08:36:21.668851196Z" level=info msg="Start recovering state"
Dec 13 08:36:21 localhost containerd[350077]: time="2023-12-13T08:36:21.668938818Z" level=info msg="Start event monitor"
Dec 13 08:36:21 localhost containerd[350077]: time="2023-12-13T08:36:21.668970047Z" level=info msg="Start snapshots syncer"
Dec 13 08:36:21 localhost containerd[350077]: time="2023-12-13T08:36:21.668996641Z" level=info msg="Start cni network conf syncer for default"
Dec 13 08:36:21 localhost containerd[350077]: time="2023-12-13T08:36:21.669006911Z" level=info msg="Start streaming server"
Dec 13 08:36:21 localhost systemd[1]: Started containerd.service - containerd container runtime.
Dec 13 08:36:21 localhost containerd[350077]: time="2023-12-13T08:36:21.688811231Z" level=info msg="containerd successfully booted in 0.069185s"
```

据说这个和 `debian` 用的 `iptables` 的 `nftables` 替代有关[^2]，如果用

```shell
sudo update-alternatives --config iptables
```

就可以观察到现在的 `iptables` 模块背后的选择

```shell
$ sudo update-alternatives --config iptables
There are 2 choices for the alternative iptables (providing /usr/sbin/iptables).

  Selection    Path                       Priority   Status
------------------------------------------------------------
  0            /usr/sbin/iptables-nft      20        auto mode
  1            /usr/sbin/iptables-legacy   10        manual mode
* 2            /usr/sbin/iptables-nft      20        manual mode

Press <enter> to keep the current choice[*], or type selection number: 1
update-alternatives: using /usr/sbin/iptables-legacy to provide /usr/sbin/iptables (iptables) in manual mode
```

再次执行看看有没有应用生效了

```shell
$ sudo update-alternatives --config iptables
There are 2 choices for the alternative iptables (providing /usr/sbin/iptables).

  Selection    Path                       Priority   Status
------------------------------------------------------------
  0            /usr/sbin/iptables-nft      20        auto mode
* 1            /usr/sbin/iptables-legacy   10        manual mode
  2            /usr/sbin/iptables-nft      20        manual mode
```

然后再执行一次看看结果：

```shell
$ sudo iptables --wait -t nat -I POSTROUTING -s 172.170.0/16 ! -o docker0 -j MASQUERADE
Warning: Extension MASQUERADE revision 0 not supported, missing kernel module?
iptables v1.8.9 (legacy): can't initialize iptables table `nat': Table does not exist (do you need to insmod?)
Perhaps iptables or your kernel needs to be upgraded.
```

看起来已经是 `iptables` `legacy` 了，但是出现了新的报错

```shell
iptables v1.8.9 (legacy): can't initialize iptables table `nat': Table does not exist (do you need to insmod?)
```

那这个时候，内核模块正常吗？我之前确实没有检查过。

```shell
$ sudo modprobe ip_tables
```

没有输出。

不过既然是 NAT 报错，那会是没有配置相关的转发模块吗？

```shell
$ cat /boot/config-$(uname -r) | grep CONFIG_IP_NF_NAT
CONFIG_IP_NF_NAT=m
```

> [!TIP] 查看单独的内核模块信息
>
> 看了看 `modinfo` 的输出，看起来基本的模块是在的，能返回
>
> ```shell
> modinfo nf_nat_ipv4
> ```

> [!TIP] 查看完整的内核模块
>
> ```shell
> sudo ls /lib/modules/$(uname -r)/kernel/net/netfilter/
> ```
>
> 查看 IPv4 相关的模块
>
> ```shell
> sudo ls /lib/modules/$(uname -r)/kernel/net/ipv4/netfilter/
> ```

然后在看别人的帖子的时候看到说这个和 `nf_nat_ipv4` 有关，这个时候用 `modprobe` 观察就可以发现 `nf_nat_ipv4` 缺失了：

```shell
$ modprobe nf_nat_ipv4
modprobe: FATAL: Module nf_nat_ipv4 not found in directory /lib/modules/6.1.0-10-amd64
```

## 修复

这下我摸不着头脑了，直到我看到一篇上古的在 2016 年的帖子给了我醍醐灌顶的一击：

> Another possible problem with the same symptoms is stale kernel running - after upgrade and before reboot. This is the one I encountered just now.[^1]

然后我就恍然大悟了。对啊！内核更新的时候可能会发生配置选项和路径变更，这个时候可能跑在一个过时的内核上，这个时候 Docker 和 `iptables` 异常都是非常正常的事情，还有可能发生别的更复杂的情况。

为了验证这个情况，通过

```shell
sudo systemctl reboot
```

重启之后发现 Docker 已经恢复正常了：

```shell
 $ sudo systemctl status docker
● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; preset: enabled)
     Active: active (running) since Wed 2023-12-13 09:47:09 UTC; 6s ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 1025 (dockerd)
      Tasks: 7
     Memory: 27.7M
        CPU: 237ms
     CGroup: /system.slice/docker.service
             └─1025 /usr/sbin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock

Dec 13 09:47:09 localhost dockerd[1025]: time="2023-12-13T09:47:09.285808913Z" level=info msg="[core] Subchannel Connectivity change to READY" module=grpc
Dec 13 09:47:09 localhost dockerd[1025]: time="2023-12-13T09:47:09.285894457Z" level=info msg="[core] Channel Connectivity change to READY" module=grpc
Dec 13 09:47:09 localhost dockerd[1025]: time="2023-12-13T09:47:09.300511903Z" level=info msg="[graphdriver] using prior storage driver: overlay2"
Dec 13 09:47:09 localhost dockerd[1025]: time="2023-12-13T09:47:09.303744784Z" level=info msg="Loading containers: start."
Dec 13 09:47:09 localhost dockerd[1025]: time="2023-12-13T09:47:09.489257121Z" level=info msg="Default bridge (docker0) is assigned with an IP address 172.17.0.0/16. Daemon option --bip can be>
Dec 13 09:47:09 localhost dockerd[1025]: time="2023-12-13T09:47:09.536110748Z" level=info msg="Loading containers: done."
Dec 13 09:47:09 localhost dockerd[1025]: time="2023-12-13T09:47:09.553699433Z" level=info msg="Docker daemon" commit=5d6db84 graphdriver(s)=overlay2 version=20.10.24+dfsg1
Dec 13 09:47:09 localhost dockerd[1025]: time="2023-12-13T09:47:09.553920794Z" level=info msg="Daemon has completed initialization"
Dec 13 09:47:09 localhost systemd[1]: Started docker.service - Docker Application Container Engine.
Dec 13 09:47:09 localhost dockerd[1025]: time="2023-12-13T09:47:09.592818728Z" level=info msg="API listen on /run/docker.sock"
```

为了确保不会弄错，我又去修改了一下 `iptables` 的系统软件替换选项：

```shell
$ sudo update-alternatives --config iptables
There are 2 choices for the alternative iptables (providing /usr/sbin/iptables).

  Selection    Path                       Priority   Status
------------------------------------------------------------
  0            /usr/sbin/iptables-nft      20        auto mode
* 1            /usr/sbin/iptables-legacy   10        manual mode
  2            /usr/sbin/iptables-nft      20        manual mode

Press <enter> to keep the current choice[*], or type selection number: 2
update-alternatives: using /usr/sbin/iptables-nft to provide /usr/sbin/iptables (iptables) in manual mode
```

然后执行

```shell
systemctl restart docker
```

发现 Docker 依然是正常的，这意味着之前的探索路线应该是错误了。

考虑到可能容器运行时或者 Docker API 有问题，我跑了一个很常见的 busybox 的容器并且进行了简单的网络测试：

```shell
$ docker run -it --rm busybox sh
Unable to find image 'busybox:latest' locally
latest: Pulling from library/busybox
6672f60b6ba8: Pull complete
Digest: sha256:1ceb872bcc68a8fcd34c97952658b58086affdcb604c90c1dee2735bde5edc2f
Status: Downloaded newer image for busybox:latest
/ #
/ #
/ # nslookup google.com
Server:		108.61.10.10
Address:	108.61.10.10:53

Non-authoritative answer:
Name:	google.com
Address: 142.250.72.238

Non-authoritative answer:
Name:	google.com
Address: 2607:f8b0:4007:816::200e
```

发现都是正常的了。

## 结论

看起来就是一个更新系统之后没有重启的乌龙 😂。

这个故事告诫我们要在重要系统更新之后重启系统，如果是云服务商自动更新的，也要记得通知客户然后重启系统，避免这样的尴尬局面 😂。

## 参考资料

- [linux kernel - Iptables v1.4.14: can't initialize iptables table `nat': Table does not exist (do you need to insmod?) - Stack Overflow](https://stackoverflow.com/questions/21983554/iptables-v1-4-14-cant-initialize-iptables-table-nat-table-does-not-exist-d)

[^1]: 在 [[SOLVED] iptables table NAT: Table does not exist (do ... to insmod?) / Newbie Corner / Arch Linux Forums](https://bbs.archlinux.org/viewtopic.php?id=182400) 帖子里面的评论
[^2]: 在 [Fails on completely new Debian 12 server · Issue #1184 · firewalld/firewalld](https://github.com/firewalld/firewalld/issues/1184)，[Firewalld fails on completely new Debian 12 server - Server Fault](https://serverfault.com/questions/1140935/firewalld-fails-on-completely-new-debian-12-server)（其实是同一个人发的帖子），[docker arm64 Error creating default "bridge" network iptables v1.8.7 (nf_tables): CHAIN_ADD failed (No such file or directory): chain POSTROUTING | 鱼香ROS](https://fishros.org.cn/forum/topic/1147/docker-arm64-error-creating-default-bridge-network-iptables-v1-8-7-nf_tables-chain_add-failed-no-such-file-or-directory-chain-postrouting) 和 [Chain ‘MASQUERADE‘ does not exist 报错解决_chain 'masquerade' does not exist-CSDN博客](https://blog.csdn.net/choumin/article/details/111935589) 这几篇帖子中都提及了 `nftables` 与 Docker 不兼容的问题。考虑到我还真的不熟悉 `nftables`，又去查了点资料，发现 Docker 以前的上游 Moby 是不支持的，参见 [[feature request] nftables support · Issue #26824 · moby/moby](https://github.com/moby/moby/issues/26824)，因此我又去找了 `nftables` 和 Docker 一起强行使用的教学文档，确实有很多，比如 [debian, docker and nftables](https://max.sodawa.com/blog/nftables-and-docker/) 和 [Docker nftables configuration for Debian 10](https://gist.github.com/goll/bdd6b43c2023f82d15729e9b0067de60)，[blog/posts/docker-nftables](https://github.com/alexandre-khoury/blog/tree/main/posts/docker-nftables) 都有比较详尽的介绍
[^3]: 在 [Docker in WSL2 | 洛冰河](https://www.glacierluo.com/tech/linux/docker_in_wsl2/) 文档中提及了切换这种系统软件的方法
