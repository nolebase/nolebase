---
title: 19mysql逻辑架构
--- 

## 1. 逻辑架构剖析

### 1.1 服务器处理客户端请求

那服务器进程对客户端进程发送的请求做了什么处理，才能产生最后的处理结果呢?这里以查询请求为例展示:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220226204008mysql8.png)

简化为三层

- 1连接层：客户端和服务器端建立连接，客户端发送sql到服务器
- 2sql层（服务层）：对sql进行查询处理，与数据库文件的存储方式无关
- 存储引擎层：与数据库文件打角度，负责数据的存储和读取

## 2.sql执行流程

### 2.1mysql中的sql执行流程

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220226212458mysql.png)



- 1查询缓存。 8.0.抛弃了这个功能（缓存命中率比较低）

- 2. 解析器:在解析器中对 SQL 语句进行语法分析、语义分析。

     分析器先做“词法分析  ”。你输入的是由多个字符串和空格组成的一条 SQL 语句，MySQL 需要识别出里面 的字符串分别是什么，代表什么。 MySQL 从你输入的"select"这个关键字识别出来，这是一个查询语 句。它也要把字符串“T”识别成“表名 T”，把字符串“ID”识别成“列 ID”。分析器先做“ 词法分析 ”。你输入的是由多个字符串和空格组成的一条 SQL 语句，MySQL 需要识别出里面 的字符串分别是什么，代表什么。 MySQL 从你输入的"select"这个关键字识别出来，这是一个查询语 句。它也要把字符串“T”识别成“表名 T”，把字符串“ID”识别成“列 ID”。

     select department_id,job_id,avg(salary) from employees group by department_id;

     如果SQL语句正确，则会生成一个这样的语法树:

     ![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220226213042mysql.png)

- 3. 优化器:在优化器中会确定 SQL 语句的执行路径，比如是根据 全表检索 ，还是根据 索引检索 等。 

     举例:如下语句是执行两个表的 join:

     ```sql
      select * from test1 join test2 using(ID)
     where test1.name='zhangwei' and test2.name='mysql高级课程';
     ```

     方案1:可以先从表 test1 里面取出 name='zhangwei'的记录的 ID 值，再根据 ID 值关联到表 test2，再判 断 test2 里面 name的值是否等于 'mysql高级课程'。

     方案2:可以先从表 test2 里面取出 name='mysql高级课程' 的记录的 ID 值，再根据 ID 值关联到 test1， 再判断 test1 里面 name的值是否等于 zhangwei。

     这两种执行方法的逻辑结果是一样的，但是执行的效率会有不同，而优化器的作用就是决定选择使用哪一个方案。优化

     器阶段完成后，这个语句的执行方案就确定下来了，然后进入执行器阶段。

     **在查询优化器中，可以分为 逻辑查询 优化阶段和 物理查询 优化阶段。**

- 4. 执行器:

     截止到现在，还没有真正去读写真实的表，仅仅只是产出了一个执行计划。于是就进入了 执行器阶段 。

     在执行之前需要判断该用户是否 具备权限 。如果没有，就会返回权限错误。如果具备权限，就执行 SQL 查询并返回结果。在 MySQL8.0 以下的版本，如果设置了查询缓存，这时会将查询结果进行缓存。

     ```sql
     select * from test where id=1;
     ```

     比如:表 test 中，ID 字段没有索引，那么执行器的执行流程是这样的:

     调用 InnoDB 引擎接口取这个表的第一行，判断 ID 值是不是1，如果不是则跳过，如果是则将这行存在结果集中; 调用引擎接口取“下一行”，重复相同的判断逻辑，直到取到这个表的最后一行。

     执行器将上述遍历过程中所有满足条件的行组成的记录集作为结果集返回给客户端。

     **至此，这个语句就执行完成了。对于有索引的表，执行的逻辑也差不多。**

     SQL 语句在 MySQL 中的流程是: SQL语句→查询缓存→解析器→优化器→执行器 。

     ![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220226213344mysql8.png)

### 2.2 MySQL8中SQL执行原理

### 1. 确认profiling 是否开启

profiling:可以让mysql收集在sql执行时所使用的资源情况。

```sql
mysql> select @@profiling;
select @@session.profiling;
mysql> show variables like 'profiling';
```

profiling=0 代表关闭，我们需要把 profiling 打开，即设置为 1:

```sql
mysql> set profiling=1;
```

#### 2. 多次执行相同SQL查询

然后我们执行一个 SQL 查询(你可以执行任何一个 SQL 查询):

```sql
mysql> select * from employees;
```

#### 3. 查看profiles

查看当前会话所产生的所有 profiles:

```sql
mysql> show profiles; # 显示最近的几次查询
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227112826mysql.png)

#### 4. 查看profile

显示执行计划，查看程序的执行步骤:

```sql
  mysql> show profile;
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227112902mysql8.png)

当然你也可以查询指定的 Query ID，比如:

```sql
show profile for query 7;
```

