const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    phone_number: String,
    favourites: Array,
    password: String,
    created_at: Date,
})

module.exports = mongoose.model('users', userSchema)