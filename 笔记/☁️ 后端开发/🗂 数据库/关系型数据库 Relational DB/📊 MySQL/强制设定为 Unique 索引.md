#### 强制设定 unique 索引，会删除重复字段，可在设置 unique 提示失败存在重复字段时使用。
#代码片段 #sql 
```sql
ALTER IGNORE TABLE 表 ADD UNIQUE KEY uk_id (字段);
```

