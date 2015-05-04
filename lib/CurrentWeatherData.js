(function() {

  var Forecast = require('../node_modules/forecast.io');
  var weather_module = require('./Weather_classes');
  

  function CurrentWeatherData(){

    var isSimulated = true;
    var forecast;

    if(process.env.FORECAST_KEY !== "" || process.env.FORECAST_KEY !== 'undefined'){
      var options = { APIKey: process.env.FORECAST_KEY };
      forecast = new Forecast(options);
      isSimulated = false;
    }


    /*
    "currently": {
      "time": 1430731961,
      "summary": "Clear",
      "icon": "clear-day",
      "precipIntensity": 0,
      "precipProbability": 0,
      "temperature": 78.22,
      "apparentTemperature": 78.22,
      "dewPoint": 52.07,
      "humidity": 0.4,
      "windSpeed": 5.79,
      "windBearing": 142,
      "cloudCover": 0,
      "pressure": 1016.03,
      "ozone": 322.95
    }
    */
    this.getCurrentWeatherConditions_byLatitudeLongitude = function(latitude, longitude, callback){
      
      var current_weather_condition = new weather_module.CurrentWeather(latitude, longitude, 'Celsius');

      if(isSimulated){
        current_weather_condition.read();
        callback(current_weather_condition.get());
      }
      else{
        //invoke the real weather API
        forecast.get(latitude, longitude, function (err, res, data) {
          if (err) throw err;

          console.log("Current Weather Received!");
          //I got "data" that is a huge JSON. I need only some fileds. Therefore I filter it
          //in order to create a new Weather() with only the field that I really use.
          current_weather_condition.setTemperature(data.currently.temperature);
          current_weather_condition.setHumidity(data.currently.humidity);
          current_weather_condition.setWindSpeed(data.currently.windSpeed);
          current_weather_condition.setLightIntensitiy(convertIntoNumercialLightIntensity(data.currently.icon));
          callback(current_weather_condition.get());
        });
      }
    }

    this.getCurrentWeatherConditions_byCityName = function(city, callback){
      //todo - not now
      return -1;
    }

    // In the real API there isn't this info => I convert in numerical value the "icon" field. 
    // ICON: A machine-readable text summary of this data point, suitable for selecting an icon
    // for display. If defined, this property will have one of the following values: clear-day,
    // clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night.
    // Have a look here for details: https://developer.forecast.io/docs/v2#forecast_call
    var convertIntoNumercialLightIntensity = function(icon){
      if(icon == "clear-day")
        return 80;
      if(icon == "clear-night")
        return 18;
      if(icon == "rain")
        return 40;
      if(icon == "snow")
        return 10;
      if(icon == "sleet")
        return 15;
      if(icon == "wind")
        return 68;
      if(icon == "fog")
        return 15;
      if(icon == "cloudy")
        return 20;
      if(icon == "partly-cloudy-day")
        return 30;
      if(icon == "partly-cloudy-night")
        return 10;
    }

  }


  exports.CurrentWeatherData = CurrentWeatherData;

})();