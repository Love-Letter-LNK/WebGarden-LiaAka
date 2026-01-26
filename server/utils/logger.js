const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '../../access.log'),
    { flags: 'a' }
);

// Setup the logger
const fileLogger = morgan('combined', { stream: accessLogStream });

module.exports = fileLogger;
