// ROUTER
import { Routes, Route } from "react-router-dom";
// PAGE COMPONENTS
import Layout from "./components/Layout";
import Intro from "./components/Intro";
import Categories from "./components/Categories";
import PageNotFound from "./components/PageNotFound";
import Question from "./components/Question";
// SASS
import "./sass/main.scss";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Intro />} />
        <Route path="categories" element={<Categories />} />
        <Route path="question" element={<Question />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
