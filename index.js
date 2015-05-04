var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var handler_module = require('./lib/handler');



/*--------------- Express configuration goes here: -------------------*/
var app = express();
var port = process.env.PORT || 3302;
var host = process.env.HOST || "127.0.0.1";

app.use(
  function crossOrigin(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers','Content-Type, Authorization, Content-Length, X-Requested-With');

    next(); //pass the controll to the next handler
  }
);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.listen(port, host, function() {
  //configuration

  handler = new handler_module.Handler();

  console.log("Server configured");
  console.log("Server listening to %s:%d", host, port);
});


/*--------------- HTTP Calls -------------------*/


var getDescriptions = function(req, res){
  res.sendStatus(200);
}

var getEntryPoint = function(req, res){
  res.send({success: false});
}

var getCurrentWeather = function(req, res){
  if(req.query.hasOwnProperty('city')){
    var city = req.query.city;
    console.log("I have received the city: " + city);
    //NOT IMPLEMENTED
    res.send({success: false});
  }
  else{
    var latitude = req.query.lat;
    var longitude = req.query.lon;
    console.log("lat: " + latitude + " - lon: " + longitude);
    handler.CurrentWeather.getByCoordinates(latitude, longitude, function(data){
      res.send(data);
    });
  }
}

var getForcastedWeather = function(req, res){
  if(req.query.hasOwnProperty('city')){
    var city = req.query.city;
    console.log("I have received the city: " + city);
    //NOT IMPLEMENTED
    res.send({success: false});
  }
  else{
    var latitude = req.query.lat;
    var longitude = req.query.lon;
    console.log("lat: " + latitude + " - lon: " + longitude);
    handler.ForecastWeather.getByCoordinates(latitude, longitude, function(data){
      res.send(data);
    });
  }
}


/*--------------- Routes -------------------*/


app.options(/^\/([\d\w\/]*)$/, getDescriptions);

app.get("/", getEntryPoint);

app.get("/weather", getCurrentWeather);

app.get("/forecast", getForcastedWeather);

