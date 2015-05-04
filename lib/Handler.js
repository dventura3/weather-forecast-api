(function() {

	var current_weather_module = require('./CurrentWeatherData');
	
	function Handler(){
	};

	Handler.prototype.CurrentWeather = {
		getByCoordinates : function(latitude, longitude, callback){
			c_weather = new current_weather_module.CurrentWeatherData();
			c_weather.getCurrentWeatherConditions_byLatitudeLongitude(latitude, longitude, callback);
		}
	};

	Handler.prototype.ForecastWeather = {
		getForecastWeather : function(latitude, longitude, callback){
			
		}
	};


	exports.Handler = Handler;

})();