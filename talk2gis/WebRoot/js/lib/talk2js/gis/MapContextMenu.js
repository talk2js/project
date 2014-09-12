define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    
    "dijit/popup",
    "dijit/Menu",
    "dijit/MenuItem",

    "./openlayers/control/ZoomBoxControl",
    "./util/mercator"
], function (declare, lang, topic, popup, Menu, MenuItem, ZoomBoxControl, mercator) {
    
	return declare([Menu], {

        map: null,

        _menu: null,

        _zoominBoxHandler: null,

        _zoomoutBoxHandler: null,

        _lineMeasureHandler: null,

        _areaMeasureHandler: null,

        postCreate: function () {
            this.inherited(arguments);
            this._initHandler();
            this._initContextMenu();
        },
        
        _initHandler: function () {
            var me = this;

            /* 测量距离                                                             */
            me._lineMeasureHandler = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
                persist: true,
                immediate: false
            });
            me.map.addControl(me._lineMeasureHandler);
            me._lineMeasureHandler.events.on({
                "measure": function (e) {
                    //console.debug(e);
                    var unitStr = "";
                    if (e.units == "m") {
                        unitStr = "米";
                    } else if (e.units == "km") {
                        unitStr = "公里";
                    }
                    var text = "距离: " + e.measure.toFixed(3) + unitStr;
                    alert(text);
                    me._lineMeasureHandler.deactivate();
                }
            });

            /* 测量面积                                                             */
            me._areaMeasureHandler = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
                persist: true,
                immediate: false
            });
            me.map.addControl(me._areaMeasureHandler);
            me._areaMeasureHandler.events.on({
                "measure": function (e) {
                    //console.debug(e);
                    var unitStr = "";
                    if (e.units == "m") {
                        unitStr = "平方米";
                    } else if (e.units == "km") {
                        unitStr = "平方公里";
                    }
                    var text = "面积: " + e.measure.toFixed(3) + unitStr;
                    alert(text);
                    me._areaMeasureHandler.deactivate();
                }
            });

            /* 框选放大                                                             */
            var control = new ZoomBoxControl();
            me.map.addControl(control);
            me._zoominBoxHandler = new OpenLayers.Handler.Box(control, {
                done: function (position) {
                    control.zoomBox(position, false);
                    me._zoominBoxHandler.deactivate();
                }
            });

            /* 框选缩小                                                             */
            me._zoomoutBoxHandler = new OpenLayers.Handler.Box(control, {
                done: function (position) {
                    control.zoomBox(position, true);
                    me._zoomoutBoxHandler.deactivate();
                }
            });
        },

        _initContextMenu: function () {
            var me = this;
            me.addChild(new MenuItem({
                label: "清理地图",
                iconClass: "cleanMapIcon",
                onClick: function (e) {
                	topic.publish("china317gis/clearMap");
                }
            }));
            me.addChild(new MenuItem({
                label: "全图",
                iconClass: "fullExtentIcon",
                onClick: function (e) {
                    OpenLayers.Element.removeClass(me.map.viewPortDiv, "olDrawBox");
                    me.deactivateAll();
                    //me.map.zoomToExtent(me.mapConfig.map.fullExtent, true);
                    var center = new OpenLayers.LonLat(11983491.5, 4217489.5);
        			me.map.moveTo(center, 4);
                }
            }));
            me.addChild(new MenuItem({
                label: "测量距离",
                iconClass: "lineMeasureIcon",
                onClick: function (e) {
                    OpenLayers.Element.removeClass(me.map.viewPortDiv, "olDrawBox");
                    me.deactivateAll();
                    me._lineMeasureHandler.activate();
                }
            }));
            me.addChild(new MenuItem({
                label: "测量面积",
                iconClass: "areaMeasureIcon",
                onClick: function (e) {
                    OpenLayers.Element.removeClass(me.map.viewPortDiv, "olDrawBox");
                    me.deactivateAll();
                    me._areaMeasureHandler.activate();
                }
            }));
            me.addChild(new MenuItem({
                label: "框选放大",
                iconClass: "zoomInIcon",
                onClick: function (e) {
                    OpenLayers.Element.addClass(me.map.viewPortDiv, "olDrawBox");
                    me.deactivateAll();
                    me._zoominBoxHandler.activate();
                }
            }));
            me.addChild(new MenuItem({
                label: "框选缩小",
                iconClass: "zoomOutIcon",
                onClick: function (e) {
                    OpenLayers.Element.addClass(me.map.viewPortDiv, "olDrawBox");
                    me.deactivateAll();                    
                    me._zoomoutBoxHandler.activate();
                }
            }));
        },
        
        deactivateAll: function(){
        	this._lineMeasureHandler.deactivate();
        	this._areaMeasureHandler.deactivate();
        	this._zoominBoxHandler.deactivate();
        	this._zoomoutBoxHandler.deactivate();
        }

    });
});