import React, { useState, useEffect } from "react";
import wretch from 'wretch';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import './blog.scss';

const Blog = () => {
  const [postNames, setPostNames] = useState([]);

  useEffect(() => {
    wretch('api/blog/posts')
      .get()
      .json()
      .then(({posts}) => setPostNames(posts))
  }, []);

  return (
    <div className="Blog">
    {postNames.map(name =>
      <Link key={name} to={`posts/${name}`}>{name}</Link>
    )}
  </div>
  );
};

export default withRouter(Blog);
