---
share: "true"
---

`Linux-Header` 包的作用是提供内核头文件，这些文件是编译与内核相关的软件所必需的，特别是驱动程序和内核模块。以下是 `linux-headers` 的一些主要功能和用途：### 主要功能和用途

1. **编译内核模块**：
    
    - 内核头文件包含了编译内核模块所需的所有定义和结构。
    - 如果你要编译第三方驱动程序或内核模块（例如，显卡驱动、无线网卡驱动等），需要对应内核版本的头文件。
2. **开发内核相关软件**：
    
    - 如果你从事内核开发或调试工作，头文件提供了必要的接口和定义。
    - 包含内核提供的 API 和结构定义，使开发者能够编写与内核交互的代码。
3. **匹配当前内核**：
    
    - 每个内核版本都有其特定的头文件，头文件版本需要与运行的内核版本匹配。
    - 不同版本的内核可能有不同的结构和接口定义，因此确保头文件版本与内核版本一致非常重要。

### 头文件的组成部分

- **通用头文件**：适用于所有架构和硬件平台的头文件。
- **架构特定头文件**：针对特定硬件架构（例如 x86、ARM 等）提供的头文件。
我们可以通过下面几种方式安装：
# apt
```shell
sudo apt search linux-headers-$(uname -r)
# 看下有哪些Header，找一款合适自己内核版本的
sudo apt install linux-headers-$(uname -r)
```

# 源码编译
```shell
# 在内核源码下执行
make intdeb-pkg
```

# 手动下载
因为我遇到过内核为`6.5.13`,但就是没办法使用`apt`安装，所以可用这个网站[Ubuntu Kernel PPA](https://kernel.ubuntu.com/mainline)
找到`v6.5.13`
![[笔记/01 附件/Linux分析与调试-安装Linux-Header/image-20240714103055884.png|笔记/01 附件/Linux分析与调试-安装Linux-Header/image-20240714103055884.png]]
进入后：
![[笔记/01 附件/Linux分析与调试-安装Linux-Header/image-20240714103118755.png|笔记/01 附件/Linux分析与调试-安装Linux-Header/image-20240714103118755.png]]
我们使用`vmware ubuntu`，所以选择`x86_64或者叫AMD64`：
但是发现这里没有....
# 手动下载2
>上面发现`Ubuntu Kernel PPA`没有上传制作`ADM46`的`linux-headers`的`DEB`包。
>我们可以下载源码[内核官方网站](https://cdn.kernel.org/pub/linux/kernel)
![[笔记/01 附件/Linux分析与调试-安装Linux-Header/image-20240714103622958.png|笔记/01 附件/Linux分析与调试-安装Linux-Header/image-20240714103622958.png]]
```shell
wget https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.5.13.tar.xz
```

上面换成自己内核版本，通过命令`uname -r`可查看自己内核版本。
然后将其解压到`/usr/src`下：
```shell
sudo tar -xvf linux-6.5.13.tar.xz -C /usr/src
```
接着开始编译内核：
```shell
# 如果我们想沿用当前系统的config
cp /boot/config-$(uname -r) .config
# 或者
make oldconfig

# 如果想重新配置
make menuconfig

# 编译
make -j$(npron)
make module_install
sudo make install
sudo update-grub
# 再按上面小节-源码编译进行构建
```
