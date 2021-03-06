var http = require('http');
var net = require('net');
var url = require('url');
var _host = 'e1794bb1.ngrok.io'
// var _host = 'delivery.acm.org'
function request(cReq, cRes) {
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
