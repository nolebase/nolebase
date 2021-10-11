## macOS / Linux

### 创建 SSH 密钥对

SSH 相关的密钥、文件，都应该放到 `$HOME/.ssh` 目录下，也就是个人用户目录的 `.ssh` 目录，这个目录下，存放着以下几种文件：

1. `config` - SSH 连接配置文件
2. `xxx_rsa` - RSA 私钥文件
3. `xxx_rsa.pub` - RSA 私钥对应的公钥文件
4. `authorized_keys`  - 远程连接 SSH 时验证的公钥文件，每行一个公钥

**如果没有这个目录，需要使用 `mkdir` 命令（参考 [[mkdir 创建目录]]）手动创建该目录，创建时应该使用对应的用户进行创建，如果在 `/home/rizumu` 目录，则应该使用 `rizumu` 用户创建，而不是 `root`**

```shell
$ mkdir $HOME/.ssh # 创建目录
```

```shell
$ sudo su rizumu # 切换用户到 rizumu
```

此处还需要注意的是 `.ssh` 目录和该目录下的文件权限，都有不同的要求：
权限说明：[[权限]]

1. `.ssh` 目录要求 700 (drwx------)
2. `.pub` 公钥文件（包括但不限于 `.pub` 文件）要求 644 (-rw-r--r--)
3. `authorized_keys`（远程服务端）和 私钥文件（本地）要求 600 (-rw-------)

如果需要改变权限值，可以使用 `chmod` 命令（参考 [[chmod 变更权限]]）进行调整

```shell
$ chmod 644 .ssh
```

1. 使用 `cd` 命令（参考 [[cd 变更目录]]）切换到 `$HOME/.ssh` 目录，也可以使用 `~/.ssh` 来表示

```shell
$ cd $HOME/.ssh
```

2. 创建密钥对

我们可以使用 `ssh-keygen` 命令（参考 [[ssh-keygen 创建 SSH 密钥]]）来创建 `SSH` 密钥对，此处的参数：
1. t 表示算法，我们指定算法为 RSA
2. b 表示位数，我们指定为 4096 位的 RSA 密钥

```shell
$ ssh-keygen -t rsa -b 4096 -C "<GitHub 账号的电子邮件地址>"
```

输入该命令后会提示下面的内容：

```shell
ssh-keygen -t rsa -b 4096 -C "neko@ayaka.moe"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/neko/.ssh/id_rsa): github_rsa # 此处需要填写私钥文件名称，github 的话可以填写 github_rsa
Enter passphrase (empty for no passphrase): # 设定私钥的密码，如果不希望每次使用都输入密码，可以留空，直接回车
Enter same passphrase again: # 确认密码，如果留空，直接回车
Your identification has been saved in github_rsa. # 私钥已保存 github_rsa
Your public key has been saved in github_rsa.pub. # 公钥已保存为 github_rsa.pub
The key fingerprint is: # 密钥对指纹为：
SHA256:3P4U6I/ROsAaUJdYTAVHpZk02D80aTAjpIf4XDIDPUA yuna@Ayaka-MBP.local
The key's randomart image is: # 随机码的可视化
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

现在就创建完毕了。私钥的文件存放在 `~/.ssh/<填写的私钥文件名>`内，公钥存放在 `~/.ssh/<填写的私钥文件名>.pub` 内

### 配置 GitHub 的 SSH

#### 创建新的 GitHub SSH 密钥条目

前往 [GitHub 个人设置 | SSH 与 GPG 密钥](https://github.com/settings/keys) 页面进行设置

![[github.com.20211008134945.png]]

点选 SSH Keys 右手边的绿色按钮 `New SSH Key` 来上传我们的公钥

![[github.com.20211008135202.png]]

#### 填写标题和公钥内容
标题只需要你看得懂，作为备注信息就好了。
获取公钥可以通过 `cat` 命令（参考 [[cat 输出文件]]）完成

```shell
$ cat ~/.ssh/github_rsa.pub # github_rsa 是上一步命名的私钥名称，公钥文件名直接在私钥文件名后面加 .pub 即可，可以根据自己的需求填写
```

复制里面的内容粘贴到 GitHub 的页面表单内即可

### 配置本地 SSH 连接

我们需要去 `~/.ssh/config` 文件中配置我们的连接，使用偏好的编辑器打开这个文件

```shell
$ nano ~/.ssh/config
```

SSH 配置文件的格式如下

```sshconfig
Host hostname
	HostName github.com
	User git
	IdentityFile ~/.ssh/github_rsa
```

1. **Host**：域，等同于别名，比如我们可以在这个地方填写 `gh`，下面的 HostName 填写 `github.com`，则连接的时候我们写 `gh` 就可以自动指向到 `github.com`，这个地方选择自己喜欢的方式命名即可，比如我喜欢 <用户名>.git 这样（nekomeowww.git），这样多用户的时候可以方便配置
2. **HostName**：域名，需要连接的远程服务器域名或是 IP 地址，GitHub 的 SSH 需要填写 github.com，GitLab 则填写 gitlab.com，如果是自建的 GitLab 实例，则需要填写对应的实例域名或是 IP
3. **User**：用户，连接时使用的用户，对于 GitHub SSH 而言，默认填写 git，不用写为自己的用户名，服务器那边会通过你的公钥自动判断的
4. **IdentityFile**：身份文件，一般是 RSA 密钥的私钥文件，格式不限，只要是复合 OpenSSH 规范的即可

我们往 `~/.ssh/config` 文件中写入上面自定义好的内容即可。

### 测试 GitHub 连接

使用 `ssh` 命令（参考 [[ssh 远程登入]]）加上参数 `T` 来测试

```shell
$ ssh -T <别名> # 别名填写上面 Host 字段的值
```

以我的配置为例，配置：

```sshconfig
Host nekomeowww.git
	HostName github.com
	User git
	IdentityFile ~/.ssh/nekomeowww_rsa
```

测试结果：

```shell
$ ssh -T nekomeowww.git
Hi nekomeowww! You've successfully authenticated, but GitHub does not provide shell access.
```

出现这样的字样就说明配置完成了，可以在 Git 命令行工具中使用了。


### 实际使用方式

以我的配置为例：

```sshconfig
Host nekomeowww.git
	HostName github.com
	User git
	IdentityFile ~/.ssh/nekomeowww_rsa
```

Git 克隆命令：

```shell
$ git clone nekomeowww.git:nekomeowww/repo.git
```

为老的仓库设定使用 SSH 连接：

```shell
$ git remote set-url origin nekomeowww.git:nekomeowww/repo.git
```

