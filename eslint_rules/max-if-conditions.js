	/**
	 * @fileoverview Rule to disallow more than max conditions in if statement
	 * @author 
	 */

	"use strict";

	//------------------------------------------------------------------------------
	// Rule Definition
	//------------------------------------------------------------------------------

	module.exports = {
		meta: {
			docs: {
				description: "max conditions in if statement",
				category: "Possible Errors",
				recommended: true
			},
			fixable: "code",
			schema: [
				{
					oneOf: [
						{
							type: "integer",
							minimum: 0
						},
						{
							type: "object",
							properties: {
								maximum: {
									type: "integer",
									minimum: 0
								},
								max: {
									type: "integer",
									minimum: 0
								}
							},
							additionalProperties: false
						}
					]
				}
			]
		},
		create: function(context) {
			
			let maxConditions = 2;

			var option = context.options[0];
			var topLevelFunctions = [];
			var functionStack = [];
			
			if (typeof option === "object" && option.hasOwnProperty("maximum") && typeof option.maximum === "number") {
				maxConditions = option.maximum;
			}
			if (typeof option === "object" && option.hasOwnProperty("max") && typeof option.max === "number") {
				maxConditions = option.max;
			}
			if (typeof option === "number") {
				maxConditions = option;
			}

			//--------------------------------------------------------------------------
			// Public API
			//--------------------------------------------------------------------------

			return {
				IfStatement: function(node) {
					// at a ReturnStatement node while going down
					//console.log(node);
					var count = 1;
					var obj = node.test;
					while(obj.type == "LogicalExpression"){
						count++;
						obj = obj.left;
					}
					
					//console.log(count);
					
					if(count > maxConditions){
						context.report(
							node,
							"This If statement has too many conditions ({{count}}). Maximum allowed is {{maxConditions}}.",
							{ count, maxConditions });
					}
				}
			};
		}
	};