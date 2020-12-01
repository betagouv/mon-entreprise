declare namespace NodeJS {
	interface ProcessEnv {
		EN_SITE: string
		FR_SITE: string
		NODE_ENV: 'development' | 'production' | 'test'
		ANALYZE_BUNDLE: '0' | '1'

		// Netlify variables
		// https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables
		HEAD: string
		COMMIT_REF: string

		// .env variables
		GITHUB_API_SECRET: string
		DEEPL_API_SECRET: string
		INSEE_SIRENE_API_SECRET: string
	}
}
