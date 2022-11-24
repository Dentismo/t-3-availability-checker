var express = require('express');
var router = express.Router({ mergeParams: true });
var BookingRequest = require('../models/bookingRequest.js');
const MqttHandler = require('./controller/mqtt-handler.js');
var Clinic = require('./models/clinic.js')

const mqtt = new MqttHandler()

function checkAvailability(bookingRequest) {
    const clinic = Clinic.findById(bookingRequest.clinicId)

   //date example "2022/11/23 9:30-10:00"
    const bookingDate = bookingRequest.date
    var date = new Date(bookingDate)
    var day = date.getDay()

    if(day == 0 || day == 6 ){
        mqtt.denyAvailablility("Day is outside of clinic opening hours, please try another date.")
    } else {
    if(checkDailyHours(clinic, bookingRequest, day)){
        checkBookingRequests(clinic, bookingRequest)
        } else {
            mqtt.denyAvailablility("Requested time-slot is outside of clinic opening hours. Please select another time.")
        }
    }
    //find clinic client is attempting to book through
    //Check if desired day is a weekday
    //compare desired time to opening hours for desired day
    //if desired time is outside of opening hours, return message
    //if desired time is within opening hours, get approved and pending booking requests with that timeslot
    //if response is empty, mqtt.confirmAvailability
    //if response is not empty, mqtt.denyAvailability

}

async function checkBookingRequests(clinic, bookingRequest) {
    const bookingRequests = await BookingRequest.find({ clinicId: clinic._id })
    for (let i = 0; i < bookingRequests.length; i++) {
        if (bookingRequests.state == "approved" || bookingRequests.state == "pending") {
            if (bookingRequests.date == bookingRequest.date && bookingRequest.start == bookingRequests.start) {
                mqtt.denyAvailablility("Time-slot is already booked. Please try a different time-slot")
            }
        }
    }
    mqtt.confirmAvailablility("Time-slot is available")
}

async function checkDailyHours(clinic, bookingRequest, day) {
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

//Get BookingRequest by id
router.get('/:id', function (req, res, next) {
    var id = req.params.id
    BookingRequest.findById(id, function (err, bookingRequest) {
        if (err) { return next(err); }
        if (!bookingRequest) {
            return res.status(404).json({ 'message': 'Booking request was not found!' });
        }
        res.status(200).json(bookingRequest);
    });
});

//Update entire booking request
router.put('/:id', function (req, res, next) {
    var id = req.params.id;
    BookingRequest.findById(id, function (err, bookingRequest) {
        if (err) { return next(err); }
        if (!bookingRequest) {
            return res.status(404).json({ "message": "Booking request not found" });
        }
        var date = req.body.date
        var issuance = req.body.issuance
        var clinicId = req.body.clinicId
        if (!(/[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/.test(date))) {
            return res.json({ "message": "Date must be in YYYY-MM-DD format" });
        } else if (date === null) {
            return res.json({ "message": "Date is required" });
        } else {
            bookingRequest.user.email = rep.body.user.email
            bookingRequest.user.name = rep.body.user.name
            bookingRequest.clinicId = clinicId
            bookingRequest.issuance = issuance
            bookingRequest.date = date
            bookingRequest.state = state
            bookingRequest.start = start
            bookingRequest.end = end
            bookingRequest.save();
            res.status(200).json(bookingRequest);
        }
    });
});

//Update all/part of a booking request
router.patch('/:id', function (req, res, next) {
    var id = req.params.id;
    BookingRequest.findById(id, function (err, bookingRequest) {
        if (err) { return next(err); }
        if (!bookingRequest) {
            return res.status(404).json({ "message": "Booking request was not found" });
        }
        bookingRequest.user.email = (req.body.user.email || bookingRequest.user.email)
        bookingRequest.user.name = (req.body.user.name || bookingRequest.user.name)
        bookingRequest.clinicId = (req.body.clinicId || bookingRequest.clinicId)
        bookingRequest.issuance = (req.body.issuance || bookingRequest.issuance)
        bookingRequest.date = (req.body.date || bookingRequest.date)
        bookingRequest.state = (req.body.state || bookingRequest.state)
        bookingRequest.start = (req.body.start || bookingRequest.start)
        bookingRequest.end = (req.body.end || bookingRequest.end)
        bookingRequest.save();
        res.status(200).json(bookingRequest);
    });
});

//Create a booking request
router.post('/', function (req, res, next) {
    var bookingRequest = new BookingRequest(req.body);
    bookingRequest.save(function (err) {
        if (err) { return next(err); }
        res.status(201).json(bookingRequest);
    })
});

// Get all appointements
router.get("/", async (req, res) => {
    BookingRequest.find().exec(function (err, results) {
        if (err) { return next(err); }
        if (!results) { return res.status(404).json({ 'message': 'No booking requests found!' }); }
        res.status(200).json(results);
    })
});

// Delete a specific booking
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    BookingRequest.findOneAndDelete({ _id: id }, function (err, bookingRequest) {
        if (err) {
            return next(err);
        }
        if (bookingRequest === null) {
            return res.status(404).json({ "message": "Booking request doesn't exist" });
        }
        res.status().json({ 'message': 'Booking request deleted successfully!' })
    });
});

module.exports = checkAvailability;