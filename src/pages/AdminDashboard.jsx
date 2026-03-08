import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import "../styles/AdminDashboard.css"


function AdminDashboard() {
    const [orders, setOrders]= useState([]);
    const [selectedStatus, setSelectedStatus] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(5);

    const fetchOrders = async (page = 1) => {
        axios.get(`http://localhost:3000/api/orders/admin/orders?page=${page}&limit=${limit}`,{
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              },
        }).then((res) => {
            console.log(res.data);
            setOrders(res.data.orders || res.data);
            // If backend returns pagination info, use it
            if (res.data.totalPages) {
                setTotalPages(res.data.totalPages);
            } else {
                setTotalPages(1);
            }
        }).catch((err) => {
            console.log("There was an error", err);
            alert("There was an error, please try again");
        });
    };
    useEffect(() => {
        fetchOrders(currentPage);
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
            fetchOrders(currentPage);
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

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchOrders(newPage);
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
                <>
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
                
                {/* Pagination Component */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            className="pagination-btn prev"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        
                        <div className="pagination-pages">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`pagination-btn page-number ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        
                        <button 
                            className="pagination-btn next"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            
                </>
            )}
        </div>
    </div>
  )
}

export default AdminDashboard

