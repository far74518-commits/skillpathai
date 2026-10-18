import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;

    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const formatted = error.errors.map((e) => ({
        field: e.path.slice(1).join('.') || e.path[0] || 'field',
        message: e.message,
      }));
      return next(new ApiError(400, 'Invalid request data', formatted));
    }
    next(error);
  }
};
