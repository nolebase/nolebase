# `which` `where` 获取命令对应的可执行文件

## 说明

which，哪个，where，在哪里的含义，使用这个命令可以获取可执行命令的具体位置，这个命令包含以下几种形式：

1. shell 程序定义、内建的可执行命令，比如 cd
2. shell 脚本，可以被 shell 程序读取的代码文件，比如 hello_world.sh、hello_world.zsh 等等
3. 二进制可执行文件，编译好的程序，比如 curl、ls 等等

找不到命令和东西的时候可以先用这个试试看w

### 语法

```shell
which [命令]

where [命令]
```

### 示例

```shell
$ which cd # shell 内建命令
cd: shell built-in command # cd: shell 程序内建的命令

$ which hello_world.sh # sh 脚本文件
/usr/local/bin/hello_world.sh

$ which curl # 二进制可执行文件
/usr/bin/curl
```
