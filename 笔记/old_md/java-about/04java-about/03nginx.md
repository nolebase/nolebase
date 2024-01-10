---

title: 03 Nginx

---

## nginx 简介
（1） 什么是 nginx 和可以做什么事情
（2） 正向代理
（3） 反向代理
（4） 动静分离

## 1.Nginx 的简介
1、什么是 nginx
Nginx 是高性能的 HTTP 和反向代理的服务器，处理高并发能力是十分强大的，能经受高负载的考验,有报告表明能支持高达 50,000 个并发连接数。

2、正向代理
（1）需要在客户端配置代理服务器进行指定网站访问
![nginx01](/java04/nginx01.png)

3、反向代理
暴露的是代理服务器地址，隐藏了真实服务器 IP 地址。
![nginx02](/java04/nginx02.png)

4、负载均衡
增加服务器的数量，然后将请求分发到各个服务器上，将原先请求集中到单个服务器上的
情况改为将请求分发到多个服务器上，将负载分发到不同的服务器，也就是我们所说的负
载均衡

5、动静分离
为了加快网站的解析速度，可以把动态页面和静态页面由不同的服务器来解析，加快解析速度。降低原来单个服务器的压力。
![nginx03](/java04/nginx03.png)


## 2. Nginx 的安装
http://nginx.org/

环境安装
第一步，安装 pcre
wget http://downloads.sourceforge.net/project/pcre/pcre/8.37/pcre-8.37.tar.gz 
解压文件，
./configure 完成后，回到 pcre 目录下执行 make， 再执行 make install
pcre-config --version

第二步，安装 openssl
第三步，安装 zlib
yum -y install make zlib zlib-devel gcc-c++ libtool


第四步，安装 nginx
1、 解压缩 nginx-xx.tar.gz 包。
2、 进入解压缩目录，执行./configure。 
./configure --prefix=/opt/nginx1.16 # 这里指定安装目录
3、 make && make install
/opt/nginx1.16/sbin/nginx #启动nginx
/opt/nginx1.16/sbin/nginx -s stop  #停止
/opt/nginx1.16/sbin/nginx -s reload  #重新载入配置
查看开放的端口号
firewall-cmd --list-all
设置开放的端口号
firewall-cmd --add-service=http –permanent sudo 
firewall-cmd --add-port=80/tcp --permanent
重启防火墙
firewall-cmd –reload
openssl openssl-devel


## 3. nginx 常用的命令和配置文件
进入 nginx 目录中
cd /usr/local/nginx/sbin


1、查看 nginx 版本号

./nginx -v

2、启动 nginx

./nginx

3、停止 nginx

./nginx -s stop

4、重新加载 nginx

./nginx -s reload

### 3.2 Nginx 的配置文件

1、nginx 配置文件位置

    cd /usr/local/nginx/conf/nginx.conf

2、配置文件中的内容
包含三部分内容

（1）全局块：配置服务器整体运行的配置指令
    
    比如 worker_processes 1;处理并发数的配置,这是 Nginx 服务器并发处理服务的关键配置，worker_processes 值越大，可以支持的并发处理量也越多，但是 会受到硬件、软件等设备的制约

（2）events 块：影响 Nginx 服务器与用户的网络连接

    比如 worker_connections 1024; 支持的最大连接数为 1024
events 块涉及的指令主要影响 Nginx 服务器与用户的网络连接，常用的设置包括是否开启对多 work process 下的网络连接进行序列化，是否允许同时接收多个网络连接，选取哪种事件驱动模型来处理连接请求，每个 word process 可以同时支持的最大连接数等。
上述例子就表示每个 work process 支持的最大连接数为 1024. 这部分的配置对 Nginx 的性能影响较大，在实际中应该灵活配置。



（3）http 块
这算是 Nginx 服务器配置中最频繁的部分，代理、缓存和日志定义等绝大多数功能和第三方模块的配置都在这里。 需要注意的是:http 块也可以包括 http 全局块、server 块。
    还包含两部分：
    http 全局块
    server 块

