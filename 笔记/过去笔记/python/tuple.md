# 元组

::: warning
元组的值不会改变。
:::

```py
# Tuple.py

zoo = ('python', 'elephant', 'penguin') 
# 圆括号是可选的 Remember parentheses are optional

# len(list)
print('Number of animals in the zoo is', len(zoo))

new_zoo = ('monkey', 'camel', zoo)
print('Number of cages in the new zoo is', len(new_zoo))
print('All animals in the zoo are', new_zoo)
print('Animals bought from old zoo are', new_zoo[2])
print('Last animal brought from old zoo is:', new_zoo[2][2])
print('Number of numbers in the new zoo is', len(new_zoo) - 1 + len(new_zoo[2]))
```
