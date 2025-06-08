const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// Ensure logs directory exists
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a write stream (in append mode)
const accessLogPath = path.join(logDir, 'access.log');
const accessLogStream = fs.createWriteStream(accessLogPath, { flags: 'a' });

// IPs to exclude from logging
const excludedIPs = new Set([
  '172.31.24.29',
  '172.31.41.165',
]);

// Custom token for cleaned IP (removes ::ffff:)
morgan.token('clean-ip', (req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  return ip.replace(/^::ffff:/, '');
});

// Custom morgan log format
const customFormat = ':clean-ip [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"';

// Skip logging requests from excluded IPs
const skipLogging = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const cleanIp = ip.replace(/^::ffff:/, '');
  return excludedIPs.has(cleanIp);
};

// Use morgan middleware with skip and dual output (file + console)
app.use(morgan(customFormat, {
  skip: skipLogging,
  stream: {
    write: (message) => {
      accessLogStream.write(message);
      process.stdout.write(message);
    }
  }
}));

// Serve static files from "dist"
app.use(express.static(path.join(__dirname, 'dist')));

// Always serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
