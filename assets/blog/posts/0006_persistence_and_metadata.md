# Persistence and Metadata

Right now, our page that displays the list of blog posts just shows a bunch of filenames, e.g. `header_and_router` and `serving_files`. We want to enrich this page in the following ways:

1) Posts should be ordered from newest to oldest.
2) Posts should be numbered.
3) Posts should have a title.
4) Posts should have an excerpt. 

This seems like a fine starting schema. There are other fields we could add like author or category tags, but these fields will do for our initial implementation. The big question here is "how do we associate metadata with our posts?"

We essentially want a document store here and between Node.js implementations and Heroku support, it seems like [MongoDB](https://www.mongodb.com/) through [mLab](https://www.mlab.com/home) will be the lightest lift and it seems like the free Sandbox package will be fine for us. 

This seems like a good enough architectural choice as we are using MongoDB for what it's designed for and, since we are not worried about scale in the slightest, we really can't go wrong picking a technology here. Honestly, we could store the required data in a .csv file and not suffer from that solution for a bit, but manually maintaining a .csv file is too messy for even my tastes.

The one downside of MongoDB is effect that the lack of schema has on the readability of the code written to interact with it. For example, if we pull a record for a blog post from MongoDB, can we be guaranteed that it has a title field? Do we have to explicitly check for each field before using it? Will code completion handle this at all? To avoid these issues, we are also going to [mongoose][https://mongoosejs.com/] to let us define schemas for our data.

```
npm install mongodb --save
npm install mongoose --save
```

Wait a second here, will this cause our `bundle.js` to increase in size? Looking at the build size, it appears that Webpack does not bundle this just because it's in the `dependencies` section which is good news. Our `bundle.js` is already a little larger than idea, so we will revisit this at some point regardless.

While we are going to use mLab for running MongoDB in production, we also want to be running a local instance to help with development and debugging. On macOS, we can do the following:

```
brew tap mongodb/brew
brew install mongodb-community@4.0
brew services start mongodb-community@4.0
```

This starts up `mongod` as a macOS service. It looks like it uses a trivial amount of resources, so I'm okay with running this as a service so I don't have to manually run `mongod --config /usr/local/etc/mongod.conf` every time I want to start the server up. Now, we can create our database on the default port of 27017.

```
mongo
```

We will also create a small wrapper around this library so that the connection string only needs to exist in one place.

#### server/mongcon.js
```
const mongoose = require ("mongoose");

const url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017';
mongoose.connect(url);

module.exports = exports = mongoose;
```

My methodology when developing, especially with libraries that I have never used before, is that I always want to get something on the screen showing progress. So, we are going to create a simple module that just creates and delete entries so that we can verify that everything is working right before getting to far into the weeds.

#### server/blog_post.js
```
const mongcon = require('./mongcon');

const root = '/assets/blog/posts'; 

// This is our Schema. Note the use of `get` on the path so that we can return a fully-qualified
// path back to the client in order to drive HATEOAS. We don't want to hard-code URLs in the client
// unless there is a significant cost in providing them from the server. In this case, the cost is
// practically zero.
const blogPostSchema = new mongcon.Schema({
  id: { type: Number, min: 1},
  title: { type: String},
  date: { type: Date },
  file: { 
    type: String,
    get: value => `${root}/${value}.md`
  }
});

const BlogPost = new mongcon.model('BlogPost', blogPostSchema);
modules.exports = exports = BlogPost;


/* TEST: Everything below should be deleted once it is verified that the above code works. */

const testPost = new BlogPost({
  id: 1,
  title: "Test Post",
  date: new Date(),
  file: "test_post"
});

// We will be passing this callback to the save functionality. Note that the call to `drop` is
// to clean up after ourselves -- we will want to use `id: 1` for a real blog post or find a way 
// of auto-incrementing this.
const checkDb = () => {
  BlogPost.find({}).exec((err, results) => {
    if (!err) {
      console.log(results);
      console.log("\n" + results[0].path);
      BlogPost.collection.drop();
    } else {
      console.log(err);
    }
  });
}

testPost.save(checkDb);
```

If we run this script using `node server/blog_post.js`, our output looks as we would expect it.
```
[ { _id: 5d20e4e24d33bf2ca83ad306,
    id: 1,
    title: 'Test Post',
    date: 2019-07-06T18:13:54.389Z,
    path: 'test_post',
    __v: 0 } ]

/assets/blog/posts/title_post.md
```

Awesome, we have a model up-and-running locally, but this test isn't really suitable to test our production setup. Eventually, we will want a mechanism so that posts can be created and submitted on the website itself. But, until this exists, we will write a small, awful script to keep our database in sync with the files in the `assets/blog/posts` directory. This script will do the following:

1) Search the database for existing posts.
2) Compare this list to the file names in `assets/blog/posts`.
3) Create new entries for all items not found in the database.

