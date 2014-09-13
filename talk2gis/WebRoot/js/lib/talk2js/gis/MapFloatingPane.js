define([
    "dojo/_base/declare",
    "dojo/_base/fx",
    "dojo/_base/lang",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/dnd/move",

    "dojox/layout/FloatingPane",
    "dojox/widget/Standby",
    "dojo/text!./MapFloatingPane.html"
], function (declare, baseFx, lang, domGeom, domStyle, move, FloatingPane, Standby, template) {

    var MapFloatingPane = declare([FloatingPane], {

        templateString: template,
        	
        postCreate: function () {
            this.inherited(arguments);

            var p = domGeom.position(this.domNode);
            console.debug(p.h);
            var p1  = domGeom.position(this.focusNode);
            console.debug(p1.h);
            domStyle.set(this.canvas, {
        		height: (p.h - p1.h - 5) + "px"
        	});
            
            // 创建等待提示
            this.standby = new Standby({
                target: this.domNode
            });
            document.body.appendChild(this.standby.domNode);
            this.standby.startup();

            // 设置面板可拖动范围
            new move.boxConstrainedMoveable(this.domNode, {
                handle: this.focusNode,
                box: {
                    l: 0,
                    t: 0,
                    w: document.body.clientWidth - $(this.domNode).outerWidth() - 200,
                    h: document.body.clientHeight - $(this.domNode).outerHeight()
                },
                within: false
            });
        },
        
        startup: function(){
        	this.inherited(arguments);
        },

        resize: function (dim) {
        },

        destroy: function () {
        	if(this.standby){
        		this.standby.destroy();
        	}
            if(this._dockNode){
				this._dockNode.destroy();
			}
            this.inherited(arguments);
        }

    });

    return MapFloatingPane;

});