import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token");
        
    }
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!(name && email && password )) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userExists = await User.findOne({email});

    if (userExists) {
      return res.status(409).json({ success: false, message: "User with phone or email already exists" });
    }

    const user = await User.create({ name, email, password });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
      return res.status(500).json({ success: false, message: "Error creating user" });
    }

    return res.status(201).json({
      success: true,
      data: createdUser,
      message: "User registered successfully",
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!(  email) || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find user by email or phone
        const user = await User.findOne({  email  });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Verify password
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        // Fetch logged-in user details (excluding sensitive fields)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        // Set cookies

        user.lastLogin = new Date();
        await user.save();

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
        };

        // Send response
        res.status(200)
           .cookie("accessToken", accessToken, options)
           .cookie("refreshToken", refreshToken, options)
           .json({
               message: "User logged in successfully",
               user: loggedInUser,
               token:accessToken
           });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  const { name, location, yearsExperience, skills, preferredJobType } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, location, yearsExperience, skills, preferredJobType },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutUser = async(req,res)=>{
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({message:"Logged out successfully"});
}


export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    logoutUser,

}