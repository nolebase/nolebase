# `mkdir` 创建目录

## 说明

**m**a**k**e new **dir**ectory ，制作新的目录的含义，使用这个命令可以创建目录，甚至创建多个目录

### 语法

```shell
mkdir [-p] 目录名
```

### 示例

```shell
$ ls -la
总用量 4
drwxrwxr-x  2 neko neko    6 10月  9 17:14 .
drwxr-xr-x 16 neko neko 4096 10月  9 17:14 ..

$ mkdir test

$ ls -la
总用量 4
drwxrwxr-x  3 neko neko   18 10月  9 17:15 .
drwxr-xr-x 16 neko neko 4096 10月  9 17:15 ..
drwxrwxr-x  2 neko neko    6 10月  9 17:15 test # 多了一个 test 文件夹
```

## 参数

### 一次创建多个层叠目录 - 参数 p

如果你想要在 `~/test` 目录中创建一个 `~/test/1/2/3` 的目录，但是其中的 目录 `1` 和 目录 `2` 都不存在的时候，直接输入 `mkdir ~/test/1/2/3` 是无法完成操作的：

```shell
$ mkdir test/1/2/3
mkdir: 无法创建目录 “test/1/2/3”: 没有那个文件或目录
```

此时我们需要添加**参数 `p`**，`p` 指的是 parent（父级）来自动创建中间缺失的父级目录：
示例：

```shell
$ mkdir -p test/1/2/3

$ tree # 使用 tree 命令可以可视化打印当前的目录结构（包含文件）
.
└── test
    └── 1
        └── 2
            └── 3

4 directories, 0 files
```
