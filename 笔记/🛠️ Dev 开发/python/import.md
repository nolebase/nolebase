---
title: 模块和包
author: mophia
---

## Python文件的两种用途

- 1. 被当作程序运行
- 2. 被当作模块导入

```py
# foo.py

x = 1

def get():
    print(x)

def change():
    global x
    x = 0

print(__name__)

# 1. 当 foo.py 运行时，__name__的值为 "__main__"
if __name__ == '__main__':
  print('文件被执行')
  get()
  change()

# 2. 当 foo.py 被当作模块导入时，__name__的值为模块名 "foo"
else:
  print('文件被导入')
  pass
```

import 导入模块，在使用时，必须加前缀 "模块."

- 优点：肯定不会与当前名称空间中的名字冲突
- 缺点：加前缀显得麻烦

from ... import ...

导入也发生三件事

- 产生一个模块的名称空间
- 运行 foo.py 将运行过程中产生的名字都加到模块的名称空间中
- 在当前名称空间拿到一个名字，该名字与模块名称空间中的同一个名字指向某一个内存地址

- 优点：代码更精简
- 缺点：容易与当前的名称空间混淆


不推荐一行导入多个名字

```py
from foo import x
from foo import get
from foo import change
```

用 `*` 导入模块中的所有名字

```py
from foo import *
```

__all__ 控制 * 中导入的名字

```py
__all__ = ['a', 'b', 'c']
```

别名

```py
import b as b的别名
from a import b as b的别名
```

### 循环导入

循环导入的原因：函数导入时，被导入py还没运行到变量的定义。

解决循环导入的方法：
1. 把变量的声明放在导入之前
2. 把共同需要的变量放在同一个文件中
3. 把导入模块放在函数里

例子：

m1.py

```py
print('正在导入m1')

x = 'm1'

from m2 import y

# x = 'm1'
```

m2.py

```py
print('正在导入m2')

y = 'm2'

from m1 import x

# y = 'm2'
```

run.py

```py
import foo
import m1

x = 1
y = 2

def f1():
    from m2 import  y
    print(y)

```

### 模块查找优先级

优先级：

1. 内存（内置模块、以及之前导入过的模块会缓存在内存中）
2. 从硬盘找（文件夹）

#### （了解）sys.modules 可以查看已经加载到内存中的模块

```py
import sys
import foo

print(sys.modules)
print('foo' in sys.modules) # True
```

### 通过绝对路径导入模块

```py
import sys
# 把 foo.py 的文件夹添加到环境变量中
sys.path.append('/Users/admin/Projects/PyOldBoy/day21/aa')
import foo
foo.say()
```

### 标准模块的编写

```py
#!/usr/bin/env python #通常只在类unix环境有效,作用是可以使用脚本名来执行，而无需直接调用解释器。

"The module is used to..." #模块的文档描述

import sys #导入模块

x=1 #定义全局变量,如果非必须,则最好使用局部变量,这样可以提高代码的易维护性,并且可以节省内存提高性能


class Foo: #定义类,并写好类的注释
    'Class Foo is used to...'
    pass


def test(): #定义函数,并写好函数的注释
    'Function test is used to…'
    pass

if __name__ == '__main__': #主程序
    test() #在被当做脚本执行时,执行此处的代码

```

### 函数的类型提示

```py
def register(name: str, age: int = 18, hobbies: tuple = ()) -> int:
    print(name, age, hobbies)
    return 111


register('mophia', 18, ('play', 'music', 12))


# 也可以写入提示信息
def register(name: "请传入名字"):
    return name


# 可以用以下方法查看提示信息
print(register.__annotations__)  # {'name': '请传入名字'}
```
