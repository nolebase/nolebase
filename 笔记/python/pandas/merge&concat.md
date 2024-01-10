---
title: 合并计算
author: mophia
---

# 合并计算 —— merge 与 concat 的用法

## concat 的用法

concat() 一般用于纵向连接两个 `DataFrame`：

```py
import pandas as pd
```

```py
df1 = pd.DataFrame({'A': ['A0', 'A1'], 'B': ['B0', 'B1']})
df1
"""
>>
    A   B
0  A0  B0
1  A1  B1
"""

df2 = pd.DataFrame({'A': ['A2', 'A3'], 'B': ['B2', 'B3']})
df2
"""
>>
    A   B
0  A2  B2
1  A3  B3
"""
```

```py
re = pd.concat([df1, df2])
re
"""
>>
    A   B
0  A0  B0
1  A1  B1
0  A2  B2
1  A3  B3
"""
```

## merge 的用法

merge() 一般用于横向连接两个 `DataFrame`：

```py
left = pd.DataFrame({'key': ['K0', 'K1', 'K2'],
                     'A': ['A0', 'A1', 'A2'],
                     'B': ['B0', 'B1', 'B2']})
left

"""
  key   A   B
0  K0  A0  B0
1  K1  A1  B1
2  K2  A2  B2
"""

right = pd.DataFrame({'key': ['K0', 'K1'], 'C': ['C0', 'C1']})
right

"""
  key   C
0  K0  C0
1  K1  C1
"""
```

```py
#  横向合并left和right两个子DataFrame。
# on='key': 把两个子DataFrame中key列相同的值连接到一行上。
result = pd.merge(left, right, on='key')
result

"""
>>
  key   A   B
0  K0  A0  B0
1  K1  A1  B1
"""

# how: 指定两个子DataFrame的连接方式，
# 默认内连接删去了key列值不相同的行。
re = pd.merge(left, right, on=["key"])
re

"""
>>
  key   A   B   C
0  K0  A0  B0  C0
1  K1  A1  B1  C1
"""

# 外连接 how='outer' 保留key列值不相同的行
re = pd.merge(left, right, on=["key"], how='outer')
re

"""
>>
  key   A   B    C
0  K0  A0  B0   C0
1  K1  A1  B1   C1
2  K2  A2  B2  NaN
"""

```
