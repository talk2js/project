define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./PoiQuery.html"
], function (declare, lang, on, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		template) {
    
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
        templateString: template,
        	
        widgetsInTemplate: true,
        
        mapPane: null,
        
		postMixInProperties: function(){
		},
		
        postCreate: function () {
        	this.inherited(arguments);
        },
        
        startup: function () {
            this.inherited(arguments);
        },
        
        destroy: function () {
        	this.inherited(arguments);
        }
        
    });
	
});