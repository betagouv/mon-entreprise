if (process.env.NODE_ENV === 'production')
	module.exports = require('./App.prod')
else module.exports = require('./App.dev')
