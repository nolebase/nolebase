# 申请 Let's Encrypt 的 SSL 证书

## CentOS 7/8

```
sudo dnf install certbot python3-certbot-dns-cloudflare
```

```
mkdir -p .secrets/certbot && echo -e 'dns_cloudflare_email = <Cloudflare 电子邮箱>\ndns_cloudflare_api_key = <API Key>' > .secrets/certbot/cloudflare.ini
```

```
chmod 600 .secrets
chmod 600 .secrets/certbot
chmod 600 .secrets/certbot/cloudflare.ini
```

```
sudo certbot certonly --cert-name <证书文件名称> --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini --server https://acme-v02.api.letsencrypt.org/directory -d "<域名>"
```

## Debian 11

```
sudo apt install certbot python3-certbot-dns-cloudflare
```

```
mkdir -p .secrets/certbot && echo -e 'dns_cloudflare_email = <Cloudflare 电子邮箱>\ndns_cloudflare_api_key = <API Key>' > .secrets/certbot/cloudflare.ini
```

```
chmod 600 .secrets
chmod 600 .secrets/certbot
chmod 600 .secrets/certbot/cloudflare.ini
```

```
sudo certbot certonly --cert-name <证书文件名称> --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini --server https://acme-v02.api.letsencrypt.org/directory -d "<域名>"
```
