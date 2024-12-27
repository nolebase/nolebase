---
tags:
  - 计算机/网络/网关/Nginx
  - 计算机/网络/网关/OpenResty
  - 开发/语言/Lua
  - 开发/JWT
  - 开发/语言/Lua/luajit
---

# OpenResty 记录 JWT 中的 userId

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2022-08-18 | 创建 |

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Debian | 11/5.10.127-1/amd64 |  |
| OpenResty | openresty/1.21.4.1 | [OpenResty® - Official Site](https://openresty.org/en/) |
| SkyLothar/lua-resty-jwt | 0.1.11 | [SkyLothar/lua-resty-jwt: JWT For The Great Openresty](https://github.com/SkyLothar/lua-resty-jwt) |
| cloudflare/lua-resty-cookie | 0.0.0 | [cloudflare/lua-resty-cookie: Lua library for HTTP cookie manipulations for OpenResty/ngx_lua](https://github.com/cloudflare/lua-resty-cookie) |

## 安装 lua-resty-jwt

```shell
sudo opm get SkyLothar/lua-resty-jwt
```

## 安装 lua-resty-cookie

克隆 [cloudflare/lua-resty-cookie](https://github.com/cloudflare/lua-resty-cookie) 到本地，使用 scp 或者 rsync 传输到远程服务器上

```shell
git clone https://github.com/cloudflare/lua-resty-cookie.git
scp lib/resty/cookie.lua <目标机器 Host>:~/
```

访问远程服务器并放置到 `/usr/local/openresty/lualib/resty/` 目录下

```shell
sudo cp ~/cookie.lua /usr/local/openresty/lualib/resty/
```

## 创建 lua 脚本目录

```shell
sudo mkdir /etc/openresty/lua
```

## 创建记录 UserID 的 lua 脚本

编辑 `/etc/openresty/lua/log_uid.lua` 文件并写入下面的代码

```lua
local cjson = require("cjson")
local jwt = require("resty.jwt")
local cookie = require("resty.cookie")

local secret = "<填写你的 JWT 加密密钥>"
local jwt_cookie_name = "<JWT 在 Cookie 头中的 Cookie 名称>"
local jwt_user_id_field_name = "userId" -- 这里我的 userId 字段直接存放在 payload 下面，可以按需进行变更

local ck, err = cookie:new()
if not ck then
    return
end

local fields, err = ck:get_all()
if not fields then
    ngx.log(ngx.ERR, err)
    return
end

for k, v in pairs(fields) do
    if k == jwt_cookie_name then
        local jwt_obj = jwt:verify(secret, v)
        if jwt_obj["verified"] and jwt_obj["valid"] then
            if jwt_obj["payload"] and jwt_obj["payload"][jwt_user_id_field_name] ~= nil then
                ngx.var.uid = jwt_obj["payload"][jwt_user_id_field_name] -- 将 userId 字段取出来放到 $uid 变量中
            end
        end
    end
end
```

## OpenResty 日志字段中配置输出 uid 变量

编辑 `/etc/openresty/nginx.conf`

```nginx
http {

    ...

    log_format json '{'
        '"@timestamp":"$time_iso8601",'
        '"client_ip": "$remote_addr",'
        '"request_uri": "$uri",'
        '"host":"$host",'
        '"method": "$request_method",'
        '"request": "$request",'
        '"status": "$status",'
        '"body_bytes_sent": $body_bytes_sent,'
        '"referer": "$http_referer",'
        '"ua": "$http_user_agent",'
        '"request_time": $request_time,'
        '"upstream_connect_time": $upstream_connect_time,'
        '"upstream_header_time": $upstream_header_time,'
        '"upstream_response_time": $upstream_response_time,'
        '"uid": $uid' # 补充配置该行文本
    '}';

    access_log  /var/log/nginx/access.log json;

    ...

}
```

## OpenResty 服务配置中初始化 uid 变量并导入需要执行的 lua 脚本

编辑每一个需要记录 uid 的 vhost 配置文件

```nginx
server {
        listen 80 default_server;
        server_name _;

        set $uid '0'; # 此处初始化变量

        return 301 https://$host$request_uri;
}
server {
        listen 443 ssl http2 default_server;
        server_name _;

        ...

        set $uid '0'; # 此处初始化变量

        ...

        location / {
            access_by_lua_file /etc/openresty/lua/log_uid.lua; # 此处导入需要执行的脚本

            ...
        }
}w
```

## 检查配置文件并重载

```shell
sudo nginx -t
sudo nginx -s reload
```
