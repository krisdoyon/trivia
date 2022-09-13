"use strict";

let questionTimer;

const triviaGame = {
  category: undefined,
  categoryNumber: undefined,
  questions: [],
  incorrectAnswers: [],
  correctAnswers: [],
  answers: [],
  currentQuestion: 0,
  score: 0,
  answered: false,
  correctIndexes: [],
};

const categoriesMap = new Map([
  ["Animals", 27],
  ["Books", 10],
  ["General", 9],
  ["Geography", 22],
  ["History", 23],
  ["Math", 19],
  ["Movies", 11],
  ["Music", 12],
  ["Politics", 24],
  ["Science", 17],
  ["TV", 14],
]);

const categoriesNumbers = Array.from(categoriesMap.values());

///////////////////////////////////////////////////////////////////
// ELEMENTS

// BOXES
const boxIntroEl = document.querySelector(".box-intro");
const boxCategoriesEl = document.querySelector(".box-choose-category");
const boxTimerEl = document.querySelector(".box-timer");
const boxGameEl = document.querySelector(".box-game");

// INDIVIDUAL BUTTONS
const buttonNewEl = document.querySelector(".btn-new-game");
const animalsButtonEl = document.querySelector("#btn-animals");
const booksButtonEl = document.querySelector("#btn-books");
const generalButtonEl = document.querySelector("#btn-general");
const geographyButtonEl = document.querySelector("#btn-geography");
const historyButtonEl = document.querySelector("#btn-history");
const mathButtonEl = document.querySelector("#btn-math");
const moviesButtonEl = document.querySelector("#btn-movies");
const musicButtonEl = document.querySelector("#btn-music");
const politicsButtonEl = document.querySelector("#btn-politics");
const scienceButtonEl = document.querySelector("#btn-science");
const tvButtonEl = document.querySelector("#btn-tv");
const randomButtonEl = document.querySelector("#btn-random");
const backButtonEl = document.querySelector(".btn-back");
const nextButtonEl = document.querySelector(".btn-next");
const playAgainButtonEl = document.querySelector(".btn-play-again");

// CATEGORY BUTTONS NODELISTS
const categoryButtons = document.querySelectorAll(".btn-category");

// GAMEPLAY ELEMENTS
const labelCurrentQuestion = document.querySelector(".current-question");
const labelScore = document.querySelector(".current-score");
const labelCategory = document.querySelector(".current-category");
const labelTimer = document.querySelector(".countdown-timer");
const labelTimeRemaining = document.querySelector(".time-remaining");
const labelQuestionNumber = document.querySelector(".title-question");
const answerButtons = document.querySelectorAll(".btn-answer-choice");

const questionTimerEl = document.querySelector(".question-timer");

///////////////////////////////////////////////////////////////////
// FUNCTIONS

const getQuestions = function (game) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://opentdb.com/api.php?amount=10&category=${game.categoryNumber}&type=multiple`
  );
  xhr.responseType = "json";

  xhr.send();

  xhr.onload = function () {
    game.data = xhr.response.results;
    game.questions = game.data.map((object) => object["question"]);
    game.incorrectAnswers = game.data.map(
      (object) => object["incorrect_answers"]
    );
    game.correctAnswers = game.data.map((object) => object["correct_answer"]);
  };
};

