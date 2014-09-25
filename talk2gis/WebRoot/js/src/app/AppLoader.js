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
	"./PaneContainer"
], function(declare, lang, dom, domGeom, domStyle, registry, TabContainer, StackContainer, 
		MapPane, PaneContainer) {

	return declare([], {

		constructor: function(args) {
            var paneContainer = new PaneContainer({
            	id: "paneContainer",
            	paneControllerId: "paneController"
            }, "paneContainer");
            paneContainer.startup();
            
			// 添加主地图
			var mapPane = new MapPane({
				title: "主地图",
				closable: false,
				type: "MapABC"
			});
			paneContainer.addChild(mapPane);
			
			var mapPane1 = new MapPane({
				title: "测试",
				closable: true,
				type: "MapABC"
			});
			paneContainer.addChild(mapPane1);
			
			var mapPane2 = new MapPane({
				title: "地图监控",
				closable: true,
				type: "MapABC"
			});
			paneContainer.addChild(mapPane2);
			
			var mapPane3 = new MapPane({
				title: "轨迹回放",
				closable: true,
				type: "MapABC"
			});
			paneContainer.addChild(mapPane3);
		}

	});

});
