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
		
		queryRoadByName: function(city, roadName){
			var def = new Deferred();
			var rid = 16;
			var url = "http://apis.mapabc.com/gss/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "1008",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "100",
            	batch: "1",
            	key: this.key,
            	city: city,
            	roadName: roadName
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);
			}));
			return def.promise;
		},
		
		queryCrossByTwoRoads: function(city, roadName1, roadName2){
			var def = new Deferred();
			var rid = 17;
			var url = "http://apis.mapabc.com/gss/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "1009",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "100",
            	batch: "1",
            	key: this.key,
            	city: city,
            	roadName1: roadName1,
            	roadName2: roadName2
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);
			}));
			return def.promise;
		},
		
		queryCrossesByRoad: function(city, roadName){
			var def = new Deferred();
			var rid = 18;
			var url = "http://apis.mapabc.com/gss/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "1010",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "100",
            	batch: "1",
            	key: this.key,
            	city: city,
            	roadName: roadName
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
