const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT || 4002;

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        posts[postId].comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id
        });

        comment.status = status;
        comment.content = content;
    }
}



app.get('/posts', (req, res) => {
    console.log(posts);
    res.status(200).json({ posts });
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data)

    res.status(201).json({ status: 'OK' });
});


app.listen(PORT, async() => {
    console.log('Query service is running on port: ', PORT);

    // Once server is up we make a query to the Event bus to get a list of all events that has been emitted so far
    //& store them in Query services

    const res = await axios.get('http://127.0.0.1:4005/events');
    for (let event of res.data) {
        console.log('Processing event: ', event.type);
        handleEvent(event.type, event.data);
    }
});