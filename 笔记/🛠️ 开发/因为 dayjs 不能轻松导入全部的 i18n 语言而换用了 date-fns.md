---
tags:
  - 开发/前端
  - 开发/Nodejs
  - 开发/语言/JavaScript
  - 开发/语言/TypeScript
---

# 因为 dayjs 不能轻松导入全部的 i18n 语言而换用了 date-fns

Export list of locales available, and a function to require an Array of locales · Issue #1041 · iamkun/dayjs
https://github.com/iamkun/dayjs/issues/1041

```ts
const locales = require('dayjs/locale.json')
for (const locale of locales) {
  require(`dayjs/locale/${locale.key}`);
}
```

```ts
import Locales from 'dayjs/locale.json'

for (const locale in Locales)
  import(/* @vite-ignore */ `dayjs/locale/${locale}.js`)
```

ladjs/dayjs-with-plugins: Day.js with all plugins and locales added out of the box, no need to use dayjs.extend!
https://github.com/ladjs/dayjs-with-plugins

![[Pasted image 20240126121238.png]]

Load all locale once in browser environnement · Issue #2537 · iamkun/dayjs
https://github.com/iamkun/dayjs/issues/2537

Minified import for all locales · Issue #1810 · iamkun/dayjs
https://github.com/iamkun/dayjs/issues/1810

Import all locales · Issue #1668 · iamkun/dayjs
https://github.com/iamkun/dayjs/issues/1668

而 date-fns 没有这样的问题

```typescript
import * as DateFnsLocales from 'date-fns/locale'
```
