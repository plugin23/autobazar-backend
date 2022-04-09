import express from 'express'
import mongoose from 'mongoose'
import {router as carsRouter} from './routes/cars.js'
import {router as usersRouter} from './routes/users.js'
import cors from 'cors'
import { createRequire } from "module";
import cors from 'cors';
const require = createRequire(import.meta.url);

const app = express()
const PORT = process.env.PORT || 8080;

app.use(express.json({limit: '15mb'}));
app.use(cors())

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, () => console.log("connected to db"))

app.use('/api/autobazar/cars', carsRouter);
app.use('/api/autobazar/users', usersRouter);

app.listen(PORT)
