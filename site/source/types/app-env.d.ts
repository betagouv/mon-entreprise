declare namespace NodeJS {
	interface ProcessEnv {
		EN_BASE_URL: string
		FR_BASE_URL: string
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
		ATINTERNET_API_ACCESS_KEY: string
		ATINTERNET_API_SECRET_KEY: string
		ZAMMAD_API_SECRET_KEY: string
	}

	interface Global {
		SC_DISABLE_SPEEDY: boolean
	}
}

interface ImportMeta {
	env: {
		MODE: 'development' | 'production' | 'test'

		VITE_EN_BASE_URL: string
		VITE_FR_BASE_URL: string

		// Github actions env variables
		// https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables
		VITE_GITHUB_REF: string
		VITE_GITHUB_HEAD_REF: string
		VITE_GITHUB_SHA: string
		VITE_GIT_HEAD: string

		VITE_AT_INTERNET_SITE_ID: string
		VITE_ATINTERNET_API_ACCESS_KEY: string
		VITE_ATINTERNET_API_SECRET_KEY: string

		VITE_ALGOLIA_INDEX_PREFIX: string
		VITE_ALGOLIA_SEARCH_KEY: string
		VITE_ALGOLIA_APP_ID: string

		VITE_REDUX_TRACE: string
	}
}
