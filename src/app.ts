import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { registerRoutes } from './routes';
import { errorHandler } from './core/middleware/errorHandler';
import { swaggerSpec } from './docs/swagger';

export const createApp = () => {
  const app = express();

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.use(express.json());

  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const router = express.Router();
  registerRoutes(router);
  app.use('/api', router);

  app.use(errorHandler);

  return app;
};
