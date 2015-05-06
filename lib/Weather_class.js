(function() {

  var chance = require('../node_modules/chance');


  /******************** Weather Class ********************/

  function Weather(latitude, longitude, unit, data){

    if(data != null)
      var time = data;
    else
      var time = new Date(); //create the current data

    var chance_instance = new chance.Chance();

    var latitude = latitude;
    var longitude = longitude;

    var precipProbability;
    var temperature;
    var humidity;
    var windSpeed;
    var lightIntensity;

    if(unit !== 'undefined' || unit != null)
      var temperatureUnit = unit;
    else
      var temperatureUnit = "Fahrenheit";


    this.setPrecipProbability = function(precip){
      precipProbability = precip;
    }

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
      this.setPrecipProbability(chance_instance.floating({min: 0, max: 1}));
      this.setTemperature(chance_instance.floating({min: 25, max: 240})); //Fahrenheit is the default unit
      this.setHumidity(chance_instance.floating({min: 0, max: 1}));
      this.setLightIntensitiy(chance_instance.floating({min: 0, max: 100}));
      this.setWindSpeed(chance_instance.floating({min: 0, max: 50}))
    }

    this.get = function(){
      return {
        "time" : time.getTime(),
        "latitude" : latitude,
        "longitude" : longitude,
        "precipProbability" : precipProbability,
        "temperature" : convertTemperatureInBaseUnit(temperature, temperatureUnit),
        "temperatureUnit" : convertTemperatureInSemantic(temperatureUnit),
        "humidity" : humidity,
        "lightIntensity" : lightIntensity,
        "windSpeed" : windSpeed
      };
    }

  }

  exports.Weather = Weather;



  /******************** Utility ********************/

  var FahrenheitToCelsius = function(value){
    return ((value - 32) * 5/9);
  }

  var FahrenheitToKelvin = function(value){
    return ((value + 459.67) * 5/9);
  }

  var convertTemperatureInBaseUnit = function(value, temperatureUnit){
    if(temperatureUnit == 'Celsius')
      return FahrenheitToCelsius(value)
    else if(temperatureUnit == 'Kelvin')
      return FahrenheitToKelvin(value);
  }

  var convertTemperatureInSemantic = function(temperatureUnit){
    if(temperatureUnit == "Celsius")
      return "iot-unit:temperature.si.celsius";
    else if(temperatureUnit == "Kelvin")
      return "iot-unit:temperature.si.kelvin";
    else
      return "iot-unit:temperature.imperial.fahrenheit";
  }


})();