import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  "Supermarket",
  "Health & Beauty",
  "Home & Office",
  "Phones & Tablets",
  "Computing",
  "Electronics",
  "Fashion",
  "Baby Products",
  "Gaming",
  "Sporting Goods",
  "Automobile",
  "Other Categories"
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className="btn btn-outline-secondary d-md-none mb-3"
        type="button"
        onClick={() => setOpen(!open)}
        aria-controls="sidebarCollapse"
        aria-expanded={open}
      >
        <span className="navbar-toggler-icon"></span> Categories
      </button>

      {/* Sidebar */}
      <div
        className={`bg-white border rounded p-3 sidebar-custom ${open ? 'd-block' : 'd-none'} d-md-block`}
        id="sidebarCollapse"
        style={{ minWidth: '220px', maxWidth: '100%', transition: 'all 0.3s' }}
      >
        <h5 className="mb-3">Categories</h5>
        <ul className="list-group list-group-flush">
          {categories.map((cat, idx) => (
            <li
              key={idx}
              className="list-group-item list-group-item-action sidebar-item p-0"
              style={{ cursor: 'pointer', transition: 'background 0.2s' }}
            >
              <Link
                to={`/category/${encodeURIComponent(cat.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'))}`}
                className="d-block py-2 px-3 text-decoration-none text-dark"
                style={{ width: '100%' }}
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Sidebar custom styles */}
      <style>{`
        .sidebar-item:hover, .sidebar-item:focus, .sidebar-item .active {
          background: #f8f9fa;
          color: #0d6efd;
        }
        @media (max-width: 767.98px) {
          .sidebar-custom {
            position: absolute;
            z-index: 1050;
            width: 80vw;
            left: 0;
            top: 60px;
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;