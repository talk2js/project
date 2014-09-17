/**
 * ZIndexManagerConrol
 * 控制图层显示顺序的控件，捕获地图addlayer事件，将Markers图层永远置于顶层
 */
define([
	'dojo/_base/array'
], function(array) {
	
    return OpenLayers.Class(OpenLayers.Control, {
    	
        initialize: function(options) {
            OpenLayers.Control.prototype.initialize.apply(this, arguments);
        },
        
        setMap: function(map) {
            OpenLayers.Control.prototype.setMap.apply(this, arguments);
            /**
             * 重写Map中的Z_INDEX_BASE，由于我们的应用中overlay数量太多，原来的设定会导致Overlay有一定概率落在overlay之下
             * 将Feature属性调整到与Overlay一致，这个属性由Handler.Feature调用，如果使用了这个Handler，它会把当前图层置顶
             */
            map.Z_INDEX_BASE = {
                BaseLayer: 100,
                Overlay: 325,
                Feature: 325,
                Popup: 1500,
                Control: 2000
            };
            map.events.register('addlayer', this, function() {
                this._adjustMarkersLayerIndex();
            });
        },
        
        _adjustMarkersLayerIndex: function() {
            var me = this;
            var markersLayer = [];
            for (var i = 0; i < me.map.layers.length; ++i) {
                var layer;
                layer = me.map.layers[i];
                if (layer.CLASS_NAME == 'OpenLayers.Layer.Markers') {
                    //me.map.setLayerIndex(layer, me.map.layers.length);
                    markersLayer.push(layer);
                    //me._moveLayerToTop(layer);
                }
            }
            array.forEach(markersLayer, function(layer) {
                me.map.setLayerIndex(layer, me.map.layers.length);
            });
        },
        
        _moveLayerToTop: function(layer) {
            var index = Math.max(this.map.Z_INDEX_BASE['Feature'] - 1,
            layer.getZIndex()) + 1;
            layer.setZIndex(index);
        },
        
        _getMaxZIndex: function() {
            var me = this,
                max = -1;
            for (var i = 0; i < me.map.layers.length; ++i) {
                var layer;
                layer = me.map.layers[i];
                if (layer.getZIndex() > max) max = layer.getZIndex();
            }
            return max;
        },
        
        forceUpdate: function () {
            this._adjustMarkersLayerIndex();
        },
        
        draw: function() {},
        
        CLASS_NAME: 'OpenLayers.Control.ZIndexManagerControl'
        	
    });
});