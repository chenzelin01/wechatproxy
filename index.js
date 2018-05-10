var http = require('http');
var net = require('net');
var url = require('url');
var path = require('path');
const zlib = require('zlib');
const fs = require('fs');
var _host = 'a169c93a.ngrok.io';
function request(cReq, cRes) {
  var u = url.parse(cReq.url);
  if(cReq.url.indexOf("gwd") > 0){
      var gzip = zlib.createGzip();
      cRes.writeHead(200, 
        {"content-type": "text/javascript",
          "content-encoding": 'gzip',
          "Expires": new Date(Date.now() + 2592000000).toUTCString()}); 
      var filePath = path.resolve(__dirname + "/public/gwdv1.js");
      fs.createReadStream(filePath).pipe(gzip).pipe(cRes); 
  } else {
     cReq.headers.host = _host;
     cReq.headers.app = "wechat";
     var options = {
         hostname : _host,
         port     : u.port || 80,
         path     : u.path,
         method     : cReq.method,
         headers     : cReq.headers
     };
     var pReq = http.request(options, function(pRes) {
         cRes.writeHead(pRes.statusCode, pRes.headers);
         pRes.pipe(cRes);
     }).on('error', function(e) {
         cRes.end();
     });
     cReq.pipe(pReq);
  }
}
function connect(cReq, cSock) {
    var u = url.parse('http://' + cReq.url);

    // var pSock = net.connect(u.port, u.hostname, function() {
    var pSock = net.connect(u.port, _host, function() {
        cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        pSock.pipe(cSock);
    }).on('error', function(e) {
        cSock.end();
    });

    cSock.pipe(pSock);
}

http.createServer()
    .on('request', request)
    .on('connect', connect)
    .listen(process.env.PORT || 5000, '0.0.0.0');
