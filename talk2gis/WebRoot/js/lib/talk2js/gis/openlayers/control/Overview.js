define([
	"require"
], function(require) {
	
    return OpenLayers.Class(OpenLayers.Control.OverviewMap, {
    	
        MAXIMIZE_SWITCHER: require.toUrl('../../../resources/images/overview/overview-map-expand.png'),
        
        MINIMIZE_SWITCHER: require.toUrl('../../../resources/images/overview/overview-map-collapse.png'),

        draw: function() {
            OpenLayers.Control.prototype.draw.apply(this, arguments);
            if (this.layers.length === 0) {
                if (this.map.baseLayer) {
                    var layer = this.map.baseLayer.clone();
                    this.layers = [layer];
                } else {
                    this.map.events.register("changebaselayer", this, this.baseLayerDraw);
                    return this.div;
                }
            }

            // create overview map DOM elements
            this.element = document.createElement('div');
            this.element.className = this.displayClass + 'Element';
            this.element.style.display = 'none';

            this.mapDiv = document.createElement('div');
            this.mapDiv.style.width = this.size.w + 'px';
            this.mapDiv.style.height = this.size.h + 'px';
            this.mapDiv.style.position = 'relative';
            this.mapDiv.style.overflow = 'hidden';
            this.mapDiv.id = OpenLayers.Util.createUniqueID('overviewMap');

            this.extentRectangle = document.createElement('div');
            this.extentRectangle.style.position = 'absolute';
            this.extentRectangle.style.zIndex = 1000; //HACK
            this.extentRectangle.className = this.displayClass + 'ExtentRectangle';

            this.element.appendChild(this.mapDiv);

            this.div.appendChild(this.element);

            // Optionally add min/max buttons if the control will go in the
            // map viewport.
            if (!this.outsideViewport) {
                this.div.className += " " + this.displayClass + 'Container';
                // maximize button div
                var img = this.MAXIMIZE_SWITCHER;
                this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                this.displayClass + 'MaximizeButton',
                null,
                null,
                img,
                    'absolute');
                this.maximizeDiv.style.display = 'none';
                this.maximizeDiv.className = this.displayClass + 'MaximizeButton olButton';
                this.div.appendChild(this.maximizeDiv);

                // minimize button div
                var img = this.MINIMIZE_SWITCHER;
                this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                    'OpenLayers_Control_minimizeDiv',
                null,
                null,
                img,
                    'absolute');
                this.minimizeDiv.style.display = 'none';
                this.minimizeDiv.className = this.displayClass + 'MinimizeButton olButton';
                this.div.appendChild(this.minimizeDiv);
                this.minimizeControl();
            } else {
                // show the overview map
                this.element.style.display = '';
            }
            if (this.map.getExtent()) {
                this.update();
            }

            this.map.events.on({
                buttonclick: this.onButtonClick,
                moveend: this.update,
                scope: this
            });

            if (this.maximized) {
                this.maximizeControl();
            }
            return this.div;
        },
        
        updateOverview: function() {
        	var mapRes = this.map.getResolution();
            var targetRes = this.ovmap.getResolution();
            var resRatio = targetRes / mapRes;
            if(resRatio > this.maxRatio) {
                // zoom in overview map
                targetRes = this.minRatio * mapRes;            
            } else if(resRatio <= this.minRatio) {
                // zoom out overview map
                targetRes = this.maxRatio * mapRes;
            }
            var center;
            if (this.ovmap.getProjection() != this.map.getProjection()) {
                center = this.map.center.clone();
                center.transform(this.map.getProjectionObject(),
                    this.ovmap.getProjectionObject() );
            } else {
                center = this.map.center;
            }
            this.ovmap.setCenter(center, this.ovmap.getZoomForResolution(
                targetRes * this.resolutionFactor));
            this.updateRectToMap();
        },
        
        /**
         * Method: createMap
         * Construct the map that this control contains
         */
        createMap: function() {
            // create the overview map
            var options = OpenLayers.Util.extend(
                            {controls: [], maxResolution: 'auto', 
                             fallThrough: false}, this.mapOptions);
            this.ovmap = new OpenLayers.Map(this.mapDiv, options);
            this.ovmap.numZoomLevels = 19;
            this.ovmap.units = "m";
            this.ovmap.maxExtent = new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34);
            this.ovmap.resolutions = [
				156543.03390625,
				78271.516953125,
				39135.7584765625,
				19567.87923828125,
				9783.939619140625,
				4891.9698095703125,
				2445.9849047851562,
				1222.9924523925781,
				611.4962261962891,
				305.74811309814453,
				152.87405654907226,
				76.43702827453613,
				38.218514137268066,
				19.109257068634033,
				9.554628534317017,
				4.777314267158508,
				2.388657133579254,
				1.194328566789627,
				0.5971642833948135
			];
            this.ovmap.projection = "EPSG:900913";
			
            this.ovmap.viewPortDiv.appendChild(this.extentRectangle);
            
            // prevent ovmap from being destroyed when the page unloads, because
            // the OverviewMap control has to do this (and does it).
            OpenLayers.Event.stopObserving(window, 'unload', this.ovmap.unloadDestroy);
            
            this.ovmap.addLayers(this.layers);
            this.ovmap.zoomToMaxExtent();
            // check extent rectangle border width
            this.wComp = parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                                   'border-left-width')) +
                         parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                                   'border-right-width'));
            this.wComp = (this.wComp) ? this.wComp : 2;
            this.hComp = parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                                   'border-top-width')) +
                         parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                                   'border-bottom-width'));
            this.hComp = (this.hComp) ? this.hComp : 2;

            this.handlers.drag = new OpenLayers.Handler.Drag(
                this, {move: this.rectDrag, done: this.updateMapToRect},
                {map: this.ovmap}
            );
            this.handlers.click = new OpenLayers.Handler.Click(
                this, {
                    "click": this.mapDivClick
                },{
                    "single": true, "double": false,
                    "stopSingle": true, "stopDouble": true,
                    "pixelTolerance": 1,
                    map: this.ovmap
                }
            );
            this.handlers.click.activate();
            
            this.rectEvents = new OpenLayers.Events(this, this.extentRectangle,
                                                    null, true);
            this.rectEvents.register("mouseover", this, function(e) {
                if(!this.handlers.drag.active && !this.map.dragging) {
                    this.handlers.drag.activate();
                }
            });
            this.rectEvents.register("mouseout", this, function(e) {
                if(!this.handlers.drag.dragging) {
                    this.handlers.drag.deactivate();
                }
            });

            if (this.ovmap.getProjection() != this.map.getProjection()) {
                var sourceUnits = this.map.getProjectionObject().getUnits() ||
                    this.map.units || this.map.baseLayer.units;
                var targetUnits = this.ovmap.getProjectionObject().getUnits() ||
                    this.ovmap.units || this.ovmap.baseLayer.units;
                this.resolutionFactor = sourceUnits && targetUnits ?
                    OpenLayers.INCHES_PER_UNIT[sourceUnits] /
                    OpenLayers.INCHES_PER_UNIT[targetUnits] : 1;
            }
        },
        
        /**
         * APIMethod: destroy
         * Deconstruct the control
         */
        destroy: function() {
            if (!this.mapDiv) { // we've already been destroyed
                return;
            }
            if (this.handlers.click) {
                this.handlers.click.destroy();
            }
            if (this.handlers.drag) {
                this.handlers.drag.destroy();
            }

            this.ovmap && this.ovmap.viewPortDiv.removeChild(this.extentRectangle);
            this.extentRectangle = null;

            if (this.rectEvents) {
                this.rectEvents.destroy();
                this.rectEvents = null;
            }

            if (this.ovmap) {
                this.ovmap.destroy();
                this.ovmap = null;
            }
            
            this.element.removeChild(this.mapDiv);
            this.mapDiv = null;

            this.div.removeChild(this.element);
            this.element = null;

            if (this.maximizeDiv) {
                this.div.removeChild(this.maximizeDiv);
                this.maximizeDiv = null;
            }
            
            if (this.minimizeDiv) {
                this.div.removeChild(this.minimizeDiv);
                this.minimizeDiv = null;
            }

            this.map.events.un({
                buttonclick: this.onButtonClick,
                moveend: this.update,
                changebaselayer: this.baseLayerDraw,
                scope: this
            });

            OpenLayers.Control.prototype.destroy.apply(this, arguments);    
        }
        
    });
    
});