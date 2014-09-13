define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/on",
	"dojo/dom", // dom.isDescendant
	"dojo/dom-attr", // domAttr.set
	"dojo/dom-construct", // domConstruct.create domConstruct.destroy
	"dojo/dom-geometry", // domGeometry.isBodyLtr
	"dojo/dom-style", // domStyle.set
	"dojo/has", // has("config-bgIframe")
	
	"dijit/popup",
	"dijit/Viewport",
	"dijit/place"
], function(declare, lang, on, dom, domAttr, domConstruct, domGeometry, domStyle, 
		has, popup, Viewport, place) {

	popup.open = function(__OpenArgs args){
		// summary:
		//		Popup the widget at the specified position
		//
		// example:
		//		opening at the mouse position
		//		|		popup.open({popup: menuWidget, x: evt.pageX, y: evt.pageY});
		//
		// example:
		//		opening the widget as a dropdown
		//		|		popup.open({parent: this, popup: menuWidget, around: this.domNode, onClose: function(){...}});
		//
		//		Note that whatever widget called dijit/popup.open() should also listen to its own _onBlur callback
		//		(fired from _base/focus.js) to know that focus has moved somewhere else and thus the popup should be closed.

		var stack = this._stack,
			widget = args.popup,
			node = widget.domNode,
			orient = args.orient || ["below", "below-alt", "above", "above-alt"],
			ltr = args.parent ? args.parent.isLeftToRight() : domGeometry.isBodyLtr(widget.ownerDocument),
			around = args.around,
			id = (args.around && args.around.id) ? (args.around.id + "_dropdown") : ("popup_" + this._idGen++);

		// If we are opening a new popup that isn't a child of a currently opened popup, then
		// close currently opened popup(s).   This should happen automatically when the old popups
		// gets the _onBlur() event, except that the _onBlur() event isn't reliable on IE, see [22198].
		while(stack.length && (!args.parent || !dom.isDescendant(args.parent.domNode, stack[stack.length - 1].widget.domNode))){
			this.close(stack[stack.length - 1].widget);
		}

		// Get pointer to popup wrapper, and create wrapper if it doesn't exist.  Remove display:none (but keep
		// off screen) so we can do sizing calculations.
		var wrapper = this.moveOffScreen(widget);

		if(widget.startup && !widget._started){
			widget.startup(); // this has to be done after being added to the DOM
		}

		// Limit height to space available in viewport either above or below aroundNode (whichever side has more
		// room), adding scrollbar if necessary. Can't add scrollbar to widget because it may be a <table> (ex:
		// dijit/Menu), so add to wrapper, and then move popup's border to wrapper so scroll bar inside border.
		var maxHeight, popupSize = domGeometry.position(node);
		if("maxHeight" in args && args.maxHeight != -1){
			maxHeight = args.maxHeight || Infinity;	// map 0 --> infinity for back-compat of _HasDropDown.maxHeight
		}else{
			var viewport = Viewport.getEffectiveBox(this.ownerDocument),
				aroundPos = around ? domGeometry.position(around, false) : {y: args.y - (args.padding||0), h: (args.padding||0) * 2};
			maxHeight = Math.floor(Math.max(aroundPos.y, viewport.h - (aroundPos.y + aroundPos.h)));
		}
		if(popupSize.h > maxHeight){
			// Get style of popup's border.  Unfortunately domStyle.get(node, "border") doesn't work on FF or IE,
			// and domStyle.get(node, "borderColor") etc. doesn't work on FF, so need to use fully qualified names.
			var cs = domStyle.getComputedStyle(node),
				borderStyle = cs.borderLeftWidth + " " + cs.borderLeftStyle + " " + cs.borderLeftColor;
			domStyle.set(wrapper, {
				overflowY: "scroll",
				height: maxHeight + "px",
				border: borderStyle	// so scrollbar is inside border
			});
			node._originalStyle = node.style.cssText;
			node.style.border = "none";
		}

		domAttr.set(wrapper, {
			id: id,
			style: {
				zIndex: this._beginZIndex + stack.length
			},
			"class": "dijitPopup " + (widget.baseClass || widget["class"] || "").split(" ")[0] + "Popup",
			dijitPopupParent: args.parent ? args.parent.id : ""
		});

		if(stack.length == 0 && around){
			// First element on stack. Save position of aroundNode and setup listener for changes to that position.
			this._firstAroundNode = around;
			this._firstAroundPosition = domGeometry.position(around, true);
			this._aroundMoveListener = setTimeout(lang.hitch(this, "_repositionAll"), 50);
		}

		if(has("config-bgIframe") && !widget.bgIframe){
			// setting widget.bgIframe triggers cleanup in _WidgetBase.destroyRendering()
			widget.bgIframe = new BackgroundIframe(wrapper);
		}

		// position the wrapper node and make it visible
		var layoutFunc = widget.orient ? lang.hitch(widget, "orient") : null;
		
		//////// TODO MODIFIED
		var best;
		if(around){
			best = place.around(wrapper, around, orient, ltr, layoutFunc);
		} else {
			best = place.at(wrapper, args, orient == 'R' ? ['BL', 'BR', 'TL', 'TR'] : ['BL', 'BR', 'TR', 'TL'], args.padding, layoutFunc);
		}
		////////
		
		wrapper.style.visibility = "visible";
		node.style.visibility = "visible";	// counteract effects from _HasDropDown

		var handlers = [];

		// provide default escape and tab key handling
		// (this will work for any widget, not just menu)
		handlers.push(on(wrapper, "keydown", lang.hitch(this, function(evt){
			if(evt.keyCode == keys.ESCAPE && args.onCancel){
				evt.stopPropagation();
				evt.preventDefault();
				args.onCancel();
			}else if(evt.keyCode == keys.TAB){
				evt.stopPropagation();
				evt.preventDefault();
				var topPopup = this.getTopPopup();
				if(topPopup && topPopup.onCancel){
					topPopup.onCancel();
				}
			}
		})));

		// watch for cancel/execute events on the popup and notify the caller
		// (for a menu, "execute" means clicking an item)
		if(widget.onCancel && args.onCancel){
			handlers.push(widget.on("cancel", args.onCancel));
		}

		handlers.push(widget.on(widget.onExecute ? "execute" : "change", lang.hitch(this, function(){
			var topPopup = this.getTopPopup();
			if(topPopup && topPopup.onExecute){
				topPopup.onExecute();
			}
		})));

		stack.push({
			widget: widget,
			wrapper: wrapper,
			parent: args.parent,
			onExecute: args.onExecute,
			onCancel: args.onCancel,
			onClose: args.onClose,
			handlers: handlers
		});

		if(widget.onOpen){
			// TODO: in 2.0 standardize onShow() (used by StackContainer) and onOpen() (used here)
			widget.onOpen(best);
		}

		return best;
	}
	
	return dijit.popup;
	
});
