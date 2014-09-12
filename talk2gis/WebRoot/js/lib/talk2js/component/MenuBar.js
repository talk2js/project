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
    
    "dojo/text!./MenuBar.html"
], function (declare, lang, dom, on, Memory, domStyle, domConstruct, domGeom, require, 
		registry, ContentPane, _WidgetBase, _TemplatedMixin, template) {
    
	return declare([_WidgetBase, _TemplatedMixin], {
		
        templateString: template,
        	
        logoUrl: require.toUrl("../resources/images/logo.png"),
        
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