(function() {

  var current_weather_module = require('./CurrentWeatherData');
  var forecast_weather_module = require('./WeeklyForecastWeatherData');

  contexts = {
    entryPoint : "/contexts/entryPoint.jsonld"
  }
  
  function Handler(path){
    rootPath = path;
    c_weather = new current_weather_module.CurrentWeatherData();
    f_weather = new forecast_weather_module.WeeklyForecastWeatherData();
  };

  Handler.prototype.EntryPoint = {
    getEntryPoint : function(callback){
      var context_folder = rootPath + contexts.entryPoint;
      var response = {
        "@context" : context_folder,
        "@type" : "EntryPoint",
        "@id" : "/",
        "weather" : {
          "@type" : "IriTemplate",
          "template" : "/weather{?lat&lon}",
          "mappings" : [
            {
              "@type": "IriTemplateMapping",
              "variable" : "lat",
              "property" : "schema:latitude"
            },
            {
              "@type": "IriTemplateMapping",
              "variable" : "lon",
              "property" : "schema:longitude"
            }
          ]
        },
        "forecast" : {
          "@type" : "IriTemplate",
          "template" : "/forecast{?lat&lon}",
          "mappings" : [
            {
              "@type": "IriTemplateMapping",
              "variable" : "lat",
              "property" : "schema:latitude"
            },
            {
              "@type": "IriTemplateMapping",
              "variable" : "lon",
              "property" : "schema:longitude"
            }
          ]
        }
      }
      callback(response);
    }
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