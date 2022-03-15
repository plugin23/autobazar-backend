const express = require('express');
const { default: mongoose } = require('mongoose');
const mongo = require('./mongo')
const userSchema = require('./schemas/user-schema')
const carSchema = require('./schemas/car-schema')
const app = express()

const uri = process.env.MONGODB_URI;
//app.use(bodyParser.urlencoded({ extended: true }))

/*
app.listen(8080, function() {})


app.get('/', function(req, res) {
    res.send('Hello World')
  })

app.post('/quotes', (req, res) => {
  console.log('Hellooooooooooooooooo!')
})  
*/
const connectToDB = async () => {
    await mongo().then(async (mongoose) => {
        try{
            console.log('Connectet to db')
            //setCarSchema()
            //setUserSchema()
            
        }
        finally{
            mongoose.connection.close()
        }
    })
}

connectToDB()


function setCarSchema(){
    const user = {
        id: 1,
        first_name: 'Fero',
        last_name: 'Mrkva',
        phone_number: '0908777888',
        favourites: [1,2,3,4],
        password: 'hesielko',
        created_at: "2021-01-01T12:00:00Z",
    }

    await new userSchema(user).save()
}

function setUserSchema(){
    const car = {
        id: 1,
        author: 1,
        year: 1999,
        milage: 301555,
        price: 5899,
        doors: 4,
        description: "test description",
        engine_cap: "test",
        car_brand: "test",
        image_url: "test",
        body: "test",
        password: "test",
        image_photos: [1,2,3],
        created_at: "2021-01-01T12:00:00Z",
    }

    await new carSchema(car).save()
}

