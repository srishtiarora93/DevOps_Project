var ClimbingGrade = require('./climbing-grade.js');

var http = require('http');
var express = require('express')
var app = express()

var server = app.listen(8000, function () {
  console.log('Server started on 8000');
});

app.use(function(req, res, next) 
{
	next(); // Passing the request to the next handler in the stack.
});

app.get('/convert/:toScale/:fromScale/:value', function(req, res) {	
  var grade = new ClimbingGrade(req.params.value, req.params.fromScale);
  res.send("Scale " + req.params.fromScale + ", value " + req.params.value + " is equivalent to '" 
		+ grade.format(req.params.toScale) + "' in " + req.params.toScale + " scale.");
});

