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
      this.setTemperature(chance_instance.floating({min: 25, max: 240})); //Fahrenheit is the default unit
      this.setHumidity(chance_instance.floating({min: 0, max: 1}));
      this.setLightIntensitiy(chance_instance.floating({min: 0, max: 100}));
      this.setWindSpeed(chance_instance.floating({min: 0, max: 50}))
    }

    this.get = function(){
      return {
        "time" : time,
        "latitude" : latitude,
        "longitude" : longitude,
        "temperature" : convertTemperatureInBaseUnit(temperature, temperatureUnit),
        "temperatureUnit" : convertTemperatureInSemantic(temperatureUnit),
        "humidity" : humidity,
        "lightIntensity" : lightIntensity,
        "windSpeed" : windSpeed
      };
    }

  }

  exports.CurrentWeather = CurrentWeather;



  /******************** ForecastWeather Class ********************/


  function ForecastWeather(latitude, longitude, day, unit){

    var chance_instance = new chance.Chance();

    var time = new Date(day);

    var latitude; //schema
    var longitude; //schema

    var sunriseTime;
    var sunsetTime;

    var precipProbability;

    var temperatureMin;
    var temperatureMax;

    var humidity;

    var windSpeed;

    var lightIntensity;

    if(unit !== 'undefined')
      var temperatureUnit = unit;
    else
      var temperatureUnit = "Fahrenheit";


    this.setSunriseTime = function(sunrise){
      sunriseTime = sunrise;
    }

    this.setSunsetTime = function(sunset){
      sunsetTime = sunset;
    }

    this.setPrecipProbability = function(precip){
      precipProbability = precip;
    }

    this.setTemperatureMin = function(tempMin){
      temperatureMin = tempMin;
    }

    this.setTemperatureMax = function(tempMax){
      temperatureMax = tempMax;
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
      //We suppose sunrise could be only beetween the 5.00 to 7.00
      var h_sunrise = chance_instance.integer({min: 5, max: 6});
      var m_sunrise = chance_instance.integer({min: 0, max: 60});
      sunriseTime = new Date(time.getFullYear(), time.getMonth(), time.getDate(), h_sunrise, m_sunrise).getTime();

      //We suppose sunset could be only beetween the 17.00 to 20.00
      var h_sunset = chance_instance.integer({min: 17, max: 19});
      var m_sunset = chance_instance.integer({min: 0, max: 60});
      sunsetTime = new Date(time.getFullYear(), time.getMonth(), time.getDate(), h_sunset, m_sunset).getTime();

      //Probability
      precipProbability = chance_instance.floating({min: 0, max: 1});

      temperatureMin = chance_instance.floating({min: 25, max: 50});
      temperatureMax = chance_instance.floating({min: 50, max: 90});

      humidity = chance_instance.floating({min: 0, max: 1});

      windSpeed = chance_instance.floating({min: 0, max: 50});

      lightIntensity = chance_instance.floating({min: 0, max: 100});
    }


    this.get = function(){
      return {
        "time" : time.getTime(),
        "latitude" : latitude,
        "longitude" : longitude,
        "sunriseTime" : sunriseTime,
        "sunsetTime" : sunsetTime,
        "precipProbability" : precipProbability,
        "temperatureMin" : convertTemperatureInBaseUnit(temperatureMin, temperatureUnit),
        "temperatureMax" : convertTemperatureInBaseUnit(temperatureMax, temperatureUnit),
        "temperatureUnit" : convertTemperatureInSemantic(temperatureUnit),
        "humidity" : humidity,
        "lightIntensity" : lightIntensity,
        "windSpeed" : windSpeed
      };
    }

  }

  exports.ForecastWeather = ForecastWeather;



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