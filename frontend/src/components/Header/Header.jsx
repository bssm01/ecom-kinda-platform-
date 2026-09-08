import "./Header.css";
import { NavLink } from "react-router-dom";

function Header() {

    
  return (
    <header className="header">
    <div className="logo">
        <p>Hanoutek</p>
    </div>
    <div className="nav-bar">
        <ul className="navbar-links">
            <NavLink to="/home" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
                Home
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
                Products
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
                About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
                Contact
            </NavLink>
        </ul>
    </div>
    <div className="auth">
        <NavLink to="/login" className="login-button">
            Login
        </NavLink>
        <NavLink to="/signup" className="signup-button">
            Sign Up
        </NavLink>
    </div>

    
    </header>
  );
}

export default Header;

