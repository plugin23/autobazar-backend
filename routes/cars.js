import express from 'express'
import {carModel as Car} from '../schemas/car-schema.js'
import {userModel as User} from '../schemas/user-schema.js'
import { check, body, validationResult } from 'express-validator'

export const router = express.Router()

//Najnovšie/najstaršie inzeráty
router.get('/', async (req, res) => {
    const page = req.query.page > 0 ? req.query.page : 1
    const per_page = req.query.per_page > 0 ? req.query.per_page : 10
    const order_type = req.query.order_type == 'asc' ? 1 : -1
    
    try {
        const cars = await Car.find().sort({ created_at: order_type }).limit(Number(per_page)).skip((page - 1) * per_page)
        res.json(cars)
    } catch (err) {
        res.status(500).json({errors: err.message})
    }
})

router.get('/search/:searchQuery', async (req, res) => {
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    try { 
        const cars = await Car.find({car_name: new RegExp('^'+escapeRegExp(searchQuery)+'$', "i")}).limit(Number(per_page)).skip((page - 1) * per_page);
        res.json(cars)
    } catch (err) {
        res.status(500).json({errors: err.message})
    }
})

//Odstránenie inzerátu
router.delete('/:postId', async (req, res) => {
    try{
        var removeCar = await Car.deleteOne({_id: req.params.postId})
        var removedCarFavourites = await User.find({favourites: req.params.postId})

        removedCarFavourites.forEach(item => {
            var index = item.favourites.indexOf(req.params.postId)
            item.favourites.splice(index, 1)
            User.findByIdAndUpdate(item._id, {favourites: item.favourites}, {upsert:true}, function(err, doc) {
                if (err) return res.status(500).json({error: err})
            })
        })
        
        if (removeCar.deletedCount) {
            removeCar = []
            return res.status(200).json(removeCar)
        }
        else {
            return res.status(404).json({errors: [{msg: `Car ${req.params.postId} not found`}]})
        }
    } catch(err) {
        res.status(500).json({errors: err.message})
    }
})

//Ukladanie inzerátu do DB
router.post('/', 
    body('author', 'not valid MongoID').not().isEmpty(),
    body('year', 'not number').not().isEmpty().isInt(),
    body('mileage', 'not number').not().isEmpty().isInt(),
    body('price', 'not number').not().isEmpty().isInt(),
    body('doors', 'not number').not().isEmpty().isInt(),
    body('description', 'not string').not().isEmpty().isString(),
    body('engine_cap', 'not string').not().isEmpty().isString(),
    body('car_name', 'not string').not().isEmpty().isString(),
    body('body', 'not string').not().isEmpty().isString(),
    async (req, res) => {

        const car = new Car({
            author: req.body.author,
            year: req.body.year,
            mileage: req.body.mileage,
            price: req.body.price,
            doors: req.body.doors,
            description: req.body.description,
            engine_cap: req.body.engine_cap,
            car_name: req.body.car_name,
            body: req.body.body,
            image_photos: req.body.image_photos
        })

        try{
            validationResult(req).throw();
            const savedCar = await car.save()
            res.status(201).json(savedCar)

        } catch (err) {
            res.status(400).json({errors: err})
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
        car_name: req.body.car_name,
        body: req.body.body,
        image_photos: req.body.image_photos
      });

      res.json(car);

    } catch(err) {
        console.error(err.message);
        res.status(400).json({errors: err.message})
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


