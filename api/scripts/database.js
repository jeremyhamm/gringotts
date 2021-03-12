const postgres = require('postgres');

/**
 * Get DB connection
 * 
 * @return {string}
 */
const getDBConnection = () => {
  return postgres(`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
}

module.exports = {
  getDBConnection
}