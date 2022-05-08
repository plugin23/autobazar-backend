import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const app = express()
var expressWs = require('express-ws')(app)
import { router as carsRouter } from './routes/cars.js'
const usersRouter = expressWs.Router()

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

usersRouter.ws('/login', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg)
        //ws.send(msg);
    });
});

//Informácie o užívateľovi
usersRouter.get('/:postId', async (req, res) => {
    try{
        const users = await User.find({_id: req.params.postId})
        if (!users.length) {
            return res.status(404).json({errors: [{msg: `User ${req.params.postId} not found`}]})
        }
        else {
            res.json(users)
        }
        
    } catch(err) {
        res.status(500).json({errors: err.message})
    }
})

//Obľúbené inzeráty
usersRouter.get('/:postId/favourites', async (req, res) => {
    try{
        const users = await User.find({_id: req.params.postId})
        if (!users.length) {
            res.status(404).json({errors: [{msg: `user ${req.params.postId} not found`}]})
        }
        else { 
            res.json(users[0].favourites)
        }
        
    } catch(err) {
        res.status(500).json({errors: err.message})
    }
})

//Registrácia používateľa
usersRouter.post('/', 
    body('first_name', 'not string').not().isEmpty().isString(),
    body('last_name', 'not string').not().isEmpty().isString(),
    body('email', 'not string').not().isEmpty().isEmail(),
    body('password', 'not string').not().isEmpty().isString(),
    body('phone_number', 'not number').not().isEmpty().isNumeric(),
    async (req, res) => {

        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            phone_number: req.body.phone_number,
            favourites: [],
            own_advertisement: []
        })
        
        try {
            validationResult(req).throw();
            const users = await User.find({email: req.body.email})
        
            if (users.length) {
                return res.status(400).json({ errors: [{ msg: "User with this email already exists" }] })
            } 
            await user.save()
            res.status(201).json({
                msg: 'User added successfully!'
            });
        } catch (err) {
            res.status(400).json({ errors: err.message })
        }        
})


//Prihlásenie používateľa
usersRouter.post('/login',  async (req, res) => {

        const users = await User.findOne({email: req.body.email})

        if (users == null) {
            return res.status(400).json({errors: [{msg: "User was not found"}]})
        }
        
        try{
            validationResult(req).throw();

            if (req.body.password == users.password) {
                res.json({id : users['_id'] })
            }
            else{
                res.status(403).json({errors: [{msg: "Unsuccessfully logged in"}]})
            }

        } catch (err) {
            res.status(400).json({errors: err.message})
        }
})

//Pridanie do favourites
//Úprava pouzivatela
usersRouter.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            favourites: req.body.favourites,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: req.body.password
        });

        res.json(user);
    } catch(err) {
        res.status(400).json({errors: err.message})
    }
});

//Pridanie vlastného inzerátu userovi
usersRouter.put('/:id/own_advertisement', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        own_advertisement: req.body.own_advertisement        
      });

      res.json(user);

    } catch(err) {
        
        res.status(400).json({errors: err.message})
    }

});