import express from 'express';
import cors from 'cors';

export const createServer = () => {
  const app = express();
  
  app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }));
  
  app.use(express.json());
  
  return app;
};