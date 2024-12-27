---
tags:
  - 开发/语言/Golang
  - 开发/Git
  - 命令行/git
  - 开源/软件/ssh
  - 命令行/ssh
---

# 通过 SSH 获取私有仓库中的 Go Package

下面所有的案例都假定我的 SSH 配置文件是这样撰写的：

```ssh-config
Host nekomeowww.git
    HostName ssh.github.com
    User git
    Port 443
    IdentityFile ~/.ssh/nekomeowww_github_2023.pub
```

## 打开 Git 配置文件

### 为全局所有 Git 存储库配置

为全局 Git 命令生效，即一次配置终生使用：

```shell
git config --global -e
```

### 仅为本地 Git 存储库配置

我一般会喜欢按照项目来配置，方便控制作用域：

```shell
git config --local -e
```

## 配置 Git

### 按域名进行配置

```shell
[url "git@<SSH 主机名称>:"]
  insteadOf = https://<GitLab 或者 GitHub 地址>/
```

可以写成这样来替换所有的 `example.com` 域名来指向自己的 SSH 配置：

```shell
# For performing go get ./... or go mod download with private go packages
[url "git@nekomeowww.git:"]
  insteadOf = https://example.com/
```

### 按组织进行配置

```shell
# For performing go get ./... or go mod download with private go packages
[url "git@<SSH 主机名称>:<组织>"]
  insteadOf = <SSH 主机名称>:<组织>
```

可以写成这样来替换 `myorg` 组织下的包：

```shell
# For performing go get ./... or go mod download with private go packages
[url "git@nekomeowww.git:myorg"]
  insteadOf = https://github.com/myorg/
```

### 按项目进行配置

```shell
# For performing go get ./... or go mod download with private go packages
[url "git@<SSH 主机名称>:<存储库 Repository 路径>"]
  insteadOf = https://<GitLab 或者 GitHub 地址>/<存储库 Repository 路径>
```

可以写成这样来替换 `myorg` 组织下的包 `mypackage`：

```shell
# For performing go get ./... or go mod download with private go packages
[url "git@nekomeowww.git:myorg/mypackage"]
  insteadOf = https://github.com/myorg/mypackage
```

- [go command - cmd/go - Go Packages](https://pkg.go.dev/cmd/go#hdr-Remote_import_paths)
- [bombsimon/meta-go-imports: 📦 HTTP server responding with <meta> tag for go import to work](https://github.com/bombsimon/meta-go-imports)
