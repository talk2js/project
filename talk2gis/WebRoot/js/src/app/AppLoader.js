define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-geometry",
	"dojo/dom-style",
	
	"dijit/registry",
	"dijit/layout/TabContainer",
	"dijit/layout/StackContainer",
	
	"./PaneContainer",
	"talk2js/gis/MapPane",
	"app/alarm/Alarm"
], function(declare, lang, dom, domGeom, domStyle, registry, TabContainer, StackContainer, 
		PaneContainer, MapPane, Alarm) {

	return declare([], {

		constructor: function(args) {
            var paneContainer = new PaneContainer({
            	id: "paneContainer",
            	paneControllerId: "paneController"
            }, "paneContainer");
            paneContainer.startup();
            
			// 添加主地图
			paneContainer.addChild(new MapPane({
				title: "主地图",
				closable: false,
				type: "MapABC"
			}));
			
			paneContainer.addChild(new MapPane({
				title: "测试",
				closable: true,
				type: "MapABC"
			}));
			
			paneContainer.addChild(new MapPane({
				title: "地图监控",
				closable: true,
				type: "MapABC"
			}));
			
			paneContainer.addChild(new Alarm({
				title: "告警信息管理",
				closable: true
			}));
		}

	});

});
