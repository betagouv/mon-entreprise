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
})
