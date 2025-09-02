import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';

const ProductDescriptionPage = () => {
  const { productId } = useParams();


  const product = {
    id: productId,
    name: `Product ${productId}`,
    price: 2000,
    description: 'This is a detailed description of the product.',
    image: '', 
  };

  const fallbackImg = "https://via.placeholder.com/400x250?text=No+Image";

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <img
              src={product.image || fallbackImg}
              className="card-img-top"
              alt={product.name}
              style={{ objectFit: 'cover', height: '250px' }}
              onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
            />
            <div className="card-body">
              <h3 className="card-title mb-3">{product.name}</h3>
              <h4 className="text-success mb-3">₦{product.price}</h4>
              <p className="mb-4">{product.description}</p>
              <Button product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionPage;
