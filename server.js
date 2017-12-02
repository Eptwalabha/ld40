var ns = require('node-static'),
    http = require('http');

var webroot = './dist',
    port = 9080;

var file = new (ns.Server)(webroot, {});

console.log("listening on port", port);
http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(port);