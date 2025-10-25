import React, { useState } from "react";
import axios from "axios";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!email || !amount) {
      alert("Please enter your email and amount");
      return;
    }

    setLoading(true);

    try {
      // Convert to kobo (Paystack expects amount in the smallest currency unit)
      const response = await axios.post(
        "https://kart-backend.onrender.com/payment/initialize",
        {
          email,
          amount: Number(amount) * 100,
        }
      );

      setLoading(false);

      if (response.data.success) {
        const { authorization_url } = response.data.data;
        // Redirect user to Paystack checkout page
        window.location.href = authorization_url;
      } else {
        alert(response.data.error || "Payment initialization failed!");
      }
    } catch (error) {
      setLoading(false);
      console.error("Payment Error:", error);
      alert(
        error.response?.data?.error || "Something went wrong during payment!"
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4 text-center">Checkout</h3>
              <form onSubmit={handlePayment}>
                {" "}
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />{" "}
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount (₦)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
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
