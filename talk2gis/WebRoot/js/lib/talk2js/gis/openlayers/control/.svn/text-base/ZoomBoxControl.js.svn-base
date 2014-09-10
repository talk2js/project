define([], function () {
	
	OpenLayers.Control.ZoomBoxControl = OpenLayers.Class(OpenLayers.Control, {

        zoomBox: function (position, out) {
            if (position instanceof OpenLayers.Bounds) {
                var bounds;
                if (!out) {
                    var minXY = this.map.getLonLatFromPixel({
                        x: position.left,
                        y: position.bottom
                    });
                    var maxXY = this.map.getLonLatFromPixel({
                        x: position.right,
                        y: position.top
                    });
                    bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                        maxXY.lon, maxXY.lat);
                } else {
                    var pixWidth = Math.abs(position.right - position.left);
                    var pixHeight = Math.abs(position.top - position.bottom);
                    var zoomFactor = Math.min((this.map.size.h / pixHeight),
                        (this.map.size.w / pixWidth));
                    var extent = this.map.getExtent();
                    var center = this.map.getLonLatFromPixel(
                        position.getCenterPixel());
                    var xmin = center.lon - (extent.getWidth() / 2) * zoomFactor;
                    var xmax = center.lon + (extent.getWidth() / 2) * zoomFactor;
                    var ymin = center.lat - (extent.getHeight() / 2) * zoomFactor;
                    var ymax = center.lat + (extent.getHeight() / 2) * zoomFactor;
                    bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);
                }
                this.map.zoomToExtent(bounds);
            } else { // it's a pixel
                if (!out) {
                    this.map.setCenter(this.map.getLonLatFromPixel(position),
                        this.map.getZoom() + 1);
                } else {
                    this.map.setCenter(this.map.getLonLatFromPixel(position),
                        this.map.getZoom() - 1);
                }
            }
        },
        
        CLASS_NAME: 'OpenLayers.Control.ZoomBoxControl'
    });
    return OpenLayers.Control.ZoomBoxControl;
});