---
title: 第 14 章 MySQL事务日志
---

事务有 4 种特性：原子性、一致性、隔离性和持久性。那么事务的四种特性到底是基于什么机制实现呢?

- 事务的隔离性由 **锁机制** 实现。
- 而事务的原子性、一致性和持久性由事务的 redo 日志和 undo 日志来保证。
  - REDO LOG 称为 重做日志 ，提供再写入操作，恢复提交事务修改的页操作，用来保证事务的持久性。
  - UNDO LOG 称为 回滚日志 ，回滚行记录到某个特定版本，用来保证事务的原子性、一致性。

有的DBA或许会认为 UNDO 是 REDO 的逆过程，其实不然。REDO 和 UNDO 都可以视为是一种 **恢复操作**，但是：

- redo log：是存储引擎层 (innodb) 生成的日志，记录的是 **物理级别** 上的页修改操作，比如页号 xx 、偏移量 yy 写入了 `zzz` 数据。主要为了保证数据的可靠性；
- undo log：是存储引擎层 (innodb) 生成的日志，记录的是 **逻辑操作** 日志，比如对某一行数据进行了 `INSERT` 语句操作，那么 `undo log` 就记录一条与之相反的DELETE操作。主要用于事务的回滚(undo log)记录的是每个修改操作的近操作)和一致性非锁定读(undo log 回滚行记录到某种特定的版本--MVCC，即多版本并发控制)。

## 1. redo日志

InnoDB 存储引擎是以 **页为单位** 来管理存储空问的。在真正访问页面之前，需要把在 磁盘上的页缓存到内存中的Buffer Pool之后才可以访问。所有的变更都必须先 **更新缓冲池** 中的数据，然后缓冲池中的胜页会以一定的频率被刷入磁盘（checkPoint机制），通过缓冲池来优化CPU和磁盘之间的鸿沟，这样就可以保证整体的性能不会下降太快。

### 1.1 为什么需要REDO日志

一方面，缓冲池可以帮助我们消除CPU和磁盘之间的鸿沟，checkpoint机制可以保证数据的最终落盘，然 而由于checkpoint 并不是每次变更的时候就触发 的，而是master线程隔一段时间去处理的。所以最坏的情 况就是事务提交后，刚写完缓冲池，数据库宕机了，那么这段数据就是丢失的，无法恢复。

另一方面，事务包含 持久性 的特性，就是说对于一个已经提交的事务，在事务提交后即使系统发生了崩 溃，这个事务对数据库中所做的更改也不能丢失。

那么如何保证这个持久性呢? 一个简单的做法 :在事务提交完成之前把该事务所修改的所有页面都刷新 到磁盘，但是这个简单粗暴的做法有些问题

- 修改量于刷新磁盘工作量严重不成比例
- 随机I/O刷新比较慢

另一个解决的思路：我们只是想让已经提交了的事务对数据库中数据所做的修改永久生效，即使后来系统崩溃，在重启后也能把这种修改恢复出来。
所以我们其实没有必要在每次事务提交时，就把该事务在内存中修改过的全部页面刷新到磁盘，只需要把修改了哪些东西记录一下就好。
比如，某个事务将系统表空间中第10号页面中偏移量为 100 处的那个字节的值 1 改成 2 。
我们只需要记录一下:将第0号表 空间的10号页面的偏移量为 100 处的值更新为 2 。

InnoDB引擎的事务采用了WAL技术（Write-Ahead Logging）,这种技术的思想就是先写日志，再写磁盘，只有日志写入成功，才算事务提交成功，这里的日志就是redo log。
当发生宕机且数据未刷到磁盘的时候，可以通过redo log来恢复，保证ACID中的D,这就是redo log的作用。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220317201336mysql.png)


### 1.2 REDO日志的好处、特点

- 1. 好处

  - redo日志降低了刷盘频率
  - redo日志占用的空间非常小

- 2. 特点

  - redo日志是顺序写入磁盘的
  - 事务执行过程中，redo log不断记录

### 1.3 redo的组成

