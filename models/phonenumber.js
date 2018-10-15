const MONGO_URL = process.env.MONGO_URL

const mongoose = require('mongoose')

mongoose.connect(MONGO_URL, { useNewUrlParser: true })

const PhoneNumber = mongoose.model('PhoneNumber', {
    name: String,
    number: String,
    id: Number
})

module.exports = PhoneNumber
