const express = require('express');
const path = require('path');
const fs = require('fs');
const BlogPost = require('./blog_post');
const normalizePosts = require('./scripts/normalize_blog_posts');

normalizePosts();

const port = process.env.PORT || 8080;
const app = express();

const __rootname = path.dirname(__dirname);

const resolveUrl = url => {
  const withoutLeadingSlash = url.length && url[0] == '/' ? url.slice(1) : url;
  return path.resolve(__rootname, withoutLeadingSlash);
}

const resolveFile = file => path.resolve(__rootname, file);

app.get(['/public/*', '/assets/*'], (req, res) => {
  var urlPath = resolveUrl(req.url);
  if (fs.existsSync(urlPath)) {
    res.sendFile(urlPath);
  }
});

app.get('/api/blog/posts', (req, res) => {
  BlogPost.find({}).exec((error, result) => {
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(result));
  });
})

app.get('*', (req, res) => {
  res.sendFile(resolveFile('public/index.html'));
});

app.listen(port);