"use strict";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES

let questionTimer, gameTimer;

const game = {
  category: "",
  categoryStr: "",
  currentQuestion: 0,
  currentScore: 0,
  answered: false,
  questions: [],
  incorrectAnswers: [],
  correctAnswers: [],
  answers: [],
  correctIndexes: [],
};

const categoriesMap = new Map([
  ["Arts & Literature", "arts_and_literature"],
  ["Film & TV", "film_and_tv"],
  ["Food & Drink", "food_and_drink"],
  ["General Knowledge", "general_knowledge"],
  ["Geography", "geography"],
  ["History", "history"],
  ["Music", "music"],
  ["Science", "science"],
  ["Society & Culture", "society_and_culture"],
  ["Sports & Leisure", "sport_and_leisure"],
]);

const categoriesStrs = Array.from(categoriesMap.values());

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DOM ELEMENTS

const boxes = document.querySelectorAll(".box");

// INDIVIDUAL BOXES
const boxIntro = document.querySelector(".box-intro");
const boxCategories = document.querySelector(".box-choose-category");
const boxTimer = document.querySelector(".box-timer");
const boxGame = document.querySelector(".box-game");
const boxTryAgain = document.querySelector(".box-try-again");

// INDIVIDUAL BUTTONS
const buttonNew = document.querySelector(".btn-new-game");
const buttonNext = document.querySelector(".btn-next");
const buttonPlayAgain = document.querySelector(".btn-play-again");
const buttonTryAgain = document.querySelector(".btn-try-again");
const buttonStartOver = document.querySelector(".start-over");

// CATEGORY BUTTONS NODELIST
const categoryButtons = document.querySelectorAll(".btn-category");

// ANSWER BUTTONS NODELIST
const answerButtons = document.querySelectorAll(".btn-answer-choice");

// GAMEPLAY ELEMENT LABELS
const labelCurrentQuestion = document.querySelector(".current-question");
const labelScore = document.querySelector(".current-score");
const labelCategory = document.querySelector(".current-category");
const labelQuestionNumber = document.querySelector(".title-question");

// TIMER ELEMENTS
const labelTimer = document.querySelector(".countdown-timer");
const labelQuestionTimer = document.querySelector(".label-question-timer");
const questionTimerEl = document.querySelector(".question-timer");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS

const getQuestions = function () {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://the-trivia-api.com/api/questions?categories=${game.categoryStr}&limit=10`
  );
  xhr.responseType = "json";

  xhr.send();

  xhr.onload = function () {
    game.data = xhr.response;
    game.questions = game.data.map((object) => object["question"]);
    game.incorrectAnswers = game.data.map(
      (object) => object["incorrectAnswers"]
    );
    game.correctAnswers = game.data.map((object) => object["correctAnswer"]);
  };
};

