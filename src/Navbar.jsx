import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logoImg from "./assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when a link is clicked
  const handleLinkClick = () => setOpen(false);

  // Refresh homepage when logo or title is clicked
  const handleHomeRefresh = (e) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
    setOpen(false);
  };

  // Refresh homepage when "App" navbar item is clicked
  const handleAppNavClick = (e) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
    setOpen(false);
  };

  return (
    <header>
      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar-left">
          <a
            href="/"
            className="navbar-logo-link"
            onClick={handleHomeRefresh}
          >
            <img
              src={logoImg}
              alt="Film Scout Logo"
              className="navbar-logo"
            />
          </a>
          <span
            className="navbar-title"
            style={{ cursor: "pointer" }}
            onClick={handleHomeRefresh}
          >
            Film Scout
          </span>
        </div>
        <button
          className="hamburger"
          aria-label={
            open ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={open}
          aria-controls="navbar-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <ul
          id="navbar-menu"
          className={`nav-links-group${open ? " show" : ""}`}
          onClick={handleLinkClick}
        >
          <li>
            <a
              href="/"
              className={location.pathname === "/" ? "nav-link active" : "nav-link"}
              onClick={handleAppNavClick}
            >
              App
            </a>
          </li>
          {/* <li>
            <Link
              to="/news"
              className={location.pathname === "/news" ? "nav-link active" : "nav-link"}
            >
              News
            </Link>
          </li> */}
          <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "nav-link active" : "nav-link"}
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}