const { response } = require('express')
const express = require('express')
const router = express.Router()
const Car = require('../schemas/car-schema')


router.get('/', async (req, res) => {
    try{
        const cars = await Car.find()
        console.log(cars);
        res.json(cars)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.delete('/:postId', async (req, res) => {
    try{
        const removeCar = await Car.remove({_id: req.params.postId})
        console.log(removeCar);
        res.json(removeCar)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router

