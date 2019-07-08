import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import wretch from 'wretch';
import { withRouter } from 'react-router';
import './blog_post.scss';

const BlogPost = ({match}) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    wretch(`/assets/blog/posts/${match.params.name}.md`)
      .get()
      .text()
      .then(setContent);
  }, []);

  return (
    <div className="BlogPost">
      <Markdown source={content} />
    </div>
  );
};

BlogPost.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default withRouter(BlogPost);
