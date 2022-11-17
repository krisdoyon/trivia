import React, { useContext, useReducer, useState } from "react";

const appContext = React.createContext();

const randomizeAnswers = function (incorrectArr, correctArr) {
  const answers = [];
  const correctIndexes = [];
  incorrectArr.forEach((arr, i) => {
    answers.push([...arr, correctArr[i]].sort(() => Math.random() - 0.5));
    correctIndexes.push(answers[i].indexOf(correctArr[i]));
  });
  return { answers, correctIndexes };
};

const initialState = {
  isLoading: false,
  isError: false,
  isAnswered: false,
  category: "",
  questionIndex: 0,
  answeredIndex: null,
  score: 0,
  timer: 15,
  questions: [],
  answers: [],
  correctIndexes: [],
};

const reducer = (state, action) => {
  if (action.type === "INITIALIZE_GAME") {
    const questions = action.payload.map((question) => question.question);
    const incorrectAnswers = action.payload.map(
      (question) => question.incorrectAnswers
    );
    const correctAnswers = action.payload.map(
      (question) => question.correctAnswer
    );
    const { answers, correctIndexes } = randomizeAnswers(
      incorrectAnswers,
      correctAnswers
    );
    return {
      ...state,
      questions,
      answers,
      correctIndexes,
      isLoading: false,
    };
  }

  if (action.type === "NEXT_QUESTION") {
    return {
      ...state,
      questionIndex: state.questionIndex + 1,
      isAnswered: false,
      timer: 15,
    };
  }

  if (action.type === "RESET") {
    return { ...initialState };
  }

  if (action.type === "ANSWER") {
    const newScore =
      action.payload === state.correctIndexes[state.questionIndex]
        ? state.score++
        : state.score;
    return {
      ...state,
      isAnswered: true,
      answeredIndex: action.payload,
      score: newScore,
      timer: 15,
    };
  }

  if (action.type === "LOADING") {
    return {
      ...state,
      isLoading: action.payload.isLoading,
      category: action.payload.category,
    };
  }

  if (action.type === "ERROR") {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  }

  if (action.type === "TICK") {
    return {
      ...state,
      timer: state.timer - 1,
    };
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDisco, setIsDisco] = useState(false);

  console.log(state);

  const getQuestions = async (item) => {
    try {
      dispatch({
        type: "LOADING",
        payload: { isLoading: true, category: item.category },
      });
      const url = `https://the-trivia-api.com/api/questions?categories=${item.urlString}&limit=10`;
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data = await response.json();
      dispatch({ type: "INITIALIZE_GAME", payload: data });
    } catch (error) {
      console.error(error);
      dispatch({ type: "ERROR" });
    }
  };

  return (
    <appContext.Provider
      value={{ state, dispatch, getQuestions, isDisco, setIsDisco }}
    >
      {children}
    </appContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(appContext);
};

export { AppProvider, useGlobalContext };
