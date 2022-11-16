import React from "react";
// REACT ROUTER
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// PAGE COMPONENTS
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import SharedLayout from "./pages/SharedLayout";
// SASS
import "./sass/main.scss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
