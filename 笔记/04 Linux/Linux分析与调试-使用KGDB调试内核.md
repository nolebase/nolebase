---
share: "true"
---

# 前言

# 确定当前内核开启调试
在调试前我们需要确定该系统是否开启了支持内核调试：
```shell
# 使用如下命令
zcat /proc/config.gz

# 确认是否有如下配置：
CONFIG_DEBUG_KERNEL=y 
CONFIG_DEBUG_INFO=y 
CONFIG_GDB_SCRIPTS=y 
CONFIG_KGDB=y 
CONFIG_KGDB_SERIAL_CONSOLE=y
```
或者：
```shell
### 以下几个方式都可以###

# 查看是否有任何信息
dmesg | grep -i kgdb

# 挂载debugfs，然后在看看debug下是否有KGDB相关文件
mount -t debugfs none /sys/kernel/debug
ls /proc/sys/kernel/debug

# 查看模块
lsmod | grep kgdboc
```
# 获取源码
> 如果设备没有开启KGDB的话，我们需要编译源码来开启。
## 下载
```shell
sudo apt search linux-source
uname -r
# 寻找一个合适的源码包

sudo apt install linux-source-5.10.160 #版本选自己合适的
```
解压源码：
```shell
# 解压
cd /usr/src/linux-source-xxx
tar -xvf linux-source-xxx

# 处理，如果有debain等目录在其中，我们需要把解压的内容移动到上一层目录中
mv linux-source-xxx/* ./

# 复制本系统的配置到源码中
cp -v /boot/config-$(uname -r) .config
```
检查是否开启了上面的KGDB配置：
```shell
# 期间的错误，可以安装下面的软件(报什么错，就安装什么)
sudo apt install libncurses-dev

# /bin/sh: 1: flex: not found，解决如下：
sudo apt-get install flex

# /bin/sh: 1: bison: not found，解决如下：
sudo apt-get install bison

# 查看配置
make menuconfig

# 实际上我看到服务器版本是默认开启的,后面编译可以跳过
```
编译：
```shell
# 编译时会有些头文件没有
sudo apt install libelf-dev libssl-dev bc pahole
make -j$(npro)
sudo make modules_install
sudo make install
sudo update-grub
```
# 配置进入调试
进入调试分两类：
+ 启动时进入
+ 运行时进入
## 启动时进入
启动就进入调试模式有两种方式：
1. 修改`/etc/default/grub`
2. 开机进入高级设置
### 方法1
这需要修改`CMD LINE`：
```shell
sudo vim /etc/default/grub
# 写入：
#GRUB_CMDLINE_LINUX_DEFAULT=""
GRUB_CMDLINE_LINUX_DEFAULT="kgdboc=ttyXXXX,115200 kgdbwait"
```

### 方法2
在开机时，按住`shift`，然后进入高级设置，再次按下`e`，然后在配置中加入：
```shell
kgdboc=ttyXXXX,115200 kgdbwait
```
## 运行时进入

### 方法1
```shell
echo "ttyXXX" > /sys/module/kgdboc/parameters/kgdboc
```
当然有些系统可能没有这个文件夹，你需要编译源码时开启KGDBOC。
### 方法2
```shell
# 查看是否开启了sysrq
echo 1 | sudo tee /proc/sys/kernel/sysrq

# 查看它支持的事件
cat /proc/sys/kernel/sysrq

# 进入调试KGDB
echo g > /proc/sysrq-trigger
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240720180341422.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240720180341422.png]]
## 主机设备配置
我们需要将目标机上源码编译好的`vmlinux`复制到另外一台设备上，然后使用：
```shell
sudo gdb vmlinux
(gdb) set serail baud 115200
(gdb) target remote /dev/ttyS0
```
# 调试操作
调试的话有两种:
+ 使用`host`进行远程`gdb`
+ 调试串口进行`KGDB`调试
## 远程调试kgdb
> 查看[[#^39124e|示例3]]
> 这种调试与`gdb`操作无异

## 本地串口调试
进入调试后状态如下：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725222910395.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725222910395.png]]
我们使用`help`就可以看到命令列表：
```shell
Command         Usage                Description
----------------------------------------------------------
md              <vaddr>             Display Memory Contents, also mdWcN, e.g. md8c1
mdr             <vaddr> <bytes>     Display Raw Memory
mdp             <paddr> <bytes>     Display Physical Memory
mds             <vaddr>             Display Memory Symbolically
mm              <vaddr> <contents>  Modify Memory Contents
go              [<vaddr>]           Continue Execution
rd                                  Display Registers
rm              <reg> <contents>    Modify Registers
ef              <vaddr>             Display exception frame
bt              [<vaddr>]           Stack traceback
btp             <pid>               Display stack for process <pid>
bta             [D|R|S|T|C|Z|E|U|I|M|A]
                                    Backtrace all processes matching state flag
