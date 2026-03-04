import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Order from './pages/Order'
import AdminDashboard from './pages/AdminDashboard'
import Header from './components/Header'

function App() {
 

  return (
    <>
      <BrowserRouter>
        <div className='App'>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path='/orders' element={<Order/>} />
            <Route path='/admin' element={<AdminDashboard/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
