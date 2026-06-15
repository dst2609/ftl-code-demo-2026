import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate(); //navigate to the page on button click
  return (
    <header className="site-header">
      <h1 className="logo"> Recipe App example</h1>
      <nav className="site-nav">
        <NavLink to="/">Home</NavLink> <br />
        <NavLink to="/recipes">Recipes</NavLink>
        <br />
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  );
};

export default Header;
