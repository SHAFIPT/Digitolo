import "reflect-metadata"; // Must be imported once at the top-level
import './config/container';
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db'
import cookieParser from "cookie-parser";
import route from "./routes/router";
import { errorHandler } from "./middleware/ErrorHandliling";
dotenv.config();
const app = express();   
const port = process.env.PORT || 5000;
connectDB()
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(cors({   
  origin: ['http://localhost:3000'],
  credentials: true
}));



app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MERN API' });
});

app.use('/', route)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});