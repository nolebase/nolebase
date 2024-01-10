---
title: 分组计算
author: mophia
---

# 分组计算

> 参考文献： 知乎 @易执 https://zhuanlan.zhihu.com/p/101284491

在数据分析中，经常需要将数据根据某个（多个）字段划分为不同的群体（group）进行分析。
在Pandas中，上述的数据处理操作主要运用 `groupby` 完成，这篇文章就介绍一下 `groupby` 的基本原理及对应的 `agg`、`transform` 和`apply` 操作。

比如，生成一组 10人的员工信息。

```py
import pandas as pd
import numpy as np

company=["A", "B", "C"]

df = pd.DataFrame(
  {
  "company": [company[x] for x in np.random.randint(0, len(company), 10)],
  "salary": np.random.randint(5, 50, 10),
  "age": np.random.randint(15, 50, 10)
  }
)

df
"""
>>
  company  salary  age
0       A      41   25
1       C      21   37
2       A      16   49
3       B      41   46
4       C      44   39
5       B      22   17
6       A      11   30
7       A       8   35
8       C      18   39
9       C      19   36
"""
```

## 一、Group By 分组的基本原理

我们可以把员工信息按照公司进行分组，然后用列表 list 来列示。

```py
group = df.groupby("company")

group = df.groupby("company", as_index=False) # 不把列索引合并到行索引中，推荐

list(group)

"""
[('A',
    company  salary  age
  0       A      41   25
  2       A      16   49
  6       A      11   30
  7       A       8   35),
 ('B',
    company  salary  age
  3       B      41   46
  5       B      22   17),
 ('C',
    company  salary  age
  1       C      21   37
  4       C      44   39
  8       C      18   39
  9       C      19   36)]
"""
```

转换成列表的形式后，可以看到，列表由三个元组组成，
每个元组中，第一个元素是组别（这里是按照company进行分组，所以最后分为了A,B,C），
第二个元素的是对应组别下的DataFrame，整个过程可以图解如下：

![](https://pic2.zhimg.com/80/v2-c619d636a34458a51b375b0ad2cbf7c5_720w.jpg)

总结来说，`groupby` 的过程就是将原有的 `DataFrame` 按照 `groupby` 的字段（这里是company），划分为若干个分组DataFrame，被分为多少个组就有多少个分组DataFrame。

所以说，在 `groupby` 之后的一系列操作（如 `agg` 、`apply` 等），均是基于子 `DataFrame` 的操作。理解了这点，也就基本摸清了 `Pandas` 中 `groupby` 操作的主要原理。下面来讲讲 `groupby` 之后的常见操作。

## 二、agg 聚合操作
聚合操作是groupby后非常常见的操作，会写SQL的朋友对此应该是非常熟悉了。聚合操作可以用来求和、均值、最大值、最小值等，下面的表格列出了Pandas中常见的聚合操作。

![](https://pic2.zhimg.com/80/v2-a0b4827a2829c7e4f9082b958f093f7d_720w.jpg)

接着上面的例子，如果我想求不同公司员工的平均年龄和平均薪水，可以进行如下操作：

```py
df.groupby("company").agg("mean")

"""
>>
         salary    age
company               
A          19.0  34.75
B          31.5  31.50
C          25.5  37.75
"""
```

如果想对针对不同的列求不同的值，比如要计算不同公司员工的平均年龄以及薪水的中位数，可以利用字典进行聚合操作的指定：

```py
df.groupby("company").agg({'age': 'mean', 'salary': 'median'})

"""
           age  salary
company               
A        34.75    13.5
B        31.50    31.5
C        37.75    20.0
"""
```

agg聚合过程可以图解如下（第二个例子为例）：

![](https://pic3.zhimg.com/80/v2-c580eb0c4fec7d4b3de272f42bdb2fba_720w.jpg)

## 三、transform

transform是一种什么数据操作？和agg有什么区别呢？为了更好地理解transform和agg的不同，下面从实际的应用场景出发进行对比。

在上面的agg中，我们学会了如何求不同公司员工的平均薪水，如果现在需要在原数据集中新增一列avg_salary，代表员工所在的公司的平均薪水（相同公司的员工具有一样的平均薪水），该怎么实现呢？如果按照正常的步骤来计算，需要先求得不同公司的平均薪水，然后按照员工和公司的对应关系填充到对应的位置，不用transform的话，实现代码如下：

```py
avg_salary_dict = df.groupby("company").agg({'salary': 'mean'}).to_dict()
avg_salary_dict

"""
>>
{'salary': {'A': 19.0, 'B': 31.5, 'C': 25.5}}
"""
```

```py
df['avg_salary'] = df['company'].map(avg_salary_dict['salary'])
df
"""
>>
  company  salary  age  avg_salary
0       A      41   25        19.0
1       C      21   37        25.5
2       A      16   49        19.0
3       B      41   46        31.5
4       C      44   39        25.5
5       B      22   17        31.5
6       A      11   30        19.0
7       A       8   35        19.0
8       C      18   39        25.5
9       C      19   36        25.5
"""
```

如果使用transform的话，仅需要一行代码：

```py
df['avg_salary'] = df.groupby('company')['salary'].transform('mean')
df
"""
  company  salary  age  avg_salary
0       A      41   25        19.0
1       C      21   37        25.5
2       A      16   49        19.0
3       B      41   46        31.5
4       C      44   39        25.5
5       B      22   17        31.5
6       A      11   30        19.0
7       A       8   35        19.0
8       C      18   39        25.5
9       C      19   36        25.5
"""
```

还是以图解的方式来看看进行groupby后transform的实现过程（为了更直观展示，图中加入了company列，实际按照上面的代码只有salary列）：

![](https://pic1.zhimg.com/80/v2-47d83fb973be421545493e92dd0cf0d0_720w.jpg)

图中的大方框是transform和agg所不一样的地方，对agg而言，会计算得到A，B，C公司对应的均值并直接返回，但对transform而言，则会对每一条数据求得相应的结果，同一组内的样本会有相同的值，组内求完均值后会按照原索引的顺序返回结果，如果有不理解的可以拿这张图和agg那张对比一下。

## 四、apply

`apply` 应该是大家的老朋友了，它相比 `agg` 和 `transform` 而言更加灵活，能够传入任意自定义的函数，实现复杂的数据操作。在Pandas数据处理三板斧——map、apply、applymap详解中，介绍了apply的使用，那在 `groupby` 后使用 `apply` 和之前所介绍的有什么区别呢？
区别是有的，但是整个实现原理是基本一致的。两者的区别在于，对于 `groupby` 后的 `apply`，以分组后的子DataFrame作为参数传入指定函数的，基本操作单位是DataFrame，而之前介绍的 `apply` 的基本操作单位是 `Series` 。还是以一个案例来介绍 `groupby` 后的 `apply` 用法。

假设我现在需要获取各个公司年龄最大的员工的数据，该怎么实现呢？可以用以下代码实现：

```py
def get_oldest_staff(x):
  df = x.sort_values(by = 'age',ascending=True)
  return df.iloc[-1]
oldest_staff = data.groupby('company',as_index=False).apply(get_oldest_staff)
oldest_staff
```


Python中groupby后的索引处理

想在groupby后保持groupby列的为正常列有两种方式：
1、利用groupby中的as_index参数

data.groupby('city',as_index=False)['是否中标'].count()
1
2、groupby结果利用reset_index将行索引转换为列

gr=data.groupby('city')['是否中标'].count()
gr.reset_index(drop=False)
1
2
drop=False,将索引转化为普通列，否则列会消失

原文链接：https://blog.csdn.net/onroadliuyaqiong/article/details/105250241
