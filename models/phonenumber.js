const MONGO_URL = process.env.MONGO_URL

const mongoose = require('mongoose')

mongoose.connect(MONGO_URL, { useNewUrlParser: true })

const PhonenumberSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

PhonenumberSchema.statics.format = function (phone) {
    return {
        name: phone.name,
        number: phone.number,
        id: phone._id
    }
}

const PhoneNumber = mongoose.model('PhoneNumber', PhonenumberSchema)

module.exports = PhoneNumber