1、http 全局块 
    http 全局块配置的指令包括文件引入、MIME-TYPE 定义、日志自定义、连接超时时间、单链接请求数上限等。
2、server 块
    这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机是完全一样的，该技术的产生是为了 节省互联网服务器硬件成本。
每个 http 块可以包括多个 server 块，而每个 server 块就相当于一个虚拟主机。 而每个 server 块也分为全局 server 块，以及可以同时包含多个 locaton 块。
    1、全局 server 块 最常见的配置是本虚拟机主机的监听配置和本虚拟主机的名称或 IP 配置。
    2、location 块
    一个 server 块可以配置多个 location 块。
这块的主要作用是基于 Nginx 服务器接收到的请求字符串(例如 server_name/uri-string)，对虚拟主机名称 (也可以是 IP 别名)之外的字符串(例如 前面的 /uri-string)进行匹配，对特定的请求进行处理。地址定向、数据缓 存和应答控制等功能，还有许多第三方模块的配置也在这里进行。


## 4 具体配置demo
### 4.1 Nginx 配置实例-反向代理实例 1

1、实现效果
（1）打开浏览器，在浏览器地址栏输入地址 www.123.com，跳转到 liunx 系统 tomcat 主页
面中
2、准备工作
（1）在 liunx 系统安装 tomcat，使用默认端口 8080
* tomcat 安装文件放到 liunx 系统中，解压
* 进入 tomcat 的 bin 目录中，./startup.sh 启动 tomcat 服务器

（2）对外开放访问的端口
firewall-cmd --add-port=8080/tcp --permanent
firewall-cmd –reload

查看已经开放的端口号
firewall-cmd --list-all

（3）在 windows 系统中通过浏览器访问 tomcat 服务器

3、访问过程的分析

![nginx04](/java04/nginx04.png)

4、具体配置
第一步 在 windows 系统的 host 文件进行域名和 ip 对应关系的配置
（1）添加内容在 host 文件中
192.168.X.X   www.123.com

第二步 在 nginx 进行请求转发的配置（反向代理配置）
```nginx
server {
        listen       80;
        server_name  192.168.X.X ;     

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
    				proxy_pass   http://192.168.X.X ;  # 转发地址
            index  index.html index.htm;
        }
}   
```

### 4.2 Nginx 配置实例-反向代理实例 2

1、实现效果 使用 nginx 反向代理，根据访问的路径跳转到不同端口的服务中 nginx 监听端口为 9001，

访问 http://192.168.17.129:9001/edu/ 直接跳转到 127.0.0.1:8080 

访问 http:// 192.168.17.129:9001/vod/ 直接跳转到 127.0.0.1:8081

2、准备工作 

（1）准备两个 tomcat 服务器，一个 8080 端口，一个 8081 端口 

（2）创建文件夹和测试页面

3、具体配置 

（1）找到 nginx 配置文件，进行反向代理配置

```nginx
server {
    listen       9001;
    server_name  192.168.X.X ;     
    location ~ /edu/ {
      proxy_pass   http://192.168.X.X:8080 ;  # 转发地址
    }
    location ~ /vod/ {
      proxy_pass   http://192.168.X.X:8081 ;  # 转发地址
    }		
}   
```

location 指令说明	

​	1、= :用于不含正则表达式的 uri 前，要求请求字符串与 uri 严格匹配，如果匹配 成功，就停止继续向下搜索并立即处理该请求。

​	2、~:用于表示 uri 包含正则表达式，并且区分大小写。

​	3、~*:用于表示 uri 包含正则表达式，并且不区分大小写。

​	4、^~:用于不含正则表达式的 uri 前，要求 Nginx 服务器找到标识 uri 和请求字符串匹配度最高的 location 后，立即使用此 location 处理请求，而不再使用 location块中的正则 uri 和请求字符串做匹配。

