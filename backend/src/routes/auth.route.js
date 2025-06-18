import express from 'express';
import { login , logout ,signup , onBoard } from '../controllers/auth.controller.js'; // Importing the signup controller
import { protectRoute } from '../middleware/auth.middleware.js'; // Importing the protectRoute middleware
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',  logout);

router.post('/onBoarding', protectRoute, onBoard);

// Route to get the current user's information
router.get('/me', protectRoute, (req, res) => {
    res.status(200).json({ user: req.user });
});

export default router;