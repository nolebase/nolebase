# `cat` 输出文件

## 说明

**c**onc**a**tena**t**e，连环的含义，使用这个命令可以把任何文件的内容以文本形式输出到命令行上。

### 语法

`-AbeEnstTuv` 是所有参数，此处是可选的

```shell
cat [-AbeEnstTuv] [--help] [--version] 文件名
```

### 示例

1. 看文本文件
hello 文件里面写着：世界你好！

```shell
$ cat hello
世界你好！
```

2. 看二进制文件

```shell
$ which curl
/usr/bin/curl

$ cat /usr/bin/curl
ELF>��@��@8
            @@@@h����D�D 0H0H#0H#�79 �y�y#�y#@��� ���DDS�td��� P�td@%@%@%��Q�tdR�td0H0H#0H#�7�7/lib64/ld-linux-x86-64.so.2GNU�GNUGNU��w���e����8=R{#�x�A �
x{(�BE���|fUa8��qX{�M���O�nH�hQ�* #�4"A��3�c�uC�Dt:����`��
                                                          t5����
# 以下省略
```

可以看到它强行把这个文件读取了，这个里面还有很多文件头的信息，这些信息在上一个命令 **file** 中被它读取并且解析，作为文件的元数据展示给你

3. 看图片文件

![IMG_7413.jpg|100](../../assets/IMG_7413.jpg)
IMG_7413.jpg

```shell
$ cat IMG_7413.JPG
����JFIFHH��)�ExifMMJR(�iZ�HH�0221��0100��1��
((�HH�����      																														��
���"���

}!1AQa"q2��#B��R��$3br�
%&'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz�������������������������������������������������������������������������
```

可以看到这个地方它也会强行把这个文件读取，不会自动转换为 base64 编码，这个里面也有很多文件头信息，被 **file** 命令读取并且使用