​	注意:如果 uri 包含正则表达式，则必须要有 ~ 或者 ~* 标识。



### 4.3 ginx 配置实例-负载均衡

1、实现效果 （1）浏览器地址栏输入地址 http://192.168.17.129/edu/a.html，负载均衡效果，平均 8080 和 8081 端口中

2、准备工作 

（1）准备两台 tomcat 服务器，一台 8080，一台 8081 

（2）在两台 tomcat 里面 webapps 目录中，创建名称是 edu 文件夹，在 edu 文件夹中创建 页面 a.html，用于测试

3、在 nginx 的配置文件中进行负载均衡的配置

```nginx
upstream server_pool{
  server 192.168.5.X:8081 ; 
  server 192.168.5.X:8080 ; 
}

server {
        listen       80;
        server_name  192.168.X.X ;     

        location / {
            root   html;
    				proxy_pass   http://server_pool;  # 转发地址
        }
}   
```

1、轮询(默认)

每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器 down 掉，能自动剔除。

2、weight

weight 代表权,重默认为 1,权重越高被分配的客户端越多

指定轮询几率，weight 和访问比率成正比，用于后端服务器性能不均的情况。 

```nginx
upstream server_pool{
  server 192.168.5.X:8081 weight=10; 
  server 192.168.5.X:8080 weight=11; 
}
```

3、ip_hash

每个请求按访问 ip 的 hash 结果分配，这样每个访客固定访问一个后端服务器，可以解决 session 的问题。 例如:

```nginx
upstream server_pool{
  ip_hash;
  server 192.168.5.X:8081 ; 
  server 192.168.5.X:8080 ; 
}
```

4、fair(第三方)

按后端服务器的响应时间来分配请求，响应时间短的优先分配。

```nginx
upstream server_pool{
  server 192.168.5.X:8081 ; 
  server 192.168.5.X:8080 ; 
  fair;
}
```

## 5  nginx 配置实例-动静分离

​		Nginx 动静分离简单来说就是把动态跟静态请求分开，不能理解成只是单纯的把动态页面和 静态页面物理分离。严格意义上说应该是动态请求跟静态请求分开，可以理解成使用 Nginx 处理静态页面，Tomcat 处理动态页面。动静分离从目前实现角度来讲大致分为两种，

​		一种是纯粹把静态文件独立成单独的域名，放在独立的服务器上，也是目前主流推崇的方案;另外一种方法就是动态跟静态文件混合在一起发布，通过 nginx 来分开。

​		通过 location 指定不同的后缀名实现不同的请求转发。通过 expires 参数设置，可以使 浏览器缓存过期时间，减少与服务器之前的请求和流量。具体 Expires 定义:是给一个资 源设定一个过期时间，也就是说无需去服务端验证，直接通过浏览器自身确认是否过期即可， 所以不会产生额外的流量。此种方法非常适合不经常变动的资源。(如果经常更新的文件， 不建议使用 Expires 来缓存)，我这里设置 3d，表示在这 3 天之内访问这个 URL，发送 一个请求，比对服务器该文件最后更新时间没有变化，则不会从服务器抓取，返回状态码 304，如果有修改，则直接从服务器重新下载，返回状态码 200。



![nginx05](/java04/nginx05.png)

```nginx
server {
        listen       80;
        server_name  192.168.X.X ;     

        location /www/ {
            root   /data/;
    				 index  index.html index.htm;
        }
  
  			location /image/ {
            root   /data/;
    				autoindex on;  # 列出文件夹
        }
}   
```



## 6 Nginx 配置高可用的集群

一台nginx宕机，则服务全部不能访问

![nginx06](/java04/nginx06.png)

（1）需要两台 nginx 服务器 

（2）需要 keepalived 

（3）需要虚拟 ip



2、配置高可用的准备工作 

