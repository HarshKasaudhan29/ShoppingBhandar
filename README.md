<div align="center">

<img src="https://img.shields.io/badge/Shopping%20Bhandar-Premium%20E--Commerce-ff3f6c?style=for-the-badge&logo=shopify&logoColor=white" alt="Shopping Bhandar"/>

# 🛍️ Shopping Bhandar

### India's Premium Full-Stack Fashion E-Commerce Platform

**Built with the MERN Stack · Inspired by Myntra · Powered by Razorpay**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?style=flat-square&logo=razorpay)](https://razorpay.com/)

</div>

---

## ✨ Features

- 🎨 **Myntra-inspired UI** — premium pink-accented design with smooth animations
- 🛒 **Full Shopping Flow** — Browse → Product Detail → Cart → Checkout → Payment
- 🔐 **JWT Authentication** — Secure register/login with role-based access (User / Admin)
- 💳 **Razorpay Integration** — Real payment gateway with signature verification
- 🔍 **Search & Filter** — Search by keyword, filter by category & sort by price/rating/discount
- 📦 **Auto Product Fetch** — Products auto-loaded from [DummyJSON API](https://dummyjson.com) (no manual entry needed)
- 📱 **Fully Responsive** — Mobile-first design, works on all screen sizes
- ⚡ **Vite + React 18** — Lightning-fast frontend with HMR
- 🗄️ **MongoDB Backend** — Full REST API with Mongoose schemas and relations

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Redux Toolkit, Axios, React Router v6 |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs |
| **Payments** | Razorpay (order creation + signature verification) |
| **Product Data** | DummyJSON REST API (auto-fetched, no manual entry) |
| **Dev Tools** | Nodemon, Concurrently, ESModules |

---

## 📁 Project Structure

```
shopping-bhandar/
│
├── 📄 package.json              ← Root monorepo (runs both servers)
├── 📄 .gitignore
├── 📄 README.md
│
├── 📁 backend/
│   ├── 📄 server.js             ← Express app entry point
│   ├── 📄 package.json
│   ├── 📄 nodemon.json
│   ├── 📄 .env                  ← Your secrets (git-ignored)
│   ├── 📄 .env.example          ← Template to copy from
│   │
│   ├── 📁 config/
│   │   └── db.js                ← MongoDB connection
│   │
│   ├── 📁 models/
│   │   ├── User.js              ← User schema + bcrypt hashing
│   │   ├── Product.js           ← Product schema + reviews
│   │   └── Order.js             ← Order schema + payment info
│   │
│   ├── 📁 middleware/
│   │   └── authMiddleware.js    ← JWT protect + isAdmin guards
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js    ← register, login, getMe
│   │   ├── productController.js ← CRUD + search + reviews
│   │   └── paymentController.js ← Razorpay createOrder + verify
│   │
│   └── 📁 routes/
│       ├── authRoutes.js
│       ├── productRoutes.js
│       ├── orderRoutes.js
│       └── paymentRoutes.js
│
└── 📁 frontend/
    ├── 📄 index.html
    ├── 📄 package.json
    ├── 📄 vite.config.js
    ├── 📄 tailwind.config.js
    ├── 📄 postcss.config.js
    ├── 📄 .env
    ├── 📄 .env.example
    │
    ├── 📁 public/
    │   ├── favicon.svg
    │   └── placeholder.jpg
    │
    └── 📁 src/
        ├── 📄 main.jsx           ← React root + Redux Provider
        ├── 📄 App.jsx            ← Routes + PrivateRoute + GuestRoute
        ├── 📄 index.css          ← Tailwind directives
        │
        ├── 📁 api/
        │   └── axiosInstance.js  ← JWT interceptor + DummyJSON instance
        │
        ├── 📁 redux/
        │   ├── store.js
        │   └── authSlice.js      ← login, register, logout, fetchProfile
        │
        ├── 📁 components/
        │   ├── Navbar.jsx        ← Sticky Myntra-style navbar
        │   ├── Footer.jsx        ← Full footer with links
        │   └── ProductCard.jsx   ← Reusable product card
        │
        └── 📁 pages/
            ├── Home.jsx          ← Hero banner, categories, trending
            ├── Products.jsx      ← Grid + filters + sort + pagination
            ├── ProductDetail.jsx ← Gallery, specs, reviews, similar
            ├── Cart.jsx          ← Cart with quantity controls
            ├── Checkout.jsx      ← Address + Razorpay payment
            ├── Login.jsx
            └── Register.jsx
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)
- [Razorpay](https://razorpay.com/) account (test mode is fine)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/shopping-bhandar.git
cd shopping-bhandar
```

### 2. Install All Dependencies

```bash
npm run install:all
```

This installs dependencies for root, backend, and frontend in one command.

### 3. Configure Environment Variables

**Backend:**
```bash
cp backend/.env.example backend/.env
```

Now open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shopping-bhandar
JWT_SECRET=your_super_secret_key_min_32_characters
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
```

`frontend/.env` content (default works for local dev):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Servers

```bash
npm run dev
```

This starts **both** servers concurrently:
- 🔵 Backend → `http://localhost:5000`
- 🟢 Frontend → `http://localhost:5173`

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5000`) |
| `MONGO_URI` | ✅ Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ Yes | Secret for signing JWT tokens (min 32 chars) |
| `CLIENT_URL` | ✅ Yes | Frontend URL for CORS (e.g. `http://localhost:5173`) |
| `RAZORPAY_KEY_ID` | ✅ Yes | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | ✅ Yes | Razorpay API Key Secret |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ Yes | Backend base URL (e.g. `http://localhost:5000/api`) |

---

## 🌐 API Endpoints

### 🔐 Auth
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create new account |
| `POST` | `/api/auth/login` | Public | Login & get JWT token |
| `GET` | `/api/auth/me` | 🔒 Private | Get logged-in user profile |

### 🛍️ Products
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Get all products (search, filter, paginate) |
| `GET` | `/api/products/featured` | Public | Get featured products |
| `GET` | `/api/products/categories` | Public | Get all categories |
| `GET` | `/api/products/:id` | Public | Get single product |
| `POST` | `/api/products` | 👑 Admin | Create product |
| `PUT` | `/api/products/:id` | 👑 Admin | Update product |
| `DELETE` | `/api/products/:id` | 👑 Admin | Delete product |
| `POST` | `/api/products/:id/reviews` | 🔒 Private | Add review |

### 📦 Orders
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | 🔒 Private | Place new order |
| `GET` | `/api/orders/myorders` | 🔒 Private | Get my orders |
| `GET` | `/api/orders/:id` | 🔒 Private | Get order by ID |

### 💳 Payments
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/payment/create-order` | 🔒 Private | Create Razorpay order |
| `POST` | `/api/payment/verify` | 🔒 Private | Verify payment signature |

---

## 🛒 How Product Auto-Fetch Works

Shopping Bhandar uses **[DummyJSON API](https://dummyjson.com/products)** to automatically load real product data with images, prices, ratings, and reviews — so you don't have to manually add any products.

```
https://dummyjson.com/products        → All products
https://dummyjson.com/products/search → Search
https://dummyjson.com/products/category/mens-shirts → By category
```

Prices are automatically converted from USD → INR (×83).

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both backend + frontend simultaneously |
| `npm run dev:backend` | Start only the backend (port 5000) |
| `npm run dev:frontend` | Start only the frontend (port 5173) |
| `npm run install:all` | Install all dependencies (root + backend + frontend) |
| `npm run build` | Build frontend for production |

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

<div align="center">

## 👨‍💻 Author

<div align="center">

**Harsh Kasaudhan**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)]( https://github.com/HarshKasaudhan29)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/harsh-kasaudhan
)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:harshkasaudhan105@gmail.com)

</div>

---

<div align="center">

### ⭐ Star this repository if you find it useful!

**Made with ❤️ by [Harsh Kasaudhan]( https://github.com/HarshKasaudhan29)**

*Fighting misinformation, one detection at a time* 🛡️

</div>
