## Enabling Markdown

In this episode, we are going to figure out how to actually get all these blog posts that have been collecting dust in the `assets` directory actually rendered on the website. Once this is complete, we will be at full self-reference status so that future commits will be accompanied by a blog post explaining how I did what I did (let's leave the "why" for philosophers).

There is some small irony is that this file is named `enabling_markdown.md` but yet we have no way of either serving or rendering Markdown on the site yet. Here are my initial thoughts on a solution to this:

> If we can translate a Markdown file into a React component, then we have a mechanism for both serving and rendering this content.

Google yields a few packages that seem like they could help with this. Of these, [react-markdown](https://rexxars.github.io/react-markdown/) stood out. The usage looks something like this:

```
<ReactMarkdown source={markdownString} />
```

The issue with this is that we are saving our blog posts in separate files and we are not going to be pasting an entire Markdown file into a React component. So, we need to file a way of loading a local file as a string. It seems like we should be able to dynamically import text using the `raw-loader` webpack plugin, so let's try to create a wrapper around `ReactMarkdown` that resolve the input string from a provided path.

```
npm install raw-loader --save-dev
npm install react-markdown --save-dev
```

#### webpack.common.js
```
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(md|txt)$/,
        loader: 'raw-loader'
      }
    ]
  }
};
```

#### blog/blog.js
```
import React from "react";
import Markdown from "react-markdown";
import string from "Assets/blog/posts/enabling_markdown.md";
import './blog.scss';

const Blog = () => (
  <div className="Blog">
    <Markdown source={string} />
  </div>
);

export default Blog;
```

This proves that `raw-loader` combined with `react-markdown` can render Markdown in a React component; however, we have hard-coded the path here and this is going to be a pain point. Can React dynamically import a module? How would dynamic path resolution interact with webpack? 

To address these questions, we will opt for a hacky solution for now and reassess later. To get around the dynamic import issue, we will create a module that imports all of the blog posts and can be called to retrieve them. To enable Babel to transpile the `import()` statement and work with `async/await` statements, we will add the following:

```
npm install --save-dev babel-polyfill
npm install --save-dev babel-plugin-syntax-dynamic-import
npm install --save-dev babel-plugin-transform-runtime
```

#### .babelrc
```
{
  // ...
  "plugins": [
    // ...
    "syntax-dynamic-import",
    ["transform-runtime", {"regenerator": true}]
  ]
}
```

#### webpack.common.js
```
// ...

module.exports = {
  // ...
  entry: {
    app: ['babel-polyfill', './src/App.js']
  },
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(md|txt)$/,
        loader: 'raw-loader'
      }
    ]
  }
};

```

Now, we can create a module composed of a couple of quick functions to deal with routing and retrieving the text of blog posts. Having blog posts loaded in as modules clearly isn't a "good" solution, but it will work for now.

#### blog/post_provider.js
```
export const blogPostNames = [
    'website_setup',
    'header_and_router',
    'styling_take_1',
    'enabling_markdown'
];

const blogPosts = {};
blogPostNames.forEach(async name => {
    const module = await import(/* webpackMode: "eager" */ `Assets/blog/posts/${name}.md`)
    blogPosts[name] = module.default;
});

export const postPath = 'posts';

export const postProvider = name => blogPosts[name];
```

Tying this altogether in a couple of React components:

#### blog/blog_post.js
```
import React from "react";
import Markdown from 'react-markdown';
import postProvider from './post_provider';
import './blog_post.scss';

const BlogPost = (name) => (
  <div className="BlogPost">
    <Markdown source={postProvider(name)} />
  </div>
);
```

Now, it isn't pretty and we have a lot of work making both of these look good and tweaking how blog posts are displayed, but we have some more important things to do. Also, when our server gets to be a little more mature, we will switch over to serving the blog posts directly. Right now, the routing is broken and navigating to the `/blog/` route directly in the address bar results in a 404 which makes testing CSS changes a real nightmare. After that, we will have to figure out how to resolve static files.

[image](/assets/blog/images/enabling_markdown.png)