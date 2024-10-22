---
tags:
  - cli
  - rust
  - seed
---
# Migrate `asdf` to mise

Read [Getting Started | mise-en-place](https://mise.jdx.dev/getting-started.html)

1) Install `mise` by Homebrew: [Getting Started | mise-en-place](https://mise.jdx.dev/getting-started.html#homebrew)
	```shell
	brew install mise
	```

2) Activate for zsh
   Activate according to the docs.
	```zsh
	echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
	```

3) mise install
	```zsh
		mise install
	```


```zsh
$ mise use --global node@20 $ node -v v20.x.x
```

## Note: check asdf list

```zsh
# asdf list
go-sdk
  No versions installed
golang
  1.18.4
 *1.20
java
  corretto-21.0.1.12.1
 *zulu-jre-javafx-11.56.19
nodejs
  14.18.1
  14.19.2
  16.10.0
  16.15.1
  16.17.1
  18.1.0
  18.18.2
python
  No versions installed
ruby
  No versions installed
rust
  1.50.0
  1.60.0
  1.64.0
yarn
  No versions installed
```
