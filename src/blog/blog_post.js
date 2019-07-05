import React from "react";
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { postProvider }  from './post_provider';
import { withRouter } from 'react-router';
import './blog_post.scss';

const BlogPost = ({match}) => (
  <div className="BlogPost">
    <Markdown source={postProvider(match.params.name)} />
  </div>
);

BlogPost.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

export default withRouter(BlogPost);
