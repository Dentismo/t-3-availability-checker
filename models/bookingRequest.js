const mongoose = require("mongoose")


var bookingRequestSchema = new mongoose.Schema({
    user: {
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^\w+(\.-?\w+)*@\w+(\.-?\w+)*(\.\w{2,3})+$/
        },
        name: {
            type: String,
            required: true
        }
    },
    clinicId: {
        type: String,
        minLength: 1,
        required: true,
    },
    issuance: {
        type: String,
        minLength: 1,
        maxLength: 13,
        required: true,
        match: [/^[0-9]*$/, 'Field may only contain numbers.']
    },
    date: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['approved', 'pending', 'denied']
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('BookingRequests', bookingRequestSchema)