在执行了 安装n模块：
```
npm install -g n
```
 后发现当前生效版本还是原来版本，

造成不生效的原因：node默认的安装目录与使用管理工具n安装的目录不一致

一般默认安装 n 版本会在  /usr/local 下，

而我的电脑生效地址在nvm 下

正确的安装方式：

通过nvm 安装

nvm install 14.17.0

然后查看 

node -v已经是最新版本了,

关闭cmd 再次打开确认，如果还不行，那可能是默认版本没有切换，

现在安装了nvm,我们是可以在多个node版本随意切换的，

输入nvm ls 查看当前版本，default就是现在用的版本

切换版本

执行

```
nvm alias default <version> 设置默认版本
```



如：nvm alias default v16.15.0,回车就可以了

关闭cmd ,再次打开看看版本是否已经切换

查看npm配置路径

npm config list

我的node应用路径在.nvm/versions/node/下，所以可以删除n下的node

如果你的路径不在usr/local下 可以卸载以前安装的n（如果你已经全局安装了一次，ps存储空间我还得省，主要存储太小）, 点击桌面 找到顶部，前往，前往文件夹 输入/usr/local ，找到n文件夹直接删除

NVM常用命令:(原文链接：[https://blog.csdn.net/liuxiaoniudechuntian/article/details/109342480](https://blog.csdn.net/liuxiaoniudechuntian/article/details/109342480))


```
nvm list 查看已经安装的版本  
nvm list installed 查看已经安装的版本  
nvm list available 查看网络可以安装的版本  
nvm version 查看当前的版本  
nvm install 安装最新版本nvm  
nvm use <version> ## 切换使用指定的版本node  
nvm ls 列出所有版本  
nvm current显示当前版本  
nvm alias <name> <version> ## 给不同的版本号添加别名  
nvm unalias <name> ## 删除已定义的别名  
nvm reinstall-packages <version> ## 在当前版本node环境下，重新全局安装指定版本号的npm包  
nvm on 打开nodejs控制  
nvm off 关闭nodejs控制  
nvm proxy 查看设置与代理  
nvm node_mirror [url] 设置或者查看setting.txt中的node_mirror，如果不设置的默认是 https://nodejs.org/dist/  
nvm npm_mirror [url] 设置或者查看setting.txt中的npm_mirror,如果不设置的话默认的是： https://github.com/npm/npm/archive/.  
nvm uninstall <version> 卸载制定的版本  
nvm use [version] [arch] 切换制定的node版本和位数  
nvm root [path] 设置和查看root路径

```


https://www.cnblogs.com/zyandroid/p/14767505.html