const startGameTimer = function (game) {
  const tick = function () {
    labelTimer.textContent = timeRemaining;
    if (timeRemaining === 0) {
      clearInterval(timer);
      boxTimerEl.classList.add("hidden");
      boxGameEl.classList.remove("hidden");
      randomizeAnswers(game);
      updateScore(game);
    }
    timeRemaining--;
  };
  let timeRemaining = 3;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const tick = function () {};

const startQuestionTimer = function (game) {
  const tick = function () {
    labelTimeRemaining.textContent = timeRemaining;
    console.log(timeRemaining);
    if (timeRemaining === 5) {
      questionTimerEl.classList.add("low-time");
    }
    if (timeRemaining === 0) {
      clearInterval(timer);
      revealCorrectAnswer(game);
      answerButtons.forEach((button) => button.classList.add("no-hover"));
      displayButton(game);
      game.currentQuestion++;
      updateScore(game);
    }
    timeRemaining--;
  };
  let timeRemaining = 15;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const randomizeAnswers = function (game) {
  game.incorrectAnswers.forEach((answersArr, i) => {
    game.answers.push(
      [...answersArr, game.correctAnswers[i]].sort(() => Math.random() - 0.5)
    );
    game.correctIndexes.push(game.answers[i].indexOf(game.correctAnswers[i]));
  });
};

const revealCorrectAnswer = function (game) {
  answerButtons[game.correctIndexes[game.currentQuestion]].classList.add(
    "correct-answer"
  );
};

// const startQuestionTimer = function(game) {};

const updateQuestion = function (game) {
  questionTimer = startQuestionTimer(game);
  questionTimerEl.classList.remove("low-time");
  game.answered = false;
  labelQuestionNumber.textContent = `Question #${game.currentQuestion + 1}:`;
  labelCurrentQuestion.innerHTML = game.questions[game.currentQuestion];
  answerButtons.forEach((button) => button.classList.remove("no-hover"));
  nextButtonEl.classList.add("hidden");
  questionTimerEl.classList.remove("hidden");

  answerButtons.forEach((button, i) => {
    button.innerHTML = game.answers[game.currentQuestion][i];
    button.classList.remove("correct-answer");
    button.classList.remove("incorrect-answer");
    button.classList.remove("selected-answer");
  });
};

const updateScore = function (game) {
  labelScore.textContent = `${game.score} / ${game.currentQuestion}`;
};

const updateCategory = function (game) {
  labelCategory.textContent = `${game.category}`;
};

const resetGame = function (game) {
  game.currentQuestion = 0;
  game.score = 0;
  game.answers = [];
  game.correctIndexes = [];
  game.category = undefined;
  game.categoryNumber = undefined;
  game.questions = [];
  game.incorrectAnswers = [];
  game.correctAnswers = [];
  game.answered = false;
  boxGameEl.classList.add("hidden");
  boxCategoriesEl.classList.remove("hidden");
  updateScore(game);
  answerButtons.forEach((button, i) => {
    // button.innerHTML = game.answers[game.currentQuestion][i];
    button.classList.remove("correct-answer");
    button.classList.remove("incorrect-answer");
    button.classList.remove("selected-answer");
  });
  playAgainButtonEl.classList.add("hidden");
};

const randomCategory = function (game) {
  game.categoryNumber =
    categoriesNumbers[Math.trunc(Math.random() * categoriesNumbers.length)];
};

const displayQuestionTimer = function () {
  questionTimerEl.classList.remove("hidden");
  playAgainButtonEl.classList.add("hidden");
  nextButtonEl.classList.add("hidden");
};

const displayButton = function (game) {
  const button = game.currentQuestion < 9 ? nextButtonEl : playAgainButtonEl;
  setTimeout(function () {
    questionTimerEl.classList.add("hidden");
    button.classList.remove("hidden");
  }, 1500);
};

///////////////////////////////////////////////////////////////////
// EVENT HANDLERS

// NEW GAME BUTTON
buttonNewEl.addEventListener("click", function () {
  boxIntroEl.classList.add("hidden");
  boxCategoriesEl.classList.remove("hidden");
});

// CATEGORY BUTTONS

categoryButtons.forEach((button) => {
  button.addEventListener("click", function () {
    triviaGame.category = labelCategory.textContent =
      button.getElementsByClassName("title-category")[0].textContent;
    if (triviaGame.category === "Random") {
      randomCategory(triviaGame);
    } else {
      triviaGame.categoryNumber = categoriesMap.get(
        button.getElementsByClassName("title-category")[0].textContent
      );
    }
    boxCategoriesEl.classList.add("hidden");
    boxTimerEl.classList.remove("hidden");
    getQuestions(triviaGame);
    startGameTimer(triviaGame);
    setTimeout(function () {
      boxGameEl.classList.remove("hidden");
      updateQuestion(triviaGame);
    }, 3000);
  });
});

answerButtons.forEach((button, i) => {
  button.addEventListener("click", function () {
    if (!triviaGame.answered && triviaGame.currentQuestion <= 9) {
      clearInterval(questionTimer);
      if (triviaGame.correctIndexes[triviaGame.currentQuestion] === i) {
        triviaGame.score++;
      } else {
        button.classList.add("incorrect-answer");
      }
      revealCorrectAnswer(triviaGame);
      answerButtons[
        triviaGame.correctIndexes[triviaGame.currentQuestion]
      ].classList.add("correct-answer");

      answerButtons.forEach((button) => button.classList.add("no-hover"));

      displayButton(triviaGame);
      triviaGame.currentQuestion++;
      updateScore(triviaGame);
      button.classList.add("selected-answer");
      triviaGame.answered = true;
    }
  });
});

nextButtonEl.addEventListener("click", updateQuestion.bind(null, triviaGame));

playAgainButtonEl.addEventListener("click", resetGame.bind(null, triviaGame));
