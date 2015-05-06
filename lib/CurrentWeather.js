(function() {

  var Forecast = require('../node_modules/forecast.io');
  var weather_module = require('./Weather_class');
  

  function CurrentWeather(){

    var isSimulated = true;
    var forecast;

    if(process.env.FORECAST_KEY){
      var options = { APIKey: process.env.FORECAST_KEY };
      forecast = new Forecast(options);
      isSimulated = false;
    }


    this.getCurrentWeatherConditions_byLatitudeLongitude = function(latitude, longitude, callback){
      
      var current_weather_condition = new weather_module.Weather(latitude, longitude, 'Celsius', null);

      if(isSimulated){
        current_weather_condition.read();
        console.log("Current Weather Generated by Simulation!");
        callback(current_weather_condition.get());
      }
      else{
        //invoke the real weather API
        forecast.get(latitude, longitude, function (err, res, data) {
          if (err) throw err;

          console.log("Current Weather Received by API!");
          //I got "data" that is a huge JSON. I need only some fileds. Therefore I filter it
          //in order to create a new Weather() with only the field that I really use.
          current_weather_condition.setPrecipProbability(data.currently.precipProbability);
          current_weather_condition.setTemperature(data.currently.temperature);
          current_weather_condition.setHumidity(data.currently.humidity);
          current_weather_condition.setWindSpeed(data.currently.windSpeed);
          current_weather_condition.setLightIntensitiy(convertIntoNumericalLightIntensity(data.currently.icon));
          callback(current_weather_condition.get());
        });
      }
    }

    this.getCurrentWeatherConditions_byCityName = function(city, callback){
      //todo - not now
      return -1;
    }
  }


  // In the real API there isn't this info => I convert in numerical value the "icon" field. 
  // ICON: A machine-readable text summary of this data point, suitable for selecting an icon
  // for display. If defined, this property will have one of the following values: clear-day,
  // clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night.
  // Have a look here for details: https://developer.forecast.io/docs/v2#forecast_call
  var convertIntoNumericalLightIntensity = function(icon){
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

  exports.CurrentWeather = CurrentWeather;

})();