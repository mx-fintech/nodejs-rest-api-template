const mysql = require('mysql');
const redis = require('redis');

class Database {
  constructor() {
    this.mysqlConfig = {
        connectionLimit: 1000,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_NAME,
        multipleStatements: true,
        ssl: true,
    };
    this.redisConfig = {
        url: process.env.REDIS_URL,
    };
    this.mysqlConnection = null;
    this.redisConnection = null;
  }

  getMySQLConnection() {
    if (!this.mysqlConnection) {
      this.mysqlConnection = mysql.createPool(this.mysqlConfig);
    }
    return this.mysqlConnection;
  }

  getRedisConnection() {
    if (!this.redisConnection) {
      this.redisConnection = redis.createClient(this.redisConfig);
    }
    return this.redisConnection;
  }
}

module.exports = Database;