We will write this script in a separate directory as it may be useful to restore the database from a corrupted state in the future, and we will call this script from the main server entry point. I briefly thought about whether this script should be run as a background job, but since it's only temporary and Heroku has limits on how many dynos you can use, it seems like that solution would add significant complexity without value.

#### server/scripts/normalize_blog_posts.js
```
const path = require('path');
const fs = require('fs');
const BlogPost = require('../blog_post');

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const addPost = async file => {
    const parts = file.split('_');
    const id = Number.parseInt(parts.shift());

    const title = parts.map(capitalize).join(' ');

    const relativeFile = `../../assets/blog/posts/${file}.md`
    const stats = fs.statSync(path.resolve(__dirname, relativeFile))
    const date = stats.birthtime;

    const post = new BlogPost({id, title, date, file});
    await post.save();
}

const normalizePosts = async () => {
    const posts = await BlogPost.find({});
    const postFiles = new Set(posts.map(post => path.basename(post.file, '.md')));

    const filesWithExtensions = fs.readdirSync(path.resolve(__dirname, '../../assets/blog/posts'));
    const files = filesWithExtensions.map(file => path.basename(file, '.md'));

    for (const file of files) {
        if (!postFiles.has(file)) {
            await addPost(file);
        }
    }
};

module.exports = exports = normalizePosts;
```

Now that we have a method to make sure we have entries in our database before we have a good mechanism of creating them, we will update `server.js` to call this script and then update the endpoint to reference our newly created model.

#### server/server.js
```
const express = require('express');
const path = require('path');
const fs = require('fs');
const normalizePosts = require('./scripts/normalize_blog_posts');

normalizePosts();

// ...

app.get('/api/blog/posts', (req, res) => {
  BlogPost.find({}).exec((error, result) => {
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(result));
  });
})

// ...
```

But, now that we are returning a different schema from this endpoint, we also need to update the frontend to handle a response with this shape. And, while we're at it, let's make things look a little nicer.

#### client/blog/blog.js
```
import React, { useState, useEffect } from "react";
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
```

#### client/blog/blog.scss
```
@import 'Client/vars.scss';

.Blog {
  font-family: $font-accent4;

  &-snippet {
    position: relative;
    display: block;
    padding: 0.5em;
    border: 1px solid;
    margin: 0.5em;
    text-align: center;
    border-radius: 0.25em;
    color: $text-accent-light;
    background: $text-accent-dark;
    border-color: $text-primary;
    
    &:hover, &:active {
      color: $text-primary;
      border-color: $text-accent-light;
    }

    &-id {
      position: absolute;
      top: 0.25em;
      left: 0.25em;
      font-size: 0.75em;
      color: $text-secondary;
    }

    &-date {
      position: absolute;
      bottom: 0.5em;
      right: 0.5em;
      font-size: 0.5em;
      color: $text-primary;
    }
  }
}
```

While this was a relatively long post, we got a lot done. The mechanism for persisting data in the backend and being able to serve it to the frontend opens up a lot of possibilities. However, we also introduced a good amount of technical debt: our frontend and backend are too tightly coupled, and all of our blog styles are awful.

![image](/assets/blog/images/persistence_and_metadata.png)