Redo log可以简单分为以下两个部分:

- 重做日志的缓冲 (redo log buffer) ，保存在内存中，是易失的。

参数设置:innodb_log_buffer_size:

redo log buffer 大小，默认 16M ，最大值是4096M，最小值为1M。

![image](https://user-images.githubusercontent.com/92929085/181438163-7b7df62e-b4f2-48b4-a5b2-6841a78fb39f.png)

```shell
mysql> show variables like '%innodb_log_buffer_size%';
```

重做日志文件 (redo log file) ，保存在硬盘中，是持久的。

### 1.4 redo的整体流程

以一个更新事务为例，redo log 流转过程，如下图所示:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220317202354mysql.png)

- 第1步:先将原始数据从磁盘中读入内存中来，修改数据的内存拷贝
- 第2步:生成一条重做日志并写入redo log buffer，记录的是数据被修改后的值
- 第3步:当事务commit时，将redo log buffer中的内容刷新到 redo log file，对 redo log file采用追加 写的方式
- 第4步:定期将内存中修改的数据刷新到磁盘中

Write-Ahead Log（预先日志持久化）：在持久化一个数据页之前，先将内存中相应的日志页持久化。

### 1.5 redo log的刷盘策略

redo log的写入并不是直接写入磁盘的，InnoDB引擎会在写redo log的时候先写redo log buffer，之后以 **一定的频率** 刷入到真正的redo log file 中。这里的一定频率怎么看待呢?这就是我们要说的刷盘策略。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220317203059mysql.png)

注意，redo log buffer刷盘到 redo log file 的过程并不是真正的刷到磁盘中去，只是刷入到 文件系统缓存 （page cache）中去（这是现代操作系统为了提高文件写入效率做的一个优化）。
真正的写入会交给系统自己来决定（比如page cache足够大了）。那么对于InnoDB来说就存在一个问题，如果交给系统来同 步，同样如果系统宕机，那么数据也丢失了(虽然整个系统宕机的概率还是比较小的)。

针对这种情况，InnoDB 给出 `innodb_flush_log_at_trx_commit` 参数，该参数控制 commit 提交事务 时，如何将 redo log buffer 中的日志刷新到 redo log file 中。
它支持三种策略:

- 设置为0：表示每次事务提交时不进行刷盘操作。(系统默认 master thread 每隔1s进行一次重做日志的同步)
- 设置为1：表示每次事务提交时都将进行同步，刷盘操作（默认值）。
- 设置为1：表示每次事务提交时都只把 redo log buffer 内容写入 page cache，不进行同步。由os自己决定什么时候同步到磁盘文件。

```sql
show variables like 'innodb_flush_log_at_trx_commit';
```

另外，InnoDB 存储引擎有一个后台线程，每隔1秒，就会把 `redo 1og buffer` 中的内容写到文件系统缓存（page cache），然后调用刷盘操作。



### 1.6 不同刷盘策略演示

1. 流程图

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220317204106mysql.png)

> innodb_flushllog_at_trx_commit=l
> 为1时，只要事务提交成功，redo1og 记录就一定在硬盘里，不会有任何数据丢失。
> 如果事务执行期间 MysQL挂了或宕机，这部分日志丢了，但是事务并没有提交，所以日志丢了也不会有损失。可以保证ACID的D，数据绝对不会丢失，但是效率最差的。
> 建议使用默认值，星然操作系统宕机的概率理论小于数据库宕机的概率，但是一般既然使用了事务，那么数据的安全相对来说更重要些。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220317204243mysql.png)

> innodb flush_log_at_trx_commit=2
> 为2时，只要事务提交成功，redo 1og buffer 中的内容只写入文件系统缓存（ page cache ）
> 如果仅仅只是 MysQL挂了不会有任何数据丢失，但是操作系统宏机可能会有7秒数据的丢失，这种情况下无法满足ACID中的D。但是数值2肯定是效率最高的。


![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220317204312.png)

