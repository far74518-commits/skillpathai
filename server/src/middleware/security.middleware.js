/**
 * Security Middleware: NoSQL Injection Sanitization & Request Hardening
 */

// Recursively strips any keys starting with "$" or containing "." to block MongoDB NoSQL operator injection
function cleanInput(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanInput);
  }

  const cleaned = {};
  for (const key of Object.keys(obj)) {
    // Drop keys that start with '$' (e.g. $gt, $ne, $regex) or contain '.' (prototype/nested property injection)
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleaned[key] = cleanInput(obj[key]);
  }

  return cleaned;
}

export function sanitizeRequest(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = cleanInput(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = cleanInput(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = cleanInput(req.params);
  }
  next();
}

// Blocks directory traversal attempts in URL paths
export function preventPathTraversal(req, res, next) {
  const decodedPath = decodeURIComponent(req.path || '').toLowerCase();
  if (
    decodedPath.includes('..') ||
    decodedPath.includes('/etc/') ||
    decodedPath.includes('c:\\') ||
    decodedPath.includes('.env') ||
    decodedPath.includes('package.json')
  ) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Malicious path detected.',
      errors: [],
    });
  }
  next();
}
