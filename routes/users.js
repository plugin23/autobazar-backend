const { response } = require('express')
const express = require('express')
const router = express.Router()
const User = require('../schemas/user-schema')


router.get('/:postId', async (req, res) => {
    try{
        const users = await User.find({_id: req.params.postId})
        console.log(users);
        res.json(users)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//TODO vracať iba array favourites
router.get('/:postId/favourites', async (req, res) => {
    try{
        const users = await User.find({_id: req.params.postId})
        res.json(users[0].favourites)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})


module.exports = router