interface ImportMetaEnv {
	VITE_EN_BASE_URL: string
	VITE_FR_BASE_URL: string

	// Github actions env variables
	// https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables
	VITE_GITHUB_REF: string
	VITE_GITHUB_HEAD_REF: string
	VITE_GITHUB_SHA: string

	VITE_AT_INTERNET_SITE_ID: string

	VITE_ALGOLIA_INDEX_PREFIX: string
	VITE_ALGOLIA_SEARCH_KEY: string
	VITE_ALGOLIA_APP_ID: string

	VITE_COMPANY_SEARCH_HOST?: string

	VITE_REDUX_TRACE?: string

	/**
	 * @deprecated Use isProduction(), isStaging() or isDevelopment() from utils.ts instead
	 */
	MODE: string
	/**
	 * @deprecated Use isDevelopment() from utils.ts instead
	 */
	DEV: boolean
	/**
	 * @deprecated Use isProduction() from utils.ts instead
	 */
	PROD: boolean
}
