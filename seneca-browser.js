var Timers = require('timers')
var Seneca = require('seneca')

global.setImmediate = Timers.setImmediate

module.exports = Seneca



