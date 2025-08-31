import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';

const ProductDescriptionPage = () => {
  const { productId } = useParams();

  // Fetch the product details using productId (replace with real fetch)
  const product = {
    id: productId,
    name: `Product ${productId}`,
    price: 2000,
    description: 'This is a detailed description of the product.',
    // image: 'url-to-image'
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            {/* <img src={product.image} className="card-img-top" alt={product.name} /> */}
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
