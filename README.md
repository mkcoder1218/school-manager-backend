# School Manager Backend

Backend foundation for a School Management System. This repository focuses on project structure, configuration, and core architecture only. Business logic will be added in later stages.

## Tech Stack
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Sequelize ORM
- Joi for validation
- UUID for identifiers

## Project Structure
```
src/
  config/
  core/
  modules/
  models/
  routes/
  types/
  app.ts
  server.ts

database/
  migrations/
  seeders/
```

## Setup
1. Copy env sample and update values as needed.

```
cp .env.example .env
```

2. Install dependencies.

```
npm install
```

3. Run in dev mode.

```
npm run dev
```

## Scripts
- `npm run dev` Start server with hot reload
- `npm run build` Build TypeScript
- `npm start` Run compiled server
- `npm run lint` Lint TypeScript files
- `npm run format` Format TypeScript files

## Notes
- Controllers and services are placeholders only.
- Models use UUID primary keys.
- Global error handler is structured but contains no logic.
