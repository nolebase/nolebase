---
tags:
  - 命令行/apt
  - 命令行/docker
  - 开发/容器化/Docker
  - 开发/云原生/Docker
  - 软件/云原生/docker
  - 软件/Atlassian/Confluence
  - 操作系统/Debian
  - 操作系统/Debian/Debian-11
  - 开发/语言/Java
  - 开发/语言/Java/JDK
  - 计算机/网络/网关/Nginx
  - 数学/密码学/证书/TLS/HTTPS
  - 命令行/systemd
  - 开发/标记语言/XML
  - 数学/密码学/证书/TLS/SSL
  - 数学/密码学/证书/TLS/域名证书
---

# 部署 Confluence Data Center 版

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2021-12-16 | 创建 |

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Confluence | 7.15.0 |  |

## 安装 Docker

可以参考官方指南在 Debian 11 上安装 Docker：[Install Docker Engine on Debian | Docker Documentation](https://docs.docker.com/engine/install/debian/)

也可以执行下面的脚本，每次一行：

```shell
sudo apt update
```

```shell
sudo apt install ca-certificates curl gnupg lsb-release
```

```shell
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```shell
sudo apt update
```

```shell
sudo apt install docker-ce docker-ce-cli containerd.io
```

### 构建 PostgreSQL 的 Docker 容器[^2]

密码根据自己的需求设定

```shell
sudo docker run -it --name postgres -e POSTGRES_PASSWORD=<密码> -d -p 5432:5432 postgres
```

准备好之后进入 PostgreSQL 的 Docker 实例进行操作

```shell
sudo docker exec -it postgres psql -U postgres
```

### 建库[^1][^3]

```sql
CREATE DATABASE confluence WITH
    OWNER confluence
    ENCODING 'UTF-8'
    LC_COLLATE='en_US.utf8'
    LC_CTYPE='en_US.utf8'
```

## 部署 Confluence

此处参考官方指南：[Installing Confluence on Linux | Confluence Data Center and Server 7.15 | Atlassian Documentation](https://confluence.atlassian.com/doc/installing-confluence-on-linux-143556824.html)

### 下载 Confluence 安装包

下面的链接用于下载该文档使用的 Confluence 7.15.0 版本：

```shell
https://www.atlassian.com/software/confluence/downloads/binary/atlassian-confluence-7.15.0-x64.bin
```

其他版本的下载链接可见：

[Confluence Server 下载存档 | Atlassian](https://www.atlassian.com/zh/software/confluence/download-archives)

### 设定安装包权限

```shell
chmod a+x atlassian-confluence-7.15.0-x64.bin
```

### 执行安装

```shell
sudo ./atlassian-confluence-7.15.0-x64.bin
```

#### 安装中命令行交互：是否安装？

会提示如下字样

```shell
This will install Confluence 7.15.0 on your computer.
OK [o, Enter], Cancel [c]
```

按下 回车 即可

#### 安装中命令行交互：安装模式选择

```shell
Choose the appropriate installation or upgrade option.
Please choose one of the following:
Express Install (uses default settings) [1], # 快速安装
Custom Install (recommended for advanced users) [2, Enter], # 自定义安装
Upgrade an existing Confluence installation [3] # 升级已安装的 Confluence 实例
```

此处按 2，然后按下回车提交选择

#### 安装中命令行交互：安装路径

```shell
Select the folder where you would like Confluence 7.15.0 to be installed,
then click Next.
Where should Confluence 7.15.0 be installed?
[/opt/atlassian/confluence]
```

选默认值，按下回车即可
如果需要变更，输入选择的路径

#### 安装中命令行交互：数据路径

```shell
Default location for Confluence data
[/var/atlassian/application-data/confluence]
```

选默认值，按下回车即可
如果需要变更，输入选择的路径

#### 安装中命令行交互：使用的端口号

```shell
Configure which ports Confluence will use.
Confluence requires two TCP ports that are not being used by any other
applications on this machine. The HTTP port is where you will access
Confluence through your browser. The Control port is used to Startup and
Shutdown Confluence.
Use default ports (HTTP: 8090, Control: 8000) - Recommended [1, Enter], Set custom value for HTTP and Control ports [2]
```

选默认值，按下回车
如果需要变更，输入选择的端口号

#### 安装中命令行交互：要安装为服务么？

安装为服务后可以使用 `systemd` 进行管理。

```shell
Confluence can be run in the background.
You may choose to run Confluence as a service, which means it will start
automatically whenever the computer restarts.
Install Confluence as Service?
Yes [y, Enter], No [n]
```

选默认值，按下回车

#### 安装中命令行交互：要现在启动么？

```shell
Installation of Confluence 7.15.0 is complete
Start Confluence now?
Yes [y, Enter], No [n]
```

此处如果选择立即启动，则不会使用上一步设定的 systemd 的 Confluence 服务启动，而是用脚本启动的，如果希望直接使用 systemd 进行管理的话，此处可以选择输入 n，按下回车。否则，按下回车。

## 设定 Nginx 反代理

### 停止 Confluence

```shell
sudo systemctl stop confluence
```

### 配置 Confluence 自带的网页服务器 Tomcat 程序

```shell
sudo vim /opt/atlassian/confluence/conf/server.xml
```

#### 禁用默认配置

将写有 Default 字样注释的下方的 Connector 标签使用 `<!--` 和 `-->` 完全注释掉

```xml
    <!--
    ==============================================================================================================
    DEFAULT - Direct connector with no proxy, for unproxied HTTP access to Confluence.

    If using a http/https proxy, comment out this connector.
    ==============================================================================================================
    -->
    <!--
    <Connector port="8090" connectionTimeout="20000" redirectPort="8443"
                   maxThreads="48" minSpareThreads="10"
                   enableLookups="false" acceptCount="10" debug="0" URIEncoding="UTF-8"
                   protocol="org.apache.coyote.http11.Http11NioProtocol"/>
    -->
```

#### 启用反代理配置

将写有 HTTPS - Proxying Confluence via Apache or Nginx over HTTP 字样注释下方的 Connector 标签解除注释

修改 Connector 标签最后一行的值：

`scheme` 协议模板：填写 `https`
`proxyName` 代理名称：填写域名
`proxyPort` 代理端口：填写反代理后访问的端口（不是 Nginx `proxy_pass` 访问的端口，而是代理后让外界访问的端口），此处为 443

```xml
     <!--
     ==============================================================================================================
     HTTP - Proxying Confluence via Apache or Nginx over HTTP

     If you're proxying traffic to Confluence over HTTP, uncomment the connector below and comment out the others.
     Make sure you provide the right information for proxyName and proxyPort.

     For more information see:
        Apache - https://confluence.atlassian.com/x/4xQLM
        nginx  - https://confluence.atlassian.com/x/TgSvEg

     ==============================================================================================================
    -->

    <Connector port="8090" connectionTimeout="20000" redirectPort="8443"
               maxThreads="48" minSpareThreads="10"
               enableLookups="false" acceptCount="10" debug="0" URIEncoding="UTF-8"
               protocol="org.apache.coyote.http11.Http11NioProtocol"
               scheme="<协议模板>" proxyName="<域名>" proxyPort="<端口>"/>
```

### 重启 Confluence 服务

```shell
sudo systemctl restart confluence
```

### 安装 Nginx

```shell
sudo apt install nginx
```

#### 申请 Let's Encrypt 证书

参见 [[申请 Lets Encrypt 的 SSL 证书]]

#### 创建 Confluence 反代理配置文件

```shell
sudo vim /etc/nginx/sites-available/<域名>
```

填写下面的配置：
如果同一台机器上还有别的域名，可以把 `server_name` 字段改为你需要的域名

```nginx
server {
    listen 80;
    server_name _;

    listen 443 default ssl;
    ssl_certificate     /etc/letsencrypt/live/<域名证书名称>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<域名证书名称>/privkey.pem;

    ssl_session_timeout  5m;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers   on;
    ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";

location /synchrony {
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://localhost:8091/synchrony;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
  location / {
        client_max_body_size 100m;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://localhost:8090;
    }
}
```

#### 创建配置文件软链接

```shell
sudo ln -s /etc/nginx/sites-available/<域名> /etc/nginx/sites-enabled/
```

#### 检查 Nginx 配置并重启

```shell
sudo nginx -t
sudo nginx -s reload
```

## 破解 Confluence

下载破解程序 atlassian-agent：[atlassian-agent: Atlassian's productions crack.](https://gitee.com/pengzhile/atlassian-agent#https://gitee.com/pengzhile/atlassian-agent/releases)

### 安装 OpenJDK（Java 环境）

```shell
sudo apt install openjdk-11-jdk
```

### 解压和权限调整

```shell
mkdir -p /opt/atlassian-agent
cd /opt/atlassian-agent
sudo mv ~/atlassian-agent-v1.3.1.tar.gz ./
sudo tar -xvf atlassian-agent-v1.3.1.tar.gz
cd atlassian-agent-v1.3.1
sudo mv ./* ..
cd ..
sudo rm -rf atlassian-agent-v1.3.1
sudo chmod a+x atlassian-agent.jar
```

### 设定 Java 环境变量以方便注入

在 `/etc/bash.bashrc`，`/etc/profile`，`/opt/atlassian/confluence/bin/setenv.sh` 文件的最后一行增加下面的代码：

```shell
export JAVA_OPTS="-javaagent:/opt/atlassian-agent/atlassian-agent.jar ${JAVA_OPTS}"
```

### 重启 Confluence 的实例

```shell
sudo systemctl restart confluence
```

### 配置 Confluence

访问你的域名，按照流程要求配置 Confluence。
会要求选择试用版本 或是 生产版本，任选其一即可，破解的时候可以自动变更为生产环境版本。

### 获取破解密钥

填写到需要许可证的时候就需要输入破解密钥了。
运行程序以获得破解密钥：

```shell
java -jar atlassian-agent.jar -p conf -d -m neko@ayaka.moe -n 'Ayaka Neko' -o Ayaka -s <服务器的 ID>
```

此处参数分别为：

`-d`：是否需要 Data Center 许可证
`-m`：许可证颁发给的邮箱
`-n`：许可证名称，默认为许可证颁发给的邮箱
`-o`：许可证颁发给的组织名
`-p`：产品名称，Confluence 需要填写 conf
	- 支持的参数
        - crowd: Crowd
        - jsm: JIRA Service Management
        - questions: Questions plugin for Confluence
        - crucible: Crucible
        - capture: Capture plugin for JIRA
        - conf: Confluence
        - training: Training plugin for JIRA
        - *: 第三方插件密钥，一般类似于：com.foo.bar
        - bitbucket: Bitbucket
        - tc: Team Calendars plugin for Confluence
        - bamboo: Bamboo
        - fisheye: FishEye
        - portfolio: Portfolio plugin for JIRA
        - jc: JIRA Core
        - jsd: JIRA Service Desk
        - jira: JIRA Software(common jira)

`-s`：服务器 ID，在 Confluence 配置页面上找到

会输出以下字样：

```shell
====================================================
=======     Atlassian Crack Agent v1.3.1     =======
=======           https://zhile.io           =======
=======          QQ Group: 30347511          =======
====================================================

Your license code(Don't copy this line!!!):

A***************************************************************************
****************************************************************************
****************************************************************************
****************************************************************************
****************************************************************************
****************************************************************************
****************************************************************************
****************************************************************************
****g==***r
```

复制并粘贴即可。

[^1]: [Solved: Setting up Postgresql database for Confluence](https://community.atlassian.com/t5/Confluence-questions/Setting-up-Postgresql-database-for-Confluence/qaq-p/759168)
[^2]: [Postgres - Official Image | Docker Hub](https://hub.docker.com/_/postgres)
[^3]: [Database Setup for PostgreSQL | Confluence Data Center and Server 7.15 | Atlassian Documentation](https://confluence.atlassian.com/doc/database-setup-for-postgresql-173244522.html)
