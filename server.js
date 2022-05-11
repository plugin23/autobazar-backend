import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { createRequire } from "module";
import { userModel as User } from './schemas/user-schema.js'
import { carModel as Car } from './schemas/car-schema.js'
import { check, body, validationResult } from 'express-validator'

const require = createRequire(import.meta.url);
const app = express()
var expressWs = require('express-ws')(app)
import { router as carsRouter } from './routes/cars.js'
import { router as usersRouter } from './routes/users.js'

const usersWsRouter = express.Router()
const carWsRouter = express.Router()

const PORT = process.env.PORT || 8080;

app.use(express.json({limit: '15mb'}));
app.use(cors())

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, () => console.log("connected to db"))

app.use('/api/autobazar/users', usersWsRouter)
app.use('/api/autobazar/cars', carWsRouter)
app.use('/api/autobazar/cars', carsRouter);
app.use('/api/autobazar/users', usersRouter);


app.listen(PORT)

usersWsRouter.ws('/login', (ws, req) => {
    ws.on('message', async (msg) => {
      
      let request = JSON.parse(msg)
      //console.log(request)
      let users = await User.findOne({ email: request.body.email })

      if (users == null) {
        ws.send(JSON.stringify({ errors: [{ msg: "User was not found" }] }))
        //return res.status(400).json({errors: [{msg: "User was not found"}]})
      }

      try {
        validationResult(request.body).throw();

        if (request.body.password == users.password) {
          ws.send(JSON.stringify({ id: users['_id'] }))
          //res.json({ id: users['_id'] })
        }
        else {
          ws.send(JSON.stringify({ errors: [{ msg: "Unsuccessfully logged in" }] }))
          //res.status(403).json({ errors: [{ msg: "Unsuccessfully logged in" }] })
        }

      } catch (err) {
        ws.send(JSON.stringify({ errors: err.message }))
        //res.status(400).json({ errors: err.message })
      }
    });
});

usersWsRouter.ws('/:postId', (ws, req) => {
    ws.on('message', async (msg) => {
        let request = JSON.parse(msg)
        //console.log(request)
        if (request.method == 'GET') {
            try {
                const users = await User.find({_id: req.params.postId})
                if (!users.length) {
                    ws.send(JSON.stringify({errors: [{msg: `User ${req.params.postId} not found`}]}))
                    //return res.status(404).json({errors: [{msg: `User ${req.params.postId} not found`}]})
                }
                else {
                    console.log(users)
                    ws.send(JSON.stringify(users))
                    //res.json(users)
                }
                
            } catch(err) {
                ws.send(JSON.stringify({errors: err.message}))
                //res.status(500).json({errors: err.message})
            }
        }
        else if (request.method == 'PUT') {
            try {
                const user = await User.findByIdAndUpdate(req.params.postId, {
                    favourites: request.body.favourites,
                    first_name: request.body.first_name,
                    last_name: request.body.last_name,
                    email: request.body.email,
                    phone_number: request.body.phone_number,
                    password: request.body.password
                });
                
                ws.send(JSON.stringify(user))
                //res.json(user);
            } catch(err) {
                ws.send(JSON.stringify({errors: err.message}))
                //res.status(400).json({errors: err.message})
            }
        }
        
    })
})

