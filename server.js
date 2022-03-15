const express = require('express');
const mongoose = require('mongoose');
const app = express()
require('dotenv/config')

const uri = process.env.MONGODB_URI;
//app.use(bodyParser.urlencoded({ extended: true }))


mongoose.connect(process.env.DATABASE_URL, () => console.log("connected to db"))


const getCars = require('./routes/cars');

app.use('/auta',getCars);

app.listen(8080)
