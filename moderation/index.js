const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT || 4003;

app.use(bodyParser.json());


app.post('/events', async(req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.toLowerCase().includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://127.0.0.1:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                content: data.content,
                status
            }
        });
    }

    res.status(200).json({ status: 'Ok' });
});

app.listen(PORT, () => console.log('Moderation service is running on port: ', PORT));