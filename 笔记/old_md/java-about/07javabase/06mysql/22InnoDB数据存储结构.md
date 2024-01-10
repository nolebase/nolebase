---
title: 22 InnoDB数据存储结构
---

## 1.数据库的存储结构：页

索引结构给我们提供了高效的索引1方式，不过索引信息以及数据记录都是保存 在文件上的，确切说是存储在页结构中。另一方面，索引是在存储引擎中实现的，MysQL服务器上的**存储引擎**负责对表中数据的读取和气入工作。不同存储引!擎中 存放的格式一般是不同的，甚至有的存储引擎比如Memory都不用磁盘来存储数据。

由于 InnoDe 是MysQL的默认存储引擎，所以本章剖析InnoDB存储引擎的数据存储结构。

### 1.1 磁盘与内存交互基本单位:页

InnoDB 将数据划分为若干个页，InnoDB中页的大小默认为 16KB 。

以 页 作为磁盘和内存之间交互的 基本单位 ，也就是一次最少从磁盘中读取16KB的内容到内存中，一次 最少把内存中的16KB内容刷新到磁盘中**也就是说， 在数据库中，不论读一行，还是读多行，都是将这 些行所在的页进行加载。也就是说，数据库管理存储空间的基本单位是页(Page)，数据库 I/O 操作的 最小单位是页。** 一个页中可以存储多个行记录。

> 记录是按照行来存储的，但是数据库的读取并不以行为单位，否则一次读取(也就是一次 I/O 操 作)只能处理一行数据，效率会非常低。

### 1.2 页结构概述

页a、页b、页c ... 页n 这些页可以**不在物理结构上相连** ，只要通过**双向链表**相关联即可。每个数据页中 的记录会按照主键值从小到大的顺序组成一个**单向链表**  ，每个数据页都会为存储在它里边的记录生成一 个**页目录**，在通过主键查找某条记录的时候可以在页目录中**使用二分法**快速定位到对应的槽，然后再遍 历该槽对应分组中的记录即可快速找到指定的记录。

### 1.3 页的大小

不同的数据库管理系统(简称DBMS )的页大小不同。比如在 MySQL 的 InnoDB 存储引擎中，默认页的大小是 16KB ，我们可以通过下面的命令来进行查看:

```sql
show variables like '%innodb_page_size%';
```

SQL Server 中页的大小为 8KB ，而在 Oracle 中我们用术语“ 块 ”(Block)来代表“页”，Oralce 支持的块 大小为 2KB，4KB，8KB，16KB，32KB 和 64KB。

### 1.4 页的上层结构

另外在数据库中，还存在着区(Extent)、段(Segment)和表空间(Tablespace)的概念。行、页、区、段、表空间的关系如下图所示:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303170951mysql.png)

区 (Extent）是比页大一级的存储结构，在 InnoDB 存储引(擎中，—个区会分配** 64个连续的页**。因为 InnoDB 中
的页大小默认是 16KB，所以一个区的大小是 64*16KB= 1MB。

段(Segment） 由一个或多个区组成，区在文件系统是一个连续分配的空间（在InnoDB 中是连续的 64 个页），不过在段中不要求区与区之间是相邻的。**段是数据库中的分配单位， 不同类型的数据库对象以不同的段形式存在。**当我们创建数据表、索引的时候，就会相应创建对应的段，比如创建一张表时会创建一个表段，创建—个索引时会创建—个索引段
表空间 (Tablespace）是你   个逻辑容器，表空间存储的对象是段，在一个表空间中可以有一个或多个段，但是一个段只能属于—个表空间。数据库由一个或多个表空同组成，表空同从管理上可以划分为**系统表空间 用户表空间、撤销衣室间、临时表空间等**

## 2. 页的内部结构

页如果按类型划分的话，常见的有**数据页(保存 B+ 树节点) 、 系统页 、 Undo 页 和 事务数据页**等。

数据页是我们最常使用的页。

数据页的 16KB 大小的存储空间被划分为七个部分，分别是文件头(File Header)、页头(Page Header)、最大最小记录(Infimum+supremum)、用户记录(User Records)、空闲空间(Free Space)、页目录(Page Directory)和文件尾(File Tailer)。

页结构的示意图如下所示:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303171114mysql.png)

这 7 个部分作用分别如下，我们简单梳理如下表所示:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303171150mysql.png)

我们可以把这了个结构分成3个部分。
#### 第1部分：File Header（文件头部）和 File Trailer（文件尾部）
首先是 **文件通用部分 ，也就是 文件头和文件尾。**
①文件头部信息
不同类型的页都会以File Header 作为第一个组成部分，它描述了一些针对各种页都通用的一些信息，比方说这个页的编号是多少，它的上一个页、下一个页是谁等，所有的数据页会组成一个双链表。这个部分占用固定的38个字节，由以下内容组成

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303174524mysql.png)

**Fil_page_offset 4个字节**

每一个·页的单独页号，innodb通过页号唯一定位一个页

**fil_page_type**2字节

当前页的类型

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303173934mysql.png)

