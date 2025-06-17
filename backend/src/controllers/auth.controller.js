import {User} from  '../models/user.js';
import jwt from 'jsonwebtoken';


export async function signup(req, res) {
  const {email, password, fullName} = req.body;

  try {
    if(!email || !password || !fullName){
      return res.status(400).json({message: 'All fields are required'});
    }

    if(password.length < 6){
      return res.status(400).json({message: 'Password must be at least 6 characters long'});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists, please use a different email' });
    }

    // generate a random number between 1 and 100
    const ind = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar-placeholder.iran.liara.run/public/${ind}.png`;

    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePicture: randomAvatar,
    });

    const token = jwt.sign({userId : newUser._id}, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d'
    });

    // what does this do?
    // it sets a cookie in the response with the name 'token' and the value of the generated token
    // The cookie is set to be HTTP only, which means it cannot be accessed via JavaScript in the browser.
    // It also sets the SameSite attribute to 'strict', which helps prevent CSRF attacks.
    // The secure attribute is set to true in production, which means the cookie will only be sent over HTTPS.
    res.cookie('token', token, { 
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({success: true, message: 'User created successfully', user: newUser})
  } 
  catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({message: 'Internal server error'});
  }
}

export async function login(req, res) {
  
}
export function logout(req, res) {
  res.send('Logout Endpoint');
}