import React, { useState } from "react";

const ProductPage = () => {
  const [productName, setproductName] = useState("");
  const [productPrice, setproductPrice] = useState("");
  const [productBrand, setproductBrand] = useState("");
  const [productCategory, setproductCategory] = useState("");
  const [productImage, setproductImage] = useState("");
  const [allProducts, setallProducts] = useState([]);

  const addProduct = () => {
    let products = { productName, productPrice, productBrand, productCategory };
    setallProducts([...allProducts, products]);
  };

  const deleteProduct = (index) => {
    let newAllProduct = [...allProducts];
    newAllProduct.splice(index, 1);
    setallProducts(newAllProduct);
  };

  const editProduct = () => {};

  return (
    <div>
      <h1>Add Product Page</h1>
      <input
        type="text"
        placeholder="Product Name"
        onChange={(e) => setproductName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Price"
        onChange={(e) => setproductPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Brand"
        onChange={(e) => setproductBrand(e.target.value)}
      />
      <input
        type="text"
        placeholder="Poduct Category"
        onChange={(e) => setproductCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Poduct Image"
        onChange={(e) => setproductImage(e.target.value)}
      />
      <button onClick={addProduct}>Add Product</button>

      <hr />
      <h1>List of Products</h1>
      {allProducts.length === 0 ? (
        <div>No product yet!</div>
      ) : (
        allProducts.map((product, index) => (
          <div key={index}>
            <h1>{product.productName}</h1>
            <h1>{product.productPrice}</h1>
            <h1>{product.productBrand}</h1>
            <h1>{product.productCategory}</h1>
            <img src={product.productImage} alt="" />
            <button onClick={() => deleteProduct(index)}>Delete</button>
            <button onClick={() => editProduct(index)}>Edit</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductPage;
