# BrewHeaven Cafe

Full-stack web application for café management and online food ordering, built using the MERN stack. The system supports real-time order tracking, secure payments, and an administrative dashboard for operational control.
Live Demo

Production URL:
https://brewheavencafe.onrender.com 

## Overview

BrewHeaven Cafe is designed to handle end-to-end user and admin workflows including authentication, product browsing, cart management, order processing, and analytics. The application focuses on performance, scalability, and clean separation of concerns using RESTful APIs and MVC architecture.


## Tech Stack

**Frontend**

* React.js
* Tailwind CSS
* React Router DOM
* Axios

**Backend**

* Node.js
* Express.js
* MongoDB atlas cloud (Mongoose)

**Integrations**

* Stripe (card payments)
* UPI QR (payment support)


## Features

* User authentication with JWT (login/register)
* Role-based access control (user/admin)
* Product listing and filtering
* Cart management (add, update, remove items)
* Coupon-based discount system
* Order placement (delivery and dine-in)
* Multiple payment methods (Stripe, UPI, COD)
* Admin dashboard for managing products, orders, coupons, and locations

## Architecture

* **Pattern:** MVC (Model–View–Controller)
* **API Design:** RESTful
* **State Management:** React Context API
* **Communication:** Axios (HTTP), Socket.io (real-time)

**Flow:**
Client → API → Controllers → Database → Response


## Key Modules

* **Authentication:** JWT-based login and protected routes
* **Cart:** Persistent storage with backend sync
* **Orders:** Creation, status updates, and tracking
* **Payments:** Secure handling via Stripe and UPI
* **Admin:** CRUD operations and analytics


## Project Structure

```id="c1a7b2"
client/
  src/
    components/
    pages/
    context/

server/
  controllers/
  models/
  routes/
  middleware/


📂 Folder Structure ### 1. Client (Frontend) - client/
client/
├── public/
│ └── locales/
│ ├── en/
│ │ └── common.json
│ ├── hi/
│ │ └── common.json
│ ├── mr/
│ │ └── common.json
│ └── ar/
│ └── common.json
├── src/
│ ├── components/
│ │ ├── Header.jsx
│ │ ├── Footer.jsx
│ │ ├── ProtectedRoute.jsx
│ │ ├── LanguageSelector.jsx
│ │ └── StripeCheckout.jsx
│ ├── context/
│ │ ├── AuthContext.jsx
│ │ └── CartContext.jsx
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Menu.jsx
│ │ ├── Cart.jsx
│ │ ├── Checkout.jsx
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── OrderSuccess.jsx
│ │ ├── OrderTracking.jsx
│ │ ├── UserOrders.jsx
│ │ ├── Contact.jsx
│ │ ├── About.jsx
│ │ └── admin/
│ │ ├── AdminDashboard.jsx
│ │ ├── AdminProducts.jsx
│ │ ├── AdminOrders.jsx
│ │ ├── AdminAddProduct.jsx
│ │ ├── AdminEditProduct.jsx
│ │ ├── AdminCoupons.jsx
│ │ ├── AdminAddCoupon.jsx
│ │ ├── AdminLocations.jsx
│ │ ├── AdminAddLocation.jsx
│ │ └── AdminLocationTables.jsx
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├──
.env
├── package.json
├── vite.config.js
└── index.html
### 2. Server (Backend) - server/
server/
├── config/
│ └── db.js
├── controllers/
│ ├── authController.js
│ ├── productController.js
│ ├── orderController.js
│ ├── cartController.js
│ ├── paymentController.js
│ ├── couponController.js
│ ├── locationController.js
│ └── contactController.js
├── middleware/
│ └── authMiddleware.js
├── models/
│ ├── User.js
│ ├── Product.js
│ ├── Order.js
│ ├── Cart.js
│ ├── Coupon.js
│ ├── Location.js
│ └── Contact.js
├── routes/
│ ├── authRoutes.js
│ ├── productRoutes.js
│ ├── orderRoutes.js
│ ├── cartRoutes.js
│ ├── paymentRoutes.js
│ ├── couponRoutes.js
│ ├── locationRoutes.js
│ └── contactRoutes.js
├──
.env
├── package.json
└── server.js
--- ##  Dependencies 
##Frontend :
npm install react react-dom react-router-dom axios tailwindcss framer-motion lucide-react react-hot-toast recharts qrcode.react  react-i18next three @react-three/fiber @react-three/drei @stripe/stripe-js @stripe/react-stripe-js leaflet react-leaflet socket.io-client jspdf xlsx

##Backend :
npm install express mongoose bcryptjs jsonwebtoken cors dotenv stripe express-validator 

## Setup

1. Clone the repository

```bash id="a82d91"
git clone <repo-url>
cd brewheaven-cafe
```

2. Install dependencies

```bash id="b73e11"
cd client && npm install
cd ../server && npm install
```

3. Configure environment variables

**server/.env**

```id="d29f84"
MONGO_URI=
JWT_SECRET=
STRIPE_SECRET_KEY=
```

**client/.env**

```id="e48c12"
VITE_API_URL=
VITE_STRIPE_PUBLIC_KEY=
```

4. Run the application

```bash id="f91a33"
cd server && npm start
cd client && npm run dev
```

---

## Security

* Password hashing using bcrypt
* JWT-based authentication
* Protected API routes via middleware
* Environment variable configuration
* Input validation on server-side
* 
## Deployment

The application is deployed on Render.

Frontend: Vite + React (served via static hosting)
Backend: Node.js + Express (Render Web Service)
Database: MongoDB Atlas


## Author

Name: Atish Ghanekar
Program: MCA
Role: Full Stack Developer