usersWsRouter.ws('/', 
    body('first_name', 'not string').not().isEmpty().isString(),
    body('last_name', 'not string').not().isEmpty().isString(),
    body('email', 'not string').not().isEmpty().isEmail(),
    body('password', 'not string').not().isEmpty().isString(),
    body('phone_number', 'not number').not().isEmpty().isNumeric(), 
    (ws, req) => {
        ws.on('message', async (msg) => {
            let request = JSON.parse(msg)
            if (request.method == 'POST') {
                const user = new User({
                    first_name: request.body.first_name,
                    last_name: request.body.last_name,
                    email: request.body.email,
                    password: request.body.password,
                    phone_number: request.body.phone_number,
                    favourites: [],
                    own_advertisement: []
                })
                
                try {
                    validationResult(request.body).throw();
                    const users = await User.find({email: request.body.email})
                
                    if (users.length) {
                        ws.send(JSON.stringify({ errors: [{ msg: "User with this email already exists" }] }))
                        //return res.status(400).json({ errors: [{ msg: "User with this email already exists" }] })
                    } 
                    await user.save()
                    ws.send(JSON.stringify({ msg: 'User added successfully!' }))
                    //res.status(201).json({ msg: 'User added successfully!' });
                } catch (err) {
                    ws.send(JSON.stringify({ errors: err.message }))
                    //res.status(400).json({ errors: err.message })
                } 
            }
            else if (request.method == 'PUT') {
                try {
                    const user = await User.findByIdAndUpdate(req.params.id, {
                        favourites: request.body.favourites,
                        first_name: request.body.first_name,
                        last_name: request.body.last_name,
                        email: request.body.email,
                        phone_number: request.body.phone_number,
                        password: request.body.password
                    });
            
                    ws.send(JSON.stringify(user))
                    //res.json(user);
                } catch(err) {
                    ws.send(JSON.stringify({ errors: err.message }))
                    //res.status(400).json({errors: err.message})
                }
            }
            
        })
})

usersWsRouter.ws('/:postId/favourites', (ws, req) => {
    ws.on('message', async (msg) => {
        let request = JSON.parse(msg)
        try{
            const users = await User.find({_id: req.params.postId})
            if (!users.length) {
                ws.send(JSON.stringify({ errors: [{msg: `user ${req.params.postId} not found`}] }))
                //res.status(404).json({errors: [{msg: `user ${req.params.postId} not found`}]})
            }
            else { 
                ws.send(JSON.stringify(users[0].favourites))
                //res.json(users[0].favourites)
            }
            
        } catch(err) {
            ws.send(JSON.stringify({ errors: err.message }))
            //res.status(500).json({errors: err.message})
        }
    })
})

usersWsRouter.ws('/:id/own_advertisement', (ws, req) => {
    ws.on('message', async (msg) => {
        let request = JSON.parse(msg)
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
              own_advertisement: request.body.own_advertisement        
            });

            ws.send(JSON.stringify(user))
            //res.json(user);
        } catch(err) {
            ws.send(JSON.stringify({ errors: err.message }))
            //res.status(400).json({errors: err.message})
        }
    })
})

carWsRouter.ws('/', (ws, req) => {
    
    ws.on('message', async (msg) => {
        let request = JSON.parse(msg)
        //console.log(request)
        if (request.method == 'GET') {
            const page = req.query.page > 0 ? req.query.page : 1
            const per_page = req.query.per_page > 0 ? req.query.per_page : 10
            const order_type = req.query.order_type == 'asc' ? 1 : -1
            
            try {
                const cars = await Car.find().sort({ created_at: order_type }).limit(Number(per_page)).skip((page - 1) * per_page)
                //res.json(cars)
                //console.log(cars)
                ws.send(JSON.stringify(cars))
            } catch (err) {
                ws.send(JSON.stringify({ errors: err.message }))
            }    
        }

        if (request.method == 'POST'){
            //
            const car = new Car({
                author: request.body.author,
                year: request.body.year,
                mileage: request.body.mileage,
                price: request.body.price,
                doors: request.body.doors,
                description: request.body.description,
                engine_cap: request.body.engine_cap,
                car_name: request.body.car_name,
                body: request.body.body,
                image_photos: request.body.image_photos
            })
    
            try{
                validationResult(request).throw();
                const savedCar = await car.save()
                //res.status(201).json(savedCar)
                ws.send(JSON.stringify(savedCar))    
            } catch (err) {
                ws.send(JSON.stringify({ errors: err.message }))
            }
        }      
        
    })
})


