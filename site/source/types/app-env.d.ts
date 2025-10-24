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
	 * Feature toggle pour activer/désactiver le calcul des cotisations en économie collaborative
	 * Par défaut: 'false' - seule l'applicabilité des régimes est affichée
	 */
	VITE_ENABLE_ECONOMIE_COLLABORATIVE_COTISATIONS?: string

	/**
	 * @deprecated Use global variable IS_PRODUCTION, IS_STAGING or IS_DEVELOPMENT instead
	 */
	MODE: string
	/**
	 * @deprecated Use global variable IS_DEVELOPMENT instead
	 */
	DEV: boolean
	/**
	 * @deprecated Use global variable IS_PRODUCTION instead
	 */
	PROD: boolean
}

/**
 * Git branch name
 * This variable is statically replaced during the build
 */
declare const BRANCH_NAME: string

/**
 * This variable is statically replaced during the build
 */
declare const IS_PRODUCTION: boolean

/**
 * This variable is statically replaced during the build
 */
declare const IS_STAGING: boolean

/**
 * This variable is statically replaced during the build
 */
declare const IS_DEVELOPMENT: boolean

/**
 * This variable is statically replaced during the build
 */
declare const SENTRY_RELEASE_NAME: string
