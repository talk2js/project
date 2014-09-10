define([], function() {

	OpenLayers.Layer.MapABC = OpenLayers.Class(OpenLayers.Layer.TileCache, {
		
		sateTiles: false,
		
		isTraffic: false,
		
		initialize : function(name, url, options) {
			var tempoptions = OpenLayers.Util.extend({
				'format' : 'image/png',
				isBaseLayer : true
			}, options);
			OpenLayers.Layer.TileCache.prototype.initialize.apply(this, [ name,
					url, {}, tempoptions ]);
			this.extension = this.format.split('/')[1].toLowerCase();
			this.extension = (this.extension == 'jpg') ? 'jpeg'
					: this.extension;
			this.transitionEffect = "resize";
			this.buffer = 0;
		},
		/**
		 * 按地图引擎切图规则实现的拼接方式
		 */
		getURL : function(bounds) {
			var res = this.map.getResolution();
			var bbox = this.map.getMaxExtent();
			var size = this.tileSize;
			var tileZ = this.map.zoom;
			// 计算列号
			var tileX = Math.round((bounds.left - bbox.left) / (res * size.w));
			// 计算行号
			var tileY = Math.round((bbox.top - bounds.top) / (res * size.h));
			var tileNo = "x=" + tileX + "&y=" + tileY + "&z=" + tileZ;
			if(this.isTraffic){
				tileNo = "v=1.0&t=1&x=" + tileX + "&y=" + tileY 
					+ "&zoom=" + (this.map.numZoomLevels - this.map.zoom - 2);
			}
			var Surl = this.url;
			if (OpenLayers.Util.isArray(Surl)){
				Surl = this.selectUrl(tileNo, Surl);
			}
			return Surl + tileNo;
		},

		clone : function(obj) {
			if (obj == null) {
				obj = new OpenLayers.Layer.MapABC(this.name, this.url, this.options);
			}
			obj = OpenLayers.Layer.TileCache.prototype.clone.apply(this,
					[ obj ]);
			return obj;
		},
		
		CLASS_NAME : "OpenLayers.Layer.MapABC"
	});

	return OpenLayers.Layer.MapABC;
	
});
