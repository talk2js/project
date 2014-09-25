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
            	id: "paneContainer"
            }, "paneContainer");
            paneContainer.startup();
            
			// 添加主地图
			var mapPane = new MapPane({
				title: "地图监控",
				closable: false,
				type: "MapABC"
			});
			paneContainer.addChild(mapPane);
			
			var mapPane1 = new MapPane({
				title: "测试地图",
				closable: false,
				type: "MapABC"
			});
			paneContainer.addChild(mapPane1);
			
			$("#button1").click(function () { 
				paneContainer.selectChild(mapPane1);
			});
			
			$("#button2").click(function () { 
				paneContainer.selectChild(mapPane);
			});
			
			//mapPane.mapTool.testDrawTrace();
			//mapPane.mapTool.testDrawTrace();
		}

	});

});
