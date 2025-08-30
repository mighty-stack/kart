import React from 'react';

const NotFound = () => (
  <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
    <img
      src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
      alt="404 Not Found"
      className="img-fluid mb-4"
      style={{ maxWidth: '350px' }}
    />
    <h1 className="display-4 text-center mb-3">404 - Page Not Found</h1>
    <p className="lead text-center mb-4">
      Oops! The page you are looking for does not exist.
    </p>
    <a href="/" className="btn btn-primary">
      Go Home
    </a>
  </div>
);

export default NotFound;
