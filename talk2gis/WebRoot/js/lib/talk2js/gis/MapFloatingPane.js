define([
    "dojo/_base/declare",
    "dojo/_base/fx",
    "dojo/_base/lang",
    "dojo/dom-geometry",
    "dojo/dnd/move",

    "dojox/layout/FloatingPane",
    "dojox/widget/Standby"
    //"dojo/text!./MapFloatingPane.html"
], function (declare, baseFx, lang, domGeom, move, FloatingPane, Standby) {

    var MapFloatingPane = declare([FloatingPane], {

        templateString: '<div style=\"padding:0px;\" class=\"mapFloatingPane\" id=\"${id}\"><div tabindex=\"0\" role=\"button\" class=\"mapFloatingPaneTitle\" dojoAttachPoint=\"focusNode\"><span dojoAttachPoint=\"closeNode\" dojoAttachEvent=\"onclick: close\" class=\"mapFloatingPaneCloseIcon\"></span><span dojoAttachPoint=\"maxNode\" dojoAttachEvent=\"onclick: maximize\" class=\"dojoxFloatingMaximizeIcon\">&thinsp;</span><span dojoAttachPoint=\"restoreNode\" dojoAttachEvent=\"onclick: _restore\" class=\"dojoxFloatingRestoreIcon\">&thinsp;</span><span dojoAttachPoint=\"dockNode\" dojoAttachEvent=\"onclick: minimize\" class=\"mapFloatingPaneMinimizeIcon\">&thinsp;</span><span dojoAttachPoint=\"titleNode\" class=\"dijitInline dijitTitleNode\"></span></div><div dojoAttachPoint=\"canvas\" class=\"dojoxFloatingPaneCanvas\"><div dojoAttachPoint=\"containerNode\" role=\"region\" tabindex=\"-1\" class=\"${contentClass}\"></div><span dojoAttachPoint=\"resizeHandle\" class=\"dojoxFloatingResizeHandle\"></span></div></div>',

        postCreate: function () {
            this.inherited(arguments);

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