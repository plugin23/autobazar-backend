const { response } = require('express')
const express = require('express')
const router = express.Router()
const Car = require('../schemas/car-schema')

const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const cars = await Car.find()
        res.json(cars)
        console.log(cars)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', 
    body('author').not().isEmpty().isMongoId(),
    body('year').not().isEmpty().isInt(),
    body('mileage').not().isEmpty().isInt(),
    body('price').not().isEmpty().isInt(),
    body('doors').not().isEmpty().isInt(),
    body('description').not().isEmpty().isString(),
    body('engine_cap').not().isEmpty().isString(),
    body('car_brand').not().isEmpty().isString(),
    body('image_url').not().isEmpty().isString(),
    body('body').not().isEmpty().isString(),
    body('image_photos').not().isEmpty().isArray(),
    async (req, res) => {

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
            validationResult(req).throw();
            const savedCar = await car.save()
            res.status(201).json(savedCar)

        } catch (err) {
            res.status(400).json({errors: err.array()})
        }
})


module.exports = router