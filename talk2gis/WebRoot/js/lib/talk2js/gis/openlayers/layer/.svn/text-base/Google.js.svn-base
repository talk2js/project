define([ 
	"dojo/_base/declare" 
], function(declare) {

	/**
	 * 对自定义规则切割的图片进行拼装的类
	 */
	OpenLayers.Layer.Google = OpenLayers.Class(OpenLayers.Layer.TileCache, {
		
		sateTiles: false,
		
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
			var tileNo = "&hl=zh-CN&gl=cn&s=Galil&x=" + tileX + "&y=" + tileY + "&z=" + tileZ;
			var Surl = this.url;
			if (OpenLayers.Util.isArray(Surl)){
				Surl = this.selectUrl(tileNo, Surl);
			}
			return Surl + tileNo;
		},
		
		clone : function(obj) {
			if (obj == null) {
				obj = new OpenLayers.Layer.Google(this.name, this.url, this.options);
			}
			obj = OpenLayers.Layer.TileCache.prototype.clone.apply(this,
					[ obj ]);
			return obj;
		},

		CLASS_NAME : "OpenLayers.Layer.Google"
	});

	return OpenLayers.Layer.Google;
	
});
