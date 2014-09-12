require([
    "app/AppLoader",
    
    "dojo/ready",
    "dojo/parser",
    
	"dijit/form/Button",
	"dijit/Menu",
	"dijit/form/TextBox",
	"dijit/form/Select",
	"dijit/form/FilteringSelect",
	"dijit/form/NumberSpinner",
	"dijit/form/NumberTextBox",
	"dijit/form/DateTextBox",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/AccordionContainer",
	"dijit/layout/BorderContainer"
], function(AppLoader, ready){

	ready(function(){
		new AppLoader();
	});
	
});
