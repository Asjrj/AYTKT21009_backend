const express = require('express')
const app = express()

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
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    if (id > persons.length || id < 1) {
        res.status(404).end()
    }
    else {
        let person = persons.find((elem) => {
            return (elem.id === id)
        })
        res.json(person)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})