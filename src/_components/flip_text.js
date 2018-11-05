import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { flipTime } from "Source/constants";
import { cx } from "Source/utils";
import { cold } from 'react-hot-loader';
import "./flip_text.scss";

function FlipText({ text, delimiter = "" }) {
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
    <span className='FlipText-holder'>
      {text.split(delimiter).map((character, index) => character !== ' ' ? (
        <span key={index} className={cx("FlipText", { flip: flips[index] })}>
          {character}
        </span>
      ) : ' ')}
    </span>
  );
}

FlipText.propTypes = {
  text: PropTypes.string.isRequired,
  font: PropTypes.string.isRequired,
  delimiter: PropTypes.string
};

// TODO: Update when fixed: https://github.com/gaearon/react-hot-loader/issues/1088
export default cold(FlipText);
