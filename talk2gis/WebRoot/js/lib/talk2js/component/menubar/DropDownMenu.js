/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-1
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/aspect',
    "dojo/on",
    'dojo/dom-style',
    "dojo/mouse",
    "dojo/_base/window",
    
    "dijit/layout/ContentPane",
    "dijit/_TemplatedMixin",
    "dijit/Menu",
    
    "dojo/text!./DropDownMenu.html"
], function (declare, lang, aspect, on, domStyle, mouse, window, 
		ContentPane, _TemplatedMixin, Menu, template) {

    return declare([ContentPane, _TemplatedMixin], {
    	
        baseClass: "dijitTooltipDialog",
        
        templateString: template,
        
        menuItems: null,
        
        menu: null,
        
        postCreate: function () {
            this.inherited(arguments);
            
            this.menu = new Menu({
                style: "border:0px; padding:0px; mairgin:0px;"
            });
            if (this.menuItems) {
                for (var i = 0; i < this.menuItems.length; i++) {
                	this.menu.addChild(this.menuItems[i]);
                }
            }
            this.addChild(this.menu);
        },
        
        destroy: function () {
            this.menu.destroy();
            this.menuItems = null;
            this.inherited(arguments);
        }
        
    });
});

