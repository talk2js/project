define([
	"dojo/io-query",
	"china317gis/util/mercator"
], function(ioQuery, mercator) {

	OpenLayers.Layer.China317Vehicle = OpenLayers.Class(OpenLayers.Layer.XYZ, {
		
		tileSize: new OpenLayers.Size(256, 256),
		
		getURL: function(bounds) {
			var xyz = this.getXYZ(bounds);
			// 左下点
			//var lb = mercator.mercator2lonLat(bounds.left, bounds.bottom);
			// 右上点
			//var rt = mercator.mercator2lonLat(bounds.right, bounds.top);
			var queryStr = ioQuery.objectToQuery({
            	x: xyz.x,
            	y: xyz.y,
            	z: xyz.z,
            	left: bounds.left,
            	bottom: bounds.bottom,
            	right: bounds.right,
            	top: bounds.top
            });
	        return this.url + queryStr;
		},

		clone: function(obj) {
			if (obj == null) {
				obj = new OpenLayers.Layer.China317Vehicle(this.name, this.url, this.options);
			}
			obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [ obj ]);
			return obj;
		},
		
		CLASS_NAME: "OpenLayers.Layer.China317Vehicle"
	});

	return OpenLayers.Layer.China317Vehicle;
	
});
