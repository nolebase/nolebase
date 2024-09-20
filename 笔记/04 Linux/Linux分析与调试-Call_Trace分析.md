---
share: "true"
---
# 概述

> 该分析主要是在内存dump出栈时，我们需要将其与源码对应起来。
# 本机分析准备
> 本机分析有一定的要求：
> 1. `vmlinux`
> 2. `linux-header`
> 3. `linux-source`

其中`linux-header`必须要有的，我们需要使用到里面的一些工具。
## 方法1
==条件：==本机如果在`usr/lib/boot/debug/vmlinux-$(uname -r)`
如果没有，则可使用教程安装Linux 内核的调试符号文件（symbol file）。
### 安装方法(ubuntu为例)
#### 方法1
如果内核源码对应交的叉编译存在`kernel/vmlinux`，可以直接复制到：
```shell
sudo cp /path/to/your/vmlinux /usr/lib/boot/debug/
```
#### 方法2
在线方法安装调试符号表，方法在：[安装符号表](https://ubuntu.com/server/docs/debug-symbol-packages)
```shell
sudo apt get linux-image-$(uname -r)-dbg
```

## 方法2
==条件：==在`/boot`下有`vmlinuz`。
我们使用命令：
```shell
file /boot/vmlinuz-$(unmae -r)
```
出现这样的打印：
```shell
vmlinuz-6.5.13: Linux kernel x86 boot executable bzImage, version 6.5.13 (root@Uubnut22) #1 SMP PREEMPT_DYNAMIC Sat Jul 13 19:07:28 CST 2024, RO-rootFS, swap_dev 0XB, Normal VGA
```
还可以使用查看头文件信息：
```shell
objdump -h /boot/vmlinuz-$(uname -r)
```
接着我们提取出`vmlinux`
```shell
# 从`vmlinux`中提取extract-vmlinux
# 或如下命令安装
sudo apt install binutils

# 如下命令生成：
/usr/src/linux-headers-6.5.0-41-generic/scripts$ ./extract-vmlinux /boot/vmlinuz-$(uname -r) > /tmp/vmlinux-$(uname -r)
```
可以再`tmp`目录看到`vmlinux`。
接着我们需要验证`vmlinux`是否有调试符号表：
```shell
file /tmp/vmlinux-$(uname -r)
```
若有如下信息中有`with debug_info`，则表示为可调试：
```shell
vmlinux: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, BuildID[sha1]=f3db60bb57359cd5e4ea398a89c22f17a89a6ff5, with debug_info, not stripped

# 也可以使用如下命令
readelf -S vmlinux|grep debug
# 出现便可调试
[37] .debug_info       PROGBITS         0000000000000000  04035670
```
否则无法调试。
## 方法3
> 如果有`linux-source`则可以使用源码重新生成`vmlinux`

上面是生成`vmlinux`的方法。
# 交叉分析准备
> 它主要是利用交叉编译下会生成`vmlinux`。

# 具体分析过程
> 所有的调试都需要调试生成了`vmlinux`
> 我们这里使用本机调试，但是需要`Linux-header`，我么这里使用的是`6.5.13`，但使用：
> `apt install linux-headers-6.5.13`没有找到，只有`6.5.0`，可以通过手动下载，参考

接着我们准备一个问题`module`，`callTraceTest.c`:
```C
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/slab.h>

static int __init call_trace_init(void)
{
    char *p = (char *)123456789;
    printk("call trace init\n");

    printk("*p = %d\n", *p);

    return 0;
}

static void __exit call_trace_exit(void)
{
    printk("call trace exit\n");
    return;
}

module_init(call_trace_init);
module_exit(call_trace_exit);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("PengXuan");
MODULE_DESCRIPTION("call trace demo");
MODULE_VERSION("1.0");
```

```shell
MACHINE=$(shell uname -m)
#ARCH=x86_64
ARCH=arm

ifeq "${ARCH}" "x86_64"
#ubuntu上编译自己的驱动
KERNELDIR=/usr/src/linux-headers-$(shell uname -r) 
else
ifneq "${MACHINE}" "x86_64"
#在目标机器上直接编译
KERNELDIR=/usr/src/linux-headers-$(shell uname -r) 
else
#交叉编译
KERNELDIR=/home/forlinx/work/lichee/linux-3.10
COMPILER_PATH=/home/forlinx/work/lichee/out/sun8iw11p1/linux/common/buildroot/host/usr/bin
CROSS_COMPILE=$(COMPILER_PATH)/arm-linux-gnueabihf-
CC=$(CROSS_COMPILE)gcc
LD=$(CROSS_COMPILE)ld
MAKE=make
endif
endif

BUILD_DIR=$(shell pwd)/build

obj-m := callTraceTest.o

all: Makefile
ifeq "${ARCH}" "x86_64"
	${MAKE} -C ${KERNELDIR} M=$(shell pwd) modules
else
ifeq "${MACHINE}" "x86_64"
#交叉编译
	${MAKE} -C ${KERNELDIR} M=$(shell pwd) modules
else
#本机编译
	${MAKE} -C ${KERNELDIR} M=$(shell pwd) modules
endif
endif

.PHONY:clean
clean:
	rm -f *.ko *.mod *.mod.c *.mod.o *.o *.order *.symvers .*.cmd
```

## Ubuntu上的分析
>该系统分许需要使用到源码，编译源码方法可以按照[[Linux分析与调试-使用KGDB调试内核#安装源码|编译源码]]，然后在按嵌入式系统方式进行分析。

## 嵌入式系统上的分析
> 这里使用的是：
> + `RK3588 Firefly`
> + `kernel 5.10.198`
> + 源码放在`ubuntu`系统上

将上面的驱动程序编译，然后：
```shell
sudo insmod callTraceTest.ko
```
将串口出现的`call trace`或者通过`dmesg`获取的`dump`信息保存至一个`call_trace.log`的文件。
### 目标系统上分析
> 这要求目标系统(嵌入式)有`addr2line`工具，同时要求目标设备上有`vmlinux`文件。
> 一般在`/boot`，`/usr/lib/debug/boot/`搜索

这种方法要求编出很多工具，对于一些简陋的嵌入式系统并不友好，所以不说明其分析方法(实际和下面在宿主机分析原理类似)。
### 宿主机上分析
我们编译的内核源码在`ubuntu`中，且它的外部模块为`callTraceTest.ko`。我们先确定几个参数：
+ `vmlinux`的位置，假设为：`RK3588_SOURCE/kernel/vmlinux`
+ 交叉编译工具的位置，假设为：`RK3588_SOURCE/prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-2021.07-x86_64-aarch64-none-linux-gnu/bin`
+ `decode_stacktrace.sh`的位置，假设为：`RK3588_SOURCE/kernel/scripts`
+ `addr2line`的位置(一般与交叉编译工具同目录)
+ 外部模块`callTraceTest.ko`，假设为：`call_trace`
接下来，我们按照下面的步骤进行分析：
1. 先进入`call_trace`
2. 然后执行如下命令：
   ```shell
export CROSS_COMPILE="/home/px/rk3588/prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-2021.07-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-"

RK3588_SOURCE/kernel/scripts/decode_stacktrace.sh RK3588_SOURCE/kernel/vmlinux ./ ./ < call_trace.log

# 使用方法（2种,这里使用的是第2种）：
1. decode_stacktrace.sh -r 5.10.160 [base_path] [module_path] < call_trace.log
2. decode_stacktrace.sh [vmlinux_path] [base_path] [module_path] < call_trace.log
```
3. 等待分析完成。
![[笔记/01 附件/Linux分析与调试-Call_Trace分析/image-20240809113627572.png|笔记/01 附件/Linux分析与调试-Call_Trace分析/image-20240809113627572.png]]
可以看到，出错的地址被解析出来了，这里是因为我在目标机器编译后，再`copy`到宿主机器上的，所以可以看到基地址与内核函数的基地址稍微不一样，我们只需要按照框中提示去翻阅源码即可。
