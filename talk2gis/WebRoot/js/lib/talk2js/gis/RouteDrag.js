define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang", 
	"require",
	"dojo/on", 
	"dojo/request/xhr",
	"dojo/Deferred",
	
    "dijit/MenuItem",
    "dijit/MenuSeparator",
	"dijit/registry",
	
	"./openlayers/control/RouteDragControl",
	"./rest/mapabc/route",
	"./util/mercator"
], function(declare, lang, require, on, xhr, Deferred, MenuItem, MenuSeparator, registry, 
		RouteDragControl, route, mercator) {

	var obj = declare([], {

		china317Map: null,
		
		DRAGROUTE_LAYER_ID: "dragRouteLayer",

		imgPath: require.toUrl("./resources/images/marker-gold.png"),
		
		imgPath0: require.toUrl("./resources/images/marker_shadow.png"),
		
		/**
		 * OpenLayers.Geometry.Point 点集合
		 */
		points: null,
		
		constructor: function(args) {
			declare.safeMixin(this, args || {});
		},
		
		queryRoute: function(params){
			var def = new Deferred();
			//console.debug(params);
			var points = params.points;
			
			this._initLayers(points);
			this._clearResources();
        	var tempArr = [];
			for (var i = 0; i < points.length; i++) {
				var point = points[i];
				var lonlat = mercator.mercator2lonLat(point.x, point.y);
				tempArr.push(lonlat.lon + "," + lonlat.lat);
			}
        	route.queryMultiPointsRoute(tempArr.join(";")).then(lang.hitch(this, function(results){
				//console.debug(results);
				this._drawRoute(results);
				def.resolve(results);
			}));
        	return def.promise;
		},
		
		_initLayers: function(points){
			var map = this.china317Map.map;
			this.points = points;
			var dragRouteLayer = map.getLayer(this.DRAGROUTE_LAYER_ID);
			if(dragRouteLayer){
				return ;
			}
            // 添加路径图层
			dragRouteLayer = new OpenLayers.Layer.Vector(this.DRAGROUTE_LAYER_ID, {
            	styleMap: new OpenLayers.StyleMap({
                    externalGraphic: this.imgPath,
                    backgroundGraphic: this.imgPath0,
                    backgroundXOffset: 0,
                    backgroundYOffset: -7,
                    graphicZIndex: 11,
                    backgroundGraphicZIndex: 10,
                    pointRadius: 10
                })
            });
			dragRouteLayer.id = this.DRAGROUTE_LAYER_ID;
            map.addLayer(dragRouteLayer);
            
            // 添加拖拽控制器
            var routeControl = new RouteDragControl(dragRouteLayer);
            routeControl.onEnter = lang.hitch(this, function(feature){
            	if(feature.geometry.CLASS_NAME != "OpenLayers.Geometry.Point"){
            		routeControl.cancel();
            	}
            });
            routeControl.onComplete = lang.hitch(this, function(feature, pixel) {
            	if(feature._virtual){
            		this.points.splice(feature._index, 0, feature.geometry);
            	} else {
            		this.points = [];
            		for (var i = 0; i < dragRouteLayer.features.length; i++) {
            			if(!dragRouteLayer.features[i]._virtual
            				&& dragRouteLayer.features[i].geometry.CLASS_NAME == "OpenLayers.Geometry.Point"){
            				this.points.push(dragRouteLayer.features[i].geometry);
            			}
            		}
            	}
            	this.queryRoute({
            		points: this.points
            	});
            });
            map.addControl(routeControl);
            routeControl.activate();
		},
		
		_drawRoute: function(results){
			var map = this.china317Map.map;
			if(!results || results.length == 0){
				return ;
			}
			var dragRouteLayer = map.getLayer(this.DRAGROUTE_LAYER_ID);
			if(dragRouteLayer){
				dragRouteLayer.removeAllFeatures();
				// 初始化线条样式
	           	var lineStyle = {
	            	//pointRadius: 6,
	            	//pointerEvents: "visiblePainted",
	            	// strokeDashstyle: "dashdot",
	                strokeColor: "#3177b6",
	                strokeOpacity: 0.8,
	                strokeWidth: 5
	            };
				var arr = [];
				for (var i = 0; i < results.length; i++) {
					var points = this._parsePoints(results[i].coor);
					arr = arr.concat(points);
				}
				var lineString = new OpenLayers.Geometry.LineString(arr);
	            var lineFeature = new OpenLayers.Feature.Vector(lineString, null, lineStyle);
	            dragRouteLayer.addFeatures([lineFeature]);
				// 画点
				for (var i = 0; i < this.points.length; i++) {
	        		var vertex = new OpenLayers.Feature.Vector(this.points[i]);
	        		dragRouteLayer.addFeatures([vertex]);
	        	}
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
			var dragRouteLayer = map.getLayer(this.DRAGROUTE_LAYER_ID);
			if(dragRouteLayer){
				dragRouteLayer.removeAllFeatures();
			}
		},
		
		_destroyResources: function(){
			var map = this.china317Map.map;
			var dragRouteLayer = map.getLayer(this.DRAGROUTE_LAYER_ID);
			if(dragRouteLayer){
				map.removeLayer(dragRouteLayer);
			}
		}

	});
	
	return obj;

});
