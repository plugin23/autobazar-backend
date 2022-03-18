const express = require('express');
const mongoose = require('mongoose');
const app = express()

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, () => console.log("connected to db"))

app.use(express.json())

const carsRouter = require('./routes/cars');
const usersRouter = require('./routes/users')

app.use('/api/autobazar/cars', carsRouter);
app.use('/api/autobazar/users', usersRouter);

app.listen(8080)
