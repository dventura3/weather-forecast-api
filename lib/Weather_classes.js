(function() {

  var chance = require('../node_modules/chance');

  /******************** CurrentWeather Class ********************/

  function CurrentWeather(latitude, longitude, unit){
    var time = new Date().getTime(); //create the current timestamp

    var chance_instance = new chance.Chance();

    var latitude = latitude;
    var longitude = longitude;

    var temperature;
    var humidity;
    var windSpeed;
    var lightIntensity;

    if(unit !== 'undefined')
      var temperatureUnit = unit;
    else
      var temperatureUnit = "Fahrenheit";


    this.setTemperature = function(temp){
      temperature = temp;
    }

    this.setHumidity = function(hum){
      humidity = hum;
    }

    this.setWindSpeed = function(wind){
      windSpeed = wind;
    }

    this.setLightIntensitiy = function(light){
      lightIntensity = light;
    }

    this.setTemperatureUnit = function(unit){
      temperatureUnit = unit;
    }


    // Function used only in case of simulation... It's only used to generate random conditions
    this.read = function(){
      this.setTemperature(chance_instance.floating({min: 25, max: 240})); //kelvin is the default unit
      this.setHumidity(chance_instance.floating({min: 0, max: 100}));
      this.setLightIntensitiy(chance_instance.floating({min: 0, max: 100}));
      this.setWindSpeed(chance_instance.floating({min: 0, max: 50}))
    }

    this.get = function(){
      convertTemperatureInBaseUnit();
      return {
        "time" : time,
        "latitude" : latitude,
        "longitude" : longitude,
        "temperature" : temperature,
        "humidity" : humidity,
        "lightIntensity" : lightIntensity,
        "windSpeed" : windSpeed
      };
    }

    var convertTemperatureInBaseUnit = function(){
      if(temperatureUnit == 'Celsius')
        temperature = FahrenheitToCelsius(temperature)
      else if(temperatureUnit == 'Kelvin')
        temperature = FahrenheitToKelvin(temperature);
    }

    //utility
    var FahrenheitToCelsius = function(value){
      return ((value - 32) * 5/9);
    }

    //utility
    var FahrenheitToKelvin = function(value){
      return ((value + 459.67) * 5/9);
    }
  }

  exports.CurrentWeather = CurrentWeather;



  /******************** ForecastWeather Class ********************/


  function ForecastWeather(day){

    var time = new Date(day).getTime(); //create the timestamp for the specific day

    var latitude;
    var longitude;

    var sunriseTime;
    var sunsetTime;

    var precipProbability;

    var temperatureMin;
    var temperatureMax;

    var humidity;

    var windSpeed;

  }

  exports.ForecastWeather = ForecastWeather;


})();