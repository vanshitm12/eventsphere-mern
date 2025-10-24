require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const adminRoutes = require('./routes/admin');
const registerRoutes = require('./routes/register');

const app = express();

// CORS Configuration - UPDATED
const allowedOrigins = [
  'https://eventspheremern.vercel.app/',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/register', registerRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  console.log('CORS enabled for Vercel deployments');
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error', err);
});