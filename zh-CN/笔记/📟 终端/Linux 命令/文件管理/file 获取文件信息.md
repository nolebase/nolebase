# `file` 获取文件信息

## 说明

file，文件的含义，使用这个命令可以获取文件的信息、编码、格式、大小等等信息。

### 语法

```shell
file [-bcLvz][-f <名称文件>][-m <魔法数字文件>...][文件或目录...]
```

### 示例

1. 看文本文件

hello 文件里面写着：hello, world!

```shell
$ file hello
hello: ASCII text
```

hello 文件里面写着：世界你好！

```shell
$ file hello
hello: UTF-8 Unicode text
```

2. 看二进制文件

```shell
$ which curl
/usr/bin/curl

$ file /usr/bin/curl
/usr/bin/curl: ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 3.2.0, BuildID[sha1]=a8c37790f6e986650f939fc4eea9383d527b23fd, stripped
```

可以看到它说 curl 是一个 ELF 64 位 LSB 共享对象，对应平台 x86-64，版本 1（SYSV），通过动态链接库调用内部的运行库，调用到了 /lib64/ld-linux-x86-64.so.2 运行库，目标是为了 GUN/Linux 3.2.0 版本而构建的，BuildID 为 a8c37790f6e986650f939fc4eea9383d527b23fd 等等的信息...

3. 看图片信息

![IMG_7413.jpg|100](../../assets/IMG_7413.jpg)
IMG_7413.jpg

```shell
$ file IMG_7413.JPG
IMG_7413.JPG: JPEG image data, JFIF standard 1.01, aspect ratio, density 72x72, segment length 16, Exif Standard: [TIFF image data, big-endian, direntries=5, xresolution=74, yresolution=82, resolutionunit=2], progressive, precision 8, 1585x1536, components 3
```

可以看到它说这个 `IMG_7413.jpg` 文件是 JPEG 图片数据，使用 JFIF 标准 1.01 版本，宽高比，密度 72x72，片段长度 16，EXIF 标准：[TIFF 图片数据，big-endian，direntries 5，xresolution 74，yresolution 82，resolutionunit 2]，渐进式，精度为 8，1585x1536 分辨率，组件 3

这其中有好多术语和标准需要额外查阅资料，这里不多赘述。
