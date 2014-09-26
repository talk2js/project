define([
    "dojo/_base/declare",
    'dojo/_base/lang',
    "dojo/dom",
    "dojo/on",
    "dojo/Evented",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "require",
    
    "dijit/layout/ContentPane",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./Alarm.html"
], function (declare, lang, dom, on, Evented, domStyle, domConstruct, domGeom, require, 
		ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    
	return declare([ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
		
        templateString: template,
        	
        widgetsInTemplate: true,
        
        baseClass: "appPane",
        
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