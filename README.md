# 🌸 Fragrance Kart

<div align="center">

![Project Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&style=for-the-badge)

**A premium, full-stack e-commerce experience tailored for luxury perfumes.**  
*Built with modern web standards, strict type safety, and a hybrid cloud architecture.*

[View Demo](https://perfume-ecommerce.vercel.app) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 About The Project

Fragrance Kart isn't just another shopping cart; it's a fully integrated e-commerce platform designed to mimic real-world scale and complexity. It features a high-performance **Next.js** frontend with smooth **GSAP** animations, backed by a robust **Express/MongoDB** backend.

I built this project to master the **Monorepo** architecture and demonstrate advanced DevOps skills, including **Docker containerization** and **Hybrid Cloud Deployment** (Vercel + Render).

### ✨ Key Features

| **User Experience** | **Admin Power** | **Technical Excellence** |
| :--- | :--- | :--- |
| 🛍️ **Smart Filtering**: Filter by brand, price, and category. | 📊 **Dashboard**: Real-time sales analytics and charts. | 🐳 **Dockerized**: Full environment setup with one command. |
| ⚡ **Optimized UI**: Infinite scroll & skeleton loading. | 📦 **Product Mgr**: CRUD operations with image upload. | 🛡️ **Secure**: JWT + Refresh Tokens & Zod Validation. |
| 🛒 **Dynamic Cart**: Guest & User cart syncing. | 🚚 **Order Ops**: Update status from Processing to Delivered. | ☁️ **Hybrid Cloud**: Best-of-breed hosting (Vercel + Render). |
| 💳 **Checkout**: Razorpay integration for payments. | 📢 **Banners**: Customize homepage visuals dynamically. | 📧 **Email System**: Transactional emails via Nodemailer. |

---

## 🛠️ Tech Stack Deep Dive

### 🎨 Frontend (Client)
*   **Framework:** Next.js 15 (App Router)
*   **State Management:**
    *   **Redux Toolkit**: Global state for Cart and User Session.
    *   **RTK Query**: Efficient data fetching with automatic caching and re-validation.
*   **UI & Styling:**
    *   **TailwindCSS v4**: Utility-first styling.
    *   **Shadcn UI**: Accessible, reusable components built on Radix Primitives.
    *   **GSAP**: High-performance animations for a premium feel.
*   **Forms**: Formik + Yup for robust form handling and validation.

### 🔌 Backend (Server)
*   **Runtime:** Node.js + Express.js
*   **Database:** MongoDB Atlas (Mongoose ODM).
*   **Authentication:**
    *   **Passport.js**: Google OAuth strategy.
    *   **JWT**: Custom Access/Refresh token rotation for secure, persistent sessions.
*   **Validation:** **Zod** schema validation for all API inputs (Runtime safety).
*   **Security:** `helmet` for headers, `express-rate-limit` for DDoS protection, and `mongo-sanitize`.

---

## 🚀 Getting Started

You can run this project locally in two ways: **The Docker Way** (Recommended) or **Manual Setup**.

### Prerequisites
*   Node.js 18+
*   Docker Desktop (for Docker method)
*   MongoDB URI (Local or Atlas)

### Option 1: The Docker Way (Fastest) 🐳
Run the entire stack (Frontend + Backend + DB) with a single command.

1.  **Clone the repo**
    ```bash
    git clone https://github.com/yourusername/fragrance-kart.git
    cd perfume-ecommerce
    ```

2.  **Configure Environment**
    Create a `.env` file in `backend/` and `frontend/` (see "Environment Variables" below) or modify `docker-compose.yml` directly.

3.  **Launch**
    ```bash
    docker-compose up --build
    ```
    *   **Frontend**: `http://localhost:3000`
    *   **Backend**: `http://localhost:5000`

### Option 2: Manual Setup

<details>
<summary>Click to view manual installation steps</summary>

1.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Setup .env file
    npm run dev
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    # Setup .env file
    npm run dev
    ```
</details>

---

## 🔐 Environment Variables

You need to create `.env` files in both directories.

**Backend (`backend/.env`)**
```env
PORT=5000
CONNECTION_URL=mongodb+srv://... (or mongodb://mongo:27017/perfume_db for Docker)
JWT_SECRET=complex_secret_key
REFRESH_SECRET=complex_refresh_key
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_USER=...
SMTP_PASS=...
```

**Frontend (`frontend/.env`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000 (or your Render URL)
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
```

---

## ☁️ Deployment Architecture

This project uses a **Hybrid Deployment** strategy to optimize for performance and cost.

*   **Frontend (Vercel)**:
    *   Chosen for its global CDN and optimized Next.js build pipeline.
    *   Configured via `vercel.json` to ignore backend changes.
*   **Backend (Render)**:
    *   Chosen for its native Docker support.
    *   Deployed via `render.yaml` Blueprint which builds the backend container from the root context.

---

## 📂 Project Structure (Monorepo)

```bash
perfume-ecommerce/
├── backend/                # Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose Schemas
│   │   ├── services/       # Business Logic Layer
│   │   └── utils/          # Error handling & Helpers
│   └── Dockerfile          # Backend container config
├── frontend/               # Next.js App
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # UI Components (Shadcn/Public)
│   │   └── redux/          # State Slices & APIs
│   ├── Dockerfile          # Frontend container config
│   └── vercel.json         # Vercel deployment rules
├── docker-compose.yml      # Local development orchestration
├── render.yaml             # Render Blueprint for Production
└── README.md               # You are here!
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

<div align="center">
Built with ❤️ by <b>Siyad</b>
</div>
