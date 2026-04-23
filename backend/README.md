# ⚙️ Luxeva Backend

The backend of Luxeva is a robust Express API that handles business logic, data persistence, and automated tasks.

## 🛠️ Tech Stack
- **Node.js & Express:** Core API framework.
- **MongoDB & Mongoose:** Database and ODM.
- **JWT:** Secure authentication.
- **Node-Cron:** Scheduled jobs for abandoned cart recovery.
- **Nodemailer:** Email notifications for orders and marketing.
- **Multer:** Handling file uploads for product images.

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in this directory:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/luxeva
   JWT_SECRET=your_secret_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

3. **Run Server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

4. **Seed Database (Optional):**
   ```bash
   npm run seed
   ```

## 📁 API Structure
- `server.js`: Entry point and middleware setup.
- `models/`: Mongoose schemas (User, Product, Order, Offer, etc.)
- `features/`: Modular API controllers and routes.
- `jobs/`: Background tasks (Abandoned Cart worker).
- `utils/`: Helper functions and shared logic.
