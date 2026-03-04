const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');
const { defaultLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const salesRoutes = require('./routes/sales');
const contactsRoutes = require('./routes/contacts');
const marketingRoutes = require('./routes/marketing');
const socialRoutes = require('./routes/social');
const supportRoutes = require('./routes/support');
const analyticsRoutes = require('./routes/analytics');
const billingRoutes = require('./routes/billing');
const projectsRoutes = require('./routes/projects');
const aiRoutes = require('./routes/ai');

const app = express();

// ─── Global Middleware ──────────────────────────────────────────────────────
app.use(cors({
  origin: env.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morgan(env.isProduction ? 'combined' : 'dev', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// Rate limiting (global)
app.use(defaultLimiter);

// ─── Health Check (no auth) ─────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Public Routes (no auth required) ───────────────────────────────────────
app.use('/auth', authRoutes);

// ─── Protected Routes (auth required) ───────────────────────────────────────
app.use('/users', authMiddleware, usersRoutes);
app.use('/sales', authMiddleware, salesRoutes);
app.use('/contacts', authMiddleware, contactsRoutes);
app.use('/marketing', authMiddleware, marketingRoutes);
app.use('/social', authMiddleware, socialRoutes);
app.use('/support', authMiddleware, supportRoutes);
app.use('/analytics', authMiddleware, analyticsRoutes);
app.use('/billing', authMiddleware, billingRoutes);
app.use('/projects', authMiddleware, projectsRoutes);
app.use('/ai', authMiddleware, aiRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` },
  });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
