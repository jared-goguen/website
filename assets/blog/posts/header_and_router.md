The first addition to our blank-slate website will be a navigational header that uses [**React Router**](http://reacttraining.com/react-router) to allow for window location bar navigation and history within our single-page application.

```
npm install --save react-router-dom
```

We are also going to be filling out our source code directory some.

- _src_
  - __components_
    - site_header.js
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
  
First, we will stub out some pages to route to.

#### blog/blog.js
```
import React from 'react';
export default const Blog = () => <div>Blog</div>;
```

#### contact/contact.js
```
import React from 'react';
export default const Contact = () => <div>Contact</div>;
```

#### projects/projects.js
```
import React from 'react';
export default const Projects = () => <div>Projects</div>;
```

#### home/home.js
```
import React from 'react';
export default const Home = () => <div>Home</div>;
```

Now, we are going to abstract all of our header information into a constants file.

#### constants.js
```
import Home from './home/home';
import Projects from './projects/projects';
import Blog from './blog/blog';
import Contact from './contact/contact';

export const rootItem = {
  title: 'jared goguen | explore',
  path: '/',
  component: Home,
};

export const headerItems = [
  {
    title: 'projects',
    path: '/projects/',
    component: Projects,
    options: {}
  }, {
    title: 'blog',
    path: '/blog/',
    component: Blog,
    options: {}
  }, {
    title: 'contact',
    path: '/contact/',
    component: Contact,
    options: {
      border: true
    }
  }
];
```

We are also going to add our first function into our utility file.

#### utils.js
```
export const cx = (baseClass, ...rest) => {
  const classes = [baseClass];

  for (const argument of rest) {
    const type = typeof argument;

    if (type === 'object') {
      for (const key in argument) {
        if (argument.hasOwnProperty(key) && argument[key]) {
          classes.push(`${baseClass}-${key}`);
        }
      }
    } else if (type === 'string' || type === 'number') {
      classes.push(`${baseClass}-${argument}`);
    }
  }

  return classes.join(' ');
};
```
 
This is my replacement for [classnames](https://github.com/JedWatson/classnames). The major difference is that the above function accepts a first argument and creates a string with SUIT classnames. For example, the call `cx('Foo', {bar: true})` would return the string `Foo Foo-bar`.

Now we can use these items to generate the navigational header.

#### _components/site_header.js
```
import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { cx } from "Source/utils";
import { rootItem, headerItems } from "Source/constants";
import "./site_header.scss";


const TitleHeaderItem = ({ title, path }) => (
  <div className="SiteHeader-title">
    <NavLink exact to={path} activeClassName="SiteHeader-navActive">
      {title}
    </NavLink>
  </div>
);

TitleHeaderItem.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired
};


const HeaderItem = ({ title, path, options }) => (
  <div className={cx("SiteHeader-item", options)}>
    <NavLink to={path} activeClassName="SiteHeader-navActive">
      {title}
    </NavLink>
  </div>
);

HeaderItem.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  options: PropTypes.shape({
    border: PropTypes.bool
  })
};

HeaderItem.defaultProps = {
  options: {}
};


export default const SiteHeader = () => (
  <div className="SiteHeader">
    <div className="SiteHeader-list">
      <div className="SiteHeader-title-holder">
        <TitleHeaderItem {...rootItem} />
      </div>
      <div className="SiteHeader-item-holder">
        {headerItems.map(item => <HeaderItem key={item.name} {...item} />)}
      </div>
    </div>
  </div>
);
```

Notice that use of the `<NavLink>` component in the header items. This component not only sends a path to the router, it also contains some state so that it will add the active class when the current path matches the path of the header item. 

The above component gives structure to our header. Before adding style, we are going to create a SASS file to group together some theme colors.

#### vars.scss
```
$text-primary: #fff;
$text-accent-light: #63ffae;
$text-accent-dark: #0a6860;
$background-primary: #282c34;
$border-primary: #d9d9d9;
```

Now, styling the header...

#### _components/site_header.scss
```
@import '../vars';

.SiteHeader {
  padding: 1rem;
  
  &-navActive {
    color: $text-accent-light;
  }

  &-list {
    width: 100%;
    display: inline-flex;
  }

  &-title {
    padding: 1rem;

    &-holder {

    }
  }

  &-item {
    display: inline-flex;
    padding: 1rem;
    margin-left: 0.5rem;

    &:hover, &:active {
      color: $border-primary;
    }

    &-holder {
      display: block;
      text-align: right;
      flex-grow: 1;
    }

    &-border {
      border: 1px solid $border-primary;

      &:hover, &:active {
        background: $border-primary;
        color: $background-primary;

        a.SiteHeader-navActive {
          color: $text-accent-dark
        }
      }
    }
  }
}
```

And our component is complete. Now, we have to update the root of the application to provide a router, display the header, and link up some routes with some components.

#### App.js
```
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import SiteHeader from "./_components/site_header";
import { rootItem, headerItems } from "./constants";
import "./App.scss";

const App = () => (
  <BrowserRouter>
    <div className="App">
      <SiteHeader />
      <Route exact path={rootItem.path} component={rootItem.component} />
      {headerItems.map(({path, component}) => (
        <Route key={path} path={path} component={component} />
      ))}
    </div>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('app'));
```

For good measure, we are going to extend on the style from the original page.

#### App.scss
```
@import 'vars';

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
  "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
  monospace;
}

a {
  color: inherit;
  text-decoration: unset;
}

.App {
  text-align: center;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  color: $text-primary;
  background-color: $background-primary;
}
```

And now we have a navigational header that links to sub-pages in our application!

[image](Assets/blog/images/header_and_router.png)
