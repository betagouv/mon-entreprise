interface ImportMetaEnv {
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
