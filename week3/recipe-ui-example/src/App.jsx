import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

import "./App.css";

import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import RecipeList from "./Components/RecipeList/RecipeList";
import NotFound from "./Components/NotFound/NotFound";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <BrowserRouter>
      <Header setSearchTerm={setSearchTerm} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/recipes"
          element={<RecipeList searchTerm={searchTerm} />}
        />
        <Route path="/home" element={<Home />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
