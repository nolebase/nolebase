---
draft: true
tags:
  - seed
  - PKM
  - degital_garden
---


![[quartz.png]]
## Explorer
### 

```diff
- filterFn: filterFn: (node) => node.name !== "tags", // filters out 'tags' folder
- mapFn: undefined,
+ filterFn: (node) => node.name !== "tags", // filters out 'tags' folder
+ // mapFn: undefined,

```

```zsh
 Failed to emit from plugin `ContentPage`: mapFn is not a function
     at _FileNode.map (../components/ExplorerNode.tsx:119:5)
     at constructFileTree (../components/Explorer.tsx:60:20)
     at Object.call (../components/Explorer.tsx:84:7)
```