import React, { useEffect } from "react";
import { useGlobalContext } from "../context/context";
import { Link } from "react-router-dom";
import PageNotFound from "./PageNotFound";

const Question = () => {
  const {
    state: {
      isLoading,
      isAnswered,
      questionIndex,
      answeredIndex,
      correctIndexes,
      questions,
      answers,
      timer,
    },
    dispatch,
  } = useGlobalContext();

  const current = {
    question: questions[questionIndex],
    answers: answers[questionIndex],
    correctIndex: correctIndexes[questionIndex],
  };

  useEffect(() => {
    let timeout;
    if (timer > 0) {
      timeout = setTimeout(() => dispatch({ type: "TICK" }), 1000);
    }
    return () => clearTimeout(timeout);
  }, [dispatch, timer]);

  if (!isLoading && questions.length === 0) return <PageNotFound />;

  return (
    <div className="container container-game">
      {isLoading && <p className="loading">Loading questions...</p>}

      {!isLoading && questions.length > 0 && (
        <>
          <div className="wrapper-question">
            <h3 className="label-question-number">{`Question #${
              questionIndex + 1
            }`}</h3>
            <p className="label-current-question">{current.question}</p>
          </div>
          <div className="wrapper-timer">
            {!isAnswered && timer !== 0 && (
              <div className={`question-timer ${timer <= 5 ? "low-time" : ""}`}>
                <span className="label-question-timer">{timer}</span>
              </div>
            )}
            {(isAnswered || timer === 0) &&
              questionIndex < questions.length - 1 && (
                <button
                  className="btn btn-next btn--gradient"
                  onClick={() => dispatch({ type: "NEXT_QUESTION" })}
                >
                  <span>
                    Next <br className="btn-break" />
                    Question
                  </span>
                </button>
              )}
            {(isAnswered || timer === 0) &&
              questionIndex === questions.length - 1 && (
                <Link
                  to="/categories"
                  className="btn btn-play-again btn--gradient"
                  onClick={() => dispatch({ type: "RESET" })}
                >
                  <span>
                    Play <br className="btn-break" />
                    Again
                  </span>
                </Link>
              )}
          </div>
          <ul className="answer-choice-grid">
            {current.answers?.map((answer, i) => {
              return (
                <li key={i}>
                  <button
                    className={`btn btn-answer-choice btn--grey ${
                      (isAnswered || timer === 0) && current.correctIndex === i
                        ? "correct-answer"
                        : ""
                    } ${
                      isAnswered &&
                      answeredIndex !== current.correctIndex &&
                      answeredIndex === i
                        ? "incorrect-answer"
                        : ""
                    } ${isAnswered || timer === 0 ? "no-hover" : ""} ${
                      isAnswered && answeredIndex === i ? "selected-answer" : ""
                    }`}
                    onClick={() => dispatch({ type: "ANSWER", payload: i })}
                  >
                    <span>{answer}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default Question;
