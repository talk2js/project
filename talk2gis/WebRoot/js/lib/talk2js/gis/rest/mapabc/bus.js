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
		
		queryBusByName: function(city, busName){
			var def = new Deferred();
			var rid = 1;
			var url = "http://apis.mapabc.com/bus/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "8004",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "10",
            	batch: "1",
            	key: this.key,
            	city: city,
            	busName: busName
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);
			}));
			return def.promise;
		},
		
		queryBusById: function(city, ids){
			var def = new Deferred();
			var rid = 11;
			var url = "http://apis.mapabc.com/bus/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "8085",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "100",
            	batch: "1",
            	key: this.key,
            	city: city,
            	ids: ids
            });
			$.getScript(url + queryStr).then(lang.hitch(this, function(data){
				//console.debug(MMap.MAjaxResult[rid]);
				var results = MMap.MAjaxResult[rid].list;
				def.resolve(results);
			}));
			return def.promise;
		},
		
		queryBusByStationName: function(city, stationName){
			var def = new Deferred();
			var rid = 12;
			var url = "http://apis.mapabc.com/bus/simple?";
			var queryStr = ioQuery.objectToQuery({
            	sid: "8086",
            	rid: rid,
            	encode: "utf-8",
            	resType: "json",
            	number: "100",
            	batch: "1",
            	key: this.key,
            	city: city,
            	stationName: stationName
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
