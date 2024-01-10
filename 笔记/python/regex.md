---
title: 正则表达式 Regex
author: mophia
---


```py
import re

'''
\w  匹配字母、数字及下划线
\W  匹配非字母、数字及下划线
\s  匹配空白字符
\S  匹配非空白字符
\d  匹配任意数字，等价于[0-9]
\D  匹配任意非数字，等价于[0-9]
\A or ^  匹配字符串以 ... 开头
\Z or $  匹配字符串以 ... 开头

重复匹配
.  匹配除了 \n 之外任意的一个字符，指定 re.DOTALL 之后才能匹配换行符
*  匹配左侧字符重复0次或多次，贪婪
+  匹配左侧字符重复1次或多次，贪婪
?  匹配左侧字符重复0次或1次，贪婪
{n,m} 左侧字符重复 n 次到 m 次，贪婪
    {0,} = *
    {1,} = +
    {0,1} = ?
[] 匹配自定字符中的一个
'''
# res = re.findall('\w', 'abc123_*()-=')  # => ['a', 'b', 'c', '1', '2', '3', '_']
# res = re.findall('\s', 'abc123_*()-= ')  # => [' ']
# res = re.findall('\Aabc', 'abc123_*()-= ')  # => ['abc']
# res = re.findall('-=$', 'abc123_*()-=')  # => ['-=']

# res = re.findall('a.b', 'a1b a2b', re.DOTALL)  # =>  ['a1b', 'a2b']
# res = re.findall('ab*', 'a ab abb abbbbbb bbb')  # => ['a', 'ab', 'abb', 'abbbbbb']
# res = re.findall('ab?', 'a ab abb abbbbbb bbb')  # => ['a', 'ab', 'ab', 'ab']
# res = re.findall('ab{2,5}', 'a ab abb abbbbbb bbb')  # => ['abb', 'abbbbb']

# 找出全部的整数和小数
# res = re.findall('\d+\.?\d*',"asdfasdf123as1.13dfa12adsflasdf3")  # => ['123', '1.13', '12', '3']

# res = re.findall('a\db', 'a1b a3b aXb a b a\nb')  # => ['a1b', 'a3b']
# res = re.findall('a[0-3X]b', 'a1b a3b aXb a b a\nb')  # => ['a1b', 'a3b', 'aXb']
# res = re.findall('a[0-9a-zA-Z]b', 'a1b a3b aXb a b a\nb')  # => ['a1b', 'a3b', 'aXb']
# ^ 取反
# res = re.findall('a[^0-9a-zA-Z]b', 'a1b a3b aXb a b a\nb')  # => ['a b', 'a\nb']
res = re.findall('a[0-9\n-]b', 'a-b a1b a3b aXb a b a\nb')  # => ['a-b', 'a1b', 'a3b', 'a\nb']
print(res)


```