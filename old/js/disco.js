// Two absolutely positioned, fixed rectangles that occupy the entire viewport

const discoButton = document.querySelector(".btn-disco");
const layer1 = document.querySelector(".layer-1"); // to top left
const layer2 = document.querySelector(".layer-2"); // to top right
const layers = document.querySelectorAll(".layer");
const bodyEl = document.querySelector("body");

let discoMode = false;
let updater;

const generateRandomRGB = function () {
  const rgb = [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    255,
  ].sort(() => Math.random() - 0.5);
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
};

const generateRandomGradient = function (side) {
  return `linear-gradient(to top ${side},${generateRandomRGB()},${generateRandomRGB()})`;
};

layer1.style.backgroundImage = generateRandomGradient("left");

const startDiscoMode = function () {
  layers.forEach((layer) => layer.classList.remove("hidden"));
  let counter = 0;
  const updateBackground = function () {
    layers.forEach((layer) => {
      if (!layer.classList.contains("layer--active")) {
        layer.classList.add("layer--active");
        layer.style.backgroundImage = generateRandomGradient(
          counter % 2 === 0 ? "left" : "right"
        );
      } else layer.classList.remove("layer--active");
    });
    counter++;
  };
  updateBackground();
  const updater = setInterval(updateBackground, 1000);
  return updater;
};

discoButton.addEventListener("click", function () {
  discoMode ? (discoMode = false) : (discoMode = true);
  // updater && clearInterval(updater);
  if (discoMode) {
    updater = startDiscoMode();
  } else {
    clearInterval(updater);
    layer1.classList.add("hidden");
    layer2.classList.add("hidden");
  }
});
