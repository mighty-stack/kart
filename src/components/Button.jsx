import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/cartSlice'

const Button = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartButton = () => {
    if (product) {
      dispatch(addToCart({ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1 
      }));
    }
  };

  return (
    <button 
      className="btn btn-success w-100 mt-2"
      onClick={addToCartButton}
      disabled={!product}
    >
      <i className="bi bi-cart-plus me-2"></i>
      Add to Cart
    </button>
  )
}

export default Button