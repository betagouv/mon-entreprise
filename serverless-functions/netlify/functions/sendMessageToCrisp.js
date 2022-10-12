import { builder } from '@netlify/functions'
const Crisp = require('node-crisp-api')

const TOKEN = {
	identifier: '700503b9-ffca-41c2-800f-1536815ca1bd',
	key: '73e94700137031f3c08d644fd66abb7f955f02d4d030177dcee1c556bd483613',
}

const WEBSITE_ID = 'd8247abb-cac5-4db6-acb2-cea0c00d8524'

const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
}

const myHandler = async (event) => {
	const { message, email } = JSON.parse(event.body)

	const CrispClient = new Crisp()

	CrispClient.authenticateTier('plugin', TOKEN.identifier, TOKEN.key)

	const sessionId = CrispClient.website.createNewConversation(WEBSITE_ID)

	const data = await CrispClient.website.sendMessageInConversation(
		WEBSITE_ID,
		sessionId,

		{
			type: 'text',
			content: message,
			from: email,
			origin: 'chat',
		}
	)

	console.info('Sent message.', data)

	return {
		statusCode: 200,
		headers,
		body: JSON.stringify({ message: 'Hello World' }),
	}
}

const handler = builder(myHandler)

export { handler }
