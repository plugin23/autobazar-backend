import mongoose from 'mongoose'

const carSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    mileage: {
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
    car_name: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image_photos: {
        type: Array,
        required: false
    },    
    created_at: {
        type: Date,
        default: Date.now
    },
})

export const carModel = mongoose.model('cars', carSchema)