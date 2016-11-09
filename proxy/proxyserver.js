var http = require('http');
var httpProxy = require('http-proxy')

var options = {};
var proxy   = httpProxy.createProxyServer(options);


// Redirect 1/3rds of request to canary
var counter = 0;
var proxyServer  = http.createServer(function(req, res)
{
	console.log(req.url);
	if(counter%3 == 0)
		proxy.web( req, res, {target: "http://162.243.23.35:50101" } );
	else 
		proxy.web( req, res, {target: "http://162.243.23.35:50100" } );
	counter++;
});

proxyServer.listen(8000);