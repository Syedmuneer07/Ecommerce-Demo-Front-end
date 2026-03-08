import React from 'react';
//  
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Order.css';

function Order() {
    const [orders, setOrders] = useState([]);
    const fetchOrders = async () => {
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_API_URL}/api/orders/`,{
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
        }).then((res) => {
            console.log(res.data.orders);
            setOrders(res.data.orders);

        }).catch((err) => {
            console.log("There was an error", err);
            alert("There was an error, please try again");
        });
    };
    useEffect(() => {
        fetchOrders();
    }, []);
    
  return (
    <div className="orders-container">
      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <>
          <h1>My Orders</h1>
          <div className="orders-list">
            {orders?.map((order) => (
              <div key={order._id} className="order-card">
                <h3>Order ID: {order._id}</h3>
                <p>
                  <strong>Total Amount Paid:</strong> 
                  <span>₹{order.totalAmount}</span>
                </p>
                <p>
                  <strong>Payment Method:</strong> 
                  <span className={`payment-method ${order.paymentMethod === 'Razorpay' ? 'razorpay' : 'cod'}`}>
                    {order.paymentMethod}
                  </span>
                </p>
                <p>
                  <strong>Order Status:</strong> 
                  <span className={`order-status ${order.status?.toLowerCase() || 'pending'}`}>
                    {order.status || 'Pending'}
                  </span>
                </p>

                <div className="ordered-products">
                  <h4>Products:</h4>

                  {order.products?.map((item, index) => (
                    <div key={index} className="ordered-product">
                      <p>{item.productId?.title}</p>
                      <span className="product-quantity">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Order

