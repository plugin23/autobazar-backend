const express = require('express')
const app = express()

const uri = process.env.MONGODB_URI;

app.listen(8080, () => console.log('Server started'))