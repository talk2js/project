define([
    "dojo/_base/declare",
    'dojo/_base/lang',
    "dojo/dom",
    "dojo/on",
    "dojo/store/Memory",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "require",
    
    "dijit/MenuItem",
    "dijit/layout/ContentPane",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    
    "./DropDownMenu",
    
    "dojo/text!./MenuBar.html"
], function (declare, lang, dom, on, Memory, domStyle, domConstruct, domGeom, require, 
		MenuItem, ContentPane, _WidgetBase, _TemplatedMixin, DropDownMenu, template) {
    
	return declare([_WidgetBase, _TemplatedMixin], {
		
        templateString: template,
        	
		postMixInProperties: function(){
		},
		
        postCreate: function () {
        	this.inherited(arguments);
        	
        	var menuItems = [];
        	var menuItem1 = new MenuItem({
                iconClass: "commonIcons dijitIconApplication",
                label: "erererer",
            });
        	menuItems.push(menuItem1);
        	var menuItem2 = new MenuItem({
                iconClass: "commonIcons dijitIconApplication",
                label: "测试功能选项",
            });
        	menuItems.push(menuItem2);
        	var menuItem3 = new MenuItem({
                label: "测试功能选项",
            });
        	menuItems.push(menuItem3);
        	
        	var dropDownMenu = new DropDownMenu({
                style: 'display: block',
                menuItems: menuItems
            });
        	this.domNode.appendChild(dropDownMenu.domNode);
        	dropDownMenu.startup();
        	
            /*on(this.testNode, 'mouseover', lang.hitch(this, function () {
            	domStyle.set(dropDownMenu.domNode, 'display', 'block');
            }));
            on(this.testNode, 'mouseleave', lang.hitch(this, function () {
             	domStyle.set(dropDownMenu.domNode, 'display', 'none');
            }));*/
        },
        
        startup: function () {
            this.inherited(arguments);
        },
 
        
        destroy: function () {
        	this.inherited(arguments);
        }
        
    });
	
});