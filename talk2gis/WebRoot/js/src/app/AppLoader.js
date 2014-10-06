define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-geometry",
	"dojo/dom-style",
	
	"dijit/registry",
	"dijit/layout/TabContainer",
	"dijit/layout/StackContainer",
	
	"talk2js/gis/MapPane",
	"app/PaneContainer",
	"app/alarm/AlarmModule",
	"app/poiquery/PoiQueryModule",
	"app/drawgraph/DrawGraphModule"
], function(declare, lang, dom, domGeom, domStyle, registry, TabContainer, StackContainer, 
		MapPane, PaneContainer, AlarmModule, PoiQueryModule, DrawGraphModule) {

	return declare([], {

		constructor: function(args) {
            var paneContainer = new PaneContainer({
            	id: "paneContainer",
            	paneControllerId: "paneController"
            }, "paneContainer");
            paneContainer.startup();
            
			// 添加主地图
            var mapPane = new MapPane({
				id: "mainMapPane",
				title: "主地图",
				closable: false,
				type: "MapABC"
			});
			paneContainer.addChild(mapPane);
			
			new AlarmModule();
			new PoiQueryModule({
				mapPane: mapPane
			});
			new DrawGraphModule({
				mapPane: mapPane
			});
		}

	});

});
