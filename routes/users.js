const { response } = require('express')
const express = require('express')
const router = express.Router()
const User = require('../schemas/user-schema')


const { check, body, validationResult } = require('express-validator');

//Informácie o užívateľovi
router.get('/:postId', async (req, res) => {
    try{
        const users = await User.find({_id: req.params.postId})
        if (!users.length) {
            return res.status(404).json({errors: [{msg: `user ${req.params.postId} not found`}]})
        }
        else {
            res.json(users)
        }
        
    } catch(err) {
        res.status(500).json({errors: err.message})
    }
})

//Obľúbené inzeráty
router.get('/:postId/favourites', async (req, res) => {
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

//Registrácia pužívateľa
router.post('/', 
    body('first_name', 'not string').not().isEmpty().isString(),
    body('last_name', 'not string').not().isEmpty().isString(),
    body('email', 'not string').not().isEmpty().isString(),
    body('password', 'not string').not().isEmpty().isString(),
    body('phone_number', 'not number').not().isEmpty().isInt(),
    body('favourites', 'not array').isArray(),
    async (req, res) => {

        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            favourites: req.body.favourites,
            password: req.body.password
        })
        
        try{
            validationResult(req).throw();
            const email = await User.findOne({email: req.body.email})
            const password = await User.findOne({password: req.body.password})

            if(email){
                return res.status(400).send("User with this email already exists")    
            }

            if(password){
                return res.status(400).send("Password already used")    
            }

            const savedUser = await user.save()
            res.status(201).json({
                message: 'User added successfully!'
              });

        } catch (err) {
            res.status(400).json({errors: err.array()})
        }
})

//Prihlásenie používateľa
router.post('/login',  async (req, res) => {

        const users = await User.findOne({email: req.body.email})

        if(users == null){
            return res.status(400).send("User was not found")
        }
        
        try{
            validationResult(req).throw();

            if(req.body.password == users.password){
                res.send("Successfully logged in")
            }
            else{
                res.send("Unsuccessfully logged in")
            }

        } catch (err) {
            res.status(400).json({errors: err.array()})
        }
})

module.exports = router