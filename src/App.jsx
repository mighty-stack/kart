import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import About from './pages/About';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CategoryPage from './pages/CategoryPage'; // create this page if not present
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import ProductDescriptionPage from './pages/ProductDescriptionPage';

const token = localStorage.getItem('token');

const App = () => {

  return(
      <>
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-lg-2">
              <Sidebar />
            </div>
            <div className="col">
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/dashboard" element={ token ? <Dashboard token={token}/> : <Signin/> } />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/product/:productId" element={<ProductDescriptionPage />} />
                <Route path="*" element={<NotFound/>}/>
              </Routes>
            </div>
          </div>
        </div>
      </>
  )
}

export default App