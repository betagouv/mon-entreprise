if (process.env.NODE_ENV === 'production')
	module.exports = require('./entry.prod')
else module.exports = require('./entry.dev')
