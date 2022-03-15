const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    id: Number,
    author: Number,
    year: Number,
    milage: Number,
    price: Number,
    doors: Number,
    description: String,
    engine_cap: String,
    car_brand: String,
    image_url: String,
    body: String,
    password: String,
    image_photos: Array,
    created_at: Date,
})

module.exports = mongoose.model('cars', carSchema)