---
share: "true"
---
> 在部分非桌面芯片中，是无法通过`apt install`来按照perf的，所以我们需要交叉编译，这里的环境是：
> + A40i，Linux5.10.149，QT5.10（飞凌）
> + Ubuntu

想通过源码来编译`perf`工具，有两个方法：
+ 通过`buildroot`来编译，因为`perf`是用户层程序
+ 通过`kernel`下`tools`进行编译
# 尝试第一种(buildroot)
我们通过：`./build.sh buildroot_menuconfig`进入`buildroot`的配置：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112337219.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112337219.png]]
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112428936.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112428936.png]]
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112455171.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112455171.png]]
新名字叫`BR2_LINUX_KERNEL_TOOL_PERF`，我们来开启试试，按`1`进入配置，发现无法配置，看到它还有其他的依赖：`BR2_LINUX_KERNEL`。这个应该是在`buildroot`中开启`Linux`内核，但是我们的内核是外部的（厂家有自定义代码），所以看看是否能引入外部`kernel`。我们开启这个选项：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112802394.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112802394.png]]
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112819470.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112819470.png]]
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112831005.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728112831005.png]]
按`Y`后有许多配置，来看看是否有设置外部`kernel`选项。
找了一圈，并没有找到设置本地`kernel`的选项，只有设置`git`仓库，那这种办法是无可能了。

# 尝试第二种(Kernel)
这里通过内核来编译`perf`工具，我们先需要知道当前的脚本的编译参数是什么，我们查看`build.sh`文件获取编译内核时，具体执行了什么代码。
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728113714098.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728113714098.png]]
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728113934218.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728113934218.png]]
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114004873.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114004873.png]]
这里加一下打印：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114103869.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114103869.png]]
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114144563.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114144563.png]]
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114228764.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114228764.png]]
加了一条打印，然后编译看看：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114305467.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114305467.png]]
```shell
make CROSS_COMPILE=/home/forlinx/work2/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi- ARCH=arm -j8 O=/home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build KERNEL_SRC=/home/forlinx/work2/OKA40i-linux-sdk/kernel/linux-5.10 INSTALL_MOD_PATH=/home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/staging
```
去掉部分，然后上面的就是用来编译的指令。
我们进入`perf`目录，使用该命令：
```shell
cd SDK_SOURCE/OKA40i-linux-sdk/kernel/linux-5.10/tools/perf
make CROSS_COMPILE=/home/forlinx/work2/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi- ARCH=arm -j8 O=/home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build KERNEL_SRC=/home/forlinx/work2/OKA40i-linux-sdk/kernel/linux-5.10 INSTALL_MOD_PATH=/home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/staging
```
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114549425.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114549425.png]]
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114604056.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114604056.png]]
发现这里有问题，让我们按照软件，但是因为是交叉编译，不得不要考虑是不是真的是在本机上安装，因为我尝试在`ubuntu`按照上面提示安装并没有任何效果。所以我们得查一查检查函数：
选择其中一条打印，如：`No sys/sdt.h found, no SDT events are defined, please install systemtap-sdt-devel or systemtap-sdt-dev`
搜索关键字：`grep -nisr systemtap-sdt-devel`，发现：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114830010.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114830010.png]]
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114930705.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728114930705.png]]
检验函数：`$(feature-sdt)`，但是搜索整个源码，并没有找到定义，猜测可能是批量的模式匹配定义，所以我们搜索`grep -nswr ‘feature-’`，发现：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728115240506.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728115240506.png]]
可能是那个带`$(1)`的，我们查看一下：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728115335789.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728115335789.png]]
可以确定`90%`是这个。我们通过去掉`$(shell )`来打印(下面被注释的就是)，然后查看执行的命令，这里挑`libelf`，来看看检查命令是什么：
```shell
# 执行编译perf命令
make CROSS_COMPILE=/home/forlinx/work2/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi- ARCH=arm -j8 O=/home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build KERNEL_SRC=/home/forlinx/work2/OKA40i-linux-sdk/kernel/linux-5.10 INSTALL_MOD_PATH=/home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/staging
```
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728115823489.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728115823489.png]]
复制命令，在`linux5.10/tools/build/feature`下执行：
```shell
# 去掉了/dev/null
make OUTPUT=/home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build/feature/ CC="/home/forlinx/work2/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-gcc" CXX="/home/forlinx/work2/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-g++" CFLAGS=" " CXXFLAGS=" " LDFLAGS="-Wl,-z,noexecstack " -C /home/forlinx/work2/OKA40i-linux-sdk/kernel/linux-5.10/tools/build/feature /home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build/feature/test-libelf.bin
```
它实际上是进入``linux5.10/tools/build/feature``编译，我们看看该目录下的`Makefile`:
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728122619296.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728122619296.png]]
打印后如下：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728122852140.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728122852140.png]]
```shell
/home/forlinx/work2/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-gcc  -MD -Wall -Werror -o /home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build/feature/test-libelf.bin test-libelf.c -Wl,-z,noexecstack  > /home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build/feature/test-libelf.make.output 2>&1 -lelf
```
发现实际上是有输出的，我们查看：`/home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build/feature/test-libelf.make.output`内容如下：
```shell
test-libelf.c:2:20: fatal error: libelf.h: No such file or directory
```
我们尝试在源码内查找：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728123152741.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728123152741.png]]
再次编译：
```shell
/home/forlinx/work2/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-gcc  -MD -Wall -Werror -o /home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build/feature/test-libelf.bin test-libelf.c -Wl,-z,noexecstack  > /home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build/feature/test-libelf.make.output 2>&1 -lelf -I/home/forlinx/work2/OKA40i-linux-sdk/prebuilt/hostbuilt/linux-x86/include
```
显示缺库：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728123350060.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728123350060.png]]
在此查找：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728123414578.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728123414578.png]]
继续编译：
```shell
/home/forlinx/work2/OKA40i-linux-sdk/out/toolchain/gcc-linaro-5.3.1-2016.05-x86_64_arm-linux-gnueabi/bin/arm-linux-gnueabi-gcc  -MD -Wall -Werror -o /home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build/feature/test-libelf.bin test-libelf.c -Wl,-z,noexecstack  > /home/forlinx/work2/OKA40i-linux-sdk/out/a40i_h/kernel/build/feature/test-libelf.make.output 2>&1 -lelf -I/home/forlinx/work2/OKA40i-linux-sdk/prebuilt/hostbuilt/linux-x86/include -L/home/forlinx/work2/OKA40i-linux-sdk/prebuilt/hostbuilt/linux-x86/lib64
```
发现无法打开该库文件，我们使用`file /home/forlinx/work2/OKA40i-linux-sdk/prebuilt/hostbuilt/linux-x86/lib64/libelf.so`发现是`x86_64`库文件：
![[笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728123550210.png|笔记/01 附件/Linux分析与调试-Perf工具交叉编译/image-20240728123550210.png]]
怪不得，错误，所以这要求交叉编译的`libelf`，且是交叉编译的库，一般在`buildroot/out/host`下面这是`buildroot`的交叉编译工具库，所以我们需要在`buildroot`开启`libelf`，但是`libelf`又需要`linux kernel`，结合上一节问题，发现问题暂时无解。















