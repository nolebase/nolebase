---
tags:
  - 命令行/docker
  - 运维/云原生/Docker
  - 运维/云原生/Kubernetes
  - 命令行/kubectl
  - 软件/云原生/containerd
  - 运维/网络
  - 基础设施/应用容器
  - 命令行/apt
  - 操作系统/Linux
  - 计算机/操作系统/Linux/内核/kernel
  - 计算机/操作系统/Linux/内核/procfs
---
# 容器既没有 `netstat` 和 `lsof` 也不是 `root` 时如何排查网络？手动解析 `procfs`！

## TL;DR

答案是直接手动解析 `procfs` 里面的输出！

执行

```shell
awk 'function hextodec(str,ret,n,i,k,c){
    ret = 0
    n = length(str)
    for (i = 1; i <= n; i++) {
        c = tolower(substr(str, i, 1))
        k = index("123456789abcdef", c)
        ret = ret * 16 + k
    }
    return ret
}
function getIP(str,ret){
    ret=hextodec(substr(str,index(str,":")-2,2)); 
    for (i=5; i>0; i-=2) {
        ret = ret"."hextodec(substr(str,i,2))
    }
    ret = ret":"hextodec(substr(str,index(str,":")+1,4))
    return ret
} 
NR > 1 {{if(NR==2)print "Local - Remote";local=getIP($2);remote=getIP($3)}{print local" - "remote}}' /proc/net/tcp 
```

就可以获得类似 `netstat` 的输出了w

## 前情提要

我在稍早前的时候发布过另外的一篇有关在缺失工具的容器内进行故障排查的笔记：[[容器里没有 ps 怎么办？]]，当时的情况是我们既有 `apt` 也有容器的 `root` 权限，在上述假设中：

1. 有 `root`，意味着我们甚至可以手动从容器外注入 `apt` 和用于初始化偏好的包管理器去安装自己想要的包
2. 有 `apt`，`ps` 多没劲啊，我们甚至可以额外安装 `btop` 或者 `htop` 来更好的观察应用和容器运行状态
3. 起码还能联网下载 `apt` 上的包，如果都不能联网了怎么办（在注重隐私和安全的 air gapped 环境中）？

退一万步讲，就算没有 `root` 和 `apt`，只要我们还能摸到宿主机，这一切都好说。

那如果，我们不是 `root`，用不了 `apt` 和 `dnf` 这样的包管理器，容器内因为诸如文件系统和预装软件的权限考量，没有为用户配置访问权限或者没网络来安装包时，又想要排查网络，应该怎么办呢？

我们团队正在开发的项目中就会涉及到所谓 rootless 的容器。

```shell
developer@neko-test-0:~$ netstat
netstat: command not found # [!code hl]
developer@neko-test-0:~$ lsof
bash: lsof: command not found # [!code hl]
developer@neko-test-0:~$ echo $UID
1000 # [!code hl]
developer@neko-test-0:~$ apt install net-tools
E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied) # [!code hl]
E: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), are you root? # [!code hl]
```

这样的容器：

1. 没有 `root` 权限，`UID` 虽然固定在 `1000` 但是没有预授权
2. 没有安装诸如 `netstat`，`ip` 甚至是 `lsof` 这样可以用于排查网络和进程的工具

虽然我遇到的场景和用例没有禁止访问网络，但是下面介绍的解决方案会有不需要网络访问也可以操作的。

## How to

### 如果能操作节点上的 `docker`，`nerdctl` 或者 `kubectl`

