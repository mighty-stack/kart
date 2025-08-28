import React from 'react';

const Cards = ({ image, title, price, category, description }) => {
  return (
    <div className="card" style={{ width: '288px', margin: '16px' }}>
      <img src={image} className="card-img-top" alt={title} style={{ height: '200px', objectFit: 'contain' }} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{category}</h6>
        <p className="card-text" style={{ minHeight: '60px' }}>{description}</p>
        <p className="card-text fw-bold">${price}</p>
      </div>
    </div>
  );
};

export default Cards;