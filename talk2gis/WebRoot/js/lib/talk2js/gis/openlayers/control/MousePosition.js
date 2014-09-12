define([
	"../../util/mercator"
], function (mercator) {

    var component = OpenLayers.Class(OpenLayers.Control.MousePosition, {

        /**
        * Method: draw 
        */
        draw: function () {
            OpenLayers.Control.prototype.draw.apply(this, arguments);

            if(!this.element){
                this.div.left = "";
                this.div.top = "";
                this.element = this.div;
            }

            this.div.style.left = "7px";
            this.div.style.bottom = "1px";

            return this.div;
        },
        
        /**
         * Method: formatOutput
         * Override to provide custom display output
         *
         * Parameters:
         * lonLat - {<OpenLayers.LonLat>} Location to display
         */
        formatOutput: function(lonLat) {
        	//var _lonlat = mercator.mercator2lonLat(lonLat.lon, lonLat.lat);
        	var _lonlat = lonLat;
            var digits = parseInt(this.numDigits);
            var newHtml =
                this.prefix +
                _lonlat.lon.toFixed(digits) +
                this.separator + 
                _lonlat.lat.toFixed(digits) +
                this.suffix;
            return newHtml;
        },

    });

    return component;
});
    
