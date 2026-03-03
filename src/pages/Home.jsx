import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import '../styles/Home.css'

function Home() {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
       
          axios.get("http://localhost:3000/api/category/list",
            {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ).then(res=> {
            console.log(res.data.categories);
            setCategories(res.data.categories);
          }).
          catch (error=>{
          console.error("Error fetching categories:", error);
        });
      };

        useEffect(() => {
          fetchCategories(); 
        }, []);
  return (
    <div className="home-page">
      <Container>
        <div className="text-center mb-5">
          <h1 className="home-title">Welcome to ShopHub</h1>
          <p className="home-subtitle">Choose any category below to view products</p>
        </div>

        {categories.length > 0 && (
          <Row className="g-4">
            {categories.map((category) => (
              <Col key={category._id} xs={12} sm={6} lg={4} xl={3} onClick={() => window.location.href = `/products?category=${category.title}&categoryId=${category._id}`}>
                <Card className="category-card h-100">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="category-title">
                      {category.title}
                    </Card.Title>
                    <Card.Text className="category-description">
                      {category.description}
                    </Card.Text>
                    <Button 
                      variant="none" 
                      className="mt-auto category-btn"
                    >
                      View Products
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  )
}

export default Home
