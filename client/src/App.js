import PostList from './components/PostsList';
import PostCreate from './components/PostCreate'

export default () => {
  return (
    <div className="container">
        <h1>Create Post</h1>
        <PostCreate />
        <hr />
        <h1>Posts</h1>
        <PostList />
    </div>
  );
};
