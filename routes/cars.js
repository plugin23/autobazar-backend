const { response } = require('express')
const express = require('express')
const router = express.Router()
const Car = require('../models/cars')


router.get('/', async (req, res) => {
    try{
        const cars = await Car.find()
        res.json(cars)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})


module.exports = router