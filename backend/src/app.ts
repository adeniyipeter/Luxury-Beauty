import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middlewares
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Veya Beauty Studio API', timestamp: new Date() });
});

// API Routes
app.use('/api/v1', apiRoutes);

// 404 Handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint ${req.method} ${req.originalUrl} not found on this server`,
  });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
