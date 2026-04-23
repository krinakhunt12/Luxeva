# 🛍️ Luxeva — Premium Fashion E-commerce

Luxeva is a state-of-the-art, premium fashion e-commerce platform built with a modern full-stack architecture. It features a "Minimal Luxury" aesthetic, providing a seamless shopping experience for customers and a robust management dashboard for admins.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) (Vite)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching:** [React Query](https://tanstack.com/query/latest)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Authentication:** [Firebase Auth](https://firebase.google.com/products/auth)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Authentication:** [JWT](https://jwt.io/) & [BcryptJS](https://www.npmjs.com/package/bcryptjs)
- **Jobs:** [Node-Cron](https://www.npmjs.com/package/node-cron) for automated tasks (e.g., Abandoned Cart recovery)
- **Mailing:** [Nodemailer](https://nodemailer.com/)

---

## ✨ Key Features

- **💎 Premium UI/UX:** Clean, high-fidelity design with smooth animations and responsive layouts.
- **🛒 Advanced Cart & Checkout:** Real-time cart updates, coupon application, and secure checkout flow.
- **📦 Product Management:** Rich product catalog with support for variants (size, color), categories, and high-quality image uploads.
- **🏷️ Offer & Discount Engine:** Admin-controlled offers, stackable rules, and automatic banner generation.
- **📧 Abandoned Cart Recovery:** Automated background jobs to re-engage customers who left items in their cart.
- **🎁 Gift Cards:** System for purchasing and redeeming digital gift cards.
- **📊 Admin Dashboard:** Comprehensive suite for managing products, orders, inventory, and marketing campaigns.
- **❤️ Wishlist Sharing:** Allow users to create and share their favorite items via unique public links.

---

## 🛠️ Project Structure

```text
├── Frontend/           # React application (Client-side)
├── backend/            # Express API (Server-side)
├── FEATURES.md         # Planned feature list & Roadmap
└── FEATURES_NEW.md     # New proposed features (Amazon/Flipkart inspired)
```

---

## 🚦 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 2. Installation
Clone the repository and install dependencies in both directories:

```bash
# Install Frontend dependencies
cd Frontend
npm install

# Install Backend dependencies
cd ../backend
npm install
```

### 3. Environment Setup
Create a `.env` file in both directories based on the `.env.example` files (if available).

**Backend `.env`:**
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

**Frontend `.env`:**
```env
VITE_API_URL=https://luxeva.onrender.com/api
VITE_FIREBASE_API_KEY=...
# Add other Firebase/Gemini credentials
```

### 4. Running the Project
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd Frontend
npm run dev
```

The app will be available at `http://localhost:3000` (Frontend) and the API at `https://luxeva.onrender.com/api` (Backend).

---

## 👩‍💻 Author
**Krina**
Built with ❤️ for the world of premium fashion.
