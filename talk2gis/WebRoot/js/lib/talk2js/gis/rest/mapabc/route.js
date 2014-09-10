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
		
		queryRoute: function(startLonlat, endLonlat, avoidRegion){
			var def = new Deferred();
			var rid = 6;
			var url = "http://apis.mapabc.com/route/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "8000",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	per: "50", // 抽稀参数，默认50
            	key: this.key,
				avoidRegion : avoidRegion ? avoidRegion : "", //多边形坐标
            	//avoidName: "", //避让名称 ，如一条道路的名称
            	xys: startLonlat.lon + "," + startLonlat.lat + ";" + endLonlat.lon + "," + endLonlat.lat // 坐标对集合，支持13个途经点
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);
			}));
			return def.promise;
		},
		
		queryMultiPointsRoute: function(points, avoidRegion){
			var def = new Deferred();
			var rid = 6;
			var url = "http://apis.mapabc.com/route/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "8000",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	per: "50", // 抽稀参数，默认50
            	key: this.key,
				avoidRegion : avoidRegion ? avoidRegion : "", //多边形坐标
            	//avoidName: "", //避让名称 ，如一条道路的名称
            	xys: points // 坐标对集合，支持13个途经点
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
