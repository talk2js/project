define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/on",
	"dojo/Deferred",
	"dojo/io-query"
], function(declare, lang, on, Deferred, ioQuery) {

	var obj = declare([], {

		key: "b0a7db0b3a30f944a21c3682064dc70ef5b738b062f6479a5eca39725798b1ee300bd8d5de3a4ae3",
		
		constructor: function(args) {
			declare.safeMixin(this, args || {});
			
			if(!window.MMap){
				window.MMap = {};
				window.MMap.MAjaxResult = new Array(100);
			}
		},
		
		/**
		 * 关键字查询
		 */
		queryPoiByKeyword: function(city, type, keyword){
			var def = new Deferred();
			var rid = 2;
			var url = "http://apis.mapabc.com/gss/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "1000",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "1000",
            	batch: "1",
            	sort: "0",
            	srctype: "POI",
            	key: this.key,
            	city: city,
            	type: type,
            	keyword: keyword
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);
			}));
			return def.promise;
		},
		
		/**
		 * 根据中心点坐标查询周边兴趣点
		 */
		queryPoiByCenterPoint: function(centerX, centerY, keyword, range, type){
			var def = new Deferred();
			var rid = 3;
			var url = "http://apis.mapabc.com/gss/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "1002",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "1000",
            	batch: "1",
            	srctype: "POI",
            	key: this.key,
            	type: type,
            	cenX: centerX,
            	cenY: centerY,
            	keyword: keyword,
            	range: range
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);
			}));
			return def.promise;
		},
		
		/**
		 * 根据中心点关键字查询周边兴趣点
		 */
		queryPoiByCenterKeyword: function(city, centerKeyword, keyword, range, type){
			var def = new Deferred();
			var rid = 4;
			var url = "http://apis.mapabc.com/gss/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "1001",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "1000",
            	batch: "1",
            	srctype: "POI",
            	key: this.key,
            	//type: type,
            	city: city,
            	cen: centerKeyword,
            	keyword: keyword,
            	range: range
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);
			}));
			return def.promise;
		},
		
		/**
		 * 根据多边形范围查询兴趣点
		 */
		queryPoiByPolygon: function(polygon, keyword, type){
			var def = new Deferred();
			var rid = 3;
			var url = "http://apis.mapabc.com/gss/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "1002",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "1000",
            	batch: "1",
            	srctype: "POI",
            	key: this.key,
            	//type: type,
            	regionType: "polygon",
            	region: "",
            	keyword: keyword
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);
			}));
			return def.promise;
		},
		
		/**
		 * 根据框选范围查询兴趣点
		 */
		queryPoiByRectangle: function(rectangle, keyword, type){
			var def = new Deferred();
			var rid = 5;
			var url = "http://apis.mapabc.com/gss/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "1005",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "1000",
            	batch: "1",
            	srctype: "POI",
            	key: this.key,
            	//type: type,
            	regionType: "rectangle",
            	region: rectangle.minx + "," + rectangle.miny + ";" + rectangle.maxx + "," + rectangle.maxy,
            	keyword: keyword
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);
			}));
			return def.promise;
		},
		
		queryDistrict: function(city, districtName){
			var def = new Deferred();
			var rid = 0;
			var url = "http://apis.mapabc.com/gss/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "1003",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "10",
            	batch: "1",
            	key: this.key,
            	city: city,
            	districtName: districtName
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);

			}));
			return def.promise;
		}
		
	});
	
	return new obj();

});
