const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const PhoneNumber = require('./models/phonenumber')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :data :res[content-length] - :response-time ms'))

app.get('/', (req, res) => {
    res.send('<h1>Hello Puhelinluettelo</h1>')
})

app.get('/info', (req, res) => {
    let today = new Date().toString();
    PhoneNumber
        .estimatedDocumentCount()
        .then(result => {
            res.send(`<p>Puhelinluettelossa on ${result} henkilön tiedot</p><p>${today}</p>`)
        })
        .catch(error => {
            console.log(error)
            res.status(400).end()
        })
})

app.get('/api/persons', (req, res) => {
    PhoneNumber
        .find({})
        .then(phones => {
            res.json(phones.map(PhoneNumber.format))
        })
})

app.get('/api/persons/:id', (req, res) => {
    PhoneNumber
        .findById(req.params.id)
        .then(phone => {
            if (phone) {
                res.json(PhoneNumber.format(phone))
            }
            else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    PhoneNumber
        .findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (req, res) => {
    const data = req.body

    if (data.name === undefined || data.number === undefined) {
        res.status(400).send({ error: 'Name and number must be specified' })
    }
    else {
        PhoneNumber
            .find({ name: data.name })
            .then(result => {
                if (result.length === 0) {
                    let newnumber = new PhoneNumber({
                        name: data.name,
                        number: data.number
                    })
                    newnumber
                        .save()
                        .then(result => {
                            res.json(PhoneNumber.format(result))
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }
                else {
                    res.status(400).send({ error: `Name ${data.name} already exists` })
                }
            })
    }
})

app.put('/api/persons/:id', (req, res) => {
    const data = req.body
    const newphone = {
        name: data.name,
        number: data.number
    }

    PhoneNumber
        .findByIdAndUpdate(req.params.id, newphone, { new: true })
        .then(result => {
            res.json(PhoneNumber.format(result))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})