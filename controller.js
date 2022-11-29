var express = require('express');
var router = express.Router({ mergeParams: true });
var BookingRequest = require('./models/bookingRequest.js');
const MqttHandler = require('./controller/mqtt-handler.js');
const Clinic = require('./models/clinic.js');



module.exports = checkAvailability;