btc                                 Backtrace current process on each cpu
btt             <vaddr>             Backtrace process given its struct task address
env                                 Show environment variables
set                                 Set environment variables
help                                Display Help Message
?                                   Display Help Message
cpu             <cpunum>            Switch to new cpu
kgdb                                Enter kgdb mode
ps              [<flags>|A]         Display active task list
pid             <pidnum>            Switch to another task
reboot                              Reboot the machine immediately
lsmod                               List loaded kernel modules
sr              <key>               Magic SysRq key
dmesg           [lines]             Display syslog buffer
defcmd          name "usage" "help" Define a set of commands, down to endefcmd
kill            <-signal> <pid>     Send a signal to a process
summary                             Summarize the system
per_cpu         <sym> [<bytes>] [<cpu>]
                                    Display per_cpu variables
grephelp                            Display help on | grep
bp              [<vaddr>]           Set/Display breakpoints
bl              [<vaddr>]           Display breakpoints
bc              <bpnum>             Clear Breakpoint
be              <bpnum>             Enable Breakpoint
bd              <bpnum>             Disable Breakpoint
ss                                  Single Step
dumpcommon                          Common kdb debugging
dumpall                             First line debugging
dumpcpu                             Same as dumpall but only tasks on cpus
```

# 示例1(ubuntu启动KGDB)
> 使用如下环境操作
> + virtual box虚拟机
> + ubuntu22.04，Server(服务器)版本作为目标机器(target)
> + ubuntu22.04，Server(服务器)版本作为主机调试(host)

`target`指的是被调试的设备，`host`设备则指的是监视，和控制调试进程的设备。
**注意：因为在调试时希望可以看源码，我们在配置和编译好`target`源码后复制该虚拟机。**
## 目标调试机器配置
### 安装系统
可以参考：[[安装ubuntu-server版本|安装ubuntu-server]]。

### 准备一些软件
```shell
sudo apt install vim net-tools iputils-ping samba make gcc nano
```
# 安装源码
## 配置静态网络
```shell
sudo nano /etc/netplan/01-installer-config.yaml

# 配置示例
network: 
	version: 2 
		ethernets: 
			enp0s3: 
			addresses: 
			- 192.168.1.12/24 
		gateway4: 192.168.1.1
		nameservers: 
			addresses: 
				- 8.8.8.8 
				- 8.8.4.4
```
如果想配置动态：
```shell
network: 
	version: 2 
	ethernets: 
		enp0s3: 
			dhcp4:true	
```
### 下载源码
我们先查看一下内核版本：
```shell
uname -r
# 我这里是：
5.15.158