OK，这问题听起来还挺简单的，如果我们能够接触到运行 Docker/containerd/kubelet 的节点设备，恰好节点上也有预装了 `nsenter`，恰好节点上允许你操作 `docker` CLI 或者 `kubectl` CLI 的时候， 我们可以通过 [netstat - Docker: any way to list open sockets inside a running docker container? - Stack Overflow](https://stackoverflow.com/questions/40350456/docker-any-way-to-list-open-sockets-inside-a-running-docker-container) 介绍的方法，通过 `nsenter` 把当前所处的 cgroup 命名空间切换到和容器平齐的命名空间上再运行我们的命令：

```shell
$ docker inspect -f '{{.State.Pid}}' <容器 ID>
15652

$ sudo nsenter -t 15652 -n netstat
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
```

好的，问题解决了！

> 如果说我们没有办法摸到节点呢？

~~暂时的~~。

### 如果节点摸不到碰不着

这个时候我们能通过 `procfs` 来一窥 `lsof`（列出当前打开的文件）并且最终解析出端口是否监听吗？

> 当然可以！

不过会有点棘手，因为如果直接查看 `/proc/net/tcp` 的话会发现它完全是十六进制编码的输出，难以理解：

```shell
$ cat /proc/net/tcp
  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode
  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode                                                     
   0: 00000000:22B8 00000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 6217263 1 0000000000000000 100 0 0 10 0                   
   1: 0100007F:998E 0100007F:22B8 06 00000000:00000000 03:000014B4 00000000     0        0 0 3 0000000000000000                                      
   2: 0100007F:A198 0100007F:22B8 01 00000000:00000000 02:000002BB 00000000     0        0 6213151 2 0000000000000000 20 4 30 10 -1                  
   3: 0100007F:22B8 0100007F:A198 01 00000000:00000000 00:00000000 00000000  1000        0 6248876 1 0000000000000000 20 4 9 10 -1                   
   4: 0100007F:22B8 0100007F:9980 01 00000000:00000000 00:00000000 00000000  1000        0 6248972 1 0000000000000000 20 4 9 10 -1                   
   5: 0100007F:981E 0100007F:22B8 01 00000000:00000000 02:00000203 00000000     0        0 6213029 3 0000000000000000 20 4 24 10 -1                  
   6: 0100007F:97B6 0100007F:22B8 01 00000000:00000000 02:00000250 00000000     0        0 6213028 2 0000000000000000 20 4 28 10 -1                  
   7: 0100007F:C008 0100007F:22B8 06 00000000:00000000 03:000014B4 00000000     0        0 0 3 0000000000000000                                      
   8: 0100007F:22B8 0100007F:981E 01 00000000:00000000 00:00000000 00000000  1000        0 6248667 3 0000000000000000 20 4 3 10 -1                   
   9: 0100007F:22B8 0100007F:97B6 01 00000000:00000000 00:00000000 00000000  1000        0 6217326 1 0000000000000000 20 4 9 10 -1                   
  10: 0100007F:9980 0100007F:22B8 01 00000000:00000000 02:000002BC 00000000     0        0 6218415 2 0000000000000000 20 4 30 10 -1
```

不过好消息是，我们可以在终端里贴一个这样的脚本来获取到实际的端口号：

```shell
grep -v "rem_address" /proc/net/tcp  | awk 'function hextodec(str,ret,n,i,k,c){
    ret = 0
    n = length(str)
    for (i = 1; i <= n; i++) {
        c = tolower(substr(str, i, 1))
        k = index("123456789abcdef", c)
        ret = ret * 16 + k
    }
    return ret
} {x=hextodec(substr($2,index($2,":")-2,2)); for (i=5; i>0; i-=2) x = x"."hextodec(substr($2,i,2))}{print x":"hextodec(substr($2,index($2,":")+1,4))}'
```

输出了

```shell
0.0.0.0:8888
127.0.0.1:35226
127.0.0.1:8888
127.0.0.1:8888
127.0.0.1:38942
127.0.0.1:38838
127.0.0.1:8888
127.0.0.1:8888
127.0.0.1:35220
127.0.0.1:59442
127.0.0.1:46382
127.0.0.1:46394
127.0.0.1:8888
127.0.0.1:8888
```

什么原理呢？

#### 原理释义

如果我们把每一行都拆开来看的话，是这样的结构

<div class="w-full flex flex-row font-mono justify-center py-10">
  <div>
  8:
  <div class="text-blue-500">
	  0100007F:22B8 本地地址
  </div> 
  <div class="text-cyan-500">
	  0100007F:97B6 远端地址
  </div> 
  <div>01</div>
  <div>00000000:00000000</div>
  <div>00:00000000</div>
  <div>00000000</div>
  <div>...</div>
  </div>
</div>

现在我们期望解析地址，所以只需要关心<span class="text-blue-500">第一列</span>和<span class="text-cyan-500">第二列</span>即可。他们有着相同的结构，如果我们把<span class="text-blue-500">本地地址</span>单独拿出来看的话，他实际上是由这样的结构组成的：

<div class="w-full flex flex-row font-mono justify-center gap-0 hover:gap-4 [&_.ip-hex-block-group]:hover:gap-4 [&_.ip-hex-block-group-indicator]:hover:opacity-100 [&_.ip-hex-block-outer-right]:hover:rounded-l-lg [&_.ip-hex-block-outer-left]:hover:rounded-r-lg [&_.ip-hex-block-inner]:hover:rounded-l-lg [&_.ip-hex-block-inner]:hover:rounded-r-lg [&_.ip-hex-block-outer-left]:hover:border-r-2 [&_.ip-hex-block-inner]:hover:border-r-2 [&_.ip-hex-block-outer-right]:hover:border-l-2 transition-(all ease-in-out) duration-500 py-10">
  <div class="flex ip-hex-block-group relative flex-row gap-0 transition-(all ease-in-out) duration-500">
	  <div class="ip-hex-block ip-hex-block-outer-left p-2 rounded-l-lg border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>01</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>00</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>00</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>7F</span>
	  </div>
	  <div class="ip-hex-block-group-indicator absolute opacity-0 top-120% left-0 text-center transition-(all ease-in-out) duration-500 w-full">
	     <div class="border-t-0 border-r-0 border-l-2 border-b-2 border-solid rounded-sm absolute h-0.8rem w-[calc(50%-2rem)] left-0"></div>
		<span class="absolute left-[calc(50%-0.5rem)]">IP</span>
		<div class="border-t-0 border-l-0 border-r-2 border-b-2 border-solid rounded-sm absolute h-0.8rem w-[calc(50%-2rem)] right-0"></div>
	  </div>
  </div>
  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
     <span>:</span>
  </div>
  <div class="flex ip-hex-block-group relative flex-row gap-0 transition-(all ease-in-out) duration-500">
	  <div class="ip-hex-block ip-hex-block-outer-right py-2 px-6 rounded-r-lg border-2 border-l-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>22B8</span>
	  </div>
	  <div class="ip-hex-block-group-indicator absolute opacity-0 top-120% left-0 text-center transition-(all ease-in-out) duration-500 w-full">
	     <div class="border-t-0 border-r-0 border-l-2 border-b-2 border-solid rounded-sm absolute h-0.8rem w-[calc(50%-2rem)] left-0"></div>
		<span class="absolute left-[calc(50%-1rem)]">Port</span>
		<div class="border-t-0 border-l-0 border-r-2 border-b-2 border-solid rounded-sm absolute h-0.8rem w-[calc(50%-2rem)] right-0"></div>
	  </div>
  </div>
</div>

其中<span class="text-blue-500">前四列</span>为 IP 地址在十六进制编码下，采用小端序存储的模样，最后一列为<span class="text-blue-500">端口</span>在十六进制编码下的模样。

因此，既然我们有 `0100007F` 在手，我们就可以通过逆向编码拿回十进制表达的 IP 地址了。

首先，**转写为十进制**：

$$
\begin{eqnarray}
01_{hex} &=& {0 \times 16 ^ 1 + 1 \times 16 ^ 0} \\
&=& 0 + 1 \\
&=& 1_{decimal}
\end{eqnarray}
$$$$
00_{hex} = 0_{decimal}
$$
$$ 00_{hex} = 0_{decimal} $$
$$
\begin{eqnarray}
7F_{hex} &=& {7 \times 16 ^ 1 + 14 \times 16 ^ 0} \\
&=& {7 \times 16 + 15 \times 1} \\
&=& {112 + 15} \\
&=& 127_{decimal}
\end{eqnarray}
$$

我们**把求出来的值记录下来**：

<div class="w-full flex flex-row font-mono justify-center gap-0 hover:gap-4 [&_.ip-hex-block-group]:hover:gap-4 [&_.ip-hex-block-outer-right]:hover:rounded-l-lg [&_.ip-hex-block-outer-left]:hover:rounded-r-lg [&_.ip-hex-block-inner]:hover:rounded-l-lg [&_.ip-hex-block-inner]:hover:rounded-r-lg [&_.ip-hex-block-outer-left]:hover:border-r-2 [&_.ip-hex-block-inner]:hover:border-r-2 [&_.ip-hex-block-outer-right]:hover:border-l-2 transition-(all ease-in-out) duration-500 py-10">
  <div class="flex ip-hex-block-group relative flex-row gap-0 transition-(all ease-in-out) duration-500">
	  <div class="ip-hex-block ip-hex-block-outer-left p-2 rounded-l-lg border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>1</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>0</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>0</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-outer-right p-2 rounded-r-lg border-2 border-l-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>127</span>
	  </div>
  </div>
</div>

会发现顺序是反过来的，不要惊慌，因为存储的时候是存储为了[**小端序（little-endian）**](https://zh.wikipedia.org/wiki/%E5%AD%97%E8%8A%82%E5%BA%8F) 的格式，在这样的格式中，会首先在低位存储最低有效字节，反倒是我们用十进制表达的时候是采用的大端序格式，因此这就是预期的行为，翻转一下数组就好了：

<div class="w-full flex flex-row font-mono justify-center gap-0 hover:gap-4 [&_.ip-hex-block-group]:hover:gap-4 [&_.ip-hex-block-outer-right]:hover:rounded-l-lg [&_.ip-hex-block-outer-left]:hover:rounded-r-lg [&_.ip-hex-block-inner]:hover:rounded-l-lg [&_.ip-hex-block-inner]:hover:rounded-r-lg [&_.ip-hex-block-outer-left]:hover:border-r-2 [&_.ip-hex-block-inner]:hover:border-r-2 [&_.ip-hex-block-outer-right]:hover:border-l-2 transition-(all ease-in-out) duration-500 py-10">
  <div class="flex ip-hex-block-group relative flex-row gap-0 transition-(all ease-in-out) duration-500">
	  <div class="ip-hex-block ip-hex-block-outer-left p-2 rounded-l-lg border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>127</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>0</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>0</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-outer-right p-2 rounded-r-lg border-2 border-l-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>1</span>
	  </div>
  </div>
</div>

`22B8` 也可以**转换成对应的端口**了：

$$
\begin{eqnarray}
22B8_{hex} &=& 2 \times 16 ^ 3 + 2 \times 16 ^ 2 + 11 \times 16 ^ 1 + 8 \times 16 ^ 0 \\
&=& 2 \times 4096 + 2 \times 256 + 11 \times 16 + 8 \\
&=& 8192 + 512 + 176 + 8 \\
&=& 8888_{decimal}
\end{eqnarray}
$$
<div class="w-full flex flex-row font-mono justify-center gap-0 hover:gap-4 [&_.ip-hex-block-group]:hover:gap-4 [&_.ip-hex-block-group-indicator]:hover:opacity-100 [&_.ip-hex-block-outer-right]:hover:rounded-l-lg [&_.ip-hex-block-outer-left]:hover:rounded-r-lg [&_.ip-hex-block-inner]:hover:rounded-l-lg [&_.ip-hex-block-inner]:hover:rounded-r-lg [&_.ip-hex-block-outer-left]:hover:border-r-2 [&_.ip-hex-block-inner]:hover:border-r-2 [&_.ip-hex-block-outer-right]:hover:border-l-2 transition-(all ease-in-out) duration-500 py-10">
  <div class="flex ip-hex-block-group relative flex-row gap-0 transition-(all ease-in-out) duration-500">
	  <div class="ip-hex-block ip-hex-block-outer-left p-2 rounded-l-lg border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>127</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>0</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>0</span>
	  </div>
	  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-r-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>1</span>
	  </div>
	  <div class="ip-hex-block-group-indicator absolute opacity-0 top-120% left-0 text-center transition-(all ease-in-out) duration-500 w-full">
	     <div class="border-t-0 border-r-0 border-l-2 border-b-2 border-solid rounded-sm absolute h-0.8rem w-[calc(50%-2rem)] left-0"></div>
		<span class="absolute left-[calc(50%-0.5rem)]">IP</span>
		<div class="border-t-0 border-l-0 border-r-2 border-b-2 border-solid rounded-sm absolute h-0.8rem w-[calc(50%-2rem)] right-0"></div>
	  </div>
  </div>
  <div class="ip-hex-block ip-hex-block-inner p-2 rounded-none border-2 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
     <span>:</span>
  </div>
  <div class="flex ip-hex-block-group relative flex-row gap-0 transition-(all ease-in-out) duration-500">
	  <div class="ip-hex-block ip-hex-block-outer-right py-2 px-6 rounded-r-lg border-2 border-l-0 border-solid border-zinc-400 dark:border-zinc-400 transition-(all ease-in-out) duration-500">
	    <span>8888</span>
	  </div>
	  <div class="ip-hex-block-group-indicator absolute opacity-0 top-120% left-0 text-center transition-(all ease-in-out) duration-500 w-full">
	     <div class="border-t-0 border-r-0 border-l-2 border-b-2 border-solid rounded-sm absolute h-0.8rem w-[calc(50%-2rem)] left-0"></div>
		<span class="absolute left-[calc(50%-1rem)]">Port</span>
		<div class="border-t-0 border-l-0 border-r-2 border-b-2 border-solid rounded-sm absolute h-0.8rem w-[calc(50%-2rem)] right-0"></div>
	  </div>
  </div>
</div>

现在我们就转换成功了！得出了 <span class="text-blue-500">0100007F:22B8</span> 对应的是 <span class="text-blue-500">127.0.0.1:8888</span> 的结果；那么同理，<span class="text-cyan-500">0100007F:97B6</span> 对应的是 <span class="text-cyan-500">127.0.0.1:38838</span>

现在我们可以说，以第 8 行为例子，实际上 `procfs` 是在告诉我们：本地有一个 TCP 套接字端口 <span class="text-blue-500">127.0.0.1:8888</span> 连接到了 <span class="text-cyan-500">127.0.0.1:38838</span>。

那对应到代码里是什么样的呢？

#### 代码解析

在上面的脚本中，有这么一段函数声明：

```shell
function hextodec(str,ret,n,i,k,c){
    ret = 0
    n = length(str)
    for (i = 1; i <= n; i++) {
        c = tolower(substr(str, i, 1))
        k = index("123456789abcdef", c)
        ret = ret * 16 + k
    }
    return ret
}
```

核心就在这段函数里。

在 `hextodec` 函数中，参数是这样的：

- `str`：十六进制数字字符串；
- `ret`：间接存储十进制数字结果的变量（在循环调用的过程中会重新传递）；
- `n`：字符串长度；
- `i`：索引（在循环调用的过程中会重新传递）；
- `k`: 当前已经计算的十六进制数字的十进制值；
- `c`: 当前正在处理的字符。

如何利用 `hextodec` 解析呢？答案藏在 `getIP` 函数里面。

`getIP` 函数在调用的第一步采用这样的参数：

```shell
hextodec(substr($2,index($2,":")-2,2))
```

然后在中间过程中采用 `for` 循环时候的生成的参数：

```shell
for (i=5; i>0; i-=2) {
    ret = ret"."hextodec(substr(str,i,2))
}
```

在最后的端口转换中采用这样的参数：

```shell
hextodec(substr(str,index(str,":")+1,4))
```

把上面提到过的转换和解码自动化了 😄。

#### 那如果连 `grep` 都没有了怎么办

> 提问：上面提到的脚本中还运行了 `grep`，如果 `grep` 都没有怎么办？
> 回答：Emmmm，说真的，搞一个全面一点的容器吧，不要整花活了 😂。不过答案是，**可以！**

`grep` 就是查找而已，我们用 `awk` 一样可以处理输入：

```shell
awk 'function hextodec(str,ret,n,i,k,c){
    ret = 0
    n = length(str)
    for (i = 1; i <= n; i++) {
        c = tolower(substr(str, i, 1))
        k = index("123456789abcdef", c)
        ret = ret * 16 + k
    }
    return ret
}
function getIP(str,ret){
    ret=hextodec(substr(str,index(str,":")-2,2)); 
    for (i=5; i>0; i-=2) {
        ret = ret"."hextodec(substr(str,i,2))
    }
    ret = ret":"hextodec(substr(str,index(str,":")+1,4))
    return ret
} 
NR > 1 {{if(NR==2)print "Local - Remote";local=getIP($2);remote=getIP($3)}{print local" - "remote}}' /proc/net/tcp 
```

这样一来，我们就可以只依赖 `awk` 获得这样的输出：

```shell
Local - Remote
0.0.0.0:8888 - 0.0.0.0:0
127.0.0.1:38942 - 127.0.0.1:8888
127.0.0.1:59544 - 127.0.0.1:8888
127.0.0.1:8888 - 127.0.0.1:41678
127.0.0.1:38838 - 127.0.0.1:8888
127.0.0.1:41678 - 127.0.0.1:8888
127.0.0.1:8888 - 127.0.0.1:59442
127.0.0.1:8888 - 127.0.0.1:38942
127.0.0.1:59442 - 127.0.0.1:8888
127.0.0.1:59550 - 127.0.0.1:8888
127.0.0.1:8888 - 127.0.0.1:38838
```

好啦，你现在已经学会了鲜为人知的知识了，快去炫耀给小伙伴们看看吧，下次再遇到这样的光杆子容器，记得批斗一下创建容器的人。
## 参考资料

- [netstat without netstat | Staaldraad](https://staaldraad.github.io/2017/12/20/netstat-without-netstat/)
- [How to get listening ports inside a container without the netstat or lsof command | by Raphael Moraes | Webera](https://webera.blog/how-to-get-listening-ports-inside-a-container-without-the-netstat-or-lsof-command-83e21c772343)
- [Netstat without Netstat inside Containers - DEV Community](https://dev.to/trexinc/netstat-without-netstat-inside-containers-9ak)