const startGameTimer = function () {
  const tick = function () {
    labelTimer.textContent = timeRemaining;
    if (timeRemaining === 0) {
      clearInterval(timer);
      updateScore();
      if (game.correctAnswers.length) {
        randomizeAnswers();
        displayBox(boxGame);
        updateQuestion();
      } else {
        displayBox(boxTryAgain);
      }
    }
    timeRemaining--;
  };
  let timeRemaining = 3;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const startQuestionTimer = function () {
  const tick = function () {
    labelQuestionTimer.textContent = timeRemaining;
    if (timeRemaining === 5) {
      questionTimerEl.classList.add("low-time");
    }
    if (timeRemaining === 0) {
      clearInterval(timer);
      revealCorrectAnswer();
      displayButton();
      game.currentQuestion++;
      updateScore();
    }
    timeRemaining--;
  };
  let timeRemaining = 15;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const randomizeAnswers = function () {
  game.incorrectAnswers.forEach((incorrectAnswersArr, i) => {
    game.answers.push(
      [...incorrectAnswersArr, game.correctAnswers[i]].sort(
        () => Math.random() - 0.5
      )
    );
    game.correctIndexes.push(game.answers[i].indexOf(game.correctAnswers[i]));
  });
};

const revealCorrectAnswer = function () {
  answerButtons[game.correctIndexes[game.currentQuestion]].classList.add(
    "correct-answer"
  );
  answerButtons.forEach((button) => button.classList.add("no-hover"));
};

const updateQuestion = function () {
  questionTimer = startQuestionTimer();
  questionTimerEl.classList.remove("low-time");
  game.answered = false;
  labelQuestionNumber.textContent = `Question #${game.currentQuestion + 1}:`;
  labelCurrentQuestion.innerHTML = game.questions[game.currentQuestion];
  answerButtons.forEach((button) => button.classList.remove("no-hover"));
  displayBox(boxGame);
  displayQuestionTimer();

  answerButtons.forEach((button, i) => {
    button.innerHTML = game.answers[game.currentQuestion][i];
    button.classList.remove("correct-answer");
    button.classList.remove("incorrect-answer");
    button.classList.remove("selected-answer");
  });
};

const updateScore = function () {
  labelScore.textContent = `${game.currentScore} / ${game.currentQuestion}`;
};

const updateCategory = function () {
  labelCategory.textContent = `${game.category}`;
};

const resetGame = function () {
  game.currentQuestion = 0;
  game.currentScore = 0;
  game.answers = [];
  game.correctIndexes = [];
  game.category = undefined;
  game.categoryStr = undefined;
  game.questions = [];
  game.incorrectAnswers = [];
  game.correctAnswers = [];
  game.answered = false;
  displayBox(boxCategories);
  updateScore();
  answerButtons.forEach((button) => {
    button.classList.remove("correct-answer");
    button.classList.remove("incorrect-answer");
    button.classList.remove("selected-answer");
  });
  gameTimer && clearInterval(gameTimer);
  questionTimer && clearInterval(questionTimer);
};

const displayQuestionTimer = function () {
  questionTimerEl.classList.remove("hidden");
  buttonPlayAgain.classList.add("hidden");
  buttonNext.classList.add("hidden");
};

const displayButton = function () {
  const button = game.currentQuestion < 9 ? buttonNext : buttonPlayAgain;
  questionTimerEl.classList.add("hidden");
  button.classList.remove("hidden");
};

const initializeGame = function () {
  displayBox(boxTimer);
  getQuestions();
  gameTimer = startGameTimer();
  updateScore();
};

const displayBox = function (boxToShow) {
  boxes.forEach((box) => box.classList.add("hidden"));
  buttonStartOver.classList.remove("hidden");
  boxToShow === boxIntro && buttonStartOver.classList.add("hidden");
  boxToShow.classList.remove("hidden");
};

///////////////////////////////////////////////////////////////////
// EVENT HANDLERS

// NEW GAME BUTTON
buttonNew.addEventListener("click", function () {
  displayBox(boxCategories);
});

// CATEGORY BUTTONS
categoryButtons.forEach((button) => {
  button.addEventListener("click", function () {
    game.category = labelCategory.textContent =
      button.getElementsByClassName("title-category")[0].textContent;
    game.categoryStr = categoriesMap.get(
      button.getElementsByClassName("title-category")[0].textContent
    );
    initializeGame();
  });
});

answerButtons.forEach((button, i) => {
  button.addEventListener("click", function () {
    if (!game.answered && game.currentQuestion <= 9) {
      clearInterval(questionTimer);
      if (game.correctIndexes[game.currentQuestion] === i) {
        game.currentScore++;
      } else {
        button.classList.add("incorrect-answer");
      }
      revealCorrectAnswer();

      displayButton();
      game.currentQuestion++;
      updateScore();
      button.classList.add("selected-answer");
      game.answered = true;
    }
  });
});

buttonNext.addEventListener("click", updateQuestion);

buttonPlayAgain.addEventListener("click", resetGame);

buttonTryAgain.addEventListener("click", initializeGame);

buttonStartOver.addEventListener("click", function () {
  resetGame();
  displayBox(boxIntro);
});
