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

  handler = new handler_module.Handler("http://" + host + ":" + port);

  console.log("Server configured");
  console.log("Server listening to %s:%d", host, port);
});


/*--------------- HTTP Calls -------------------*/


var getDescriptions = function(req, res){
  var uriPattern = new RegExp(req.params[0].replace(/\//g, '-').replace(/\d+/g, 'id') + '.*');

  fs.readdir(__dirname + "/public/RESTdesc_descriptions/descriptions" , function (err, fileNames) { 
    if(err) throw err;

    console.log(fileNames);

    fileNames = fileNames.filter(function (file) { return file.match(uriPattern); })
                         .sort(function (a,b) { return b.length - a.length; });

    if(!fileNames.length){
      /*
      handler.StatusCode.notFound(function(jsonld_data){
        res.send(jsonld_data);
      });
      */
      res.sendStatus(200);
      return -1;
    }

    readFiles(__dirname + "/public/RESTdesc_descriptions/descriptions", fileNames, function (files) {
      console.log("Send RESTdesc descriptions");
      res.header('Content-Type', 'text/n3');
      res.send(joinN3Documents(files));
    });

  });
}

var getEntryPoint = function(req, res){
  handler.EntryPoint.getEntryPoint(function(data){
    res.send(data);
  });
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


/*--------------- Helpers Functions -------------------*/

function readFiles(directory, fileNames, callback) {
  var files = [];
  fileNames.forEach(function (fileName) {
    fs.readFile(directory + '/' + fileName, 'utf-8', function (err, data) {
      files.push(data);
      if(files.length == fileNames.length)
        callback(files);
    });
  });
}

function joinN3Documents(documents) {
  var namespaces = '', usedNamespaces = {}, triples = '',
      match, prefixMatcher = /^@prefix.*\.$\n/gm;
  documents.forEach(function (document) {
    while((match = prefixMatcher.exec(document)) && (match = match[0]))
      if(!usedNamespaces[match])
        namespaces += (usedNamespaces[match] = match);
    triples += document.replace(prefixMatcher, '');
  });
  return namespaces + triples;
}


/*--------------- Routes -------------------*/



app.options(/^\/([\d\w\/]*)$/, getDescriptions);

app.get("/", getEntryPoint);

app.get("/weather", getCurrentWeather);

app.get("/forecast", getForcastedWeather);

