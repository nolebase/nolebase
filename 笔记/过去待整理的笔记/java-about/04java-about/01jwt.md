---

title: 01 jwt

---


###  一.JWT令牌
   JWT是JSON Web Token的缩写，即JSON Web令牌，是一种自包含令牌。
JWT的使用场景:
- 一种情况是webapi
- 另一种情况是多web服务器下实现无状态分布式身份验证

JWT的作用：
- JWT 最重要的作用就是对 token信息的防伪作用

JWT的原理：

- 一个JWT由三个部分组成：JWT头、有效载荷、签名哈希
- 最后由这三者组合进行base64编码得到JWT

#### 2、JWT令牌的组成

​		[https://jwt.io/](	https://jwt.io/ ) 

​		或者https://www.box3.cn/tools/jwt.html

​		该对象为一个很长的字符串，字符之间通过"."分隔符分为三个子串。每一个子串表示了一个功能块，总共有以下三个部分：JWT头、有效载荷和签名。

**JWT头**

JWT头部分是一个描述JWT元数据的JSON对象，通常如下所示。

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

​		在上面的代码中，alg属性表示签名使用的算法，默认为HMAC SHA256（写为HS256）；typ属性表示令牌的类型，JWT令牌统一写为JWT。最后，使用Base64 URL算法将上述JSON对象转换为字符串保存。

**有效载荷**

有效载荷部分，是JWT的主体内容部分，也是一个JSON对象，包含需要传递的数据。 JWT指定七个默认字段供选择。

```json
iss: jwt签发者
sub: 主题
aud: 接收jwt的一方
exp: jwt的过期时间，这个过期时间必须要大于签发时间
nbf: 定义在什么时间之前，该jwt都是不可用的.
iat: jwt的签发时间
jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。
```

除以上默认字段外，我们还可以自定义私有字段，如下例

```json
{
  "name": "Helen",
  "admin": true,
  "avatar": "helen.jpg"
}
```

请注意，默认情况下JWT是未加密的，任何人都可以解读其内容，因此不要构建隐私信息字段，存放保密信息，以防止信息泄露。

JSON对象也使用Base64 URL算法转换为字符串保存。

**签名哈希**

​	签名哈希部分是对上面两部分数据签名，通过指定的算法生成哈希，以确保数据不会被篡改。

​	首先，需要指定一个密码（secret）。该密码仅仅为保存在服务器中，并且不能向用户公开。然后，使用标头中指定的签名算法（默认情况下为HMAC SHA256）根据以下公式生成签名。

```
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(claims), secret)
```

在计算出签名哈希后，JWT头，有效载荷和签名哈希的三个部分组合成一个字符串，每个部分用"."分隔，就构成整个JWT对象。

**Base64URL算法**

如前所述，JWT头和有效载荷序列化的算法都用到了Base64URL。该算法和常见Base64算法类似，稍有差别。

作为令牌的JWT可以放在URL中（例如api.example/?token=xxx）。 Base64中用的三个字符是"+"，"/"和"="，由于在URL中有特殊含义，因此Base64URL中对他们做了替换："="去掉，"+"用"-"替换，"/"用"_"替换，这就是Base64URL算法。

**注意：**ase64编码，并不是加密，只是把明文信息变成了不可见的字符串。但是其实只要用一些工具就可以把base64编码解成明文，所以不要在JWT中放入涉及私密的信息

####  3、JWT的用法

客户端接收服务器返回的JWT，将其存储在Cookie或localStorage中。

此后，客户端将在与服务器交互中都会带JWT。如果将它存储在Cookie中，就可以自动发送，但是不会跨域，因此一般是将它放入HTTP请求的Header Authorization字段中。

当跨域时，也可以将JWT放置于POST请求的数据主体中。

#### 三、JWT问题和趋势

1、JWT默认不加密，但可以加密。生成原始令牌后，可以使用该令牌再次对其进行加密。

2、当JWT未加密时，一些私密数据无法通过JWT传输。

3、JWT不仅可用于认证，还可用于信息交换。善用JWT有助于减少服务器请求数据库的次数。

4、JWT的最大缺点是服务器不保存会话状态，所以在使用期间不可能取消令牌或更改令牌的权限。也就是说，一旦JWT签发，在有效期内将会一直有效。

5、JWT本身包含认证信息，因此一旦信息泄露，任何人都可以获得令牌的所有权限。为了减少盗用，JWT的有效期不宜设置太长。对于某些重要操作，用户在使用时应该每次都进行身份验证。

6、为了减少盗用和窃取，JWT不建议使用HTTP协议来传输代码，而是使用加密的HTTPS协议进行传输。



### 测试

```xml
 <dependencies>
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.7.0</version>
        </dependency>
        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.6</version>
        </dependency>
    </dependencies>
```

```java
@Data
public class Member {

    private String id;

    private String nickName;

    private String avatar;

}
```

```java
package org.clxmm.util;

import io.jsonwebtoken.*;
import org.clxmm.entity.Member;

import javax.print.attribute.standard.MediaSize;
import java.security.Signature;
import java.util.Date;

/**
 * @author clxmm
 * @version 1.0
 * @date 2021/2/8 4:31 下午
 */
public class JwtUtil {
    private static final long EXPIRE = 1000* 30;
    private static final String APP_SECRET = "123456";

    public static String genJwt(String id, String nickName, String avatar) {


        JwtBuilder builder = Jwts.builder();

        // 第一部分 jwt 头
        builder.setHeaderParam("alg", "HS256");  // 签名算法
        builder.setHeaderParam("type", "JWT");  // 令牌类型

        // 第二部分： 有效载荷
        // 默认字段
        builder.setId("1");
        builder.setSubject("guli-service");
        builder.setIssuedAt(new Date());
        builder.setExpiration(new Date(System.currentTimeMillis() + EXPIRE));
        // 私有字段
        builder.claim("myId",id);
        builder.claim("nickName",nickName);
        builder.claim("avatar",avatar);


        // 第三部分  签名哈希
        builder.signWith(SignatureAlgorithm.HS256,APP_SECRET);


        String token = builder.compact();

        return  token;

    }

    public static Claims checkToken (String jwt) {
        JwtParser parser = Jwts.parser();

        Jws<Claims> claimsJws = parser.setSigningKey(APP_SECRET).parseClaimsJws(jwt);

        Claims body = claimsJws.getBody();

        return body;

    }


    public static void main(String[] args) {
        Member member = new Member();

        member.setId("1");
        member.setNickName("test");
        member.setAvatar("头像");

        String jwt = genJwt(member.getId(), member.getNickName(), member.getAvatar());
        System.out.println(jwt);


        Claims claims = checkToken(
        "eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJqdGkiOiIxIiwic3ViIjoiZ3VsaS1zZXJ2aWNlIiwiaWF0IjoxNjEyNzc1Mjc3LCJleHAiOjE2MTI3NzUzMDcsIm15SWQiOiIxIiwibmlja05hbWUiOiJ0ZXN0IiwiYXZhdGFyIjoi5aS05YOPIn0.LUCrINdohvetWb7rOZB2mDPR7KyCTxQXwmDQeDAilq0"
        );
        Object id = claims.get("myId");
        String nickName = (String) claims.get("nickName");
        Object avatar = claims.get("avatar");
        System.out.println(id+"" +nickName+""+avatar);

    }
}

```

console：

eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJqdGkiOiIxIiwic3ViIjoiZ3VsaS1zZXJ2aWNlIiwiaWF0IjoxNjEyNzc4MzgzLCJleHAiOjE2MTI3Nzg0MTMsIm15SWQiOiIxIiwibmlja05hbWUiOiJ0ZXN0IiwiYXZhdGFyIjoi5aS05YOPIn0.kfULmnq3TCrCF1ULeV7dhM59ZkjrvDpXHVv9wXnrtt4
1test头像