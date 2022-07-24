```nginx
server {
        listen 80;
        server_name art.neve.co;
        return 301 https://neve.co$request_uri;
}
server {
        listen 443 ssl http2;
        server_name art.neve.co;

        ssl_certificate /etc/ssl/certs/neve.co.fullchain.pem;
	ssl_certificate_key /etc/ssl/private/neve.co.privkey.pem;
        ssl_prefer_server_ciphers on;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

	location /api/ {
		if ($request_method = 'OPTIONS') {
        		add_header 'Access-Control-Allow-Origin' 'https://neve.co';
        		#
        		# Om nom nom cookies
       			#

			add_header 'Access-Control-Allow-Credentials' 'true';
        		add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, HEAD';

			#
        		# Custom headers and headers various browsers *should* be OK with but aren't
        		#

			add_header 'Access-Control-Allow-Headers' 'Origin, Content-Length, Content-Type, Credential, Cookie, Authorization, X-Accept-Language-Code, X-HTTP-Method-Override';
        		#
        		# Tell client that this pre-flight info is valid for 20 days
        		#
        		add_header 'Access-Control-Max-Age' 1728000;
        		add_header 'Content-Type' 'text/plain charset=UTF-8';
        		add_header 'Content-Length' 0;
        		return 204;
     		}

		proxy_set_header X-Forwarded-For $remote_addr;
		proxy_set_header X-Real-IP $remote_addr;
    		proxy_set_header Host $http_host;
    		proxy_redirect off;
    		proxy_pass http://172.17.233.42:2100;

    		client_max_body_size 200m;
	}

	location /webhook/ {
		proxy_set_header X-Forwarded-For $remote_addr;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header Host $http_host;
		proxy_redirect off;
		proxy_pass http://172.17.233.42:2100;

		client_max_body_size 200m;
	}

	location /admin/ {
		rewrite  ^/admin/(.*) /$1 break;
		return 301 https://neve.co$request_uri;
	}

	location /site.webmanifest {
		proxy_pass http://172.17.233.42:2200;
	}

	location /sw.js {
		proxy_pass http://172.17.233.42:2200;
	}

	location / {
		return 301 https://neve.co$request_uri;
	}
}
```