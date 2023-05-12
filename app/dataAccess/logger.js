const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    transports: [
        //new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/info.log' })
    ]
})

const debug = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: 'logs/debug.log' })
    ]
})

function obfuscateSensitiveData(object) {
    const obfuscatedObject = {...object}; // Clona el objeto original para no modificarlo
    // Reemplaza los valores de las propiedades "password" o "phone" por "***"
    if (obfuscatedObject.password) {
      obfuscatedObject.password = '***';
    }
    if (obfuscatedObject.phone) {
      obfuscatedObject.phone = '***';
    }
    return obfuscatedObject;
  }

module.exports = {logger, debug, obfuscateSensitiveData};