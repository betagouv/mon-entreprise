import chai from 'chai'
import chaiHttp from 'chai-http'

import { app } from '../server.js'

chai.use(chaiHttp)

export const createTestApp = () => {
	return chai.request(app.callback()).keepOpen()
}
