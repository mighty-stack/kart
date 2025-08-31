import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios("https://kart-backend.onrender.com/products/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

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
        className={`bg-white border rounded p-3 sidebar-custom ${
          open ? "d-block" : "d-none"
        } d-md-block`}
        id="sidebarCollapse"
        style={{ minWidth: "220px", maxWidth: "100%", transition: "all 0.3s" }}
      >
        <h5 className="mb-3">Categories</h5>
        <ul className="list-group list-group-flush">
          {categories.map((cat, idx) => (
            <li
              key={idx}
              className="list-group-item list-group-item-action sidebar-item p-0"
            >
              <Link
                to={`/category/${encodeURIComponent(cat)}`}
                className="d-block py-2 px-3 text-decoration-none text-dark"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
