define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    
    "dijit/registry",
    
    "./Alarm"
], function (declare, lang, on, topic, registry, Alarm) {
    
	return declare([], {
		
		constructor: function (args) {
        	declare.safeMixin(this, args || {});
        	
        	topic.subscribe("dojoCharts", function(data){
				var paneContainer = registry.byId("paneContainer");
				var alarm = new Alarm({
					title: "Dojo图表",
					closable: true
				}); 
				paneContainer.addChild(alarm);
				paneContainer.selectChild(alarm);
			});
        }
        
    });
	
});