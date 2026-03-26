# Luxeva Backend

This is a minimal Express scaffold for the Luxeva project.

Quick start:

1. Provide a MongoDB connection string in the `MONGO_URI` env var. Example (local):

```powershell
set MONGO_URI=mongodb://localhost:27017/luxeva
set JWT_SECRET=your_secret_here
```

2. Install and run:

```powershell
cd backend
npm install
npm run dev   # or `npm start` for production
```

The backend listens on port `4000` by default. API endpoints are available under `/api/*`.
