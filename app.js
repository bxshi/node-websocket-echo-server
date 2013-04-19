/**
 * Created with JetBrains WebStorm.
 * User: Baoxu Shi
 * Date: 13-4-18
 * Time: PM12:01
 * To change this template use File | Settings | File Templates.
 */

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(req, res){
    res.writeHead(400);
    res.end();
});

server.listen(9999, function(){
    "use strict";
    console.log('listening on port 9999');
});

var wsServer = new WebSocketServer({
    httpServer : server,
    keepalive : true,
    keepaliveInterval:20000,
    dropConnectionOnKeepaliveTimeout:true,
    keepaliveGracePeriod:10000,
    autoAcceptConnections:false
});

wsServer.on('request', function(request){
    "use strict";
    try{
        var connection = request.accept('echo', request.origin);
    }catch(err){
        console.log('connection from '+request.remoteAddress+' is rejected '+request.origin);
        request.reject('protocol not supported');
        return;
    }

    console.log(request.remoteAddress, request.origin);

    connection.on('message', function(message){
        if(message.type == 'binary'){
            connection.sendBytes(message.binaryData);
        }else{
            connection.sendUTF(message.utf8Data);
        }
        console.log('got data', message.type == 'binary' ? message.binaryData.toString() : message.utf8Data);
    });

});