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
		baseUrl: 'http://localhost:3000/mon-entreprise',
		specPattern: 'cypress/integration/mon-entreprise/**/*.{js,jsx,ts,tsx}',
	},
	retries: {
		// Configure retry attempts for `cypress run`
		// Default is 0
		runMode: 3,
		// Configure retry attempts for `cypress open`
		// Default is 0
		openMode: 0,
	},
	videoCompression: 30,
	videoUploadOnPasses: false,
})
