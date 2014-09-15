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
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    
    "./DropDownMenu",
    "../../menuBarConfig"
    //"dojo/text!./MenuBar.html"
], function (declare, lang, dom, on, Memory, domStyle, domConstruct, domGeom, require, 
		MenuItem, _WidgetBase, _TemplatedMixin, DropDownMenu, menuBarConfig) {
    
	return declare([_WidgetBase, _TemplatedMixin], {
		
        templateString: '<div class="menubar"></div>',
        	
        postCreate: function () {
        	this.inherited(arguments);
        	
        	for (var i = 0; i < menuBarConfig.length; i++) {
        		var imgUrl = menuBarConfig[i].img;
            	var navMenu = domConstruct.toDom('<div class="menubarIcon" style="background:url(' + imgUrl + ');"></div>');
            	this.domNode.appendChild(navMenu);
            	
            	var menuItems = menuBarConfig[i].menuItems;
            	if(menuItems && menuItems.length > 0){
            		var arr = [];
            		for(var j = 0; j < menuItems.length; j++){
            			var menuItem = new MenuItem({
            				label: menuItems[j].label
            			});
            			arr.push(menuItem);
            		}
            		var dropDownMenu = new DropDownMenu({
                        style: 'display:none; margin-left:-40px; margin-top:30px;',
                        menuItems: arr
                    });
                	navMenu.appendChild(dropDownMenu.domNode);
                	dropDownMenu.startup();
                	
                	on(navMenu, 'mouseover', function () {
                    	domStyle.set(this.children[0], 'display', 'block');
                    });
                    on(navMenu, 'mouseleave', function () {
                     	domStyle.set(this.children[0], 'display', 'none');
                    });
            	}
			}
        },
        
        startup: function () {
            this.inherited(arguments);
        },
 
        
        destroy: function () {
        	this.inherited(arguments);
        }
        
    });
	
});