# 搜索一下
apt search linux-source-5.15
```
只找到一个版本：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721113443980.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721113443980.png]]
版本大概差不多，当然有更匹配的选择更精确。
安装源码：
```shell
sudo apt install linux-source-5.15.0
```
### 解压
```shell
cd /usr/src/linux-source-5.15.0
ls
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721113812002.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721113812002.png]]
这里我已经解压后的，实际上只有只有框中的3个文件。解压：
```shell
tar -xvf linux-source-5.15.0.tar.bz2
mv linux-source-5.15.0/* ./
rm -r linux-source-5.15.0/
```
## 编译源码
我们需要提前安装一些软件，作为环境，具体可以查看上面的流程。
### 配置
```shell
# 复制本系统的配置到源码中
cp -v /boot/config-$(uname -r) .config

# 
make menuconfig

# 配置config，请查看前面的：确定当前内核开启调试
```
### 编译与安装
```shell
make -j$(npro)
sudo make modules_install
sudo make install
sudo update-grub
```
之后重启。
## 调试
### 复制虚拟机
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721114613223.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721114613223.png]]
### 配置串口
`target`设置如下：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721114702362.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721114702362.png]]
`host`设置如下：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721114735224.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721114735224.png]]
启动系统时，要想两个串口可以在两个虚拟机中通信，需要先开启`未勾选:连接到至现有通道或套接字`的系统然后再启动`勾选的`。
### 测试串口
按照顺序启动两个系统，然后`target`设备
```shell
dmesg |grep tty

#发现log中显示物理串口被加载到ttyS0，我们记住这个

stty -F /dev/ttyS0 speed 115200
sudo cat /dev/ttyS0
```
然后在`host`上：
```shell
# 同上，查看串口被加载到那个tty上，我这里还是ttyS0

stty -F /dev/ttyS0 speed 115200
sudo su
echo Hello_uart > /dev/ttyS0
```
查看一些`target`是否有数据出现。
### 启动调试
`target`启动后，我们设置调试串口：
```shell
echo "ttyS0" > sys/module/kgdboc/parameters/kgdboc

# 进入调试KGDB
echo g > /proc/sysrq-trigger
```
当然也可以设置开机就进入调试，不过启动很慢。
`target`设置如下：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721120024390.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721120024390.png]]
在这里设备就会卡住，我们需要操作`host`端。
`host`端设置如下：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721120246202.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721120246202.png]]
这样便进入了`KGDB`调试。
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721120420480.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240721120420480.png]]

# 示例2(嵌入式系统启动KGDB)
> 这是一个嵌入式的调试过程，使用设备与软件如下：
> + A40i，Kernel-5.10.149， Qt5.10
> + ubuntu+vmware
> + 串口工具
## 配置
先试用`deconfig`或`./build.sh menuconfig`开启`KGDB`和`DEBUG`。
然后编译，烧录。
## 链接调试
在目标机器使用：
```shell
#先看看tty，在串口调试输入
#打印如下：
/dev/ttyS0

#我们设置
echo "ttyS0" > /sys/module/kgdboc/parameters/kgdboc
#也可以
echo "ttyS0,115200" > /sys/module/kgdboc/parameters/kgdboc

#然后设置
echo g > /proc/sysrq-trigger
```
接着会进入：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725205515146.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725205515146.png]]
我们输入help：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725205541869.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725205541869.png]]
这表示可以开始调试了。
## Host接入调试
我们打开`ubuntu`虚拟机，开启后，将串口接入到虚拟机：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725205958383.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725205958383.png]]
通过：
```shell
dmesg | grep tty
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725210055929.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725210055929.png]]
可以看到`ttyUSB0`是该调试串口
我们进入到源码目录：
```shell
cd SDK_SOURCE
cd out/a40i_h/kernel/build
```
接着输入（注意`sudo`）：
```shell
sudo ../../../toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-gdb vmlinux
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725210347713.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725210347713.png]]
我们设置波特率和串口：
```shell
set serial baud 115200
target remote /dev/ttyUSB0
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725210553523.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725210553523.png]]
可以看到，当前断点在`kgdb_breakpoint`;
# 示例3(调试示例)

^71dde3

^39124e
>这里使用的设备是：
>+ A40i，Kernel5.10，QT5.10 (==target==)
>+ Ubuntu22 ( ==Host==)
>+ 串口调试

`target`先进入`KGDB`
我们简单的进行调试一个驱动，这里挑选的是`i2c`，代码以及函数如下：
```shell
# SDK_SOURCE/kernel/linux-5.10/drivers/i2c/busses/i2c-sunxi.c
# 选择函数：
sunxi_i2c_status_show
```
我们阅读源码发现，该函数式通过读取`class`节点下的`status`触发进入。
我们在`host`端设置如下：
```shell
(gdb) b sunxi_i2c_status_show
(gdb) c
```
这样`target`则会继续执行，我们这样操作`target`：
```shell
cd /sys/class/i2c-adapter/i2c-0/device
cat status
```
执行上面命令后`target`会卡住。
我们看看`host`端，发现触发中断了：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725220151807.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725220151807.png]]
`gdb`中输入命令`list`可以查看一下源码：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725220229168.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725220229168.png]]
对比实际的源码：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725220304358.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725220304358.png]]
一模一样。
好了，我们开始单步调试：
```shell
(gdb) n
(gdb) n
(gdb) list
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221220630.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221220630.png]]
我们查看一下指针`i2c`的地址，但是：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221300762.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221300762.png]]
这里是被优化了，我们来看看`i2c_status`：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221332550.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221332550.png]]
我们直接使用：
```shell
(gdb) r
```
`target`显示：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221533662.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221533662.png]]
我们可以`print *attr`:
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221742862.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221742862.png]]
或打印`print *dev`：
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221825364.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240725221825364.png]]
# 示例4(调试用户定义模块)
> 在这里，我们需要编写一个简单的模块，然后进行调试。
>这里使用的设备是：
>+飞凌 A40i，Kernel5.10，QT5.10 (==target==)
>+ Ubuntu22 ( ==Host==)
>+ 串口调试

