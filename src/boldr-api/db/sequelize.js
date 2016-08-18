const Sequelize = require('sequelize');
const config = require('../core/config');

const envVar = process.env.POSTGRES_CONN_URI;

export const db = envVar || `postgres://${config.db.user}:${config.db.password}@${config.db.host}/${config.db.name}`;

const sequelize = new Sequelize(db, {
  logging: false, // set to console.log to see the raw SQL queries
  omitNull: false,
  native: false,
  define: {
    freezeTableName: true
  }
});

export default sequelize;