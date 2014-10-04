define([ 
	"dojo/_base/kernel", 
	"dojo/_base/lang", 
	"dojo/_base/window",
	"dojo/_base/declare", 
	"dojo/_base/fx", 
	"dojo/_base/connect",
	"dojo/_base/array", 
	"dojo/_base/sniff", 
	"dojo/window", 
	"dojo/dom",
	"dojo/dom-class", 
	"dojo/dom-geometry", 
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dnd/Moveable", 
	
	"dijit/_TemplatedMixin", 
	"dijit/_Widget", 
	"dijit/BackgroundIframe",
	"dijit/layout/ContentPane",
	
	"dojo/text!./MapFloatingPane.html", 
	"dojox/layout/Dock" 
], function(kernel, lang, winUtil, declare, baseFx, connectUtil, arrayUtil, has, windowLib,
		dom, domClass, domGeom, domConstruct, domStyle, Moveable, TemplatedMixin, Widget,
		BackgroundIframe, ContentPane, template, Dock) {

	var FloatingPane = declare([ ContentPane, TemplatedMixin ], {
		// summary:
		// A non-modal Floating window.
		// description:
		// Makes a `dojox.layout.ContentPane` float and draggable by it's title
		// [similar to TitlePane]
		// and over-rides onClick to onDblClick for wipeIn/Out of containerNode
		// provides minimize(dock) / show() and hide() methods, and resize
		// [almost]

		// closable: Boolean
		// Allow closure of this Node
		closable : true,

		// dockable: Boolean
		// Allow minimizing of pane if true
		dockable : true,

		// title: String
		// Title to use in the header
		title : "",

		titleIcon: null,
		
		// dockTo: DomNode?
		// if empty, will create private layout.Dock that scrolls with viewport
		// on bottom span of viewport.
		dockTo : null,

		// duration: Integer
		// Time is MS to spend toggling in/out node
		duration : 400,

		// node in the dock (if docked)
		_dockNode : null,
		
		_allFPs : [],

		_startZ : 100,

		templateString : template,

		postMixInProperties: function(){
			if(this.titleIcon == null){
				this.titleIcon = "queryTitleIcon";
			}
		},
		
		postCreate : function() {
			this.inherited(arguments);

			var p = domGeom.position(this.domNode);
			var p1 = domGeom.position(this.focusNode);
			domStyle.set(this.containerNode, {
				height : (p.h - p1.h - 4) + "px"
			});

			new Moveable(this.domNode, {
				handle : this.focusNode
			});

			if (!this.dockable) {
				this.dockNode.style.display = "none";
			}
			if (!this.closable) {
				this.closeNode.style.display = "none";
			}
			this._allFPs.push(this);
			this.domNode.style.position = "absolute";

			this.bgIframe = new BackgroundIframe(this.domNode);
			this._naturalState = domGeom.position(this.domNode);
		},

		startup : function() {
			if (this._started) {
				return;
			}

			this.inherited(arguments);

			if (this.dockable) {
				if ((this.domNode.style.display == "none")
						|| (this.domNode.style.visibility == "hidden")) {
					// If the FP is created dockable and non-visible, start up
					// docked.
					this.minimize();
				}
			}
			this.connect(this.focusNode, "onmousedown", "bringToTop");
			this.connect(this.domNode, "onmousedown", "bringToTop");

			// Initial resize to give child the opportunity to lay itself out
			this.resize(domGeom.position(this.domNode));

			this._started = true;
		},

		setTitle : function(/* String */title) {
			// summary:
			// Update the Title bar with a new string
			kernel.deprecated("pane.setTitle",
					"Use pane.set('title', someTitle)", "2.0");
			this.set("title", title);
		},

		close : function() {
			// summary:
			// Close and destroy this widget
			if (!this.closable) {
				return;
			}
			connectUtil.unsubscribe(this._listener);
			this.hide(lang.hitch(this, function() {
				this.destroyRecursive();
			}));
		},

		hide : function(/* Function? */callback) {
			// summary:
			// Close, but do not destroy this FloatingPane
			baseFx.fadeOut({
				node : this.domNode,
				duration : this.duration,
				onEnd : lang.hitch(this, function() {
					this.domNode.style.display = "none";
					this.domNode.style.visibility = "hidden";
					if (this.dockTo && this.dockable) {
						this.dockTo._positionDock(null);
					}
					if (callback) {
						callback();
					}
				})
			}).play();
		},

		show : function(/* Function? */callback) {
			// summary:
			// Show the FloatingPane
			var anim = baseFx.fadeIn({
				node : this.domNode,
				duration : this.duration,
				beforeBegin : lang.hitch(this, function() {
					this.domNode.style.display = "";
					this.domNode.style.visibility = "visible";
					if (this.dockTo && this.dockable) {
						this.dockTo._positionDock(null);
					}
					if (typeof callback == "function") {
						callback();
					}
					this._isDocked = false;
					if (this._dockNode) {
						this._dockNode.destroy();
						this._dockNode = null;
					}
				})
			}).play();
			// use w / h from content box dimensions and x / y from position
			var contentBox = domGeom.getContentBox(this.domNode)
			this.resize(lang.mixin(domGeom.position(this.domNode), {
				w : contentBox.w,
				h : contentBox.h
			}));
			this._onShow(); // lazy load trigger
		},

		minimize : function() {
			// summary:
			// Hide and dock the FloatingPane
			if (!this._isDocked) {
				this.hide(lang.hitch(this, "_dock"));
			}
		},

		_dock : function() {
			if (!this._isDocked && this.dockable) {
				this._dockNode = this.dockTo.addNode(this);
				this._isDocked = true;
			}
		},

		resize : function(/* Object */dim) {
			this.getChildren().forEach(function(widget) {
				if (widget.resize) {
					widget.resize();
				}
			});
		},

		bringToTop : function() {
			// summary:
			// bring this FloatingPane above all other panes
			var windows = arrayUtil.filter(this._allFPs, function(i) {
				return i !== this;
			}, this);
			windows.sort(function(a, b) {
				return a.domNode.style.zIndex - b.domNode.style.zIndex;
			});
			windows.push(this);

			arrayUtil.forEach(windows, function(w, x) {
				w.domNode.style.zIndex = this._startZ + (x * 2);
				domClass.remove(w.domNode, "dojoxFloatingPaneFg");
			}, this);
			domClass.add(this.domNode, "dojoxFloatingPaneFg");
		},

		destroy : function() {
			// summary:
			//		Destroy this FloatingPane completely
			this._allFPs.splice(arrayUtil.indexOf(this._allFPs, this), 1);
			if (this._dockNode) {
				this._dockNode.destroy();
			}
			this.inherited(arguments);
		}
	});

	return FloatingPane;
	
});