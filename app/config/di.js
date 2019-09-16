/**
 *  Created by Femibams on 13/09/2019.
 */

const config = require('./config');
const serviceLocator = require('../lib/service_locator');
const winston = require('winston');
require('winston-daily-rotate-file');

const AuthService = require('../services/AuthService');
const AuthController = require('../controllers/AuthController');

const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;
/**
 * Returns an instance of logger
 */
serviceLocator.register('logger', () => {
  let fileTransport = null;
  if (config.logging.file) {
    fileTransport = new (winston.transports.DailyRotateFile)({
      filename: `${config.logging.file}`,
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: config.logging.level,
    });
  }

  const consoleTransport = new (winston.transports.Console)({
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    json: false,
    colorize: true,
    level: config.logging.level,
  });
  const availableTransports = [];
  if (config.logging.file) {
    availableTransports.push(fileTransport);
  }
  if (config.logging.console) {
    availableTransports.push(consoleTransport);
  }
  const winstonLogger = new (winston.createLogger)({
    transports: availableTransports,
  });
  return winstonLogger;
});


/**
 * Returns a Mongo connection instance.
 */

serviceLocator.register('mongo', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const connectionString =
    (!config.mongo.connection.username || !config.mongo.connection.password) ?
      `mongodb://${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}` :
      `mongodb://${config.mongo.connection.username}:${config.mongo.connection.password}` +
      `@${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}`;
  mongoose.Promise = bluebird;
  const mongo = mongoose.connect(connectionString);
  mongo.then(() => {
      console.log('Mongo Connection Established', connectionString)
  }).catch(() => {
      console.log('Mongo Connection disconnected');
      process.exit(1);
  });

  return mongo;
});


/**
 * Creates an instance of the Auth Service
 */
serviceLocator.register('authService', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const mongoclient = servicelocator.get('mongo');
  return new AuthService(logger, mongoclient);
});


/**
 * Creates an instance of the questions Controller
 */
serviceLocator.register('authController', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const authService = servicelocator.get('authService');
  return new AuthController(
    logger, authService
  );
});

module.exports = serviceLocator;
