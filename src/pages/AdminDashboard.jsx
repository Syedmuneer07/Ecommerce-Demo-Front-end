import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import "../styles/AdminDashboard.css"


function AdminDashboard() {
    const [orders, setOrders]= useState([]);
    const [selectedStatus, setSelectedStatus] = useState({});

    const fetchOrders = async () => {
        axios.get("http://localhost:3000/api/orders/admin/orders",{
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              },
        }).then((res) => {
            console.log(res.data);
            setOrders(res.data.orders);
        }).catch((err) => {
            console.log("There was an error", err);
            alert("There was an error, please try again");
        });
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:3000/api/orders/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            alert("Order status updated successfully!");
            fetchOrders();
        } catch (err) {
            console.log("Error updating status:", err);
            alert("Failed to update order status");
        }
    };

    const handleStatusSelectChange = (orderId, status) => {
        setSelectedStatus(prev => ({
            ...prev,
            [orderId]: status
        }));
    };

    const handleUpdateClick = (orderId) => {
        const newStatus = selectedStatus[orderId];
        if (newStatus) {
            handleStatusChange(orderId, newStatus);
        }
    };

  return (
    <div className="admin-dashboard-container">
        <h1>Admin Dashboard - All Orders</h1>
        <div className="orders-container">
            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>No orders found.</p>
                </div>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Total Amount</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Products</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="order-id" title={order._id}>
                                    {order._id}
                                </td>
                                <td className="user-id" title={order.userId}>
                                    {order.userId}
                                </td>
                                <td className="order-total">
                                    ₹{order.totalAmount}
                                </td>
                                <td>
                                    <span className={`payment-method ${order.paymentMethod === 'Razorpay' ? 'razorpay' : 'cod'}`}>
                                        {order.paymentMethod}
                                    </span>
                                </td>
                                <td>
                                    <span className={`order-status ${order.status ? order.status.toLowerCase() : 'pending'}`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <div className="products-list">
                                        {order.products.map((item, index) => (
                                            <div key={index} className="product-item">
                                                {item.productId.title} (x{item.quantity})
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <select 
                                        className="status-select"
                                        value={selectedStatus[order._id] || order.status || ''}
                                        onChange={(e) => handleStatusSelectChange(order._id, e.target.value)}
                                    >
                                        <option value="" disabled>Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button 
                                        className="action-btn update"
                                        onClick={() => handleUpdateClick(order._id)}
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  )
}

export default AdminDashboard

