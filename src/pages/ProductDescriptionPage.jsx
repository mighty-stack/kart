import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const ProductDescriptionPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);

  const fallbackImg = "https://via.placeholder.com/400x250?text=No+Image";

  //  Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://kart-backend.onrender.com/products/${productId}`
        );

        setProduct(response.data);

        if (response.data?.category) {
          fetchRelatedProducts(response.data.category);
        } else {
          setError("Product not found");
          navigate("/not-found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        if (err.response?.status === 404) {
          setError("Product not found");
          navigate("/not-found");
        } else if (err.code === "ECONNABORTED") {
          setError("Request timed out. Please try again.");
        } else {
          setError("Failed to load product. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  //  Fetch related products
  const fetchRelatedProducts = async (category) => {
    try {
      const response = await axios.get(
        `https://kart-backend.onrender.com/products/category/${categoryName}`,
        { timeout: 5000 }
      );

      const filtered = response.data
        .filter((item) => item.id.toString() !== productId)
        .slice(0, 4);

      setRelatedProducts(filtered);
    } catch (err) {
      console.error("Could not fetch related products:", err);
    }
  };

  // Quantity control
  const quantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Image handlers
  const imageLoad = () => setImageLoading(false);
  const imageError = (e) => {
    e.target.onerror = null;
    e.target.src = fallbackImg;
    setImageLoading(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mt-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <ErrorMessage message={error} />
            <div className="text-center mt-3">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary me-2"
              >
                Go Back
              </button>
              <Link to="/" className="btn btn-primary">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //  Product not found
  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <h3>Product Not Found</h3>
        <Link to="/" className="btn btn-primary mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  //  Images setup
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image || fallbackImg];

  return (
    <div className="container-fluid px-3 px-md-5 mt-4 mb-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">
              Home
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link
              to={`/category/${product.category}`}
              className="text-decoration-none"
            >
              {product.category}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.title || product.name}
          </li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="row">
        {/* Left: Images */}
        <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
          <div className="product-images">
            <div className="main-image mb-3 position-relative">
              {imageLoading && (
                <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-light">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              )}
              <img
                src={images[selectedImage]}
                className="img-fluid rounded shadow"
                alt={product.title || product.name}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  cursor: "zoom-in",
                }}
                onLoad={imageLoad}
                onError={imageError}
              />
            </div>

            {images.length > 1 && (
              <div className="thumbnail-images d-flex gap-2 overflow-auto">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className={`img-thumbnail ${
                      selectedImage === index ? "border-primary" : ""
                    }`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    alt={`${product.title} ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    onError={imageError}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="product-details">
            <h1 className="product-title h3 mb-3">{product.title}</h1>

            {product.rating && (
              <div className="rating mb-3">
                <div className="d-flex align-items-center">
                  <div className="stars me-2">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bi ${
                          i < Math.floor(product.rating.rate)
                            ? "bi-star-fill text-warning"
                            : i < product.rating.rate
                            ? "bi-star-half text-warning"
                            : "bi-star text-muted"
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="rating-value me-2">
                    {product.rating.rate}
                  </span>
                  <span className="text-muted">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              </div>
            )}

            <div className="price mb-4">
              <h3 className="text-success mb-0">
                ₦{product.price?.toLocaleString() || "N/A"}
              </h3>
            </div>

            <div className="category mb-3">
              <span className="badge bg-light text-dark border">
                <i className="bi bi-tag me-1"></i>
                {product.category}
              </span>
            </div>

            <div className="description mb-4">
              <h5>Description</h5>
              <p className="text-muted">{product.description}</p>
            </div>

            <div className="quantity-selector mb-4">
              <h6>Quantity</h6>
              <div className="input-group" style={{ maxWidth: "150px" }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => quantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  onChange={(e) =>
                    quantityChange(parseInt(e.target.value) || 1)
                  }
                  min="1"
                  max="10"
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => quantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
              <small className="text-muted">
                Maximum 10 items per order
              </small>
            </div>

            <div className="action-buttons mb-4">
              <div className="d-grid gap-2 d-md-flex">
                <Button
                  product={product}
                  quantity={quantity}
                  className="btn btn-primary btn-lg flex-fill"
                />
                <button className="btn btn-outline-danger btn-lg">
                  <i className="bi bi-heart me-2"></i>
                  Add to Wishlist
                </button>
              </div>
            </div>

            <div className="additional-info">
              <div className="row text-center">
                <div className="col-4">
                  <i className="bi bi-truck display-6 text-primary"></i>
                  <p className="small mb-0 mt-2">Free Delivery</p>
                </div>
                <div className="col-4">
                  <i className="bi bi-arrow-repeat display-6 text-primary"></i>
                  <p className="small mb-0 mt-2">Easy Returns</p>
                </div>
                <div className="col-4">
                  <i className="bi bi-shield-check display-6 text-primary"></i>
                  <p className="small mb-0 mt-2">Secure Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products mt-5">
          <hr />
          <h4 className="mb-4">Related Products</h4>
          <div className="row">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="col-lg-3 col-md-4 col-sm-6 mb-3"
              >
                <div className="card h-100 shadow-sm">
                  <img
                    src={relatedProduct.image || fallbackImg}
                    className="card-img-top img-fluid"
                    alt={relatedProduct.title}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={imageError}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{relatedProduct.title}</h6>
                    <p className="text-success fw-bold mt-auto">
                      ₦{relatedProduct.price?.toLocaleString()}
                    </p>
                    <Link
                      to={`/product/${relatedProduct.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionPage;
