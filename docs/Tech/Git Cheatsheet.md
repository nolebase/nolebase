---
tags:
  - cheatsheet
---
## Refresh change to .gitignore

ユースケース：.gitignoreの変更後に変更を反映させたい。

```zsh
git rm -r --cached .
git add .
```

### Refs
- [How to refresh gitignore – Sigala's Blog](https://sigalambigha.home.blog/2020/03/11/how-to-refresh-gitignore/)
