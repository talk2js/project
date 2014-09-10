define([
    "dojo/_base/declare",
    'dojo/_base/lang',
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "require",
    
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dijit/form/VerticalSlider",
    "dijit/form/VerticalRule"
], function (declare, lang, on, domConstruct, domStyle, domGeom, require, 
		_WidgetBase, _TemplatedMixin, VerticalSlider, VerticalRule) {
    
	return declare([_WidgetBase, _TemplatedMixin], {
		
        templateString: '<div></div>',

        map: null,
        
        slider: null,
        
        postCreate: function () {
            this.inherited(arguments);
            
            this.map.div.appendChild(this.domNode);
            domStyle.set(this.domNode, {
            	position: "absolute",
            	zIndex: 999,
        		left: "30px",
        		top: "50px"
        	});
            
            var node = document.createElement('div');
            this.domNode.appendChild(node);
            this.slider = new VerticalSlider({
                name: "vertical",
                value: this.map.zoom,
                minimum: 0,
                maximum: this.map.numZoomLevels - 1,
                discreteValues: this.map.numZoomLevels,
                intermediateChanges: false,
                style: "height:240px;",
                onChange: lang.hitch(this, function(value){
                	this.map.zoomTo(value);
                })
            }, node);
            this.slider.startup();
            
            var rule = new VerticalRule({
                count: this.map.numZoomLevels,
                style: "width:5px;"
            }, this.slider.containerNode);
            rule.startup();
            
            this.map.events.register("zoomend", this, this.moveZoomBar);
        },
        
    	moveZoomBar:function() {
    		this.slider.set("value", this.map.zoom);
    	}, 
        
        startup: function () {
            this.inherited(arguments);
        },
        
        destroy: function () {
        	this.inherited(arguments);
        }
        
    });
	
});