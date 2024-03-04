---
tags:
  - 数学/密码学/证书/TLS
  - 数学/密码学/证书/TLS/HTTPS
  - 数学/密码学/证书/TLS/SSL
  - 数学/密码学/证书/PKI
  - 命令行/openssl
---
# 2023 年轮替 ihome.cat 证书

Gateway 那边 Intermediate CA 的流程和系统还没有建立起来，继续先用 Root CA 签发证书。

这次维护用了 1Password 帮忙存储和读取 key，不过生成 Private key 的功能尚在 beta 阶段，所以还是先用 openssl 生成。

### 生成 Private key 和证书签发请求文件

```shell
openssl genrsa -out ./domains/ihome.cat/2023/ihome.cat.pem 4096
openssl req -new -key domains/ihome.cat/2023/ihome.cat.pem -out domains/ihome.cat/2023/ihome.cat.csr
```

### 创建证书拓展文件

```shell
$ cat > domains/ihome.cat/2023/ihome.cat.ext << EOF
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

```shell
op read "op://<secret reference>" > home_ca.pem
openssl x509 -req -in domains/ihome.cat/2023/ihome.cat.csr -CA home_ca.crt -CAkey home_ca.pem -CAcreateserial -out domains/ihome.cat/2023/ihome.cat.crt -days 365 -sha256 -extfile domains/ihome.cat/2023/ihome.cat.ext
rm -rf home_ca.pem
```

### 验证证书

```shell
openssl verify -CAfile home_ca.crt domains/ihome.cat/2023/ihome.cat.crt
```

然后把证书部署到对应的服务端即可。

部署后记得清理本地的私钥和证书申请文件。

```shell
rm -rf domains/ihome.cat/2023/ihome.cat.pem
rm -rf domains/ihome.cat/2023/ihome.cat.csr
```
