const express = require('express');
const mongoose = require('mongoose');
const app = express()
require('dotenv/config')

const uri = process.env.MONGODB_URI;

mongoose.connect(process.env.MONGODB_URI, () => console.log("connected to db"))

const getCars = require('./routes/cars');
const deleteCars = require('./routes/cars');

app.use('/api/autobazar/cars',getCars);
app.use('/api/autobazar/cars',deleteCars);

app.listen(8080)
