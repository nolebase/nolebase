---
title: 文件操作
author: mophia
---

# 文件操作

## 文件

### 1、什么是文件？

文件是操作系统提供给用户 / 应用程序操作硬盘的一种接口。

- 用户/应用程序（open()）
- 操作系统（文件）
- 计算机硬件（硬盘）

### 2、为何要用文件？

- 用户或应用程序可以通过文件，将数据永久保存到硬盘中。操作文件也就是操作硬盘.
- 用户或应用程序直接操作的是文件，对文件进行的所有操作，都是在向操作系统发送系统调用，然后再由操作系统将其转换成具体的硬盘操作.

### 3、如何用文件: open()

- 控制文件读写内容的模式：t （text，文本，默认模式） 和 b （二进制，bytes）

::: tip
t 和 b 不能单独使用，必须和 r / w / a 连用
:::

#### t 文本（默认的模式）

- 1、读写都是以 str（ unicode ） 为单位的
- 2、文本文件
- 3、必须指定 encoding = 'utf-8'

## 文件的基本操作

### 1. 打开文件

```py
f = open(r'path/a.txt', mode="rt")
print(f)
```

```py
open(r'C:\a\b\c\d.txt') # Windows 用法，r 代表 raw string
open('C:/a/b/c/d.txt')
```

- f 的数据类型是文件类型；
- f 的值是一种变量，占用的是应用程序的内存空间
- f 是文件对象，也称为文件句柄

### 2. 操作文件：读 / 写文件

应用程序对文件的读写请求都是在向操作系统发送系统调用，然后由操作系统控制硬盘把数据读入内存，或者写入硬盘.

```py
res = f.read()
print(res)
```

### 3. 关闭文件

```py
f.close()  # 回收操作系统资源 需要关闭

print(f)  # 变量 f 存在，但是不能再读了
# f.read()  # ValueError: I/O operation on closed file.
# del f  # 回收应用程序资源
```

## with 上下文管理

> t 模式

- 读写以 str（unicode）为单位
- 是文本文件
- 必须指定 `encoding = 'utf-8'`

```py
# 没有指定 encoding 参数，操作系统会使用自己默认的编码
# linux 默认 utf-8，windows 默认 jbk

with open('path/c.txt', mode='rt', encoding='utf8') as f:
    res = f.read()  # t 模式会将 f.read() 读出的结果解码成 unicode
    print(res, type(res))
```

内存：utf-8 格式的二进制 --> 解码 --> unicode

### 1. rt

- 默认的操作模式 只读模式，当文件不存在时报错，当文件存在时，文件指针跳到开始位置

```py
with open('path/c.txt', mode='rt', encoding='utf8') as f:
    # print('第一次读'.center(66, '*'))
    res = f.read()  # 把所有内容从硬盘读到内存
```

### 2. wt

- 只写模式，当文件不存在时，会创建空文件；当文件存在时，会清空文件，指针位于开始位置。

可用于创建全新的文件

```py
with open('t.txt', mode='wt', encoding='utf8') as f:
    f.write('666\n')
    # f.read()  # 报错，不可读
```

::: tip
- 在以 w 的模式打开文件后，在没有关闭的情况下，可以以多个 f.write() 连续写；
- 如果重新打开文件，则会清空文件
:::

```py
with open('e.txt', mode='rt', encoding='utf8') as f1, \
    open('f.txt', mode='wt', encoding='utf8') as f2:  # \ 代表上下两行的内容是同一行
    res = f1.read()
    f2.write(res)
```

- 拷贝文件

```py
src_file = input("源文件路径").strip()
dest_file = input("目标文件路径").strip()
with open(src_file, mode='rt', encoding='utf8') as f1, \
        open(dest_file, mode='wt', encoding='utf8') as f2:
    res = f1.read()
    f2.write(res)
```

### 3. a：追加写

- 在文件不存在时，会创建空文件；在文件存在时，文件指针会直接跳到末尾。
- 用来在原有的文件内存的基础上，写入新的内容，比如记录日志.

```py
with open('e.txt', mode='at', encoding='utf8') as f:
    f.write("")  # 在文件最后追加写
    # f.read()  # 报错，不能读
```

::: tip
w 和 a 模式的异同：

- 相同点： 打开文件不关闭的情况下，连续的写入，新写的内容会跟在前面的内容之后
- 不同点： w 模式打开文件时会清空文件，而 a 模式打开时不会清空文件，文件指针会跳到末尾。
:::

```py
# 注册功能
name = input("your name >>")
pwd = input("your password >>")
with open('db.txt', mode='wt', encoding='utf8') as f:
    f.write('{}:{}\n'.format(name, pwd))
```

#### 了解可读可写：

`+` 不能单独使用，必须配合 `r` `w` `b`
- r+t 可读可写（开头写，覆盖原内容） 但是特性是依据 r 的 文件不存在，报错
- w+t 读不出内容
- a+t
