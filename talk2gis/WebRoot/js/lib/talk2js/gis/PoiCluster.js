define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang", 
	"dojo/Deferred",
	"require",
	"dojo/promise/all",
	"dojo/aspect",
	"dojo/store/Memory",
	
	"dgrid/OnDemandGrid",
    "dgrid/tree",
    "dgrid/editor",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/selector",
    "dgrid/ColumnSet",
    "dgrid/util/mouse",
	
    "./util/mercator",
	"./rest/mapabc/poi"
], function(declare, lang, Deferred, require, all, aspect, Memory, OnDemandGrid, tree, 
		editor, Keyboard, Selection, selector, ColumnSet, mouse, mercator, poi) {

	var obj = declare([], {

		china317Map: null,
		
		POICLUSTER_LAYER_ID: "poiClusterLayer",
		
		imgPath: require.toUrl("./resources/images/marker-gold.png"),
		
		imgPath0: require.toUrl("./resources/images/marker_shadow.png"),
		
		constructor: function(args) {
			declare.safeMixin(this, args || {});
		},
		
		_initPoiClusterLayer: function(){
			var map = this.china317Map.map;
			var poiClusterLayer = map.getLayer(this.POICLUSTER_LAYER_ID);
			if(!poiClusterLayer){
				var style = new OpenLayers.Style({
	                fontColor: 'Red',
	                fontSize: '10px',
	                fontWeight: 'bold',
	                cursor: 'pointer'
	            }, {
	            	rules: [
	                    new OpenLayers.Rule({
	                       filter: new OpenLayers.Filter.Comparison({      //设置单点时的图标
	                           type: OpenLayers.Filter.Comparison.EQUAL_TO,    
	                           property: "count",  //获取合并点数
	                           value: 1
	                       }),
	                       symbolizer: {
	                    	   externalGraphic: this.imgPath,
	                           backgroundGraphic: this.imgPath0,
	                           backgroundXOffset: 0,
	                           backgroundYOffset: -7,
	                           graphicZIndex: 11,
	                           backgroundGraphicZIndex: 10,
	                           pointRadius: 10
	                           
	                           //graphicWidth: 32,
	                           //graphicHeight: 32,
	                           //graphicYOffset: -32,
	                           //labelXOffset: "-6",
	                           //labelYOffset: "-6",  //设置显示文字的偏移量
	                           //label: "${name}",   //获取显示文字
	                           //externalGraphic: "${img}"  //获取显示图标
	                       }
	                    }),
	                    new OpenLayers.Rule({
	                        // apply this rule if no others apply
	                        elseFilter: true,
	                        symbolizer: {
	                            pointRadius: "${radius}",  //计算点半径
	                            fillColor: "#ffcc66",
	                            fillOpacity: 0.8,
	                            strokeColor: "#cc6633",
	                            strokeWidth: "${width}",
	                            labelYOffset: "-8",
	                            label: "${count}",  //获取合并点数
	                            strokeOpacity: 0.8
	                        }
	                    })
	             	],
	                context: {
	                	width: function (feature) {
	                        return (feature.cluster) ? 2 : 1;
	                    },
	                    radius: function (feature) {
	                        var pix = 2;
	                        if (feature.cluster) {
	                            pix = Math.min(feature.attributes.count, 7) + 2;
	                        }
	                        return pix;
	                    },
	                    count: function (feature) {
	                        return feature.attributes.count;
	                    },
	                    /*img: lang.hitch(this, function (feature) {
	                        return this.imgPath;
	                    }),*/
	                    name: function (feature) {
	                        return feature.cluster[0].data.name;
	                    }
	                }
	            });
				
	            poiClusterLayer = new OpenLayers.Layer.Vector(this.POICLUSTER_LAYER_ID, {
	                strategies: [
	                    new OpenLayers.Strategy.Cluster({ distance: 50 })
	                ],
	                styleMap: new OpenLayers.StyleMap(style)
	            });
	            poiClusterLayer.id = this.POICLUSTER_LAYER_ID;
	            map.addLayer(poiClusterLayer);
			}
		},
		
		queryPoiByKeyword: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var type = params.type;
			var keyword = params.keyword;
			var dataOnly = params.dataOnly;
			
			this._initPoiClusterLayer();
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
		
		queryPoiByCenterPoint: function(params){
			var def = new Deferred();
			//console.debug(params);
			var keyword = params.keyword;
			var range = params.range;
			var lon = params.lon;
			var lat = params.lat;
			var dataOnly = params.dataOnly;
			
			this._initPoiClusterLayer();
			this._clearResources();
			var lonlat = mercator.mercator2lonLat(lon, lat);
			poi.queryPoiByCenterPoint(lonlat.lon, lonlat.lat, keyword, range).then(lang.hitch(this, function(results){
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
		
		queryPoiByCenterKeyword: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var type = params.type;
			var keyword = params.keyword;
			var centerKeyword = params.centerKeyword;
			var range = params.range;
			var dataOnly = params.dataOnly;
			
			this._initPoiClusterLayer();
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
				title: "POI查询结果(聚簇)",
				width: 300,
				height: 320
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
				className: "dgrid-autoheight",
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
			var map = this.china317Map.map;
			var poiClusterLayer = map.getLayer(this.POICLUSTER_LAYER_ID);
			if(poiClusterLayer){
				var features = [];
				for(var i = 0; i < resources.length; i++){
					var resource = resources[i];
					var xy = mercator.lonLat2Mercator(parseFloat(resource.x), parseFloat(resource.y));
		         	var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(xy.x, xy.y));
		         	feature.data = {
		         		name: resource.name 	
		         	};
		         	features.push(feature);
				}
				poiClusterLayer.addFeatures(features);
			}
		},
		
		_clearResources: function(){
			var map = this.china317Map.map;
			var poiClusterLayer = map.getLayer(this.POICLUSTER_LAYER_ID);
			if(poiClusterLayer){
				poiClusterLayer.removeAllFeatures();
				// 清空聚簇的缓存
				poiClusterLayer.strategies[0].clearCache();
			}
		},
		
		_destroyResources: function(){
			var map = this.china317Map.map;
			var poiClusterLayer = map.getLayer(this.POICLUSTER_LAYER_ID);
			if(poiClusterLayer){
				poiClusterLayer.removeAllFeatures();
				map.removeLayer(poiClusterLayer);
				poiClusterLayer.destroy();
			}
		}

	});
	
	return obj;
	
});
