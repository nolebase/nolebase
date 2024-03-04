---
tags:
  - 网站/GitLab
  - 开发/CICD
  - 开发/CICD/GitLab-CI
  - 开发/标记语言/YAML
  - 操作系统/CentOS
  - 命令行/yum
  - 命令行/chmod
  - 开发/DevOps
  - 命令行/git
  - 开发/标记语言/TOML
  - 命令行
  - 计算机/操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Linux
  - 开发/Git
---
# 配置 GitLab CI 自动部署

本教程预期实现将前端代码提交到 test 分支或者合并到 test 分支时触发自动部署脚本，从而实现自动部署测试环境的目的。

> 本篇不包含如何建立网站服务器的内容，只讲述如何配置 GitLab CI。

## 将要使用到的工具

### 1. gitlab-runner

是一个与 GitLab CI/CD 联动，在服务端运行 CI/CD 作业的自动化程序。

### 2. `.gitlab-ci.yml`文件

一个放在项目根目录下的 yaml 文件，里面描述了 CI/CD 的触发条件和工作流程。
具体语法可以参考 [官方文档](https://docs.gitlab.com/ee/ci/yaml/index.html)

## 配置流程

### 安装 GitLab Runner

1. 移除旧版本仓库

```shell
sudo rm /etc/yum.repos.d/runner_gitlab-ci-multi-runner.repo
```

2. 添加 GitLab's 官方仓库

```shell
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | sudo bash
```

3. 下载最新版 GitLab Runner

```shell
sudo yum install gitlab-runner
```

#### 注册 GitLab Runner

安装好了gitlab-runner，还要进行注册，执行以下操作

```shell
sudo gitlab-runner register
```

#### 之后会为注册输入一系列信息

1. 填写仓库所在 GitLab 服务器的 URL

``` shell
Enter your GitLab instance URL:
```

例如：`http://gitlab.example.com/`

2. 填写对应 GitLab 仓库的 Runner token 信息

```shell
Enter the token you obtained to register the Runner
```

进入 GitLab 仓库的`设置` -> `CI/CD` -> `Runner` 就可以看到 Runner 的 Token 了，把它复制过来，贴上。

3. Runner 的描述

```shell
Enter a description for the Runner, you can change this later in GitLab's UI:
```

简短的描述一下这个 Runner

4. Runner 的标签

```shell
> Enter the tags associated with the Runner, you can change this later in GitLab's UI:
```

GitLab CI 会通过标签来判断需要吧 gitlab-ci.yml 脚本中的任务分配给哪个 Runner。
这里可以填写 `test, deploy`，用逗号分隔不同的标签。

#### 启动 Runner 服务

注册好之后如果在 `设置` -> `CI/CD` -> `Runner` 的界面上看到 Runner 的旁边不是绿点，而是黑色三角的感叹号，可以使用 `gitlab-runner start`指令来开启 Runner 的 Service
同时支持 `restart` 重启、`stop` 停止、`run` 直接运行 等等的命令。`run` 可以通过在前面附加 `--debug` 命令，开启详细的日志输出。

### 编写 shell 脚本

接下来我们写脚本文件，因为我们采用的是linux系统，所以用的是shell文件
**shell 脚本要做的事情可以分为这些步骤:**

1. 从 GitLab 上 git clone/fetch 项目资源。
这一步其实 gitlab-runner 会自动帮我们完成，所以可以省略。
2. 进入项目中
因为我们的脚本是放在项目中的，所以可以使用如下方式获取到 shell 脚本的位置，进而定位到项目路径。

```shell
BASEDIR=$(dirname "$0")
cd $BASEDIR
```

3. 执行 npm install（或者 yarn/pnpm）
4. 执行 build 打包

#### 最后完整 shell 脚本如下

```shell
# ci/deploy_staging.sh
# 测试网的部署脚本

# 遇到错误时退出，更加可读的版本是：set -o errexit
set -e

echo "============================"
echo "=== Start deploy staging ==="
echo "============================"
# 访问脚本所在的的项目文件
BASEDIR=$(dirname "$0")
cd $BASEDIR
cd ..

echo "==== Copy product files ===="
# 拷贝文件到部署文件夹

# 开启 地址通配符功能
shopt -s extglob
# 删除部署文件夹中之前留下的文件，只保留 dist（构建产物） 和 node_modules （依赖）文件夹
sudo rm -rf /usr/share/frontend/!(dist|node_modules)
# 删除 . 开头的隐藏文件，它们是漏网之鱼
sudo rm -rf /usr/share/frontend/{.[!.],..?}*
echo "Remaining files："
ls -la /usr/share/frontend/

# 为了防止因为没有权限复制而出错，预先设置署文件夹的权限组为 gitlab-runner
sudo chown -R gitlab-runner:gitlab-runner /usr/share/frontend
# 拷贝至部署文件夹
cp -r . /usr/share/frontend/
# 设置一次部署文件夹内新放进去文件的权限，允许读写和执行
sudo chmod -R 775 /usr/share/frontend

# 进入部署文件夹
cd /usr/share/frontend/

echo "==== Start pnpm install ===="
# 安装依赖
pnpm install

echo "===== Start build test ====="
# 编译项目
pnpm test

echo "============================="
echo "== Finished deploy staging =="
echo "============================="
```

> 我将其放在了项目的 `ci/deploy_staging.sh` 目录里

可以看到完整的代码中增加了**拷贝至部署文件夹**的步骤。这是因为，如果直接在 Runner 的项目文件夹中操作的话，可能会导致新创建的文件**无法在下次 CI 作业 git clone 前被移除**，而无法从 git 同步代码将会导致**整个 Runner 被阻塞**。原因可能是因为某些文件的权限组为 root ，也可能是因为版本控制忽略了那些文件，目前这个问题的具体成因不明。为了避免这个问题，**所以我们在一个新文件夹中执行 npm install 和 npm build 操作**来避免这种情况。

### 设置 gitlab-runner 用户权限

为了确保 Runner 正常运行这个 shell 脚本，需要给 `gitlab-runner` 用户添加执行 `sudo` 命令的权限。

#### 1. 将 gitlab-runner 用户加入 wheel 用户组

```shell
sudo usermod -g wheel gitlab-runner
```

#### 2. 设置 whell 组的 sudo 命令权限，允许免密码执行 sudo

1. ##### 切换到 `root` 用户下

```shell
su root
```

3. ##### 打开 `sudoers` 文件

`sudoers` 文件的目录是 `/etc/sudoers`

有可能出现无法编辑 `sudoers` 文件的情况，需要添加写权限：

```shell
chmod u+w /etc/sudoers
```

通过 `vim` 或者 `nano` 命令编辑

```shell
vim /etc/sudoers
```

##### 3. 编辑文件，设置 sudo 权限

在 `sudoers` 文件中找到 `# %wheel	ALL=(ALL)	NOPASSWD: ALL`  这一行，将它前面的注释，也就是 `#` 去掉，然后保存文件。如果没有找到，也可以直接新建一行填入这段文本。然后保存文件并退出

##### 4. 撤销刚刚添加的 sudoers 文件写权限

输入如下命令

```shell
chmod u-w /etc/sudoers
```

### 编写 .gitlab-ci.yml 脚本

接下来我们参考 [官方文档](https://docs.gitlab.com/ee/ci/yaml/README.html) 的格式，在 .gitlab-ci.yml 文件写入要执行的步骤和触发条件。
编写完成后可以进入 GitLab 项目，然后选择 `CI/CD` -> `流水线` -> `CI lint`，打开**“验证您的GitLab CI配置”** 页面，在这里可以校验你的 .gitlab-ci.yml 文件语法是否正。

#### 完整的 .gitlab-ci.yml 脚本如下

```yaml
stages:
  - deploy

.deploy_staging_default: &deploy_staging_default
  stage: deploy
  # 通过 shell 执行的
  script:
    - pwd
    # 避免克隆下来的 .sh 文件没有执行权限导致执行失败，预先添加执行权限
    - sudo chmod -R a+x .
    # 执行部署脚本
    - sudo ./ci/deploy_staging.sh

  # tags 标签表示这个 CI 任务在会被分配给哪些 Runner，只有包含如下 tags 中任意一个或多个的 Runner 才会执行这个任务。
  tags:
    - test
    - deploy

# 合并到 test 分支时执的脚本，通过 only 字段约束为 merge_requests 情况下 目标分支名称为 “test” 时才会执行。
deploy_staging1:
  <<: *deploy_staging_default
  only:
    refs:
      - merge_requests
    variables:
      - $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "test"

# 在 test 分支上直接操作时执行的脚本。
deploy_staging2:
  <<: *deploy_staging_default
  only:
    - test
```

> `.deploy_staging_default: &deploy_staging_default`
>
>
>
> `<<: *deploy_staging_default`

YAML 有一个名为“锚”的功能，您可以使用它在整个文档中复制内容，这里就用到了这个特性来将两种 CI 策略中相同的部分写在一起。

### 完成设置

完成如上步骤后，将编辑好的 yaml 和 shell 脚本保存、推送到 test 分支。

如果执行顺利的话，就可以看到  `CI/CD` -> `流水线` 界面已经发生了变化，并且完成了你设定的自动部署任务。

**下一步：** *如果你将希望编译的产物，例如 web 服务器。能够运行起来，并暴露给外部访问，请参考如何部署相关的教程或文档。*

#### 故障排除

##### permission denied

如果出现执行失败的情况，检查 log 如果存在 `permission denied` 字样，说明 Runner 访问文件时存在权限问题。通过 `ls -la` 查看 `/home/gitlab-runner` 文件夹、以及项**目部署文件夹**是否正常赋予了 gitlab-runner 用户读写和执行权限。

发现权限设置有误，可以通过 `chmod` 变更权限，`chown` 变更所属权之类的方式进行权限的修改。

##### 查看 gitlab-runner 服务运行时的 log

```shell
systemctl status gitlab-runner -l
```

使用 `status` 获取状态， `-l` 参数表示显示完整 log，这个办法可以看到最近的十条 log

##### 配置文件

有时也可以检查 Runner 的配置文件，确定是否存在配置错的都的情况。

Runner 的配置文件：

```shell
cat /etc/gitlab-runner/config.toml
```

gitlab-runner 的系统服务脚本:

```shell
cat /etc/systemd/system/gitlab-runner.service
```
