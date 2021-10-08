## macOS / Linux

### 创建 SSH 密钥对

SSH 相关的密钥、文件，都应该放到 `$HOME/.ssh` 目录下，也就是个人用户目录的 `.ssh` 目录，这个目录下，存放着以下几种文件：

1. `config` - ssh 连接配置文件
2. `xxx_rsa` - RSA 私钥文件
3. `xxx_rsa.pub` - RSA 私钥对应的公钥文件
4. `authorized_keys`  - 远程连接 SSH 时验证的公钥文件，每行一个公钥

**如果没有这个目录，需要使用 `mkdir` 手动创建该目录，创建时应该使用对应的用户进行创建，如果在 /home/rizumu 目录，则应该使用 rizumu 用户创建，而不是 root**
此处还需要注意的是 `.ssh` 目录和该目录下的文件权限，都有不同的要求：
权限说明：[[Linux 的权限]]

1. `.ssh` 目录要求 700 (drwx------)
2. `.pub` 公钥文件（包括但不限于 `.pub` 文件）要求 644 (-rw-r--r--)
3. `authorized_keys`（远程服务端）和 私钥文件（本地）要求 600 (-rw-------)

如果需要改变权限值，可以使用 `chmod` 进行调整

```shell
$ chmod 644 .ssh
```

1. 切换到 `$HOME/.ssh` 目录，也可以使用 `~/.ssh` 来表示

```shell
$ cd $HOME/.ssh
```

我们可以使用 `ssh-keygen` 来创建 `SSH` 密钥对，此处的参数：
1. t 表示算法，我们指定算法为 RSA
2. b 表示位数，我们指定为 4096 位的 RSA 密钥

```shell
$ ssh-keygen -t rsa -b 4096
```

于是

```shell
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/yuna/.ssh/id_rsa): github_rsa
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in github_rsa.
Your public key has been saved in github_rsa.pub.
The key fingerprint is:
SHA256:3P4U6I/ROsAaUJdYTAVHpZk02D80aTAjpIf4XDIDPUA yuna@Ayaka-MBP.local
The key's randomart image is:
+---[RSA 4096]----+
|   .Eo **BXo..   |
|     o=o=+.B=    |
|    ..*oo ++ .   |
|    .o B . .o    |
|     .o.S o ..   |
|      . oo . .   |
|       o .+ o    |
|      .   .B     |
|          o.o    |
+----[SHA256]-----+
```