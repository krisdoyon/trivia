import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import Disco from "../components/Disco";

const Layout = () => {
  const {
    state: { category, questions, score },
    dispatch,
    setIsDisco,
    isDisco,
  } = useGlobalContext();

  return (
    <>
      <div className="trivia-game">
        {isDisco && <Disco />}
        <div className="wrapper-top-btns">
          <Link
            to="/"
            className="btn btn--top btn--grey btn-start-over"
            onClick={() => {
              dispatch({ type: "RESET" });
            }}
          >
            <span>Start Over</span>
          </Link>
          <button
            className="btn btn--top btn--grey btn-disco"
            onClick={() => setIsDisco(!isDisco)}
          >
            <span>Disco Mode</span>
          </button>
        </div>
        <div className="container-main">
          <div className="wrapper-tabs">
            <div className="tab category-tab">
              <strong>
                Category: <br className="tab-break" />
              </strong>
              <span className="current-category">{category}</span>
            </div>
            <div className="tab score-tab">
              <strong>
                Score: <br className="tab-break" />
              </strong>
              <span className="current-score">
                {questions.length ? `${score} / ${questions.length}` : ""}
              </span>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
