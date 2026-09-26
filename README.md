# 🌸 Flower Shop - Full Stack Application

A full-stack, responsive E-Commerce Web Application built with an interactive frontend (HTML5, CSS3, JavaScript) and a Spring Boot REST API Backend with H2 Database.

---

## 🚀 Technology Stack

### **Frontend**
- **HTML5 & CSS3**: Modern, mobile-first design with smooth transitions, glassmorphism, and FontAwesome icons.
- **JavaScript (ES6+)**: Dynamic DOM manipulation, cart management, modal popups, API integration, and fallbacks.

### **Backend**
- **Java 17+ / Spring Boot 3.2.5**: High-performance RESTful Web APIs.
- **Spring Data JPA & H2 Database**: In-memory persistent data store pre-populated with default products and reviews.
- **Spring Web & WebMvcConfigurer**: Configured CORS support for seamless cross-origin requests (`http://localhost:8090/api`).

---

## 📁 Project Structure

```
flower/
├── backend/                              # Spring Boot REST Backend
│   ├── pom.xml                           # Maven dependencies
│   └── src/
│       └── main/
│           ├── java/com/flowershop/
│           │   ├── FlowerShopApplication.java   # Main Spring Boot Runner
│           │   ├── config/               # Web CORS & Initializer configs
│           │   │   ├── WebConfig.java
│           │   │   └── DataInitializer.java
│           │   ├── controller/           # REST API Controllers
│           │   │   ├── AuthController.java
│           │   │   ├── ProductController.java
│           │   │   ├── CartController.java
│           │   │   ├── OrderController.java
│           │   │   ├── WishlistController.java
│           │   │   ├── ReviewController.java
│           │   │   └── ContactController.java
│           │   ├── dto/                  # Data Transfer Objects
│           │   │   ├── AuthResponse.java
│           │   │   ├── LoginRequest.java
│           │   │   ├── RegisterRequest.java
│           │   │   └── CheckoutRequest.java
│           │   ├── model/                # JPA Entities
│           │   │   ├── User.java
│           │   │   ├── Product.java
│           │   │   ├── CartItem.java
│           │   │   ├── Review.java
│           │   │   └── ContactMessage.java
│           │   └── repository/           # Spring Data JPA Repositories
│           │       ├── UserRepository.java
│           │       ├── ProductRepository.java
│           │       ├── CartItemRepository.java
│           │       ├── ReviewRepository.java
│           │       └── ContactMessageRepository.java
│           └── resources/
│               └── application.properties # Server port (8090) & H2 settings
├── image/                                # Product and review images
├── index.html                            # Frontend main HTML page
├── script.js                             # Client-side logic & API fetch requests
├── style.css                             # Custom styles and animations
└── README.md                             # Project Documentation
```

---

## 🌟 Key Features

1. **Product Catalog**: Dynamic catalog loaded directly from Spring Boot REST API (`/api/products`).
2. **User Authentication**: Login & Registration popup modal with JWT token management (`/api/auth/login`, `/api/auth/register`).
3. **Cart Drawer**: Side sliding cart drawer with live badge update and checkout endpoint (`/api/cart`, `/api/order/checkout`).
4. **Wishlist**: Toggle products to user wishlist with backend endpoint (`/api/wishlist/toggle/{id}`).
5. **Customer Reviews CRUD**: Complete support to view, add, edit, and delete customer reviews in real-time (`/api/reviews`).
6. **Contact Form & Direct Gmail Dispatch**: Submit contact inquiries to the backend (`/api/contact`) and launch pre-filled Gmail composer.

---

## 🛠️ Getting Started & Setup

### **Prerequisites**
- **Java Development Kit (JDK 17 or 21+)**
- **Apache Maven (3.8+)**
- **Modern Web Browser** (Chrome, Firefox, Edge)

---

### **1. Run the Spring Boot Backend**

Open terminal/command prompt and navigate to the `backend` directory:

```bash
cd backend
mvn spring-boot:run
```

The backend server will start on **`http://localhost:8090/api`**.

> **Database Console**: Access the H2 Database GUI at [http://localhost:8090/h2-console](http://localhost:8090/h2-console)  
> - **JDBC URL**: `jdbc:h2:mem:flowerdb`  
> - **Username**: `sa`  
> - **Password**: *(leave blank)*

---

### **2. Launch the Frontend**

Open `index.html` in your web browser, or serve it using Live Server / any local web server:

```bash
# Option 1: Double-click index.html or open via browser
# Option 2: Using Python HTTP server (from project root)
python -m http.server 3000
```

Open `http://localhost:3000` in your browser.

---

## 📡 REST API Reference

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user & return authentication token |
| `GET` | `/api/products` | Retrieve list of all flower products |
| `GET` | `/api/products/{id}` | Retrieve details of a specific product |
| `GET` | `/api/cart` | Get items in the authenticated user's cart |
| `POST` | `/api/cart/add?productId={id}&quantity={qty}` | Add product to shopping cart |
| `DELETE` | `/api/cart/clear` | Clear user's cart |
| `POST` | `/api/order/checkout` | Process order checkout |
| `POST` | `/api/wishlist/toggle/{productId}` | Toggle product in user's wishlist |
| `GET` | `/api/reviews` | Retrieve all customer reviews |
| `POST` | `/api/reviews` | Submit a new customer review |
| `PUT` | `/api/reviews/{id}` | Edit an existing customer review |
| `DELETE` | `/api/reviews/{id}` | Delete a customer review |
| `POST` | `/api/contact` | Submit contact form message |

---

## 🔐 Default Demo User

- **Email**: `demo@flowershop.com`
- **Password**: `password123`
