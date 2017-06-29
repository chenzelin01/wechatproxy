var restify = require('restify');
var builder = require('botbuilder');
const http = require('http');
const url = require('url');
const port = 3000;
const hostname = '0.0.0.0';
var retString = 'no return'

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || port, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '681082c9-6918-4e11-b816-135455a1c40d',
    appPassword: 'yhv3vFbCvFtePMr92OaeTHT'
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
var url_ = 'http://test.sysubot.tk?q=' + require('querystring').escape(session.message.text);
    console.log(url_);
    const request = http.get(url_, (respond) => {
        respond.on('data', (chunk) => {
        console.log(`响应主体: ${chunk}`);
        retString = chunk
        session.send("%s", retString);
      });
    });
    request.on('error', (e) => {
      console.error(`请求遇到问题: ${e.message}`);
      session.send("%s", '稍等一会，bot正在寻求帮助');
    });

});

//const server = http.createServer(function(req, res){
//
//});
//server.listen(port, hostname, () => {
// console.log(`Server running at http://${hostname}:${port}/`);
//});