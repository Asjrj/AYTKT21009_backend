const MONGO_URL = process.env.MONGO_URL

const mongoose = require('mongoose')

mongoose.connect(MONGO_URL)

const PhoneNumber = mongoose.model('PhoneNumber', {
    name: String,
    number: String
})

const phone = new PhoneNumber({
    name: process.argv[2],
    number: process.argv[3]
})

if (process.argv.length >= 4) {
    phone
        .save()
        .then(response => {
            console.log(`Lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon!`)
            mongoose.connection.close()
        })
}
else {
    PhoneNumber
        .find({})
        .then(result => {
            console.log('Puhelinluettelo:')
            result.forEach(item => {
                console.log(item.name, item.number)
            })
            mongoose.connection.close()
        })
}
