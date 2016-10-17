var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var faker = require("faker");
var fs = require("fs");
faker.locale = "en";
var mock = require('mock-fs');
var _ = require('underscore');
var Random = require('random-js');

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
		args = ["climbing-grade.js"];
	}
	var filePath = args[0];
	

	constraints(filePath);

	generateTestCases(filePath);
}

var engine = Random.engines.mt19937().autoSeed();

function createConcreteIntegerValue( greaterThan, constraintValue )
{
	if( greaterThan )
		return Random.integer(constraintValue,constraintValue+10)(engine);
	else
		return Random.integer(constraintValue-10,constraintValue)(engine);
}

function Constraint(properties)
{
	this.ident = properties.ident;
	this.expression = properties.expression;
	this.operator = properties.operator;
	this.value = properties.value;
	this.funcName = properties.funcName;
	// Supported kinds: "fileWithContent","fileExists"
	// integer, string, phoneNumber
	this.kind = properties.kind;
}

function fakeDemo()
{
	console.log( faker.phone.phoneNumber() );
	console.log( faker.phone.phoneNumberFormat() );
	console.log( faker.phone.phoneFormats() );
}

var functionConstraints =
{
}

var mockFileLibrary = 
{
	pathExists:
	{
		'path/fileExists': {}
	},
	pathWithFileExists:
	{
		'path/fileExists':
		{
			file1: '',
		}
	},
	fileWithContent:
	{
		pathContent: 
		{	
  			file1: 'text content',
		}
	},
	fileWithoutContent:
	{
		pathContent: 
		{	
  			file1: '',
		}
	}
};

function generateTestCases(filePath)
{

	var content = "var ClimbingGrade = require('./"+ filePath +"');\n";
	for ( var funcName in functionConstraints )
	{
		var params = {};

		// initialize params
		for (var i =0; i < functionConstraints[funcName].params.length; i++ )
		{
			var paramName = functionConstraints[funcName].params[i];
			//params[paramName] = '\'' + faker.phone.phoneNumber()+'\'';
			params[paramName] = [];
		}

		//console.log( params );

		// update parameter values based on known constraints.
		var constraints = functionConstraints[funcName].constraints;
		
		if(!constraints || constraints.length == 0) continue;
	
		content += ""
	
		// plug-in values for parameters
		
		
		for( var c = 0; c < constraints.length; c++ )
		{
			var constraint = constraints[c];
			if(params[constraint.ident] == undefined) params[constraint.ident] = [];
			params[constraint.ident].push(constraint.value);
		}

		
		for(var i=0; i<params["systemName"].length; i++){
					
			content += "\nvar grade = new ClimbingGrade('{0}','{1}');\n".format(params["firstValue"][i], params["systemName"][i]);
			
			for(var j=0; j<params["systemName"].length; j++){
				if(i != j){
					content += "grade.format('{0}');\n".format(params["systemName"][j]);
				}
			}
		}
		
	}

	fs.writeFileSync('test.js', content, "utf8");

}

function paramPermutations(arr) {
	
	if (arr.length == 1) 
	{
		return arr[0];
	} 
    
	var result = [];
    var rest = paramPermutations(arr.slice(1)); 
    for (var i = 0; i < rest.length; i++) 
	{
		for (var j = 0; j < arr[0].length; j++) 
		{
			result.push(arr[0][j] +  "," + rest[i]);
		}
    }
    
	return result;
}

function generateMockFsTestCases (pathExists, pathWithFileExists, fileWithContent, fileWithoutContent, funcName,args) 
{
	var testCase = "";
	// Build mock file system based on constraints.
	var mergedFS = {};
	if( pathWithFileExists )
	{
		for (var attrname in mockFileLibrary.pathWithFileExists) { mergedFS[attrname] = mockFileLibrary.pathWithFileExists[attrname]; }
	} else if( pathExists )
	{
		for (var attrname in mockFileLibrary.pathExists) { mergedFS[attrname] = mockFileLibrary.pathExists[attrname]; }
	}
	
	if( fileWithContent )
	{
		for (var attrname in mockFileLibrary.fileWithContent) { mergedFS[attrname] = mockFileLibrary.fileWithContent[attrname]; }
	} else if (fileWithoutContent) {
		for (var attrname in mockFileLibrary.fileWithoutContent) { mergedFS[attrname] = mockFileLibrary.fileWithoutContent[attrname]; }
	}

	testCase += 
	"mock(" +
		JSON.stringify(mergedFS)
		+
	");\n";

	testCase += "\tsubject.{0}({1});\n".format(funcName, args );
	testCase+="mock.restore();\n";
	return testCase;
}

function constraints(filePath)
{
   console.log(filePath);
   console.log(options);
   var buf = fs.readFileSync(filePath, "utf8");
   console.log(buf);
  // var syntax = esprima.parse('var answer = 42',options);
   //console.log(JSON.stringify(syntax, null, 4));
   var result;
   
    result = esprima.parse(buf, options);
	
	console.log("result");
	traverse(result, function (node) 
	{
		if (node.type === 'FunctionDeclaration') 
		{
			var funcName = functionName(node);
			console.log("Line : {0} Function: {1}".format(node.loc.start.line, funcName ));

			var params = node.params.map(function(p) {return p.name});

			functionConstraints[funcName] = {constraints:[], params: params};

			// Check for expressions using argument.
			traverse(node, function(child)
			{
				if( child.type === 'ExpressionStatement' && child.expression.left.property.name == "_systems")
				{
					var systems = child.expression.right.properties;
					
					for(var i=0; i<systems.length; i++){
						
						var systemName = systems[i].key.name;
						var firstValue = undefined;
						
						for(var j=0; j<systems[i].value.properties.length; j++){
							if(systems[i].value.properties[j].key.name == "grades"){
								firstValue = systems[i].value.properties[j].value.elements[0].value;
							}
						}
						
						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: "systemName",
								value: systemName,
								funcName: funcName,
								kind: "string",
								operator : "=",
								expression: ""
							}), 
							new Constraint(
							{
								ident: "firstValue",
								value: firstValue,
								funcName: funcName,
								kind: "string",
								operator : "=",
								expression: ""
							})
						);
					}
				}
			});

			console.log( functionConstraints[funcName]);

		}
	});
}

function traverse(object, visitor) 
{
    var key, child;

    visitor.call(null, object);
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function traverseWithCancel(object, visitor)
{
    var key, child;

    if( visitor.call(null, object) )
    {
	    for (key in object) {
	        if (object.hasOwnProperty(key)) {
	            child = object[key];
	            if (typeof child === 'object' && child !== null) {
	                traverseWithCancel(child, visitor);
	            }
	        }
	    }
 	 }
}

function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "";
}


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();
