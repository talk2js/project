define([
    "require"
], function (require) {

	OpenLayers.Control.PanZoomBar = OpenLayers.Class(OpenLayers.Control.PanZoomBar, {

        IMG_BASE: require.toUrl('../../resources/images/panzoombar/'),

        zoomStopWidth: 19,

        zoomStopHeight: 11,

        /**
        * Method: draw 
        *
        * Parameters:
        * px - {<OpenLayers.Pixel>} 
        */
        draw: function (px) {
            // initialize our internal div
            OpenLayers.Control.prototype.draw.apply(this, arguments);
            px = this.position.clone();

            // place the controls
            this.buttons = [];

            var north_south_sz = { w: 21, h: 20 };
            var west_east_sz = { w: 28, h: 19 };
            var zoom_sz = { w: 19, h: 35 };
            var centered = new OpenLayers.Pixel(px.x + west_east_sz.w - north_south_sz.w / 2, px.y);
            var wposition = west_east_sz.w;

            this._addButton("panup", "north-mini.png", centered, north_south_sz);
            px.y = centered.y + north_south_sz.h;
            this._addButton("panleft", "west-mini.png", px, west_east_sz);
            this._addButton("panright", "east-mini.png", px.add(wposition, 0), west_east_sz);
            this._addButton("pandown", "south-mini.png", centered.add(0, north_south_sz.h + west_east_sz.h), north_south_sz);
            this._addButton("zoomin", "zoom-plus-mini.png", centered.add(0, north_south_sz.h * 3 + 5), zoom_sz);
            centered = this._addZoomBar(centered.add(0, north_south_sz.h * 3 + 5 + zoom_sz.h));
            this._addButton("zoomout", "zoom-minus-mini.png", centered, zoom_sz);

            this.div.style.left = "20px";
            this.div.style.top = "60px";

            return this.div;
        },

        /**
        * Method: _addButton
        * 重写PanZoomBar中的_addButton
        */
        _addButton: function (id, img, xy, sz) {
            var imgLocation = this.IMG_BASE + img;
            var btn = OpenLayers.Util.createAlphaImageDiv(
            this.id + "_" + id,
            xy, sz, imgLocation, "absolute");
            btn.style.cursor = "pointer";
            //we want to add the outer div
            this.div.appendChild(btn);
            btn.action = id;
            btn.className = "olButton";

            //we want to remember/reference the outer div
            this.buttons.push(btn);
            return btn;
        },

        /** 
        * Method: _addZoomBar
        * 
        * Parameters:
        * centered - {<OpenLayers.Pixel>} where zoombar drawing is to start.
        */
        _addZoomBar: function (centered) {
            var imgLocation = this.IMG_BASE + 'slider.png';
            var id = this.id + "_" + this.map.id;
            var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
            var slider = OpenLayers.Util.createAlphaImageDiv(id,
                        centered.add(-1, (zoomsToEnd - 1) * this.zoomStopHeight),
                       { w: 21, h: 21 },
                       imgLocation,
                       "absolute");
            slider.style['z-index'] = 10000;
            slider.style.cursor = "move";
            this.slider = slider;

            this.sliderEvents = new OpenLayers.Events(this, slider, null, true,
                                            { includeXY: true });
            this.sliderEvents.on({
                "touchstart": this.zoomBarDown,
                "touchmove": this.zoomBarDrag,
                "touchend": this.zoomBarUp,
                "mousedown": this.zoomBarDown,
                "mousemove": this.zoomBarDrag,
                "mouseup": this.zoomBarUp
            });

            var sz = {
                w: this.zoomStopWidth,
                h: this.zoomStopHeight * (this.map.getNumZoomLevels() - 1)
            };
            var imgLocation = this.IMG_BASE + 'zoombar.png';
            var div = null;

            if (OpenLayers.Util.alphaHack()) {
                var id = this.id + "_" + this.map.id;
                div = OpenLayers.Util.createAlphaImageDiv(id, centered,
                                      { w: sz.w, h: this.zoomStopHeight },
                                      imgLocation,
                                      "absolute", null, "crop");
                div.style.height = sz.h + "px";
            } else {
                div = OpenLayers.Util.createDiv(
                        'OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id,
                        centered,
                        sz,
                        imgLocation);
            }
            div.style.cursor = "pointer";
            div.className = "olButton";
            this.zoombarDiv = div;

            this.div.appendChild(div);

            this.startTop = parseInt(div.style.top);
            this.div.appendChild(slider);

            this.map.events.register("zoomend", this, this.moveZoomBar);

            centered = centered.add(0,
            this.zoomStopHeight * (this.map.getNumZoomLevels() - 1));
            return centered;
        },

        /*
        * Method: moveZoomBar
        */
        moveZoomBar: function () {
            var newTop =
            ((this.map.getNumZoomLevels() - 2) - this.map.getZoom()) *
            this.zoomStopHeight + this.startTop + 1;
            this.slider.style.top = newTop + "px";
        },
        
        CLASS_NAME: 'OpenLayers.Control.PanZoomBar'

    });

    return OpenLayers.Control.PanZoomBar;
});