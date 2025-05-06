import { clientId, clientSecret, redirectUri, serverUrl } from '../config.js'
import { initMongodb } from '../mongodb.js'
import { refreshAccessToken } from '../oauth.js'
import { snakeToCamelCaseKeys } from '../utils.js'

const mongo = await initMongodb()

const oauth = await mongo.getOAuth()

if (!oauth) {
	throw new Error('No OAuth in database')
}

const { refreshToken } = oauth

const newToken = await refreshAccessToken({
	serverUrl,
	refreshToken,
	redirectUri,
	clientId,
	clientSecret,
})

await mongo.saveOAuth(snakeToCamelCaseKeys(newToken.body))

await mongo.close()
