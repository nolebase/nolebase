---
title: 16linux下mysql
---

## 1.Linux 下使用mysql

### 1.mysql允许远程访问

```sql
use mysql;
select Host,User from user;
```

可以看到root用户的当前主机配置信息为localhost。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220222212625mysql.png)

- 修改Host为通配符%

Host列指定了允许用户登录所使用的IP，比如user=root Host=192.168.1.1。这里的意思就是说root用户只 能通过192.168.1.1的客户端去访问。 user=root Host=localhost，表示只能通过本机客户端去访问。而 % 是个 ，如果Host=192.168.1.%，那么就表示只要是IP地址前缀为“192.168.1.”的客户端都可以连 接。如果 ，表示所有IP都有连接权限。

注意:在生产环境下不能为了省事将host设置为%，这样做会存在安全问题，具体的设置可以根据生产 环境的IP进行设置。

```sql
update user set host = '%' where user ='root';
```

Host修改完成后记得执行flush privileges使配置立即生效:

```sql
Host修改完成后记得执行flush privileges使配置立即生效:
```



配置新连接报错:错误号码 2058，分析是 mysql 密码加密方法变了。

解决方法:Linux下 mysql -u root -p 登录你的 mysql 数据库，然后 执行这条SQL:

ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'abc123';

### 2,mysql卸载

**1. 关闭 mysql 服务**

```
systemctl stop mysqld.service
```

**2. 查看当前 mysql 安装状况**

```
rpm -qa | grep -i mysql
#或
yum list installed | grep mysql
```

**4. 卸载上述命令查询出的已安装程序**

```sql
yum remove mysql-xxx mysql-xxx mysql-xxx mysqk-xxxx
```

务必卸载干净，反复执行 rpm -qa | grep -i mysql 确认是否有卸载残留

**4. 删除 mysql 相关文件**

- 查找相关文件

```
find / -name mysql
```

- 删除上述命令查找出的相关文件

```
rm -rf xxx
```

**5.删除 my.cnf**

```
 rm -rf /etc/my.cnf
```



### 3.mysql8安装



```sql
chmod -R 777 /tmp

-- 检查依赖
rpm -qa|grep libaio
rpm -qa|grep net-tools
rpm -qa|grep net-tools
```



在mysql的安装文件目录下执行:(必须按照顺序执行)

```sql
rpm -ivh mysql-community-common-8.0.25-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-plugins-8.0.25-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-8.0.25-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-8.0.25-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-8.0.25-1.el7.x86_64.rpm
```

- rpm 是RedhatPackageManage缩写，通过RPM的管理，用户可以把源代码包装成以rpm为扩展名的 文件形式，易于安装。
- -i , --install 安装软件包
- v , --verbose 提供更多的详细信息输出
- -h , --hash 软件包安装的时候列出哈希标记 (和 -v 一起使用效果更好)，展示进度条

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220223211458mysql.png)

> yum remove mysql-libs 解决，清除之前安装过的依赖即可

### 4.服务的初始化

为了保证数据库目录与文件的所有者为 mysql 登录用户，如果你是以 root 身份运行 mysql 服务，需要执行下面的命令初始化:

```
mysqld --initialize --user=mysql
```

说明: --initialize 选项默认以“安全”模式来初始化，则会为 root 用户生成一个密码并将该密码标记为过期 ，登录后你需要设置一个新的密码。生成的 临时密码会往日志中记录一份。

查看密码:

```sql
cat /var/log/mysqld.log
```

root@localhost: 后面就是初始化的密码

### 5.启动MySQL，查看状态

```sql
#加不加.service后缀都可以
启动:systemctl start mysqld.service 
关闭:systemctl stop mysqld.service 
重启:systemctl restart mysqld.service 
查看状态:systemctl status mysqld.service
```



查看进程

```sql
ps -ef | grep -i mysql
```

### 6. 查看MySQL服务是否自启动

```
systemctl list-unit-files|grep mysqld.service
```

如不是enabled可以运行如下命令设置自启动

```
  systemctl enable mysqld.service
```

如果希望不进行自启动，运行如下命令设置

```
systemctl disable mysqld.service
```









## 2.字符集的操作

### 1.修改MySQL5.7字符集

在MySQL 8.0版本之前，默认字符集为 latin1 ，utf8字符集指向的是 utf8mb3 。网站开发人员在数据库 设计的时候往往会将编码修改为utf8字符集。如果遗忘修改默认的编码，就会出现乱码的问题。从MySQL 8.0开始，数据库的默认编码将改为 utf8mb4 ，从而避免上述乱码的问题。

**操作1:查看默认使用的字符集**

```sql
show variables like 'character%'; 
# 或者
show variables like '%char%';
```

