/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-3-26
*/
define([
    "dojo/_base/declare",
    'dojo/_base/array',
    "dojo/_base/lang",
    "dojo/ready",
    "dojo/on",
    "dojo/has",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/aspect",

    "./openlayers/control/Overview",
    "./openlayers/control/ZIndexManagerControl",
    "./openlayers/control/PanZoomBar",
    "./openlayers/control/MousePosition",
	"./openlayers/layer/SoGou",
	"./openlayers/layer/Tianditu",
	"./openlayers/layer/QQ",
	"./openlayers/layer/MapABC",
	"./openlayers/layer/Google"
], function (declare, array, lang, ready, on, has, domConstruct, domStyle, aspect, 
		Overview, ZIndexManagerControl, PanZoomBar, MousePosition, SoGou, Tianditu, 
			QQ, MapABC, Google) {

    var obj = declare([], {

    	getMap: function(mapNode, type) {
    		var map;
            if (type == "SoGou") {
				map = this.initSoGouMap(mapNode);
			} else if (type == "MapABC" || type == "Google" || type == "QQ") {
				map = this.initMapABCMap(mapNode);
			} else if (type == "Tianditu") {
				map = this.initTiandituMap(mapNode);
			} else {}
            return map;
        },
		
		initSoGouMap: function(mapNode){
			var map = new OpenLayers.Map({
				controls: [],
				numZoomLevels: 19
			});
			map.render(mapNode);
			var soGou = new SoGou("SoGouMap", [
				"http://p0.go2map.com/seamless1/0/174/",  
				"http://p1.go2map.com/seamless1/0/174/",    
				"http://p2.go2map.com/seamless1/0/174/", 
				"http://p3.go2map.com/seamless1/0/174/"], 
				{layers: "basic"}
			);
			map.addLayers([soGou]);
			map.addControl(new OpenLayers.Control.Navigation());
			map.addControl(new OpenLayers.Control.ScaleLine());
			map.zoomToMaxExtent();
			//map.zoomToExtent(new OpenLayers.Bounds(73.810358047484, -70.007414817809, 73.864603042602, -69.981665611267));
			return map;
		},
		
		initMapABCMap: function(mapNode){
			var map = new OpenLayers.Map(null, {
				controls: [],
				numZoomLevels: 19,
				units: "m",
				maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
				restrictedExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
				projection: new OpenLayers.Projection("EPSG:900913"),
				resolutions: [
				    156543.03390625,
				    78271.516953125,
					39135.7584765625,
					19567.87923828125,
					9783.939619140625,
					4891.9698095703125,
					2445.9849047851562,
					1222.9924523925781,
					611.4962261962891,
					305.74811309814453,
					152.87405654907226,
					76.43702827453613,
					38.218514137268066,
					19.109257068634033,
					9.554628534317017,
					4.777314267158508,
					2.388657133579254,
					1.194328566789627,
					0.5971642833948135
				]
			});
			map.render(mapNode);
			
			var abc = new MapABC("MapABC", [
				"http://emap0.mapabc.com/mapabc/maptile?", 
				"http://emap1.mapabc.com/mapabc/maptile?",
				"http://emap2.mapabc.com/mapabc/maptile?",
				"http://emap3.mapabc.com/mapabc/maptile?"],
				{
					isBaseLayer: true,
					sateTiles: false
				}
			);
			
			var traffic = new MapABC("traffic", 
				["http://tm.mapabc.com/trafficengine/mapabc/traffictile?"],
				{
					isBaseLayer: false,
					isTraffic: true,
					sateTiles: false,
					visibility: false
				}
			);
			
			var google = new Google("Google", [
				"http://mt0.google.cn/vt/lyrs=m@142", 
				"http://mt1.google.cn/vt/lyrs=m@142",
				"http://mt2.google.cn/vt/lyrs=m@142",
				"http://mt3.google.cn/vt/lyrs=m@142"],
				{
					isBaseLayer: true
				}
			);
			
			var qq = new QQ("QQ地图", [
				"http://p0.map.soso.com/maptilesv2/", 
				//http://p0.map.soso.com/sateTiles/ 卫星图
				//http://p0.map.soso.com/sateTranTiles/ 卫星图标注
				"http://p1.map.soso.com/maptilesv2/",
				"http://p2.map.soso.com/maptilesv2/",
				"http://p3.map.soso.com/maptilesv2/"],
				{
					isBaseLayer: true,
					sateTiles: false
				}
			);
			
			map.addLayers([google, abc, traffic, qq]);
			// 添加地图控件
			map.addControl(new OpenLayers.Control.Navigation());
			map.addControl(new OpenLayers.Control.ScaleLine());
			//map.addControl(new MousePosition());
			//map.addControl(new OpenLayers.Control.LayerSwitcher());
			//map.addControl(new PanZoomBar());
			map.addControl(new Overview({
	            size: {
	                w: 200,
	                h: 180
	            },
	            maximized: false,
	            autoPan: true
	        }));
			//map.addControl(new ZIndexManagerControl());
			var center = new OpenLayers.LonLat(11983491.5, 4217489.5);
			map.moveTo(center, 4);
			
			return map;
		},
		
		initTiandituMap: function(mapNode){
			var map = new OpenLayers.Map({
				controls: [],
				numZoomLevels: 19
			});
			map.render(mapNode);
			var tianditulayer = new Tianditu("底图", "http://tile1.tianditu.com/DataServer", { 
				mapType: "底图",
				mirrorUrls:[
					"http://t0.tianditu.com/DataServer",
					"http://t1.tianditu.com/DataServer",
					"http://t2.tianditu.com/DataServer",
					"http://t3.tianditu.com/DataServer",
					"http://t4.tianditu.com/DataServer",
					"http://t5.tianditu.com/DataServer",
					"http://t6.tianditu.com/DataServer"
				],
				isBaseLayer: true
			});
			
			var layer1 = new Tianditu("中文标注", "http://tile1.tianditu.com/DataServer", { 
				mapType: "中文标注",
				mirrorUrls:[
					"http://t0.tianditu.com/DataServer",
					"http://t1.tianditu.com/DataServer",
					"http://t2.tianditu.com/DataServer",
					"http://t3.tianditu.com/DataServer",
					"http://t4.tianditu.com/DataServer",
					"http://t5.tianditu.com/DataServer",
					"http://t6.tianditu.com/DataServer"
				],
				isBaseLayer: false
			});
			
			map.addLayers([tianditulayer, layer1]);
			map.addControl(new OpenLayers.Control.Navigation());
			map.addControl(new OpenLayers.Control.ScaleLine());
			map.zoomToMaxExtent();
			return map;
		}

    });
    
    return new obj();
    
});