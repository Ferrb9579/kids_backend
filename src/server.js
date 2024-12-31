// src/server.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware for logging requests and responses with data
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`, req.body);

  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Response: ${res.statusCode}`, body);
    originalSend.call(this, body);
  };

  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    // JSON parse error
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  // If not recognized, pass to default error handler
  next();
});

// Main Router
app.use('/api', router);

// Health check or root
app.get('/', (req, res) => {
  res.send('Node.js + Prisma API is up and running!');
});

// Fallback error handler for uncaught errors in routes/controllers
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Return structured error response
  if (!res.headersSent) {
    return res.status(500).json({
      error: 'Internal Server Error: Something went wrong.',
      details: err.message,
    });
  }
  next(err);
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
