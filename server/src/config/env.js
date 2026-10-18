import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillpathai',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'skillpath_super_secure_jwt_secret_key_2026_student_planner_xyz',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieExpiresDays: parseInt(process.env.COOKIE_EXPIRES_DAYS, 10) || 7,
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  },
  email: {
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'SkillPath AI <no-reply@skillpathai.edu>'
  },
  jobSync: {
    intervalMinutes: parseInt(process.env.JOB_SYNC_INTERVAL_HOURS, 10)
      ? parseInt(process.env.JOB_SYNC_INTERVAL_HOURS, 10) * 60
      : (parseInt(process.env.JOB_SYNC_INTERVAL_MINUTES, 10) || 360), // default 6 hours (360 mins)
    enabled: process.env.JOB_SYNC_ENABLED !== 'false',
    initialRun: process.env.JOB_SYNC_INITIAL_RUN === 'true',
    stalenessDays: parseInt(process.env.JOB_STALENESS_DAYS, 10) || 30,
    maxRetries: parseInt(process.env.JOB_SYNC_MAX_RETRIES, 10) || 2,
    timeoutMs: parseInt(process.env.JOB_SYNC_TIMEOUT_MS, 10) || 8000,
  }
};