**MySQL8.0中执行:**

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220223203159mysql.png" style="zoom:50%;" />

**MySQL5.7中执行:**

MySQL 5.7 默认的客户端和服务器都用了 latin1 ，不支持中文，保存中文会报错。MySQL5.7截图如 下:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220223203315mysql8.png)

**操作2:修改字符集**

```sql
vim /etc/my.cnf
```

在MySQL5.7或之前的版本中，在文件最后加上中文字符集配置:

```tex
character_set_server=utf8
```

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220223203437mysql8.png" style="zoom:50%;" />

**操作3:重新启动MySQL服务**

```cmd
systemctl restart mysqld
```

> 但是原库、原表的设定不会发生变化，参数修改只对新建的数据库生效。

### 2. 已有库&表字符集的变更

ySQL5.7版本中，以前创建的库，创建的表字符集还是latin1。

修改已创建数据库的字符集

```sql
alter database dbtest1 character set 'utf8';
```

修改已创建数据表的字符集

```sql
  alter table t_emp convert to character set 'utf8';
```

> 注意:但是原有的数据如果是用非'utf8'编码的话，数据本身编码不会发生改变。已有数据需要导 出或删除，然后重新插入。

### 3 各级别的字符集

MySQL有4个级别的字符集和比较规则，分别是:

- 服务器级别
- 数据库级别
- 表级别
- 列级别

```sql
show variables like 'character%';
```

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220223203811mysql.png" style="zoom:50%;" />

- haracter_set_server:服务器级别的字符集
- character_set_database:当前数据库的字符集
- character_set_client:服务器解码请求时使用的字符集
- character_set_connection:服务器处理请求时会把请求字符串从character_set_client转为 character_set_connection
- character_set_results:服务器向客户端返回数据时使用的字符集

#### 1. 服务器级别

- character_set_server :服务器级别的字符集

我们可以在启动服务器程序时通过启动选项或者在服务器程序运行过程中使用 SET 语句修改这两个变量 的值。比如我们可以在配置文件中这样写:

```tex
[server]
character_set_server=gbk # 默认字符集 
collation_server=gbk_chinese_ci #对应的默认的比较规则
```

当服务器启动的时候读取这个配置文件后这两个系统变量的值便修改了。

####  2. 数据库级别

- character_set_database :当前数据库的字符集

我们在创建和修改数据库的时候可以指定该数据库的字符集和比较规则，具体语法如下:

```sql
CREATE DATABASE 数据库名
	[[DEFAULT] CHARACTER SET 字符集名称] 
	[[DEFAULT] COLLATE 比较规则名称];
	
ALTER DATABASE 数据库名
  [[DEFAULT] CHARACTER SET 字符集名称] 
  [[DEFAULT] COLLATE 比较规则名称];
```

#### 3. 表级别

我们也可以在创建和修改表的时候指定表的字符集和比较规则，语法如下:

```sql
CREATE TABLE 表名 (列的信息)
	[[DEFAULT] CHARACTER SET 字符集名称] 
	[COLLATE 比较规则名称]]
	
	
ALTER TABLE 表名
	[[DEFAULT] CHARACTER SET 字符集名称] 
	[COLLATE 比较规则名称]
```

**如果创建和修改表的语句中没有指明字符集和比较规则，将使用该表所在数据库的字符集和比较规则作为该表的字符集和比较规则。**

#### 4. 列级别

对于存储字符串的列，同一个表中的不同的列也可以有不同的字符集和比较规则。我们在创建和修改列定义的时候可以指定该列的字符集和比较规则，语法如下:

```sql
CREATE TABLE 表名(
	列名 字符串类型 [CHARACTER SET 字符集名称] [COLLATE 比较规则名称], 
  其他列...
);

ALTER TABLE 表名 MODIFY 列名 字符串类型 [CHARACTER SET 字符集名称] [COLLATE 比较规则名称];
```

**对于某个列来说，如果在创建和修改的语句中没有指明字符集和比较规则，将使用该列所在表的字符集和比较规则作为该列的字符集和比较规则。**

> 在转换列的字符集时需要注意，如果转换前列中存储的数据不能用转换后的字符集进行表示会发生 错误。比方说原先列使用的字符集是utf8，列中存储了一些汉字，现在把列的字符集转换为ascii的 话就会出错，因为ascii字符集并不能表示汉字字符。

#### 5. 小结

- 如果 **创建或修改列**时没有显式的指定字符集和比较规则，则该列**默认用表的**字符集和比较规则
- 如果 **创建或修改表**时没有显式的指定字符集和比较规则，则该列**默认用数据库的**字符集和比较规则
- 如果 **创建数据库时**时没有显式的指定字符集和比较规则，则该列**默认用服务器的**字符集和比较规则

