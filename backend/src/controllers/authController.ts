import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/auth';

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, museumId: user.museumId },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, museumId } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email is already registered' });
      return;
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'MUSEUM_ADMIN',
      museumId: museumId || undefined,
    });

    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        museumId: user.museumId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate('museumId', 'name slug logo');
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        museumId: user.museumId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const user = await User.findById(req.user._id).populate('museumId').select('-password');
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
