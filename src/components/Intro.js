import React from "react";
import { Link } from "react-router-dom";

const Intro = () => {
  return (
    <div className="container intro">
      <h1 className="intro__heading">Let's Play Trivia!</h1>
      <Link
        to="/categories"
        className="btn btn--large btn--gradient btn-new-game"
      >
        <span>New Game</span>
      </Link>
    </div>
  );
};

export default Intro;
