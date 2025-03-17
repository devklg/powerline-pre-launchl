require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const preEnrollmentRoutes = require('./routes/preEnrollment');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/talk-fusion-pre-launch')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', preEnrollmentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Function to try different ports
const startServer = (initialPort) => {
  const MAX_PORT = 65535;
  const MIN_PORT = 3000;
  
  const tryPort = (port) => {
    // Convert port to number and ensure it's valid
    port = parseInt(port, 10);
    
    // Ensure port is within valid range
    if (port >= MAX_PORT) {
      console.error('No available ports found');
      process.exit(1);
    }

    if (port < MIN_PORT) {
      port = MIN_PORT;
    }

    const server = app.listen(port)
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is in use, trying ${port + 1}...`);
          server.close();
          tryPort(port + 1);
        } else {
          console.error('Server error:', err);
        }
      })
      .on('listening', () => {
        console.log(`Server running on port ${port}`);
      });
  };

  tryPort(initialPort);
};

const PORT = process.env.PORT || 3000;
startServer(PORT); 