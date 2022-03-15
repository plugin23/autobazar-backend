const express = require('express');
const mongoose = require('mongoose');
const app = express()
require('dotenv').config()

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {useNewUrlParser:true})
const db = mongoose.connection
db.once('open', () => console.log('Connected to DB'))

const usersRouter = require('./routes/users')
const carsRouter = require('./routes/cars')

app.use('/api/autobazar/users', usersRouter)
app.use('api/autobazar/cars', carsRouter)

app.listen(8080, () => console.log('Server started'))