var express = require('express');
var router = express.Router({ mergeParams: true });
var BookingRequest = require('../models/bookingRequest.js');
const MqttHandler = require('./controller/mqtt-handler.js');
var Clinic = require('')

const mqtt = new MqttHandler()

function checkAvailability(bookingRequest) {
    const clinic = Clinic.findById(bookingRequest.clinicId)

    var dateExample = "1 23/11/2022 9:30-10:00"
    const array = dateExample.split(" ")
    const timeArray = array[2].split("-")
    var day = array[0]
    const desiredDate = array[1]
    var startTime = timeArray[0]
    var endTime = timeArray[1]


    switch(day){
        case 1:
            //for the given day - check clinic opneing time
            checkBookingRequests(clinic, bookingRequest)
            break;
        case 2:
            //for the given day - check clinic opneing time
            checkBookingRequests(clinic, bookingRequest)
            break;
        case 3:
            //for the given day - check clinic opneing time
            checkBookingRequests(clinic, bookingRequest)
            break;
        case 4:
            //for the given day - check clinic opneing time
            checkBookingRequests(clinic, bookingRequest)
            break;
        case 5:
            //for the given day - check clinic opneing time
            checkBookingRequests(clinic, bookingRequest)
            break;
        default:
            mqtt.denyAvailablility()
            break;
    }
    


    //find clinic client is attempting to book through
    //compare desired time to opening hours for desired day
    //if desired time is outside of opening hours, return message
    //if desired time is within opening hours, get approved booking requests with that timeslot
    //if response is empty, mqtt.confirmAvailability
    //if response is not empty, mqtt.denyAvailability

}

async function checkBookingRequests(clinic, bookingRequest) {
    const bookingRequests = await BookingRequest.find({clinicId: clinic._id})

}

//Get BookingRequest by id
router.get('/:id', function(req, res, next) {
    var id = req.params.id
    BookingRequest.findById(id, function(err, bookingRequest) {
        if (err) { return next(err); }
        if (!bookingRequest) {
            return res.status(404).json({ 'message': 'Booking request was not found!' });
        }
        res.status(200).json(bookingRequest);
    });
});

//Update entire booking request
router.put('/:id', function(req, res, next) {
    var id = req.params.id;
    BookingRequest.findById(id, function(err, bookingRequest) {
        if (err) { return next(err); }
        if (!bookingRequest) {
            return res.status(404).json({ "message": "Booking request not found" });
        }
        var date = req.body.date
        var issuance = req.body.issuance
        var clinicId = req.body.clinicId
        if (!(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(date))){
            return res.json({"message": "Date must be in DD-MM-YYYY format"});
        } else if (date === null) {
            return res.json({ "message": "Date is required" });
        } else {
        bookingRequest.user.email = rep.body.user.email
        bookingRequest.user.name = rep.body.user.name
        bookingRequest.clinicId = clinicId
        bookingRequest.issuance = issuance
        bookingRequest.date = date
        bookingRequest.state = state
        bookingRequest.save();
        res.status(200).json(bookingRequest);
        }
    });
});

//Update all/part of a booking request
router.patch('/:id', function(req, res, next) {
    var id = req.params.id;
    BookingRequest.findById(id, function(err, bookingRequest) {
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
        bookingRequest.save();
        res.status(200).json(bookingRequest);
    });
});

//Create a booking request
router.post('/', function(req, res, next){
    var bookingRequest = new BookingRequest(req.body);
    bookingRequest.save(function(err) {
        if (err) { return next(err); }
        res.status(201).json(bookingRequest);
    })
});

// Get all appointements
router.get("/", async(req, res) => {
    BookingRequest.find().exec(function(err, results) {
        if (err) { return next(err); }
        if (!results) { return res.status(404).json({ 'message': 'No booking requests found!' }); }
        res.status(200).json(results);
    })
});

// Delete a specific booking
router.delete("/:id", async(req, res) => {
    const id = req.params.id;

    BookingRequest.findOneAndDelete({ _id: id }, function(err, bookingRequest) {
        if (err) {
            return next(err);
        }
        if (bookingRequest === null) {
            return res.status(404).json({ "message": "Booking request doesn't exist" });
        }
        res.status().json({'message': 'Booking request deleted successfully!'})
    });
});

module.exports = checkAvailability;