import express from 'express'
import mongoose from 'mongoose'
import {router as carsRouter} from '/skola/autobazar-backend/routes/cars.js'
import {router as usersRouter} from '/skola/autobazar-backend/routes/users.js'
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const app = express()
const PORT = process.env.PORT || 8080;

app.use(express.json({limit: '15mb'}));

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, () => console.log("connected to db"))

app.use(express.json())


app.use('/api/autobazar/cars', carsRouter);
app.use('/api/autobazar/users', usersRouter);

app.listen(PORT)