**fil_page_prev4字节和fil_page_next**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303175013mysql.png)

**fil_page_space_or_chksum4字节**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303175122mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303175436mysql.png)

**fi l_page_lsn**8字节，日志序列位置（Log Sequence Number）

页最后被修改时的日志序列位置

**和File Trailer（文件尾部）** 4个字节

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303180107mysql.png)

**第二部分**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303180216mysql.png)

- free space 空闲空间

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303180421mysql.png)

- User records 用户记录

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303180448mysql.png)

**记录头信息**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303180854mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303181100mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303181128mysql.png)



![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303181157mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303181228mysql.png)

​	1delete_mask

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303181432mysql.png)

2min_rec_mask

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303181621mysql.png)

3record_type

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303181833mysql.png)

4heap_no

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303181906mysql.png)

5n_owned

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303182449mysql.png)

6next_record

​		删除

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303182637mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303183035mysql.png)

**新增**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303183117mysql.png)

**Page Directory页目录**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303183401mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303183824mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303184053mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303184134mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/2022030318420mysqlpng)


- Infimum + Supremum 最小最大记录

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303182213mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303182415mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303184230mysql.png)**页目录中分组的个数如何确定**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303184329mysql.png)

**页目录结构下如何快速查找记录**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303184733mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303184803mysql.png)

**Page Header（页面头部）**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/2022030318513mysql1.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303185847mysql.png)



page—direction

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303185618mysql.png)

Page_n_direction

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303185809mysql.png)



### 2.3 从数据页的角度看B+树如何查询

一颗B+树按照节点类型可以分成两个部分

- 叶子结点，B+树最底层的节点，节点高度为0，存储记录
- 非叶子节点，节点高度大于0，存储索引键和页面指针，并不存储记录行为。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303190311mysql.png)

当我们从页结构来理解 B+树的结构的时候，可以帮我们理解一些通过索引进行检索的原理：

**1.B+树是如何进行记录检索的？**
如果通过 B+树的索号1查询行记录，首先是从 B+树的根开始，逐层检索，直到找到叶子节点，也就是找到对应的数据页为上，将数据页加载到内存中，页目录中的槽(slot)采用二分查找 的方式先找到一个粗略的记录分组，然后再在分组中通过 链表遍历 的方式查找记录。

**2.普通索引!和唯一索引在查询效率上有什么不同？**
我们创建索 的时候可以是普通索引，也可以是唯一秦引1，那么这两个索号!在查询效率上有什么不同呢？
唯一索号就是在普通索引上增加了约束性，也就是关键字唯一，找到了关键字就停止检索。而昔通索引，可能会
存在用户记录中的关键宇相司的情况，根据页结构的原理，当我们读取一条记录的时候，不是单独将这条记录从
磁盘中读出去，而是将这个记录所在的页加载到内存中进行读取。InnODB 存储子!擎的页大小为16KB，在一个页
中可能存储着上干个记录，因此在普通索引的宁段上进行查找也就是在内存中多几次‹判断下一条记录的操作
对于 cpu 来说，这些操作所消耗的时间是可以忽略不计的。所以对一个素号!字段进行检索， 采用普通索引/还是唯
—索后1在检索效率上基本上没有差别。

## 3. InnoDB行格式(或记录格式)

我们平时的数据以行为单位来向表中插入数据，这些记录在磁盘上的存放方式也被称为行格式 或者 记录格式。InnoDB存储引擎设计了4种不同类型的 行格式 ，分别是 Compact 、Redundant 、Dynamic和Compressed行格式。查看MySQL8的默认行格式:

```sql
SELECT @@innodb_default_row_format;
dynamic    
```

也可以使用如下语法查看具体表使用的行格式:

```
SHOW TABLE STATUS like '表名'\G
```



![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303190746mysql.png)

### 1.Compact 格式

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303191456mysql.png)

**变长字段长度列表**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303191701mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303192105mysql.png)

**NULL值列表**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303200757mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303201017mysql.png)

**记录头信息**

**记录的真实数据**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303201134mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303201519mysql.png)

### 2Dynamic和Compressed 格式

**行溢出**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303202857mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303203756mysql.png)

![     ](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303203953mysql.png)

**Dynamic和Compressed行格式**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303204215mysql.png)

### 3Redundant

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303204440mysql.png)

**字段长度偏移列表**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220303204649.png)



**记录头信息**

## 4. 区、段与碎片区

### 4.1 为什么要有区?

B+ 树的每一层中的页都会形成一个双向链表，如果是以 页为单位 来分配存储空间的话，双向链表相邻 的两个页之间的 物理位置可能离得非常远 。我们介绍B+树索引的适用场景的时候特别提到范围查询只需 要定位到最左边的记录和最右边的记录，然后沿着双向链表一直扫描就可以了，而如果链表中相邻的两 个页物理位置离得非常远，就是所谓的 随机I/O 。再一次强调，磁盘的速度和内存的速度差了好几个数 量级， 随机I/O是非常慢 的，所以我们应该尽量让链表中相邻的页的物理位置也相邻，这样进行范围查 询的时候才可以使用所谓的 顺序I/O 。

