var http = require('http');
var net = require('net');
var url = require('url');

function request(cReq, cRes) {
    var u = url.parse(cReq.url);
    var options = {
        hostname : '7c787daa.ngrok.io',
        port     : u.port || 80,
        path     : u.path,
        method     : cReq.method,
        headers     : {host: '7c787daa.ngrok.io'}
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

http.createServer().on('request', request).listen(80, '0.0.0.0');