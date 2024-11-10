---
tags:
  - 软件/macOS
  - 操作系统/macOS
  - 命令行/pip
  - 命令行/conda
  - 命令行/mamba
  - 开发/Python
  - AI
---

# 在 macOS 上配置 GPT-SoVITS-WebUI

> - 中文用户遇到问题的话可以参考这个文档页面：[GPT-SoVITS指南](https://www.yuque.com/baicaigongchang1145haoyuangong/ib3g1e)
> - 英文用户可以用这个：[GPT-SoVITS local training+inference tutorial (rentry.co)](https://rentry.co/GPT-SoVITS-guide#/)

根据[文档所述](https://github.com/RVC-Boss/GPT-SoVITS/blob/main/README.md?plain=1#L47)，macOS 搭配 Python 3.9 和 PyTorch 2.2.2 是可以运行的：

- Python 3.9, PyTorch 2.2.2, macOS 14.4.1 (Apple silicon)

接下来我们先确保自己安装了 [`micromamba`](https://mamba.readthedocs.io/en/latest/installation/micromamba-installation.html)：

::: info 为什么用 `micromamba`，这和 `conda` 有啥关系吗？

`micromamba` 是 `conda` 和 `mamba` 统一共用的环境，`conda` 的依赖解析会比较慢，`mamba` 命令和 `conda` 兼容的，速度快很多，所以这里用 `micromamba` 安装之后自带的 `mamba`。

:::

```shell
brew install micromamba
```

然后我们可以用下面的命令创建

```shell
mamba create -n gpt-sovits-webui python=3.9
```

::: info 我不想折腾了，我就想用 `conda` 怎么办？

好吧，那你把 `mamba` 都换成 `conda` 然后执行就好了：

```shell
mamba create -n gpt-sovits-webui python=3.9
```

感谢 `micromamba` 做的环境管理策略，我们可以在 macOS 和其他安装了 `micromamba` 的环境上同时安装和共享 `conda` 和 `mamba`。

:::

接下来我们激活专属于 GPT-SoVITS-WebUI 的运行环境：

```
mamba activate gpt-sovits-webui
```

然后执行下面的命令安装依赖：

```shell
pip install -r requirements.txt
```

```shell
mamba install ffmpeg
```

## 延伸观看

https://www.bilibili.com/video/BV1P541117yn
https://www.bilibili.com/video/BV12g4y1m7Uw
https://www.bilibili.com/video/BV1QY4y1n7h1
