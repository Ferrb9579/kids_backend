// server.js
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import router from './routes/index.js'; // Your main router

dotenv.config();
const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests, please try again later.',
  },
});
app.use(limiter);

// Logging middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`, req.body);

  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Response: ${res.statusCode}`, body);
    originalSend.call(this, body);
  };

  next();
});

// Main router
app.use('/api', router);

// Health check
app.get('/', (req, res) => {
  res.send('Node.js + Prisma API with WebSocket is up and running!');
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (!res.headersSent) {
    return res.status(500).json({
      error: 'Internal Server Error: Something went wrong.',
      details: err.message,
    });
  }
  next(err);
});

// Create an HTTP server from the Express app
const server = http.createServer(app);

// ----- WEB SOCKET SETUP -----
export const wss = new WebSocketServer({ server });

// Store connected clients
const connectedClients = new Set();

// On new WebSocket connection
wss.on('connection', (ws) => {
  console.log('New client connected via WebSocket');
  connectedClients.add(ws);

  // Optional: handle messages from clients if needed
  ws.on('message', (msg) => {
    console.log('Message from client:', msg.toString());
    // You could handle client-sent messages here
  });

  // On close, remove the client from the set
  ws.on('close', () => {
    console.log('Client disconnected');
    connectedClients.delete(ws);
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
