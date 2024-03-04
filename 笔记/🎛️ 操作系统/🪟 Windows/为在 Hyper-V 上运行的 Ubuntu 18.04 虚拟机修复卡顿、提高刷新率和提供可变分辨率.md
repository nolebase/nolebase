---
tags:
  - 操作系统/Windows
  - 操作系统/Ubuntu
  - 知识领域/计算机图形学
  - 课程/GAMES101
  - 命令行/apt
  - 命令行/scoope
  - 命令行/vim
  - 命令行/Powershell
  - 命令行/wget
  - 命令行/chmod
  - 操作系统/Windows-Server
  - 命令行/vbmanage
  - 软件/虚拟机/VirtualBox
  - 软件/虚拟机/Hyper-V
  - 计算机/计算机科学/CS/虚拟化
  - 开源/库/opencv
  - 开发/虚拟化
  - 开发/语言/Python
  - 开发/语言/Python/Python2
  - 计算机/CPU-指令集/arm64
  - 计算机/硬件/芯片/Apple-Silicon
  - 计算机/硬件/芯片/Apple-Silicon/M1
---
# 为在 Hyper-V 上运行的 Ubuntu 18.04 虚拟机修复卡顿、提高刷新率和提供可变分辨率

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Ubuntu | 18.04 |  |
| Windows Server | 2022 Datacenter |  |

## 前言

