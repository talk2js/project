define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/on",
	"require",
	
	"dojox/collections/Dictionary"
], function(declare, lang, on, require, Dictionary) {

	return declare([], {
		
		china317Map: null,
		
        carPositionMap: null,

        imgPath: require.toUrl("../resources/images/vehicle.png"),
        
        // 车辆图层
        carMarkerLayer: null,

        // 轨迹线图层
        vectorLayer: null,

        lineStyle: null,
        
        // 方向图层
        directionLayer: null,
        
        constructor: function (args) {
        	declare.safeMixin(this, args || {});
        	
            this.carMarkerLayer = new OpenLayers.Layer.Markers("carTraceMarkerLayer");
            this.china317Map.map.addLayer(this.carMarkerLayer);

            this.vectorLayer = new OpenLayers.Layer.Vector();
            this.china317Map.map.addLayer(this.vectorLayer);
            //
            this.lineStyle = {
                strokeColor: "red",
                strokeWidth: 2,
                // strokeDashstyle: "dashdot",
                pointRadius: 6,
                pointerEvents: "visiblePainted"
            };
            //
            this.carPositionMap = new Dictionary();
            
            // 初始化方向图层样式
            OpenLayers.Renderer.symbol.arrow = [0, 2, 1, 0, 2, 2, 1, 0, 0, 2];
            var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
			{
			    graphicName: "arrow",
			    rotation: "${angle}"
			},
			{
			    strokeColor: "#e53e38",
			    strokeOpacity: 0.9,
			    strokeWidth: 2,
			    pointRadius: 6
			}));
            this.directionLayer = new OpenLayers.Layer.Vector("direction", { styleMap: styleMap });
            this.china317Map.map.addLayer(this.directionLayer);
        },

        testCarMove: function(){
        	var arr = [];
        	arr.push(new OpenLayers.Geometry.Point(13516278, 3652873));
        	this.carPositionMap.add("1", arr);
        	// 初始化图标
        	var lonlat = new OpenLayers.LonLat(13516278, 3652873);
        	var size = new OpenLayers.Size(32, 32);
            var offset = new OpenLayers.Pixel(-(size.w / 2), -(size.h / 2));
            var icon = new OpenLayers.Icon(this.imgPath, size, offset);
            var marker = new OpenLayers.Marker(lonlat, icon);
            this.carMarkerLayer.addMarker(marker);
            
            // 气泡提示
		    this.china317Map.addMapInfoPopup(marker);
            
        	var task = setInterval(lang.hitch(this, function() {
        		var x = this.getRandomNum(13516178, 13516978);
        		var y = this.getRandomNum(3652173, 3652973);
        		
        		var newPoint = new OpenLayers.Geometry.Point(x, y);
        		var lonlat = new OpenLayers.LonLat(x, y);
        		//marker.lonlat = lonlat;
                var pixel = this.china317Map.map.getLayerPxFromLonLat(lonlat);
                marker.moveTo(pixel);
			}), 3 * 1000);
        },
        
        testDrawTrace: function(){
        	var arr = [];
        	arr.push(new OpenLayers.Geometry.Point(13516278, 3652873));
        	this.carPositionMap.add("1", arr);
        	// 初始化图标
        	var lonlat = new OpenLayers.LonLat(13516278, 3652873);
        	var size = new OpenLayers.Size(32, 32);
            var offset = new OpenLayers.Pixel(-(size.w / 2), -(size.h / 2));
            var icon = new OpenLayers.Icon(this.imgPath, size, offset);
            var marker = new OpenLayers.Marker(lonlat, icon);
            this.carMarkerLayer.addMarker(marker);
            
            // 气泡提示
		    this.china317Map.addMapInfoPopup(marker);
            
        	var task = setInterval(lang.hitch(this, function() {
        		var x = this.getRandomNum(13516178, 13516978);
        		var y = this.getRandomNum(3652173, 3652973);
        		
        		var oldPoint = new OpenLayers.Geometry.Point(marker.lonlat.lon, marker.lonlat.lat);
        		var newPoint = new OpenLayers.Geometry.Point(x, y);
        		var lonlat = new OpenLayers.LonLat(x, y);
                var pixel = this.china317Map.map.getLayerPxFromLonLat(lonlat);
                marker.moveTo(pixel);
                
                //var pointArray = this.carPositionMap.item("1");
                //pointArray.push(newPoint);
                this.drawTrace({
                	oldPoint: oldPoint,
                	newPoint: newPoint
                }, "1");
			}), 3 * 1000);
        },
        
        getRandomNum: function (Min, Max) { 
            var Range = Max - Min; 
            var Rand = Math.random(); 
            return (Min + Math.round(Rand * Range)); 
        }, 
        
        drawTrace: function (pointSeg, carId) {
        	var pointArray = [];
        	pointArray.push(pointSeg.oldPoint);
        	pointArray.push(pointSeg.newPoint);
            var lineString = new OpenLayers.Geometry.LineString(pointArray);
            var lineFeature = new OpenLayers.Feature.Vector(lineString, null, this.lineStyle);
            // 删除的时候通过carId查找
            lineFeature.id = carId;
            this.vectorLayer.addFeatures([lineFeature]);
            
            // 画方向箭
            var arrows = this._createLineStringDirection(pointSeg, "middle");
            this.directionLayer.addFeatures(arrows);
        },

        /*
         * position: "start", "end", "middle"
         */
         _createLineStringDirection: function (pointSeg, position) {
             if (position == undefined) {
                 position = "end"
             }
             var seg = {
            	 x1: pointSeg.oldPoint.x,
                 x2: pointSeg.newPoint.x,
                 y1: pointSeg.oldPoint.y,
                 y2: pointSeg.newPoint.y
             };
             return this._createSegDirection(seg, position);
         },

         _createSegDirection: function (seg, position) {
             var segBearing = this._bearing(seg);
             var positions = [];
             var points = [];
             if (position == "start") {
                 positions.push([seg.x1, seg.y1]);
             } else if (position == "end") {
                 positions.push([seg.x2, seg.y2]);
             } else if (position == "middle") {
                 positions.push([(seg.x1 + seg.x2) / 2, (seg.y1 + seg.y2) / 2]);
             } else {
                 return null;
             }
             for (var i = 0; i < positions.length; i++) {
                 var pt = new OpenLayers.Geometry.Point(positions[i][0], positions[i][1]);
                 var ptFeature = new OpenLayers.Feature.Vector(pt, { angle: segBearing });
                 points.push(ptFeature);
             }
             return points;
         },

         _bearing: function (seg) {
             b_x = 0;
             b_y = 1;
             a_x = seg.x2 - seg.x1;
             a_y = seg.y2 - seg.y1;
             angle_rad = Math.acos((a_x * b_x + a_y * b_y) / Math.sqrt(a_x * a_x + a_y * a_y));
             angle = 360 / (2 * Math.PI) * angle_rad;
             if (a_x < 0) {
                 return 360 - angle;
             } else {
                 return angle;
             }
         },
        
         clearCar: function (carId) {
        	 var markers = this.carMarkerLayer.markers;
        	 for (var i = 0; i < markers.length; i++) {
        		 var marker = markers[i];
        		 //console.debug(marker.gpsData);
        		 if (marker.gpsData.carId == carId) {
        			 this.carMarkerLayer.removeMarker(marker);
        			 // 同时删除线图层
        			 var lineFeature = this.vectorLayer.getFeatureById(carId);
        			 if (lineFeature) {
        				 this.vectorLayer.removeFeatures([lineFeature]);
        			 }
        			 return;
        		 }
        	 }
        	 console.debug("clearCar carId[" + carId + "]");
         },
        
         clear: function () {
        	 this.carMarkerLayer.clearMarkers();
        	 this.vectorLayer.removeAllFeatures();
        	 this.directionLayer.removeAllFeatures();
         }
        
	});

});
