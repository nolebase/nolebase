# 列表

列表有以下用法：

```py
# List.py

# This is my shopping list
shopList = ['apple', 'banana', 'carrot', 'banana']

# len(list)
print('I have', len(shopList), 'items to purchase')

print('These items are:', end='  ')

for item in shopList:
  print(item, end='  ')

# list.append()
print('I also have to buy rice.')
shopList.append('rice')
print('My shopping list is now:', shopList)

# list.sort()
print('I sort my list now.')
shopList.sort()
print('Sorted shopping list is:', shopList)

# list[index]
print('The first item I will buy is:', shopList)
oldItem = shopList[0]

# del list.[index]
del shopList[0]

print('I bought the old item:', oldItem )
print('The shopping List is now:', shopList)

```
