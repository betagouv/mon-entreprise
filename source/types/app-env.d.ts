declare module NodeJS {
	interface ProcessEnv {
		EN_SITE: string
		FR_SITE: string
		NODE_ENV: 'development' | 'production'
		MASTER: 'true' | 'false'
		GITHUB_API_SECRET: string
	}
}
