# Styling: Take 1

Now that we have a navigational header up and running, let's do some work ditching the default styles and making it our own. I am writing this post waaaaay after I wrote the code, so I'm going to have try to fill in the blanks here. I believe that most of the commits since the last post contain boring CSS changes, but I have found a few interesting things that were introduced. 

## React Hooks
In Reach 16.8.0, Hooks were introduced with exposes a light-weight API for state management within a React component. Let's try this out by creating a simple component that we will call `FlipText`. This component will intuitively display a string, but it will have the additional functionality that it will reverse one of the characters every second or so. Let's start with the following skeleton component.

#### _components/flip_text.js
```
import React, { useState, useEffect } from "react";
import { classnames } from "Source/utils";
import "./flip_text.scss";

const FlipText = ({ text, additionalClass = "" }) => {
  return (
    <span className={classnames('FlipText-holder', additionalClass)}>
      {text}
    </span>
  );
};
```

This will be accompanied by some SASS.

#### _components/flip_text.scss
```
@import '../vars.scss';

.FlipText {
  -holder {}
}
```

The Hooks API exposes two new functions in the root React namespace, `useState`, and `useEffect` and these functions are how we implement hooks. The premise is:

- `useState`: Creates a lightweight state variable.
- `useEffect`: Provides a hook that's triggered on state changes.

For those familiar with pre-Hook React, "you can think of `useEffect` Hook as `componentDidMount`, `componentDidUpdate` and `componentWillUnmount` combined per the [React Docs](https://reactjs.org/docs/hooks-effect.html).

So, in order to implement the character-flip feature, we will create a state variable that holds an array of boolean values indicating whether each character is currently flipped.

```
const [flips, setFlips] = useState(Array(text.length).fill(false));
```

Note that the actual array variable is contained in `flips`, but `useState` also returns a second value `setFlips` which is a function and can be used to set the value of `flips` within the component lifecycle.

In order to manipulate this state, we will create an effect that intermittently flips a random byte in the array.

```
import { flipTime } from "Source/constants";

const randomFlip = () => {
  const index = Math.floor(Math.random() * text.length);
  const flipsCopy = flips.slice();
  flipsCopy[index] = !flipsCopy[index];
  setFlips(flipsCopy);
};

useEffect(() => {
  const factor = 1 + (Math.random() - 0.5) / 2; // To make things less predictable.
  const ticker = setTimeout(randomFlip, flipTime * factor);
  return () => clearTimeout(ticker);
}
```

There are two things to note in the above code. First, we call `randomFlip` within `useEffect`, which in turn calls `setFlips`. This create an update loop that will continually retrigger itself. Second, in `useEffect` the return value is a function that should be executed when the component unmounts and performs clean-up work -- here, we kill the current timeout to ensure that we don't run into reference errors later.

Next, we are going to write some of the necessary CSS to translate this state variable into the desired visual effect.

#### _components/flip_text.scss
```
@import '../vars.scss';

.FlipText {
  display: inline-block;
  transition: transform 0.5s;

  &-flip {
    transform: scaleX(-1);
  }

  &-holder {
    &:hover, &:active {
      > span {
        transform: unset;
      }
    }
  }
}
```

Two things are going on here. First, we have created a class `FlipText-flip` that reflects its contents horizontally. Second, we have added an override to this class that is triggered by `:hover` or `:active` so the user can actually read things if they desired.

Finally, we put it all together by updating the render to connect the state boolean variables up to the CSS classes.

#### _components/flip_text.js
```
import React, { useState, useEffect } from "react";
import { flipTime } from "Source/constants";
import { cx, classnames } from "Source/utils";
import "./flip_text.scss";

const FlipText = ({ text, delimiter = "", additionalClass = "" }) => {
  const [flips, setFlips] = useState(Array(text.length).fill(false));

  const randomFlip = () => {
    const index = Math.floor(Math.random() * text.length);
    const flipsCopy = flips.slice();
    flipsCopy[index] = !flipsCopy[index];
    setFlips(flipsCopy);
  };

  useEffect(() => {
    const factor = 1 + (Math.random() - 0.5) / 2;
    const ticker = setTimeout(randomFlip, flipTime * factor);
    return () => clearTimeout(ticker);
  });

  return (
    <span className={classnames('FlipText-holder', additionalClass)}>
      {text.split(delimiter).map((character, index) => character !== ' ' ? (
        <span key={index} className={cx("FlipText", { flip: flips[index] })}>
          {character}
        </span>
      ) : ' ')}
    </span>
  );
};
```