知道了这些规则之后，对于给定的表，我们应该知道它的各个列的字符集和比较规则是什么，从而根据 这个列的类型来确定存储数据时每个列的实际数据占用的存储空间大小了。比方说我们向表 t 中插入一 条记录:

```sql
INSERT INTO t(col) VALUES('我们');
```

```sql
SELECT * FROM t; 
+--------+
|s|
+--------+
|我们 |
+--------+
```

首先列 col 使用的字符集是 gbk ，一个字符 '我' 在 gbk 中的编码为  ，占用两个字节，两个字符的实际数据就占用4个字节。如果把该列的字符集修改为 utf8 的话，这两个字符就实际占用6个字节

##  3.字符集与比较规则

### 1. utf8 与 utf8mb4

utf8 字符集表示一个字符需要使用1~4个字节，但是我们常用的一些字符使用1~3个字节就可以表示 了。而字符集表示一个字符所用的最大字节长度，在某些方面会影响系统的存储和性能，所以设计 MySQL的设计者偷偷的定义了两个概念:

- utf8mb3:阉割过的 utf8 字符集，只使用1~3个字节表示字符。

- utf8mb4 :正宗的 utf8 字符集，使用1~4个字节表示字符。

### 2. 比较规则

MySQL版本一共支持41种字符集，其中的 的比较规则，里面包含着该比较规则主要作用于哪种语言，比如 比较， utf8_spanish_ci 是以西班牙语的规则比较，后缀表示该比较规则是否区分语言中的重音、大小写。

| 后缀 |                    |                  |
| ---- | ------------------ | ---------------- |
| _ai  | accent insensitive | 不区分重音       |
| _as  | accent sensitive   | 区分重音         |
| _ci  | case insensitive   | 不区分大小写     |
| _cs  | case sensitive     | 区分大小写       |
| _bin | binary             | 以二进制方式比较 |

**常用操作1:**

```sql
#查看GBK字符集的比较规则
SHOW COLLATION LIKE 'gbk%';

#查看UTF-8字符集的比较规则
SHOW COLLATION LIKE 'utf8%';
```

**常用操作2:**

```sql
#查看服务器的字符集和比较规则
SHOW VARIABLES LIKE '%_server';

#查看数据库的字符集和比较规则
SHOW VARIABLES LIKE '%_database';

#查看具体数据库的字符集
SHOW CREATE DATABASE dbtest1;

#修改具体数据库的字符集
ALTER DATABASE dbtest1 DEFAULT CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';
```

**常用操作3:**

```sql
#查看表的字符集
show create table employees;

#查看表的比较规则
show table status from atguigudb like 'employees';

#修改表的字符集和比较规则
ALTER TABLE emp1 DEFAULT CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';
```

### 3 请求到响应过程中字符集的变化

| 系统变量                 |                                                              |
| ------------------------ | ------------------------------------------------------------ |
| character_set_client     | 服务器解码请求时使用的字符集                                 |
| character_set_connection | 服务器处理请求时会把请求字符串从character_set_client 转为 character_set_connection |
| character_set_results    | 服务器向客户端返回数据时使用的字符集                         |

- 1. 客户端发送请求所使用的字符集,一般情况下客户端所使用的字符集和当前操作系统一致，不同操作系统使用的字符集可能不一

       样，如下:

     - 类 Unix 系统使用的是 utf8
     - Windows 使用的是 gbk
     - 当客户端使用的是 utf8 字符集，字符 '我' 在发送给服务器的请求中的字节形式就是: 0xE68891

  > 如果你使用的是可视化工具，比如navicat之类的，这些工具可能会使用自定义的字符集来编 码发送到服务器的字符串，而不采用操作系统默认的字符集(所以在学习的时候还是尽量用 命令行窗口)。

- 服务器接收到客户端发送来的请求其实是一串二进制的字节，它会认为这串字节采用的字符集是 character_set_client ，然后把这串字节转换为 character_set_connection 字符集编码的

  字符。

- 因为表 t 的列 col 采用的是 gbk 字符集，与 character_set_connection 一致，所以直接到列中找字节值为 0xCED2 的记录，最后找到了一条记录。

> 如果某个列使用的字符集和character_set_connection代表的字符集不一致的话，还需要进行 一次字符集转换。

- 上一步骤找到的记录中的 col 列其实是一个字节串 0xCED2 ， col 列是采用 gbk 进行编码的，所 以首先会将这个字节串使用 gbk 进行解码，得到字符串 '我' ，然后再把这个字符串使用 character_set_result代表的字符集，也就是 utf8 进行编码，得到了新的字节串:

  ，然后发送给客户端。

