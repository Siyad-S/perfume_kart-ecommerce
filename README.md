# Fragrance Kart - Premium Perfume E-Commerce Platform

A modern, full-stack e-commerce application for premium fragrances, built with the MERN stack (MongoDB, Express, React/Next.js, Node.js) and TypeScript.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

### User Features
- **Authentication**: Secure login/signup including Google OAuth integration.
- **Product Browsing**: Advanced filtering (brands, price, categories), searching, and sorting.
- **Shopping Experience**: 
  - Dynamic Cart management (Guest & User).
  - Infinite scroll product listing.
  - Seamless Checkout process.
- **Account Management**: 
  - Manage multiple shipping addresses.
  - Order history and tracking.
  - Profile updates.
- **Support**: Integrated support request system via email.

### Admin Features
- **Dashboard**: Overview of sales, orders, and user statistics.
- **Product Management**: Create, edit, delete products with image uploads (Cloudinary).
- **Order Management**: View and update order statuses (Processing, Shipped, Delivered, Cancelled).
- **Banner Management**: Dynamic homepage banner configuration.
- **User Management**: View and manage customer accounts.

### Technical Highlights
- **Modern UI**: Built with Next.js 15, TailwindCSS v4, and Radix UI primitives.
- **Animations**: Smooth transitions and scrolling effects using GSAP.
- **State Management**: Redux Toolkit & RTK Query for efficient data fetching and caching.
- **Payments**: Razorpay integration for secure transactions.
- **Email Service**: Transactional emails (Order confirmation, Password Reset, Support) using Nodemailer & EJS templates.
- **Type Safety**: Full TypeScript support across frontend and backend.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS, Shadcn/UI (Radix)
- **State Management**: Redux Toolkit, RTK Query
- **Animations**: GSAP
- **Forms**: Formik, Yup
- **Utilities**: Sonner (Toast), Lucide React (Icons)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Passport.js, JWT
- **File Storage**: Cloudinary
- **Email**: Nodemailer

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Razorpay Account
- Google Cloud Console Project (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/fragrance-kart.git
cd perfume-ecommerce
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SUPPORT_MAIL=support@fragrancekart.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

## 📂 Project Structure

```
perfume-ecommerce/
├── backend/            # Express.js API
│   ├── src/
│   │   ├── controllers/# Route controllers
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic (Email, etc.)
│   │   ├── templates/  # EJS Email templates
│   │   └── utils/      # Helper functions
│   └── ...
└── frontend/           # Next.js Application
    ├── src/
    │   ├── app/        # App Router pages
    │   │   ├── (admin) # Admin routes
    │   │   └── (public)# Public store routes
    │   ├── components/
    │   │   ├── admin/  # Admin UI components
    │   │   ├── public/ # Public UI components
    │   │   └── ui/     # Reusable UI elements
    │   ├── redux/      # Global state
    │   └── ...
    └── ...
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is licensed under the MIT License.
