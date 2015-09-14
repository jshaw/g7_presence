var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/camera', function(req, res, next) {
    res.sendFile(__dirname + '/camera.html');
});

server.listen(4200);

var refer = {
    physical: [],
    remote: []
};

io.sockets.on('connection', function(client) {
    var referer;
    client.on('join', function(data) {
        console.log('join', data);
        client.emit('messages', 'Hello from server');

        setInterval(function(){
            // console.log('timer');

            client.emit('messages', { 
                physical: refer.physical.length,
                remote: refer.remote.length,
                rgb: getRGB(refer.remote.length, refer.physical.length)
            });
        }, 1000);
    });

    client.on('disconnect', function () {
        client.emit('user disconnected');
        io.emit('user disconnected');
        console.log('user disconnected');

        console.log('refer', refer);
        console.log('referer', referer);

        var i = refer[referer].indexOf(client);
        console.log('i', i);
        console.log('refer[referer]', refer[referer]);
        console.log('refer[referer] length', refer[referer].length);
        console.log('refer[referer][i]', refer[referer][i]);
        refer[referer].splice(i, 1);
        console.log('refer[referer]', refer[referer]);
        console.log('refer[referer] length', refer[referer].length);


    });

    client.on('messages', function(data) {
        console.log('messages', data);
        
        referer = data;

        if (data === 'physical'){
            refer.physical.push(client);
        } else {
            refer.remote.push(client);
        }

        console.log('physical', refer.physical.length);
        console.log('remote', refer.remote.length);
        client.emit('broad', data);
        client.broadcast.emit('broad',data);
    });

});

function getRGB(remoteLength, physicalLength) {
    var rgb;
    var total = remoteLength + physicalLength;
    var red = ( physicalLength / total) * 255;
    var blue = ( remoteLength / total ) * 255;
    rgb = 'rgb(' + Math.floor(red) + ', 0,' + Math.floor(blue) + ')';
    return rgb;
}