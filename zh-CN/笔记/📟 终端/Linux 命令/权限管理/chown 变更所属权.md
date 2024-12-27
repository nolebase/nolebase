# `chown` 变更所属权

## 说明

**ch**ange **own**ership，变更所属权的含义，使用该命令可以设置文件所有者和文件关联组的命令。

### 语法

此处 `-cfhvR` 是参数，可选项，`user` 指的是用户名，`:group` 是可选的，表示用户组名称

```shell
chown [-cfhvR] [--help] [--version] user[:group] <路径>
```

### 示例

1. 变更归属人

```shell
$ ls -la # 查看当前的文件详细信息
总用量 8
drwxrwxr-x  3 neko neko   32 10月 11 10:37 .
drwxr-xr-x 16 neko neko 4096 10月 12 13:35 ..
-rw-rw-r--  1 neko neko   16 10月  9 17:34 hello
drwxrwxr-x  2 neko neko    6 10月 11 10:37 tests

$ sudo chown root hello # 变更 hello 文件的归属权中「归属人」为 root

$ ls -la
总用量 8
drwxrwxr-x  3 neko neko   32 10月 11 10:37 .
drwxr-xr-x 16 neko neko 4096 10月 12 13:36 ..
-rw-rw-r--  1 root neko   16 10月  9 17:34 hello # 可以看到这里被变更为 root 了
drwxrwxr-x  2 neko neko    6 10月 11 10:37 tests
```

2. 变更归属人和用户组

```shell
$ ls -la # 查看当前的文件详细信息
总用量 8
drwxrwxr-x  3 neko neko   32 10月 11 10:37 .
drwxr-xr-x 16 neko neko 4096 10月 12 13:35 ..
-rw-rw-r--  1 neko neko   16 10月  9 17:34 hello
drwxrwxr-x  2 neko neko    6 10月 11 10:37 tests

$ sudo chown root:root hello # 变更 hello 文件的归属权中「归属人」和「归属用户组」为 root

$ ls -la
总用量 8
drwxrwxr-x  3 neko neko   32 10月 11 10:37 .
drwxr-xr-x 16 neko neko 4096 10月 12 13:38 ..
-rw-rw-r--  1 root root   16 10月  9 17:34 hello # 可以看到这里被变更为 root 了
drwxrwxr-x  2 neko neko    6 10月 11 10:37 tests
```

## 参数

### 其他参数

| 参数          | 说明                                 |
| ------------- | ------------------------------------ |
| **-c**        | 显示更改的部分的信息                 |
| **-f**        | 忽略错误信息                         |
| **-h**        | 修复符号链接                         |
| **-v**        | 显示详细的处理信息                   |
| **-R**        | 处理指定目录以及其子目录下的所有文件 |
| **--help**    | 帮助信息                             |
| **--version** | 版本信息                             |
