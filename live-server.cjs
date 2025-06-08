const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// Ensure the logs directory exists
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a write stream (in append mode)
const accessLogPath = path.join(logDir, 'access.log');
const accessLogStream = fs.createWriteStream(accessLogPath, { flags: 'a' });

// Define custom token to get cleaned IP
morgan.token('clean-ip', (req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  return ip.replace('::ffff:', ''); // Remove IPv6 prefix
});

// Use a custom format string
const customFormat = ':clean-ip [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"';

// Setup the logger (logs to file and console)
app.use(morgan(customFormat, {
  stream: {
    write: (message) => {
      accessLogStream.write(message);    // Write to file
      process.stdout.write(message);     // Also log to console
    }
  }
}));

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')));

// Always serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
