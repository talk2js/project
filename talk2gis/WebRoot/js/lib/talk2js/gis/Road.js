define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang", 
	"require",
	"dojo/dom-construct",
	"dojo/store/Memory",
	"dojo/aspect",
	"dojo/dom-geometry",
	"dojo/Deferred",
	
	"dijit/TooltipDialog",
	
	"dojox/layout/FloatingPane",
	
	"dgrid/OnDemandGrid",
    "dgrid/tree",
    "dgrid/editor",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/selector",
    "dgrid/ColumnSet",
    "dgrid/util/mouse",
	
    "./util/popup",
    "./util/mercator",
	"./rest/mapabc/road"
], function(declare, lang, require, domConstruct, Memory, aspect, domGeom, Deferred, 
		TooltipDialog, FloatingPane, OnDemandGrid, tree, editor, Keyboard, 
			Selection, selector, ColumnSet, mouse, popup, mercator, road) {

	var obj = declare([], {

		china317Map: null,
		
		ROAD_LAYER_ID: "roadLayer",
		
		imgPath: require.toUrl("./resources/images/roadcross32.png"),
		
		resultPane: null,
		
		constructor: function(args) {
			declare.safeMixin(this, args || {});
		},
		
		_initRoadLayer: function(){
			var map = this.china317Map.map;
			var roadLayer = map.getLayer(this.ROAD_LAYER_ID);
			if(roadLayer){
				return ;
			}
			roadLayer = new OpenLayers.Layer.Vector(this.ROAD_LAYER_ID);
			roadLayer.id = this.ROAD_LAYER_ID;
            map.addLayer(roadLayer);
            
            //var selectStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['select']);
			//console.debug(selectStyle);
            //selectStyle.fillColor = "#0000c6";
            var ctrl = new OpenLayers.Control.SelectFeature(roadLayer, {
            	//selectStyle: selectStyle,
            	highlightOnly: true,
                multiple: false, 
                hover: true
            });
            ctrl.events.register("featurehighlighted", this, this._popupInfo);
            ctrl.events.register("featureunhighlighted", this, this._unpopupInfo);
            map.addControl(ctrl);
            ctrl.activate();
		},
		
		queryCrossByTwoRoads: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var roadName1 = params.roadName1;
			var roadName2 = params.roadName2;
			var dataOnly = params.dataOnly;
			
			this._initRoadLayer();
			this._clearResources();
			road.queryCrossByTwoRoads(city, roadName1, roadName2).then(lang.hitch(this, function(results){
				//console.debug(results);
				if(dataOnly){
					def.resolve(results);
				} else {
					this._drawCrosses(results);
					def.resolve(results);
					this._showCrossResultsPane(results);
				}
			}));
			return def.promise;
		},
		
		queryCrossesByRoad: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var roadName = params.roadName;
			var dataOnly = params.dataOnly;
			
			this._initRoadLayer();
			this._clearResources();
			road.queryCrossesByRoad(city, roadName).then(lang.hitch(this, function(results){
				//console.debug(results);
				if(dataOnly){
					def.resolve(results);
				} else {
					this._drawCrosses(results);
					def.resolve(results);
					this._showCrossResultsPane(results);
				}
			}));
			return def.promise;
		},
		
		queryByName: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var roadName = params.roadName;
			var dataOnly = params.dataOnly;
			
			this._initRoadLayer();
			this._clearResources();
			road.queryRoadByName(city, roadName).then(lang.hitch(this, function(results){
				if(dataOnly){
					def.resolve(results);
				} else {
					this._showRoadResultsPane(results);
					def.resolve(results);
				}
			}));
			return def.promise;
		},
		
		_showRoadResultsPane: function(results){
			if(this.resultPane != null){
				this.resultPane.destroy();
			}
			this.resultPane = this.china317Map.createFloatingPane({
				title: "道路查询结果",
				width: 280,
				height: 300
			});
			aspect.after(this.resultPane, 'close', lang.hitch(this, function () {
				this._destroyResources();
				this.resultPane = null;
			}));
			var store = new Memory({
				idProperty: "id",
			        data: results
			    });
			var grid = new declare([OnDemandGrid, Keyboard, Selection])({
				className: "dgrid-autoheight",
				store: store,
			 	columns: [
			        { label: "路名", field: "name", sortable: true },
			        { label: "路宽", field: "width", sortable: true }
			    ]
			});
			this.resultPane.addChild(grid);
			grid.on("click", lang.hitch(this, function(e){
				//console.debug(grid.cell(e).row);
				var row = grid.cell(e).row;
				if(!row){
					return ;
				}
				this._clearResources();
				this._drawRoad(grid.cell(e).row.data);
			}));
		},
		
		_showCrossResultsPane: function(results){
			if(this.resultPane != null){
				this.resultPane.destroy();
			}
			this.resultPane = this.china317Map.createFloatingPane({
				title: "交叉点查询结果",
				width: 280,
				height: 300
			});
			aspect.after(this.resultPane, 'close', lang.hitch(this, function () {
				this._destroyResources();
				this.resultPane = null;
			}));
			var store = new Memory({
				idProperty: "id",
			        data: results
			    });
			var grid = new declare([OnDemandGrid, Keyboard, Selection])({
				className: "dgrid-autoheight",
				store: store,
			 	columns: [
			        { label: "道路1", field: "roadname1", sortable: true },
			        { label: "道路2", field: "roadname2", sortable: true }
			    ]
			});
			this.resultPane.addChild(grid);
			grid.on("click", lang.hitch(this, function(e){
				//console.debug(grid.cell(e).row);
				var row = grid.cell(e).row;
				if(!row){
					return ;
				}
				var rowData = row.data;
				var xy = mercator.lonLat2Mercator(parseFloat(rowData.x), parseFloat(rowData.y));
				var lonlat = new OpenLayers.LonLat(xy.x, xy.y);
				this.china317Map.map.moveTo(lonlat, 16);
			}));
		},
		
		_drawRoad: function(result){
			//console.debug(result);
			var map = this.china317Map.map;
			var roadLayer = map.getLayer(this.ROAD_LAYER_ID);
			if(roadLayer){
				// 初始化线条样式
	            var lineStyle = {
	            	//pointRadius: 6,
	            	//pointerEvents: "visiblePainted",
	            	// strokeDashstyle: "dashdot",
	                strokeColor: "#3177b6",
	                strokeOpacity: 0.8,
	                strokeWidth: 6
	            };
				var arr = [];
				var point;
				for (var i = 0; i < result.coords.length; i++) {
					var points = this._parsePoints(result.coords[i]);
					point = points[0];
					var lineString = new OpenLayers.Geometry.LineString(points);
		            var lineFeature = new OpenLayers.Feature.Vector(lineString, null, lineStyle);
		            arr.push(lineFeature);
				}
				roadLayer.addFeatures(arr);
				
				var lonlat = new OpenLayers.LonLat(point.x, point.y);
				//console.debug(lonlat);
	         	map.moveTo(lonlat, 16);
			}
		},
		
		_drawCrosses: function(results){
			var map = this.china317Map.map;
			var roadLayer = map.getLayer(this.ROAD_LAYER_ID);
			if(roadLayer){
				var features = [];
				var style = {
					externalGraphic: this.imgPath,
		          	graphicXOffset: -16,
		          	graphicYOffset: -16,
		          	graphicWidth: 32,
	             	graphicHeight: 32
				};
				var point;
				for (var i = 0; i < results.length; i++) {
					var xy = mercator.lonLat2Mercator(parseFloat(results[i].x), parseFloat(results[i].y));
					point = new OpenLayers.Geometry.Point(xy.x, xy.y);
					var feature = new OpenLayers.Feature.Vector(point, null, style);
					feature.content = "道路1：" + results[i].roadname1 + 
						"<p>道路2：" + results[i].roadname2;
					features.push(feature);
				}
				roadLayer.addFeatures(features);
				// 移动到某个点位
				var lonlat = new OpenLayers.LonLat(point.x, point.y);
	         	map.moveTo(lonlat, 16);
			}
		},
		
		_popupInfo: function(feature){
			//console.debug(feature);
			var map = this.china317Map.map;
			if(!feature.tooltip){
				feature.tooltip = new TooltipDialog({
			        style: "width:270px;",
			        content: feature.feature.content
			    });
			}
			var lonlat = new OpenLayers.LonLat(feature.feature.geometry.x, feature.feature.geometry.y);
			var pixel = map.getPixelFromLonLat(lonlat);
			var position = domGeom.position(this.china317Map.domNode);
			//console.debug(position);
			popup.open({
		        parent: this.china317Map,
		        popup: feature.tooltip,
		        x: pixel.x - position.x - 7,
		        y: pixel.y + position.y - 5
		    });
		},
		
		_unpopupInfo: function(feature){
			popup.close();
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
			var roadLayer = map.getLayer(this.ROAD_LAYER_ID);
			if(roadLayer){
				roadLayer.removeAllFeatures();
			}
		},
		
		_destroyResources: function(){
			var map = this.china317Map.map;
			var roadLayer = map.getLayer(this.ROAD_LAYER_ID);
			if(roadLayer){
				map.removeLayer(roadLayer);
			}
		}

	});
	
	return obj;

});
