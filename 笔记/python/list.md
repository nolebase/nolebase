---
title: 列表 List
author: mophia
---

# 列表 List

## 作用

按照位置存放多个值，并用索引对应值。

## 定义

```py
l = [1, 1.2, 'a'] # l = list([1, 1.2, 'a'])
```

## 类型转换

可迭代的类型（能被for循环的）都能转换为列表。

- 字符串 转 列表
  
```py
res = list('mophia')
print(res)  # ['m', 'o', 'p', 'h', 'i', 'a']
```

- 字典 转 列表
注：字典是无序的

```py
res = list({'k1': 111, 'k2': 222, 'k3': 333})  # 注：字典是无序的
print(res)  # ['k1', 'k2', 'k3']
```

## 内置方法

> 优先掌握的操作

### 1. 按索引取值和修改值

正向存取 + 反向存取；既可存，也可取。

```py
l = ['mophia', 666, 999]

# 正向取
print(l[0])  # mophia

# 反向取
print(l[-1])  # 999

# 也可以改值
# 索引存在，则修改对应的值
l[2] = 555
print(l)  # ['mophia', 666, 555]
```

无论存还是取，索引不存在，则报错.

```py
l = ['mophia', 666, 999]
l[3] = 666  # IndexError: list assignment index out of range
```

### 2. 追加值

**list.append(value)**


```py
l.append(333)
print(l)  # ['mophia', 666, 555, 333]
```

### 3. 插入值

**list.insert(index, value)**

```py
l.insert(0, 'insert')
print(l)  # ['insert', 'mophia', 666, 555, 333]
```

### 列表拓展

展开列表 list2 ，并追加到 list1：**list1.extend(list2)**

extend 的代码实现

```py
for item in new_l:
    l.append(item)
```

```py
l = [0]
l.extend([1, 2, 3])
print(l)  # [0, 1, 2, 3]
l.extend('abc')
print(l)  # [0, 1, 2, 3, 'a', 'b', 'c']
```

### 4. 删除列表

> http://c.biancheng.net/view/2209.html

#### 方法一：通用的删除方法 del list[index]

只是单纯删除，没有返回值

```py
l = [1, 2, 3]
del l[1]  # 不支持赋值语法
print(l)  # [1, 3]
```

#### 方法二：l.pop(index) 根据索引删除

```py
l = [1, 2, 3]
pop_item = l.pop()  # 不指定索引，默认删除最后一个. 会返回删除的那个值
print(l, pop_item)  # [1, 2] 3

l = [1, 2, 3]
pop_item = l.pop(1)
print(l, pop_item)  # [1, 3] 2
```

#### 方法三: l.remove(val) 根据元素值删除

```py
l = [1, [1, 2], 3]
l.remove([1, 2])  # 没有返回值
print(l)  # [1, 3]
```

#### 方法四：clear() 清空列表

```py
l = [1, 2, 3]
l.clear()
print(l)  # []
```

### 5. 切片

**切片是拷贝行为，不改变原来的数组：list[开始:结束（顾头不顾尾）:步长]**

```py
l = [0, 1, 2, 3, 4]
print(l[0:3])  # [0, 1, 2]
print(l[0:5:2])  # [0, 2, 4]
```

- 切片等同于拷贝行为（浅拷贝）。原列表变了，新列表跟着变化。内存地址一致。

```py
new_l = l[:] # l.copy()
```

- 反向列表

```
print(l[::-1])
```

### 6. 长度

```py
l = [0, 1, 2, 3, 4]
print(len(l))  # 5
```

### 7. 判断成员是否存在 in / not in

```py
print('mophia' in l)  # False
```

### 8. 循环

```py
for val in [1, 2, 3]:
    print(val)
```

<br />

> 需要掌握的操作

```py
l = [1, 'a', 'b', 'a', 2, 3]

# list.count(val)  统计 val 在 list 中出现的次数
print(l.count('a'))  # 2


# list.index(val) 返回首个索引，找不到则报错
print(l.index('a'))  # 1

# list.reverse() 列表反转
l.reverse()
print(l)  # [3, 2, 'a', 'b', 'a', 1]

# list.sort() 排序
# 默认升序；reverse=True 则设置为降序
print([1, 2, 3])  # [1, 2, 3]
# 字符串可以按照ASCII码比大小. 按照位数依次比大小 'z' > 'abc'
print('a' < 'b')  # True

# 列表也可以比大小，原理同字符串一样. 按照位数依次比大小. 对应位置的元素必须是同种类型.


# list.clear() 列表清空
l.clear()
print(l)  # []
```

### list 与 string 的转换

- list转string

```py
''.join(list)
```

其中，引号中是字符之间的分割符，如“,”，“;”，“\t”等等

如：

```py
list = [1, 2, 3, 4, 5]
''.join(list) # => 12345
','.join(list) # => 1,2,3,4,5
```

- string 转 list

```py
list(str)
```

```py
list1 = list('abcde')
print(list1)  # => ['a', 'b', 'c', 'd', 'e']

a = '123  4'
c = a.split()
print(c)  #['123', '4']
d = a.split(' ')
print(d)  #['123', '', '4']
```

> 参考：https://blog.csdn.net/bufengzj/article/details/90231555
