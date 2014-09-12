define([
    "dojo/_base/declare",
    'dojo/_base/lang',
    "dojo/dom",
    "dojo/on",
    "dojo/store/Memory",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "require",
    
    "dijit/registry",
    "dijit/layout/ContentPane",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./TabButton.html"
], function (declare, lang, dom, on, Memory, domStyle, domConstruct, domGeom, require, 
		registry, ContentPane, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
        templateString: template,
        	
        widgetsInTemplate: true,
        
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