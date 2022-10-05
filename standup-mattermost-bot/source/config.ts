import type { MattermostSendMessage } from './mattermost.js'

export const PORT = process.env.PORT || 4000
export const ORIGIN = process.env.ORIGIN || 'http://localhost:4000'
export const MONGO_URL = process.env.MONGO_URL
export const NODE_ENV = process.env.NODE_ENV

export const serverUrl = 'https://mattermost.incubateur.net'
export const clientSecret = 'pgnch7w643yfdkdjnnjcxhpsoe'
export const clientId = 'wbkot91tjbd6byn4fbmrtu8h6o'
export const redirectUri = `${ORIGIN}/oauth`

const days = [
	'Lundi',
	'Mardi',
	'Mercredi',
	'Jeudi',
	'Vendredi',
	'Samedi',
	'Dimanche',
]

interface BotConfig {
	channelName: string
	standupDays: string[]
	messageProps: MattermostSendMessage['props']
}

export const botConfig: BotConfig = {
	channelName:
		NODE_ENV !== 'production'
			? 'startup-monentreprise-dev-bot-stand-up'
			: 'startup-monentreprise-stand-up',
	standupDays: days.slice(0, 4),
	messageProps: {
		from_webhook: 'true',
		override_username: 'L’URSSAF est votre amie',
		override_icon_url:
			'https://mon-entreprise.urssaf.fr/favicon/favicon-32x32.png?v=2.0',
	},
}
