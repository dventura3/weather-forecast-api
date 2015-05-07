(function() {

  var current_weather_module = require('./CurrentWeather');
  var forecast_weather_module = require('./DailyForecastWeather');
  var hourly_forecast_weather_module = require('./HourlyForecastWeather');

  contexts = {
    entryPoint : "/contexts/entryPoint.jsonld",
    weather : {
      byCoordinates : "/contexts/get_current_weather_by_coordinates.jsonld"
    },
    dailyForecast : {
      byCoordinates : "/contexts/get_daily_forecast_by_coordinates.jsonld"
    },
    hourlyForecast : {
      byCoordinates : "/contexts/get_hourly_forecast_by_coordinates.jsonld"
    }
  }
  
  function Handler(path){
    rootPath = path;
    c_weather = new current_weather_module.CurrentWeather();
    f_weather = new forecast_weather_module.DailyForecastWeather();
    h_weather = new hourly_forecast_weather_module.HourlyForecastWeather();
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
          "template" : "/weather/current{?lat&lon}",
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
        "dailyForecast" : {
          "@type" : "IriTemplate",
          "template" : "/weather/forecast/days/{numberDays?lat&lon}",
          "mappings" : [
            {
              "@type": "IriTemplateMapping",
              "variable" : "numberDays",
              "property" : "owl-time:days"
            },
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
        "hourlyForecast" : {
          "@type" : "IriTemplate",
          "template" : "/weather/forecast/hours/{numberHours?lat&lon}",
          "mappings" : [
            {
              "@type": "IriTemplateMapping",
              "variable" : "numberHours",
              "property" : "owl-time:hours"
            },
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
          "@id" : "/weather/current?lat=" + data.latitude + "&lon=" + data.longitude,
          "@type" : "Weather",
          "timestamp": data.time,
          "hasLocation" : {
            "@type" : "GeoCoordinates",
            "latitude" : data.latitude,
            "longitude" : data.longitude
          },
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


  Handler.prototype.DailyForecastWeather = {
    getByCoordinates : function(latitude, longitude, numberDays, callback){
      f_weather.getDailyForcastWeatherConditions_byLatitudeLongitude(latitude, longitude, numberDays, function(data){
        var context_folder = rootPath + contexts.dailyForecast.byCoordinates;
        var response = {
          "@context" : context_folder,
          "@id" : "/weather/forecast/days/" + numberDays + "?lat=" + latitude + "&lon=" + longitude,
          "@type" : "DailyForecastWeatherCollection",
          "members" : []
        };
        for(var i=0; i<data.length; i++){
          var one_day =  {
            "@id": "http://www.graph.org/forecast/day/" + (i+1) ,
            "@type" : "Prediction",
            "willHappen" : data[i].time,
            "@graph" : {
              "@type" : "Weather",
              "hasLocation" : {
                "@type" : "GeoCoordinates",
                "latitude" : data[i].latitude,
                "longitude" : data[i].longitude
              },
              "temperature" : {
                "@type": "Temperature",
                "value" : data[i].temperature,
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
          }
          response.members.push(one_day);
        }
        callback(response);
      });
    }
  };


  Handler.prototype.HourlyForecastWeather = {
    getByCoordinates : function(latitude, longitude, numberHours, callback){
      h_weather.getHourlyForcastWeatherConditions_byLatitudeLongitude(latitude, longitude, numberHours, function(data){
        var context_folder = rootPath + contexts.hourlyForecast.byCoordinates;
        var response = {
          "@context" : context_folder,
          "@id" : "/weather/forecast/hours/" + numberHours + "?lat=" + latitude + "&lon=" + longitude,
          "@type" : "HourlyForecastWeatherCollection",
          "members" : []
        };
        for(var i=0; i<data.length; i++){
          var one_hour = {
            "@id": "http://www.graph.org/forecast/hour/" + (i+1) ,
            "@type" : "Prediction",
            "willHappen" : data[i].time,
            "@graph" : {
              "@type" : "Weather",
              "hasLocation" : {
                "@type" : "GeoCoordinates",
                "latitude" : data[i].latitude,
                "longitude" : data[i].longitude
              },
              "temperature" : {
                "@type": "Temperature",
                "value" : data[i].temperature,
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
          }
          response.members.push(one_hour);
        }
        callback(response);
      });
    }
  };


  Handler.prototype.StatusCode = {
    notFound : function(callback){
      var response = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@type": "Status",
        "statusCode": 404,
        "title": "Resource Not Found",
        "description": "The server has not found anything matching the URI given."
      };
      callback(response);
    },
    notImplemented : function(callback){
      var response = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@type": "Status",
        "statusCode": 501,
        "title": "Service Not Implemented",
        "description": "The server will implement this new feature in future web-service API."
      }
      callback(response);
    },
    notImplementedMoreThanOneWeek : function(callback){
      var response = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@type": "Status",
        "statusCode": 501,
        "title": "Service Not Implemented",
        "description": "It is not possible to request a number of days more than one week."
      }
      callback(response);
    },
    notImplementedMoreThanTenHours : function(callback){
      var response = {
        "@context": "http://www.w3.org/ns/hydra/context.jsonld",
        "@type": "Status",
        "statusCode": 501,
        "title": "Service Not Implemented",
        "description": "It is not possible to request a number of hours more than ten hours."
      }
      callback(response);
    }
  };


  exports.Handler = Handler;

})();