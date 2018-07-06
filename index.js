var http = require('http');
var net = require('net');
var url = require('url');
// var _host = '2d30d445.ngrok.io'
var _host = 'www.49zhe.com'
// test
function request(cReq, cRes) {
  if(cReq.url.indexOf("root.txt")){
    cRes.writeHead(200, {'Content-Type': 'text/plain'});
    cRes.end("dd2ef5f90e975a614485124a097efaba");
  } else {
    var u = url.parse(cReq.url);
    cReq.headers.host = _host;
    cReq.headers.app = "gesture";
    var options = {
        hostname : _host,
        port     : u.port || 80,
        path     : u.path,
        method     : cReq.method,
        headers     : cReq.headers
    };
    console.log(options);
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

var server = http.createServer();
server.setTimeout(60000);
server.on('request', request)
    .on('connect', connect)
    .listen(process.env.PORT || 5000, '0.0.0.0');
