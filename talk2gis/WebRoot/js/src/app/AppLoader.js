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
			var height = document.body.clientHeight - $("#header").height() - $("#footer").height();
			
			$("#paneContainer").css({
				"height": height + "px", 
				"width": "100%",
				"position": "absoulte",
				"z-index": "10",
				"left": "0px",
				"top": $("#header").height() + "px"
			});
			
            var paneContainer = new StackContainer({}, "paneContainer");
            paneContainer.startup();
            
            $(window).resize(function(){
            	var height = document.body.clientHeight - $("#header").height() - $("#footer").height();
            	$("#paneContainer").css("height", height);
            	paneContainer.resize();
            });
            
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
				console.debug(mapPane1);
			});
			
			//mapPane.mapTool.testDrawTrace();
			//mapPane.mapTool.testDrawTrace();
		}

	});

});
