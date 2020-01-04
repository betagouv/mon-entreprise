declare module NodeJS {
	interface ProcessEnv {
		EN_SITE: string
		FR_SITE: string
		NODE_ENV: 'development' | 'production'
		MASTER: boolean
	}
}
