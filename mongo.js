const mongoose = require('mongoose')
const mongoPath = 'mongodb+srv://autobazar-fiit:bazarikpiko@mtaa-autobazar.glmc1.mongodb.net/mtaa-autobazar?retryWrites=true&w=majority'

module.exports = async () => {
    await mongoose.connect(mongoPath,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    return mongoose
}