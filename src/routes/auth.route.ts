import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../lib/db";
import User from "../lib/models/user.model";

export const auth = new Hono();

// Connect to the database when this module is loaded
connectToDatabase().catch(err => {
  console.error("Failed to connect to database", err);
});

// Schema for registration validation
const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Schema for login validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

// Registration route - use / instead of /register since this is mounted at /auth
auth.post('/', zValidator('json', registerSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return c.json({ success: false, message: "Email already in use" }, 400);
    }
    
    // Create new user
    const newUser = new User({
      fullName: data.fullName,
      email: data.email,
      password: data.password
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: '7d' }
    );
    
    return c.json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      }
    }, 201);
    
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ success: false, message: "Failed to register user" }, 500);
  }
});

// Login route - use /login since auth is mounted at /auth
auth.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');
    
    // Find user by email and include password and passwordSalt fields
    const user = await User.findOne({ email }).select('+password +passwordSalt');
    
    // Check if user exists
    if (!user) {
      return c.json({ success: false, message: "Invalid email or password" }, 401);
    }
    
    // Verify password
    const isPasswordValid = user.verifyPassword(password);
    if (!isPasswordValid) {
      return c.json({ success: false, message: "Invalid email or password" }, 401);
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: '7d' }
    );
    
    return c.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      }
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ success: false, message: "Failed to log in" }, 500);
  }
});

// Route to get current user's profile
auth.get('/me', async (c) => {
  try {
    // Get token from Authorization header
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: "Authentication required" }, 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { userId: string };
    
    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return c.json({ success: false, message: "User not found" }, 404);
    }
    
    return c.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return c.json({ success: false, message: "Invalid token" }, 401);
    }
    
    console.error("Profile error:", error);
    return c.json({ success: false, message: "Failed to get user profile" }, 500);
  }
}); 