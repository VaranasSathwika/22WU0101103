const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const logger = require('./middleware/logger');
const urlRoutes = require('./routes/shortUrls');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Root health check
app.get('/', (req, res) => res.send('Server is running 🚀'));

// Use shortUrls routes for both creation/listing and redirects
app.use('/', urlRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on port ${PORT}`));
