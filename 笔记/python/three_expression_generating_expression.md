---
title: 三元表达式和生成式
author: mophia
---

# 三元表达式

语法格式：

```py
条件成立时的返回值 if 判断条件 else 条件不成立时的返回值
```

例子：

```py
x = 1
y = 2

res = x if x > y else y

"""
以上代码等价于：
if x > y:
  res = x
else:
  res = y
"""
```

# 生成式

## 列表生成式

```py
l = ['alex_666', 'tom_666', 'jerry']

new_l = [name for name in l if name.endswith('_666')]
print(new_l)  # ['alex_666', 'tom_666']

"""
以上代码等价于：
new_l = []
for name in l:
  if name.endswith('_666'):
      new_l.append(name)
"""

# 其他例子
# 把小写字母全变成大写
new_l = [name.upper() for name in l]
print(new_l)  # ['ALEX_666', 'TOM_666', 'JERRY']

# 把所有的名字去掉后缀 _dsb
new_l = [name.replace('_666', '') for name in l]
print(new_l)  # ['alex', 'tom', 'jerry']
```
