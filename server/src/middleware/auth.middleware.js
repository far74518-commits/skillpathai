import { verifyToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';
import { isDatabaseConnected } from '../config/database.js';
import { DataStorageService } from '../services/dataStorage.service.js';

export async function authenticate(req, res, next) {
  try {
    let token = null;

    // 1. Check Authorization Bearer Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Check Cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication required. Please log in.');
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      throw ApiError.unauthorized('Invalid or expired authentication token. Please log in again.');
    }

    // Fetch user from DataStorageService (MongoDB or persistent store)
    const user = await DataStorageService.findUserById(decoded.id);
    if (!user) {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || 'user',
      };
    } else {
      req.user = user;
    }

    next();
  } catch (error) {
    next(error);
  }
}

// Optional auth: populates req.user if token is present, but doesn't block if not
export async function optionalAuth(req, res, next) {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        if (isDatabaseConnected()) {
          const user = await User.findById(decoded.id).select('-passwordHash');
          if (user) req.user = user;
        } else {
          req.user = { _id: decoded.id, id: decoded.id, email: decoded.email, name: decoded.name };
        }
      }
    }
    next();
  } catch (e) {
    next();
  }
}

// Require admin role
export function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.email !== 'admin@skillpath.ai')) {
    throw ApiError.forbidden('Administrative privileges required for this action');
  }
  next();
}
