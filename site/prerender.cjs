/* eslint-env node */
// TODO: Move to ESModule. But it was easier to make this script work with
// CommonJS when I wrote it.
// cf. https://github.com/vitejs/vite/blob/133fcea5223263b0ae08ac9a0422b55183ebd266/packages/vite/src/node/build.ts#L495
// cf. https://github.com/vitejs/vite/pull/2157

// TODO: We could use something like https://github.com/Aslemammad/tinypool to
// prerender all pages in parallel (used by vitest). Or move to SSR with a
// lambda and immutable caching.

const { readFileSync, promises: fs } = require('fs')
const path = require('path')
const { render } = require('./dist/server/entry-server.js')

const pagesToPrerender = {
	'mon-entreprise': [
		'/',
		'/créer',
		'/gérer',
		'/simulateurs',
		'/simulateurs/salaire-brut-net',
		'/simulateurs/chômage-partiel',
		'simulateurs/auto-entrepreneur',
		'simulateurs/indépendant',
		'simulateurs/dirigeant-sasu',
		'simulateurs/artiste-auteur',
		'iframes/simulateur-embauche',
		'iframes/pamc',
	],
	infrance: ['/', '/calculators/salary', '/iframes/simulateur-embauche'],
}

const templates = Object.fromEntries(
	Object.keys(pagesToPrerender).map((siteName) => [
		siteName,
		readFileSync(path.join(__dirname, `./dist/${siteName}.html`), 'utf-8'),
	])
)

;(async function () {
	await Promise.all(
		Object.entries(pagesToPrerender).flatMap(([site, urls]) =>
			urls.map((url) => prerenderUrl(url, site))
		)
	)
})()

async function prerenderUrl(url, site) {
	const lang = site === 'mon-entreprise' ? 'fr' : 'en'
	// TODO: replace helmet meta tags
	const { html, styleTags, helmet } = await render(url, lang)
	const page = templates[site]
		.replace('<!--app-html-->', html)
		.replace('<!--app-style-->', styleTags)
		.replace(/<title>.*<\/title>/, `<title>${helmet.title.toString()}</title>`)

	const dir = path.join(__dirname, 'dist/prerender', site, url)
	await fs.mkdir(dir, { recursive: true })
	await fs.writeFile(path.join(dir, 'index.html'), page)
}
