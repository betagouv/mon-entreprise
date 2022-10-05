import { botConfig, serverUrl } from '../config.js'
import { getUserChannels, sendMessage } from '../mattermost.js'
import { initMongodb } from '../mongodb.js'

const mongo = await initMongodb()

const oauth = await mongo.getOAuth()

if (!oauth) {
	throw new Error('No OAuth in database')
}

const { accessToken } = oauth

const standupChannel = (
	await getUserChannels({ serverUrl, accessToken, userId: 'me' })
).body.find(({ name }) => name === botConfig.channelName)

if (!standupChannel) {
	throw new Error('Standup channel not found')
}

const index = new Date().getDay() - 1
const nextDayMember = (await mongo.getWeeklyTeamOrder())?.memberIds[index]
const nextDayStandup = nextDayMember
	? `:arrow_forward: Demain, c'est ${nextDayMember} qui anime le stand-up.`
	: ''

const now = new Date()
	.toLocaleTimeString('fr', {
		hour: '2-digit',
		minute: '2-digit',
	})
	.replace(':', 'h')

await sendMessage({
	serverUrl,
	accessToken,
	channelId: standupChannel.id,
	message: `
Coucou tout le monde :wave:
Il est ${now}, l'heure des champion·ne·s, ou plutôt celle d'indiquer nos sujets pour le stand-up de demain.
_(Rappel : Je note ici ce dont je suis fier·e, ce sur quoi je bloque, ce que je veux montrer, ce dont j'ai besoin – aide, outillage… )_

${nextDayStandup}
`,
	props: botConfig.messageProps,
})

await mongo.close()
