
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cards from "../components/Cards";

const Home = () => {
  let Url = "https://fakestoreapi.com/products";
  const [products, setproducts] = useState([]);
  const [loading, setloading] = useState(true);

  const fetchProducts = () => {
    axios
      .get(Url)
      .then((response) => {
        console.log(response);
        setproducts(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <h1 className="text-center">Welcome to kart</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {products.map((product, index) => (
          <Cards
            key={index}
              image={product.image}
              title={product.title}
              price={product.price}
              category={product.category}
              description={product.description}
            />
          ))}
        </div>
      
    </>
  );
};

export default Home;