（1）需要两台服务器 192.168.17.129 和 192.168.17.131 

（2）在两台服务器安装 nginx 

（3）在两台服务器安装 keepalived



3、在两台服务器安装 keepalived 

（1）使用 yum 命令进行安装 yum install keepalived –y

（2）安装之后，在 etc 里面生成目录 keepalived，有文件 keepalived.conf

4、完成高可用配置（主从配置） 

（1）修改/etc/keepalived/keepalivec.conf 配置文件

```
# 全局定义
global_defs {  
 notification_email {
 acassen@firewall.loc
 failover@firewall.loc
 sysadmin@firewall.loc
 }
 notification_email_from Alexandre.Cassen@firewall.loc
 smtp_server 192.168.17.129
 smtp_connect_timeout 30
 # 访问到主机。vi /etc/hosts   ...127.0.0.1. LVS_DEVEL...
 router_id LVS_DEVEL
}

# 脚本配置
vrrp_script chk_http_port {
 script "/usr/local/src/nginx_check.sh"
 interval 2 #（检测脚本执行的间隔） 2s
 weight 2
}

vrrp_instance VI_1 {
 state MASTER # 备份服务器上将 MASTER 改为 BACKUP
 interface ens33 //网卡
 virtual_router_id 51 # 主、备机的 virtual_router_id 必须相同
 priority 100 # 主、备机取不同的优先级，主机值较大，备份机值较小(90)
 advert_int 1  # 心跳检测 1s
 authentication {  # 权限校验   
   auth_type PASS
   auth_pass 1111
 }
 virtual_ipaddress {
 	192.168.17.50 // VRRP H 虚拟地址
 }
}
```



（2）在/usr/local/src/   nginx_check.sh添加检测脚本

```bat
#!/bin/bash
A=`ps -C nginx –no-header |wc -l`
if [ $A -eq 0 ];then
 /usr/local/nginx/sbin/nginx   # nginx的路径
 sleep 2
 if [ `ps -C nginx --no-header |wc -l` -eq 0 ];then  # 检测到nginx挂掉，则把（keepalived）自己给杀掉
 killall keepalived
 fi
fi
```

（3）把两台服务器上 nginx 和 keepalived 启动 

启动 nginx：./nginx 

启动 keepalived：systemctl start keepalived.service

5、最终测试 

（1）在浏览器地址栏输入 虚拟 ip 地址 192.168.17.50 

（2）把主服务器（192.168.17.129）nginx 和 keepalived 停止，再输入 192.168.17.50

## 7 Nginx 的原理

1、mater 和 worker

![nginx07](/java04/nginx07.png)

2、worker 如何进行工作的

![nginx08](/java04/nginx08.png)

3、一个 master 和多个 woker 有好处

​	（1）可以使用 nginx –s reload 热部署，利用 nginx 进行热部署操作

​	（2）每个 woker 是独立的进程，如果有其中的一个 woker 出现问题，其他 woker 独立的，继续进行争抢，实现请求过程，不会造成服务中断

4、设置多少个 woker 合适

​	worker 数和服务器的 cpu 数相等是最为适宜的

设置 worker 数量。

worker_processes 4

\#work 绑定 cpu(4 work 绑定 4cpu)。

worker_cpu_affinity 0001 0010 0100 1000

* work 绑定 cpu (4 work 绑定 8cpu 中的 4 个) 。

worker_cpu_affinity 0000001 00000010 00000100 00001000





5、连接数 worker_connection

​	第一个：发送请求，占用了 woker 的几个连接数？

​	答案：2 或者 4 个   静态资源/动态资源



​	第二个：nginx 有一个 master，有四个 woker，每个 woker 支持最大的连接数 1024，支持的最大并发数是多少？

* 普通的静态访问最大并发数是： worker_connections * worker_processes /2，

* 而如果是 HTTP 作 为反向代理来说，最大并发数量应该是 worker_connections * worker_processes/4。

