import express from 'express';
import cors from 'cors';
import DB from './config/db';
import dotenv from 'dotenv';
import indexRoutes from './routes/index.routes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});



app.use(express.json());
app.use(cookieParser());

// Register main API routes
app.use('/api', indexRoutes);

// Ensure database connection is initialized
DB.getInstance();

// Root route
app.get('/', (_req, res) => {
  res.send('Employee API is running.');
});

// Server startup
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});

export default app;
