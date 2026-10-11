import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { startCronJobs } from './jobs/cron.js';

const startServer = async () => {
  await connectDB();

  startCronJobs();

  const server = app.listen(config.port, () => {
    console.log(`[PrepPath Server] Running in ${config.nodeEnv} mode on port ${config.port}`);
    console.log(`[PrepPath Server] Mock AI Mode: ${config.mockAi ? 'ENABLED' : 'DISABLED'}`);
  });

  const handleShutdown = () => {
    console.log('[PrepPath Server] Shutting down gracefully...');
    server.close(() => {
      console.log('[PrepPath Server] Closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
};

startServer();
