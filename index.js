const http = require('http');

const hostname = '0.0.0.0';
const port = 80;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
  return res.end('Hello World\n');
});

server.listen(process.env.PORT || 5000, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});


