import mongoose from 'mongoose';
import { config } from './env.js';

let isDbConnected = false;

export async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isDbConnected = true;
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isDbConnected = false;
    console.warn(`[Database Warning] Could not connect to MongoDB at ${config.mongodbUri}: ${error.message}`);
    console.warn('[Database Warning] To connect to MongoDB:');
    console.warn('  1. Start local MongoDB service (mongod), OR');
    console.warn('  2. Set MONGODB_URI in server/.env with your free MongoDB Atlas URI: mongodb+srv://<user>:<password>@cluster.mongodb.net/skillpath');
    console.warn('[Database] Backend server will continue running. In-memory/mock fallback will be used for demo requests if DB is unreachable.');
  }
}

export function isDatabaseConnected() {
  return isDbConnected && mongoose.connection.readyState === 1;
}

export async function closeDatabase() {
  if (isDbConnected) {
    await mongoose.connection.close();
    isDbConnected = false;
    console.log('[Database] MongoDB connection closed');
  }
}

process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});
