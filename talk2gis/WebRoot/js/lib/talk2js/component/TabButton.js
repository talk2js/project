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
    
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./TabButton.html"
], function (declare, lang, dom, on, Evented, domStyle, domConstruct, domGeom, require, 
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
		
        templateString: template,
        	
        widgetsInTemplate: true,
        
        paneId: null,
        
        title: "",
        
        closable: true,
        
        closeImg: require.toUrl("../resources/images/close.png"),
        
		postMixInProperties: function(){
		},
		
		buildRendering: function(){
			this.inherited(arguments);
			
			if(this.closable){
				$(this.closeNode).css("visibility", "visible");
			} else {
				$(this.closeNode).css("visibility", "hidden");
			}
		},
		
        postCreate: function () {
        	this.inherited(arguments);
        	
        	on(this.buttonNode, "click", lang.hitch(this, function(){
        		this.emit("selectTab");
        	}));
        	on(this.closeNode, "click", lang.hitch(this, function(){
        		this.emit("closeTab");
        	}));
        },
        
        startup: function () {
            this.inherited(arguments);
        },
        
        destroy: function () {
        	this.inherited(arguments);
        }
        
    });
	
});