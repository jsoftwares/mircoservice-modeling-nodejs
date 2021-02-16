const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4005;

app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event);
    axios.post('http://127.0.0.1:4000/events', event);
    axios.post('http://127.0.0.1:4001/events', event);
    axios.post('http://127.0.0.1:4002/events', event);
    axios.post('http://127.0.0.1:4003/events', event);

    res.status(200).json({ status: 'OK' });
});

// Send all events that has ever been emitted by this bus
app.get('/events', (req, res) => {
    res.status(200).json(events);
});

app.listen(PORT, () => console.log('Event bus is running on port: ', PORT));