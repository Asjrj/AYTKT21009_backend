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
    PhoneNumber
        .find({ id: req.params.id })
        .then(phone => {
            res.json(phone)
        })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
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
    else {
        if (persons.find((person) => person.name === data.name)) {
            status.error = 'Name must be unique'
            isDataValid = false
        }
    }

    if (isDataValid) {
        data.id = getRandomId()
        persons.push(data)
        res.json(data)
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