昨天开始帮小音 @LittleSound 在家里的 Homelab 上配置 [GAMES101 课程](https://games-cn.org/intro-graphics/)需要用到的 Ubuntu 虚拟机环境（因为 opencv@2 在小音所使用的 Apple Silicon macOS 上不再被支持[^2]，而且上游有 python2.7 的引用[^1]，更别提，其实在这片文档撰写的时候，python2 已经离我们远去好几年了），配置的时候就发现了好几个问题：

1. 下载下来的 Ubuntu 18.04 是 VDI（VirtualBox 的虚拟磁盘镜像文件）格式的文件，需要进行转换，在 Homelab 的 Host Server（即 Windows Server）上进行操作的时候就发现这个需要安装 VirtualBox 后才能通过 VirtualBox 附带的 vbmanage 命令转换为 VHD，然而 VirtualBox 又需要 Python Core 和 Python 的 win32api 库，原本用 `scoope` 命令给安装的 python 也没用上，折腾了好一会儿；
2. 转换得到的 VHD 在创建为 Hyper-V Gen 2 虚拟机的时候又被提示不支持，通过 Hyper-V 自带的硬盘转换工具向导转换之后能创建但还是会提示 `SCSI disk (0,0) the boot loader did not load an operating system` 错误，说明转换之后需要连带着转换分区，但没那么多时间折腾，就又换回了 Hyper-V Gen 1 的虚拟机了；
3. 启动之后发现 Ubuntu 18.04 非常卡顿，看起来是某种性能问题；
4. 修复了卡顿问题之后又发现自己没办法改变 Ubuntu 18.04 的分辨率不可以被调整和选择。

## 动手修复吧

### 卡顿和刷新率异常问题

受限，幸运的是，这似乎是一个已知的 Linux Bug，在通用的 5.4 kernel Ubuntu-5.4.0-66.74 和 HWE kernel Ubuntu-hwe-5.8-5.8.0-44.50_20.04.1 中已经把这个问题修复了[^3]，但是这个修复似乎只有 20.04 有，那么 18.04 如果要修复的话要么装 patch 进行更新，要么修改一些配置，但是目前我担心运行 `apt` 相关的命令会导致预先准备的虚拟环境出现不兼容的问题，滚挂掉的话又是另一个故事了，所以我希望现在先在这里寻找一个可能的修复尝试一下。在 [Very slow framebuffer with hyperv_fb on recent Windows hosts, especially in Gen2 VM · Issue #655 · LIS/lis-next](https://github.com/LIS/lis-next/issues/655) 这篇 Issue 中有详细提及到这个 Bug 的复现和细节，其中有人给出了如下的解决方案：

```shell
sudo echo 'blacklist hyperv_fb' >> /etc/modprobe.d/blacklist.conf
```

你也可以自己通过下面的命令编辑 `/etc/modprobe.d/blacklist.conf` 文件

```shell
sudo vim /etc/modprobe.d/blacklist.conf
```

并在最后一行添加

```
blacklist hyperv_fb
```

来禁用 `hyperv_fb` 的内核拓展。

不过，如果你真的想要尝试亲自将 Ubuntu 的 Gen 1 虚拟机迁移到 Gen 2 的话，不妨参考一下这篇回答中的步骤：[Convert Hyper-V linux machine to Gen 2 - Server Fault](https://serverfault.com/a/1047507)

### 分辨率固定为 800 x 600 的问题

首先我们得确保我们有安装 `linux-image-extra-virtual` 这个包，否则视频输出可能会有问题，可以通过执行下面的操作来安装：

```shell
sudo apt install linux-image-extra-virtual
```

然后就是，网络上绝大多数指南和解答都是通过配置 `GRUB_CMDLINE_LINUX_DEFAULT` 和 `GRUB_CMDLINE_LINUX` 的 grub 变量配置来实现的分辨率变更[^4][^5][^6][^7]，但是这里有问题，他们所使用的下面的 grub 配置在我们上面编辑过 `/etc/modprobe.d/blacklist.conf` 之后就不再生效了，因为他们所使用的 `video=hyperv_fb:[the resolution you want]` 命令本质上是在设定 `hyperv_fb` 内核模块的参数，但禁用 `hyperv_fb` 之后是不会生效的。那，还有什么办法呢？

偶然间我看到了其中一个回答提及到了 XRDP 和 Windows Hyper-V 的特殊功能「Enhanced Session 增强会话」[^8]，会不会和这个有关？
巧的是，我也找到了 [How to Enable Hyper-V Enhanced Session for Ubuntu 20.04 VMs](https://www.nakivo.com/blog/install-ubuntu-20-04-on-hyper-v-with-enhanced-session/) 这篇文章有讲解如何为 Ubuntu 添加 Hyper-V「Enhanced Session」支持，也确实可以通过这个方法来为 Ubuntu 支持可变分辨率。

#### 激活 Enhanced Session Mode 增强会话模式

受限我们需要根据这篇 [Microsoft 官方文档](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/learn-more/use-local-resources-on-hyper-v-virtual-machine-with-vmconnect)的指南，在 Hyper-V 的「Enhanced Session Mode Policy 增强会话模式策略」配置中勾选并激活「Enhanced Session Mode 增强会话模式」。
当然你也可以通过在 Windows Server 上的 PowerShell 以管理员权限运行下面的命令来激活「增强会话模式」[^9]：

```powershell
Set-VMhost -EnableEnhancedSessionMode $True
```

然后在 Windows Server 上的 PowerShell 以管理员权限执行下面的命令为我们的 Ubuntu 虚拟机配置「增强会话传输类型」为 HvSocket[^10][^11]：

```powershell
Set-VM -VMName <your_vm_name> -EnhancedSessionTransportType HvSocket
```

我帮忙配置的 VM 叫 `GAMES101-Ubuntu`，所以命令就为：

```powershell
Set-VM -VMName "GAMES101-Ubuntu" -EnhancedSessionTransportType HvSocket
```

#### 安装必要的 Hyper-V 驱动和工具包

在 [How to Enable Hyper-V Enhanced Session for Ubuntu 20.04 VMs](https://www.nakivo.com/blog/install-ubuntu-20-04-on-hyper-v-with-enhanced-session/) 这篇文章里还提到了需要为 Ubuntu 执行一个来自于 [Hinara/linux-vm-tools](https://github.com/Hinara/linux-vm-tools) 仓库的 Ubuntu 安装脚本，通过这个脚本，将会为我们的 VM 安装包括先前提到的 XRDP 等工具以支持更好的远程操作和虚拟显示屏功能。另外需要注意的是，这个安装脚本 Fork 自 Microsoft 官方的 [microsoft/linux-vm-tools](https://github.com/microsoft/linux-vm-tools) Hyper-V Linux 访客 VM 增强脚本库，不过 Microsoft 官方的脚本仓库似乎已经公开存档了，不再更新，而来自 [Hinara/linux-vm-tools](https://github.com/Hinara/linux-vm-tools) 的脚本仓库还为更新版本的 Ubuntu 和 Arch Linux 等发行版提供了更新版本的脚本维护和支持，所以我们跟随原本的文章的指引，在 [Hinara/linux-vm-tools](https://github.com/Hinara/linux-vm-tools)  找到并下载对应的 Ubuntu 版本的安装脚本来安装必要的驱动和增强功能就好。

我创建的 Ubuntu 系统版本是 18.04，所以对应的下载目录应该在 [linux-vm-tools/ubuntu/18.04](https://github.com/Hinara/linux-vm-tools/tree/ubuntu20-04/ubuntu/18.04) ，通过 `wget` 命令下载原始文件就好：

```shell
wget https://github.com/Hinara/linux-vm-tools/raw/ubuntu20-04/ubuntu/18.04/install.sh
```

然后授权后使用 `sudo` 权限执行这个脚本

```shell
chmod +x ./install.sh && sudo ./install.sh
```

这个时候就会为我们的 Ubuntu 安装诸如：

- `linux-tools-4.15.0-212`
- `linux-tools-4.15.0-212-generic`
- `linux-tools-common`
- `linux-cloud-tools-4.15.0-212`
- `linux-cloud-tools-4.15.0-212-generic`
- `linux-cloud-tools-common`
- `linux-cloud-tools-virtual`
- `xorgxrdp`

等包，不过每个人的系统都各有不同，我这里列举出来的都是我缺失的包，大家也可以在脚本输出结果里看到具体的安装过程和安装结果。
安装之后我们可以通过下面的命令重启一下 Ubuntu，然后再试试看：

```shell
sudo reboot
```

这个时候我们再通过 Hyper-V 连接到 Ubuntu 的时候就会自动选择「Enhanced Session Mode 增强会话模式」进行连接了，不过如果没有使用这个模式的话也可以在左上角菜单选项中的最后一个选项中主动点击切换：

![](assets/hyper-v-ubuntu-lag-and-resolutions-fixes-screenshot01.png)

切换之后应该就能看到这样的界面了：

![](assets/hyper-v-ubuntu-lag-and-resolutions-fixes-screenshot02.png)

这个时候我们只需要输入我们以往在 Ubuntu 中登录时使用的用户名和密码就可以进入到系统当中。

不过先别着急，你可能会遇到和我一样的错误，比如像下面这样完全蓝屏：

![](assets/hyper-v-ubuntu-lag-and-resolutions-fixes-screenshot03.png)

或者看到左上角提示出现类似的错误：

```
Connecting to sesman ip 127.0.0.1 port 3350
sesman connect ok
sending login info to session manager, please wait...
login failed for display 0
```

这个时候不用慌张，可能是我们的 HWE 内核模块尚不齐全导致的，根据 [18.04 - Remote Desktop -- blue screen after login - Ask Ubuntu](https://askubuntu.com/a/1177338) 这篇回答中的提示，我们只需要安装一下 Ubuntu 18.04 专有的 `xorgxrdp-hwe-18.04` 包（其他版本尚不清楚，我比较少用 Ubuntu，没怎么调查过，如果你是其他版本的 Ubuntu 的话不妨自己搜索和排查看看）就能修复了：

```bash
sudo apt install xorgxrdp-hwe-18.04
```

安装完成之后我们还是照常重启一下，然后再次重复之前的登录操作，这下就能看到 Ubuntu 的完整大屏幕界面啦！

![](assets/hyper-v-ubuntu-lag-and-resolutions-fixes-screenshot04.png)

## 错误排查

- 如果你配置完 Hyper-V 的增强模式策略之后还是没有效果的话，不妨试着重启一下 Hyper-V 本体或者 Windows Server 来试图修复问题。
- 如果安装完 `xorgxrdp-hwe-18.04` 包还是无法正常看到画面的话，不妨参考一下这些回答：
  - 这篇回答中提及到了不少 Hyper-V 专属的包和驱动项目，也许可以参考参考 [linux - How can I run a Ubuntu Hyper-V vm in full screen mode incl. copy between host and vm? - Super User](https://superuser.com/questions/1267645/how-can-i-run-a-ubuntu-hyper-v-vm-in-full-screen-mode-incl-copy-between-host-an)
  - [Remote Desktop from Windows onto Ubuntu 22.04 takes me to a XRDP login then a blank screen - Ask Ubuntu](https://askubuntu.com/a/1404412)
  - [18.04 - Remote Desktop -- blue screen after login - Ask Ubuntu](https://askubuntu.com/questions/1166568/remote-desktop-blue-screen-after-login)
  - [xrdp - Can't connect to Hyper-V Ubuntu 20.04 VM after system program problem detected - Ask Ubuntu](https://askubuntu.com/questions/1296796/cant-connect-to-hyper-v-ubuntu-20-04-vm-after-system-program-problem-detected)
  - [virtualization - Ubuntu Hyper-V Guest Display Resolution Win 10 + 15.04 - Ask Ubuntu](https://askubuntu.com/questions/702628/ubuntu-hyper-v-guest-display-resolution-win-10-15-04)

## 延伸阅读

- [Very slow framebuffer with hyperv_fb on recent Windows hosts, especially in Gen2 VM · Issue #655 · LIS/lis-next](https://github.com/LIS/lis-next/issues/655)
- [windows - Ubuntu on Hyper-V sluggish/slow UI experience - Ask Ubuntu](https://askubuntu.com/questions/1263977/ubuntu-on-hyper-v-sluggish-slow-ui-experience)
- [Activate enhanced session mode for Ubuntu VMs in Hyper-V – 4sysops](https://4sysops.com/archives/activate-enhanced-session-mode-for-ubuntu-vms-in-hyper-v/)
- [Using Hyper-V Enhanced Session Mode](https://petri.com/using-hyper-v-enhanced-session-mode/)
- [How to Convert Hyper-V Gen 1 to Gen 2 VM - Vinchin Backup](https://www.vinchin.com/en/blog/convert-hyper-v-gen-1-to-2.html)
- [Convert Hyper-V virtual machines from generation 1 to 2 – 4sysops](https://4sysops.com/archives/convert-hyper-v-virtual-machines-from-generation-1-to-2/)
- [Convert Hyper-V linux machine to Gen 2 - Server Fault](https://serverfault.com/questions/654828/convert-hyper-v-linux-machine-to-gen-2)
- [[How to] Change Screen Resolution on Ubuntu 18.04 in Hyper-V VM](https://gist.github.com/bitchelov/0e29a0f706424a2f02716e62be3b12dc)
- [virtualization - Ubuntu Server 18.04 LTS cannot change resolution in Hyper-V - Ask Ubuntu](https://askubuntu.com/questions/1030276/ubuntu-server-18-04-lts-cannot-change-resolution-in-hyper-v)
- [virtual machine - Change screen resolution of Ubuntu VM in Hyper-V - Super User](https://superuser.com/questions/1660150/change-screen-resolution-of-ubuntu-vm-in-hyper-v)
- [ubuntu - How can I increase the Hyper-V display resolution? - Super User](https://superuser.com/questions/518484/how-can-i-increase-the-hyper-v-display-resolution)
- [HyperV Virtual Machine Not Covering Full-Screen - Ubuntu- Linux - 2022 - Microsoft Community](https://answers.microsoft.com/en-us/windows/forum/all/hyperv-virtual-machine-not-covering-full-screen/79330f73-ac1b-4ad9-9266-ff53842f7dd7)

[^1]: [python - How to install OpenCV 2.4 if it is no longer supported? - Stack Overflow](https://stackoverflow.com/questions/61779114/how-to-install-opencv-2-4-if-it-is-no-longer-supported)
[^2]: [macos - FFmpeg with opencv 4.7.0? - Super User](https://superuser.com/questions/1761181/ffmpeg-with-opencv-4-7-0)
[^3]: [windows - Ubuntu on Hyper-V sluggish/slow UI experience - Ask Ubuntu](https://askubuntu.com/a/1316949)，在这个问题的其中一个回答中提到：对于 Ubuntu 20.04，作者刚刚检查过，最新的 linux-azure 内核 Ubuntu-azure-5.4.0-1039.41（2021 年 1 月 18 日）仍然没有修复，但通用的 5.4 内核 Ubuntu-5.4.0-66.74 和 HWE 内核 Ubuntu-hwe-5.8-5.8.0-44.50_20.04.1 已经有修复。
[^4]: [Changing Ubuntu Screen Resolution in a Hyper-V VM | Microsoft Learn](https://learn.microsoft.com/en-us/archive/blogs/virtual_pc_guy/changing-ubuntu-screen-resolution-in-a-hyper-v-vm)
[^5]: [ubuntu - How can I increase the Hyper-V display resolution? - Super User](https://superuser.com/questions/518484/how-can-i-increase-the-hyper-v-display-resolution)
[^6]: [virtual machine - Change screen resolution of Ubuntu VM in Hyper-V - Super User](https://superuser.com/questions/1660150/change-screen-resolution-of-ubuntu-vm-in-hyper-v)
[^7]: [Adjust the Screen Resolution of an Ubuntu Hyper-V Virtual Machine – Arcane Code](https://arcanecode.com/2020/12/28/adjust-the-screen-resolution-of-an-ubuntu-hyper-v-virtual-machine/)
[^8]: [linux - How can I run a Ubuntu Hyper-V vm in full screen mode incl. copy between host and vm? - Super User](https://superuser.com/a/1769324)
[^9]: [Set-VMHost (Hyper-V) | Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/hyper-v/set-vmhost?view=windowsserver2022-ps#-enableenhancedsessionmode)
[^10]: [Hyper-V advanced session doesn't work - Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/138093/hyper-v-advanced-session-doesnt-work?childtoview=319218&orderby=newest)
[^11]: [How to Enable Hyper-V Enhanced Session for Ubuntu 20.04 VMs](https://www.nakivo.com/blog/install-ubuntu-20-04-on-hyper-v-with-enhanced-session/)
