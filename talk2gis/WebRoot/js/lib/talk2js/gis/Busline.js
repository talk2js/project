define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang", 
	"dojo/Deferred",
	"dojo/aspect",
	"dojo/store/Memory",
	"dojo/dom-geometry",
	"require",
	
    "dijit/TooltipDialog",
    
	"dgrid/OnDemandGrid",
    "dgrid/tree",
    "dgrid/editor",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/selector",
    "dgrid/ColumnSet",
    "dgrid/util/mouse",
	
    "dijit/popup",
	"./util/mercator",
	"./rest/mapabc/bus"
], function(declare, lang, Deferred, aspect, Memory, domGeom, require, TooltipDialog, 
		OnDemandGrid, tree, editor, Keyboard, Selection, selector, ColumnSet, 
			mouse, popup, mercator, bus) {

	var obj = declare([], {

		china317Map: null,
		
		BUSLINE_LAYER_ID: "buslineLayer",
		
		imgPath: require.toUrl("./resources/images/bus_station24.png"),
		
		resultPane: null,
		
		constructor: function(args) {
			declare.safeMixin(this, args || {});
		},
		
		_initBuslineLayer: function(){
			var map = this.china317Map.map;
			var buslineLayer = map.getLayer(this.BUSLINE_LAYER_ID);
			if(!buslineLayer){
				buslineLayer = new OpenLayers.Layer.Vector(this.BUSLINE_LAYER_ID);
				buslineLayer.id = this.BUSLINE_LAYER_ID;
	            map.addLayer(buslineLayer);
	            
	            var ctrl = new OpenLayers.Control.SelectFeature(buslineLayer, {
	            	//selectStyle: selectStyle,
	            	highlightOnly: true,
	                multiple: false, 
	                hover: true
	            });
	            ctrl.events.register("featurehighlighted", this, this._popupInfo);
	            ctrl.events.register("featureunhighlighted", this, this._unpopupInfo);
	            map.addControl(ctrl);
	            ctrl.activate();
			}
		},
		
		queryByName: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var busName = params.busName;
			var dataOnly = params.dataOnly;
			
			this._initBuslineLayer();
			this._clearResources();
			bus.queryBusByName(city, busName).then(lang.hitch(this, function(results){
				//console.debug(results);
				if(dataOnly){
					def.resolve(results);
				} else {
					this._showResultPane(results);
					def.resolve(results);
				}
			}));
			return def.promise;
		},
		
		queryById: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var id = params.id;
			var dataOnly = params.dataOnly;
			
			this._initBuslineLayer();
			this._clearResources();
			bus.queryBusById(city, id).then(lang.hitch(this, function(results){
				//console.debug(results);
				if(dataOnly){
					def.resolve(results);
				} else {
					this._showResultPane(results);
					def.resolve(results);
				}
			}));
			return def.promise;
		},
		
		queryByStationName: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var stationName = params.stationName;
			var dataOnly = params.dataOnly;
			
			this._initBuslineLayer();
			this._clearResources();
			bus.queryBusByStationName(city, stationName).then(lang.hitch(this, function(results){
				//console.debug(results);
				if(dataOnly){
					def.resolve(results);
				} else {
					this._showResultPane(results);
					def.resolve(results);
				}
			}));
			return def.promise;
		},
		
		_showResultPane: function(results){
			if(results == null || results.length < 1){
				return ;
			}
			if(this.resultPane != null){
				this.resultPane.destroy();
			}
			this.resultPane = this.china317Map.createFloatingPane({
				title: "公交名称查询结果",
				width: 310,
				height: 400
			});
			// 关闭面板后销毁图层
			aspect.after(this.resultPane, 'close', lang.hitch(this, function () {
				this._destroyResources();
				this.resultPane = null;
			}));
				
			var store = new Memory({
				idProperty: "line_id",
				data: results
			});
			var grid = new declare([OnDemandGrid, Keyboard, Selection])({
				className: "bussline-resultPane",
				store: store,
			 	columns: [
			        { label: "名称", field: "name", sortable: false },
			        { label: "首班车", field: "start_time", sortable: false },
			        { label: "末班车", field: "end_time", sortable: false },
			        { label: "路程", field: "length", sortable: false }
			    ]
			});
			this.resultPane.addChild(grid);
			
			var childrenGrid = new declare([OnDemandGrid, Keyboard, Selection])({
				className: "bussline-childrenResultPane",
			 	columns: [
			        { label: "名称", field: "name", sortable: false }
			    ]
			});
			this.resultPane.addChild(childrenGrid);
			
			grid.on("click", lang.hitch(this, function(e){
				var row = grid.cell(e).row;
				if(!row){
					return ;
				}
				var rowData = grid.cell(e).row.data;
				//console.debug(rowData);
				this._clearResources();
				this._drawBusline(rowData);
				var store = new Memory({
					idProperty: "stationNum",
					data: rowData.stationdes
				});
				childrenGrid.set("store", store);
			}));
		},
		
		_drawBusline: function(result){
			var map = this.china317Map.map;
			var buslineLayer = map.getLayer(this.BUSLINE_LAYER_ID);
			if(buslineLayer){
				// 画路线
				var lineStyle = {
					strokeColor: "#3177b6",
					strokeOpacity: 0.8,
					strokeWidth: 5
		     	};
				var points = this.parsePoints(result.xys);
	            var lineString = new OpenLayers.Geometry.LineString(points);
	            var lineFeature = new OpenLayers.Feature.Vector(lineString, null, lineStyle);
	            buslineLayer.addFeatures([lineFeature]);
	            // 画车站
				var stations = result.stationdes;
				var style = {
					externalGraphic: this.imgPath,
		          	graphicXOffset: -12,
		          	graphicYOffset: -12,
		          	graphicWidth: 24,
	             	graphicHeight: 24
				};
				var features = [];
				for (var i = 0; i < stations.length; i++) {
					var xyStr = stations[i].xy.split(",");
					var xy = mercator.lonLat2Mercator(parseFloat(xyStr[0]), parseFloat(xyStr[1]));
					var point = new OpenLayers.Geometry.Point(xy.x, xy.y);
					var feature = new OpenLayers.Feature.Vector(point, null, style);
					feature.content = "站名：" + stations[i].name;
					features.push(feature);
				}
				buslineLayer.addFeatures(features);
			}
		},
		
		_popupInfo: function(feature){
			//console.debug(feature);
			if(feature.feature.geometry.CLASS_NAME != "OpenLayers.Geometry.Point"){
        		return;
        	}
			var map = this.china317Map.map;
			if(!feature.tooltip){
				feature.tooltip = new TooltipDialog({
			        style: "width:180px;",
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
		
		parsePoints: function(coord){
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
			var buslineLayer = map.getLayer(this.BUSLINE_LAYER_ID);
			if(buslineLayer){
				buslineLayer.removeAllFeatures();
			}
		},
		
		_destroyResources: function(){
			var map = this.china317Map.map;
			var buslineLayer = map.getLayer(this.BUSLINE_LAYER_ID);
			if(buslineLayer){
				map.removeLayer(buslineLayer);
			}
		}

	});
	
	return obj;

});
