import app from './app.js';
import { config } from './config/env.js';
import { connectDatabase, closeDatabase } from './config/database.js';

let server;

async function startServer() {
  try {
    // 1. Connect to Database (with automatic fallback warning if local Mongo is unavailable)
    await connectDatabase();

    // Initialize Job Discovery Source Registry & Auto-scheduler
    try {
      const { JobSyncService } = await import('./services/jobSync.service.js');
      await JobSyncService.ensureSourcesRegistered();
      if (config.jobSync.enabled) {
        const intervalMs = config.jobSync.intervalMinutes * 60 * 1000;
        JobSyncService.startAutoScheduler(intervalMs);
        console.log(`[JobSync] Auto-scheduler started (${config.jobSync.intervalMinutes} min cycle)`);
      }
    } catch (e) {
      console.warn('[JobSync] Startup warning:', e.message);
    }

    // 2. Start HTTP server
    server = app.listen(config.port, '0.0.0.0', () => {
      console.log('='.repeat(60));
      console.log(`🚀 SkillPath AI Server running in [${config.nodeEnv}] mode`);
      console.log(`🌐 Base URL:      http://localhost:${config.port}`);
      console.log(`💓 Health Check:  http://localhost:${config.port}/health`);
      console.log(`📡 API Endpoints: http://localhost:${config.port}/api`);
      console.log(`🖥️  Frontend URL: ${config.clientUrl}`);
      console.log('='.repeat(60));
    });

    server.on('error', (err) => {
      console.error('[Server Error]', err);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful Shutdown
async function handleShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
  try {
    const { JobSyncService } = await import('./services/jobSync.service.js');
    JobSyncService.stopAutoScheduler();
  } catch (e) {}

  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed');
      await closeDatabase();
      process.exit(0);
    });
  } else {
    await closeDatabase();
    process.exit(0);
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection at Promise]', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]', error);
  process.exit(1);
});

startServer();

export { app, server };
