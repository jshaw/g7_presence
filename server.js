var http = require("http");
var url = require('url');
var fs = require('fs');
var path = require('path');
var sys = require('sys');

var server = http.createServer(function(request, response){
    console.log('Connection');
    var path = url.parse(request.url).pathname;

    switch(path){
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('hello world');
            break;
        case '/remote.html':
            console.log('__dirname', __dirname + path);

            var filePath = path.join(__dirname, 'remote.html');
            
            fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data){
                if (!err){
                    console.log('received data: ' + data);
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write(data);
                    response.end();
                } else {
                    console.log(err);
                }

            });
            // fs.readFile(__dirname + path, function(error, data){
                // if (error){
            //         response.writeHead(404);
            //         response.write("opps this doesn't exist - 404");
                // } else {
                    // response.writeHead(200, {'Content-Type': 'text/html'});
                    // response.write('hello remote');
            //         response.writeHead(200, {"Content-Type": "text/html"});
            //         response.write(data, "utf8");
                // }
            // });
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            break;
    }
    response.end();
});

server.listen(8001);