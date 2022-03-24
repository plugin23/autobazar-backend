const { response } = require('express')
const express = require('express')
const router = express.Router()
const Car = require('../schemas/car-schema')

const { check, body, validationResult } = require('express-validator');
const { request } = require('express');

//Najnovšie/najstaršie inzeráty
router.get('/', async (req, res) => {
    const page = req.query.page ? req.query.page : 1
    const per_page = req.query.per_page ? req.query.per_page : 10
    const order_type = req.query.order_type == 'asc' ? 1 : -1
    
    try {
        const cars = await Car.find().sort({ created_at: order_type }).limit(Number(per_page)).skip((page - 1) * per_page)
        res.json(cars)
    } catch (err) {
        res.status(500).json({errors: err.message})
    }
})

//Odstránenie inzerátu
router.delete('/:postId', async (req, res) => {
    try{
        const removeCar = await Car.remove({_id: req.params.postId})
        res.json(removeCar)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//Ukladanie inzerátu do DB
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

//Úprava inzerátu
router.put('/:id', async (req, res) => {
    try {
      const car = await Car.findByIdAndUpdate(req.params.id, {
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
      });

      res.json(car);

    } catch(err) {
        console.error(err.message);
        res.send(400).send('Server Error');
    }
});

//Obsah inzerátu
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
