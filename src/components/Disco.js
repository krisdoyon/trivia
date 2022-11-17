import React, { useEffect, useState } from "react";

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

const Disco = () => {
  const [layer1, setLayer1] = useState(generateRandomGradient("left"));
  const [layer2, setLayer2] = useState(generateRandomGradient("right"));
  const [activeLayer, setActiveLayer] = useState(1);

  useEffect(() => {
    activeLayer === 2
      ? setLayer2(generateRandomGradient("right"))
      : setLayer1(generateRandomGradient("left"));

    const timeout = setTimeout(() => {
      setActiveLayer((prevActive) => (prevActive === 1 ? 2 : 1));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [activeLayer]);

  return (
    <>
      <div
        className={`layer ${activeLayer === 1 ? "layer--active" : ""}`}
        style={{ backgroundImage: layer1 }}
      ></div>
      <div
        className={`layer ${activeLayer === 2 ? "layer--active" : ""}`}
        style={{ backgroundImage: layer2 }}
      ></div>
    </>
  );
};

export default Disco;
