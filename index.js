/*jshint esversion: 6 */
const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const prompt = require('prompt');

const app = express();

app.use(function(req, res) {
    res.send({
        msg: "hello"
    });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({
    server
});

wss.on('connection', function connection(ws) {
    const location = url.parse(ws.upgradeReq.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    console.log('Connection established');
    msgInput();
    ws.send('Hello, welcome to the group chat.');
    // console.log(ws);

    function msgInput(){
        prompt.start();
        prompt.get(['message'], function(err, result) {
            ws.send(result.message);
            console.log('sendt: %s', result.message);
            msgInput();
            return;
        });
    }

    ws.on('message', function incoming(message) {
        prompt.pause();
        console.log('\nreceived: %s', message);
        prompt.resume();
    });

    //ws.send('something');
    ws.on('close', function(){
        console.log('disconnected');
    });
});


server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});
