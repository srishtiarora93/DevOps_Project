var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var fs = require("fs");

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

var functionConstraints =
{
}

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

function constraints(filePath)
{
   var buf = fs.readFileSync(filePath, "utf8");
	var result = esprima.parse(buf, options);

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
