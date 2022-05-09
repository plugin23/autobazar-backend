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

const PORT = process.env.PORT || 8080;

app.use(express.json({limit: '15mb'}));
app.use(cors())

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, () => console.log("connected to db"))

app.use('/api/autobazar/cars', carsRouter);
app.use('/api/autobazar/users', usersRouter);
app.use('/api/autobazar/users', usersWsRouter)

app.listen(PORT)

usersWsRouter.ws('/login', (ws, req) => {
    ws.on('message', async (msg) => {
      //console.log(req)
      let request = JSON.parse(msg)
      console.log(request)
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
        if (request.method == 'GET') {
            try {
                const users = await User.find({_id: req.params.postId})
                if (!users.length) {
                    ws.send(JSON.stringify({errors: [{msg: `User ${req.params.postId} not found`}]}))
                    //return res.status(404).json({errors: [{msg: `User ${req.params.postId} not found`}]})
                }
                else {
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