carWsRouter.ws('/search/:searchQuery', (ws, req) => {
    ws.on('message', async (msg) => {
        const page = req.query.page > 0 ? req.query.page : 1
        const per_page = req.query.per_page > 0 ? req.query.per_page : 10
        const order_type = req.query.order_type == 'asc' ? 1 : -1

        try { 
            const cars = await Car.find({'car_name': {'$regex': req.params.searchQuery, '$options': 'i'}}).sort({ created_at: order_type }).limit(Number(per_page)).skip((page - 1) * per_page);
            //res.json(cars)
            ws.send(JSON.stringify(cars))
        } catch (err) {
            ws.send(JSON.stringify({errors: err.message}))
        }
    })
})

carWsRouter.ws('/:id', 
    check('id').isMongoId().withMessage('not valid MongoID'),
    (ws, req) => {
        ws.on('message', async (msg) => {
            let request = JSON.parse(msg)
            if (request.method == 'GET') {
                try {
                    validationResult(req).throw();
                    const car = await Car.findById(req.params.id)

                    if (car === null) {
                        ws.send(JSON.stringify({ errors: [{ msg: `car ${req.params.id} not found` }] }))
                        //return res.status(404).json({ errors: [{ msg: `car ${req.params.id} not found` }] })
                    }
                    ws.send(JSON.stringify(car))
                    //res.status(200).json(car)
                } catch (err) {
                    ws.send(JSON.stringify({ errors: err.array() }))
                    //res.status(500).json({ errors: err.array() });
                }
            }
            if (request.method == 'PUT'){
                try {
                    //validationResult(req).throw();
                    const car = await Car.findByIdAndUpdate(req.params.id, {
                    author: request.body.author,
                    year: request.body.year,
                    mileage: request.body.mileage,
                    price: request.body.price,
                    doors: request.body.doors,
                    description: request.body.description,
                    engine_cap: request.body.engine_cap,
                    car_name: request.body.car_name,
                    body: request.body.body,
                    image_photos: request.body.image_photos
                    });
            
                    console.log(car)
                    ws.send(JSON.stringify(car))
            
                } catch(err) {
                    ws.send(JSON.stringify({ errors: err.message }))
                }
            }
            
            
            if (request.method == 'DELETE'){
                
                try{
                    var removeCar = await Car.deleteOne({_id: req.params.id})
                    var removedCarFavourites = await User.find({favourites: req.params.id})
            
                    removedCarFavourites.forEach(item => {
                        var index = item.favourites.indexOf(req.params.id)
                        item.favourites.splice(index, 1)
                        User.findByIdAndUpdate(item._id, {favourites: item.favourites}, {upsert:true}, function(err, doc) {
                            if (err) return ws.send(JSON.stringify({ error: err }))
                        })
                    })
                    
                    if (removeCar.deletedCount) {
                        removeCar = []
                        return ws.send(JSON.stringify(removeCar))
                        //return res.status(200).json(removeCar)
                    }
                    else {
                        return ws.send(JSON.stringify({ errors: [{msg: `Car ${req.params.id} not found`} ]}))
                        //return res.status(404).json({errors: [{msg: `Car ${req.params.id} not found`}]})
                    }
                } catch(err) {
                    ws.send(JSON.stringify({ errors: err.message }))
                    //res.status(500).json({errors: err.message})
                }
            }
            
            
        })
})

carWsRouter.ws('/:postId/favourites', (ws, req) => {
    ws.on('message', async (msg) => {
        let request = JSON.parse(msg)
        try{
            validationResult(req).throw();
            const car = await Car.findById(req.params.id)
            
            if (car === null) {
                //return res.status(404).json({errors: [{msg: `car ${req.params.id} not found`}]})
                return   ws.send(JSON.stringify({ errors: [{msg: `car ${req.params.id} not found`}] }))
             }
             ws.send(JSON.stringify(car))
            //res.status(200).json(car)
        } catch (err) {
            ws.send(JSON.stringify({ errors: err.message }))
        }
    })
})



