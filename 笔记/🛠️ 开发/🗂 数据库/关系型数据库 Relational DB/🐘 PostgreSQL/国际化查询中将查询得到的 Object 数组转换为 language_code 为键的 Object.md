---
tags:
  - 计算机/数据库/postgres
  - 计算机/数据库/postgresql
  - 开发/语言/SQL
  - 编码/jsonb
  - 开发/数据/嵌套查询
  - 语言/国际化/Internationalization/i18n
---

# 国际化查询中将查询得到的 Object 数组重新映射为 `language_code` 列为键的 Object

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2022-03-29 | 创建 |

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| PostgreSQL | 14 | [http://www.postgres.cn/docs/14/functions-aggregate.html](http://www.postgres.cn/docs/14/functions-aggregate.html) |

## 说明

### 数据结构

在设计国际化表的时候，我采用的方案是 源 表 + 源_i18n 表的结构，这样方便拓展和管理所有需要的 i18n 的字段和字段值。比如以下案例（为了简化结构，此处我把表的名称直接定为 `source`，具体的业务需求可以根据业务需求自行定义）：

#### `source` 表

| id | title |
| -- | ----- |
| `4536262a-d4a4-4843-946c-59e8cc680687` | 来源可爱 |

#### `source_i18n` 表

| id | source_id | title | language_code |
| -- | --------- | ----- | ------------- |
| 1 | `4536262a-d4a4-4843-946c-59e8cc680687` | Sourced Cute | `en-US` |

#### 前后端协商的 API 定义

并且我们在设计前后端配合的 i18n 数据结构的时候要求 i18n 字段应该符合下面的类型定义：

```typescript
type Source interface {
  /** 主键 ID，可以是 int8/bigserial 类型（number）也可以是 uuid 类型（string） */
  id: number | string;
  /** 内容标题，支持国际化 */
  title: string;
  /** 内容简介，支持国际化 */
  description: string;
  /** 标签数组，支持国际化 */
  tags: {
      /** 如果数组内是单个元素，并非对象，则此处直接放置一个 API 文档协商好的名字即可 */
	  tag: string;
	  /** 国际化内容，和下面的结构基本一致，i18n 内部要求 键 和 i18n 同级的需要支持国际化的键名字一致 */
	  i18n: {
	    /** 国际化键值 */
	    tag: {
	      /** 遵循 ISO 639-1 语言代码 */
	      'zh-CN': string;
	      'en-US': string;
	      ... // 其他语言
	    }
	  }
  }[];
  /** 内容链接，不支持国际化 */
  url: string;
  /** 国际化内容，i18n 内部要求 键 和 i18n 同级的需要支持国际化的键名字一致 */
  i18n: {
    /** 国际化键值 */
    title: {
	  /** 遵循 ISO 639-1 语言代码 */
      'zh-CN': string;
	  'en-US': string;
	  ... // 其他语言
    },
    /** 国际化键值 */
    description: {
      /** 遵循 ISO 639-1 语言代码 */
      'zh-CN': string;
	  'en-US': string;
	  ... // 其他语言
    }
  }
}
```

#### 后端结构定义

以 Golang 的后端为例，按照上述要求，则需要后端定义结构体为以下内容：

```go
type SourceTagsI18n struct {
	Tag map[string]string `json:"tag"`
}

type SouceTags struct {
	Tag string `json:"tag"`
	I18n *SourceTagsI18n `json:"i18n"`
}

type SourceI18n struct {
	SourceID string `gorm:"type:uuid;not null" json:"-"`
	Title map[string]string `json:"title"`
	Description map[string]string `json:"title"`
	LanguageCode string `gorm:"type:text" json:"-"`
}

type Source struct {
	ID string `gorm:"primary_key;autoIncrement;type:uuid" json:"id" format:"uuid"` // 此处以 UUID 类型的主键为例
	Title string `gorm:"type:text" json:"title"`
	Description string `gorm:"type:text" json:"title"`
	Tags []*SourceTags `json:"tags"`
	URL string `gorm:"type:text" json:"url"`
	I18n *SourceI18n `json:"i18n"`
}
```

此时我们可以发现，如果不用 PostgreSQL 自带的 JSON 操作函数转换的话，此处会需要 Golang 后端应用程序层面多进行一次查询（即携带首次查询获得的 `Source.ID` （也可以是多个）作为 `WHERE` 的约束条件，查询 `source_i18n` 表的数据条目），获得第二次查询结果后（即国际化键值的查询结果），然后携带获得的 `SourceI18n` 切片和首次查询的数据 `Source` 的指针（也可以是多个 `Source` 指针，作为切片即可）在应用程序层面上进行逻辑聚合：

```go
source.I18n = &SourceI18n{
	Title: make(map[string]string),
	Description: make(map[string]string),
}

for _, v := range sourceI18ns {
	if sourceI18ns.SourceID == source.ID {
		source.I18n.Title[v.LanguageCode] = v.Title
		source.I18n.Description[v.LanguageCode] = v.Description
	}
}
```

但是这样的话如果数据量比较大，对应用程序的内存开销和对数据库的多次反复查询可能也会造成一定的性能影响，所以此处可以使用 PostgreSQL JSONB 聚合函数提供的 `jsonb_object_agg()` 函数实现聚合[^1]：

`json_object_agg` ( _`key`_ `"any"`, _`value`_ `"any"` ) → `json`
`jsonb_object_agg` ( _`key`_ `"any"`, _`value`_ `"any"` ) → `jsonb`

函数作用说明：将所有键/值对收集到一个JSON对象中。关键参数强制转换为文本；值参数按照 `to_json` 或 `to_jsonb` 进行转换。 值可以为空，但键不能（为空）。

我们则可以用下面的查询语句在数据库层面进行聚合并返回格式化好的结构数据：

```sql
SELECT
	"source".*,
	i18n.items as i18n
FROM "test"."source" AS "source"
LEFT JOIN
	(
		SELECT
			"source_id",
			JSONB_BUILD_OBJECT(
				'title', JSONB_OBJECT_AGG(language_code, title)
			) AS items
		FROM "test"."source_i18n"
		GROUP BY "source_id"
	) AS "i18n"
ON "i18n"."source_id" = "source"."id";
```

以上语句中关键的部分就是：

```sql
SELECT
	"source_id",
	JSONB_BUILD_OBJECT(
		'title', JSONB_OBJECT_AGG(language_code, title)
	) AS items
FROM "test"."source_i18n"
GROUP BY "source_id"
```

`JSONB_BUILD_OBJECT` 函数可以辅助构建整个 Object，参数模式为：`JSONB_BUILD_OBJECT('key', 'value', 'key2', 'value2'...)`
`JSONB_OBJECT_AGG` 可以在 `GROUP BY` 语句生效的时候根据 `GROUP BY` 的字段进行聚合，此处则是根据 `source_id` 进行聚合，将原先展开的条目中的 `language_code` 字段和 `title` 字段聚合到新的 JSONB 结构里面。

于是我们就可以获得下面满足 API 约定类型的结果：

| id | title | i18n |
| -- | ---- | ---- |
| `4536262a-d4a4-4843-946c-59e8cc680687` | 来源可爱 | `{"title": {"en-US": "Sourced Cute"}` |

## 完整的 SQL 示例

### `source` 表

#### 插入语句

```sql
DROP TABLE IF EXISTS "test"."source";
CREATE TABLE "test"."source" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"title" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
	PRIMARTY KEY('id')
);

ALTER TABLE "test"."source" OWNER TO "postgres";

BEGIN;
INSERT INTO "test"."source" ("id", "title") VALUES ('4536262a-d4a4-4843-946c-59e8cc680687', '来源可爱');
INSERT INTO "test"."source" ("id", "title") VALUES ('5e593bfa-a9b1-4206-bbf0-75745aab5472', '来源猫咪');
COMMIT;
```

#### 可视化

| id | title |
| -- | ----- |
| `4536262a-d4a4-4843-946c-59e8cc680687` | 来源可爱 |
| `5e593bfa-a9b1-4206-bbf0-75745aab5472` | 来源猫咪 |

### `source_i18n` 表可视化

#### 插入语句

```sql
DROP TABLE IF EXISTS "test"."source_i18n";
CREATE TABLE "test"."source_i18n" (
	"id" int8 NOT NULL DEFAULT nextval('"test".source_i18n_id_seq'::regclass),
	"source_id" uuid NOT NULL,
	"title" text COLLATE "pg_catalog"."default",
	"language_code" text COLLATE "pg_catalog"."default" NOT NULL,
	PRIMARTY KEY('id')
);

ALTER TABLE "test"."source_i18n" OWNER TO "postgres";

BEGIN;
INSERT INTO "test"."source_i18n" ("id", "source_id", "title", "language_code") VALUES (1, '4536262a-d4a4-4843-946c-59e8cc680687', 'Sourced Cute', 'en-US');
INSERT INTO "test"."source_i18n" ("id", "source_id", "title", "language_code") VALUES (2, '4536262a-d4a4-4843-946c-59e8cc680687', '来源可爱', 'zh-CN');
INSERT INTO "test"."source_i18n" ("id", "source_id", "title", "language_code") VALUES (3, '4536262a-d4a4-4843-946c-59e8cc680687', '來源可愛', 'zh-TW');
INSERT INTO "test"."source_i18n" ("id", "source_id", "title", "language_code") VALUES (4, '4536262a-d4a4-4843-946c-59e8cc680687', '來源可愛', 'zh-HK');
INSERT INTO "test"."source_i18n" ("id", "source_id", "title", "language_code") VALUES (5, '4536262a-d4a4-4843-946c-59e8cc680687', 'ラブリーから', 'jp-JP');
INSERT INTO "test"."source_i18n" ("id", "source_id", "title", "language_code") VALUES (6, '5e593bfa-a9b1-4206-bbf0-75745aab5472', 'Sourced Cat', 'en-US');
INSERT INTO "test"."source_i18n" ("id", "source_id", "title", "language_code") VALUES (7, '5e593bfa-a9b1-4206-bbf0-75745aab5472', '来源猫咪', 'zh-CN');
INSERT INTO "test"."source_i18n" ("id", "source_id", "title", "language_code") VALUES (8, '5e593bfa-a9b1-4206-bbf0-75745aab5472', '來源貓咪', 'zh-TW');
INSERT INTO "test"."source_i18n" ("id", "source_id", "title", "language_code") VALUES (9, '5e593bfa-a9b1-4206-bbf0-75745aab5472', '來源貓咪', 'zh-HK');
INSERT INTO "test"."source_i18n" ("id", "source_id", "title", "language_code") VALUES (10, '5e593bfa-a9b1-4206-bbf0-75745aab5472', 'ソースキャッツ', 'jp-JP');
COMMIT;
```

#### 可视化

| id | source_id | title | language_code |
| -- | --------- | ----- | ------------- |
| 1 | `4536262a-d4a4-4843-946c-59e8cc680687` | Sourced Cute | `en-US` |
| 2 | `4536262a-d4a4-4843-946c-59e8cc680687` | 来源可爱 | `zh-CN` |
| 3 | `4536262a-d4a4-4843-946c-59e8cc680687` | 來源可愛 | `zh-TW` |
| 4 | `4536262a-d4a4-4843-946c-59e8cc680687` | 來源可愛 | `zh-HK` |
| 5 | `4536262a-d4a4-4843-946c-59e8cc680687` | ラブリーから | `jp-JP` |
| 6 | `5e593bfa-a9b1-4206-bbf0-75745aab5472` | Sourced Cat | `en-US` |
| 7 | `5e593bfa-a9b1-4206-bbf0-75745aab5472` | 来源猫咪 | `zh-CN` |
| 8 | `5e593bfa-a9b1-4206-bbf0-75745aab5472` | 來源貓咪 | `zh-TW` |
| 9	| `5e593bfa-a9b1-4206-bbf0-75745aab5472` | 來源貓咪 | `zh-HK` |
| 10 | `5e593bfa-a9b1-4206-bbf0-75745aab5472` | ソースキャッツ | `jp-JP` |

### 查询

#### 查询语句

```sql
SELECT
	"source".*,
	i18n.items as i18n
FROM "test"."source" AS "source"
LEFT JOIN
	(
		SELECT
			"source_id",
			JSONB_BUILD_OBJECT(
				'title', JSONB_OBJECT_AGG(language_code, title)
			) AS items
		FROM "test"."source_i18n"
		GROUP BY "source_id"
	) AS "i18n"
ON "i18n"."source_id" = "source"."id";
```

#### 查询结果可视化

| id | title | i18n |
| -- | ---- | ---- |
| `4536262a-d4a4-4843-946c-59e8cc680687` | 来源可爱 | `{"title": {"en-US": "Sourced Cute", "jp-JP": "ラブリーから", "zh-CN": "来源可爱", "zh-HK": "來源可愛", "zh-TW": "來源可愛"}}` |
| `5e593bfa-a9b1-4206-bbf0-75745aab5472` | 来源猫咪 | `{"title": {"en-US": "Sourced Cat", "jp-JP": "ソースキャッツ", "zh-CN": "来源猫咪", "zh-HK": "來源貓咪", "zh-TW": "來源貓咪"}}` |

完整运行结果可参见： https://dbfiddle.uk/?rdbms=postgres_14&fiddle=932ba1edfa7e5d0fc16340357897c7af&hide=2

## 延伸阅读

[postgresql - postgres 从 json 字段中选择作为每个键的列 - Stack Overflow](https://stackoverflow.com/questions/65198121/postgres-select-from-json-field-as-column-for-each-key)
[PostgreSQL 14 文档 - 9.21. 聚集函数](http://www.postgres.cn/docs/14/functions-aggregate.html)



[^1]: [sql - PostgreSQL 将对象数组转换为对象映射 - Stack Overflow](https://stackoverflow.com/questions/63437927/postgresql-convert-array-of-objects-to-map-of-objects)
