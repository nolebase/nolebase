---
tags:
  - 命令行/openssl
  - 数学/密码学/证书
  - 数学/密码学/证书/TLS
  - 数学/密码学/证书/TLS/mTLS
  - 数学/密码学/证书/TLS/HTTPS
  - 数学/密码学/证书/TLS/SSL
  - 数学/密码学/证书/PKI
  - 数学/密码学/证书/证书机构/CA
  - 开发/Git
  - 命令行/git
  - 数学/密码学/证书/证书机构/中间CA
  - 数学/密码学/证书/证书机构/IntermediateCA
  - 数学/密码学/证书/证书机构/RootCA
  - 数学/密码学/证书/TLS/域名证书
  - 数学/密码学/证书/证书吊销列表
  - 数学/密码学/证书/证书吊销列表/CRL
---
# 在本地用 OpenSSL 用配置文件和版本控制的方式创建、配置和使用 Intermediate CA（中间 CA）

::: warning ⚠️ 开始前请阅读

正如[官方文档](https://www.openssl.org/docs/man1.1.1/man1/ca.html)所述：

> The ca command is quirky and at times downright unfriendly.
> ca 命令很古怪，有时甚至完全不友好。

以及

> The ca utility was originally meant as an example of how to do things in a CA. It was not supposed to be used as a full blown CA itself: nevertheless some people are using it for this purpose.

> ca 实用程序最初是作为如何在 CA 中执行操作的示例。它本身不应该被用作一个完整的 CA：尽管如此，还是有人将它用于此目的。

> The ca command is effectively a single user command: no locking is done on the various files and attempts to run more than one ca command on the same database can have unpredictable results.

> ca 命令实际上是一个单用户命令：不会对各个文件进行锁定，并且尝试在同一数据库上运行多个 ca 命令可能会产生不可预测的结果。

所以这篇文档并不是推荐大家用 `openssl ca` 这样的命令去管理和维护自己的 CA 和下面的证书，而是希望提供一个方向和指南来说明 `openssl ca` 是如何运行和使用的，我也仅仅只有在自己的 Homelab 上的小部分领域使用了这样的方式来管理自己的 CA 和证书。

如果你喜欢的话，你大可以理解为这是一种「古法手搓 CA 和证书」的行为，而非生产环境中建议的行为，这很 Geek，需要你了解你在做什么。我建议你在学习和实操之后多阅读阅读[官方文档](https://www.openssl.org/docs/man1.1.1/man1/ca.html)的警告部分。

:::

::: warning ⚠️ 关于版本控制

在 2023 年这样的云原生时代下，我依然没有找到一个适合终端管理用户去使用的比较友好的 CA 管理工具，所以我在这里使用了 Git 作为版本控制工具来管理我的 CA 和证书。
这不代表我推荐你也这么做，生产环境上也不建议这么做，你在版本控制中也应该时时刻刻关注你的私钥是否被添加到了暂存，Stash，推送到了目标远程服务器，一旦你在 Git 历史中留下了任何的私钥的脚印，这将会引入非常大的安全隐患，允许黑客在入侵电脑后直接通过 Git Reflog 相关的命令直接把含有私钥的历史记录解析和提取出来。

**我这么做只是因为没有更好用直观的管理工具，且我自己使用类似于 1Password 这样的工具去细致地管理我的所有私钥，如果你也想这样实践和尝试 CA 和 PKI，请务必注意你的私钥的安全。**

:::

## 创建

### 创建存储中间 CA 相关所有文件的目录

我们可以在 Root CA 所在的目录下新建一个用于存储中间 CA 本身的各种配置文件，历史文件的目录：

```shell
mkdir intermediates/domains
```
### 创建 OpenSSL 配置文件

在这个新创建的 `intermediates/domains` 下创建一个新的 OpenSSL 配置文件 `intermediates/domains/self_openssl.cnf` 来配置中间 CA 本身的元数据信息：

```shell
touch intermediates/domains/self_openssl.cnf
```

然后填充下面的内容

```ini
[req]
distinguished_name = req_distinguished_name

[req_distinguished_name]
# 配置基础信息的提示，这个不要删
countryName            = 国家代号（两位字母）
stateOrProvinceName    = 州/省
localityName           = 市
0.organizationName     = 组织名称
organizationalUnitName = 部门名称
commonName             = 中间 CA 名称

# 配置默认值
countryName_default            = CN
stateOrProvinceName_default    = Shanghai
localityName_default           = Shanghai
0.organizationName_default     = Ayaka Home Domains
organizationalUnitName_default = Ayaka Home Domains
commonName_default             = Ayaka Home Domains Intermediate CA v1

# 创建证书的时候需要激活的扩展
[v3_intermediate_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
# 要注意的是，这里 pathlen 写了 0 是因为这个中间证书专门为了
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
```

### 创建创建证书需要的目录

我们在 `intermediates/domains/self_openssl.cnf` 的这个 OpenSSL 配置文件中指定的目录是需要预先创建和准备好的：

1. `private`：用于存储  Intermediate CA（中间证书）的私钥的目录
2. `certs`：用于存储 Intermediate CA（中间证书）的目录
3. `csr`：用于存储我们创建的 CSR（证书签发申请文件）

```shell
mkdir intermediates/domains/private intermediates/domains/certs intermediates/domains/csr
```

### 创建和申请中间 CA

#### 创建私钥

> [!WARNING] 关于为什么文件命名后缀带有日期，以及 PKI 和版本控制
> 由于一般私钥是不纳入版本控制的，如果我们在本地同时拥有和需要管理多个私钥，甚至是在临时的部署中需要操作这些私钥的时候，如果只使用一个 `intermediate.key.pem` 作为命名的话可能之后需要涉及到来回重命名文件，所以在下面的命令中，我会偏好于在后缀中或者在文件夹中加入一个年份和月份来提示开发者和管理者操作的目标 key 和证书是什么时候生成的。

你可以执行下面的命令生成一个新的私钥：

::: code-group

```shell [使用 RSA 算法]
openssl genrsa 4096 -out intermediates/domains/private/intermediate.202309.key.pem
```

```shell [使用 Secp256k1 算法]
openssl ecparam -genkey -name secp256k1 -out intermediates/domains/private/intermediate.202309.key.pem
```
:::
#### 创建 CSR（证书签发申请文件）

```shell
openssl req -new -sha256 -config intermediates/domains/self_openssl.cnf -key intermediates/domains/private/intermediate.202309.key.pem -out intermediates/domains/csr/intermediate.202309.csr
```

#### 使用 Root CA 根据 CSR 签发证书

```shell
openssl ca -config home_ca.cnf -extensions v3_intermediate_ca -days 3650 -notext -md sha256 -in intermediates/domains/csr/intermediate.202309.csr -out intermediates/domains/certs/intermediate.202309.crt
```

结果：

```shell
$ openssl ca -config home_ca.cnf -extensions v3_intermediate_ca -days 3650 -notext -md sha256 -in intermediates/domains/csr/intermediate.202309.csr -out intermediates/domains/certs/intermediate.202309.crt
Using configuration from home_ca.cnf
Check that the request matches the signature
Signature ok
The Subject\'s Distinguished Name is as follows
countryName           :PRINTABLE:'CN'
stateOrProvinceName   :ASN.1 12:'Shanghai'
localityName          :ASN.1 12:'Shanghai'
organizationName      :ASN.1 12:'Ayaka Home Domains'
organizationalUnitName:ASN.1 12:'Ayaka Home Domains'
commonName            :ASN.1 12:'Ayaka Home Domains Intermediate CA v1'
emailAddress          :IA5STRING:'neko@ayaka.moe'
Certificate is to be certified until Sep 25 13:44:32 2033 GMT (3650 days)
Sign the certificate? [y/n]:y


1 out of 1 certificate requests certified, commit? [y/n]y
Write out database with 1 new entries
Data Base Updated
```

这个时候我们的中间 CA 证书就被创建好了，如果你前往 Root CA 的 `database` 字段中指向的文件（我这里是 `/opt/certs/home/index.txt`）中查看，会发现新增了一条：

```
V	330925162823Z		1010	unknown	/C=CN/ST=Shanghai/L=Shanghai/O=Ayaka Home Domains/OU=Ayaka Home Domains/CN=Ayaka Home Domains Intermediate CA v1/emailAddress=neko@ayaka.moe
```

这个 `1009` 的数字就是我们证书的序列号了，你也可以在 Root CA 的 `serial` 字段所指向的文件（我这里是 `/opt/certs/home/serial`）文件中查看，它会变成下一个证书应该使用的序列号：

```
1010
```

这个时候如果你不启用版本控制的话，就可以开始进行后续的操作了。如果你启用了版本控制，那我们可以把：

- `self_openssl.cnf`
- 生成的证书签名请求
- 签发的新证书
- Root CA 附属的 `database` 对应的 `index.txt`，`index.txt.attr` 和 `index.txt.old`
- `serial` 对应的 `serial`，`serial.old`

等以上文件都安全地添加到暂存中，然后提交到自己可信的 Repository 将他们存放起来方便之后我们参考和进行审计。

## 配置
### 创建配置文件

我们可以在先前新创建的 `intermediates/domains` 下创建一个用于中间 CA 创建证书的时候使用的新的 OpenSSL 配置文件 `intermediates/domains/issuer_openssl.cnf`

```ini
[ ca ]
# `man ca`
default_ca = CA_default

[CA_default]
# dir 这个字段这里改成中间 CA 所收录的目录所在的位置哦
# 我这里因为是专门给域名相关的操作单开了一个中间 CA 所以开了一个 domains
# 的目录放在 intermediates 下面方便操作
dir             = ./intermediates/domains
private_key     = $dir/private/intermediate.202309.key.pem # 这个文件名注意要和我们创建的必须一致
certificate     = $dir/certs/intermediate.202309.crt # 中间的时间注意和我们创建的必须一致
# 因为这个文件是随着时间不断新增和配置的，理论上要么纳入到版本控制中，要么
# 上传和同步到 OSS 是最好的，方便分发到终端并方便终端网关和设备进行鉴权控制
crl             = $dir/crl/intermediate.crl
database        = $dir/index.txt
new_certs_dir   = $dir/domains/certs
serial          = $dir/serial
policy          = policy_intermediate
# 因为我们接下来都会在证书的 CSR 当中直接包含拓展信息，比如
# subjectAltName，所以这里需要指明我们需要将拓展复制到签发
# 的证书中
copy_extensions = copy

# 配置一下中间 CA 之下的策略
[policy_intermediate]
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

# 服务端证书（HTTPS 证书，mTLS 服务端侧证书）
[server_cert_ext]
authorityKeyIdentifier = keyid,issuer:always
basicConstraints       = CA:FALSE
keyUsage               = critical, digitalSignature, keyEncipherment
extendedKeyUsage       = serverAuth # 如果不需要 mTLS 的话可以注释掉这行
nsCertType             = server # 如果不需要 mTLS 的话可以注释掉这行
subjectKeyIdentifier   = hash
```

### 创建配置文件中关联的其他目录

我们在 `intermediates/domains/issuer_openssl.cnf` 的这个 OpenSSL 配置文件中指定的目录是需要预先创建和准备好的：

1. `domains`：新的域名证书将会被存放的目录（因为我这里是以域名业务作为例子嘛所以这里你可以改成自己需要的目录名称，保持和 `intermediates/domains/self_openssl.cnf` 中的 `newcerts` 配置项一致就好了）
2. `crl`：用于存储 CRL（证书吊销列表）文件的目录

```shell
mkdir intermediates/domains/domains intermediates/domains/crl
```

### 初始化相关文件

```shell
touch intermediates/domains/index.txt
```

因为我们签署的是相同 subject 内容的域名证书，所以这里我们需要在签署用的中间 CA 所在的目录下创建 `index.txt.attr` 文件并添加 `unique_subject = no`

```shell
echo 'unique_subject = no' > intermediates/domains/index.txt.attr
```

```shell
echo 1000 > intermediates/domains/serial
```
## 使用

### 签发域名和泛域名证书

接下来我们给 `ihome.cat` 创建域名证书吧。

#### 准备域名目录

域名需要方便我们针对文件夹进行打包和部署，所以这里我们使用 2023 作为目录名称而不是像之前一样使用时间后缀作为文件名的一部分：

```shell
mkdir -p intermediates/domains/domains/ihome.cat/2023
```
#### 创建目标终端证书的私钥

::: code-group

```shell [使用 RSA 算法]
openssl genrsa 4096 -out intermediates/domains/domains/ihome.cat/2023/ihome.cat.key.pem
```

```shell [使用 Secp256k1 算法]
openssl ecparam -genkey -name secp256k1 -out intermediates/domains/domains/ihome.cat/2023/ihome.cat.key.pem
```
:::
#### 创建域名证书的 CSR（证书签发申请文件）

创建一个域名专属的配置文件 `intermediates/domains/domains/ihome.cat/ihome.cat.cnf`：

```ini
[req]
req_extensions     = v3_req
distinguished_name = req_distinguished_name

[req_distinguished_name]
# 配置基础信息
countryName            = 国家代号（两位字母）
stateOrProvinceName    = 州/省
localityName           = 市
0.organizationName     = 组织名称
organizationalUnitName = 部门名称
commonName             = 域名
emailAddress           = 联系邮箱

# 配置默认值
countryName_default            = CN
stateOrProvinceName_default    = Shanghai
localityName_default           = Shanghai
0.organizationName_default     = Ayaka Home Domains
organizationalUnitName_default = Ayaka Home Domains
commonName_default             = ihome.cat

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.ihome.cat
DNS.2 = ihome.cat
```

然后搭配 `-noout` 和 `-text` 参数预览一下 CSR 文件吧：

```shell
openssl req -new -sha256 -config intermediates/domains/domains/ihome.cat/ihome.cat.cnf -key intermediates/domains/domains/ihome.cat/2023/ihome.cat.key.pem -extensions v3_req -noout -text
```

如果没问题了就可以继续创建了：

```shell
openssl req -new -sha256 -config intermediates/domains/domains/ihome.cat/ihome.cat.cnf -key intermediates/domains/domains/ihome.cat/2023/ihome.cat.key.pem -out intermediates/domains/domains/ihome.cat/2023/ihome.cat.csr -extensions v3_req
```
#### 签发域名证书

```shell
openssl ca -days 365 -notext -md sha256 -config intermediates/domains/issuer_openssl.cnf -extensions server_cert_ext -in intermediates/domains/domains/ihome.cat/2023/ihome.cat.csr -out intermediates/domains/domains/ihome.cat/2023/ihome.cat.crt -verbose
```

#### 查看域名证书

```shell
openssl x509 -in intermediates/domains/domains/ihome.cat/2023/ihome.cat.crt -noout -text
```
#### 打包为 P12

如果你还需要在 Windows 上部署的话，可以在这个时候打包为 p12 证书：

```shell
openssl pkcs12 -export -in intermediates/domains/domains/ihome.cat/2023/ihome.cat.crt -inkey intermediates/domains/domains/ihome.cat/2023/ihome.cat.key.pem -certfile intermediates/domains/certs/intermediate.202309.bundle.crt -out intermediates/domains/domains/ihome.cat/2023/ihome.cat.p12
```


## 问题排查

### `variable lookup failed for ca::default_ca`

完整输出：

```shell
$ openssl ca -days 375 -notext -md sha256 -config intermediates/domains/domains/ihome.cat/ihome.cat.cnf -extensions server_cert_ext -in intermediates/domains/domains/ihome.cat/2023/ihome.cat.csr -out intermediates/domains/domains/ihome.cat/2023/ihome.cat.crt
Using configuration from intermediates/domains/domains/ihome.cat/ihome.cat.cnf
variable lookup failed for ca::default_ca
8493538816:error:0EFFF06C:configuration file routines:CRYPTO_internal:no value:/AppleInternal/Library/BuildRoots/c2cb9645-dafc-11ed-aa26-6ec1e3b3f7b3/Library/Caches/com.apple.xbs/Sources/libressl/libressl-3.3/crypto/conf/conf_lib.c:322:group=ca name=default_ca
```

是不是配置错文件了，签发证书的时候需要的是中间 CA 或者 Root CA 的配置文件，不是域名的配置文件。
### `wrong number of fields on line 1`

完整输出：

```shell
$ openssl ca -days 375 -notext -md sha256 -config intermediates/domains/issuer_openssl.cnf -extensions server_cert_ext -in intermediates/domains/domains/ihome.cat/2023/ihome.cat.csr -out intermediates/domains/domains/ihome.cat/2023/ihome.cat.crt
Using configuration from home_ca.cnf
wrong number of fields on line 1 (looking for field 6, got 1, '' left)
```

是不是修改了 `database.txt` 之后出现多行少行或者 Tab？[^1]

### `TXT_DB error number 2`

完整输出：

```shell
$ openssl ca -days 365 -notext -md sha256 -config intermediates/domains/issuer_openssl.cnf -extensions server_cert_ext -in intermediates/domains/domains/ihome.cat/2023/ihome.cat.csr -out intermediates/domains/domains/ihome.cat/2023/ihome.cat.crt
Using configuration from intermediates/domains/issuer_openssl.cnf
Check that the request matches the signature
Signature ok
The Subject\'s Distinguished Name is as follows
countryName           :PRINTABLE:'CN'
stateOrProvinceName   :ASN.1 12:'Shanghai'
localityName          :ASN.1 12:'Shanghai'
organizationName      :ASN.1 12:'Ayaka Home Domains'
organizationalUnitName:ASN.1 12:'Ayaka Home Domains'
commonName            :ASN.1 12:'ihome.cat'
emailAddress          :IA5STRING:'neko@ayaka.moe'
Certificate is to be certified until Sep 28 04:51:42 2024 GMT (365 days)
Sign the certificate? [y/n]:y
failed to update database
TXT_DB error number 2
```

因为我们签署的是相同 subject 内容的域名证书，所以这里我们需要在签署用的中间 CA 所在的目录下的 `index.txt.attr`（如果没有的话直接创建就好了）中添加

```
unique_subject = no
```

这样的配置。
## 延伸阅读

[Implementing MTLS with Apache and OpenSSL on OpenShift | by Oren Oichman | Medium](https://two-oes.medium.com/implementing-mtls-with-apache-and-openssl-on-openshift-31719be13e7a)

[Create the intermediate pair — OpenSSL Certificate Authority — Jamie Nguyen](https://jamielinux.com/docs/openssl-certificate-authority/create-the-intermediate-pair.html)

[Intermediate CA configuration file — OpenSSL Certificate Authority — Jamie Nguyen](https://jamielinux.com/docs/openssl-certificate-authority/appendix/intermediate-configuration-file.html)

[/docs/man1.1.1/man5/config.html OpenSSL](https://www.openssl.org/docs/man1.1.1/man5/config.html)

[OpenSSL Essentials: Working with SSL Certificates, Private Keys and CSRs | DigitalOcean](https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs)

[SSL/TLS 自签名证书](https://runsisi.com/2019/12/11/cert/)

[Openssl.conf](https://www.phildev.net/ssl/opensslconf.html)

[Managing a CA](https://www.phildev.net/ssl/managing_ca.html)

[^1]: [indexing - Wrong number of fields with openssl - Stack Overflow](https://stackoverflow.com/questions/33503190/wrong-number-of-fields-with-openssl)