> 结：innodb_flush_log_at_trx_commit=0
> 为日时，master thread中每1秒进行一次重做日志的isync操作，因此实例crash 最多丢失秒钟内的事务。
> (master thread是负责将缓冲池中的数据异步刷新到磁盘，保证数据的一致性）
> 数值。的话，是一种折中的做法，它的10效率理论是高于1的，低于2的，这种策略也有天失数据的风险，也无
> 法保证D。

**2. 举例**

```sql
#10-事务日志

USE atguigudb3;

CREATE TABLE test_load(
a INT,
b CHAR(80)
)ENGINE=INNODB;


#创建存储过程，用于向test_load中添加数据
DELIMITER//
CREATE PROCEDURE p_load(COUNT INT UNSIGNED)
BEGIN
DECLARE s INT UNSIGNED DEFAULT 1;
DECLARE c CHAR(80)DEFAULT REPEAT('a',80);
WHILE s<=COUNT DO
INSERT INTO test_load SELECT NULL,c;
COMMIT;
SET s=s+1;
END WHILE;
END //
DELIMITER;


#测试1：
#设置并查看：innodb_flush_log_at_trx_commit

SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';

#set GLOBAL innodb_flush_log_at_trx_commit = 1;

#调用存储过程
CALL p_load(30000); #1min 28sec
```

```sql
#测试2：
TRUNCATE TABLE test_load;

SELECT COUNT(*) FROM test_load;

SET GLOBAL innodb_flush_log_at_trx_commit = 0;

SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';

#调用存储过程
CALL p_load(30000); #37.945 sec
```



```sql
#测试3：
TRUNCATE TABLE test_load;

SELECT COUNT(*) FROM test_load;

SET GLOBAL innodb_flush_log_at_trx_commit = 2;

SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';

#调用存储过程
CALL p_load(30000); #45.173 sec
```



### 1.7 写入redo log buffer 过程

**1. 补充概念:Mini-Transaction**

MysQL把对底层页面中的一次原子访问的过程称之为一个 Mini-Transaction， 简称mtr比如，向某个索应的B+树中插入一条记录的过程就是一个Mini-Transaction个所谓的ntr可以包含一组redo日志，在进行崩溃恢复时这一组redo 日志作为一个不可分割的整体

一个事务可以包含若干条语句，每一条语句其实是由若干个 mtr 组成，每一个 mtr 又可以包含若干条redo日志，画个图表示它们的关系就是这样:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220317205841mysql.png)



**2. redo 日志写入log buffer**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220317210105.png)

### 1.8 redo log file

**1. 相关参数设置**

- innodb_log_group_home_dir :指定 redo log 文件组所在的路径，默认值为 ./ ，表示在数据库的数据目录下。MySQL的默认数据目录( var/lib/mysql )下默认有两个名为 ib_logfile0 和ib_logfile1 的文件，log buffer中的日志默认情况下就是刷新到这两个磁盘文件中。此redo日志文件位置还可以修改。
- innodb_log_files_in_group:指明redo log file的个数，命名方式如:ib_logfile0，iblogfile1... iblogfilen。默认2个，最大100个。

```sql
show variables like 'innodb_log_files_in_group';
```

- innodb_flush_log_at_trx_commit:控制 redo log 刷新到磁盘的策略，默认为1。
- innodb_log_file_size:单个 redo log 文件设置大小，默认值为 48M 。最大值为512G，注意最大值 指的是整个 redo log 系列文件之和，即(innodb_log_files_in_group * innodb_log_file_size )不能大 于最大值512G。
- 根据业务修改其大小，以便容纳较大的事务。编辑my.cnf文件并重启数据库生效，如下所示

**2. 日志文件组**

总共的redo日志文件大小其实就是: innodb_log_file_size × innodb_log_files_in_group 。 采用循环使用的方式向redo日志文件组里写数据的话，会导致后写入的redo日志覆盖掉前边写的redo日

志?当然!所以InnoDB的设计者提出了checkpoint的概念。

**3. checkpoint**

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220317211144.png" style="zoom:33%;" />

