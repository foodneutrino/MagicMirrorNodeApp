const config = require("./config");
const io = require('socket.io')(4500);
const YQL = require('yqlp');

class TempInfoTimer {
  constructor() {
    // Get weather from yahoo
    this.places = config.weather
    this.yqlCities = "text=\""+this.places.join("\" OR text=\"")+"\"";
    this.yqlString = 'select * from weather.forecast where woeid in (select woeid from geo.places where '+this.yqlCities+')';

    setTimeout(this.updateTemps.bind(this), 60000)
  }

  updateTemps() {
    console.log("Called timer")
    this.getWeather().then(function(response) {
      io.emit('times_up',{temps: this.processWeather(response)});
      setTimeout(this.updateTemps.bind(this), 60000)
    })
  }

  getWeather() {
    return YQL.execp(this.yqlString)
  }

  processWeather(yqlWeather) {
    var rows = []
    console.log("Response from yahoo weather")
    for(var i=0; yqlWeather && i<yqlWeather.query.count; i++) {
        var channel   = yqlWeather.query.results.channel[i];
        var code = channel.item.condition.code;
        channel.item.condition.character = (config.weatherCondition[code] || ")").toUpperCase();
        console.log("Data: [" + channel + "]")
        rows.push(channel);
    };

    return rows
  }
}

module.exports = TempInfoTimer
