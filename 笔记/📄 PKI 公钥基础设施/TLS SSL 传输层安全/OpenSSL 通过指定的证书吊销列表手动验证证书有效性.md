# OpenSSL 通过指定的证书吊销列表手动验证证书有效性

#openssl #tls #ssl #crl #证书 #certificate #ca

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2021-12-02 |

##### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| OpenSSL | LibreSSL 2.8.3 | 无 |

原文：[OpenSSL: 通过指定的 CRL（证书吊销列表）手动验证证书有效性 - Raymii.org - 英文](https://raymii.org/s/articles/OpenSSL_manually_verify_a_certificate_against_a_CRL.html)

## 验证步骤

### 获取网站的 HTTPS SSL 证书

该步骤通过 `openssl` 命令和 `wikipedia.org:443` 创建了一个连接，并且把证书文件输出到名为 `wikipedia.pem` 的文件中

```shell
openssl s_client -connect wikipedia.org:443 2>&1 < /dev/null | sed -n '/-----BEGIN/,/-----END/p' > wikipedia.pem
```

### 获取上一步获取证书所关联的 CRL 文件的 URL

该步骤通过 `openssl` 命令读取上一步中获取的 `wikipedia.pem` 文件，并且使用 `grep`[^1] 命令查找了 `X509v3 CRL Distribution Points` 字段，打印它所相关的 4 行内的值

```shell
openssl x509 -noout -text -in wikipedia.pem | grep -A 4 'X509v3 CRL Distribution Points'
```

示例输出

```shell
X509v3 CRL Distribution Points: 
    Full Name:
      URI:http://crl.globalsign.com/gs/gsorganizationvalsha2g2.crl

```

### 通过 CRL 文件的 URL 获取 CRL 文件

该步骤通过 `wget`[^2]命令通过上一步获取的 URL 下载了一个文件，并且保存为 `crl.der`（`.der` 拓展名表示该文件使用 DER 编码）

```shell
wget -O crl.der http://crl.globalsign.com/gs/gsorganizationvalsha2g2.crl
```

### 转换下载的 CRL 文件编码格式为 PEM

手动下载的 CRL 证书吊销列表文件使用 DER 编码，需要预先转换为统一的 PEM 格式：

```shell
openssl crl -inform DER -in <CRL 文件路径> -out <转换后的 CRL 文件路径（使用 pem 作为拓展名）> -outform PEM
```

此处可以执行下面的命令把上一步的 CRL 文件转换为 PEM 编码：

```shell
openssl crl -inform DER -in crl.der -outform PEM -out crl.pem
```

### 获取网站 HTTPS SSL 的证书链

HTTPS 使用的 SSL 证书通常由证书颁发机构颁发，有的证书基础设施可能还会使用『中间证书颁发机构』来辅助管理证书的颁发和吊销过程，此处我们需要了解网站的 HTTPS SSL 证书都包含了哪些证书链（即可能的上游证书颁发机构，可能有一个或是更多个）

输入下面的命令就可以获得证书链的文件 `chain.pem`

```shell
OLDIFS=$IFS; IFS=':' certificates=$(openssl s_client -connect <网站域名>:<HTTPS 服务所在的端口> -showcerts -tlsextdebug -tls1 2>&1 </dev/null | sed -n '/-----BEGIN/,/-----END/ {/-----BEGIN/ s/^/:/; p}'); for certificate in ${certificates#:}; do echo $certificate | tee -a chain.pem ; done; IFS=$OLDIFS 
```

此处可以执行下面的命令获得证书链的文件 `chain.pem`：

```shell
OLDIFS=$IFS; IFS=':' certificates=$(openssl s_client -connect wikipedia.org:443 -showcerts -tlsextdebug -tls1 2>&1 </dev/null | sed -n '/-----BEGIN/,/-----END/ {/-----BEGIN/ s/^/:/; p}'); for certificate in ${certificates#:}; do echo $certificate | tee -a chain.pem ; done; IFS=$OLDIFS 
```

在该证书中，会包含（如果有的话）上游的证书颁发机构的证书信息，以及这些证书的公钥文件。

### 把 PEM 编码的证书链文件和 PEM 编码的 CRL（证书吊销列表）文件拼接到一起

Openssl 命令需要将 PEM 格式的证书链和 CRL 连接在一起以进行验证。检查证书是否有效的时候可以省略 CRL 文件，但是 CRL 检查将不起作用，它只会根据证书链验证证书（比如验证该证书是否是颁发机构颁发的，或是是否还在有效期、是否被篡改等）。

```shell
cat chain.pem crl.pem > crl_chain.pem
```

### 验证

#### 验证未被吊销的证书

```shell
openssl verify -crl_check -CAfile crl_chain.pem wikipedia.pem 
wikipedia.pem: OK
```

以上就是通过的情况，会显示 `OK`

#### 验证被吊销的证书

```shell
openssl verify -crl_check -CAfile crl_chain.pem revoked-test.pem 
revoked-test.pem: OU = Domain Control Validated, OU = PositiveSSL, CN = xs4all.nl
error 23 at 0 depth lookup:certificate revoked
```

以上就是未通过的情况，显示 `certificate revoked`（证书已被吊销）

## 特殊情况

手动下载的 CRL 证书吊销列表文件使用 DER 编码，需要预先转换为统一的 PEM 格式：

```shell
openssl crl -inform DER -in <CRL 文件路径> -out <转换后的 CRL 文件路径（使用 pem 作为拓展名）> -outform PEM
```

手动下载的 CER、CRT 证书文件使用 DER 编码，需要预先转换为统一的 PEM 格式方便操作：

```shell
openssl x509 -in <CER/CRT 文件路径> -inform DER -out <转换后的 CER/CRT 文件路径> -outform PEM
```

[^1]: [🚧  grep 查找文件](../../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/Linux%20%E5%91%BD%E4%BB%A4/%E6%96%87%E6%A1%A3%E8%AF%BB%E5%86%99/%F0%9F%9A%A7%20%20grep%20%E6%9F%A5%E6%89%BE%E6%96%87%E4%BB%B6.md)
[^2]: [wget HTTP 客户端](../../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/%E8%BD%AF%E4%BB%B6/wget%20HTTP%20%E5%AE%A2%E6%88%B7%E7%AB%AF.md)
