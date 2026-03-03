import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'

function App() {
 

  return (
    <>
      <BrowserRouter>
        <div className='App'> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products/>} />
            <Route path="/cart" element={<Cart/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