引入 区 的概念，一个区就是在物理位置上连续的 64个页 。因为 InnoDB 中的页大小默认是 16KB，所以 一个区的大小是 64*16KB= 1MB 。在表中  的时候，为某个索引分配空间的时候就不再按照页为 单位分配了，而是按照  ，甚至在表中的数据特别多的时候，可以一次性分配多个连续的 区。虽然可能造成  (数据不足以填充满整个区)，但是从性能角度看，可以消除很多 的随机I/O， !

### 4.2 为什么要有段?

对于范围查询，其实是对B+树叶子节点中的记录进行顺序扫描，而如果不区分叶子节点和非叶子节点， 统统把节点代表的页面放到申请到的区中的话，进行范围扫描的效果就大打折扣了。所以 InnoDB 对 B+ 树的 叶子节点 和 非叶子节点 进行了区别对待，也就是说叶子节点有自己独有的区，非叶子节点也有自己 独有的区。存放叶子节点的区的集合就算是一个 段 ( )，存放非叶子节点的区的集合也算是 一个段。也就是说一个索引会生成2个段，一个 ，一个 非叶子节点段 。

除了索引的叶子节点段和非叶子节点段之外，InnoDB中还有为存储一些特殊的数据而定义的段，比如回 滚段。所以，常见的段有 数据段 、 索引段 、 回滚段 。数据段即为B+树的叶子节点，索引段即为B+树的 非叶子节点。

在InnoDB存储引擎中，对段的管理都是由引擎自身所完成，DBA不能也没有必要对其进行控制。这从一 定程度上简化了DBA对于段的管理。

段其实不对应表空间中某一个连续的物理区域，而是一个逻辑上的概念，由若干个零散的页面以及一些

完整的区组成

### 4.3 为什么要有碎片区?

默认情况下，一个使用InnoDB存储引擎的表只有一个聚簇索引，一个索引会生成2个段，而段是以区为单 位申请存储空间的，一个区默认占用1M(64 * 16Kb = 1024Kb)存储空间，所以默认情况下一个只存了几 条记录的小表也需要2M的存储空间么? 以后每次添加一个索引都要多申请2M的存储空间么?这对于存储 记录比较少的表简直是天大的浪费。这个问题的症结在于到现在为止我们介绍的区都是非常 纯粹 的，也 就是一个区被整个分配给某一个段，或者说区中的所有页面都是为了存储同一个段的数据而存在的，即 使段的数据填不满区中所有的页面，那余下的页面也不能挪作他用。

为了考虑以完整的区为单位分配给某个段对于 数据量较小 的表太浪费存储空间的这种情况，InnoDB提出 了一个 碎片(fragment)区 的概念。在一个碎片区中，并不是所有的页都是为了存储同一个段的数据 而存在的，而是碎片区中的页可以用于不同的目的，比如有些页用于段A，有些页用于段B，有些页甚至 哪个段都不属于。 碎片区直属于表空间 ，并不属于任何一个段。

所以此后为某个段分配存储空问的策略是这样的：

- 在刚开始向表中插入数据的时候，段是从某个碎片区以单个页面为单位来分配存储空间的。

- 当某个段已经占用了 32个碎片区 页面之后，就会申请以完整的区为单位来分配存储空间。I

所以现在段不能仅定义为是某些区的集合，更精确的应该是 菜些零散的页面以及一些完整的区 的集合。

### 4.4 区的分类

区大体上可以分为4种类型

-  空闲的区（FREE）   :现在还没有用到这个区中的任何页面。
-  有剩余空间的碎片区（FREE——frag）：表示碎片区中还有可用的页面。
- 没有剩余空间的碎片区（full_frag）:表示碎片区中的所有页面都被使用，没有空闲页面。
- 附属于某个段的区（SFEG）：每一个索引都可以分为叶子节点段和非叶子节点段。

处于 FREE 、 FREE_FRAG 以及 FULL_FRAG 这三种状态的区都是独立的，直属于表空间。而处于 FSEG 状态的区是附属于某个段的。

> 如果把表空间比作是一个集团军，段就相当于师，区就相当于团。一般的团都是隶属于某个师的， 就像是处于 FSEG 的区全都隶属于某个段，而处于 FREE 、 FREE_FRAG 以及 FULL_FRAG 这三种状 态的区却直接隶属于表空间，就像独立团直接听命于军部一样。

## 5. 表空间

表空间可以看做是InnoDB存储引擎逻辑结构的最高层，所有的数据都存放在表空间中。

表空间是一个`逻辑容器` ，表空间存储的对象是段，在一个表空间中可以有一个或多个段，但是一个段只 能属于一个表空间。表空间数据库由一个或多个表空间组成，表空间从管理上可以划分为 系统表空间 (System tablespace)、 独立表空间 (File-per-table tablespace)、 撤销表空间 (Undo Tablespace)和临时表空间 (Temporary Tablespace)等。

### 5.1 独立表空间

