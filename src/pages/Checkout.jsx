import React from 'react';

const Checkout = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4 text-center">Checkout</h3>
              {/* Add your checkout form or summary here */}
              <p className="text-center mb-4">Review your order and proceed to payment.</p>
              <div className="d-grid">
                <button className="btn btn-success">
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;