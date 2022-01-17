# 申请 Let's Encrypt 的 SSL 证书

## CentOS 7/8

```
sudo dnf install certbot python3-certbot-dns-cloudflare
```

```
mkdir -p .secrets/certbot && echo -e 'dns_cloudflare_email = <Cloudflare 电子邮箱>\ndns_cloudflare_api_key = <API Key>' > .secrets/certbot/cloudflare.ini
```

```
chmod 700 .secrets
chmod 600 .secrets/certbot
chmod 600 .secrets/certbot/cloudflare.ini
```

```
sudo certbot certonly --cert-name <证书文件名称> --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini --server https://acme-v02.api.letsencrypt.org/directory -d "<域名>"
```

## Debian 11

```
sudo apt install certbot
```

### 使用 Global Key

```
mkdir -p .secrets/certbot && echo -e 'dns_cloudflare_email = \ndns_cloudflare_api_key = ' > .secrets/certbot/cloudflare.ini
```

```
vim .secrets/certbot/cloudflare.ini

dns_cloudflare_email = <Cloudflare 电子邮箱>
dns_cloudflare_api_key = <API Key>
```

```
chmod 700 .secrets
chmod 600 .secrets/certbot
chmod 600 .secrets/certbot/cloudflare.ini
```

```
sudo certbot certonly --cert-name <证书文件名称> --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini --server https://acme-v02.api.letsencrypt.org/directory -d "<域名>"
```

### 使用限制的 API 令牌

API 令牌需要 DNS 编辑权限

```
sudo apt install python3-pip
```

```
sudo pip3 install cloudflare
```

```
mkdir -p .secrets/certbot && echo -e 'dns_cloudflare_api_token = ' > .secrets/certbot/cloudflare.ini
```

```
vim .secrets/certbot/cloudflare.ini

dns_cloudflare_api_token = <API Token>
```

```
chmod 700 .secrets
chmod 600 .secrets/certbot
chmod 600 .secrets/certbot/cloudflare.ini
```

```
sudo certbot certonly --cert-name <证书文件名称> --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini --server https://acme-v02.api.letsencrypt.org/directory -d "<域名>"
```

https://certbot.eff.org/instructions?ws=nginx&os=centosrhel8

https://snapcraft.io/docs/installing-snap-on-centos