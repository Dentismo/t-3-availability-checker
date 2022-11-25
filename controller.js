var express = require('express');
var router = express.Router({ mergeParams: true });
var BookingRequest = require('./models/bookingRequest.js');
const MqttHandler = require('./controller/mqtt-handler.js');
var Clinic = require('./models/clinic.js');
const clinic = require('./models/clinic.js');

    async function checkAvailability(bookingRequest) {
        //const clinic = await Clinic.findById(bookingRequest.clinicId)
        const {clinicId, start, date, end} = bookingRequest;
        const clinic = await Clinic.findOne({clinicId: clinicId})
       //date example "2022/11/23 9:30-10:00"
        var day = new Date(date).getDay()
        console.log(day)
        console.log('==================' + bookingRequest.parse)

        try {
            if(day == 0 || day == 6 ){
                return '{message: Failure - "Day is outside of clinic opening hours, please try another date."}';
            } else {
                if(!(checkDailyHours(clinic, start, end, day))){
                    checkBookingRequests(clinic, start, date)
                } else {
                    return '{message: Failure - "Requested time-slot is outside of clinic opening hours. Please select another time."}';
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    async function checkBookingRequests(clinic, start, date) {
        const bookingRequests = await BookingRequest.find({ clinicId: clinic._id })
        for (let i = 0; i < bookingRequests.length; i++) {
            if (bookingRequests.state == "approved" || bookingRequests.state == "pending") {
                if (bookingRequests.date == date && start == bookingRequests.start) {
                    return '{message: Failure - "Time-slot is already booked. Please try a different time-slot!"}';
                }
            }
        }
        return '{message: Success - "Time-slot is available"}';
    }
    
    function checkDailyHours(clinic, start, end, day) {
        switch (day) {
            case 1:
                if ((start >= clinic.openingHours.monday.start) && (end <= clinic.openingHours.monday.finish)) {
                    return true;
                } else {
                    return false;
                }
            case 2:
                if ((start >= clinic.openingHours.tuesday.start) && (end <= clinic.openingHours.tuesday.finish)) {
                    return true;
                } else {
                    return false;
                }
            case 3:
                if ((start >= clinic.openingHours.wednesday.start) && (end <= clinic.openingHours.wednesday.finish)) {
                    return true;
                } else {
                    return false;
                }
            case 4:
                if ((start >= clinic.openingHours.thursday.start) && (end <= clinic.openingHours.thursday.finish)) {
                    return true;
                } else {
                    return false;
                }
            case 5:
                if ((start >= clinic.openingHours.friday.start) && (end <= clinic.openingHours.friday.finish)) {
                    return true;
                } else {
                    return false;
                }
        }
    }

module.exports = checkAvailability;