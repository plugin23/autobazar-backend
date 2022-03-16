const { response } = require('express')
const express = require('express')
const router = express.Router()
const Car = require('../schemas/car-schema')


router.get('/', async (req, res) => {
    try {
        const cars = await Car.find()
        res.json(cars)
        console.log(cars)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req, res) => {
    const car = new Car({
        author: req.body.author,
        year: req.body.year,
        mileage: req.body.mileage,
        price: req.body.price,
        doors: req.body.doors,
        description: req.body.description,
        engine_cap: req.body.engine_cap,
        car_brand: req.body.car_brand,
        image_url: req.body.image_url,
        body: req.body.body,
        image_photos: req.body.image_photos
    })

    try{
        const savedCar = await car.save()
        res.status(201).json(savedCar)

    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


module.exports = router