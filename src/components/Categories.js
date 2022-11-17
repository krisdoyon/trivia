import React from "react";
import categories from "../data/categories.json";
import { Link } from "react-router-dom";
import sprite from "../img/sprite.svg";
import { useGlobalContext } from "../context/context";

const Categories = () => {
  const { getQuestions } = useGlobalContext();
  return (
    <div className="container categories">
      <h2 className="categories__heading">Choose category</h2>
      <div className="categories__grid">
        {categories.map((item, index) => {
          return (
            <Link
              key={index}
              to="/question"
              className="btn categories__btn btn--grey"
              onClick={() => getQuestions(item)}
            >
              <svg className="categories__icon">
                <use href={`${sprite}#icon-${item.icon}`}></use>
              </svg>
              <span className="categories__label">{item.category}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
