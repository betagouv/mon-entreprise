import { defineConfig } from 'cypress'

export default defineConfig({
	projectId: 'jxcngh',
	env: {
		language: 'fr',
	},
	chromeWebSecurity: false,
	e2e: {
		// eslint-disable-next-line
		setupNodeEvents(on, config) {
			on('before:browser:launch', (browser, launchOptions) => {
				if (browser.name === 'chrome' && browser.isHeadless) {
					const version = typeof browser.majorVersion === 'string' ? parseInt(browser.majorVersion) : browser.majorVersion
					if (version >= 112) {
						launchOptions.args.push('--headless=new')
					}
				}

				return launchOptions
			})
		},
		baseUrl: 'http://localhost:3000/mon-entreprise',
		specPattern: 'cypress/integration/mon-entreprise/**/*.{js,jsx,ts,tsx}',
		experimentalRunAllSpecs: true,
		experimentalStudio: true,
	},
	retries: {
		// Configure retry attempts for `cypress run` (Github Action)
		// Default is 0
		runMode: 3,
	},
	videoCompression: 30,
	videoUploadOnPasses: false,
})
