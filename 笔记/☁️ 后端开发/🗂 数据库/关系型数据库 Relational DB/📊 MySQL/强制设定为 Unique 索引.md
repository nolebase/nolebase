# 强制设定为 UNIQUE 索引

#代码片段 #sql #mysql

## 说明

强制设定 UNIQUE 索引，会删除重复字段，可在设置 UNIQUE 提示失败存在重复字段时使用。

```sql
ALTER IGNORE TABLE <表名> ADD UNIQUE KEY uk_<表名>_<字段名> (<字段名>);
```
