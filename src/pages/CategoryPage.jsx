import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { categoryName } = useParams();

  // Fetch or filter products based on categoryName here

  return (
    <div>
      <h2 className="mb-4 text-capitalize">
        {categoryName.replace(/-/g, ' ')}
      </h2>
      {/* Render products for this category here */}
      <p>Products for <strong>{categoryName.replace(/-/g, ' ')}</strong> will be displayed here.</p>
    </div>
  );
};

export default CategoryPage;
