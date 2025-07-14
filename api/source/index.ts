import { app } from './server.js'

const port = process.env.PORT || 3004

const server = app.listen(port, function () {
	// eslint-disable-next-line no-console
	console.log('listening on port:', port)
})

export { app, server }
