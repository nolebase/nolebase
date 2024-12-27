---
tags:
  - 基础设施/云服务商/亚马逊云/AWS
  - 基础设施/云服务商/亚马逊云
  - 基础设施/存储/镜像仓库/亚马逊云/AWS/ECR
  - 命令行/aws
  - 命令行/docker
  - 运维/云原生/Docker
---
# 通过 AWS CLI 验证并推送镜像到 AWS ECR

> [!WARNING] 请先确保你已经正确配置了 AWS 的 SSO Profile
>
> 想要找到是否配置了 Profile，可以通过
>
> ```shell
> aws configure list-profiles
> ```
>
> 命令来了解，会输出这样的结果：
>
> ```shell
> $ aws configure list-profiles
> default
> example.org-dev
> ```
>
> 也可以根据 `$HOME/.aws/config` 文件查阅配置信息：
>
> ```shell
> $ cat ~/.aws/config
> [default]
> region = <地区>
>
> [profile example.org-dev]
> sso_session = example.org-dev
> sso_account_id = <账户 ID>
> sso_role_name = AdministratorAccess
> region = <地区>
>
> [sso-session example.org-dev]
> sso_start_url = https://<IAM Identity Center SSO 登录 ID 前缀>.awsapps.com/start#
> sso_region = <地区>
> sso_registration_scopes = sso:account:access
> ```
>
> 如果还没有配置，可以通过参考 [Configure the AWS CLI to use IAM Identity Center token provider credentials with automatic authentication refresh - AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html) 文档进行配置。
>
> 想要了解更多有关 AWS CLI 和 SSO 的信息，可以阅读这份文档：[Configure the AWS CLI to use AWS IAM Identity Center - AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)

> [!WARNING] 请先确保你已经登录到了期望使用的 Profile 的 SSO
>
> 想要确认是否已经登录，可以通过
>
> ```shell
> aws sts get-caller-identity
> ```
>
> 命令来了解，会输出这样的结果：
>
> ```shell
> $ aws sts get-caller-identity
> {
>     "UserId": "<ID>",
>     "Account": "<Account ID>",
>     "Arn": "arn:aws:iam::<Account ID>:user/<Username>"
> }
> ```
>
> 也可以通过
>
> ```shell
> aws sts get-caller-identity --query "Account" --profile <Profile 配置信息，比如 example.org-dev>
> "<账户 ID>"
> ```
>
> 来检查[^1]。

> [!TIP] 出现了 `The security token included in the request is expired` 错误？
>
> 如果出现了
>
> ```
> An error occurred (ExpiredToken) when calling the GetCallerIdentity operation: The security token included in the request is expired
> ```
>
> 这样的错误，可以通过
>
> ```shell
> unset AWS_SESSION_TOKEN AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
> ```
>
> 清空可能存在的任何环境变量，然后重新载入一个命令行窗口，然后再次使用
>
> ```shell
> aws sso login --profile <Profile 名称>
> ```
>
> 登录后再次检查
>
> ```shell
> aws sts get-caller-identity
> ```
>
> 来了解是否登录成功

## 推送到 Public Repository（公开仓库）

首先，在 ECR 中建立 Repository，可以通过 AWS Console，Terraform，或者 AWS CLI 建立。

> [!TIP] 通过 AWS CLI 建立 Repository
>
> ```shell
> aws ecr-public create-repository --repository-name `<仓库名称>` > --region `<地区>`
> ```

推送前，登录 `docker` CLI：

```shell
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
```

> [!WARNING]
>
> 注意上面的命令中的：
>
> 1. 命令是 `aws ecr-public` 而不是平时操作 ECR 的 `aws ecr`[^2]；
> 2. `--region us-east-1` 不要修改为自己 AWS 账户的区域，所有的 Public > > Repository（公开仓库）都是 AWS 托管在 `us-east-1` 区域中的。[^2]

然后用 `docker` CLI 直接重新给镜像打一下标签就好了：

```shell
docker tag grafana:latest public.ecr.aws/<账户分配给的前缀 ID，需要到 AWS Console 上获取一下>/grafana:latest
```

然后

```shell
docker push public.ecr.aws/<账户分配给的前缀 ID，需要到 AWS Console 上获取一下>/grafana:latest
```

就完成了。

## 推送到 Private Repository（私有仓库）

首先，在 ECR 中建立 Repository，可以通过 AWS Console，Terraform，或者 AWS CLI 建立。

> [!TIP] 通过 AWS CLI 建立 Repository
>
> ```shell
> aws ecr create-repository --repository-name `<仓库名称>` --region `<地区>`
> ```

推送前，登录 `docker` CLI：

```
aws ecr get-login-password --region <区域> | docker login --username AWS --password-stdin <Account ID>.dkr.ecr.<区域>.amazonaws.com
```

然后用 `docker` CLI 直接重新给镜像打一下标签就好了：

```shell
docker tag grafana:latest <Account ID>.dkr.ecr.<区域>.amazonaws.com/grafana:latest
```

然后

```shell
docker push <Account ID>.dkr.ecr.<区域>.amazonaws.com/grafana:latest
```

就完成了。
## 延伸阅读

- [How to switch profiles using AWS CLI | Towards the Cloud](https://towardsthecloud.com/aws-cli-switch-profiles)
- [ecr-public — AWS CLI 2.15.25 Command Reference](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ecr-public/index.html?highlight=ecr%20public)
- [ecr — AWS CLI 2.15.25 Command Reference](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ecr/index.html?highlight=ecr)

[^1]: 是 [amazon web services - How to check if AWS CLI SSO is logged in - Stack Overflow](https://stackoverflow.com/questions/73029532/how-to-check-if-aws-cli-sso-is-logged-in) 介绍到的方法。
[^2]: 我原本自作聪明，以为是 AWS 的文档 [Amazon ECR public registries - Amazon ECR Public](https://docs.aws.amazon.com/AmazonECR/latest/public/public-registries.html#public-registry-auth)写错了，后来一直都无法找到能够验证和获取 `docker login` 使用的密码，直到我在 [amazon web services - Could not connect to the endpoint URL: "https://api.ecr-public.xxxxxxxxx.amazonaws.com/" - Stack Overflow](https://stackoverflow.com/questions/69274998/could-not-connect-to-the-endpoint-url-https-api-ecr-public-xxxxxxxxx-amazona) 看到有大佬分享说是因为 Public Repository（公开仓库）是使用的 `aws ecr-public` 命令而不是 `aws ecr` 命令，区域也只有 `us-east-1` 才恍然大悟。
