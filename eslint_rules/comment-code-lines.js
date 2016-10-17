	/**
	 * @fileoverview Ratio of comment lines to code lines.
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
			schema: []
		},
		create: function(context) {
	
			var location = {};
			location.Sourcelocationation = {};
			location.Sourcelocationation.start = {};
			location.Sourcelocationation.end = {};
			location.Sourcelocationation.start.line = 1;
			location.Sourcelocationation.start.column = 1;
			location.Sourcelocationation.end.line = 1;
			location.Sourcelocationation.end.column = 1;

			var comments = context.getAllComments();
			var commentLinecount = 0;
			
			for(var i=0; i<comments.length; i++){
				if(comments[i].type == "Line") commentLinecount ++;
				else commentLinecount += comments[i].value.split(/\r\n|\r|\n/).length;
			}
			
			commentLinecount = commentLinecount * 1.0;
			var codeLineCount = context.getSourceCode().lines.length - commentLinecount;
			var ratio = commentLinecount/codeLineCount;
			
			context.report({
				loc : location,
				message: "Comment lines - (" + commentLinecount + "). Code lines - (" +  codeLineCount + "). Ratio - " + parseFloat(ratio.toFixed(4))
			});
			return {};
		}
	};