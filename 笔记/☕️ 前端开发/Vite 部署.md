## 安装和配置

### 安装前置软件
使用 `yum` 或者 `dnf`（两者都一样的效果，[yum dnf 包管理器](yum%20dnf%20包管理器.md)）进行安装

1. 优先安装 epel-release（一个很大的软件库源，安装后可以搜索和安装更多的软件包）
2. 更新整个软件包列表缓存和系统
3. 此处需要安装 Nginx（[Nginx 网页服务器](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/%E8%BD%AF%E4%BB%B6/Nginx%20%E7%BD%91%E9%A1%B5%E6%9C%8D%E5%8A%A1%E5%99%A8.md)），Vim（[Vim 编辑器](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/%E8%BD%AF%E4%BB%B6/Vim%20%E7%BC%96%E8%BE%91%E5%99%A8.md)，不喜欢的话可以换成 [nano 编辑器](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF//%E8%BD%AF%E4%BB%B6/nano%20%E7%BC%96%E8%BE%91%E5%99%A8.md)），Git（[Git 命令速记](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/%E8%BD%AF%E4%BB%B6/Git%20%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6/Git%20%E5%91%BD%E4%BB%A4%E9%80%9F%E8%AE%B0.md)），node（[node Node.js](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/%E8%BD%AF%E4%BB%B6/node%20Node.js.md)），pnpm（包管理器）
4. -y 参数表示无需询问是否安装，直接静默安装

```shell
$ sudo yum install epel-release -y
$ sudo yum update -y
$ sudo yum install nginx vim git -y
```

如果此处提示找不到 nginx，我们需要手动添加一下 nginx 官方的软件源

#### 调整 Nginx 软件源

创建一个 nginx.repo 文件并且写入 nginx 官方源配置：

```shell
$ sudo vim /etc/yum.repos.d/nginx.repo
```

nginx.repo 内容，其中需要替换一些字符串：
把 `<OS>` 替换为发行版，比如 rhel，或者 centos
把 `<OSRELEASE>` 替换为发行版的大版本号，比如 `6`, `6._x_`, `7`, `7._x_`

```ini
[nginx]
name=nginx repo
baseurl=https://nginx.org/packages/mainline/<OS>/<OSRELEASE>/$basearch/
gpgcheck=0
enabled=1
```

比如 CentOS7 的话可以这样写

```ini
[nginx]
name=nginx repo
baseurl=https://nginx.org/packages/mainline/centos/7/$basearch/
gpgcheck=0
enabled=1
```

编辑之后输入 `:wq` 退出

运行下面的命令来更新软件源和系统
```shell
$ sudo yum update
```

再次尝试安装

```shell
$ sudo yum install nginx
```

如果还是不行，可以选择手动编译

#### 手动编译 Nginx

安装编译需要的依赖包

```shell
$ sudo yum -y install gcc gcc-c++ pcre pcre-devel zlib zlib-devel openssl openssl-devel libxml2 libxml2-devel libxslt libxslt-devel gd-devel perl-devel perl-ExtUtils-Embed GeoIP GeoIP-devel GeoIP-data gperftools-devel
```

使用 `wget` 命令（参考 [wget HTTP 客户端](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/%E8%BD%AF%E4%BB%B6/wget%20HTTP%20%E5%AE%A2%E6%88%B7%E7%AB%AF.md)）下载 nginx 的源码

```shell
wget http://nginx.org/download/nginx-1.20.1.tar.gz
```

#### 安装 Node.js

使用 `curl` 命令（参考[curl HTTP 客户端](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/%E8%BD%AF%E4%BB%B6/curl%20HTTP%20%E5%AE%A2%E6%88%B7%E7%AB%AF.md)）下载并导入 Node14 仓库和配置（和下面的 Node16 二选一）

```shell
curl -fsSL https://rpm.nodesource.com/setup_14.x | sudo bash -
```

使用 `curl` 命令（参考[curl HTTP 客户端](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/%E8%BD%AF%E4%BB%B6/curl%20HTTP%20%E5%AE%A2%E6%88%B7%E7%AB%AF.md)）下载并导入 Node16 仓库和配置（和上面的 Node14 二选一）

```shell
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
```

执行完之后执行安装 nodejs 本体：

```shell
$ sudo yum install nodejs gcc-c++ make -y
```

安装 pnpm：

```shell
$ sudo npm install -g pnpm
```

### 设定 Nginx 服务为开机自启，并且开始运行

使用 `systemctl`（参考 [🚧  systemctl 服务管理](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/Linux%20%E5%91%BD%E4%BB%A4/%E7%B3%BB%E7%BB%9F%E7%AE%A1%E7%90%86/%F0%9F%9A%A7%20%20systemctl%20%E6%9C%8D%E5%8A%A1%E7%AE%A1%E7%90%86.md)）设定开机自启和运行

```shell
$ sudo systemctl enable nginx
$ sudo systemctl start nginx
```

运行后应该可以从 http://IP:80 的访问到初始的网站
如果访问不到，可以看一下防火墙配置

### 防火墙配置

#### 检查 iptables

1. 先检查 iptables（一个老牌防火墙服务，命令参考：[🚧  iptables 防火墙配置](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/Linux%20%E5%91%BD%E4%BB%A4/%E7%BD%91%E7%BB%9C%E9%80%9A%E8%AE%AF/%F0%9F%9A%A7%20%20iptables%20%E9%98%B2%E7%81%AB%E5%A2%99%E9%85%8D%E7%BD%AE.md)）是否在运行

```shell
$ sudo systemctl status iptables
```

如果运行命令后提示 `Unit iptables.service could not be found.` 则表示服务不存在
如果找到了服务的话会有这样的提示：

```shell
● iptables.service - iptables
   Loaded: loaded (/usr/lib/systemd/system/iptables.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
```

第三行会有一个 Active 字段，如果结尾是 dead 则表示不在运行，否则会有绿色的 `Active: active (running)` 字样

如果正在运行的话可以使用以下命令允许 80 端口流量：
以下命令的含义是： **使用 iptables 命令添加允许（ACCEPT） 80 端口的 TCP 流量**

```shell
$ sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
```


#### 检查 firewalld

2. 检查 firewalld（现在主流防火墙服务，命令参考 [🚧  firewalld 防火墙配置](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/Linux%20%E5%91%BD%E4%BB%A4/%E7%BD%91%E7%BB%9C%E9%80%9A%E8%AE%AF/%F0%9F%9A%A7%20%20firewalld%20%E9%98%B2%E7%81%AB%E5%A2%99%E9%85%8D%E7%BD%AE.md)）是否在运行

```shell
$ sudo systemctl status firewalld
```

如果运行命令后提示 `Unit firewalld.service could not be found.` 则表示服务不存在
如果找到了服务的话会有这样的提示：

```shell
● firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
     Docs: man:firewalld(1)
```

第三行会有一个 Active 字段，如果结尾是 dead 则表示不在运行，否则会有绿色的 `Active: active (running)` 字样

如果正在运行的话可以使用以下命令允许 80 端口流量：
以下命令的含义是： **使用 firwall-cmd 在 public 域永久（permanent）添加允许 80 端口的 TCP 流量**

```shell
$ sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
```


## 准备前端

### 克隆并编译

#### 克隆

```shell
$ git clone <仓库地址>
$ cd <项目文件夹>
```

#### 编译

对于 vitesse 而言，直接运行 `pnpm build` 就好了，执行依赖更新和 `build` 命令

```shell
$ pnpm i && pnpm build
```

编译后文件会被放到 `dist` 文件夹下，这个时候为了方便我们版本切换，可以把 `dist` 文件夹里的文件单独放到另一个文件夹里面，这样下次更新前端的时候就不会由于运行 `pnpm build` 指令导致 `dist` 文件夹被清空，因而导致页面无法访问

移动编译产物 `dist` 文件夹到别的地方
如果是需要限制权限和访问的，可以放到 `/usr/local/frontend/<项目名称>/app`，`frontend` 是前端的意思
这个目录使用 `mkdir` （参考 [mkdir 创建目录](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/Linux%20%E5%91%BD%E4%BB%A4/%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86/mkdir%20%E5%88%9B%E5%BB%BA%E7%9B%AE%E5%BD%95.md)）创建的时候带上 `sudo` 就可以限制为仅可 `root` 或 root 权限访问：

```shell
$ sudo mkdir -p /usr/local/frontend/<项目名称>
```

还可以授予 `wheel` 用户组权限（可选），`wheel` 用户组就等同于「超级管理组」，在这个组的人都有 `sudo` 权限，`chown` 命令（参考 [chown 变更所属权](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/Linux%20%E5%91%BD%E4%BB%A4/%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86/chown%20%E5%8F%98%E6%9B%B4%E6%89%80%E5%B1%9E%E6%9D%83.md)）表示「**ch**ange **own**ership（变更归属权）」， root:wheel 表示：「root 用户和 wheel 用户组」，-R 表示使用递归策略，遍历并应用规则到下面的目录和文件

```shell
$ sudo chown -R root:whell /usr/local/frontend
```

如果没有特别的需求，可以放到原地，比如新建一个 app 文件夹用来存编译产物也是完全没问题的；使用 `mv` 命令（参考 [mv 剪贴、移动](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/Linux%20%E5%91%BD%E4%BB%A4/%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86/mv%20%E5%89%AA%E8%B4%B4%E3%80%81%E7%A7%BB%E5%8A%A8.md)）把编译好的内容放到新的地方：

```shell
$ sudo mv dist <文件夹地址>
```

## 配置网页服务器

此处有两种方案可以选择，一种是直接通过 Nginx 读取静态文件，还有一种是基于一个 serve 命令的服务来实现静态文件的服务器，请求该网站的时候，流量会通过 Nginx 重定向到 serve 提供的地址，从而把数据通过 Nginx 从 serve 反代理到服务器外部，实现对内部数据的访问


### 静态文件

静态文件的配置稍微会麻烦一些，可能这个过程中会遇到权限问题，403 配置问题，`vue-router` history 模式配置不正确导致的 404 问题

新建一个 Nginx 配置文件（配置的时候可以把里面的中文注释删一下，避免编码问题）

```shell
$ sudo vim /etc/nginx/conf.d/<域名>.conf
```

配置文件内容：

```nginx
server {
		listen <端口>;
		server_name <域名（不带 http 前缀）>;
		location / { 
				root /front; // 前端文件路径，绝对路径
				index index.html; // hash 模式只配置这行支持访问 html 文件就可以了 
				try_files $uri $uri/ /index.html; // history 模式下需要加一行这个 
		}
}
```

如果需要部署到子目录，可以按照下面的来：

```nginx
server {
		listen <端口>;
		server_name <域名（不带 http 前缀）>;
		location /demo { // 子级目录 
				alias /front/demo; 
				index index.html; 
				try_files $uri $uri/ /demo/index.html;
		}
}
```

如果需要配置为 443（HTTPS）的服务器，可以按照下面的来：

```nginx
server {
		listen <端口>;
        server_name <域名>;

        return 301 https://$host$request_uri; # 这里是指自动 301 重定向到 https 协议
}

server {
        listen 443 ssl http2;
        # listen [::]:443 ssl;

        server_name <域名>;

        ssl_certificate <证书位置>;
        ssl_certificate_key <证书私钥位置>;
        ssl_prefer_server_ciphers on;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";
        keepalive_timeout 70;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        add_header Strict-Transport-Security max-age=63072000;
        # add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;

		location / { 
				root /front; // 前端文件路径，绝对路径
				index index.html; // hash 模式只配置这行支持访问 html 文件就可以了 
				try_files $uri $uri/ /index.html; // history 模式下需要加一行这个 
		}
		
		location /demo { // 子级目录 
				alias /front/demo; 
				index index.html; 
				try_files $uri $uri/ /demo/index.html;
		}
}
```

编辑之后保存退出。

测试 Nginx 配置文件是否正确：

```shell
$ sudo nginx -t
```

如果有错误的话会提示具体的文件和行号

使用 `nginx` 命令（参考 [Nginx 网页服务器](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/%E8%BD%AF%E4%BB%B6/Nginx%20%E7%BD%91%E9%A1%B5%E6%9C%8D%E5%8A%A1%E5%99%A8.md)）加上参数 `s` 重新载入 Nginx 配置文件并应用

```shell
$ sudo nginx -s reload
```

### 反代理

安装 serve

```shell
$ sudo npm install -g serve
```

反代理图示：

客户端 <------> Nginx <------> serve

Nginx 从接收到客户端的请求（比如请求 a.com）了解到需要去找 serve 开的端口和地址要数据，于是把流量转发过去，serve 接收到之后，了解路由的参数，并且把静态文件提取出来返回给 Nginx，Nginx 拿到返回值之后直接返回给客户端，这个流程就叫做「反代理」

反代理需要额外配置一个服务，新建一个 service 文件

```shell
$ sudo nano /usr/lib/systemd/system/<项目名称>.service
```

写入服务信息

```ini
[Unit]
Description=<项目名称>
After=network.target

[Service]
ExecStart=/usr/bin/serve -s <编译产物路径> -l <监听端口号>
ExecStop=/bin/kill -s SIGINT -$MAINPID & /bin/kill -s SIGINT -$MAINPID
ExecReload=/bin/kill -s SIGINT -$MAINPID & /bin/kill -s SIGINT -$MAINPID && /usr/bin/serve -s <编译产物路径> -l <项目端口号>
Restart=always
WorkingDirectory=<编译产物路径>

[Install]
WantedBy=multi-user.target
```

重载 systemctl 的服务配置

```shell
$ sudo systemctl daemon-reload
```

开启 serve 服务开机自启

```shell
$ sudo systemctl enable <项目名称>
```

开始 serve 服务

```shell
$ sudo systemctl start <项目名称>
```

新建一个 Nginx 配置文件（配置的时候可以把里面的中文注释删一下，避免编码问题）

```shell
$ sudo vim /etc/nginx/conf.d/<域名>.conf
```

配置文件内容：
此处 **外部可访问端口** 和 **项目端口号** 不可以是一致的

```nginx
server {
		listen <外部可访问端口>;
		server_name <域名（不带 http 前缀）>;
		location / { 
                proxy_set_header Host $http_host; # 添加一个头部 Host，值为客户端访问的域名
				proxy_set_header X-Real-IP $remote_addr; # 添加一个头部 X-Real-IP，值为客户端来源 IP
                proxy_set_header X-Real-PORT $remote_port; # 添加一个头部 X-Real-Port，值为客户端来源端口
				proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 添加一个头部 X-Forwarded-For，简称XFF头，它代表客户端，也就是HTTP的请求端真实的IP，只有在通过了HTTP 代理或者负载均衡服务器时才会添加该项。它不是RFC中定义的标准请求头信息
				proxy_pass http://127.0.0.1:<项目端口号>;
		}
}
```

如果需要部署到子目录，可以按照下面的来：

```nginx
server {
		listen <外部可访问端口>;
		server_name <域名（不带 http 前缀）>;
		location /demo { // 子级目录 
				proxy_set_header Host $http_host; # 添加一个头部 Host，值为客户端访问的域名
				proxy_set_header X-Real-IP $remote_addr; # 添加一个头部 X-Real-IP，值为客户端来源 IP
                proxy_set_header X-Real-PORT $remote_port; # 添加一个头部 X-Real-Port，值为客户端来源端口
				proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 添加一个头部 X-Forwarded-For，简称XFF头，它代表客户端，也就是HTTP的请求端真实的IP，只有在通过了HTTP 代理或者负载均衡服务器时才会添加该项。它不是RFC中定义的标准请求头信息
				proxy_pass http://127.0.0.1:<项目端口号>;
		}
}
```

如果需要配置为 443（HTTPS）的服务器，可以按照下面的来：

```nginx
server {
		listen <外部可访问端口>;
        server_name <域名>;

        return 301 https://$host$request_uri; # 这里是指自动 301 重定向到 https 协议
}

server {
        listen 443 ssl http2;
        # listen [::]:443 ssl;

        server_name <域名>;

        ssl_certificate <证书位置>;
        ssl_certificate_key <证书私钥位置>;
        ssl_prefer_server_ciphers on;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";
        keepalive_timeout 70;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        add_header Strict-Transport-Security max-age=63072000;
        # add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;

		location / { 
				proxy_set_header Host $http_host; # 添加一个头部 Host，值为客户端访问的域名
				proxy_set_header X-Real-IP $remote_addr; # 添加一个头部 X-Real-IP，值为客户端来源 IP
                proxy_set_header X-Real-PORT $remote_port; # 添加一个头部 X-Real-Port，值为客户端来源端口
				proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 添加一个头部 X-Forwarded-For，简称XFF头，它代表客户端，也就是HTTP的请求端真实的IP，只有在通过了HTTP 代理或者负载均衡服务器时才会添加该项。它不是RFC中定义的标准请求头信息
				proxy_pass http://127.0.0.1:<端口号>; 
		}
		
		location /demo { // 子级目录 
				proxy_set_header Host $http_host; # 添加一个头部 Host，值为客户端访问的域名
				proxy_set_header X-Real-IP $remote_addr; # 添加一个头部 X-Real-IP，值为客户端来源 IP
                proxy_set_header X-Real-PORT $remote_port; # 添加一个头部 X-Real-Port，值为客户端来源端口
				proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 添加一个头部 X-Forwarded-For，简称XFF头，它代表客户端，也就是HTTP的请求端真实的IP，只有在通过了HTTP 代理或者负载均衡服务器时才会添加该项。它不是RFC中定义的标准请求头信息
				proxy_pass http://127.0.0.1:<项目端口号>;
		}
}
```

测试 Nginx 配置文件是否正确：

```shell
$ sudo nginx -t
```

如果有错误的话会提示具体的文件和行号

重新载入 Nginx 配置文件并应用

```shell
$ sudo nginx -s reload
```

使用 `setsebool` 命令（参考 [🚧  setsebool 配置 SELinux 参数](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/Linux%20%E5%91%BD%E4%BB%A4/%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86/%F0%9F%9A%A7%20%20setsebool%20%E9%85%8D%E7%BD%AE%20SELinux%20%E5%8F%82%E6%95%B0.md)）配置 SELinux （参见 [SELinux 安全 Linux](SELinux%20安全%20Linux.md)）规则以允许 Nginx 访问内网：

```shell
$ sudo setsebool -P httpd_can_network_connect on
```

## 错误排查

### 反代理 502

502 表示反代理访问的端口访问不到了。
serve 服务启用了吗？可以检查以下服务运行状态：

```shell
$ sudo systemctl status <项目名称>
```

如果出现问题，可以检查以下是否是端口占用，重复执行命令导致的。

### 403

403 有很多可能，无论是静态文件配置还是反代理配置都有可能出现这个问题。一是缺少主页文件，二是权限问题，三是 **SELinux** 状态
如果是使用的静态文件配置，可以检查一下文件的权限，是不是 root，还可以看一下文件具体的权限值：

```shell
$ sudo ls -l <目录> | awk '{k=0;for(i=0;i<=8;i++)k+=((substr($1,i+2,1)~/[rwx]/) \
             *2^(8-i));if(k)printf("%0o ",k);print}'
```

使用上面的命令可以获得下面的输出，这样可以在最前面看到每个文件的具体权限值（[Linux 权限](../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/Linux%20%E6%9D%83%E9%99%90.md)）：

```shell
总用量 4
664 -rw-rw-r-- 1 neko neko 16 10月  9 17:34 hello
775 drwxrwxr-x 2 neko neko  6 10月 11 10:37 tests
```

一般 600 的话访问不到，不是 root 的话也可能没办法访问到，需要根据具体情况重新设定一下权限才行。

变更权限值，755 是一个例子，具体根据情况而定（参见 https://www.jianshu.com/p/aa0ae40204ae）
一般常用的是 655 或者 755

```shell
$ sudo chmod 755 <文件>
```

如果设定到 777 才能访问的话，和 CentOS 内置的 SELinux 保护安全策略有关，需要执行以下：
静态文件的话，授予 Nginx 针对特定目录的访问权限：

```shell
$ sudo chcon -Rt httpd_sys_content_t <项目绝对路径>
```

反代理的话，授予 Nginx 访问网络的权限：

```shell
$ setsebool -P httpd_can_network_connect on
```

### 404

如果是反代理配置的话，404 一般是编译产物目录下面文件找不到了，可以看一下 URL 是否正确，编译后的文件本地也可以测试以下是不是也可以访问到。

如果是 Nginx 静态文件配置的话，404 可能是 history 模式兼容性配置导致的，`vue-router` 有 hash（哈希）和 history（历史）模式，对于 404 而言需要多加一行

```nginx
location / { 
		...
		try_files $uri $uri/ /index.html; // history 模式下需要加一行这个 
		...
}
```
