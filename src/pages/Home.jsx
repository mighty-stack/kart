import React, { useEffect, useState } from "react";
import axios from "axios";
import Cards from "../components/Cards";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Home = () => {
  let Url = "https://fakestoreapi.com/products"
  const [products, setproducts] = useState([])
  const [loading, setloading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const fetchProducts = () => {
    setloading(true)
    setError(null)

    axios
      .get(Url)
      .then((response) => {
        console.log(response)
        setproducts(response.data)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
        setError(
          err.response?.data?.message ||
            "Failed to load products. Please try again."
        )
      })
      .finally(() => {
        setloading(false)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = [
    "all",
    ...new Set(products.map((product) => product.category)),
  ]

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <ErrorMessage message={error} />
        <button onClick={fetchProducts}>Retry</button>
      </div>
    )
  }

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Kart</h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices
          </p>
        </div>
      </section>

      <section className="search-filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all"
                  ? "All Categories"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="products-section">
        <div className="products-header">
          <h2>Featured Products</h2>
          <p>{filteredProducts.length} products found</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <Cards
                key={product.id} 
                id={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                category={product.category}
                description={product.description}
                rating={product.rating}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
};

export default Home;
