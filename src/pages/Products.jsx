import React from 'react'
import { useState , useEffect} from 'react'
import '../styles/Products.css'
import axios from 'axios'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import {AddToCartToLocalStorage} from '../utils/CartUtils'

function Products() {
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get('categoryId');
        console.log(categoryId);
        // Fetch products based on the categoryId
        if(categoryId){
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_API_URL}/api/products/list?categoryId=${categoryId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            setProducts(response.data.products);
            
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });
        }
    },[]);


  return (
    <div className='products-container'>
        <Container>
            <h1 className="products-title">Products</h1>
            
            {products.length > 0 && (
                <Row className="g-4">
                    {products.map((product) => (
                        <Col key={product._id} xs={12} sm={6} lg={4} xl={3}>
                            <Card className="product-card h-100">
                                <Card.Img variant="top" src={product.images[0]} alt={product.title} />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="product-title">{product.title}</Card.Title>
                                    <Card.Text className="product-description">{product.description}</Card.Text>
                                    
                                    <div className="price">
                                        <span className="original-price">${product.mrpPrice}</span>
                                        <span className="discounted-price">${product.discountedPrice}</span>
                                    </div>
                                    
                                    <div className="rating">
                                        <span>★ {product.rating}</span>
                                        <span className="reviews">({product.numOfReviews} reviews)</span>
                                    </div>
                                    
                                    <Button variant="none" className="btn-btn-primary mt-auto" onClick={() => AddToCartToLocalStorage(product)  }>
                                        Add to Cart
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            
            {products.length === 0 && (
                <div className="text-center text-white">
                    <p>No products found</p>
                </div>
            )}
        </Container>
    </div>
  )
}

export default Products
