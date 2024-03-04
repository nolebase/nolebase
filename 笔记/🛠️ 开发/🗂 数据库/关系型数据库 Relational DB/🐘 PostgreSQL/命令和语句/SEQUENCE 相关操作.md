---
tags:
  - 开发/数据/数据库
  - 计算机/数据库/postgres
  - 计算机/数据库/postgresql
  - 开发/语言/SQL
---

# SEQUENCE 相关操作

1. 获取 SEQUENCE 当前的值

```sql
SELECT * FROM "<schema>"."<sequence_name>";
```

2. 设置 SEQUENCE 的下一个值

```sql
ALTER SEQUENCE "<schema>"."<sequence_name>" RESTART WITH <next id>;
```

3. 授权使用和递增 SEQUENCE

```sql
GRANT USAGE, SELECT ON SEQUENCE "<schema>"."<sequence_name>" TO "<user>";
```