如果 write pos 追上 checkpoint ，表示日志文件组满了，这时候不能再写入新的 redo log记录，MySQL 得 停下来，清空一些记录，把 checkpoint 推进一下。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220317211217.png)

## 2. Undo日志

redo log是事务持久性的保证，undo log是事务原子性的保证。在事务中 更新数据 的 前置操作 其实是要先写入一个 undo log 。

### 2.1 如何理解Undo日志

事务需要保证 原子性 ，也就是事务中的操作要么全部完成，要么什么也不做。但有时候事务执行到一半 会出现一些情况，比如:

- 情况一:事务执行过程中可能遇到各种错误，比如 服务器本身的错误 ， 操作系统错误 ，甚至是突 然 断电 导致的错误。
- 情况二:程序员可以在事务执行过程中手动输入 ROLLBACK 语句结束当前事务的执行。

以上情况出现，我们需要把数据改回原先的样子，这个过程称之为 回滚 ，这样就可以造成一个假象:这 个事务看起来什么都没做，所以符合 原子性 要求。

### 2.2 Undo日志的作用

- 作用1:回滚数据

用户对undo日志可能 有误解：undo用于将数据库物理地恢复到执行语向 或事务之前的样子。但事实并非如此。
undo是 设弄日志，因此只是将数据库逻辑地恢复到原来的样子。所有修改都被逻辑地取消了，但是数据结构和页
本身在回滚之后可能大不相同。
这是因为在多用户并发系统中，可能会有数十、数百甚至数千个并发事务。数据库的主要任务就是协调对数据记
录的并发访问。比如，
个事务在修改当前一个页中某几条记录，同时还有别的事务在对同一个页中另几条记录
进行修改。因此，不能将一个页回滚到事务开始的样子，因为这样会影响其他事务正在进行的工作。

- 作用2:MVCC

undo的另一个作用是MVCC，即在InnoDB存储引1擎中MvcC的实现是通过undo来完成。当用户读取一行记录时，
若该记录已经被其他事务占用，当前事务可以通过undo读取之前的行板本信息，以l此实现非锁定读取。



### 2.3 undo的存储结构

**1. 回滚段与undo页**

InnoDB对undo log的管理采用段的方式，也就是回滚段  。每个回滚段记录了 1024个undo log segment，而在每个undo log segment段中进行  的申请。

- 在 InnoDB1.1版本之前 (不包括1.1版本)，只有一个rollback segment，因此支持同时在线的事务 限制为 1024 。虽然对绝大多数的应用来说都已经够用。
- 从1.1版本开始InnoDB支持最大 128个rollback segment ，故其支持同时在线的事务限制提高到 了 128*1024 。

```sql
mysql> show variables like 'innodb_undo_logs';
```

**2. 回滚段与事务**

- 1. 每个事务只会使用一个回滚段，一个回滚段在同一时刻可能会服务于多个事务。

- 2. 当一个事务开始的时候，会制定一个回滚段，在事务进行的过程中，当数据被修改时，原始的数据会被复制到回滚段。

- 3. 在回滚段中，事务会不断填充盘区，直到事务结束或所有的空间被用完。如果当前的盘区不够用，事务会在段中请求扩展下一个盘区，如果所有已分配的盘区都被用完，事务会覆盖最初的盘区或者在回滚段允许的情况下扩展新的盘区来使用。

- 4. 回滚段存在于undo表空间中，在数据库中可以存在多个undo表空间，但同一时刻只能使用一个undo表空间。

- 5. 当事务提交时，InnoDB存储引擎会做以下两件事情:

  - 将undo log放入列表中，以供之后的purge操作
  - 判断undo log所在的页是否可以重用，若可以分配给下个事务使用

**3. 回滚段中的数据分类**

-  未提交的回滚数据
- 已经提交但未过期的回滚数据
- 事物已经提交并过期的数据

### 2.4 undo的类型

在InnoDB存储引擎中，undo log分为:

- insert undo log
- update undo log

### 2.5 undo log的生命周期

**1. 简要生成过程**

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220318204559mysql.png)

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/03/20220318204631mysqk.png)

**2. 详细生成过程**

