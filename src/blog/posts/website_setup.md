### Website Setup

Welcome! This is the introductory post to this blog (and is in fact being written before any of the blog functionality has been created).

This blog is meant to accompany [my personal website](jaredgoguen.com) to detail how it has been created from the ground up, which necessitates writing this particular post anachronistically.

For the technology stack, I am using the following:

- [React.js](reactjs.com) - Frontend UI
- [React Router](reacttraining.com/react-router) - For Navigation with a SPA structure 
- [webpack](webpack.js.org) - For Transpiling, Bundling, and Asset Mapping
- [Express.js](expressjs.com) - Backend Server

I am building this package as a [Heroku App](heroku.com) and using [Google Domains](domains.google.com) as a DNS.

For the website, we will need two main folders to start with _`/assets/`_ for the various static assets and _`/src/`_ for all of the code. We will be using co-located SASS and presentational components will be located in a sub-folder titled _`/_components/`_. The starting file structure is shown below.

- _assets_
  - logo.svg
- _src_
  - __components_
    - **site_header.js**
    - site_header.scss
  - _blog_
    - blog.js
  - _contact_
    - contact.js
  - _home_
    - home.js
  - _projects_
    - projects.js
  - App.js
  - App.scss
  - constants.js
  - utils.js
  - vars.scss
- **.babelrc**
- **.env**
- **.eslintrc**
- **.gitignore**
- **package.json**
- **server.js**
- **webpack.common.js**
- **webpack.dev.js**
- **webpack.prod.js**

The files bolded above in the root directory are used to setup the project configuration. We will go over the content of these files one-by-one.

##### package.json

```
{
  "name": "website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "webpack-dev-server --hot --config webpack.dev.js",
    "start": "node server.js",
    "build": "webpack --config webpack.prod.js",
    "heroku-prebuild": "npm install --dev",
    "heroku-postbuild": "npm run-script build"
  },
  "dependencies": {
    "express": "^4.16.4",
    "prop-types": "^15.6.2",
    "react": "^16.4.1",
    "react-dom": "^16.4.1"
    "react-router-dom": "^4.3.1"
  },
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "babel-plugin-transform-object-rest-spread": "^6.26.0",
    "babel-polyfill": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "classnames": "^2.2.6",
    "clean-webpack-plugin": "^0.1.19",
    "css-loader": "^1.0.0",
    "eslint": "4.19.1",
    "eslint-plugin-import": "^2.14.0",
    "eslint-plugin-node": "^8.0.0",
    "eslint-plugin-promise": "^4.0.1",
    "eslint-plugin-react": "^7.11.1",
    "eslint-plugin-standard": "^4.0.0",
    "html-webpack-plugin": "^3.2.0",
    "html-webpack-template": "^6.2.0",
    "node-sass": "^4.9.1",
    "react-hot-loader": "^4.3.3",
    "react-svg-loader": "^2.1.0",
    "sass-loader": "^7.0.3",
    "style-loader": "^0.21.0",
    "uglifyjs-webpack-plugin": "^1.2.7",
    "url-loader": "^1.1.2",
    "webpack": "^4.15.1",
    "webpack-cli": "^3.0.8",
    "webpack-dev-server": "^3.1.0",
    "webpack-merge": "^4.1.3"
  }
}
```

This file not only lists out the project's dependencies, but scripts can be defined here. To cover the dependencies:

###### dependencies
- **express** - Runs a HTTP server
- **prop-types** - Library from specifying the props of React components
- **react** - Base React library
- **react-dom** - Base React library DOM extension (used to mount the application)
- **react-router-dom** - Library used to link routes in the location bar to components that we want to mount

###### devDependencies
Most of these dependencies are packages that are used by webpack in the transpilation process or eslint to supplement the default warnings. Only the noteworthy dependencies are commented on below.
- **classnames** - QoL library for adding the className to React components
- **webpack-dev-server** - Runs a development server capable of hot reloading React components
- **webpack-merge** - Package that allows for multiple webpack configuration files to be merged; this allows separate development and production webpack configurations to be cleanly separated.

###### scripts

**dev**: webpack-dev-server --hot --config webpack.dev.js
- Starts a development server on *localhost* using the development configuration with hot reloading enabled.

**start**: node server.js
- Starts the Express server. *This script is automatically called by Heroku.*

**build**: webpack --config webpack.prod.js
- Bundles all code and assets using the production configuration.

**heroku-prebuild**: npm install --dev
- Installs all development dependencies in the Heroku pre-build phase.

**heroku-postbuild**: npm run-script build
- Instructs Heroku to construct the production bundle before launching the Express server.