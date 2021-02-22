const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
    res.status(200).json(posts);
});

app.post('/posts', async(req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = { //using shorthand syntax
        id,
        title
    };

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: { id, title } //using shorthand
    })

    res.status(201).json({ post: posts[id] });
});

app.post('/events', (req, res) => {
    console.log('Event: ', req.body.type);

    res.status(200).json({ status: 'OK' });
});



app.listen(PORT, console.log('Posts service is running on port: ', PORT));