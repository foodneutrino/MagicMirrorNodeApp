var YQL = require('yql');
var express = require('express');
var fs      = require('fs');
var router  = express.Router();
var config = require("../config");
var magicMirror = require('../magicMirror');
var moment = require("moment");
const Temps = require('../temperature_timer')
// Prep YQL Query for Weather
var yqlCities = "text=\""+config.weather.join("\" OR text=\"")+"\"";
var yqlString = 'select * from weather.forecast where woeid in (select woeid from geo.places where '+yqlCities+')';
var query = new YQL(yqlString);
/**
 * Variables later used in our markup
 */
var rowContent = [];

/**
 * Actual Magic Mirror homepage
 */
router.get('/', function(req, res, next) {
  var temps = new Temps()
  console.log("Created temperature class")
  temps.getWeather().then(function (response) {
    var waitForWeather = temps.processWeather(response)
    console.log("Parsed Weather: [" + waitForWeather + "]")
    for (var index in waitForWeather ) {
      var cityWeather = waitForWeather[index]
      console.log("Received Weather data of index [" +
        index + "] : [" +
        cityWeather + "]")
      rowContent.push({left: cityWeather})
    }
    next();
  });
}, function(req, res, next) {

    if(rowContent.length) {
        // Put current time in first row
        rowContent[0].right = "<h1>"+moment().format('MMMM Do YYYY, h:mm a')+"</h1>";
    }


    // Render our index.html
    res.render('index',{
        title:"Mirror Mirror Home",
        rows: rowContent
    });
    next();
}, function(){
    // clean up
    rowContent = [];
});

router.get('/test', function(req, res, next) {
    //var timeTag = moment().format('MMMM Do YYYY, h:mm a')
    var temps = new Temps()
    console.log("Created temperature class")
    temps.getWeather().then(function (response) {
      var waitForWeather = temps.processWeather(response)
      console.log("Parsed Weather: [" + waitForWeather + "]")
      for (var index in waitForWeather ) {
        var cityWeather = waitForWeather[index]
        console.log("Received Weather data of index [" +
          index + "] : [" +
          cityWeather + "]")
        rowContent.push({left: cityWeather})
      }

      // Render our index.html
      res.render('test',{
          title:"Test Page",
          rows: rowContent
      });
      next();
    })
}, function(){
    // clean up
    rowContent = [];
});

module.exports = router;
