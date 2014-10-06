define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/on",
    "dojo/topic",
    
    "dijit/registry",
    
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer",
    
    "./DrawGraph"
], function (declare, lang, aspect, on, topic, registry, ContentPane, TabContainer, DrawGraph) {
    
	return declare([], {
		
		mapPane: null,
		
		constructor: function (args) {
        	declare.safeMixin(this, args || {});
        	
        	if(this.mapPane){
        		topic.subscribe("drawGraph", lang.hitch(this, function(data){
    				var floatingPane = this.mapPane.createFloatingPane({
    					id: "drawGraphFloatingPane",
        				title: "绘制图形",
        				width: 310,
        				height: 325,
        				titleIcon: "editTitleIcon"
        			});
    				
    				floatingPane.addChild(new DrawGraph({
    					mapPane: this.mapPane
    				}));
    				
    			}));
        	}
        }
        
    });
	
});