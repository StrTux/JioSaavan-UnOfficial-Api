import mongoose from 'mongoose';
import crypto from 'crypto';

// Define the interface for the User document
interface IUser extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  passwordSalt?: string;
  createdAt: Date;
  lastLogin?: Date;
  verifyPassword(candidatePassword: string): boolean;
}

// User schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't include password in query results by default
  },
  passwordSalt: {
    type: String,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
}, { 
  timestamps: true 
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Generate a salt
  const salt = crypto.randomBytes(16).toString('hex');
  this.passwordSalt = salt;
  
  // Hash the password with the salt
  const hash = crypto.pbkdf2Sync(this.password, salt, 1000, 64, 'sha512').toString('hex');
  this.password = hash;
  
  next();
});

// Method to check if password is correct
userSchema.methods.verifyPassword = function(candidatePassword: string): boolean {
  const hash = crypto.pbkdf2Sync(candidatePassword, this.passwordSalt, 1000, 64, 'sha512').toString('hex');
  return hash === this.password;
};

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);
export default User; 