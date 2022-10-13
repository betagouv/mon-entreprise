import Crisp from 'crisp-api'

export type BodyType = {
	subject: string
	message: string
	email: string
}

type SendMessageParamsType = {
	type: string
	content: string
	from: string
	origin: string
	subject: string
}

type CrispType = {
	authenticateTier: (type: string, identifier: string, key: string) => void
	website: {
		createNewConversation: (id: string) => { session_id: string }
		listConversations: (id: string, number: number) => { session_id: string }
		sendMessageInConversation: (
			website_id: string,
			session_id: string,
			params: SendMessageParamsType
		) => void
	}
}

const TOKEN = {
	identifier: '41a6f139-d5c0-400c-b24a-807433e96403',
	key: '02a17e3a1612be8b3727879c8b65691c76eacea1581620fd9fe5435b8fbb1ba0',
}

const WEBSITE_ID = 'd8247abb-cac5-4db6-acb2-cea0c00d8524'

export const sendCrispMessage = async (body: BodyType) => {
	try {
		const { message, subject } = body || {}

		const CrispClient = new Crisp() as unknown as CrispType

		CrispClient.authenticateTier('plugin', TOKEN.identifier, TOKEN.key)

		// eslint-disable-next-line camelcase, @typescript-eslint/await-thenable
		const result = await CrispClient.website.createNewConversation(WEBSITE_ID)
		console.log(result)
		// eslint-disable-next-line camelcase
		const { session_id } = result
		console.log(session_id)

		CrispClient.website.sendMessageInConversation(
			WEBSITE_ID,
			session_id,

			{
				type: 'text',
				content: message,
				subject,
				from: 'operator',
				origin: 'chat',
			}
		)
	} catch (e) {
		console.log('error', e)
	}
}
