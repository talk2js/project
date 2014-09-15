define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang", 
	"dojo/Deferred",
	"dojo/aspect",
	"dojo/store/Memory",
	"require",
	
	"dijit/form/TextBox",
    "dijit/MenuItem",
    "dijit/MenuSeparator",
    
	"dgrid/OnDemandGrid",
    "dgrid/tree",
    "dgrid/editor",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/selector",
    "dgrid/ColumnSet",
    "dgrid/util/mouse",
    
    "./openlayers/control/ZoomBoxControl",
    "./util/mercator",
	"./rest/mapabc/poi"
], function(declare, lang, Deferred, aspect, Memory, require, TextBox, MenuItem, MenuSeparator, 
		OnDemandGrid, tree, editor, Keyboard, Selection, selector, ColumnSet, mouse, ZoomBoxControl, mercator, poi) {

	var obj = declare([], {

		china317Map: null,
		
		POI_LAYER_ID: "poiLayer",
		
		imgPath: require.toUrl("../resources/images/poi/school32.png"),
		
		resultPane: null,
		
		/**
		 * 框选查询，保存上一次查询的值
		 */
		keyword: "",
		
		constructor: function(args) {
			declare.safeMixin(this, args || {});
		},
		
		_initPoiLayer: function(){
			var map = this.china317Map.map;
			var poiLayer = map.getLayer(this.POI_LAYER_ID);
			if(poiLayer){
				return ;
			}
			poiLayer = new OpenLayers.Layer.Markers(this.POI_LAYER_ID);
			poiLayer.id = this.POI_LAYER_ID;
            map.addLayer(poiLayer);
		},
		
		add2MapContextMenu: function(){
			var map = this.china317Map.map;
			var me = this;
			
			var tempPane, keywordInput;
			var control = new ZoomBoxControl();
			map.addControl(control);
            var handler = new OpenLayers.Handler.Box(control, {
                done: function (position) {
                    var lt = map.getLonLatFromPixel(new OpenLayers.Pixel(position.left, position.top));
                    var rb = map.getLonLatFromPixel(new OpenLayers.Pixel(position.right, position.bottom));
                    var _lt = mercator.mercator2lonLat(lt.lon, lt.lat);
                    var _rb = mercator.mercator2lonLat(rb.lon, rb.lat);
                    var rectangle = {
                    	minx: _lt.lon,
                    	miny: _rb.lat,
                    	maxx: _rb.lon,
                    	maxy: _lt.lat
                    };
                    me.queryPoiByRectangle({
                    	rectangle: rectangle,
                    	keyword: keywordInput.get("value")
                    });
                    me.keyword = keywordInput.get("value");
                    handler.deactivate();
                    
                    if(tempPane != null){
                    	tempPane.destroy();
                    }
                }
            });
            
            var menu = this.china317Map.mapContextMenu;
			menu.addChild(new MenuItem({
                label: "框选查询",
                iconClass: "extentQueryIcon",
                onClick: lang.hitch(this, function (e) {
                	OpenLayers.Element.addClass(map.viewPortDiv, "olDrawBox");
                	menu.deactivateAll();
                	handler.activate();
                	
                	tempPane = this.china317Map.createFloatingPane({
        				title: "输入要查询的关键字",
        				width: 210,
        				height: 70
        			});
                	keywordInput = new TextBox({
                		style: "margin-top:5px; margin-left:10px;"
                	});
                	tempPane.addChild(keywordInput);
                	
                	aspect.after(tempPane, 'close', lang.hitch(this, function () {
                		OpenLayers.Element.removeClass(map.viewPortDiv, "olDrawBox");
                		handler.deactivate();
        			}));
                })
            }), 0);
		},
		
		/**
		 * 关键字查询
		 */
		queryPoiByKeyword: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var type = params.type;
			var keyword = params.keyword;
			var dataOnly = params.dataOnly;
			
			this._initPoiLayer();
			this._clearResources();
			poi.queryPoiByKeyword(city, type, keyword).then(lang.hitch(this, function(results){
				//console.debug(results);
				if(dataOnly){
					def.resolve(results);
				} else {
					this._drawResources(results);
					def.resolve(results);
					// 创建数据面板
					this._showResultPane(results);
				}
			}));
			return def.promise;
		},
		
		/**
		 * 框选查询
		 */
		queryPoiByRectangle: function(params){
			var def = new Deferred();
			//console.debug(params);
			var rectangle = params.rectangle;
			var keyword = params.keyword;
			var dataOnly = params.dataOnly;
			
			this._initPoiLayer();
			this._clearResources();
			poi.queryPoiByRectangle(rectangle, keyword).then(lang.hitch(this, function(results){
            	//console.debug(results);
				if(dataOnly){
					def.resolve(results);
				} else {
					this._drawResources(results);
	            	def.resolve(results);
	            	// 创建数据面板
					this._showResultPane(results);
				}
            }));
			return def.promise;
		},
		
		/**
		 * 根据中心点坐标查询
		 */
		queryPoiByCenterPoint: function(params){
			var def = new Deferred();
			//console.debug(params);
			var keyword = params.keyword;
			var range = params.range;
			var lon = params.lon;
			var lat = params.lat;
			var type = params.type;
			var dataOnly = params.dataOnly;
			
			this._initPoiLayer();
			this._clearResources();
			var lonlat = mercator.mercator2lonLat(lon, lat);
			poi.queryPoiByCenterPoint(lonlat.lon, lonlat.lat, keyword, range, type).then(lang.hitch(this, function(results){
				//console.debug(results);
				if(dataOnly){
					def.resolve(results);
				} else {
					this._drawResources(results);
					def.resolve(results);
					// 创建数据面板
					this._showResultPane(results);
				}
			}));
			return def.promise;
		},
		
		/**
		 * 根据中心点关键字查询
		 */
		queryPoiByCenterKeyword: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var type = params.type;
			var keyword = params.keyword;
			var centerKeyword = params.centerKeyword;
			var range = params.range;
			var dataOnly = params.dataOnly;
			
			this._initPoiLayer();
			this._clearResources();
			poi.queryPoiByCenterKeyword(city, centerKeyword, keyword, range, type).then(lang.hitch(this, function(results){
				//console.debug(results);
				if(dataOnly){
					def.resolve(results);
				} else {
					this._drawResources(results);
					def.resolve(results);
					// 创建数据面板
					this._showResultPane(results);
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
				title: "查询结果",
				width: 300,
				height: 342
			});
			// 关闭面板后销毁图层
			aspect.after(this.resultPane, 'close', lang.hitch(this, function () {
				this._destroyResources();
				this.resultPane = null;
			}));
				
			var store = new Memory({
				idProperty: "pguid",
				data: results
			});
			var grid = new declare([OnDemandGrid, Keyboard, Selection])({
				className: "mapFloatingPaneResultGrid",
				store: store,
			 	columns: [
			        { label: "名称", field: "name", sortable: false },
			        { label: "地址", field: "address", sortable: false }
			    ]
			});
			this.resultPane.addChild(grid);
			grid.on("click", lang.hitch(this, function(e){
				var row = grid.cell(e).row;
				if(!row){
					return ;
				}
				var rowData = grid.cell(e).row.data;
				//console.debug(rowData);
				var xy = mercator.lonLat2Mercator(parseFloat(rowData.x), parseFloat(rowData.y));
				var lonlat = new OpenLayers.LonLat(xy.x, xy.y);
				this.china317Map.map.moveTo(lonlat, 16);
			}));
		},
		
		_drawResources: function(resources){
			if(resources == null || resources.length < 1){
				return ;
			}
			var self = this;
			var map = this.china317Map.map;
			var poiLayer = map.getLayer(this.POI_LAYER_ID);
			if(poiLayer){
				for(var i = 0; i < resources.length; i++){
					var resource = resources[i];
					var xy = mercator.lonLat2Mercator(parseFloat(resource.x), parseFloat(resource.y));
				    var lonlat = new OpenLayers.LonLat(xy.x, xy.y);
				    var size = new OpenLayers.Size(32, 32);
				    var offset = new OpenLayers.Pixel(-(size.w / 2), -(size.h / 2));
				    var icon = new OpenLayers.Icon(this.imgPath, size, offset);
				    var marker = new OpenLayers.Marker(lonlat, icon);
				    marker.resource = resource;
				    poiLayer.addMarker(marker);
				    // 气泡提示
				    this.china317Map.addMapInfoPopup(marker);
				}
			}
		},
		
		_clearResources: function(){
			var map = this.china317Map.map;
			var poiLayer = map.getLayer(this.POI_LAYER_ID);
			if(poiLayer){
				poiLayer.clearMarkers();
			}
		},
		
		_destroyResources: function(){
			var map = this.china317Map.map;
			var poiLayer = map.getLayer(this.POI_LAYER_ID);
			if(poiLayer){
				poiLayer.clearMarkers();
				map.removeLayer(poiLayer);
			}
		}

	});
	
	return obj;
	
});
