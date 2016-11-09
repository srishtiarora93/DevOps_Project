var http = require('http');
var httpProxy = require('http-proxy')

var options = {};
var proxy   = httpProxy.createProxyServer(options);

var targets = ["http://162.243.23.35:50101", "http://162.243.23.35:50100" ];

// Redirect 1/3rds of request to canary
var counter = 0;
var proxyServer  = http.createServer(function(req, res)
{
	console.log(req.url);
	if(counter%3 == 0) 
		proxy.web( req, res, {target: targets[0] } );
	else 
		proxy.web( req, res, {target: targets[1] } );
	
	// Do not redirect to canary if receive a 500
	proxy.on('proxyRes', function (proxyRes, req, res) {
		if(proxyRes.statusCode == 500){
			targets[0] = targets[1];
		};
	});
	counter++;
});

proxyServer.listen(8000);