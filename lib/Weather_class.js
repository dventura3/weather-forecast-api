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
      this.setHumidity(chance_instance.floating({min: 0, max: 100}));
      this.setLightIntensitiy(chance_instance.floating({min: 0, max: 100}));
      this.setWindSpeed(chance_instance.floating({min: 0, max: 15}))
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

    // In the real API there isn't this info => I convert in numerical value the "icon" field. 
    // ICON: A machine-readable text summary of this data point, suitable for selecting an icon
    // for display. If defined, this property will have one of the following values: clear-day,
    // clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night.
    // Have a look here for details: https://developer.forecast.io/docs/v2#forecast_call
    this.convertIntoNumericalLightIntensity = function(icon){
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