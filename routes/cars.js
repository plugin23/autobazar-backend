const { response } = require('express')
const express = require('express')
const router = express.Router()
const Car = require('../schemas/car-schema')

const { check, body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const cars = await Car.find()
        res.json(cars)
        console.log(cars)
    } catch (err) {
        res.status(500).json({errors: err.message})
    }
})

router.post('/', 
    body('author', 'not valid MongoID').not().isEmpty().isMongoId(),
    body('year', 'not number').not().isEmpty().isInt(),
    body('mileage', 'not number').not().isEmpty().isInt(),
    body('price', 'not number').not().isEmpty().isInt(),
    body('doors', 'not number').not().isEmpty().isInt(),
    body('description', 'not string').not().isEmpty().isString(),
    body('engine_cap', 'not string').not().isEmpty().isString(),
    body('car_brand', 'not string').not().isEmpty().isString(),
    body('image_url', 'not string').not().isEmpty().isString(),
    body('body', 'not string').not().isEmpty().isString(),
    body('image_photos', 'not array').not().isEmpty().isArray(),
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

router.get('/:id', 
    check('id').isMongoId().withMessage('not valid MongoID'),
    async (req, res) => {
        try{
            validationResult(req).throw();
            const car = await Car.findById(req.params.id)
            
            if (car === null) {
                return res.status(404).json({errors: [{msg: `car ${req.params.id} not found`}]})
            }

            res.status(200).json(car)
        } catch (err) {
            res.status(500).json({errors: err.array()});
        }
})


module.exports = router
