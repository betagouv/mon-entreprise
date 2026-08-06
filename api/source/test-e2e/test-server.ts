import * as chai from 'chai'
import chaiHttp, { request } from 'chai-http'

import { app } from '../server.js'

chai.use(chaiHttp)

export const createTestApp = () => {
	return request.execute(app.callback()).keepOpen()
}
