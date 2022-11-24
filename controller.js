var express = require('express');
var router = express.Router({ mergeParams: true });
var BookingRequest = require('./models/bookingRequest.js');
const MqttHandler = require('./controller/mqtt-handler.js');
var Clinic = require('./models/clinic.js')

//const mqtt = new MqttHandler()

class AvailabilityController {

    constructor() {} 

    async checkAvailability(bookingRequest) {
        const clinic = await Clinic.findById(bookingRequest.clinicId)
    
       //date example "2022/11/23 9:30-10:00"
        const bookingDate = bookingRequest.date
        var date = new Date(bookingDate)
        var day = date.getDay()
    
        if(day == 0 || day == 6 ){
            return '{message: Failure - "Day is outside of clinic opening hours, please try another date."}';
        } else {
        if(checkDailyHours(clinic, bookingRequest, day)){
            checkBookingRequests(clinic, bookingRequest)
            } else {
                return '{message: Failure - "Requested time-slot is outside of clinic opening hours. Please select another time."}';
            }
        }
    }
    
    async checkBookingRequests(clinic, bookingRequest) {
        const bookingRequests = await BookingRequest.find({ clinicId: clinic._id })
        for (let i = 0; i < bookingRequests.length; i++) {
            if (bookingRequests.state == "approved" || bookingRequests.state == "pending") {
                if (bookingRequests.date == bookingRequest.date && bookingRequest.start == bookingRequests.start) {
                    return '{message: Failure - "Time-slot is already booked. Please try a different time-slot!"}';
                }
            }
        }
        return '{message: Success - "Time-slot is available"}';
    }
    
    checkDailyHours(clinic, bookingRequest, day) {
        switch (day) {
            case 1:
                if (bookingRequest.start >= clinic.openingHours.monday.start && bookingRequest.end <= clinic.openingHours.monday.finish) {
                    return true;
                } else {
                    return false;
                }
            case 2:
                if (bookingRequest.start >= clinic.openingHours.tuesday.start && bookingRequest.end <= clinic.openingHours.tuesday.finish) {
                    return true;
                } else {
                    return false;
                }
            case 3:
                if (bookingRequest.start >= clinic.openingHours.wednesday.start && bookingRequest.end <= clinic.openingHours.wednesday.finish) {
                    return true;
                } else {
                    return false;
                }
            case 4:
                if (bookingRequest.start >= clinic.openingHours.thursday.start && bookingRequest.end <= clinic.openingHours.thursday.finish) {
                    return true;
                } else {
                    return false;
                }
            case 5:
                if (bookingRequest.start >= clinic.openingHours.friday.start && bookingRequest.end <= clinic.openingHours.friday.finish) {
                    return true;
                } else {
                    return false;
                }
        }
    }

}

// function checkAvailability(bookingRequest) {
//     const clinic = Clinic.findById(bookingRequest.clinicId)

//    //date example "2022/11/23 9:30-10:00"
//     const bookingDate = bookingRequest.date
//     var date = new Date(bookingDate)
//     var day = date.getDay()

//     if(day == 0 || day == 6 ){
//         mqtt.denyAvailablility("Day is outside of clinic opening hours, please try another date.")
//     } else {
//     if(checkDailyHours(clinic, bookingRequest, day)){
//         checkBookingRequests(clinic, bookingRequest)
//         } else {
//             mqtt.denyAvailablility("Requested time-slot is outside of clinic opening hours. Please select another time.")
//         }
//     }
//     //find clinic client is attempting to book through
//     //Check if desired day is a weekday
//     //compare desired time to opening hours for desired day
//     //if desired time is outside of opening hours, return message
//     //if desired time is within opening hours, get approved and pending booking requests with that timeslot
//     //if response is empty, mqtt.confirmAvailability
//     //if response is not empty, mqtt.denyAvailability

// }

// async function checkBookingRequests(clinic, bookingRequest) {
//     const bookingRequests = await BookingRequest.find({ clinicId: clinic._id })
//     for (let i = 0; i < bookingRequests.length; i++) {
//         if (bookingRequests.state == "approved" || bookingRequests.state == "pending") {
//             if (bookingRequests.date == bookingRequest.date && bookingRequest.start == bookingRequests.start) {
//                 mqtt.denyAvailablility("Time-slot is already booked. Please try a different time-slot")
//             }
//         }
//     }
//     mqtt.confirmAvailablility("Time-slot is available")
// }

// async function checkDailyHours(clinic, bookingRequest, day) {
//     switch (day) {
//         case 1:
//             if (bookingRequest.start >= clinic.openingHours.monday.start && bookingRequest.end <= clinic.openingHours.monday.finish) {
//                 return true;
//             } else {
//                 return false;
//             }
//         case 2:
//             if (bookingRequest.start >= clinic.openingHours.tuesday.start && bookingRequest.end <= clinic.openingHours.tuesday.finish) {
//                 return true;
//             } else {
//                 return false;
//             }
//         case 3:
//             if (bookingRequest.start >= clinic.openingHours.wednesday.start && bookingRequest.end <= clinic.openingHours.wednesday.finish) {
//                 return true;
//             } else {
//                 return false;
//             }
//         case 4:
//             if (bookingRequest.start >= clinic.openingHours.thursday.start && bookingRequest.end <= clinic.openingHours.thursday.finish) {
//                 return true;
//             } else {
//                 return false;
//             }
//         case 5:
//             if (bookingRequest.start >= clinic.openingHours.friday.start && bookingRequest.end <= clinic.openingHours.friday.finish) {
//                 return true;
//             } else {
//                 return false;
//             }
//     }
// }



module.exports = AvailabilityController;