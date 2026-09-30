import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`✨ Veya Beauty Studio API running at http://localhost:${config.port}/api/v1`);
  console.log(`🌿 Environment: ${config.nodeEnv}`);
});

server.on('error', (err: any) => {
  console.error(`❌ Server error on port ${config.port}:`, err.message);
});

export default server;
