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
		experimentalRunAllSpecs: true,
		experimentalStudio: true,
	},
	retries: {
		// Configure retry attempts for `cypress run` (Github Action)
		// Default is 0
		runMode: 3,
		// Configure retry attempts for `cypress open` (yarn test:cypress)
		// Default is 0
		openMode: 1,
	},
	videoCompression: 30,
	videoUploadOnPasses: false,
})
