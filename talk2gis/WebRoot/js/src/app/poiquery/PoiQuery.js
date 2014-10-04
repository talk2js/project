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
        	
        	on(this.queryNode, "click", lang.hitch(this, function(){
        		this.mapPane.poi.queryPoiByCenterPoint({
        			keyword: "游乐场",
        			range: 2000,
        			lon: 13516149.5,
        			lat: 3656365.2
        		});
        	}));
        },
        
        resize: function(){
        	this.tabContainerNode.resize();
        },
        
        startup: function () {
            this.inherited(arguments);
        },
        
        destroy: function () {
        	this.inherited(arguments);
        }
        
    });
	
});