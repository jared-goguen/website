## Serving Files

In the last post, we used `raw-loader` in order to include our Markdown in our Webpack build and then `react-markdown` to render these files after stringifying them. This was accompanied with a comment about how cheap this solution was but it would do until a more scalable solution was justified. Well, the time is nigh -- less than twenty-four hours later. 

In the interest of having more material for future blog posts, we are again going to opt for a relatively cheap solution. We are going to set-up our Express server to allow file requests in our `/assets/` path and create a quick JSON API endpoint to return a list of blog post names (so that we know what to request for files).

#### server.js
```
const express = require('express');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 8080;
const app = express();

const resolveUrl = url => {
  const withoutLeadingSlash = url.length && url[0] == '/' ? url.slice(1) : url;
  return path.resolve(__dirname, withoutLeadingSlash);
}

const getBaseName = path => path.split(/(\\|\/)/g).pop().split(/\./g).shift();

app.get(['/public/*', '/assets/*'], (req, res) => {
  var urlPath = resolveUrl(req.url);
  if (fs.existsSync(urlPath)) {
    res.sendFile(urlPath);
  }
});

app.get('/blog/posts', (req, res) => {
  const files = fs.readdirSync('assets/blog/posts');
  const posts = files.map(getBaseName);
  res.setHeader('content-type', 'application/json');
  res.send(JSON.stringify({posts}));
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(port);
```

Now, we just have to hook up our `Blog` component to retrieve the list of post names via an AJAX call, we will use [wretch](https://github.com/elbywan/wretch) -- a light-weight wrapper around `fetch` that smoothes out some of the pain points.

```
npm install --save wretch
```

#### blog/blog.js
```
import React, { useState, useEffect } from "react";
import wretch from 'wretch';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import './blog.scss';

const Blog = () => {
  const [postNames, setPostNames] = useState([]);

  useEffect(() => {
    wretch('/blog/posts')
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
```

One **really** important piece of this code, is the second argument of `[]` to `useEffect`. This parameter is used to determine which state variables that the effect should listen to (i.e. be triggered on change). Without this, the effect will default to listening to all properties and thus any call to a `set` function will trigger an infinite loop. To mirror the behavior of `componentDidMount`, we pass the empty list so that the effect is only trigger once after the component mounts.

We will use a similar approach with the `BlogPost` component as well.
```
import React, { useState, useEffect } from "react";
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

export default withRouter(BlogPost);
```

We obviously have a lot of work to do on the server-side. In particular, we have no good way of attaching metadata to the blog posts. In essence, we want a document store of some sort, so we will probably oft for a NoSQL solution, but that's another blog post for another day!