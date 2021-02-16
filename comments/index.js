const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    //an object with arrays of comments(objects)
    res.status(200).json({ comments: commentsByPostId[req.params.id] || [] });
});


app.post('/posts/:id/comments', async(req, res) => {

    commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    comments = commentsByPostId[req.params.id] || [];
    // Append a new comment object to the post comments array
    comments.push({ id: commentId, content, status: 'pending' });
    commentsByPostId[req.params.id] = comments; //update the post updated comments array

    await axios.post('http://127.0.0.1:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });

    res.status(201).json({ comments });
});

app.post('/events', async(req, res) => {

    console.log('Event: ', req.body.type);

    const { type, data } = req.body;
    if (type === 'CommentModerated') {
        const { id, postId, content, status } = data;

        //get array of all comments for the postID
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id
        });

        comment.status = status;

        await axios.post('http://127.0.0.1:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                content,
                status
            }
        });
    }

    res.status(200).json({ status: 'OK' });
});



app.listen(PORT, console.log('Comments service is running on port: ', PORT));