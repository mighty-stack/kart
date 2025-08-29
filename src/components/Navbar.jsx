
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((open) => !open);
  const handleNavClick = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand fw-bold" to="/" onClick={handleNavClick}>Kart</Link>
      <button
        className="navbar-toggler"
        type="button"
        aria-controls="navbarNav"
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
        onClick={handleToggle}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`collapse navbar-collapse${isOpen ? ' show' : ''}`} id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={handleNavClick}>Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about" onClick={handleNavClick}>About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/products" onClick={handleNavClick}>Products</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/signin" onClick={handleNavClick}>Sign In</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/signup" onClick={handleNavClick}>Sign Up</Link>
          </li>
        </ul>
        <form className="d-flex" role="search">
          <input className="form-control me-2" type="search" placeholder="Search products" aria-label="Search" />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;

