define([
    "dojo/_base/declare",
    'dojo/_base/array',
    "dojo/_base/lang",
    "dojo/on",
    "dojo/has",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/aspect",
    'dojo/request',

    "dijit/popup",
    "dijit/layout/ContentPane",
    
    "dojox/collections/ArrayList",
    
    "./MapTool",
    "./MapFloatingPane",
    "./MapInfoPopup",
    "./MapContextMenu",
    "./MapSwitcher",
    "./MapSlider",
    "./MapPaneDock",
    "./mapFactory",
	"./Busline",
	"./Poi",
	"./PoiCluster",
	"./Route",
	"./RouteDrag",
	"./District",
	"./Road",
	"./openlayers/layer/China317Vehicle"
], function (declare, array, lang, on, has, domConstruct, domStyle, domGeom, aspect, request, popup, 
		ContentPane, ArrayList, MapTool, MapFloatingPane, MapInfoPopup, MapContextMenu, MapSwitcher, 
		MapSlider, MapPaneDock, mapFactory, Busline, Poi, PoiCluster, Route, RouteDrag, District, 
		Road, China317Vehicle) {

	return declare([ContentPane], {

    	style: "width:100%; height:100%; padding:0px; margin:0px; overflow:hidden;",
    	
        /**
        * openlayers地图实例
        */
        map: null,

        /**
         * 地图资源类型
         */
        type: null,
        
        mapTool: null,
        
        /**
         * 地图右键菜单
         */
        mapContextMenu: null,
        
        /**
         * 地图切换控制器
         */
        mapSwitcher: null,
        
        /**
         * 地图zoom控制器
         */
        mapSlider: null,
        
        /**
         * MapPaneDock
         */
        dock: null,
        isDock: true,
        
        /**
         * 保存每次右键点击地图的坐标（相对地图的屏幕坐标，不是经纬度）
         */
        rightClickPixel: null,
        
        /**
         * 是否实时更新车辆图层，默认不更新
         */
        isUpdateVehicleLayer: false,
        
        /**
         * 定时更新任务
         */
        _task: null,
        
        /**
         * 更新周期
         */
        _interval: 5000,
        
        _popupList: null,
        
        /**
         * 是否只显示一个MapPopupInfo
         */
        singlePopup: true,
        
        busline: null,
        
        district: null,
        
        poi: null,
        
        poiCluster: null,
        
        road: null,
        
        route: null,
        
        routeDrag: null,
        
        startup: function () {
            this.inherited(arguments);
            
            this._initMap();
            this._initMapContextMenu();
            this._initMapSwitcher();
            this._initMapSlider();
            this._initPopupList();
            if(this.isDock){
            	this._initDock();
            }
            
            this.mapTool = new MapTool({
            	china317Map: this
            });
            this.busline = new Busline({
            	china317Map: this
            });
            this.poi = new Poi({
            	china317Map: this
            });
            this.poiCluster = new PoiCluster({
            	china317Map: this
            });
            this.route = new Route({
            	china317Map: this
            });
            this.routeDrag = new RouteDrag({
            	china317Map: this
            });
            this.district = new District({
            	china317Map: this
            });
            this.road = new Road({
            	china317Map: this
            });
            this.route.add2MapContextMenu();
            console.debug("[" + this.title + "] startup");
        },
		
        resize: function(){
        	this.inherited(arguments);
        	// 面板变换尺寸后更新地图尺寸
        	this.map.updateSize();
        },
        
        _initMap: function(){
        	// 创建地图对象
        	var mapNode = domConstruct.create("div", { 
        		style: { 
        			position: "absolute",
            		zIndex: 1,
                	width: "100%",
                	height: "100%",
                	left: "0px",
                	top: "0px" 
        		} 
        	}, this.domNode);
			this.map = mapFactory.getMap(mapNode, this.type);
			
			// 创建更新车辆图层定时任务
			if(this.isUpdateVehicleLayer){
				this._initVehicleLayer();
				this._task = setInterval(lang.hitch(this, function() {
					if(this.map && this.map.layers){
						var layers = this.map.layers;
						for (var i = 0; i < layers.length; i++) {
							if (layers[i].visibility
									&& layers[i].CLASS_NAME == "OpenLayers.Layer.China317Vehicle") {
								this.map.removeLayer(layers[i]);
								this._initVehicleLayer();
								break;
							}
						}
					}
				}), this._interval);
			}
        },
        
        _initPopupList: function(){
        	// 移动地图完，移动气泡提示
			this._popupList = new ArrayList();
			this.map.events.register("moveend", this, lang.hitch(this, function(){
				this._popupList.forEach(function(item){
					item.updatePosition();
				});
			}));
        },
        
        _initVehicleLayer: function(){
        	var china317Vehicle = new China317Vehicle("China317车辆图", "vehicle/getImages.do?", {
				isBaseLayer: false,
				visibility: true
			});
			// 立即销毁图层，释放资源
			china317Vehicle.events.register("removed", this, function(e){
				e.layer.destroy();
			});
			this.map.addLayer(china317Vehicle);
        },
        
        _initMapContextMenu: function(){
			this.mapContextMenu = new MapContextMenu({
			    map: this.map,
			    style: "width:80px;"
			});
        	// 绑定到地图div上
            this.mapContextMenu.bindDomNode(this.map.div);
            this.mapContextMenu.startup();
            
            this.map.events.register("movestart", this, lang.hitch(this, function (e) {
            	popup.close(this.mapContextMenu);
            }));
            this.map.events.register("click", this, lang.hitch(this, function (e) {
            	popup.close(this.mapContextMenu);
            }));
			this.map.events.register("mouseup", this, lang.hitch(this, function (e) {
				// 每次右键点击地图，坐标都将保存
            	if(e.button == 2){
            		this.rightClickPixel = e.xy;
				}
            }));
        },
        
        _initMapSwitcher: function(){
        	if(this.type == "MapABC" || this.type == "Google" || this.type == "QQ"){
        		this.mapSwitcher = new MapSwitcher({
    			    map: this.map
    			});
            	this.addChild(this.mapSwitcher);
        	}
        },
        
        _initMapSlider: function(){
        	this.mapSlider = new MapSlider({
			    map: this.map
			});
        },
        
        _initDock: function () {
            var dockId = "dock_" + this.id;
            this.dock = new MapPaneDock({
                id: dockId
            });
            this.addChild(this.dock);
        },
        
        createFloatingPane: function(params){
        	var title = params.title;
        	var width = params.width;
        	var height = params.height;
        	var position = params.position;
        	var titleIcon = params.titleIcon;
        	var dockable = true;
        	if (params.dockable === false) {
        		dockable = false;
			}
        	var closable = true;
			if (params.closable === false) {
				closable = false;
			}
        	
        	var paneDom = domConstruct.create("div");
			this.domNode.appendChild(paneDom);
			var pane = new MapFloatingPane({
				title: title,
				dockable: dockable,
				closable: closable,
				dockTo: this.dock,
				titleIcon: titleIcon,
				style: 'width:' + width + 'px; height:' + height + 'px; position:absolute; top:30px; left:120px; z-index:15'
			}, paneDom);
			pane.startup();
			pane.bringToTop();
			return pane;
        },
        
        addMapInfoPopup: function(marker){
        	var mapPane = this;
        	domStyle.set(marker.icon.imageDiv, {
        		cursor: "pointer"
        	});
        	marker.events.register("click", marker, function(){
		    	var resource = this.resource;
		    	// 全部隐藏，只显示一个popup
		    	if(mapPane.singlePopup){
		    		mapPane._popupList.forEach(function(item){
						item.hide();
					});
		    	}
		    	
				if(this.mapInfoPopup){
					this.mapInfoPopup.show();
					return ;
				}
				this.mapInfoPopup = new MapInfoPopup({
	                map: mapPane.map,
	                lonlat: marker.lonlat
	            });
				mapPane.domNode.appendChild(this.mapInfoPopup.domNode);
				mapPane._popupList.add(this.mapInfoPopup);
				this.mapInfoPopup.startup();
				this.mapInfoPopup.show();
				
				this.mapInfoPopup.on("close", lang.hitch(this, function(){
					mapPane._popupList.remove(this.mapInfoPopup);
					this.mapInfoPopup.destroy();
        			this.mapInfoPopup = null;
				}));
		    });
        	aspect.before(marker, "erase", function(){
        		if(this.mapInfoPopup){
        			mapPane._popupList.remove(this.mapInfoPopup);
        			this.mapInfoPopup.destroy();
        			this.mapInfoPopup = null;
        		}
        	});
        	aspect.after(marker, "moveTo", function(){
        		if(this.mapInfoPopup){
        			this.mapInfoPopup.updatePosition(marker.lonlat);
        		}
        	});
        },
        
        destroy: function () {
        	if(this._task){
        		clearInterval(this._task);
        		this._task = null;
        	}
            if (this.mapContextMenu) {
                this.mapContextMenu.destroy();
                this.mapContextMenu = null;
            }
            if (this.mapSwitcher) {
                this.mapSwitcher.destroy();
                this.mapSwitcher = null;
            }
            if (this.mapSlider) {
                this.mapSlider.destroy();
                this.mapSlider = null;
            }
            if (this.map) {
                this.map.destroy();
                this.map = null;
            }
            this.inherited(arguments);
            
            console.debug("[" + this.title + "] destroyed");
        }

    });
	
});