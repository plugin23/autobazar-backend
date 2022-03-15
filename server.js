const express = require('express');
const mongoose = require('mongoose');
const app = express()
require('dotenv/config')

const uri = process.env.MONGODB_URI;

mongoose.connect(process.env.MONGODB_URI, () => console.log("connected to db"))

const getCars = require('./routes/cars');

app.use('/autobazar/cars',getCars);

app.listen(8080)
