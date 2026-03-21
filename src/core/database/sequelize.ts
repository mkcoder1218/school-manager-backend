import { Sequelize } from 'sequelize';
import { env } from '../../config/env';

const dbHost = env.database.host;
const dbPort = env.database.port;
const dbUser = env.database.user;
const dbPass = env.database.password;
const dbName = env.database.name;

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
  },
});
