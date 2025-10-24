require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const adminRoutes = require('./routes/admin');
const registerRoutes = require('./routes/register');

const app = express();

// PERMANENT CORS CONFIGURATION
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    // Define allowed origin patterns
    const allowedPatterns = [
      /^https:\/\/.*\.vercel\.app$/, // All Vercel deployments (production + previews)
      /^http:\/\/localhost:\d+$/,     // All localhost ports
      /^http:\/\/127\.0\.0\.1:\d+$/   // All 127.0.0.1 ports
    ];
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours - cache preflight requests
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/register', registerRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'EventSphere API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Favicon handler (prevents 404 logs)
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 404 handler for undefined routes
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({ 
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/events',
      'POST /api/events',
      'GET /api/events/:id',
      'PUT /api/events/:id',
      'DELETE /api/events/:id'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Handle CORS errors specifically
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: err.message
    });
  }
  
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 8080;

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('✅ Database:', mongoose.connection.name);
  
  app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ EventSphere API Server Started');
    console.log(`✅ Port: ${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log('✅ CORS: Enabled for Vercel + localhost');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.error('Check your MONGO_URI environment variable');
  process.exit(1);
});