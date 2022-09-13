"use strict";

const triviaGame = {
  category: undefined,
  categoryNumber: undefined,
  questions: [],
  incorrectAnswers: [],
  correctAnswers: [],
  answers: [],
  currentQuestion: 0,
  score: 0,

  getQuestions() {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://opentdb.com/api.php?amount=10&category=${this.categoryNumber}&type=multiple`
    );
    xhr.responseType = "json";

    xhr.send();

    xhr.onload = function () {
      triviaGame.data = xhr.response.results;
      triviaGame.questions = triviaGame.data.map(
        (object) => object["question"]
      );
      triviaGame.incorrectAnswers = triviaGame.data.map(
        (object) => object["incorrect_answers"]
      );
      triviaGame.correctAnswers = triviaGame.data.map(
        (object) => object["correct_answer"]
      );
    };
  },

  startGameTimer() {
    const tick = function () {
      console.log(timeRemaining);
      labelTimer.textContent = timeRemaining;
      if (timeRemaining === 0) {
        clearInterval(timer);
        boxTimerEl.classList.add("hidden");
        boxGameEl.classList.remove("hidden");
        triviaGame.randomizeAnswers();
      }
      timeRemaining--;
    };
    let timeRemaining = 3;
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
  },

  randomizeAnswers() {
    this.incorrectAnswers.forEach((answersArr, i) => {
      this.answers.push(
        [...answersArr, this.correctAnswers[i]].sort(() => Math.random() - 0.5)
      );
    });
  },

  startQuestionTimer() {},

  updateQuestion() {
    labelQuestionNumber.textContent = `Question #${
      triviaGame.currentQuestion + 1
    }:`;
    labelCurrentQuestion.innerHTML = this.questions[this.currentQuestion];
    nextButtonEl.style.opacity = 0;
    answerButtons.forEach((button, i) => {
      button.innerHTML = this.answers[this.currentQuestion][i];
      button.classList.remove("correct-answer");
      button.classList.remove("incorrect-answer");
    });
  },
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

// CATEGORY BUTTONS NODELISTS
const categoryButtons = document.querySelectorAll(".btn-category");

// GAMEPLAY ELEMENTS
const labelCurrentQuestion = document.querySelector(".current-question");
const labelScore = document.querySelector(".current-score");
const labelTimer = document.querySelector(".countdown-timer");
const labelQuestionNumber = document.querySelector(".title-question");
const answerButtons = document.querySelectorAll(".btn-answer-choice");

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
    triviaGame.category =
      button.getElementsByClassName("title-category")[0].textContent;
    if (triviaGame.category === "Random") {
      triviaGame.categoryNumber =
        categoriesNumbers[Math.trunc(Math.random() * categoriesNumbers.length)];
    } else {
      triviaGame.categoryNumber = categoriesMap.get(
        button.getElementsByClassName("title-category")[0].textContent
      );
    }
    boxCategoriesEl.classList.add("hidden");
    boxTimerEl.classList.remove("hidden");
    triviaGame.getQuestions();
    triviaGame.startGameTimer();
    setTimeout(function () {
      boxGameEl.classList.remove("hidden");
      triviaGame.updateQuestion();
    }, 3000);
  });
});

answerButtons.forEach((button, i) => {
  button.addEventListener("click", function () {
    const answerChoice = button.textContent;
    if (
      answerChoice === triviaGame.correctAnswers[triviaGame.currentQuestion]
    ) {
      triviaGame.score++;
      labelScore.textContent = triviaGame.score;
    }
    answerButtons.forEach((button) => {
      button.textContent ===
      triviaGame.correctAnswers[triviaGame.currentQuestion]
        ? button.classList.add("correct-answer")
        : button.classList.add("incorrect-answer");
    });
    triviaGame.currentQuestion++;
    setTimeout(function () {
      nextButtonEl.style.opacity = 1;
    }, 1500);
  });
});

nextButtonEl.addEventListener(
  "click",
  triviaGame.updateQuestion.bind(triviaGame)
);

