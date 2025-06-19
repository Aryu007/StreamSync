import express from 'express';
import authRoutes from './routes/auth.route.js'; // Importing the auth routes
import userRoutes from './routes/user.route.js'; // Importing the user routes
import chatRoutes from './routes/chat.route.js'; // Importing the chat routes
import connectDB from './lib/db.js'; // Importing the database connection
import cookieParser from 'cookie-parser'; // Middleware to parse cookies

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser()); // Middleware to parse cookies
app.use(express.json()); // Middleware to parse JSON bodies

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// Noob way to create this 
// app.get('/api/auth/signup', (req, res) => {
//   res.send('Sign Up Endpoint');
// });

// app.get('/api/auth/login', (req, res) => {
//   res.send('Login Endpoint');
// });

// app.get('/api/auth/logout', (req, res) => {
//   res.send('Logout Endpoint');
// });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});