---
tags:
  - 开发/数据/数据库
  - 计算机/数据库/mysql
  - 开发/语言/SQL
  - 开发/代码/代码片段
---

# 强制设定为 UNIQUE 索引

## 说明

强制设定 UNIQUE 索引，会删除重复字段，可在设置 UNIQUE 提示失败存在重复字段时使用。

```sql
ALTER IGNORE TABLE <表名> ADD UNIQUE KEY uk_<表名>_<字段名> (<字段名>);
```
