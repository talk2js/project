define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang", 
	"require",
	"dojo/on", 
	"dojo/topic",
	
    "dijit/MenuItem",
    "dijit/MenuSeparator",
	
	"./rest/mapabc/route",
	"./util/mercator"
], function(declare, lang, require, on, topic, MenuItem, MenuSeparator, route, mercator) {

	var obj = declare([], {

		china317Map: null,
		
		STARTENDMARKER_LAYER_ID: "startEndMarkerLayer",
		
		STARTENDROUTE_LAYER_ID: "startEndRouteLayer",
		
		AVOIDREGION_LAYER_ID: "avoidRegionLayer",
		
		startImgPath: require.toUrl("./resources/images/start.png"),
		
		endImgPath: require.toUrl("./resources/images/end.png"),
		
		startMarker: null,
		
		endMarker: null,
		
		avoidRegion: null,
		
		constructor: function(args) {
			declare.safeMixin(this, args || {});
			
			topic.subscribe("china317gis/clearMap", lang.hitch(this, function(){
				this._destroyResources();
			}));
		},
		
		add2MapContextMenu: function(){
			var map = this.china317Map.map;
			var menu = this.china317Map.mapContextMenu;
			menu.addChild(new MenuSeparator());
			menu.addChild(new MenuItem({
                label: "设为起点",
                iconClass: "zoomOutIcon",
                onClick: lang.hitch(this, function (e) {
                	menu.deactivateAll();
                	// 初始化图层
                	this._initLayers();
                	// 先从图层中删除原先的点位
                	if(this.startMarker){
                		var layer = map.getLayer(this.STARTENDMARKER_LAYER_ID);
                		layer.removeMarker(this.startMarker);
                		this.startMarker.destroy();
                	}
                	var point = map.getLonLatFromPixel(this.china317Map.rightClickPixel);
                	this.startMarker = this._drawStartEndMarker(point, true);
                	// 查询导航
                	this.queryRoute();
                })
            }));
			menu.addChild(new MenuItem({
                label: "设为终点",
                iconClass: "zoomOutIcon",
                onClick: lang.hitch(this, function (e) {
                	menu.deactivateAll();
                	// 初始化图层
                	this._initLayers();
                	// 先从图层中删除原先的点位
                	if(this.endMarker){
                		var layer = map.getLayer(this.STARTENDMARKER_LAYER_ID);
                		layer.removeMarker(this.endMarker);
                		this.endMarker.destroy();
                	}
                	var point = map.getLonLatFromPixel(this.china317Map.rightClickPixel);
                	this.endMarker = this._drawStartEndMarker(point, false);
                	// 查询导航
                	this.queryRoute(map);
                })
            }));
			menu.addChild(new MenuItem({
                label: "设置避让区",
                iconClass: "polygonIcon",
                onClick: lang.hitch(this, function (e) {
                	menu.deactivateAll();
                	// 初始化图层
                	this._initLayers();
                	var layer = map.getLayer(this.AVOIDREGION_LAYER_ID);
                	layer.removeAllFeatures();
                	map.avoidRegionHandler.activate();
                })
            }));
		},
		
		_initLayers: function(){
			var map = this.china317Map.map;
			// 添加开始点和结束点的图层
			var startEndMarkerLayer = map.getLayer(this.STARTENDMARKER_LAYER_ID);
			if(!startEndMarkerLayer){
				startEndMarkerLayer = new OpenLayers.Layer.Markers(this.STARTENDMARKER_LAYER_ID);
				startEndMarkerLayer.id = this.STARTENDMARKER_LAYER_ID;
				map.addLayer(startEndMarkerLayer);
			}
			// 添加路径图层
			var routeLayer = map.getLayer(this.STARTENDROUTE_LAYER_ID);
			if(!routeLayer){
				routeLayer = new OpenLayers.Layer.Vector(this.STARTENDROUTE_LAYER_ID);
				routeLayer.id = this.STARTENDROUTE_LAYER_ID;
				map.addLayer(routeLayer);
			}
			// 添加避让区图层
			var avoidRegionLayer = map.getLayer(this.AVOIDREGION_LAYER_ID);
			if(!avoidRegionLayer){
				avoidRegionLayer = new OpenLayers.Layer.Vector(this.AVOIDREGION_LAYER_ID);
				avoidRegionLayer.id = this.AVOIDREGION_LAYER_ID;
				map.addLayer(avoidRegionLayer);
				
				// 添加绘制多边形的操作器
	            map.avoidRegionHandler = new OpenLayers.Control.DrawFeature(avoidRegionLayer, OpenLayers.Handler.Polygon, {
	            	// 绘制完避让区后，查询导航并绘制
	            	featureAdded: lang.hitch(this, function(feature){
	            		map.avoidRegionHandler.deactivate();
	    				// 得到避让区点集合
	    				this.avoidRegion = feature.geometry.getVertices();
	    				// 查询导航
	                	this.queryRoute(map);
	            	})
	            });
				map.addControl(map.avoidRegionHandler);
			}
		},
		
		queryRoute: function(){
			var map = this.china317Map.map;
			var startMarker = this.startMarker;
			var endMarker = this.endMarker;
			var avoidRegion = this.avoidRegion;
			
			if(startMarker == null || endMarker == null){
				return ;
			}
			var startLonlat = mercator.mercator2lonLat(startMarker.lonlat.lon, startMarker.lonlat.lat);
			var endLonlat = mercator.mercator2lonLat(endMarker.lonlat.lon, endMarker.lonlat.lat);
			// 有避让区的情况
			if(avoidRegion && avoidRegion.length > 0){
				var tempArr = [];
				for (var i = 0; i < avoidRegion.length; i++) {
					var lonlat = mercator.mercator2lonLat(avoidRegion[i].x, avoidRegion[i].y);
					tempArr.push(lonlat.lon + "," + lonlat.lat);
				}
				route.queryRoute(startLonlat, endLonlat, tempArr.join(";")).then(lang.hitch(this, function(results){
					//console.debug(results);
					this._drawRoute(results);
				}));
			} else {
				route.queryRoute(startLonlat, endLonlat).then(lang.hitch(this, function(results){
					//console.debug(results);
					this._drawRoute(results);
				}));
			}
		},
        
		_drawStartEndMarker: function(point, isStart){
			var map = this.china317Map.map;
			var startEndMarkerLayer = map.getLayer(this.STARTENDMARKER_LAYER_ID);
			if(startEndMarkerLayer){
				var lonlat = new OpenLayers.LonLat(point.lon, point.lat);
				var size = new OpenLayers.Size(30, 30);
				var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
				var icon;
				if(isStart){
					icon = new OpenLayers.Icon(this.startImgPath, size, offset);
				} else {
					icon = new OpenLayers.Icon(this.endImgPath, size, offset);
				}
				var marker = new OpenLayers.Marker(lonlat, icon);
				startEndMarkerLayer.addMarker(marker);
				return marker;
			}
			return null;
		},
		
		_drawRoute: function(results){
			var map = this.china317Map.map;
			var routeLayer = map.getLayer(this.STARTENDROUTE_LAYER_ID);
			if(routeLayer){
				routeLayer.removeAllFeatures();
				// 初始化线条样式
	            var lineStyle = {
	            	//pointRadius: 6,
	            	//pointerEvents: "visiblePainted",
	            	//strokeDashstyle: "dashdot",
	                strokeColor: "#3177b6",
	                strokeOpacity: 0.8,
	                strokeWidth: 4
	            };
				var arr = [];
				for (var i = 0; i < results.length; i++) {
					// 画线
					var points = this._parsePoints(results[i].coor);
		            var lineString = new OpenLayers.Geometry.LineString(points);
		            var lineFeature = new OpenLayers.Feature.Vector(lineString, null, lineStyle);
		            arr.push(lineFeature);
				}
				routeLayer.addFeatures(arr);
			}
		},
		
		_parsePoints: function(coord){
			var points = [];
			var arr = coord.split(';');
			for (var i = 0; i < arr.length; i++) {
				var pArr = arr[i].split(',');
				var xy = mercator.lonLat2Mercator(parseFloat(pArr[0]), parseFloat(pArr[1]));
                var p = new OpenLayers.Geometry.Point(xy.x, xy.y);
                points.push(p);
            }
			return points;
		},
		
		_clearResources: function(){
			var map = this.china317Map.map;
			var startEndMarkerLayer = map.getLayer(this.STARTENDMARKER_LAYER_ID);
			if(startEndMarkerLayer){
				startEndMarkerLayer.clearMarkers();
			}
			var routeLayer = map.getLayer(this.STARTENDROUTE_LAYER_ID);
			if(routeLayer){
				routeLayer.removeAllFeatures();
			}
			var avoidRegionLayer = map.getLayer(this.AVOIDREGION_LAYER_ID);
			if(avoidRegionLayer){
				avoidRegionLayer.removeAllFeatures();
			}
		},
		
		_destroyResources: function(){
			var map = this.china317Map.map;
			var startEndMarkerLayer = map.getLayer(this.STARTENDMARKER_LAYER_ID);
			if(startEndMarkerLayer){
				startEndMarkerLayer.clearMarkers();
				map.removeLayer(startEndMarkerLayer);
			}
			var routeLayer = map.getLayer(this.STARTENDROUTE_LAYER_ID);
			if(routeLayer){
				routeLayer.removeAllFeatures();
				map.removeLayer(routeLayer);
			}
			var avoidRegionLayer = map.getLayer(this.AVOIDREGION_LAYER_ID);
			if(avoidRegionLayer){
				avoidRegionLayer.removeAllFeatures();
				map.removeLayer(avoidRegionLayer);
			}
			this.startMarker = null;
			this.endMarker = null;
			this.avoidRegion = null;
		}

	});
	
	return obj;

});
