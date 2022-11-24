const mongoose = require("mongoose")


const clinicSchema = new mongoose.Schema({
    dentists: {
        type: Number
    },
    issuance: {
        type: String, 
        unique: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    coordinate: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    },
    openinghours: {
        monday: {
            start: {
                type: Number,
                required: true
            },
            finish: {
                type: Number,
                required: true
            }
        },
        tuesday: {
            start: {
                type: Number,
                required: true
            },
            finish: {
                type: Number,
                required: true
            }
        },
        wednesday: {
            start: {
                type: Number,
                required: true
            },
            finish: {
                type: Number,
                required: true
            }
        },
        thursday: {
            start: {
                type: Number,
                required: true
            },
            finish: {
                type: Number,
                required: true
            }
        },
        friday: {
            start: {
                type: Number,
                required: true
            },
            finish: {
                type: Number,
                required: true
            }
        }
    }
});

module.exports = mongoose.model('Clinic', clinicSchema)
