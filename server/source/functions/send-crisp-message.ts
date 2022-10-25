import Crisp from 'crisp-api'

const CRISP_API_IDENTIFIER = process.env.CRISP_API_IDENTIFIER
const CRISP_API_KEY = process.env.CRISP_API_KEY
const WEBSITE_ID = process.env.CRISP_WEBSITE_ID

if (!CRISP_API_IDENTIFIER) {
	throw new Error('Empty CRISP_API_IDENTIFIER env var')
}
if (!CRISP_API_KEY) {
	throw new Error('Empty CRISP_API_KEY env var')
}
if (!WEBSITE_ID) {
	throw new Error('Empty WEBSITE_ID env var')
}

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
		createNewConversation: (id: string) => Promise<{ session_id: string }>
		sendMessageInConversation: (
			website_id: string,
			session_id: string,
			params: SendMessageParamsType
		) => void
		updateConversationMetas: (
			website_id: string,
			session_id: string,
			meta: ConversationMetaType
		) => Promise<void>
	}
}

export const sendCrispMessage = async (body: BodyType) => {
	try {
		const { message, email, subject } = body || {}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const CrispClient = new Crisp() as unknown as CrispType

		CrispClient.authenticateTier('plugin', CRISP_API_IDENTIFIER, CRISP_API_KEY)

		const result = await CrispClient.website.createNewConversation(WEBSITE_ID)

		const { session_id: sessionId } = result

		await CrispClient.website.updateConversationMetas(WEBSITE_ID, sessionId, {
			email,
			nickname: email,
			subject,
		})

		CrispClient.website.sendMessageInConversation(
			WEBSITE_ID,
			sessionId,

			{
				type: 'text',
				content: message,
				subject,
				from: 'user',
				origin: 'email',
			}
		)
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e)
	}
}
