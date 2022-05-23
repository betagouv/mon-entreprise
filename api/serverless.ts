import serverless from 'serverless-http'
import { app } from './source/index.cjs'

const handler = serverless(app, {
	provider: 'aws',
})

export { handler }
