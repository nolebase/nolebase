---
tags:
  - 开发/语言/Lua
  - 操作系统/macOS
  - 命令行/brew
---
## 前置条件

1. **安装与配置前请确认你有安装 Xcode**
2. **安装前请确保你的 PATH 中有：`/usr/local/bin` 或是 `/usr/bin`，如果没有请根据你使用的 shell 来进行配置，也可以配置到偏好的路径下**

## 下载

前往 [http://www.lua.org/download.html](http://www.lua.org/download.html) 来查看可用的最新版本
![](assets/image_20211015121714.png)

**右键箭头指示的文件名**（由于版本更新或时间问题，你看到的可能不是 lua-5.4.3.tar.gz），在浏览器菜单中选择 **「复制链接」**。
切换路径到别的不影响开发环境的路径，然后在终端使用 wget 命令获取 lua 安装包：

```shell
wget http://www.lua.org/ftp/lua-5.4.3.tar.gz
```

如果没有 wget 也可以用 curl

```shell
curl -O http://www.lua.org/ftp/lua-5.4.3.tar.gz
```

## 编译

在下载好的目录中，执行 tar 解压命令（也可以用访达（Finder）自带的解压工具）解压：

```shell
tar -zxvf lua-5.4.3.tar.gz
```

解压后就能在当前目录看到  lua-5.4.3 字样的目录，切换到该目录下，然后执行编译命令：

```shell
cd lua-5.4.3
make macosx
```

等待编译完成之后，目录下会出现 lua 和 luac 两个可执行文件。

## 安装

由于现在的 lua 编译脚本没有包含 install 指令的处理，我们必须自己移动到可执行文件的路径下。
接下来移动 lua 和 luac 到指定的文件夹（如果没有 /usr/local/bin，请替换为你偏好的路径）

```shell
cp lua /usr/local/bin && cp luac /usr/local/bin
chmod a+x /usr/local/bin/lua
chmod a+x /usr/local/bin/luac
```
