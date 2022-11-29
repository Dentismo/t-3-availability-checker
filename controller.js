var express = require('express');
var router = express.Router({ mergeParams: true });
var BookingRequest = require('./models/bookingRequest.js');
const MqttHandler = require('./controller/mqtt-handler.js');
const Clinic = require('./models/clinic.js');

async function checkAvailability(bookingRequest) {
    const day_of_incoming_request = new Date(bookingRequest.date).getDay();
    
    if (day_of_incoming_request === 0 || day_of_incoming_request === 6)
        return false;

    const booking_result = await checkTimeSlot(bookingRequest, day_of_incoming_request);

    return {message: booking_result}
}

async function checkTimeSlot(bookingRequest, day_of_incoming_request) {
    const num_of_booking_requests = await BookingRequest.count({ clinicId: bookingRequest.clinicId });
    const list = await BookingRequest.find({ clinicId: bookingRequest.clinicId })

    for (let i = 0; i < num_of_booking_requests; i++) {
        const current_day_of_booking_request = new Date(list[i].date).getDay();
        if ((current_day_of_booking_request === day_of_incoming_request) && (list[i].start === bookingRequest.start) && (bookingRequest.state !== 'denied'))
            return false;
    }
    //return true;
    return {accepted: true, bookingRequest}
}


module.exports = checkAvailability;