查询 SQL 的执行时间结果和上面是一样的。

此外，还可以查询更丰富的内容:

```sql
mysql> show profile cpu,block io for query 6;
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227113017mysql8.png)

### 2.3 MySQL5.7中SQL执行原理

上述操作在MySQL5.7中测试，发现前后两次相同的sql语句，执行的查询过程仍然是相同的。不是会使用

缓存吗?这里我们需要 显式开启查询缓存模式 。在MySQL5.7中如下设置:

#### 1. 配置文件中开启查询缓存

在 /etc/my.cnf 中新增一行:

```
query_cache_type=1
```

### 2. 重启mysql服务

```
systemctl restart mysqld
```

### 3. 开启查询执行计划

由于重启过服务，需要重新执行如下指令，开启profiling。

```
set profiling=1;
```

#### 4. 执行语句两次:

```
mysql> select * from locations;
mysql> select * from locations;
```

#### 5. 查看profiles

#### 6. 查看profile

```
show profile for query 1;
```

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227113341mysql8.png" style="zoom:33%;" />

```
show profile for query 2;
```

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227113421mysql.png" style="zoom:50%;" />

### 2.4 SQL语法顺序

随着Mysql版本的更新换代，其优化器也在不断的升级，优化器会分析不同执行顺序产生的性能消耗不同而动态调整执行顺序。

查询每个部门年龄高于20岁的人数且高于20岁人数不能少于2人，显示人数最多的第一名部门信息 下面是经常出现的查询顺序:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227114026mysql.png)

### 2.5 Oracle中的SQL执行流程(了解)

Oracle 中采用了 共享池 来判断 SQL 语句是否存在缓存和执行计划，通过这一步骤我们可以知道应该采用硬解析还是软解析。

我们先来看下 SQL 在 Oracle 中的执行过程:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227114127mysql.png)

- 1.语法检查:检查 SQL 拼写是否正确，如果不正确，Oracle 会报语法错误。
- 2.语义检查:检查 SQL 中的访问对象是否存在。比如我们在写 SELECT 语句的时候，列名写错了，系统就会提示错误。语法检查和语义检查的作用是保证 SQL 语句没有错误。
- 3.权限检查: 看用户是否具备访问该数据的权限。
- 4.共享池检查:共享池(Shared Pool)是一块内存池，最主要的作用是缓存 SQL 语句和该语句的执行计划。Oracle 通过检查共享池是否存在 SQL 语句的执行计划，来判断进行软解析，还是硬解析。那软解析和硬解析又该怎么理解呢?
  - 在共享池中，Oracle 首先对 SQL 语句进行 Hash 运算 ，然后根据 Hash 值在库缓存(Library Cache)中查找，如果 存在 SQL 语句的执行计划 ，就直接拿来执行，直接进入“执行器”的环节，这就是 软解析 。
  - 如果没有找到 SQL 语句和执行计划，Oracle 就需要创建解析树进行解析，生成执行计划，进入“优化器”这个步骤，这就是 硬解析 。
- 5. 优化器:优化器中就是要进行硬解析，也就是决定怎么做，比如创建解析树，生成执行计划。
- 6. 执行器:当有了解析树和执行计划之后，就知道了 SQL 该怎么被执行，这样就可以在执行器中执行语句了。

## 3. 数据库缓冲池(buffer pool)

**innodb**存储引擎是以页为单位来管理存储空间的，我们进行的增删改查操作其实本质上都是在访问页面(包括读页面、写页面、创建新页面等操作)。而磁盘 I/O 需要消耗的时间很多，而在内存中进行操作，效率则会高很多，为了能让数据表或者索引中的数据随时被我们所用，DBMS 会申请**占用内存来作为数据缓冲池**，在真正访问页面之前，需要把在磁盘上的页缓存到内存中的**buffer pool** 之后才可以访 问。

这样做的好处是可以让磁盘活动最小化，从而**减少与磁盘直接进行i/o的时间。要知道，这种策略对提 升 SQL 语句的查询性能来说至关重要。如果索引的数据在缓冲池里，那么访问的成本就会降低很多。

### 3.1 缓冲池 vs 查询缓存

**缓冲池和查询缓存是一个东西吗?不是。**

#### 1. 缓冲池(Buffer Pool)

首先我们需要了解在 InnoDB 存储引擎中，缓冲池都包括了哪些。

在 InnoDB 存储引擎中有一部分数据会放到内存中，缓冲池则占了这部分内存的大部分，它用来存储各种 数据的缓存，如下图所示:

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227154731mysql.png)

从图中，你能看到 InnoDB 缓冲池包括了数据页、索引页、插入缓冲、锁信息、自适应 Hash 和数据字典 信息等。

**缓存池的重要性:**

**缓存原则:**

**位置 X 频次”这个原则，可以帮我们对 I/O 访问效率进行优化。**

首先，位置决定效率，提供缓冲池就是为了在内存中可以直接访问数据。

其次，频次决定优先级顺序。因为缓冲池的大小是有限的，比如磁盘有 200G，但是内存只有 16G，缓冲池大小只有 1G，就无法将所有数据都加载到缓冲池里，这时就涉及到优先级顺序，会**优先对使用频次高的热数据进行加载**

**缓冲池的预读特性:**

缓冲次的另一个特性**预读**

缓冲次的作业就是提升i/o效率，在读取数据时会存在一个局部性原理，使用了一些数据，**大概率还会使用它周围的一些数据**，因此采用**预读**的机制提前把数据进行加载。

#### 2. 查询缓存

查询缓存是提前把 查询结果缓存 起来，这样下次不需要执行就可以直接拿到结果。需要说明的是，在 MySQL 中的查询缓存，不是缓存查询计划，而是查询对应的结果。因为命中条件苛刻，而且只要数据表 发生变化，查询缓存就会失效，因此命中率低。（8.0没有了）

### 3.2 缓冲池如何读取数据

缓冲池管理器会尽量将经常使用的数据保存起来，在数据库进行页面读操作的时候，首先会判断该页面是否在缓冲池中，如果存在就直接读取，如果不存在，就会通过内存或磁盘将页面存放到缓冲池中再进行读取。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227155718mysql.png)

**如果我们执行 SQL 语句的时候更新了缓存池中的数据，那么这些数据会马上同步到磁盘上吗?**

当我们对数据库中的记录进行修改的时候，首先会修改缓冲池中页里的记录信息，然后数据库会**以一定的频率刷新**到磁盘。注意并不是每次发生更新操作，都会立刻进行磁盘会写。缓冲池会采用一种叫做**checkpoint的机制**将数据会写到磁盘上，从而提高数据库的整体性。

比如，当**缓冲池不够用**需要释放掉一些不常用的页，此时就可以强行采用checkpoint的方式，将不常有的脏页回写到磁盘上，然后再从缓冲池中将这些页释放，**脏页**，缓冲池中被秀改过的页，与磁盘上的数据页不一致。

### 3.3 查看/设置缓冲池的大小

如果你使用的是InnoDB存储引擎，可以通过查看 innodb_buffer_pool_size 变量来查看缓冲池的大 小。命令如下:

```sql
  show variables like 'innodb_buffer_pool_size';
