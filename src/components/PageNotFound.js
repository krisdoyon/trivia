import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="container not-found">
      <h2 className="not-found__heading">Oops...error loading page :(</h2>
      <Link to="/" className="btn btn--large btn--gradient btn-try-again">
        Back Home
      </Link>
    </div>
  );
};

export default PageNotFound;
