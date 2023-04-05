import { botConfig, serverUrl } from '../config.js'
import {
	getChannelMembers,
	getUser,
	getUserChannels,
	sendMessage,
} from '../mattermost.js'
import { initMongodb } from '../mongodb.js'
import { shuffleArray, snakeToCamelCaseKeys } from '../utils.js'

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

const standupChannelMembers = (
	await getChannelMembers({
		serverUrl,
		accessToken,
		channelId: standupChannel.id,
	})
).body.map((x) => snakeToCamelCaseKeys(x))

const standupMembers = await Promise.all(
	standupChannelMembers.map(({ userId }) =>
		getUser({ serverUrl, accessToken, userId }).then(({ body }) =>
			snakeToCamelCaseKeys(body)
		)
	)
)

while (standupMembers.length > 0 && standupMembers.length < 4) {
	standupMembers.push(...standupMembers)
}

const shuffleMembers = shuffleArray(standupMembers)

await mongo.setWeeklyTeamOrder(shuffleMembers.map(({ id }) => id))

const nextStandupOrder = botConfig.standupDays
	.map((day, i) =>
		shuffleMembers[i] ? `- ${day} : @${shuffleMembers[i].username}` : ''
	)
	.filter(<T>(x: T | null): x is T => x !== null)
	.join('\n')

const now = new Date()
	.toLocaleTimeString('fr', {
		timeZone: 'Europe/Paris',
		hour: '2-digit',
		minute: '2-digit',
	})
	.replace(':', 'h')

await sendMessage({
	serverUrl,
	accessToken,
	channelId: standupChannel.id,
	message: `
Il est ${now}, c'est déja la fin de semaine (ou presque pour certain :smile:) !

Voici l'ordre des animateurs proposé pour le stand-up de la semaine prochaine :
${nextStandupOrder}
`,
	props: botConfig.messageProps,
})

await mongo.close()
