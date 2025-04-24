import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../services';
import MessageResponse from '../../interfaces/MessageResponse';
import { AuthenticatedRequest } from '../../interfaces/AuthenticatedRequest';
import { JWT_SECRET } from '../../config';

export const register = async (req: AuthenticatedRequest, res: Response<MessageResponse>) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' }); 
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.users.create({
      data: {
        username,
        password_hash,
      },
      select: { // Select only non-sensitive fields to return
        user_id: true,
        username: true,
        created_at: true,
        updated_at: true
      }
    });

    res.status(201).json({ message: 'User registered successfully', data: newUser });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};


export const login = async (req: AuthenticatedRequest, res: Response<MessageResponse>) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find user
    const user = await prisma.users.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
    }

    // Generate JWT
    const payload = {
      user_id: user.user_id,
      username: user.username,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

    // Return token and user info (excluding password)
    const { password_hash, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      data: {
        token,
        user: userWithoutPassword,
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

// --- Get Current User (Protected Route) ---
export const getMe = async (req: AuthenticatedRequest, res: Response<MessageResponse>) => {
  const userId = req.user?.user_id; // Get user ID from middleware

  if (!userId) {
    // This should technically be caught by middleware, but good practice to check
    return res.status(401).json({ message: 'Unauthorized - No user ID found' });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: { // Select only non-sensitive fields
        user_id: true,
        username: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Current user data fetched', data: user });

  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ message: 'Internal server error fetching user data' });
  }
};

export const authIndex = async (req: AuthenticatedRequest, res: Response<MessageResponse>) => {
  res.json({
    message: 'Auth route base working',
    data: ['Login', 'Register', 'GetMe (Protected)'],
  });
};

// Export all functions
export default {
  register,
  login,
  getMe,
  authIndex, // Include if keeping
};
