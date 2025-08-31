import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios"

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // fetch products by category from backend
    axios(`https://kart-backend.onrender.com/products/category/${categoryName}`)
      .then((res) => res.data)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [categoryName]);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-capitalize">
            {categoryName.replace(/-/g, " ")}
          </h2>
          <hr />
        </div>
      </div>
      <div className="row">
        {products.length === 0 ? (
          <div className="col">
            <div className="alert alert-info text-center">
              No products found in this category.
            </div>
          </div>
        ) : (
          products.map((product) => (
            <div className="col-md-4 col-lg-3 mb-4" key={product.id}>
              <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                <div className="card h-100 shadow-sm">
                  {/* <img src={product.image} className="card-img-top" alt={product.name} /> */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text mb-4">₦{product.price}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPage

