const mongoose = require("mongoose")


const clinicSchema = new mongoose.Schema({
    dentists: {
        type: Number
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
                type: String,
                required: true
            },
            finish: {
                type: String,
                required: true
            }
        },
        tuesday: {
            start: {
                type: String,
                required: true
            },
            finish: {
                type: String,
                required: true
            }
        },
        wednesday: {
            start: {
                type: String,
                required: true
            },
            finish: {
                type: String,
                required: true
            }
        },
        thursday: {
            start: {
                type: String,
                required: true
            },
            finish: {
                type: String,
                required: true
            }
        },
        friday: {
            start: {
                type: String,
                required: true
            },
            finish: {
                type: String,
                required: true
            }
        }
    }
});

module.exports = mongoose.model('Clinic', clinicSchema)