## 编译及加载
在此，我们使用[[lesson_4.c|文件节点操作]]来进行实验，我们先将其放入内核源码进行交叉编译，然后在上传到`target`设备：
```makefile
# makefile修改
#KERNEL_DIR=/SDK_SOUR/OKA40i-linux-sdk/kernel/linux-5.10
CROSS_COMPILE=/SDK_SOUR/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-
CC=$(CROSS_COMPILE)gcc
LD=$(CROSS_COMPILE)ld
PWD=$(shell pwd)
ARCH=arm

obj-m := lesson_4.o
module-objs := lesson_4.o

MAKE=make

all:
	$(MAKE) ARCH=${ARCH} CROSS_COMPILE=${CROSS_COMPILE} -C $(CROSS_COMPILE_PATH) M=$(PWD) modules

.PHONY:clean
clean:
	rm -rf ./*o ./*.ko ./.+ ./*.order ./Module.* ./*.mod.c ./.*.cmd -d ./.\w+
```
然后载入模块：
```shell
insmod lesson_4.ko
```
## 准备调试
我们通过以下方式获取模块的加载位置：
### 获取模块加载地址
#### 方式1
```shell
# 方式1
cat /proc/modules
# 结果如下：
lesson_4 16384 0 - Live 0xbf024000 (PO)
```
#### 方式2
```shell
# 方式2
cat /proc/kallsyms | grep lesson_4| sort
# 地址最小的那个就是
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727210810464.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727210810464.png]]
#### 方式3
```shell
# cd cat /sys/module/<module_name>/sections/
cat /sys/module/lesson_4/sections
ls -all # 如果是ls，"."开头的文件会隐藏，看不到
cat .text
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727211524703.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727211524703.png]]
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727211638563.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727211638563.png]]
### 进入调试
#### target进入
我们依照[[#^71dde3|示例3]]方法进入调试模式。
#### Host进入
同样我们依照[[#^71dde3|示例3]]方法进入调试模式。
我们进入驱动模块(文件节点)的源码目录，在里面启动`KGDB`:
```shell
# vmlinux在内核源码的输出目录，我们现需要使用vmlinux进入调试
# SDK_SOURCE/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-gdb

sudo /home/forlinx/work2/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-gdb /home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build/vmlinux
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727214332000.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727214332000.png]]
然后设置波特率参数，接着载入当前驱动的模块文件：
```shell
#地址是上面获取的
add-symbol-file lesson_4.ko 0xbf024000
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727214655457.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727214655457.png]]
我们设置一个断点：
```shell
(gdb) b scull_write 
```
然后使用`tty`连接调试设备，并继续运行设备：`c`。
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727215221231.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727215221231.png]]
接着在`target`上操作：
```shell
# 驱动这里并没有显示的创建文件节点，所以我们先看看scull设备的主设备号
dmesg
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727220250030.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727220250030.png]]
然后再创建一个文件节点：
```shell
mknode /dev/scull0 c 241 0
```
![[笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727220339330.png|笔记/01 附件/Linux分析与调试-使用KGDB调试内核/image-20240727220339330.png]]
接着：
```shell
echo 9 > /dev/scull0
```
之后就会进入中断，我们可以看看`host`端。






