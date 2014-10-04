define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/on",
    "dojo/topic",
    
    "dijit/registry",
    
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer",
    
    "./PoiQuery"
], function (declare, lang, aspect, on, topic, registry, ContentPane, TabContainer, PoiQuery) {
    
	return declare([], {
		
		mapPane: null,
		
		constructor: function (args) {
        	declare.safeMixin(this, args || {});
        	
        	if(this.mapPane){
        		topic.subscribe("poiQuery", lang.hitch(this, function(data){
    				var floatingPane = this.mapPane.createFloatingPane({
    					id: "poiQueryFloatingPane",
        				title: "兴趣点查询",
        				width: 310,
        				height: 325
        			});
    				floatingPane.addChild(new PoiQuery({
    					mapPane: this.mapPane
    				}));
    			}));
        	}
        }
        
    });
	
});