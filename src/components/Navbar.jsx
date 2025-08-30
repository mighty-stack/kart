import React, { useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const dropdownRef = useRef(null);

  // Toggle dropdown manually for React (Bootstrap JS is not automatic in React)
  const handleDropdown = (e) => {
    e.preventDefault();
    const menu = dropdownRef.current;
    if (menu) {
      menu.classList.toggle('show');
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.parentNode.contains(e.target)) {
        dropdownRef.current.classList.remove('show');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
      
        <Link className="navbar-brand fw-bold" to="/">Kart</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMain">

          
          <form className="d-flex mx-auto" style={{ maxWidth: 400, width: '100%' }}>
            <input className="form-control me-2" type="search" placeholder="Search products..." aria-label="Search" />
            <button className="btn btn-outline-primary" type="submit">Search</button>
          </form>
          
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#account"
                id="accountDropdown"
                role="button"
                onClick={handleDropdown}
                aria-expanded="false"
              >
                Account
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="accountDropdown"
                ref={dropdownRef}
              >
                <li>
                  <Link className="dropdown-item" to="/signin">Sign In</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/signup">Sign Up</Link>
                </li>
              </ul>
            </li>
            <li className="nav-item ms-3">
              <Link className="nav-link position-relative" to="/cart">
                <FaShoppingCart size={22} />
                <span className="ms-1">Cart</span>
                {/* Optionally, add a badge for cart count */}
                {/* <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">3</span> */}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