-  由于客户端是用的字符集是 utf8 ，所以可以顺利的将 0xE68891 解释成字符 我 ，从而显示到我 们的显示器上，所以我们人类也读懂了返回的结果。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220223213948mysql.png)

## 4. SQL大小写规范

### 1 Windows和Linux平台区别

在 SQL 中，关键字和函数名是不用区分字母大小写的，比如 SELECT、WHERE、ORDER、GROUP BY 等关键字，以及 ABS、MOD、ROUND、MAX 等函数名。

不过在 SQL 中，你还是要确定大小写的规范，因为在 Linux 和 Windows 环境下，你可能会遇到不同的大小写问题。 windows系统默认大小写不敏感 ，但是 linux系统是大小写敏感的 。

```sql
SHOW VARIABLES LIKE '%lower_case_table_names%'
```

- lower_case_table_names参数值的设置:
  - 默认为0，大小写敏感 。
  - 设置1，大小写不敏感。创建的表，数据库都是以小写形式存放在磁盘上，对于sql语句都是转 换为小写对表和数据库进行查找。
  - 设置2，创建的表和数据库依据语句上格式存放，凡是查找都是转换为小写进行。

> MySQL在Linux下数据库名、表名、列名、别名大小写规则是这样的:
>
> 1、数据库名、表名、表的别名、变量名是严格区分大小写的;
>
> 2、关键字、函数名称在 SQL 中不区分大小写;
>
> 3、列名(或字段名)与列的别名(或字段别名)在所有的情况下均是忽略大小写的;

**MySQL在Windows的环境下全部不区分大小写**

### 2 Linux下大小写规则设置

## 5sql_mode的合理设置

### 1.宽松模式 vs 严格模式

**宽松模式:**

如果设置的是宽松模式，那么我们在插入数据的时候，即便是给了一个错误的数据，也可能会被接受，并且不报错。

我在创建一个表时，该表中有一个字段为name，给name设置的字段类型时 char(10) ，如果我 在插入数据的时候，其中name这个字段对应的有一条数据的 长度超过了10 ，例如'1234567890abc'，超 过了设定的字段长度10，那么不会报错，并且取前10个字符存上，也就是说你这个数据被存为 了'1234567890'，而'abc'就没有了。但是，我们给的这条数据是错误的，因为超过了字段长度，但是并没 有报错，并且mysql自行处理并接受了，这就是宽松模式的效果。

应用场景 :通过设置sql mode为宽松模式，来保证大多数sql符合标准的sql语法，这样应用在不同数据 库之间进行 迁移 时，则不需要对业务sql 进行较大的修改。

**严格模式:**

出现上面宽松模式的错误，应该报错才对，所以MySQL5.7版本就将sql_mode默认值改为了严格模式。所 以在 生产等环境 中，我们必须采用的是严格模式，进而 开发、测试环境 的数据库也必须要设置，这样在 开发测试阶段就可以发现问题。并且我们即便是用的MySQL5.6，也应该自行将其改为严格模式。

开发经验 :MySQL等数据库总想把关于数据的所有操作都自己包揽下来，包括数据的校验，其实开发 中，我们应该在自己 开发的项目程序级别将这些校验给做了 ，虽然写项目的时候麻烦了一些步骤，但是这 样做之后，我们在进行数据库迁移或者在项目的迁移时，就会方便很多。

若设置模式中包含了  ，那么MySQL数据库不允许插入零日期，插入零日期会抛出错误而 不是警告。例如，表中含字段TIMESTAMP列(如果未声明为NULL或显示DEFAULT子句)将自动分配 DEFAULT '0000-00-00 00:00:00'(零时间戳)，这显然是不满足sql_mode中的NO_ZERO_DATE而报错。

### 2.模式查看和设置

```sql
select @@session.sql_mode 
select @@global.sql_mode
#或者
show variables like 'sql_mode';
```

- 临时设置方式:设置当前窗口中设置sql_mode

```sql
SET GLOBAL sql_mode = 'modes...'; #全局
SET SESSION sql_mode = 'modes...'; #当前会话
```

```sql
#改为严格模式。此方法只在当前会话中生效，关闭当前会话就不生效了。 
set SESSION sql_mode='STRICT_TRANS_TABLES';
```

```sql
 #改为严格模式。此方法在当前服务中生效，重启MySQL服务后失效。 
 set GLOBAL sql_mode='STRICT_TRANS_TABLES';
```

**永久设置方式:在/etc/my.cnf中配置sql_mode**

在my.cnf文件(windows系统是my.ini文件)，新增:

```sql
[mysqld]
sql_mode=ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR
_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
```

