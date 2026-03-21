import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'School Manager API',
      version: '0.1.0',
      description: 'Interactive API documentation for the School Manager backend',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local development' },
      { url: 'http://localhost:5000/api', description: 'Local development (api base)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['src/modules/**/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
