(function() {

  var Forecast = require('../node_modules/forecast.io');
  var weather_module = require('./Weather_classes');


  function WeeklyForecastWeatherData(){

    var isSimulated = true;
    var forecast;

    if(process.env.FORECAST_KEY !== "" || process.env.FORECAST_KEY !== 'undefined'){
      var options = { APIKey: process.env.FORECAST_KEY };
      forecast = new Forecast(options);
      isSimulated = false;
    }

    var dailyForecastWeather = []; // contains an array of ForecastWeather for each day of the next week


    /*
    {
      "time": 1430690400,
      "summary": "Partly cloudy in the morning.",
      "icon": "partly-cloudy-night",
      "sunriseTime": 1430712170,
      "sunsetTime": 1430761960,
      "moonPhase": 0.51,
      "precipIntensity": 0,
      "precipIntensityMax": 0,
      "precipProbability": 0,
      "temperatureMin": 57.47,
      "temperatureMinTime": 1430704800,
      "temperatureMax": 79.97,
      "temperatureMaxTime": 1430748000,
      "apparentTemperatureMin": 57.47,
      "apparentTemperatureMinTime": 1430704800,
      "apparentTemperatureMax": 79.97,
      "apparentTemperatureMaxTime": 1430748000,
      "dewPoint": 51.2,
      "humidity": 0.52,
      "windSpeed": 3.92,
      "windBearing": 177,
      "cloudCover": 0.1,
      "pressure": 1015.77,
      "ozone": 321.78
      }
    */
    this.getForcastWeatherConditions_byLatitudeLongitude = function(latitude, longitude, callback){
     //todo 
     callback({success:true});
    }

    this.getForcastWeatherConditions_byCityName = function(city, callback){
      //todo - not now
      return -1;
    }
  }


  exports.WeeklyForecastWeatherData = WeeklyForecastWeatherData;

})();