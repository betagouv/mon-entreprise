import { defineConfig } from 'cypress'

export default defineConfig({
	projectId: 'jxcngh',
	env: {
		language: 'fr',
	},
	chromeWebSecurity: false,
	e2e: {
		// eslint-disable-next-line
		setupNodeEvents(on, config) {},
		baseUrl: 'http://localhost:8888',
		specPattern: 'cypress/integration/mon-entreprise/**/*.{js,jsx,ts,tsx}',
	},
	retries: {
		// Configure retry attempts for `cypress run`
		// Default is 0
		runMode: 2,
		// Configure retry attempts for `cypress open`
		// Default is 0
		openMode: 0,
	},
})
