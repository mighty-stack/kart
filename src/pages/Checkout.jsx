import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("http://localhost:5000/api/payment/initialize", {
        email,
        amount,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          const { authorization_url } = res.data.data;
          // Redirect user to Paystack checkout
          navigate(authorization_url);
        } else {
          alert("Payment initialization failed!");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Payment Error:", error);
        alert("Something went wrong!");
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4 text-center">Checkout</h3>
              <form onSubmit={handlePayment}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Shipping Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your address"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Payment Method</label>
                  <select className="form-select" required>
                    <option value="">Select payment method</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="transfer">Bank Transfer</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </button>
                </div>
              </form>
              <hr className="my-4" />
              <div className="text-center">
                <small className="text-muted">
                  By placing your order, you agree to our{" "}
                  <a href="#">Terms & Conditions</a>.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
