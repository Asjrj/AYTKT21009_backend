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

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
]


app.get('/', (req, res) => {
    res.send('<h1>Hello Puhelinluettelo</h1>')
})

app.get('/info', (req, res) => {
    let today = new Date().toUTCString();
    res.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p><p> ${today}</p>`)
})

app.get('/api/persons', (req, res) => {
    PhoneNumber
        .find({})
        .then(phones => {
            res.json(phones.map(PhoneNumber.format))
        })
})

app.get('/api/persons/:id', (req, res) => {
    console.log('*GET ID*', req.params.id)
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
    let isDataValid = true
    let status = {
        error: ''
    }

    if (data.name === undefined || data.number === undefined) {
        status.error = 'Name and number must be specified'
        isDataValid = false
    }

    if (isDataValid) {
        let newnumber = new PhoneNumber({
            name: data.name,
            number: data.number
        })
        newnumber
            .save()
            .then (result => {
                res.json(PhoneNumber.format(result))
            })
            .catch(error => {
                console.log(error)
            })
    }
    else {
        res.json(status)
    }
})

function getRandomId() {
    let max = 10000
    return Math.floor(Math.random() * max)
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})