# 字典

```py
# Dict.py

# 'ab' is short for 'a'ddress'b'ook
ab = { 'Swaroop' : 'swaroop@swaroopch.com',
        'Larry' : 'larry@wall.org',
       'Matsumoto' : 'matz@ruby-lang.org',
       'Spammer' : 'spammer@hotmail.com'
}

print("Swaroop's address is ", ab['Swaroop'])

# Delete a key-value pair
del ab['Spammer']
print('There are {0} contacts in the address-book \n'.format(len(ab)))

# Loop
# dict.items()
for name, address in ab.items():
    print('Contact {0} at {1}'.format(name, address))

# Adding a key-value pair
ab['JunBingo'] = 'JunBingo@outlook.com'

# 判断元素是否在字典中： a in dict
if 'JunBingo' in ab:
    print("\n JunBingo's address is: ", ab['JunBingo'])

```
