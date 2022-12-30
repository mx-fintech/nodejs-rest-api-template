const mysql = require('mysql');
const redis = require('redis');

class Database {
  constructor(mysqlConfig, redisConfig) {
    this.mysqlConfig = {
        connectionLimit:1000,
        host    : process.env.MYSQL_HOST,
        user    : process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        port    : process.env.MYSQL_PORT,
        database: process.env.MYSQL_NAME,
        multipleStatements: true,
        ssl:true
    };
    this.redisConfig = {
        url: process.env.REDIS_URL 
    };
  }

  getMySQLConnection() {
    return mysql.createPool(this.mysqlConfig);
  }

  getRedisConnection() {
    return redis.createClient(this.redisConfig);
  }
}

module.exports = Database;
