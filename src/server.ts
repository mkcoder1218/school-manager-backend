import { EventEmitter } from 'events';
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase } from './db';

const start = async (): Promise<void> => {
  EventEmitter.defaultMaxListeners = 20;
  await connectDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port}`);
  });
};

start();
