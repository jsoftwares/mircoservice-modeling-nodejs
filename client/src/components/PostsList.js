import React, {useState, useEffect} from 'react';
import axios from 'axios';
import CommentList from './CommentList';
import CommentCreate from './CommentCreate';

export default () => {

    const [posts, setPosts] = useState({});

    const fetchPosts = async() => {
        const res = await axios.get('http://127.0.0.1:4002/posts');
        setPosts(res.data.posts);
    }

    useEffect( () => {
        fetchPosts();
    }, []);

    //Object.values() takes all values inside an object & converts to an arrays
    const renderedPosts = Object.values(posts).map( post => {
        return (
            <div key={post.id} className="card" style={{width:'30%', marginBottom:'20px'}}>
                <div className="card-header"><h3>{post.title}</h3></div>
                <div className="card-body">
                    <CommentList comments={post.comments} />
                    <CommentCreate postId={post.id} />
                </div>
                
            </div>
        );
    });
  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
        {renderedPosts}
    </div>
  );
};