import React from "react";
import { blogPostNames } from './post_provider';
import { postsPath } from 'Source/constants';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import './blog.scss';

const Blog = () => (
  <div className="Blog">
    {blogPostNames.map(name => 
      <Link key={name} to={`${postsPath}/${name}`}>{name}</Link>
    )}
  </div>
);

export default withRouter(Blog);
