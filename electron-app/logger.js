const fs = require('fs');
const path = require('path');

const LOG_LEVELS = [
  'NONE',      // 0
  'CRITICAL',  // 1
  'ERROR',     // 2
  'WARNING',   // 3
  'INFO',      // 4
  'DEBUG'      // 5
];

let currentLogLevel = 3; // Default: WARNING
const logFilePath = path.join(__dirname, 'projectplanner.log');

function setLogLevel(level) {
  if (typeof level === 'string') {
    level = LOG_LEVELS.indexOf(level.toUpperCase());
  }
  if (level >= 0 && level <= 5) {
    currentLogLevel = level;
  }
}

function log(level, message, details = {}) {
  if (level > currentLogLevel || level === 0) return;
  const timestamp = new Date().toISOString();
  const levelName = LOG_LEVELS[level];
  const plainEnglish = details.plainEnglish || message;
  const technical = message;
  const entry = {
    timestamp,
    level: levelName,
    stage: details.stage || '',
    technical,
    plainEnglish,
    stack: details.stack || '',
    context: details.context || '',
    userAction: details.userAction || ''
  };
  // Write to console
  if (level <= 2) {
    console.error(`[${levelName}] ${plainEnglish}`);
    if (level === 1) console.error(details.stack || '');
  } else if (level === 3) {
    console.warn(`[${levelName}] ${plainEnglish}`);
  } else {
    console.log(`[${levelName}] ${plainEnglish}`);
  }
  // Write to file
  fs.appendFileSync(logFilePath, JSON.stringify(entry) + '\n');
}

module.exports = {
  LOG_LEVELS,
  setLogLevel,
  log,
  getLogLevel: () => currentLogLevel
};
