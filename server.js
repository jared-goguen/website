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

app.get('api/blog/posts', (req, res) => {
  const files = fs.readdirSync('assets/blog/posts');
  const posts = files.map(getBaseName);
  res.setHeader('content-type', 'application/json');
  res.send(JSON.stringify({posts}));
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(port);