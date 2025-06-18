import { upsertStreamUser } from '../lib/stream.js';
import User from  '../models/User.js';
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

    const existingUser = await User.findOne({ email });
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

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePicture || " ",
      });
    } 
    catch (error) {
      console.error('Error upserting Stream user:', error);
    }

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
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({message: 'Email and password are required'});
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({message: 'Invalid password'});
    }

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d'
    });

    res.cookie('token', token, { 
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({success: true, message: 'Login successful', user});

  } 
  catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({message: 'Internal server error'});
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.status(200).json({success: true, message: 'Logout successful'});
}

export async function onBoard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ 
        message: 'All fields are required' ,
        misssing: [
          !fullName && 'fullName',
          !bio && 'bio',
          !nativeLanguage && 'nativeLanguage',
          !learningLanguage && 'learningLanguage',
          !location && 'location',
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId,{
      ...req.body,
      isOnboarded: true,
    }, { new: true });

    if(!updatedUser) {
      return res.status(404).json({message: 'User not found'});
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePicture || " ",
      });
    } catch (error) {
      console.error('Error upserting Stream user during onboarding:', error);
      return res.status(500).json({message: 'Error updating Stream user profile'});
    }

    res.status(200).json({success: true, message: 'User onboarded successfully', user: updatedUser});
  } 
  catch (error) {
    console.error('Error during onboarding:', error);
    res.status(500).json({message: 'Internal server error'});
  }
}