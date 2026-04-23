# 🖥️ Luxeva Frontend

The frontend of Luxeva is a high-performance React application designed for a premium shopping experience.

## 🛠️ Tech Stack
- **React 19** with Vite for lightning-fast builds.
- **TypeScript** for type-safe development.
- **Tailwind CSS 4** for modern, utility-first styling.
- **Framer Motion** for smooth, luxurious animations.
- **Redux Toolkit** for predictable state management.
- **React Query** for efficient server-state handling.
- **Lucide React** for beautiful icons.

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in this directory and add your credentials:
   ```env
   VITE_API_URL=https://luxeva.onrender.com/api
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The app will run on `https://luxeva.vercel.app`.

## 🏗️ Key Components
- `src/components/Layout.tsx`: Main application wrapper.
- `src/pages/`: Page-level components (Home, ProductDetail, Cart, Admin, etc.)
- `src/features/`: Redux slices and business logic hooks.
- `src/styles/`: Global CSS and Tailwind configurations.
