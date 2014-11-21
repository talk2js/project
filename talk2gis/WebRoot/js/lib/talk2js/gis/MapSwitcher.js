define([
    "dojo/_base/declare",
    'dojo/_base/lang',
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/mouse",
    "dojo/fx",
    "dojo/dom-geometry",
    "require",
    
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin"
], function (declare, lang, on, domConstruct, domStyle, mouse, coreFx, domGeom, require, 
		_WidgetBase, _TemplatedMixin) {
    
	return declare([_WidgetBase, _TemplatedMixin], {
		
        templateString: '<div style=\"position:absolute; top:40px; right:60px; width:21px; height:25px; z-index:100;\"></div>',

        map: null,
        
        nodes: null,
        
        mapabcImagePath: require.toUrl("../resources/images/mapswitcher/mapabc.png"),
        
        googleImagePath: require.toUrl("../resources/images/mapswitcher/google.png"),
        
        qqImagePath: require.toUrl("../resources/images/mapswitcher/qq.png"),
        
        highIndex: 100,
        
        lowIndex: 99,
        
        imageWidth: 57,
	
		imageHeight: 57,
        
        postCreate: function () {
            this.inherited(arguments);
            // 加入地图图片节点
            this.nodes = [];
            for (var i = 0; i < this.map.layers.length; i++) {
            	if(this.map.layers[i].isBaseLayer){
            		var node;
            		if(this.map.baseLayer === this.map.layers[i]){
            			node = this._createImageNode(this.map.layers[i], true);
            		} else {
            			node = this._createImageNode(this.map.layers[i], false);
            		}
            		this.nodes.push(node);
            	}
            }
            
        },

        _createImageNode: function(baseLayer, selected){
        	var imagePath;
        	if(baseLayer.CLASS_NAME == "OpenLayers.Layer.MapABC"){
        		imagePath = this.mapabcImagePath;
        	} else if (baseLayer.CLASS_NAME == "OpenLayers.Layer.Google") {
        		imagePath = this.googleImagePath;
        	} else if (baseLayer.CLASS_NAME == "OpenLayers.Layer.QQ") {
        		imagePath = this.qqImagePath;
        	}
        	var node = domConstruct.create('div');
        	domStyle.set(node, {
        		position: "absolute",
            	width: this.imageWidth + "px",
            	height: this.imageHeight + "px",
            	backgroundImage: "url(" + imagePath + ")",
            	cursor: "pointer",
            	zIndex: selected ? this.highIndex : this.lowIndex
        	});
        	node.selected = selected;
        	node.layerClass = baseLayer.CLASS_NAME;
        	this.domNode.appendChild(node);
        	return node;
        },
        
        startup: function () {
            this.inherited(arguments);
            
            on(this.domNode, mouse.enter, lang.hitch(this, function(){
            	this._expand();
            }));
            
            on(this.domNode, mouse.leave, lang.hitch(this, function(){
            	this._collapse();
            }));
            
            for (var i = 0; i < this.nodes.length; i++) {
            	on(this.nodes[i], "click", lang.hitch(this, function(e){
                	this._switch(e);
                }));
            }
        },
        
        _switch: function(e){
        	var node = e.target;
        	if(node.selected){
        		return ;
        	}
        	var index;
        	for (var i = 0; i < this.nodes.length; i++) {
        		domStyle.set(this.nodes[i], {
        			left: "0px",
                	zIndex: this.lowIndex
            	});
            	this.nodes[i].selected = false;
            	
            	if(node == this.nodes[i]){
            		index = i;
            	}
        	}
        	this.nodes.splice(index, 1);
        	this.nodes.unshift(node);
        	domStyle.set(node, {
            	zIndex: this.highIndex
        	});
        	node.selected = true;
        	this._collapse();
        	/////
        	this._switchLayer(node.layerClass);
        },
        
        _switchLayer: function(layerClass){
        	for (var i = 0; i < this.map.layers.length; i++) {
            	if(this.map.layers[i].isBaseLayer && this.map.layers[i].CLASS_NAME == layerClass){
            		this.map.setBaseLayer(this.map.layers[i]);
            		return ;
            	}
            }
        },
        
        _expand: function(){
        	coreFx.slideTo({
        		node: this.nodes[1],
        	    left: -this.imageWidth + "",
        	    units: "px"
        	}).play();
        	coreFx.slideTo({
        		node: this.nodes[2],
        	    left: -this.imageWidth * 2 + "",
        	    units: "px"
        	}).play();
        },
        
        _collapse: function(){
        	coreFx.slideTo({
        		node: this.nodes[1],
        	    left: "0",
        	    units: "px"
        	}).play();
        	coreFx.slideTo({
        		node: this.nodes[2],
        	    left: "0",
        	    units: "px"
        	}).play();
        },
        
        destroy: function () {
        	this.inherited(arguments);
        }
        
    });
	
});