if(window.DEBUG==undefined )window.DEBUG = true;
var JSWikiDoc = {
	html : "",
	htmlpre : "",
	htmlmethods : "",
	htmlPagePrefix : '<!DOCTYPE html PUBLIC "-"http://www.w3.org/TR/html4/strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head></head><body>',
	htmlPageSuffix : "</body></html>",
	ids : {
		convertButton : "convertButton",
		inputJS : "inputJS",
		preview : "preview",
		outputJS : "outputJS"
	},
	copy:
	{
	parameters:"Parameters",
	methodList:"Method List",	
	methods:"Methods"	
	},
	/* @method: init
	 * @desc: this is the initialisation function
	 *
	 */
	init : function() {
		if (DEBUG && window.console)
			console.log(this);
		var root = this;
		Utensil.addListener(document.getElementById(this.ids.convertButton), "click", function(event) {
			root.onConvertClicked(event);
		});

	},
	/* @method: onConvertClicked
	 * @desc: this is the click  function
	 * @paramName: event
	 * @paramDesc: this will be the trigger event
	 * @paramName: Test
	 * @paramDesc: Test Desc
	 */
	onConvertClicked : function(event) {
		this.htmlmethods= "";
		var input = document.getElementById(this.ids.inputJS);
		
		if (input.value == "" || input.value == " ")
			return;
		//console.log(input.value);
		var str = input.value.replace(/(\r\n|\n|\r)/gm, "<br>");
		var comments = str.match(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g);
		this.createPrefix();
		this.createMethodArea();
		for (var a = 0; a < comments.length; a++) {
			this.addToPre(comments[a]);

			this.addToMethods(comments[a]);

		}
		this.htmlpre += "</ul>";

		this.addToPage();
	},
	addToPre : function(method) {
		method = this.getSpecial(method, "method", true);
		method = "<li class='methodLi'><a href='#method-" + method + "' >" + method + "</a></li>";
		this.htmlpre += method;
	},
	getSpecial : function(str, val, nospace, mutiple) {
		var reg = new RegExp("@" + val + "(.*?)<br>", "gi");

		var spec = str.match(reg);
		if (spec) {
			if (mutiple) {
				for (var a = 0; a < spec.length; a++) {
					spec[a] = spec[a].replace("@" + val + ":", "");
					spec[a] = spec[a].replace("<br>", "");
					if (nospace)
						spec[a] = spec[a].replace(/\s/g, "");
						
				}
				return spec;
			} else {
				spec[0] = spec[0].replace("@" + val + ":", "");
				spec[0] = spec[0].replace("<br>", "");
				if (nospace)
					spec[0] = spec[0].replace(/\s/g, "");
				return spec[0];
			}

		}

	},
	addToMethods : function(comment) {
		var method = this.getSpecial(comment, "method", true);
		var desc = this.getSpecial(comment, "desc", false);
		var paramNames = this.getSpecial(comment, "paramName", true, true);
		var paramDescs = this.getSpecial(comment, "paramDesc", false, true);
		var str = "<hr><h1 class='methodName' id='method-" + method + "'>" + method + "</h1>";
		str += "<p class='desc'>" + desc + "</p>";
		if (paramNames) {
		str += "<h2>" +this.copy.parameters + "</h2>";
			for (var a = 0; a < paramNames.length; a++) {
				str += "<p class='parameters'><span class='paramName'>" + paramNames[a] + "</span> : " + (paramDescs[a] ? paramDescs[a] : "") + "</p>";
			}
		}

		this.htmlmethods += str;
	},
	createPrefix : function() {
		this.htmlpre = "<h1 class='methodlistTitle'>"+this.copy.methodList+"</h1><ul class='methodlist'>";
	},
	createMethodArea : function() {
		this.htmlmethods = "<h1 class='methodsTitle'>"+this.copy.methods+"</h1>";
	},
	addToPage : function() {
		
		document.getElementById(this.ids.preview).innerHTML = (this.htmlpre + this.htmlmethods);
		var output = document.getElementById(this.ids.outputJS);
		output.value = (this.htmlPagePrefix+this.htmlpre + this.htmlmethods+this.htmlPageSuffix);
	}
};
(function(window) {
	function Main() {
		if (window.addEventListener) {
			window.addEventListener("load", onLoad);
		} else {
			window.attachEvent("onload", onLoad);
		}

	}

	function onLoad() {
		JSWikiDoc.init();
	}

	Main();
}
)(window);
