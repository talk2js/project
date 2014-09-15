define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "require",
    
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    
    "dojo/text!./MapInfoPopup.html"
], function (declare, lang, array, dom, on, domStyle, domConstruct, domGeom, require, 
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
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
            var tdName = $('<td class=name>test:</td>');
            var tdValue = $('<td class=value>vdsfsdfsdfsfd</td>');
           	tr.append(tdName);
           	tr.append(tdValue);
          	table.append(tr);
            $(this.containerNode).append(table);
        },
        
        startup: function () {
            this.inherited(arguments);
            this.updatePosition();
        },

        updatePosition: function (lonlat) {
        	if(lonlat){
        		this.lonlat = lonlat;
        	}
            var px = this.map.getPixelFromLonLat(this.lonlat);
            if (px) {
            	domStyle.set(this.domNode, {
            		left: px.x + "px",
            		top: px.y + "px"
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