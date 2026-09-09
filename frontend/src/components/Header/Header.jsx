import "./Header.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../authContext.jsx";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <p>Hanoutek</p>
      </div>
      <div className="nav-bar">
        <ul className="navbar-links">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/others"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Others
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Contact
          </NavLink>
        </ul>
      </div>
      <div className="auth">
        {user ? (
          <>
            <span className="user-name">{user.username}</span>
            <button type="button" className="logout-button" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="login-button">
              Login
            </NavLink>
            <NavLink to="/signup" className="signup-button">
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
