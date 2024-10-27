---
tags:
  - productivity
  - tool
  - note
  - markdown
  - obsidian
  - PKM
---
## obsidian-omnivore
### Notesが取得されない

highlights.lengthで出力されるループの前に意図的にnoteを取得させると、うまく動作する。


```text
# {{{title}}}

#Omnivore

[Read on Omnivore]({{{omnivoreUrl}}})
[Read Original]({{{originalUrl}}})

{{#note}}
## Notes

{{{note}}}
{{/note}}

{{#highlights.length}}
## Highlights

{{#highlights}}
> {{{text}}} [⤴️]({{{highlightUrl}}}) {{#labels}} #{{name}} {{/labels}}
{{#note}}

{{{note}}}
{{/note}}

{{/highlights}}
{{/highlights.length}}
## Webpage

{{{content}}}
```

#### Sources
- [記事のメモが同期されない · 問題 #54 · omnivore-app/obsidian-omnivore](https://github.com/omnivore-app/obsidian-omnivore/issues/54)
# Plugins

- [obsidian-excalidraw-plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin)
