define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/on",
    "dojo/Evented",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "require",
    
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./MapInfoPopup.html"
], function (declare, lang, array, dom, on, Evented, domStyle, domConstruct, domGeom, require, 
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
		
        templateString: template,

        widgetsInTemplate: true,
        
        map: null,
        
        lonlat: null,
        
        closable: true,
        
        data: null,
        
        postCreate: function () {
        	this.inherited(arguments);
        	
        	var table = $('<table/>');
         	var tr = $('<tr/>');
            var tdName = $('<td class=name>车牌号:</td>');
            var tdValue = $('<td class=value>沪A34333</td>');
           	tr.append(tdName);
           	tr.append(tdValue);
          	table.append(tr);
          	
          	tr = $('<tr/>');
            tdName = $('<td class=name>所属单位:</td>');
            tdValue = $('<td class=value>长春一汽长春一汽长春一汽</td>');
           	tr.append(tdName);
           	tr.append(tdValue);
          	table.append(tr);
          	
          	tr = $('<tr/>');
            tdName = $('<td class=name>车速:</td>');
            tdValue = $('<td class=value>60km/h</td>');
           	tr.append(tdName);
           	tr.append(tdValue);
          	table.append(tr);
          	
          	tr = $('<tr/>');
            tdName = $('<td class=name>方向:</td>');
            tdValue = $('<td class=value>东北</td>');
           	tr.append(tdName);
           	tr.append(tdValue);
          	table.append(tr);
          	
          	tr = $('<tr/>');
            tdName = $('<td class=name>状态:</td>');
            tdValue = $('<td class=value>行驶</td>');
           	tr.append(tdName);
           	tr.append(tdValue);
          	table.append(tr);
          	
            $(this.containerNode).append(table);
        },
        
        startup: function () {
            this.inherited(arguments);
            
            on(this.closeNode, "click", lang.hitch(this, function(){
            	this.emit("close");
            }));
        },

        updatePosition: function (lonlat) {
        	if(lonlat){
        		this.lonlat = lonlat;
        	}
        	var connectorHeight = 13;
        	var h = $(this.domNode).height();
            var px = this.map.getPixelFromLonLat(this.lonlat);
            if (px) {
            	domStyle.set(this.domNode, {
            		left: px.x - 54 + "px",
            		top: px.y - h - connectorHeight - 2 + "px"
            	});
            	
            	domStyle.set(this.connectorNode, {
            		top: h - connectorHeight + "px"
            	});
            }
        },
        
        show: function () {
        	this.updatePosition();
            $(this.domNode).show();
        },
        
        hide: function () {
            $(this.domNode).hide();
        },

        destroy: function () {
        	this.data = null;
        	this.lonlat = null;
        	this.inherited(arguments);
        }
        
    });
});