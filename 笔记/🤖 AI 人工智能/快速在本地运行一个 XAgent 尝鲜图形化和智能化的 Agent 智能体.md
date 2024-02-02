---
tags:
  - AI
  - AI/智能体/Agent
  - 开源/软件/XAgent
---
# 快速在本地运行一个 XAgent 尝鲜图形化和智能化的 Agent 智能体

```shell
git clone nekomeowww.git:OpenBMB/XAgent.git
```

```shell
cd XAgent
```

```shell
docker compose up
```

## 问题排查

```shell
Error response from daemon: Conflict. The container name "/buildx_buildkit_baize-builder0" is already in use by container "5610430c126ebc4527bd2582233c892e2356dc53b50d77def8fedeb9dd973d21". You have to remove (or rename) that container to be able to reuse that name.
```

重新再跑一下 `docker compose up` 就好了

```shell
python run.py --task "some tasks" --model "gpt-4" --config_file "assets/config.yml"
Traceback (most recent call last):
  File "run.py", line 5, in <module>
    from XAgent.config import CONFIG,ARGS
  File "XAgent/config.py", line 12
    raise AttributeError(f"'DotDict' object has no attribute '{key}'")
                                                                    ^
SyntaxError: invalid syntax
```

```shell
python3 run.py --task "some tasks" --model "gpt-4" --config_file "assets/config.yml"
Traceback (most recent call last):
  File "XAgent/run.py", line 5, in <module>
    from XAgent.config import CONFIG,ARGS
  File "XAgent/config.py", line 55
    match model_name.lower():
          ^
SyntaxError: invalid syntax
```

```shell
python run.py --task "some tasks" --model "gpt-4" --config_file "assets/config.yml"
Traceback (most recent call last):
  File "run.py", line 5, in <module>
    from XAgent.config import CONFIG,ARGS
  File "XAgent/config.py", line 2, in <module>
    import yaml
ModuleNotFoundError: No module named 'yaml'
```
