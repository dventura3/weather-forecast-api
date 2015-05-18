# Weather API

This repository contains the implementation of an [JSON-LD](http://json-ld.org) API to get the current and forecast weather conditions following the RESTful principles. The server, that exposes the API and is implemented in [Node.js](https://nodejs.org), is also able to provide [RESTdesc](http://restdesc.org) descriptions useful to represent the functionalities of the available services.


## Settings

The Weather API can work in two ways:
- as wrapper for the real [forecast.io](http://forecast.io/) API;
- as simulated forecast weather API.

In particular, the server, during the configuration phase, checks if there is the `FORECAST_KEY` environment variable containing a valid API Key. If there is, the server uses the real forecast.io API, while in the opposite case, the server generates random numbers to simulate a weather API.


## Usage

After having cloned the repository, you have to install the Node.js modules with `npm install`.
Now you can run the server through `node index.js`. The default host is `127.0.0.1` and the default port is `3302`. You can change this configuration, setting the two environmental variables `HOST` and `PORT`.

The following table summarises the RESTful services which are currently implemented. Each of them returns a JSON-LD response whose context is stored in `/public/contexts/` directory.

| URL | Method Type | Service Description |
|-----|-------------|---------------------|
|/weather/current| GET | Get the current weather conditions|
|/weather/forecast/days/:days| GET | Get the forecast weather for the required numbers of days|
|/weather/forecast/hours/:hours| GET | Get the forecast weather for the required numbers of hours|


## HTTP OPTIONS to get RESTdesc descriptions

In order to describe the functionalities of the available services and let machines know what a service does (and enable machines to generate plans to combine services by different sources), each service has its correspondent RESTdesc description.

The RESTdesc descriptions are stored in `/public/RESTdesc_descriptions/descriptions` directory.

To get a RESTdesc description for a service, you have to invoke the correspondent HTTP OPTIONS.
For example, if you want the RESTdesc description of the `/weather/current` URL, you have to do this:

`curl -i -X OPTIONS http://127.0.0.1:3301/weather/current`

The response will be like this:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,PUT,POST,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Content-Length, X-Requested-With
Content-Type: text/n3; charset=utf-8
Content-Length: 644
ETag: W/"284-67c7672c"
Date: Wed, 13 May 2015 14:46:33 GMT
Connection: keep-alive

@prefix vocab: <http://www.example.org/weatherapi/vocab#>.
@prefix owl-time: <http://www.w3.org/TR/owl-time>.
@prefix dbpedia: <http://dbpedia.org/resource/>.
@prefix hydra: <http://www.w3.org/ns/hydra/core#>.
@prefix schema: <http://www.schema.org/>.
@prefix http: <http://www.w3.org/2011/http#>.


{
  ?wth a vocab:Weather.

  ?location a schema:GeoCoordinates;
          schema:latitude ?lat;
          schema:longitude ?lon.
}
=>
{
  _:request http:methodName "GET";
      http:requestURI (?wth "?lat=" ?lat "&lon=" ?lon);
      http:resp [ http:body ?wth ].

  ?wth vocab:relatedLocation ?location;
      vocab:hasTimestamp ?timestamp.
}.
```

## Ontologies

In order to describe the semantic contents, the ontology that I have used are:
- vocab, that is a custom ontology for some lacking concepts;
- [schema.org](http://schema.org);
- [owl-time](http://www.w3.org/TR/owl-time/).
