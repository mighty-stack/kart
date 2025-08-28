import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import About from './pages/About'

const App = () => {

  return(
    <> 
      <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/about" element={<About/>}/>
       <Route path="/Sigin" element={<Signin/>}/>
       <Route path="/Signup" element={<Signup/>}/>
       <Route path="*" element={<NotFound/>}/>
     </Routes>
    </>
  )
}

export default App