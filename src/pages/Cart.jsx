/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState, useEffect } from "react";
import "../styles/Cart.css";
import axios from "axios";
import Products from "./Products";



function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [productsWithquantity, setProductsWithQuantity] = useState([]);

   useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const productsWithquantity = parsedCart.map(product => ({
        productId: product._id,
        quantity: product.quantity
      }));
      setCartItems(parsedCart);
      setProductsWithQuantity(productsWithquantity);
    }
    
  }, []);
  const  calculateTotalValue = () => {
    const total = cartItems.reduce((acc, item) => acc + item.discountedPrice * item.quantity, 0);
    setTotalValue(total);

  };

  useEffect(() => {
    calculateTotalValue();
  }, [cartItems]); 


  
  // razorpay payment 
  const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

   const processRazorpay= async()=>{
    if(totalValue===0){
      alert("Cart is Empty");
      return;
    };

    const loaded= await loadRazorpayScript();
    if(!loaded || !window.Razorpay){
      alert("Razorpay SDK failed to load");
      return;
    }

     const options={
       key: import.meta.env.VITE_RAZORPAY_KEY,
       amount:Math.round(totalValue*100),
       currency:"INR",
       name:"Online Shop",
       description:"Thank you for shopping with us",
       handler:function (response){
        alert(" Payment successful, payment id:"+response.razorpay_payment_id);
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_API_URL}/api/orders/create`,{
          products:productsWithquantity,
          totalAmount:totalValue,
          paymentMethod:"Razorpay",
          razorpayPaymentId:response.razorpay_payment_id
        },{
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((res)=>{
          console.log(res.data);
          localStorage.removeItem("cart");
          setCartItems([]);
          setTotalValue(0);
        }).catch((err)=>{
          console.log("There was an error",err);
          alert("There was an error, please try again");
        })
       },
       theme:{color:"#3399cc"},
       prefill:{
        name:"John Doe",
        email:"lR2yf@example.com",
        contact:"9999999999",
       },
       notes:{
        address:"Online Shop",
       },

       }
       const razorpay=new window.Razorpay(options);
       razorpay.open(); 
   }

   const processCOD = async () => {
    if(totalValue===0){
      alert("Cart is Empty");
      return;
    };

    if(!paymentMethod){
      alert("Please select a payment method");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_API_URL}/api/orders/create`, {
        products: productsWithquantity,
        totalAmount: totalValue,
        paymentMethod: "COD",
        razorpayPaymentId: null
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Order placed successfully! You will pay cash on delivery.");
      console.log(response.data);
      localStorage.removeItem("cart");
      setCartItems([]);
      setTotalValue(0);
    } catch (err) {
      console.log("There was an error", err);
      alert("There was an error, please try again");
    }
   }

   const handleOrder = () => {
    if(!paymentMethod){
      alert("Please select a payment method");
      return;
    }
    if(paymentMethod === "razorpay"){
      processRazorpay();
    } else if(paymentMethod === "cod"){
      processCOD();
    }
   } 


  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-image">
                <img
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.title}
                />
              </div>
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p>Price: ${item.discountedPrice}</p>
                <p>Quantity: {item.quantity}</p>
                <button className="btn-btn-danger">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cart-total">
        <p>Total: ${totalValue}</p>
      </div>
      <div className="payment-section">
        <p>Choose Payment Method</p>
        <div className="payment-options">
          <div className="payment-option razorpay">
            <input 
              type="radio" 
              id="razorpay" 
              name="payment" 
              value="razorpay"
              checked={paymentMethod === "razorpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="razorpay">Razorpay Secure Payment</label>
          </div>
          <div className="payment-option cod">
            <input 
              type="radio" 
              id="cod" 
              name="payment" 
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="cod">Cash on Delivery</label>
          </div>
        </div>
        <button className="btn-btn-primary" onClick={handleOrder}>Order Now</button>
      </div>
    </div>
  );
}

export default Cart;
