---
tags:
  - 开发/后端/跨域
  - 计算机/网络/网关/Nginx
  - 计算机/网络/跨域/CORS
---

# CORS 重定向问题

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2022-07-20 | 创建 |

```nginx
server {
        listen 80;
        server_name mydomain;
        return 301 https://$host$request_uri;
}
server {
        listen 443 ssl http2;
        server_name mydomain;

        ssl_certificate /etc/ssl/certs/mydomain/fullchain.pem;
        ssl_certificate_key /etc/ssl/private/mydomain/privkey.pem;
        ssl_prefer_server_ciphers on;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

    location /api/ {
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://mydomain';
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, HEAD';
            add_header 'Access-Control-Allow-Headers' 'Origin, Content-Length, Content-Type, Credential, Cookie, Authorization, X-Accept-Language-Code, X-HTTP-Method-Override';
            add_header 'Access-Control-Max-Age' 1728000; # CORS preflight is valid for 20 days
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0; # no content transferred
            return 204;
        }

        client_max_body_size 200m;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_redirect off;

        proxy_pass http://<K8S API service srv Domain>:<ServicePort>;
    }

    location /site.webmanifest {
        proxy_pass http://<K8S SSR frontend service srv Domain>:<ServicePort>;
    }

    location /sw.js {
        proxy_pass http://<K8S SSR frontend service srv Domain>:<ServicePort>;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
```
