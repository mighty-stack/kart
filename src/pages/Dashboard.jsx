import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';

const Dashboard = () => {
  const [customer, setCustomer] = useState({ firstname: 'Customer' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem('user')) || { firstname: 'Customer' };
    setCustomer(user);
  }, []);

  
  useEffect(() => {
    setLoading(true);
    axios.get('https://kart-backend.onrender.com/products', {
      headers : {
            'Authorization':'Bearer ${token}',
            "Content-Type" : "application/json",
            "Accept" :   "application/json"
      }
    })
      .then(res => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, []);

  const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-bold">Welcome, {customer.firstname}!</h2>
      </div>
      <div className="row">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              No products available.
            </div>
          </div>
        ) : (
          products.map(product => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image || fallbackImg}
                  className="card-img-top"
                  alt={product.name}
                  style={{ objectFit: 'cover', height: '200px' }}
                  onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text mb-2">₦{product.price}</p>
                  <Button product={product} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;