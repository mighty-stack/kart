import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const [customer, setCustomer] = useState({ firstname: 'Customer' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const navigate = useNavigate();
  const productsPerPage = 12;

  const getAuthToken = useCallback(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }, []);

  const checkAuth = useCallback(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/signin');
      return false;
    }
    return true;
  }, [getAuthToken, navigate]);

  useEffect(() => {
    if (!checkAuth()) return;

    const loadUserData = () => {
      const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setCustomer(user);
      }

      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setCartCount(cart.length);
        setWishlistCount(wishlist.length);
      } catch (err) {
        console.error('Error loading user data:', err);
        setCustomer({ firstname: 'Customer' });
      }
    };

    loadUserData();
  }, [checkAuth]);

  const fetchProducts = useCallback(() => {
    if (!checkAuth()) return;

    setLoading(true);
    setError(null);

    const token = getAuthToken();
    axios
      .get('https://kart-backend.onrender.com/user/products', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 10000,
      })
      .then((response) => {
        if (response.data) {
          const productsData = Array.isArray(response.data) ? response.data : [];
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err);

        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          navigate('/signin');
          return;
        }

        if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please check your connection and try again.');
        } else if (err.response) {
          setError(`Failed to load products (${err.response.status})`);
        } else if (err.request) {
          setError('Network error. Please check your connection.');
        } else {
          setError('An unexpected error occurred while loading products.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [checkAuth, getAuthToken, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        (product.title || product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return (a.price || 0) - (b.price || 0);
        case 'price_high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating?.rate || 0) - (a.rating?.rate || 0);
        case 'name':
        default:
          return (a.title || a.name || '').localeCompare(b.title || b.name || '');
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const categories = React.useMemo(() => {
    const cats = ['all', ...new Set(products.map((product) => product.category).filter(Boolean))];
    return cats;
  }, [products]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-3 text-muted">Loading your personalized dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || { firstname: 'Customer' };
    setCustomer(user);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header bg-primary text-white py-4 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="fw-bold mb-1">Welcome back, {customer.firstname}!</h2>
              <p className="mb-0 opacity-75">Discover amazing products just for you</p>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-md-end justify-content-start mt-3 mt-md-0 gap-3">
                <Link to="/cart" className="text-white text-decoration-none">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-cart3 fs-4 me-2"></i>
                    <div>
                      <div className="fw-semibold">Cart</div>
                      <div className="small">{cartCount} items</div>
                    </div>
                  </div>
                </Link>
                <Link to="/wishlist" className="text-white text-decoration-none">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-heart fs-4 me-2"></i>
                    <div>
                      <div className="fw-semibold">Wishlist</div>
                      <div className="small">{wishlistCount} items</div>
                    </div>
                  </div>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="controls-section mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Search Products</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Sort By</label>
              <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name (A-Z)</option>
                <option value="price_low">Price (Low to High)</option>
                <option value="price_high">Price (High to Low)</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <div className="col-md-2">
              <button onClick={fetchProducts} className="btn btn-outline-primary w-100" disabled={loading}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="results-summary mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 text-muted">
              Showing {currentProducts.length} of {filteredAndSortedProducts.length} products
            </p>
            {totalPages > 1 && (
              <p className="mb-0 text-muted">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
            <div className="text-center">
              <button onClick={fetchProducts} className="btn btn-primary">
                Try Again
              </button>
            </div>
          </div>
        )}

        {!error && (
          <>
            {filteredAndSortedProducts.length === 0 ? (
              <div className="empty-state text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-search display-1 text-muted"></i>
                </div>
                <h4>No products found</h4>
                <p className="text-muted mb-4">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'No products are available at the moment'}
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setCurrentPage(1);
                    }}
                    className="btn btn-outline-primary"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="products-grid mb-4">
                  <div className="row g-4">
                    {currentProducts.map((product) => (
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
                        <div className="product-card card h-100 shadow-sm border-0">
                          <div className="position-relative">
                            <img
                              src={product.image || fallbackImg}
                              className="card-img-top"
                              alt={product.title || product.name}
                              style={{ objectFit: 'cover', height: '200px' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = fallbackImg;
                              }}
                            />
                            {product.rating && (
                              <div className="position-absolute top-0 start-0 m-2">
                                <span className="badge bg-warning text-dark">
                                  <i className="bi bi-star-fill me-1"></i>
                                  {product.rating.rate}
                                </span>
                              </div>
                            )}
                            <div className="position-absolute top-0 end-0 m-2">
                              <button className="btn btn-outline-light btn-sm rounded-circle">
                                <i className="bi bi-heart"></i>
                              </button>
                            </div>
                          </div>
                          <div className="card-body d-flex flex-column">
                            <h6 className="card-title mb-2" title={product.title || product.name}>
                              {(product.title || product.name || 'Unnamed Product').substring(0, 50)}
                              {(product.title || product.name || '').length > 50 ? '...' : ''}
                            </h6>
                            <p className="text-muted small mb-2">{product.category}</p>
                            <p className="card-text text-success fw-bold fs-5 mb-3">
                              ₦{product.price?.toLocaleString() || 'N/A'}
                            </p>
                            <div className="mt-auto">
                              <div className="d-grid gap-2">
                                <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-sm">
                                  View Details
                                </Link>
                                <Button product={product} className="btn btn-primary btn-sm" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="pagination-container">
                    <nav aria-label="Products pagination">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>

                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1;
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                          ) {
                            return (
                              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(page)}>
                                  {page}
                                </button>
                              </li>
                            );
                          } else if (page === currentPage - 3 || page === currentPage + 3) {
                            return (
                              <li key={page} className="page-item disabled">
                                <span className="page-link">...</span>
                              </li>
                            );
                          }
                          return null;
                        })}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
