---
tags:
  - 数学/密码学/证书/TLS/SSL
  - 数学/密码学/证书/TLS/HTTPS
  - 数学/密码学/证书/TLS/域名证书
  - 数学/密码学/证书/LetsEncrypt
  - 命令行/openssl
  - 操作系统/Debian
  - 操作系统/CentOS
  - 操作系统/Debian/Debian-11
  - 操作系统/CentOS/CentOS-8
  - 操作系统/CentOS/CentOS-7
---

# 申请 Let's Encrypt 的 SSL 证书

## CentOS 7/8

```shell
sudo dnf install certbot python3-certbot-dns-cloudflare
```

```shell
mkdir -p .secrets/certbot && echo -e 'dns_cloudflare_email = <Cloudflare 电子邮箱>\ndns_cloudflare_api_key = <API Key>' > .secrets/certbot/cloudflare.ini
```

```shell
chmod 700 .secrets
chmod 600 .secrets/certbot
chmod 600 .secrets/certbot/cloudflare.ini
```

```shell
sudo certbot certonly --cert-name <证书文件名称> --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini --server https://acme-v02.api.letsencrypt.org/directory -d "<域名>"
```

## Debian 11

```shell
sudo apt install certbot
```

```shell
sudo apt -y install python3-certbot-dns-cloudflare
```

### 使用 Global Key

```shell
mkdir -p .secrets/certbot && echo -e 'dns_cloudflare_email = \ndns_cloudflare_api_key = ' > .secrets/certbot/cloudflare.ini
```

```shell
vim .secrets/certbot/cloudflare.ini

dns_cloudflare_email = <Cloudflare 电子邮箱>
dns_cloudflare_api_key = <API Key>
```

```shell
chmod 700 .secrets
chmod 600 .secrets/certbot
chmod 600 .secrets/certbot/cloudflare.ini
```

```shell
sudo certbot certonly --cert-name <证书文件名称> --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini --server https://acme-v02.api.letsencrypt.org/directory -d "<域名>"
```

### 使用限制的 API 令牌

API 令牌需要 DNS 编辑权限

```shell
sudo apt install python3-pip
```

```shell
sudo pip3 install cloudflare
```

```shell
mkdir -p .secrets/certbot && echo -e 'dns_cloudflare_api_token = ' > .secrets/certbot/cloudflare.ini
```

```shell
vim .secrets/certbot/cloudflare.ini

dns_cloudflare_api_token = <API Token>
```

```shell
chmod 700 .secrets
chmod 700 .secrets/certbot
chmod 600 .secrets/certbot/cloudflare.ini
```

```shell
sudo certbot certonly --cert-name <证书文件名称> --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini --server https://acme-v02.api.letsencrypt.org/directory -d "<域名>"
```

## 延伸阅读

[https://certbot.eff.org/instructions?ws=nginx&os=centosrhel8](https://certbot.eff.org/instructions?ws=nginx&os=centosrhel8)
[https://snapcraft.io/docs/installing-snap-on-centos](https://snapcraft.io/docs/installing-snap-on-centos)
