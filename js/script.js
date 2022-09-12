// category, correctAnswer, incorrectAnswers, difficulty

// categories: arts_and_literature, film_and_tv, food_and_drink, general_knowledge, geography, history, music, science, society_and_culture, sport_and_leisure

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
  ["Random"],
]);

const buttonNewEl = document.querySelector(".btn-new-game");
const boxIntroEl = document.querySelector(".box-intro");
const boxCategoriesEl = document.querySelector(".box-choose-category");
const boxGameEl = document.querySelector(".box-game");
const animalsButtonEl = document.querySelector("#btn-animals");

buttonNewEl.addEventListener("click", function () {
  boxCategoriesEl.classList.toggle("hidden");
  boxIntroEl.classList.toggle("hidden");
});

animalsButtonEl.addEventListener("click", function () {
  boxCategoriesEl.classList.toggle("hidden");
  boxGameEl.classList.toggle("hidden");
  gameData.getQuestions("Animals");
  setTimeout(updateQuestion(), 5000);
});

// The problem here is that the API call takes several seconds

const updateQuestion = function () {
  document.querySelector(".current-question").innerHTML =
    gameData.data[0].question;
};

const gameData = {
  getQuestions(category) {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://opentdb.com/api.php?amount=10&category=${categoriesMap.get(
        category
      )}`
    );
    xhr.responseType = "json";

    xhr.send();

    xhr.onload = function () {
      gameData.data = xhr.response.results;
      gameData.testQ = gameData.data[0].question;
      console.log(gameData.data[0].question);
      console.log(gameData.testQ);
    };
  },
};
