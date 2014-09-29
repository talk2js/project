/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-4-24
* To change this template use File | Settings | File Templates.
*/
define([
    "dojo/_base/declare",
    "dojo/dom-construct",

    "dijit/_Widget",
    "dijit/_TemplatedMixin",

    "dojox/layout/Dock"
], function (declare, domConstruct, _Widget, _TemplatedMixin, Dock) {

    var dock = declare([Dock], {

        templateString: '<div class="mapPaneDock"><ul dojoAttachPoint="containerNode"></ul></div>',

        /**
        * @override
        */
        addNode: function (refNode) {
            var div = domConstruct.create('li', null, this.containerNode),
			node = new DockNode({
			    title: refNode.title,
			    paneRef: refNode
			}, div);

            node.startup();
            return node;
        },

        /**
        * @override
        */
        startup: function () {
            this.inherited(arguments);
        }

    });

    var DockNode = declare("china317gis._MapPaneDockNode", [_Widget, _TemplatedMixin], {
        // summary:
        //		dojox.layout._DockNode is a private widget used to keep track of
        //		which pane is docked.

        // title: String
        //		Shown in dock icon. should read parent iconSrc?
        title: "",

        // paneRef: Widget
        //		reference to the FloatingPane we reprasent in any given dock
        paneRef: null,

        templateString:
		'<li dojoAttachEvent="onclick: restore" class="mapPaneDockNode">' +
			
			'<button dojoAttachPoint="restoreNode" class="mapPaneDockRestoreButton" dojoAttachEvent="onclick: restore"><span class="dockIcon"></span>${title}</button>' +
		'</li>',

        restore: function () {
            // summary:
            //		remove this dock item from parent dock, and call show() on reffed floatingpane
            this.paneRef.show();
            this.paneRef.bringToTop();
            this.destroy();
        }
    });

    return dock;

});