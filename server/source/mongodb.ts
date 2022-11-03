import { MongoClient } from 'mongodb'

import { MONGO_URL } from './config.js'

interface OAuthCollection {
	accessToken: string
	refreshToken: string
}
interface MemberIds {
	memberIds: string[]
}

export const initMongodb = async () => {
	const client = new MongoClient(MONGO_URL)
	await client.connect()

	const db = client.db('bot')

	return {
		saveOAuth: ({ accessToken, refreshToken }: OAuthCollection) => {
			const collection = db.collection<OAuthCollection>('oauth')

			return collection.findOneAndReplace(
				{},
				{ accessToken, refreshToken },
				{ upsert: true }
			)
		},

		getOAuth: () => {
			const collection = db.collection<OAuthCollection>('oauth')

			return collection.findOne()
		},

		setWeeklyTeamOrder: (memberIds: string[]) => {
			const collection = db.collection<MemberIds>('weeklyTeamOrder')

			return collection.findOneAndReplace({}, { memberIds }, { upsert: true })
		},

		getWeeklyTeamOrder: () => {
			const collection = db.collection<MemberIds>('weeklyTeamOrder')

			return collection.findOne()
		},

		close: () => client.close(),
	}
}
