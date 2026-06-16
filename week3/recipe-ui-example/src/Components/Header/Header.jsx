import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = ({ setSearchTerm }) => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate(); //navigate to the page on button click

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(inputValue);
    navigate("/recipes"); //navigate to page on button click
    //take the input value and pass it up to the parent - App.jsx so that App.jsx can pass it down to RecipeList
  };

  return (
    <header className="site-header">
      <h1 className="logo"> Recipe App example</h1>
      <nav className="site-nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </header>
  );
};

export default Header;
