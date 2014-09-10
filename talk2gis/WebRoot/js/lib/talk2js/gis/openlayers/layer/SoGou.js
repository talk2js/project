define([ 
	"dojo/_base/declare" 
], function(declare) {

	/**
	 * 对自定义规则切割的图片进行拼装的类
	 */
	OpenLayers.Layer.SoGou = OpenLayers.Class(OpenLayers.Layer.TileCache, {
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
			var tilez = this.map.zoom - 1;
			var offsetX = Math.pow(2, tilez);
			var offsetY = offsetX - 1;
			var res = this.map.getResolution();
			var bbox = this.map.getMaxExtent();
			var size = this.tileSize;
			var bx = Math.round((bounds.left - bbox.left) / (res * size.w));
			var by = Math.round((bbox.top - bounds.top) / (res * size.h));
			var numX = bx - offsetX;
			var numY = (-by) + offsetY;
			tilez = tilez + 1;
			var zoomLevel = 729 - tilez;
			if (zoomLevel == 710)
				zoomLevel = 792;
			var blo = Math.floor(numX / 200);
			var bla = Math.floor(numY / 200);
			var blos, blas;
			if (blo < 0)
				blos = "M" + (-blo);
			else
				blos = "" + blo;
			if (bla < 0)
				blas = "M" + (-bla);
			else
				blas = "" + bla;
			var x = numX.toString().replace("-", "M");
			var y = numY.toString().replace("-", "M");
			var urlsNum = parseInt((bx + by) % this.url.length);
			var strURL = "";
			strURL = this.url[urlsNum] + zoomLevel + "/" + blos + "/" + blas
					+ "/" + x + "_" + y + ".GIF";
			return strURL;
		},
		
		clone : function(obj) {
			if (obj == null) {
				obj = new OpenLayers.Layer.SoGou(this.name, this.url,
						this.options);
			}
			obj = OpenLayers.Layer.TileCache.prototype.clone.apply(this,
					[ obj ]);
			return obj;
		},
		
		CLASS_NAME : "OpenLayers.Layer.SoGou"
	});

	return OpenLayers.Layer.SoGou;
	
});
