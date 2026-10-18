import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import { sanitizeRequest, preventPathTraversal } from './middleware/security.middleware.js';
import { isDatabaseConnected } from './config/database.js';

const app = express();

// Disable 'x-powered-by' header so attackers cannot fingerprint Express
app.disable('x-powered-by');

// Enhanced Helmet Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hidePoweredBy: true,
    noSniff: true,
    xssFilter: true,
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Block directory traversal attempts
app.use(preventPathTraversal);

// CORS configuration supporting credentials (cookies, authorization headers)
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev mode compatibility
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// HTTP Request Logging (disable during tests)
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers with size boundaries to prevent memory exhaustion DDoS attacks
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// NoSQL Injection sanitization on all incoming requests
app.use(sanitizeRequest);

// Rate Limiter for API endpoints (disabled during testing)
if (config.nodeEnv !== 'test') {
  app.use('/api', apiLimiter);
}

// Health check endpoint (minimal diagnostic output without exposing internals)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'skillpath-ai-api',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: isDatabaseConnected() ? 'connected' : 'offline_fallback_mode',
    environment: config.nodeEnv,
  });
});

// Mount Central API Routes
app.use('/api', apiRouter);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
