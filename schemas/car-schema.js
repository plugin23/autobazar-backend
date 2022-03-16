const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'users',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    milage: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    doors: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    engine_cap: {
        type: String,
        required: true
    },
    car_brand: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
    },
    body: {
        type: String,
        required: true
    },
    image_photos: {
        type: Array,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
})

module.exports = mongoose.model('cars', carSchema)