```

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227155907mysql.png)

你能看到此时 InnoDB 的缓冲池大小只有 134217728/1024/1024=128MB。我们可以修改缓冲池大小，比如 改为256MB，方法如下:

```sql
set global innodb_buffer_pool_size = 268435456;
```

或者:

```
[server]
innodb_buffer_pool_size = 268435456
```

### 3.4 多个Buffer Pool实例

Buffer Pool的本质是innodb，向操作系统申请的一块**连续的内存空间**，在多线程的环境下，访问Buffer Pool中的数据都需要**加锁**处理，在Buffer Pool特别大而且多线程并发访问特别高的情况下，单一的Buffer Pool可能回影响请求的处理速度，所以在Buffer Pool特别大的时候，可以把它们**拆分成若干个小的Buffer Pool**，每个Buffer Pool都会为一个实例，他们都是独立的，独立的去申请内侧空间，独立的管理各种链表，所以在多线程并发访问时并不会相互影响。

```
 [server]
innodb_buffer_pool_instances = 2
```

这样就表明我们要创建2个 Buffer Pool 实例。

我们看下如何查看缓冲池的个数，使用命令:

```sql
show variables like 'innodb_buffer_pool_instances';
```

那每个 Buffer Pool 实例实际占多少内存空间呢?其实使用这个公式算出来的:

```
innodb_buffer_pool_size/innodb_buffer_pool_instances
```

也就是总共的大小除以实例的个数，结果就是每个 Buffer Pool 实例占用的大小。

不过也不是说Buffer Pool实例创建的越多越好，分别 管理各个Buffer Poo1也是需要性能开销 的，InnoDB规定：当
innodb buffer_poolLsize的值小于 1G的时候设置多个实例是无效的，InnoDB会默认把
innodb_buffer_poolinstances 的值修改为1。而我们鼓励在Buffer Pool大于或等于1G的时候设置多个Buffer Pool实
191.

### 3.5 引申问题

Buffer Pool是MySQL内存结构中十分核心的一个组成，你可以先把它想象成一个黑盒子。

黑盒下的更新数据流程

当我们查询数据的时候，会先去Butfer Pool中查询。如果Bufer Pool中不存在，存储引(擎会先将数据从磁盘加载到Buffer Pool中，然后将数据返回给客户端；同理，当我们更新某个数据的时候，如果这个数据不存在于Buffer Pool， 同样会先数据加载进来，然后修改修改内存的数据。被修改过的数据会在之后统一刷入磁盘。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/2022/02/20220227162345mysql.png)

我更新到一半突然发生错误了，想要回滚到更新之前的版本，该怎么办?连数据持久化的保证、事务回滚都做不到还谈什么崩溃恢复?

**答案:Redo Log & Undo Log**

