import express from 'express';
import cors from 'cors';

export const createServer = () => {
  const app = express();
  
  // Configure middleware
  app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }));
  
  app.use(express.json());
  
  return app;
};