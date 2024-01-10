---
title: 01数据库概述
---

## 1.数据库与数据库管理系统

## 数据库的相关概念

- DB**：数据库（**Database）

  - 即存储数据的“仓库”，其本质是一个文件系统。它保存了一系列有组织的数据。

- DBMS：数据库管理系统（Database Management System）

  - 是一种操纵和管理数据库的大型软件，用于建立、使用和维护数据库，对数据库进行统一管理和控

    制。用户通过数据库管理系统访问数据库中表内的数据。

- SQL：结构化查询语言（Structured Query Language）

  - 专门用来与数据库通信的语言。

### 2.常见的数据库管理系统

[https://db-engines.com/en/ranking](https://db-engines.com/en/ranking)

## 3.MySQL介绍

### 1.概述

- MySQL是一个 开放源代码的关系型数据库管理系统 ，由瑞典MySQL AB（创始人Michael Widenius）公 

  司1995年开发，迅速成为开源数据库的 No.1。 

- 2008被 Sun 收购（10亿美金），2009年Sun被 Oracle 收购。 MariaDB 应运而生。（MySQL 的创

  造者担心 MySQL 有闭源的风险，因此创建了 MySQL 的分支项目 MariaDB） 

- MySQL6.x 版本之后分为 社区版 和 商业版 。

- MySQL是一种关联数据库管理系统，将数据保存在不同的表中，而不是将所有数据放在一个大仓库

  内，这样就增加了速度并提高了灵活性。

- MySQL是可以定制的，采用了 GPL（GNU General Public License） 协议，你可以修改源码来

  开发自己的MySQL系统。

- MySQL支持大型的数据库。可以处理拥有上千万条记录的大型数据库。

- MySQL支持大型数据库，支持5000万条记录的数据仓库，32位系统表文件最大可支持 4GB ，64位系

  统支持最大的表文件为 8TB 。

- MySQL使用 标准的SQL数据语言 形式。

- MySQL可以允许运行于多个系统上，并且支持多种语言。这些编程语言包括C、C++、Python、 

  Java、Perl、PHP和Ruby等。

### 2. **关于**MySQL 8.0 

**MySQL从5.7版本直接跳跃发布了8.0版本 **，可见这是一个令人兴奋的里程碑版本。MySQL 8版本在功能上

做了显著的改进与增强，开发者对MySQL的源代码进行了重构，最突出的一点是多MySQL Optimizer优化

器进行了改进。不仅在速度上得到了改善，还为用户带来了更好的性能和更棒的体验。

## 4. RDBMS **与 非**RDBMS

​	从排名中我们能看出来，关系型数据库绝对是 DBMS 的主流，其中使用最多的 DBMS 分别是 Oracle、 MySQL 和 SQL Server。这些都是关系型数据库（RDBMS）。

### 1. **关系型数据库**(RDBMS) 

#### **实质**

- 这种类型的数据库是 最古老 的数据库类型，关系型数据库模型是把复杂的数据结构归结为简单的**二元关系** （即二维表格形式）。
- 关系型数据库以**行(row)** 和**列(column)**的形式存储数据，以便于用户理解。这一系列的行和列被称为**表(table)**，一组表组成了一个库(database)。
- 表与表之间的数据记录有关系(relationship)。现实世界中的各种实体以及实体之间的各种联系均用**关系模型**来表示。关系型数据库，就是建立在**关系模型**基础上的数据库。
- SQL 就是关系型数据库的查询语言。

#### **优势**

- **复杂查询** 可以用SQL语句方便的在一个表以及多个表之间做非常复杂的数据查询
- **事务支持** 使得对于安全性能很高的数据访问要求得以实现。

### 2.**非关系型数据库**(**非**RDBMS)

	#### **介绍**

​	**非关系型数据库**，可看成传统关系型数据库的功能 阉割版本 ，基于键值对存储数据，不需要经过SQL层的解析， 性能非常高 。同时，通过减少不常用的功能，进一步提高性能。

目前基本上大部分主流的非关系型数据库都是免费的。

#### **有哪些非关系型数据库**

​	相比于 SQL，NoSQL 泛指非关系型数据库，包括了榜单上的键值型数据库、文档型数据库、搜索引擎和列存储等，除此以外还包括图形数据库。也只有用 NoSQL 一词才能将这些技术囊括进来。

**键值型数据库**

​	键值型数据库通过 Key-Value 键值的方式来存储数据，其中 Key 和 Value 可以是简单的对象，也可以是复杂的对象。Key 作为唯一的标识符，优点是查找速度快，在这方面明显优于关系型数据库，缺点是无法像关系型数据库一样使用条件过滤（比如 WHERE），如果你不知道去哪里找数据，就要遍历所有的键，这就会消耗大量的计算。

键值型数据库典型的使用场景是作为**内存缓存** 。 Redis 是最流行的键值型数据库。

**文档型数据库**

​	此类数据库可存放并获取文档，可以是XML、JSON等格式。在数据库中文档作为处理信息的基本单位，一个文档就相当于一条记录。文档数据库所存放的文档，就相当于键值数据库所存放的“值”。MongoDB是最流行的文档型数据库。此外，还有CouchDB等。

**搜索引擎数据库**

​	虽然关系型数据库采用了索引提升检索效率，但是针对全文索引效率却较低。搜索引擎数据库是应用在搜索引擎领域的数据存储形式，由于搜索引擎会爬取大量的数据，并以特定的格式进行存储，这样在检索的时候才能保证性能最优。核心原理是“倒排索引”。

典型产品：Solr、Elasticsearch、Splunk 等。

**列式数据库**

列式数据库是相对于行式存储的数据库，Oracle、MySQL、SQL Server 等数据库都是采用的行式存储（Row-based），而列式数据库是将数据按照列存储到数据库中，这样做的好处是可以大量降低系统的I/O，适合于分布式文件系统，不足在于功能相对有限。典型产品：HBase等。

**图形数据库**

​	图形数据库，利用了图这种数据结构存储了实体（对象）之间的关系。图形数据库最典型的例子就是社交网络中人与人的关系，数据模型主要是以节点和边（关系）来实现，特点在于能高效地解决复杂的关系问题。

​	图形数据库顾名思义，就是一种存储图形关系的数据库。它利用了图这种数据结构存储了实体（对象）之间的关系。关系型数据用于存储明确关系的数据，但对于复杂关系的数据存储却有些力不从心。如社交网络中人物之间的关系，如果用关系型数据库则非常复杂，用图形数据库将非常简单。典型产品：Neo4J、InfoGrid等。

####  NoSQL**的演变**

由于 SQL 一直称霸 DBMS，因此许多人在思考是否有一种数据库技术能远离 SQL，于是 NoSQL 诞生了，但是随着发展却发现越来越离不开 SQL。到目前为止 NoSQL 阵营中的 DBMS 都会有实现类似 SQL 的功能。



## 5.**关系型数据库设计规则**

- 关系型数据库的典型数据结构就是**数据表**，这些数据表的组成都是结构化的（Structured）。
- 将数据放到表中，表再放到库中。
- 一个数据库中可以有多个表，每个表都有一个名字，用来标识自己。表名具有唯一性。
- 表具有一些特性，这些特性定义了数据在表中如何存储，类似Java和Python中 “类”的设计。

### 1. **表、记录、字段** 

- E-R（entity-relationship，实体-联系）模型中有三个主要概念是`实体集` 、`属性`、` 联系集` 。
- 一个实体集（class）对应于数据库中的一个表（table），一个实体（instance）则对应于数据库表中的一行（row），也称为一条记录（record）。一个属性（attribute）对应于数据库表中的一列（column），也称为一个字段（field）。
 ![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220124230236mysql.png)


```
ORM思想 (Object Relational Mapping)体现: 
数据库中的一个表 <---> Java或Python中的一个类 
表中的一条数据 <---> 类中的一个对象(或实体)
表中的一个列 <----> 类中的一个字段、属性(field
```

### 2.表的关联关系

- 表与表之间的数据记录有关系(relationship)。现实世界中的各种实体以及实体之间的各种联系均用 关系模型来表示。
- 四种:一对一关联、一对多关联、多对多关联、自我引用

#### 一对一关联(one-to-one)

- 在实际的开发中应用不多，因为一对一可以创建成一张表
- 两种建表原则:
  - 外键唯一:主表的主键和从表的外键(唯一)，形成主外键关系，外键唯一。
  - 外键是主键:主表的主键和从表的主键，形成主外键关系。

#### 一对多关系(one-to-many)

- 常见实例场景: 客户表和订单表 ， 分类表和商品表 ， 部门表和员工表 。
- 一对多建表原则:在从表(多方)创建一个字段，字段作为外键指向主表(一方)的主键
- <img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220125201834mysql.png" style="zoom:50%;" />

#### 多对多（many-to-many）

​		要表示多对多关系，必须创建第三个表，该表通常称为	联接表	，它将多对多关系划分为两个一对多关系。将这两个表的主键都插入到第三个表中。

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220125201959mysql.png" style="zoom:50%;" />

#### 自我引用(Self reference)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220125202207mysql.png)



## 6.环境准备

[mysql官网](https://www.mysql.com/)

## docker 安装mysql8

```
docker pull mysql:8.0.28

docker run --name my-mysql -p 3307:3306  -v /Users/lxc/Desktop/app/docker/mysql8/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:8.0.28
```

### MySQL的版本

- MySQL Community Server 社区版本，开源免费，自由下载，但不提供官方技术支持，适用于 大多数普通用户。
- MySQL Enterprise Edition 企业版本，需付费，不能在线下载，可以试用30天。提供了更多的 功能和更完备的技术支持，更适合于对数据库的功能和可靠性要求较高的企业客户。
- MySQL Cluster 集群版，开源免费。用于架设集群服务器，可将几个MySQL Server封装成一个 Server。需要在社区版或企业版的基础上使用。
- MySQL Cluster CGE 高级集群版，需付费。

### 登陆命令

**启动mysql服务**

**修改密码**

```
mysql -h 主机名 -P 端口号 -u 用户名 -p密码
mysql -h localhost -P 3306 -u root -pabc123 # 这里我设置的root用户的密码是abc123
```

`-p与密码之间不能有空格，其他参数名与参数值之间可以有空格也可以没有空格。如:`

```
mysql -hlocalhost -P3306 -uroot -pabc123
```

`密码建议在下一行输入，保证安全`

```
mysql -h localhost -P 3306 -u root -p
Enter password:****
```

`客户端和服务器在同一台机器上，所以输入localhost或者IP地址127.0.0.1。同时，因为是连接本 机: -hlocalhost就可以省略，如果端口号没有修改:-P3306也可以省略`

```
mysql -u root -p
Enter password:****
```

**版本**

```
mysql -V
mysql --version
```

`或 登录 后，通过以下方式查看当前版本信息`

```
mysql> select version();
```



## 7.MySQL演示使用

### 1. MySQL的使用演示

`查看所有的数据库`

```
show databases;
```

```
“information_schema”是 MySQL 系统自带的数据库，主要保存 MySQL 数据库服务器的系统信息， 比如数据库的名称、数据表的名称、字段名称、存取权限、数据文件 所在的文件夹和系统使用的 文件夹，等等
“performance_schema”是 MySQL 系统自带的数据库，可以用来监控 MySQL 的各类性能指标。 
“sys”数据库是 MySQL 系统自带的数据库，主要作用是以一种更容易被理解的方式展示 MySQL 数据库服务器的各类性能指标，帮助系统管理员和开发人员监控 MySQL 的技术性能。
“mysql”数据库保存了 MySQL 数据库服务器运行时需要的系统信息，比如数据文件夹、当前使用的 字符集、约束检查信息，等等
```



`2创建自己的数据库`

```sql
create database 数据库名;

-- 创建atguigudb数据库，该名称不能与已经存在的数据库重名。 

create database atguigudb;
```

`3使用自己的数据库`

```sql
se 数据库名;
--使用atguigudb数据库 
use atguigudb;
```

说明:如果没有使用use语句，后面针对数据库的操作也没有加“数据名”的限定，那么会报“ERROR 1046 (3D000): No database selected”(没有选择数据库)

使用完use语句之后，如果接下来的SQL都是针对一个数据库操作的，那就不用重复use了，如果要针对另 一个数据库操作，那么要重新use。

`4、查看某个库的所有表格`

```sql
show tables from 数据库名;
```

`5、创建新的表格`

```sql
create table 表名称( 
  字段名 数据类型,
	字段名 数据类型
);
```

说明:如果是最后一个字段，后面就用加逗号，因为逗号的作用是分割每个字段。

```sql
-- 创建学生表
create table student(
  id int,
  name varchar(20) --说名字最长不超过20个字符
);
```

`6、查看一个表的数据`

```sql
select * from 数据库表名称;

```

`7、添加一条记录`

```sql
insert into 表名称 values(值列表);

-- 添加两条记录到student表中
insert into student values(1,'张三'); 
insert into student values(2,'李四');
```

**字符集的问题。**

`8、查看表的创建信息`

```sql
show create table 表名称\G
-- 查看student表的详细创建信息 
show create table student\G
```

`9、查看数据库的创建信息`

```sql
show create database 数据库名\G
-- 查看atguigudb数据库的详细创建信息 
show create database atguigudb\G
```

`10、删除表格`

```sql
drop table 表名称;
 --删除学生表
drop table student;
```

`11、删除数据库`

```
drop database 数据库名;
 #删除atguigudb数据库
drop database atguigudb;
```



### 2.MySQL的编码设置

**MySQL5.7中**

步骤1:查看编码命令

```
 show variables like 'character_%';
show variables like 'collation_%';
```

步骤2:修改mysql的数据目录下的my.ini配置文件

```
default-character-set=utf8 #默认字符集
[mysqld] # 大概在76行左右，在其下添加 ...
character-set-server=utf8 collation-server=utf8_general_ci
```

`注意:建议修改配置文件使用notepad++等高级文本编辑器，使用记事本等软件打开修改后可能会 导致文件编码修改为“含BOM头”的编码，从而服务重启失败。`

步骤3:重启服务

步骤4:查看编码命令

MySQL8.0中

在MySQL 8.0版本之前，默认字符集为latin1，utf8字符集指向的是utf8mb3。网站开发人员在数据库设计 的时候往往会将编码修改为utf8字符集。如果遗忘修改默认的编码，就会出现乱码的问题。从MySQL 8.0 开始，数据库的默认编码改为 utf8mb4 ，从而避免了上述的乱码问题。







