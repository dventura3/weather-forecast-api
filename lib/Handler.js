(function() {

  var current_weather_module = require('./CurrentWeatherData');
  var forecast_weather_module = require('./WeeklyForecastWeatherData');
  
  function Handler(){
    c_weather = new current_weather_module.CurrentWeatherData();
    f_weather = new forecast_weather_module.WeeklyForecastWeatherData();
  };

  Handler.prototype.CurrentWeather = {
    getByCoordinates : function(latitude, longitude, callback){
      c_weather.getCurrentWeatherConditions_byLatitudeLongitude(latitude, longitude, callback);
    }
  };

  Handler.prototype.ForecastWeather = {
    getByCoordinates : function(latitude, longitude, callback){
      f_weather.getForcastWeatherConditions_byLatitudeLongitude(latitude, longitude, callback);
    }
  };


  exports.Handler = Handler;

})();