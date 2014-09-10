define([ 
    "dojo/_base/declare", 
   	"dojo/_base/lang", 
   	"dojo/Deferred",
   	"dojo/aspect",
   	"dojo/store/Memory",
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
   
    "china317gis/util/popup",
    "china317gis/util/mercator",
	"china317gis/rest/mapabc/poi"
], function(declare, lang, Deferred, aspect, Memory, require, TooltipDialog, 
		OnDemandGrid, tree, editor, Keyboard, Selection, selector, ColumnSet, 
		mouse, popup, mercator, poi) {

	var obj = declare([], {

		china317Map: null,
		
		DISTRICT_LAYER_ID: "districtLayer",
		
		resultPane: null,
		
		constructor: function(args) {
			declare.safeMixin(this, args || {});
		},
		
		_initDistrictLayer: function(){
			var map = this.china317Map.map;
			var districtLayer = map.getLayer(this.DISTRICT_LAYER_ID);
			if(!districtLayer){
				districtLayer = new OpenLayers.Layer.Vector(this.DISTRICT_LAYER_ID);
				districtLayer.id = this.DISTRICT_LAYER_ID;
	            map.addLayer(districtLayer);
			}
			
            var selectStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['select']);
			selectStyle.fillColor = "#0000c6";
            var ctrl = new OpenLayers.Control.SelectFeature(districtLayer, {
            	selectStyle: selectStyle,
            	highlightOnly: true,
                multiple: false, 
                hover: true,
                toggleKey: "ctrlKey", // ctrl key removes from selection
                multipleKey: "shiftKey" // shift key adds to selection
            });
            map.addControl(ctrl);
            ctrl.activate();
		},
		
		queryDistrict: function(params){
			var def = new Deferred();
			//console.debug(params);
			var city = params.city;
			var districtName = params.districtName;
			var districtColor = params.districtColor;
			var dataOnly = params.dataOnly;
			
			this._initDistrictLayer();
			this._clearResources();
			
			poi.queryDistrict(city, districtName).then(lang.hitch(this, function(results){
				//console.debug(results);
				if(results == null || results.length < 1){
					return ;
				}
				if(dataOnly){
					def.resolve(results);
				} else {
					for (var i = 0; i < results.length; i++) {
						for (var j = 0; j < results[i].coors.length; j++) {
							this._drawBoundary(results[i].coors[j], districtColor);
						}
					}
					def.resolve(results);
					this._showResultPane(results);
				}
			}));
			return def.promise;
		},
		
		_drawBoundary: function(coord, color){
			var map = this.china317Map.map;
			var districtLayer = map.getLayer(this.DISTRICT_LAYER_ID);
			if(districtLayer){
				var points = this.parsePoints(coord);
				//console.debug(points);
				var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
				style.fillColor = color;
				style.strokeColor = "#ff9933";
				style.strokeWith = 5;
	            var linearRing = new OpenLayers.Geometry.LinearRing(points);
				var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]), null, style);
				districtLayer.addFeatures([feature]);
			}
		},
		
		_showResultPane: function(results){
			if(results == null || results.length < 1){
				return ;
			}
			if(this.resultPane != null){
				this.resultPane.destroy();
			}
			this.resultPane = this.china317Map.createFloatingPane({
				title: "规划区查询结果",
				width: 260,
				height: 170
			});
			// 关闭面板后销毁图层
			aspect.after(this.resultPane, 'close', lang.hitch(this, function () {
				this._destroyResources();
				this.resultPane = null;
			}));
				
			var store = new Memory({
				idProperty: "adcode",
				data: results
			});
			var grid = new declare([OnDemandGrid, Keyboard, Selection])({
				className: "bussline-resultPane",
				store: store,
			 	columns: [
			        { label: "名称", field: "name", sortable: false }
			    ]
			});
			this.resultPane.addChild(grid);
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
			var districtLayer = map.getLayer(this.DISTRICT_LAYER_ID);
			if(districtLayer){
				districtLayer.removeAllFeatures();
			}
		},
		
		_destroyResources: function(){
			var map = this.china317Map.map;
			var districtLayer = map.getLayer(this.DISTRICT_LAYER_ID);
			if(districtLayer){
				map.removeLayer(districtLayer);
			}
		}

	});
	
	return obj;

});
