
var io = require('socket.io')(4500);
const moment = require("moment");

class Timer {
  constructor() {
    console.log("Created Timer")
    setTimeout(this.notify.bind(this), 30000)
  }

  notify() {
    console.log("Called timer")
    io.emit('times_up',{time:moment().format('h:mm a')});
    setTimeout(this.notify.bind(this), 30000)
  }
}

module.exports = Timer
