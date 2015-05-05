(function() {

  var current_weather_module = require('./CurrentWeatherData');
  var forecast_weather_module = require('./WeeklyForecastWeatherData');

  contexts = {
    entryPoint : "/contexts/entryPoint.jsonld",
    weather : {
      byCoordinates : "/contexts/get_current_weather_by_coordinates.jsonld"
    },
    forecast : {
      byCoordinates : "/contexts/get_forecast_weather_by_coordinates.jsonld"
    }
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
      };
      callback(response);
    }
  };

  Handler.prototype.CurrentWeather = {
    getByCoordinates : function(latitude, longitude, callback){
      c_weather.getCurrentWeatherConditions_byLatitudeLongitude(latitude, longitude, function(data){
        var context_folder = rootPath + contexts.weather.byCoordinates;
        var response = {
          "@context" : context_folder,
          "@id" : "/weather?lat=" + data.latitude + "&lon=" + data.longitude,
          "@type" : "CurrentWeather",
          "timestamp": data.time,
          "latitude" : data.latitude,
          "longitude" : data.longitude,
          "temperature": {
            "@type" : "Temperature",
            "value" : data.temperature,
            "unit" : data.temperatureUnit
          },
          "humidity": {
            "@type" : "Humidity",
            "value" : data.humidity
          },
          "lightIntensity": {
            "@type" : "Light",
            "value" : data.lightIntensity
          },
          "windSpeed": {
            "@type" : "Wind_speed",
            "value" : data.windSpeed
          }
        };
        callback(response);
      });
    }
  };

  Handler.prototype.ForecastWeather = {
    getByCoordinates : function(latitude, longitude, callback){
      f_weather.getForcastWeatherConditions_byLatitudeLongitude(latitude, longitude, function(data){
        var context_folder = rootPath + contexts.forecast.byCoordinates;
        var response = {
          "@context" : context_folder,
          "@id" : "/forecast?lat=" + latitude + "&lon=" + longitude,
          "@type" : "WeeklyForecastWeather",
          "members" : []
        };
        for(var i=0; i<data.length; i++){
          var one_day =  {
            "@type" : "ForecastWeather",
            "day" : data[i].time,
            "minTemperature": {
              "@type" : "Temperature",
              "value" : data[i].temperatureMin,
              "unit" : data[i].temperatureUnit
            },
            "maxTemperature": {
              "@type" : "Temperature",
              "value" :  data[i].temperatureMax,
              "unit" : data[i].temperatureUnit
            },
            "rain" : {
              "@type" : "Rain",
              "value" : data[i].precipProbability
            },
            "humidity": {
              "@type" : "Humidity",
              "value" : data[i].humidity
            },
            "lightIntensity": {
              "@type" : "Light",
              "value" : data[i].lightIntensity
            },
            "windSpeed": {
              "@type" : "Wind_speed",
              "value" : data[i].windSpeed
            }
          }
          response.members.push(one_day);
        }
        callback(response);
      });
    }
  };


  exports.Handler = Handler;

})();