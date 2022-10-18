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

type ConversationMetaType = {
	email: string
	subject: string
	nickname: string
}

type CrispType = {
	authenticateTier: (
		type: string,
		identifier: string | undefined,
		key: string | undefined
	) => void
	website: {
		createNewConversation: (id: string) => { session_id: string }
		sendMessageInConversation: (
			website_id: string,
			session_id: string,
			params: SendMessageParamsType
		) => void
		updateConversationMetas: (
			website_id: string,
			session_id: string,
			meta: ConversationMetaType
		) => void
	}
}

const WEBSITE_ID = 'd8247abb-cac5-4db6-acb2-cea0c00d8524'

export const sendCrispMessage = async (body: BodyType) => {
	try {
		const { message, email, subject } = body || {}

		const CrispClient = new Crisp() as unknown as CrispType

		CrispClient.authenticateTier(
			'plugin',
			process.env.CRISP_API_IDENTIFIER,
			process.env.CRISP_API_KEY
		)

		// eslint-disable-next-line camelcase, @typescript-eslint/await-thenable
		const result = await CrispClient.website.createNewConversation(WEBSITE_ID)

		// eslint-disable-next-line camelcase
		const { session_id } = result

		// eslint-disable-next-line camelcase, @typescript-eslint/await-thenable
		await CrispClient.website.updateConversationMetas(WEBSITE_ID, session_id, {
			email,
			nickname: email,
			subject,
		})

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
