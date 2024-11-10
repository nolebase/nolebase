---
tags:
  - 命令行/conda
  - 命令行/mamba
  - 命令行/curl
  - 命令行/diff
  - 命令行/opendiff
  - 开发/Python
---
# Debug Anaconda 的包和镜像

今天遇到了一个问题，需要 debug 一下 `nb_conda_kernels@2.5.2-py312h06a4308_0` 包在 2.5.2 到 2.5.1 之间发生了什么。

因为直接使用 https://github.com/anaconda/nb_conda_kernels/compare/2.5.1...2.5.2 进行对比的时候没有发现明显的变化，但是修改了测试和构建的脚本，怀疑是发布包的时候出现了错误的信息造成的问题，因此想要去看看包的 `.tar.gz` 是什么样的结构。

首先我们先确认 `nb_conda_kernels` 是从什么 channel 下载的。

通过在有问题的环境直接跑安装的脚本：

```shell
mamba create -c defaults -c conda-forge 'python=3.12.3' pip ipykernel nb_conda_kernels=2.5.2 -n pip
```

我们会得到一个即将安装的 Transaction 的简报：

```shell
  Package                 Version  Build            Channel        Size
─────────────────────────────────────────────────────────────────────────
  Install:
─────────────────────────────────────────────────────────────────────────

  + python                 3.12.3  h996f2a0_1       pkgs/main      37MB
  + nb_conda_kernels        2.5.2  py312h06a4308_0  pkgs/main      45kB
```

这个时候可以观察到  `nb_conda_kernels` 的来源是 `pkgs/main`。

