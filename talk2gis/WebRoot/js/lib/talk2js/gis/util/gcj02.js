define([ 
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/on"
], function(declare, lang, on) {

	var wgs2gcj02 = declare([], {
		
		pi: 3.14159265358979324,
		
		a: 6378245.0,

		ee: 0.00669342162296594323,
	
		outofChina: function(lat, lon){
			if (lon < 72.004 || lon > 137.8347)
				return true;
			if (lat < 0.8293 || lat > 55.8271)
				return true;
			return false;
		},
		
		transformLat: function(x, y){
			var pi = this.pi;
			var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
					+ 0.2 * Math.sqrt(Math.abs(x));
			ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
			ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
			ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
			return ret;
		},
		
		transformLon: function(x, y){
			var pi = this.pi;
			var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
					* Math.sqrt(Math.abs(x));
			ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
			ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
			ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0	* pi)) * 2.0 / 3.0;
			return ret;
		},
		
		// World Geodetic System ==> Mars Geodetic System
		transform: function(lon, lat){
			var pi = this.pi;
			var a = this.a;
			var ee = this.ee;
			if (this.outofChina(lat, lon)) {
				return {
					lon: lon,
					lat: lat
				};
			}
			var dLat = this.transformLat(lon - 105.0, lat - 35.0);
			var dLon = this.transformLon(lon - 105.0, lat - 35.0);
			var radLat = lat / 180.0 * pi;
			var magic = Math.sin(radLat);
			magic = 1 - ee * magic * magic;
			var sqrtMagic = Math.sqrt(magic);
			dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
			dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
			var mgLat = lat + dLat;
			var mgLon = lon + dLon;
			return {
				lon: mgLon,
				lat: mgLat
			};
		},

		gcj2wgs: function(lon, lat) {
			var lontitude = lon - (this.transform(lon, lat).lon - lon);
			var latitude = lat - (this.transform(lon, lat).lat - lat);
			return {
				lon: lontitude,
				lat: latitude
			};
		}
	});

	return new wgs2gcj02();
});
