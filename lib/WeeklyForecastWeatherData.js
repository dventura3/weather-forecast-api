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
      if(isSimulated){
        //generate a list of forecast weather days (1 week)
        currentDay = new Date();
        for(var i=0; i<7; i++){
          var newDay = generateDateNextDay(currentDay);
          var tmp_forcastWeather = new weather_module.ForecastWeather(latitude, longitude, newDay, 'Celsius');
          tmp_forcastWeather.read();
          dailyForecastWeather.push(tmp_forcastWeather.get());
          currentDay = newDay;
        }
        callback(dailyForecastWeather);
      }
      else{
        //invoke the real weather API
        forecast.get(latitude, longitude, function (err, res, data) {
          if (err) throw err;
          console.log("Forecast Weather Received!");
          
          daily_forcast = data.daily.data;
          //i=0 no, because the first element of "daily_forcast" is the current day and I would start from "tomorrow"...
          for(var i=1; i<daily_forcast.length; i++){
            var tmp_forcastWeather = new weather_module.ForecastWeather(latitude, longitude, new Date(daily_forcast[i].time*1000), 'Celsius');
            tmp_forcastWeather.setSunriseTime(daily_forcast[i].sunriseTime);
            tmp_forcastWeather.setSunsetTime(daily_forcast[i].sunsetTime);
            tmp_forcastWeather.setPrecipProbability(daily_forcast[i].precipProbability);
            tmp_forcastWeather.setTemperatureMin(daily_forcast[i].temperatureMin);
            tmp_forcastWeather.setTemperatureMax(daily_forcast[i].temperatureMax);
            tmp_forcastWeather.setHumidity(daily_forcast[i].humidity);
            tmp_forcastWeather.setWindSpeed(daily_forcast[i].windSpeed);
            tmp_forcastWeather.setLightIntensitiy(convertIntoNumercialLightIntensity(daily_forcast[i].icon));
            dailyForecastWeather.push(tmp_forcastWeather.get());
          }
          callback(dailyForecastWeather);
        });
      }
    }

    this.getForcastWeatherConditions_byCityName = function(city, callback){
      //todo - not now
      return -1;
    }

  }//end class WeeklyForecastWeatherData


  var generateDateNextDay = function(currentDate){
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();
    var currentDay = currentDate.getDate();

    if(currentDay==31 & currentMonth==11){
      var newDay = 1;
      var newMonth = 0; //gen
      var newYear = currentYear + 1;
    }
    else if(daysInMonth((currentMonth+1),currentYear) == currentDay){
      //es: currentMonth = 28 & currentDay = 28 => go to the next month!
      var newDay = 1;
      var newMonth = currentMonth + 1;
      var newYear = currentYear; //non è detto... se sono l'ultimo dell'anno non vale
    }
    else{
      var newDay = currentDay + 1;
      var newMonth = currentMonth;
      var newYear = currentYear;
    }

    return new Date(newYear, newMonth, newDay);
  }


  //Get Number of Days in one Month
  function daysInMonth(month,year) {
      return new Date(year, month, 0).getDate();
  }

  //See CurrentWeatherData.js for more details
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


  exports.WeeklyForecastWeatherData = WeeklyForecastWeatherData;

})();