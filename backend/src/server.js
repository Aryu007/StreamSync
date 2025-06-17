import express from 'express';
import authRoutes from './routes/auth.route.js'; // Importing the auth routes
import connectDB from './lib/db.js'; // Importing the database connection

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON bodies
app.use("/api/auth", authRoutes);

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