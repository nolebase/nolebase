---
tags:
  - 数学/密码学/证书/TLS
  - 数学/密码学/证书/TLS/HTTPS
  - 数学/密码学/证书/TLS/SSL
  - 数学/密码学/证书/PKI
  - 命令行/openssl
  - 软件/Windows/WindowsAdminCenter
  - 操作系统/Windows-Server
  - 计算机/网络/网关/Nginx
  - 软件/Linux
  - 命令行/ssh
---
# 2024 年轮替 ihome.cat 证书

和 2023 年一样，Gateway 那边 Intermediate CA 的流程和系统还没有建立起来，继续先用 Root CA 签发证书。

这次维护用了 1Password 帮忙存储和读取 key，不过生成 Private key 的功能尚在 beta 阶段，所以还是先用 openssl 生成。

### 创建 2024 年年度的目录

```shell
mkdir -p ./domains/ihome.cat/2024
```

### 生成 Private key 和证书签发请求文件

```shell
openssl genrsa -out ./domains/ihome.cat/2024/ihome.cat.pem 4096
openssl req -new -key domains/ihome.cat/2023/ihome.cat.pem -out domains/ihome.cat/2024/ihome.cat.csr

You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:CN
State or Province Name (full name) [Some-State]:Shanghai
Locality Name (eg, city) []:Shanghai
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Ayaka Home
Organizational Unit Name (eg, section) []:Ayaka Home
Common Name (e.g. server FQDN or YOUR name) []:ihome.cat
Email Address []:neko@ihome.cat

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

### 创建证书拓展文件

```shell
$ cat > domains/ihome.cat/2024/ihome.cat.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.ihome.cat
DNS.2 = ihome.cat
EOF
```

### 使用根证书颁发机构对证书进行签发

#### 从 1Password 中 dump 私钥

![[ihome-cat-domain-rotation-2024-screenshot-01.png]]

```shell
op read "op://<secret reference>" > home_ca.pem
```

#### 签发

```shell
openssl x509 -req -in domains/ihome.cat/2024/ihome.cat.csr -CA home_ca.crt -CAkey home_ca.pem -CAcreateserial -out domains/ihome.cat/2024/ihome.cat.crt -days 365 -sha256 -extfile domains/ihome.cat/2024/ihome.cat.ext
```

应当获得这样的结果

```shell
$ openssl x509 -req -in domains/ihome.cat/2024/ihome.cat.csr -CA home_ca.crt -CAkey home_ca.pem -CAcreateserial -out domains/ihome.cat/2024/ihome.cat.crt -days 365 -sha256 -extfile domains/ihome.cat/2024/ihome.cat.ext
Certificate request self-signature ok
subject=C=CN, ST=Shanghai, L=Shanghai, O=Ayaka Home, OU=Ayaka Home, CN=ihome.cat, emailAddress=neko@ihome.cat
```

#### 删除 CA 私钥

```shell
rm -rf home_ca.pem
```

### 验证证书

```shell
openssl verify -CAfile home_ca.crt domains/ihome.cat/2024/ihome.cat.crt
```

应当获得这样的结果：

```shell
$ openssl verify -CAfile home_ca.crt domains/ihome.cat/2024/ihome.cat.crt
domains/ihome.cat/2024/ihome.cat.crt: OK
```

然后把证书部署到对应的服务端即可。

### 打包为 `.p12` 方便部署到 Windows

```shell
openssl pkcs12 -export -in domains/ihome.cat/2024/ihome.cat.crt -inkey domains/ihome.cat/2024/ihome.cat.pem -certfile ./home_ca.crt -out domains/ihome.cat/2024/ihome.cat.p12
```

应当获得这样的结果：

```shell
$ openssl pkcs12 -export -in domains/ihome.cat/2024/ihome.cat.crt -inkey domains/ihome.cat/2024/ihome.cat.pem -certfile ./home_ca.crt -out domains/ihome.cat/2024/ihome.cat.p12
Enter Export Password:
Verifying - Enter Export Password:
```

### 部署证书

#### 传输到目标节点

```shell
scp ./domains/ihome.cat/2024/ihome.cat.crt gateway:~/
scp ./domains/ihome.cat/2024/ihome.cat.pem gateway:~/
```

#### 以 Nginx 网关为例
##### 应用到 `/etc/nginx/certs` 目录

```shell
sudo mv ihome.cat.crt /etc/nginx/certs/
sudo mv ihome.cat.pem /etc/nginx/certs/
```

##### 更新 Nginx

```shell
sudo nginx -t
sudo nginx -s reload
```

安装后记得验证一下

![[ihome-cat-domain-rotation-2024-screenshot-07.png]]

#### 以 Windows Admin Center 为例

导入并保存到「本地计算机/个人」分类下：

![[ihome-cat-domain-rotation-2024-screenshot-03.png]]

由于在后续的 WAC 安装过程中会需要用到指纹：

![[ihome-cat-domain-rotation-2024-screenshot-05.png]]

所以我们还需要在证书管理器中复制指纹：

![[ihome-cat-domain-rotation-2024-screenshot-04.png]]

照例前往 WAC 的网站：https://www.microsoft.com/zh-CN/windows-server/windows-admin-center

![[ihome-cat-domain-rotation-2024-screenshot-02.png]]

下载最新版 WAC。

然后安装：

![[ihome-cat-domain-rotation-2024-screenshot-05.png]]

![[ihome-cat-domain-rotation-2024-screenshot-06.png]]

安装后记得验证一下

![[ihome-cat-domain-rotation-2024-screenshot-07.png]]

### 收尾

部署后记得清理本地的私钥和证书申请文件。

```shell
rm -rf domains/ihome.cat/2023/ihome.cat.pem
rm -rf domains/ihome.cat/2023/ihome.cat.csr
```

那么我们明年再见！ 👋