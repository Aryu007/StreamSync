// import express from 'express';
// import authRoutes from './routes/auth.route.js'; // Importing the auth routes
// import userRoutes from './routes/user.route.js'; // Importing the user routes
// import chatRoutes from './routes/chat.route.js'; // Importing the chat routes
// import connectDB from './lib/db.js'; // Importing the database connection
// import cookieParser from 'cookie-parser'; // Middleware to parse cookies
// import cors from 'cors'; // Middleware for CORS

// // Load environment variables from .env file
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT;

// app.use(cors(
//   {
//     origin: 'http://localhost:5173', // Allow requests from the client URL
//     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   }
// )); // Enable CORS for all routes
// app.use(cookieParser()); // Middleware to parse cookies
// app.use(express.json()); // Middleware to parse JSON bodies

// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);

// // Noob way to create this 
// // app.get('/api/auth/signup', (req, res) => {
// //   res.send('Sign Up Endpoint');
// // });

// // app.get('/api/auth/login', (req, res) => {
// //   res.send('Login Endpoint');
// // });

// // app.get('/api/auth/logout', (req, res) => {
// //   res.send('Logout Endpoint');
// // });


// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
//   connectDB();
// });

import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import  connectDB  from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});