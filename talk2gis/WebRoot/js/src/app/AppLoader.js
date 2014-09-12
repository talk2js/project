define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-geometry",
	"dojo/dom-style",
	
	"dijit/registry",
	"dijit/layout/TabContainer",
	"dijit/layout/StackContainer",
	
	"talk2js/gis/MapPane"
], function(declare, lang, dom, domGeom, domStyle, registry, TabContainer, StackContainer, MapPane) {

	return declare([], {

		constructor: function(args) {
			var node1 = dom.byId("menuBar");
			var node1p = domGeom.position(node1);
			var node2 = dom.byId("paneController");
			var node2p = domGeom.position(node2);
			
			var height = document.body.clientHeight - node1p.h - node2p.h;
            var paneContainer = new StackContainer({
                style: "height:" + height + "px; width:100%; margin-top:0px;"
            }, "paneContainer");
            paneContainer.startup();
            
			// 添加主地图
			var mapPane = new MapPane({
				title: "地图监控",
				closable: false,
				type: "MapABC"
			});
			paneContainer.addChild(mapPane);
		}

	});

});
