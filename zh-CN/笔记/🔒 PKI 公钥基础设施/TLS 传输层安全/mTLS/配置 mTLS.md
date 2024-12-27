---
tags:
  - 计算机/网络/网关/Nginx
  - 数学/密码学/证书/TLS/SSL
  - 数学/密码学/证书/TLS
  - 数学/密码学/证书/证书机构
  - 数学/密码学/证书/证书机构/CA
  - 数学/密码学/证书/p12
  - 计算机/信息技术/安全/网络安全/ZTNA
  - 计算机/信息技术/安全/操作系统安全/KeyStore
  - 数学/密码学/证书/PKI
  - 命令行/openssl
  - 数学/密码学/证书/TLS/mTLS
---

# 配置 mTLS

本文章着重参考了 [OpenSSL Certificate Authority — Jamie Nguyen](https://jamielinux.com/docs/openssl-certificate-authority/introduction.html) 一站的文章说明和讲解。

## 创建 CA（证书颁发机构）

### 创建根证书颁发机构的私钥并使用 des3 加密模式进行加密

```shell
openssl genrsa -des3 -out ca.pem 4096
```

### 创建根证书颁发机构的证书申请

此处申请了 18250 天（50 年）的根证书

```shell
openssl req -x509 -new -nodes -key ca.pem -sha256 -days 18250 -out ca.crt
```

#### 填写字段值

```shell
Enter pass phrase for myCA.key:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]: CN # 国家代码
State or Province Name (full name) [Some-State]: Shanghai # 省份/州名称
State Locality Name (eg, city) []: Shanghai # 所在城市名称
Organization Name (eg, company) [Internet Widgits Pty Ltd]: Ayaka iHome # 此处输入组织名称
Organizational Unit Name (eg, section) []: Home # 此处输入部门名称
Common Name (e.g. server FQDN or YOUR name) []: Ayaka iHome Root CA # 此处输入证书名称
Email Address []:neko@ayaka.moe # 此处输入 Root CA 管理员电子邮箱
```

### 创建根证书颁发机构的配置文件并写入策略和拓展信息

```shell
echo '[ ca ]
# `man ca`
default_ca = CA_default

[ CA_default ]
dir           = /Users/neko/certs/home
private_key   = $dir/home_ca.pem
certificate   = $dir/home_ca.crt
database      = $dir/index.txt
new_certs_dir = $dir/certs
serial        = $dir/serial
policy        = policy_loose

[ policy_loose ]
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

[ v3_intermediate_ca ]
# Extensions for a typical intermediate CA (`man x509v3_config`).
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
' > ./home_ca.cnf
```

## 创建 Intermediate CA（中间证书颁发机构）

### 创建中间证书颁发机构的私钥并使用 des3 加密模式进行加密

```shell
openssl genrsa -des3 -out intermediates/home_ca_intermediate_1.pem 4096
```

### 创建中间证书颁发机构的证书申请

```shell
openssl req -new -sha256 -key intermediates/home_ca_intermediate_1.pem -out intermediates/home_ca_intermediate_1.csr
```

### 使用根证书颁发机构对中间证书颁发机构进行签发

此处使用了先前创建并写入的 `home_ca.cnf` 配置文件，开启了配置文件中写入的 `v3_intermediate_ca` 拓展

```shell
openssl ca -config home_ca.cnf -extensions v3_intermediate_ca -days 3650 -notext -md sha256 -in intermediates/home_ca_intermediate_1.csr -out intermediates/home_ca_intermediate_1.crt
```

### 使用根证书颁发机构对中间证书颁发机构进行验证测试

```shell
openssl verify -CAfile home_ca.crt intermediates/home_ca_intermediate_1.crt
```

应该输出

```shell
intermediates/home_ca_intermediate_1.crt: OK
```

## 创建客户端证书

### 创建客户端用户的私钥并使用 des3 加密模式进行加密

```shell
openssl genrsa -des3 -out clients/neko.pem 4096
```

### 创建证书申请

```shell
openssl req -new -key clients/neko.pem -out clients/neko.csr
```

#### 填写字段值

```shell
Enter pass phrase for clients/neko.pem:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:CN # 国家代码
State or Province Name (full name) []:Shanghai # 省份/州名称
Locality Name (eg, city) []:Shanghai # 所在城市名称
Organization Name (eg, company) []:Ayaka Home Users # 此处输入组织名称
Organizational Unit Name (eg, section) []:Users # 此处输入部门名称
Common Name (eg, fully qualified host name) []:neko@ayaka.moe # 此处输入证书名称
Email Address []:neko@ayaka.moe # 此处输入授权的电子邮箱账号

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
```

### 配置证书类型并使用 CA 证书和私钥进行证书签发

#### 配置证书类型

```shell
echo 'basicConstraints = CA:FALSE
nsCertType = client, email
nsComment = "Ayaka Home Users Certificates"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth, emailProtection
' > clients/neko.cnf
```

#### 证书签发

```shell
openssl x509 -req -days 365 -sha256 -extfile clients/neko.cnf -in clients/neko.csr -CA home_ca.crt -CAkey home_ca.pem -out clients/neko.crt -CAcreateserial
```

### 创建证书链 bundle

```shell
cat home_ca.crt intermediates/home_ca_intermediate_1.crt > intermediates/home_ca_intermediate_1_bundle.crt
```

### 使用证书链 bundle 来为客户端证书进行验证测试

```shell
openssl verify -CAfile intermediates/home_ca_intermediate_1_bundle.crt clients/neko.crt
```

应该输出

```shell
clients/neko.crt: OK
```

### 将用户证书打包为 .pfx/.p12 格式的文件方便导入导出

```shell
openssl pkcs12 -export -out clients/neko.p12 -inkey clients/neko.pem -in clients/neko.crt
```

## 配置 Nginx 进行 mTLS 验证

### 将证书链 bundle 上传并配置到 Nginx 目录下

```shell
scp intermediates/home_ca_intermediate_1.pem host:~/
```

#### 创建 `client_certs` 目录

```shell
sudo mkdir -p /etc/nginx/client_certs
sudo chmod 600 /etc/nginx/client_certs
sudo chmod 600 -R /etc/nginx/client_certs
```

移动证书链 bundle 到 `client_certs` 目录下

```shell
sudo mv ~/home_ca_intermediate_1_bundle.crt ./
```

### 更新 Nginx 配置文件

在需要添加 mTLS 验证的服务配置中添加下面的几行

```nginx
server {
    ...

    # 添加 ssl_client_certificate 参数配置，填写 证书链 bundle 的路径
    ssl_client_certificate /etc/nginx/client_certs/home_ca_intermediate_1_bundle.crt;

    # 添加 ssl_verify_client 参数配置，填写为 optional。
    # 注：该参数配置支持三个值，分别是：
    # 1. on: 强制 TLS 证书验证，不满足时拒绝连接;
    # 2. optional: 不强制 TLS 证书验证，将结果返回到 Nginx 上下文 ssl_client_verify 变量中;
    # 3. off; 关闭 TLS 证书验证。
    ssl_verify_client      optional;
    ...

    location / {

        # 进行 if 判断，对 TLS 客户端证书验证结果进行判断，如果验证不成功，则返回 496 错误代码
        if ($ssl_client_verify != SUCCESS) {
            return 496;
          }
          ...
    }
}
```

### 测试 Nginx 配置文件

```shell
sudo nginx -t
```

### 重载 Nginx 配置

```shell
sudo nginx -s reload
```

## 参考资料

[Certificate(CSR) configuration file](https://gist.github.com/yidas/af42d2952d85c0951c1722fcd68716c6)

[Creating a CA](https://www.phildev.net/ssl/creating_ca.html)

[OpenSSL, basic configuration, new_certs_dir, certs - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/398280/openssl-basic-configuration-new-certs-dir-certs)

[Building a Root CA and an Intermediate CA using OpenSSL and Debian Stretch | Dad Hacks](https://dadhacks.org/2017/12/27/building-a-root-ca-and-an-intermediate-ca-using-openssl-and-debian-stretch/)

[openssl生成https自签名证书 - 简书](https://www.jianshu.com/p/b92d4c8cbe05)

[Create the intermediate pair — OpenSSL Certificate Authority — Jamie Nguyen](https://jamielinux.com/docs/openssl-certificate-authority/create-the-intermediate-pair.html)

[Create Certificate Authority and sign a certificate with Root CA | GoLinuxCloud](https://www.golinuxcloud.com/create-certificate-authority-root-ca-linux/)

[OpenSSL create client certificate & server certificate with example | GoLinuxCloud](https://www.golinuxcloud.com/openssl-create-client-server-certificate/)

[How to create multidomain certificates using config files](https://apfelboymchen.net/gnu/notes/openssl%20multidomain%20with%20config%20files.html)

[Configuring Your Nginx Server for Mutual TLS — Smallstep](https://smallstep.com/hello-mtls/doc/server/nginx)

[Convert .p12 bundle to server certificate and key files | Bots!](https://tweenpath.net/convert-p12-bundle-to-server-certificate-and-key-files/)

## 延伸阅读

[Nginx 的简单 mTLS 配置 - smallstep](https://smallstep.com/hello-mtls/doc/server/nginx)

[Nginx 服务网格中的 mTLS 架构 - Nginx](https://www.nginx.com/blog/mtls-architecture-nginx-service-mesh/)
