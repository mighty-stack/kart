import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const items = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value, 10);
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th style={{width: '120px'}}>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₦{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={item.quantity}
                      onChange={e => handleQuantityChange(item.id, e.target.value)}
                    />
                  </td>
                  <td>₦{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Total: ₦{total}</h4>
            <div>
              <button className="btn btn-outline-danger me-2" onClick={() => dispatch(clearCart())}>
                Clear Cart
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/checkout')}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;