在 [Using default repositories — Anaconda documentation](https://docs.anaconda.com/working-with-conda/reference/default-repositories/) 文档中，我们可以发现 `pkgs/main` 隶属于 `Main channel`，链接为：

> [https://repo.anaconda.com/pkgs/main](https://repo.anaconda.com/pkgs/main)

直接访问的话会得到一个巨大无比的列表，这个列表就是我们在执行 `mamba install` 和 `conda install` 的时候会去拉取的包 index 文件。

在这个 index HTML 中包含了 `pkgs/main` 相关的所有包的最新版本、文档、仓库和简介的信息，这并不是我们想要的，我们需要的是页面顶部写着

```
linux-32   linux-64   linux-aarch64   linux-armv6l   linux-armv7l   linux-ppc64le   linux-s390x   noarch   osx-64   osx-arm64   win-32   win-64   zos-z
```

的行：

![[Pasted image 20241108170553.png]]

这些都是系统内核和 CPU 架构的编码，它会按照：

```
<系统内核>-<CPU 架构>
```

比如 `osx-arm64` 实际上就是 macOS 系统搭配 ARM64 架构的 CPU，即配备了 Apple Silicon 的 macOS 电脑设备。

我在 debug 的环境是 Linux 64bit 的容器环境，因此我们直接点击 `linux-64`，此时，链接将会变更为：

> [https://repo.anaconda.com/pkgs/main/linux-64/](https://repo.anaconda.com/pkgs/main/linux-64/)

这个 index 文件比刚刚入口的 index 文件大得多，包含了全部包的全部版本信息，直接打开的话，浏览器是会出现内存占用过高的问题的。
因此我们肯定没有办法直接去基于这个巨大的 HTML 文件去搜索和找到我们要找的 `nb_conda_kernels` 的包，作为替代方案，我们可以先下载下来：

```shell
curl -o pkgs-main-index.html https://repo.anaconda.com/pkgs/main/linux-64/
```

下载下来之后我们可以用 `grep` 直接搜索：

```shell
cat pkgs-main-index.html | grep 'nb_conda_kernels-2.5.2'
```

这个时候输出会变成：

```shell
<td><a href="nb_conda_kernels-2.5.2-py310h06a4308_0.conda">nb_conda_kernels-2.5.2-py310h06a4308_0.conda</a></td>
<td><a href="nb_conda_kernels-2.5.2-py310h06a4308_0.tar.bz2">nb_conda_kernels-2.5.2-py310h06a4308_0.tar.bz2</a></td>
<td><a href="nb_conda_kernels-2.5.2-py311h06a4308_0.conda">nb_conda_kernels-2.5.2-py311h06a4308_0.conda</a></td>
<td><a href="nb_conda_kernels-2.5.2-py311h06a4308_0.tar.bz2">nb_conda_kernels-2.5.2-py311h06a4308_0.tar.bz2</a></td>
<td><a href="nb_conda_kernels-2.5.2-py312h06a4308_0.conda">nb_conda_kernels-2.5.2-py312h06a4308_0.conda</a></td>
<td><a href="nb_conda_kernels-2.5.2-py312h06a4308_0.tar.bz2">nb_conda_kernels-2.5.2-py312h06a4308_0.tar.bz2</a></td>
```

`py310`，`py311`，以及 `py312` 是 `python` 的不同版本，可以理解为这个特定的 `nb_conda_kernels` 构建产物只支持 `python@3.10` 或者 `python@3.11`，以此类推...

我们只需要关心我们的 python 版本就好了，这样的话就只剩下 2 个文件需要特别注意了：

```shell
nb_conda_kernels-2.5.2-py312h06a4308_0.conda
nb_conda_kernels-2.5.2-py312h06a4308_0.tar.bz2
```

其中，`.conda` 文件是第二代的规范设计的标准，可以带来更快的速度，本质是一个 `.zip` 的（文件头为：`Zip archive data, at least v2.0 to extract, compression method=store`，可以用 `file` 命令可以直接查看）文件，更具体的标准规范在 [Conda package specification](https://docs.conda.io/projects/conda-build/en/latest/resources/package-spec.html) 这里。

另外 `.tar.bz2` 是最早版本的 conda 包的格式，是默认的 `conda-build` 的输出格式。

既然 `.conda` 文件是第二代的文件，比较新的话，我们就下载这一份即可，我们直接拼到之前的 HTTP 路径上即可：

```shell
curl -o nb_conda_kernels-2.5.2-py312h06a4308_0.conda https://repo.anaconda.com/pkgs/main/linux-64/nb_conda_kernels-2.5.2-py312h06a4308_0.conda
```

想要了解包内的信息的话，我们只需要用这个命令解压 `.conda` 文件就好了：

```shell
mkdir nb_conda_kernels-2.5.2-py312h06a4308_0
tar xjf nb_conda_kernels-2.5.2-py312h06a4308_0.conda -C nb_conda_kernels-2.5.2-py312h06a4308_0
```

解压之后，文件内容是这样的：

```shell
ls -la nb_conda_kernels-2.5.2-py312h06a4308_0
.rw------- 15k neko  1 Jan  1980 info-nb_conda_kernels-2.5.2-py312h06a4308_0.tar.zst
.rw-------  31 neko  5 Nov 16:01 metadata.json
.rw------- 30k neko  1 Jan  1980 pkg-nb_conda_kernels-2.5.2-py312h06a4308_0.tar.zst
```

接下来我们继续解压：

```shell
cd nb_conda_kernels-2.5.2-py312h06a4308_0
mkdir info
mkdir pkg
tar xjf info-nb_conda_kernels-2.5.2-py312h06a4308_0.tar.zst -C info
tar xjf pkg-nb_conda_kernels-2.5.2-py312h06a4308_0.tar.zst -C pkg
```

再次查看输出的时候：

```shell
$ ls -la .
drwxr-xr-x   - neko  8 Nov 17:25 info
.rw------- 15k neko  1 Jan  1980 info-nb_conda_kernels-2.5.2-py312h06a4308_0.tar.zst
.rw-------  31 neko  5 Nov 16:01 metadata.json
drwxr-xr-x   - neko  8 Nov 17:25 pkg
.rw------- 30k neko  1 Jan  1980 pkg-nb_conda_kernels-2.5.2-py312h06a4308_0.tar.zst
```

就可以看到和标准规范文档  [Conda package specification](https://docs.conda.io/projects/conda-build/en/latest/resources/package-spec.html) 提及到的一样的 `info/` 和 `pkg/` 的文件结构了。

现在我们先把 `nb_conda_kernels-2.5.2-py312h06a4308_0` 放到一边。

出现 bug 之前的版本是 `2.5.1`，和以前一样，我们先用命令跑一下看看是输出的什么包：

```shell
mamba create -c defaults -c conda-forge 'python=3.12.3' pip ipykernel nb_conda_kernels=2.5.1 -n pip
```

我们会得到一个即将安装的 Transaction 的简报：

```shell
  Package                         Version  Build            Channel          Size
───────────────────────────────────────────────────────────────────────────────────
  Install:
───────────────────────────────────────────────────────────────────────────────────

  + python                         3.12.3  h996f2a0_1       pkgs/main        37MB
  + nb_conda_kernels                2.5.1  pyh707e725_2     conda-forge      22kB
```

可以看到，先前 `nb_conda_kernels@2.5.1` 是发布到 `conda-forge` 的。

我们可以到

> https://anaconda.org/conda-forge/nb_conda_kernels/files

这里查看版本的全部文件。找到我们想要的 build 版本：[nb_conda_kernels-2.5.1-pyh707e725_2.conda](https://anaconda.org/conda-forge/nb_conda_kernels/2.5.1/download/noarch/nb_conda_kernels-2.5.1-pyh707e725_2.conda)。

和之前一样，我们也是下载这个 `.conda` 下来进行处理：

```shell
curl -o nb_conda_kernels-2.5.1-pyh707e725_2.conda https://anaconda.org/conda-forge/nb_conda_kernels/2.5.1/download/noarch/nb_conda_kernels-2.5.1-pyh707e725_2.conda -L
```

```shell
mkdir nb_conda_kernels-2.5.1-pyh707e725_2
tar xjf nb_conda_kernels-2.5.1-pyh707e725_2.conda -C nb_conda_kernels-2.5.1-pyh707e725_2
cd nb_conda_kernels-2.5.1-pyh707e725_2
mkdir info
mkdir pkg
tar xjf info-nb_conda_kernels-2.5.1-pyh707e725_2.tar.zst -C info
tar xjf pkg-nb_conda_kernels-2.5.1-pyh707e725_2.tar.zst -C pkg
```

现在输出是这样：

```shell
$ ls -la .
drwxr-xr-x    - neko  8 Nov 17:38 info
.rw------- 6,8k neko  1 Jan  1980 info-nb_conda_kernels-2.5.1-pyh707e725_2.tar.zst
.rw-------   31 neko 26 Abr 16:49 metadata.json
drwxr-xr-x    - neko  8 Nov 17:38 pkg
.rw-------  15k neko  1 Jan  1980 pkg-nb_conda_kernels-2.5.1-pyh707e725_2.tar.zst
```

现在我们就可以直接开始对比了：

```shell
$ diff -u nb_conda_kernels-2.5.1-pyh707e725_2/info/info/index.json nb_conda_kernels-2.5.2-py312h06a4308_0/info/info/index.json
--- nb_conda_kernels-2.5.1-pyh707e725_2/info/info/index.json	2024-04-27 00:49:24
+++ nb_conda_kernels-2.5.2-py312h06a4308_0/info/info/index.json	2024-11-05 23:59:51
@@ -1,20 +1,22 @@
 {
-  "arch": null, # [!code] --
-  "build": "pyh707e725_2", # [!code] --
-  "build_number": 2, # [!code] --
+  "arch": "x86_64", # [!code] ++
+  "build": "py312h06a4308_0", # [!code] ++
+  "build_number": 0, # [!code] ++
+  "constrains": [ # [!code] ++
+    "notebook >=5.3.0" # [!code] ++
+  ], # [!code] ++
   "depends": [
-    "__unix", # [!code] --
     "jupyter_client >=4.2",
-    "notebook", # [!code] --
+    "jupyter_core", # [!code] ++
     "psutil",
-    "python >=3.8", # [!code] --
-    "requests" # [!code] --
+    "python >=3.12,<3.13.0a0", # [!code] ++
+    "traitlets" # [!code] ++
   ],
   "license": "BSD-3-Clause",
+  "license_family": "BSD", # [!code] ++
   "name": "nb_conda_kernels",
-  "noarch": "python", # [!code] --
-  "platform": null, # [!code] --
-  "subdir": "noarch", # [!code] --
-  "timestamp": 1714150164539, # [!code] --
-  "version": "2.5.1" # [!code] --
+  "platform": "linux", # [!code] ++
+  "subdir": "linux-64", # [!code] ++
+  "timestamp": 1730822391556, # [!code] ++
+  "version": "2.5.2" # [!code] ++
 }
```

可以看得出来，`notebook` 这个依赖被移除了。

当然看不习惯命令行输出的话也可以用

```shell
opendiff nb_conda_kernels-2.5.1-pyh707e725_2/info/info/index.json nb_conda_kernels-2.5.2-py312h06a4308_0/info/info/index.json
```

直接进行 diff 对比：

![[Pasted image 20241108174435.png]]