1. 获取 SEQUENCE 当前的值

```sql
SELECT * FROM "<schema>"."<sequence_name>";
```

2. 设置 SEQUENCE 的下一个值


```sql
ALTER SEQUENCE "<schema>"."<sequence_name>" RESTART WITH <next id>;
```