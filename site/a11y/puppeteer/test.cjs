const { loadPage } = require('@axe-core/puppeteer')
const puppeteer = require('puppeteer')

;(async () => {
	const browser = await puppeteer.launch()
	const axeBuilder = await loadPage(browser, 'https://mon-entreprise.urssaf.fr')
	const results = await axeBuilder.analyze()
	console.log(results.violations)

	await browser.close()
})()
