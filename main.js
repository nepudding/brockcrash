var http = require('http')
var fs = require('fs')

var server = http.createServer();
server.on('request',doRequest);
server.listen(8080);
console.log('Server running\nPort: '+server.address().port);

function doRequest(req,res){
    var url = req.url;
    var tmp = url.split('.');
    var ext = tmp[tmp.length - 1];
    var path = '.' + url;
    console.log(path);
    switch(ext){
        case('js'):
            fs.readFile(path, function(err,data){
                res.writeHead(200,{"Content-Type":"text/javascript"});
                res.write(data,'UTF-8');
                res.end();
            });
            break;
        case('/'):
            fs.readFile('./main.htm', function(err,data){
                res.writeHead(200,{"Content-Type":"text/html"});
                res.write(data,'UTF-8');
                res.end();
            });
            break;
    }
}