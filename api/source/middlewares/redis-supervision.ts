import Sentry from './sentry.js'

type ClientRedis = {
	on(événement: string, écouteur: (...args: unknown[]) => void): unknown
}

export const superviserRedis = (client: ClientRedis, nom: string): void => {
	client.on('error', (erreur) => {
		Sentry.captureException(erreur, { tags: { redis: nom } })
	})
}
