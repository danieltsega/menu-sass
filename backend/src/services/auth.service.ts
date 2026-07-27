import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { User, BlacklistedToken } from '../models';
import config from '../config';
import { JwtPayload, TokenPair } from '../types/auth';
import { Role } from '../types/enums';

const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

const generateTokenPair = (payload: JwtPayload): TokenPair => {
  const accessOptions: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] };
  const refreshOptions: SignOptions = { expiresIn: config.jwtRefreshExpiresIn as SignOptions['expiresIn'] };

  const accessToken = jwt.sign(payload, config.jwtSecret, accessOptions);
  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, refreshOptions);
  return { accessToken, refreshToken };
};

const verifyRefreshToken = (token: string): JwtPayload & { exp: number } => {
  return jwt.verify(token, config.jwtRefreshSecret) as JwtPayload & { exp: number };
};

export const register = async (name: string, email: string, password: string, role: Role) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('Email already in use');
  }

  const user = await User.create({ name, email, password, role });
  const payload: JwtPayload = { userId: user._id, role: user.role };
  const tokens = generateTokenPair(payload);

  return { user, tokens };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const payload: JwtPayload = { userId: user._id, role: user.role };
  const tokens = generateTokenPair(payload);

  return { user, tokens };
};

export const refresh = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  const hashed = hashToken(refreshToken);

  const blacklisted = await BlacklistedToken.findOne({ token: hashed });
  if (blacklisted) {
    throw new Error('Token has been revoked');
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    throw new Error('Invalid refresh token');
  }

  const payload: JwtPayload = { userId: user._id, role: user.role };
  const tokens = generateTokenPair(payload);

  return { user, tokens };
};

export const logout = async (refreshToken: string): Promise<void> => {
  const decoded = verifyRefreshToken(refreshToken);
  const hashed = hashToken(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  await BlacklistedToken.create({ token: hashed, expiresAt });
};