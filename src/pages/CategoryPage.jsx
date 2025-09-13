import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(15)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const formatCategoryName = (name) => {
    return name
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page)
  }
}

const getPaginationRange = () => {
  const range = []
  const maxPages = 5
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, startPage + maxPages - 1)

  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    range.push(i)
  }

  if (startPage > 1) {
    range.unshift("...")
    range.unshift(1)
  }

  if (endPage < totalPages) {
    range.push("...")
    range.push(totalPages)
  }

  return range
}

  useEffect(() => {
    setLoading(true)
    setError(null)

    
    axios(`https://kart-backend.onrender.com/products/category/${categoryName}`)
      .then((res) => res.data)
      .then((data) => {
        setTotalProducts(data.length)
        setTotalPages(Math.ceil(data.length / productsPerPage))

        const startIndex = (currentPage - 1) * productsPerPage
        const endIndex = startIndex + productsPerPage
        setProducts(data.slice(startIndex, endIndex))

        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
        setLoading(false)
      })
  }, [categoryName, currentPage, productsPerPage])

  const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image"

   const formatPrice = (price) => {
    return typeof price === "number" ? price.toLocaleString() : price
  }

  const handleRetry = () => {
    setCurrentPage(1) 
    setLoading(true)
    setError(null)
  }


  if (loading) {
    return (
      <div className="category-container">
        <div className="category-header">
          <div className="skeleton-title"></div>
        <div className="skeleton-divider"></div>
      </div>
      <div className="products-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="product-card skeleton-card">
            <div className="skeleton-image"></div>
            <div className="card-content">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-price"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    )
  }

  if (error) {
    return (
      <div className = "category-container" >
        <div className = "error-state" >
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className = "retry-btn" 
          onClick = {handleRetry} >
             Retry 
          </button> 
        </div> 
      </div>
    )
  }

  return (
    <div className="category-container">
      <div className="category-header">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{formatCategoryName(categoryName)}</span>
        </div>
        <h1 className="category-title">{formatCategoryName(categoryName)}</h1>
        <p className="category-subtitle">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
        <div className="title-divider"></div>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Products Found</h3>
          <p>We couldn't find any products in this category yet.</p>
          <Link to="/" className="back-home-btn">
            Browse All Products
          </Link>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product, index) => (
              <div 
                className="product-card" 
                key={product.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/product/${product.id}`} className="product-link">
                  <div className="card-image-container">
                    <img
                      src={product.image || fallbackImg}
                      alt={product.name}
                      className="card-image"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = fallbackImg
                      }}
                    />
                    <div className="card-overlay">
                      <span className="view-product">View Product</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">₦{formatPrice(product.price)}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination">
                <button
                  className={`pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹ Previous
                </button>

                <div className="pagination-numbers">
                  {getPaginationRange().map((pageNumber, index) => (
                    <button
                      key={index}
                      className={`pagination-number ${
                        pageNumber === currentPage ? 'active' : ''
                      } ${pageNumber === '...' ? 'dots' : ''}`}
                      onClick={() => pageNumber !== '...' && handlePageChange(pageNumber)}
                      disabled={pageNumber === '...'}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  className={`pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next ›
                </button>
              </div>

              <div className="pagination-info">
                Showing {((currentPage - 1) * productsPerPage) + 1} to{' '}
                {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} results
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};


export default CategoryPage