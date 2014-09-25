define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/aspect",
	"dojo/fx",
	"dojo/sniff",
	
	"dijit/registry",
	"dijit/layout/StackContainer"
], function(declare, lang, dom, domGeometry, domStyle, domClass, aspect, fx, has, 
		registry, StackContainer) {

	return declare([StackContainer], {
		
		buildRendering: function(){
			this.inherited(arguments);
			
			$(this.domNode).css({
				"height": this._getCurrentHeight() + "px", 
				"width": "100%",
				"position": "absoulte",
				"z-index": "10",
				"left": "0px",
				"top": $("#header").height() + "px"
			});
		},
		
		postCreate: function(){
			this.inherited(arguments);
			
			$(window).resize(lang.hitch(this, function(){
            	$(this.domNode).css("height", this._getCurrentHeight());
            	this.resize();
            }));
		},
		
		_getCurrentHeight: function(){
			var height = document.body.clientHeight - $("#header").height() - $("#footer").height();
			return height;
		},
		
		_transition: function(newWidget, oldWidget /*===== ,  animate =====*/){
			// summary:
			//		Hide the old widget and display the new widget.
			//		Subclasses should override this.
			// newWidget: dijit/_WidgetBase
			//		The newly selected widget.
			// oldWidget: dijit/_WidgetBase
			//		The previously selected widget.
			// animate: Boolean
			//		Used by AccordionContainer to turn on/off slide effect.
			// tags:
			//		protected extension
			if(oldWidget){
				this._hideChild(oldWidget);
			}
			
			setTimeout(lang.hitch(this, function () {
				this._showChild(newWidget);

				// Size the new widget, in case this is the first time it's being shown,
				// or I have been resized since the last time it was shown.
				// Note that page must be visible for resizing to work.
				if(newWidget.resize){
					if(this.doLayout){
						newWidget.resize(this._containerContentBox || this._contentBox);
					}else{
						// the child should pick it's own size but we still need to call resize()
						// (with no arguments) to let the widget lay itself out
						newWidget.resize();
					}
				}
			}), 800);

			return (newWidget._onShow && newWidget._onShow()) || true;	// If child has an href, promise that fires when the child's href finishes loading
		},

		_hideChild: function(/*dijit/_WidgetBase*/ page){
			// summary:
			//		Hide the specified child by changing it's CSS, and call _onHide() so
			//		it's notified.
			page._set("selected", false);
            
		    fx.slideTo({
		        node: page._wrapper,
		        left: document.body.clientWidth - 10 + "",
		        duration: 800,
		        units: "px",
		        onEnd: function(){
		        	// 移动结束后，隐藏并返回原处
		        	domClass.replace(page._wrapper, "dijitHidden", "dijitVisible");
		            $(page._wrapper).css({
		            	"left": "0px",
		            	"top": "0px"
		            });
		        }
		    }).play();
			page.onHide && page.onHide();
		},
		
		_showChild: function(/*dijit/_WidgetBase*/ page){
			// summary:
			//		Show the specified child by changing it's CSS, and call _onShow()/onShow() so
			//		it can do any updates it needs regarding loading href's etc.
			// returns:
			//		Promise that fires when page has finished showing, or true if there's no href
			var children = this.getChildren();
			page.isFirstChild = (page == children[0]);
			page.isLastChild = (page == children[children.length - 1]);
			page._set("selected", true);

			if(page._wrapper){	// false if not started yet
				// 先移动到最左边
				$(page._wrapper).css("left", -document.body.clientWidth + "px");
				// 设置显示
				domClass.replace(page._wrapper, "dijitVisible", "dijitHidden");
				// 移动到页面范围中
				fx.slideTo({
                    node: page._wrapper,
                    left: 0 + "",
                    duration: 800,
                    units: "px"
                }).play();
			}

			return (page._onShow && page._onShow()) || true;
		}

	});

});