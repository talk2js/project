define([ 
	"dojo/_base/declare", 
	"dojo/on"
], function(declare, on) {

	var busline = declare([], {

		key: "c84af8341b1cc45c801d6765cda96087",
		
		constructor: function(args) {
			declare.safeMixin(this, args || {});
		},
		
		query: function(city, linename){
			$.ajax({
                type: "get",
                url: "http://restapi.amap.com/v3/bus/linename?",
                data: {
                	s: "rsv3",
                	mz: "base",
                	eA: "json",
                	pageIndex: "1",
                	extensions: "all",
                	offset: "1",
                	key: this.key,
                	city: city,
                	keywords: linename
                },
                dataType: "jsonp",
                success: function (data) {
                    console.debug(data.buslines);
                }
            });
		}

	});
	
	return new busline();

});
