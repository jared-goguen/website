# Website Setup

Welcome! This is the introductory post to this blog (and is in fact being written before any of the blog functionality has been created).

This blog is meant to accompany [my personal website](http://jaredgoguen.com) to detail how it has been created from the ground up, which necessitates writing this particular post anachronistically.

For the technology stack, I am using the following:

- [React.js](http://reactjs.com) - Frontend UI
- [webpack](http://webpack.js.org) - For Transpiling, Bundling, and Asset Mapping
- [Express.js](http://expressjs.com) - Backend Server

I am building this package as a [Heroku App](http://heroku.com) and using [Google Domains](http://domains.google.com) as a DNS.

For the website, we will need two main folders to start with _`/assets/`_ for the various static assets and _`/client/`_ for all of the code. The starting file structure is shown below.

- _assets_
  - logo.svg
- _client_
  - App.js
  - App.scss
- **.babelrc**
- **package.json**
- **server.js**
- **webpack.common.js**
- **webpack.dev.js**
- **webpack.prod.js**

The files list in bold above in the root directory are used to setup the project configuration. We will go over the content of these files one-by-one.

#### package.json

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
    "react": "^16.4.1",
    "react-dom": "^16.4.1"
  },
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "babel-plugin-transform-object-rest-spread": "^6.26.0"
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
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
- **react** - Base React library
- **react-dom** - Base React library DOM extension (used to mount the application)

###### devDependencies
Most of these dependencies are packages that are used by webpack in the transpilation process or eslint to supplement the default warnings. Only the noteworthy dependencies are commented on below.
- **webpack-dev-server** - Runs a development server capable of hot reloading React components
- **webpack-merge** - Package that allows for multiple webpack configuration files to be merged; this allows separate development and production webpack configurations to be cleanly separated.

###### scripts

**dev**: webpack-dev-server --hot --config webpack.dev.js
- Starts a development server on *localhost* using the development configuration with hot reloading enabled.

**start**: node server.js
- Starts the Express server. *This script is automatically called by Heroku.*

**build**: webpack --config webpack.prod.js
- Bundles all code and assets using the production configuration.

**heroku-postbuild**: npm run-script build
- Instructs Heroku to construct the production bundle before launching the Express server. Since bundling is now integrated into the Heroku deploy process, we should never have to do this manually.

This covers **package.json**, it makes sense to cover the webpack configurations next.

#### webpack.common.js

```
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  entry: {
    app: './client/App.js'
  },
  plugins: [
    new CleanWebpackPlugin(['public']),
    new HtmlWebpackPlugin({
      title: 'jared goguen | explore',
      favicon: 'assets/logo.svg',
      inject: false,
      template: require('html-webpack-template'),
      appMountId: 'app'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'assets'),
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }, {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }, {
        test: /\.svg$/,
        use: {
          loader: 'react-svg-loader'
        }
      }, {
        test: /\.(jpg|png)$/,
        loader: 'url-loader'
      }
    ]
  }
};
```

This is the common webpack file that contains the configuration options that are shared by both the development and production builds.

```
target: web
```
Specifies that we our bundle is targeting a web/browser environment.

```  
entry: {
  app: './client/App.js'
}
```
The entry point of the application.
 
```
plugins: [
  new CleanWebpackPlugin(['public']),
  new HtmlWebpackPlugin({
    title: 'jared goguen | explore',
    favicon: 'assets/logo.svg',
    inject: false,
    template: require('html-webpack-template'),
    appMountId: 'app'
  })
]
```
A list of plugins to run. `CleanWebpackPlugin` clears out the build directory before rebuilding. `HtmlWebpackPlugin` creates a simple *index.html* page to mount the App in.

```
output: {
  path: path.resolve(__dirname, 'public'),
  filename: 'bundle.js'
}
```
Specifies the output path of the bundle.

```
resolve: {
  alias: {
    Assets: path.resolve(__dirname, 'assets'),
  },
  extensions: ['.js', '.jsx']
}
```
 `extensions` specifies the file extensions that will be automatically be checked when importing. This allows these extensions to be omitted when importing. `alias` allows for path aliases to be created; this is particularly useful for assets in this project to avoid imports like `../../../a/b`.

```
module: {
  rules: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.s?css$/,
      exclude: /node_modules/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'sass-loader' }
      ]
    }, {
      test: /\.svg$/,
      use: {
        loader: 'react-svg-loader'
      }
    }, {
      test: /\.(jpg|png)$/,
      loader: 'url-loader'
    }
  ]
}
```
`rules` specify the webpack loaders that should be used to link different types of files.

#### webpack.dev.js

```
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    hot: true
  },
  output: {
    publicPath: 'http://localhost:8080'
  },
});
```
This file specifies settings for the development server and the development source maps.

#### webpack.prod.js

```
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
```
This file specifies that the bundle should be uglified and the production source maps.

#### .babelrc

```
{
  "presets": ["env", "react"],
  "plugins": [
    "transform-object-rest-spread",
    "transform-class-properties",
    "react-hot-loader/babel"
  ]
}
```
The hot loader is required to allow the development server to hot-reload. The other plugins enable some useful syntax.

#### server.js

```
const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(port);
```
This bare-bones Express server just serves the *index.html* that is created by the webpack build process. This file is already linked to the bundle.

With these configuration files, we can run either `npm run-script dev` to start the development server. Or, we could push the repo to Heroku and it would bundle up our code and assets and start the Express server. To test this out, we will create a simple application.

#### App.js
```
import React from "react";
import ReactDOM from "react-dom";
import Logo from "Assets/logo.svg";
import "./App.scss";

const App = () => (
  <div className="App">
    <Logo className="App-logo" />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
```

#### App.scss
```
.App {
  height: 100vh;
  width: 100vw;
  background-color: #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &-logo {
    height: 40vmin;
  }
```

If we steal *logo.svg* from `create-react-app`, we will have close to recreated their default setup, expect we have control over the build process and can readily deploy to Heroku.

![image](/assets/blog/images/website_setup.png)