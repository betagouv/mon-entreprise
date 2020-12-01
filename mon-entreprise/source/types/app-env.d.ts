declare namespace NodeJS {
	interface ProcessEnv {
		EN_SITE: string
		FR_SITE: string
		NODE_ENV: 'development' | 'production' | 'test'
		ANALYZE_BUNDLE: '0' | '1'

		// Github actions env variables
		// https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables
		GITHUB_REF: string
		GITHUB_SHA: string

		// .env variables
		GITHUB_API_SECRET: string
		DEEPL_API_SECRET: string
		INSEE_SIRENE_API_SECRET: string
	}
}
