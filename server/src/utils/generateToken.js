import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function generateToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return null;
  }
}

export function sendTokenResponse(user, statusCode, res, message = 'Success') {
  const token = generateToken({
    id: user._id || user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user',
  });

  const cookieOptions = {
    expires: new Date(Date.now() + config.cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  const sanitizedUser = user.toObject ? user.toObject() : { ...user };
  delete sanitizedUser.passwordHash;
  delete sanitizedUser.resetPasswordToken;
  delete sanitizedUser.resetPasswordExpires;

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      user: sanitizedUser,
    },
  });
}
