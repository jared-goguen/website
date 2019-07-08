import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import wretch from 'wretch';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import './blog.scss';

const BlogPostSnippet = ({id, title, date, file}) => (
  <Link to={`posts/${file}`}>
    <div className="Blog-snippet">
      {title}
      <span className="Blog-snippet-id">Post {id}</span>
      <span className="Blog-snippet-date">{date}</span>
    </div>
  </Link>
);

BlogPostSnippet.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  date: PropTypes.date,
  file: PropTypes.string
};

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    wretch('/api/blog/posts')
      .get()
      .json()
      .then(setPosts)
  }, []);

  return (
    <div className="Blog">
    {posts.map(post =>
      <BlogPostSnippet key={post.id} {...post} />
    )}
  </div>
  );
};

export default withRouter(Blog);