## Hamburger Header
The other big changes it seems that I made was to update the boring navigational header to be a hamburger menu that expands into a full-page overlay with some ssssexy animations (yes, I'm half snake). We are going to use Hooks again here as they are awesome for managing UI state (haven't tried with forms or application state yet). Since we just did this above, I'll be brief here and just show you the proverbial money.

#### _components/site_header.js
```
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import FlipText from "./flip_text";
import { cx } from "Source/utils";
import { rootItem, headerItems } from "Source/constants";
import "./site_header.scss";

const TitleHeaderItem = ({ title, path }) => (
  <div className="SiteHeader-title">
    <NavLink exact to={path} activeClassName="SiteHeader-navActive">
      <FlipText text={title} />
    </NavLink>
  </div>
);

const HeaderItem = ({ title, path, options, onClick }) => (
  <div
    onClick={() => setTimeout(onClick, 200)}
    className={cx("SiteHeader-item", options)}
  >
    <NavLink to={path} activeClassName="SiteHeader-navActive" className='SiteHeader-flip'>
      <FlipText text={title} additionalClass='SiteHeader-flip'/>
    </NavLink>
  </div>
);

const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <div className="SiteHeader">
      <div className="SiteHeader-list">
        <TitleHeaderItem {...rootItem} />
        <div className="SiteHeader-hamburger">
          <div className={cx("SiteHeader-hamburger-overlay", { open })}>
            {headerItems.map(item => (
              <HeaderItem key={item.title} onClick={toggleOpen} {...item} />
            ))}
          </div>
        </div>
        <div onClick={toggleOpen} className="SiteHeader-button">
          <span className={cx("SiteHeader-button-span", "top", { open })} />
          <span className={cx("SiteHeader-button-span", "bottom", { open })} />
        </div>
      </div>
    </div>
  );
};
```

When `open` is true, we show the overlay containing all of the header items. Regardless, we show a hamburger menu in the upper-right corner (but we adjust its styling when we over the overlay to make it look like its part of that component instead). Most of the heavy lifting here is done by the CSS.

#### _components/site_header.scss
```
@import '../vars';

.SiteHeader {
  position: relative;
  left: 0;
  right: 0;
  text-align: left;
  padding: 1rem;
  font-family: $font-accent;
  font-size: 4rem;
  user-select: none;

  &-navActive {
    color: $text-accent-light;
  }

  &-list {
    width: 100%;
    display: inline-flex;
  }

  &-title {
    padding: 1rem;
    flex-grow: 1;
  }

  &-button {
    z-index: 2;
    width: 5rem;
    text-align: right;
    padding: unset;
    position: relative;

    & > span:last-child {
      top: 3rem;
      left: 50%;
    }

    &:hover {
      span:first-child {
        top: 3rem;
      }

      span:last-child {
        top: 1.73rem;
      }
    }

    &-span {
      position: absolute;
      top: 1.73rem;
      left: 0;
      right: 0;
      height: 0.75rem;
      background: $text-accent-light;
      transition: all 0.5s;
      border-radius: 1rem;

      &-open {
        transform: rotate(-45deg);
        background: $text-accent-dark;
      }
    }

  }

  &-hamburger {

    &-overlay {
      position: fixed;
      top: -100%;
      left: 0;
      right: 0;
      height: 100%;
      background: $text-primary;
      color: $background-primary;
      transition: top 0.5s;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      z-index: 1;

      &-open {
        top: 0;
      }
    }
  }

  &-item {
    padding: 1rem;
    margin-left: 0.5rem;
    position: relative;
    color: $background-primary;

    &:before {
      display: block;
      content: '';
      background: $background-primary;
      position: absolute;
      padding: 0;
      top: 0;
      left: 0;
      bottom: 0;
      width: 0;
      z-index: -1;
      transition: width 0.5s;
    }

    &:after {
      display: block;
      content: '';
      background: $background-primary;
      position: absolute;
      padding: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 0;
      z-index: -1;
      transition: width 0.5s;
    }

    &:hover, &:active {
      color: $border-primary;

      &:before, &:after {
        width: 50%;
      }
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

  &-flip {
    display: inline-block;
    z-index: 1;
    width: 100%;
  }
}
```

And voila! Things look a lot more unique now... for better or for worse.

[image](/assets/blog/images/styling_take_1.png)