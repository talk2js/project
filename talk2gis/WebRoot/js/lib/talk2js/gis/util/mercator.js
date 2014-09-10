define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/on"
], function(declare, lang, on) {

	var mercator = declare([], {
		
		lonLat2Mercator: function(lon, lat){
			var M_PI = 3.14159265358979324;
			var x = lon *20037508.342789/180;
		  	var y = Math.log(Math.tan((90+lat)*M_PI/360))/(M_PI/180);
			y = y * 20037508.34789/180;
			return {
				x: x,
				y: y
			};
		},
		
		 mercator2lonLat: function(mercatorX, mercatorY){
			var M_PI = 3.14159265358979324;
			var x = mercatorX/20037508.34*180;
			var y = mercatorY/20037508.34*180;
			y = 180/M_PI*(2*Math.atan(Math.exp(y*M_PI/180))-M_PI/2);
			return {
				lon: x,
				lat: y
			};
		}
		
	});

	return new mercator();
});
