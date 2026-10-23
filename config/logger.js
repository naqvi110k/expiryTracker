/**
 * Structured Logging Utility
 * 
 * Provides consistent, JSON-formatted logging across the application
 * Log levels: debug, info, warn, error
 * 
 * Usage:
 *   const logger = require('../config/logger');
 *   logger.info('Action completed', { userId, duration, status });
 * 
 * Output Format:
 *   {
 *     "timestamp": "2026-04-02T10:30:45.123Z",
 *     "level": "INFO",
 *     "message": "Product saved",
 *     "userId": "507f1f77bcf86cd799439011",
 *     "productId": "507f1f77bcf86cd799439012",
 *     "duration": 125
 *   }
 * 
 * in Production: Send to external service (Datadog, Sentry, CloudWatch)
 * in Development: Pretty-printed console output
 */

class Logger {
	constructor(isDevelopment = true) {
		this.isDevelopment = isDevelopment;
	}

	_format(level, message, meta = {}) {
		const logEntry = {
			timestamp: new Date().toISOString(),
			level: level.toUpperCase(),
			message,
			...meta
		};
		return logEntry;
	}

	_output(logEntry) {
		const logString = JSON.stringify(logEntry);

		if (this.isDevelopment) {
			const colors = {
				DEBUG: '\x1b[36m',
				INFO: '\x1b[32m',
				WARN: '\x1b[33m',
				ERROR: '\x1b[31m'
			};
			const reset = '\x1b[0m';
			const color = colors[logEntry.level] || '';
			console.log(`${color}[${logEntry.timestamp}] ${logEntry.level}: ${logEntry.message}${reset}`, logEntry);
		} else {
			console.log(logString);
		}
	}

	debug(message, meta) {
		const logEntry = this._format('debug', message, meta);
		if (this.isDevelopment) this._output(logEntry);
	}

	info(message, meta) {
		const logEntry = this._format('info', message, meta);
		this._output(logEntry);
	}

	warn(message, meta) {
		const logEntry = this._format('warn', message, meta);
		this._output(logEntry);
	}

	error(message, error, meta) {
		const logEntry = this._format('error', message, {
			error: error?.message || String(error),
			stack: error?.stack,
			...meta
		});
		this._output(logEntry);
	}
}

const isDev = process.env.NODE_ENV !== 'production';
module.exports = new Logger(isDev);
