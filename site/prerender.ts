import { writeFileSync } from 'node:fs'
import Tinypool from 'tinypool'
import { constructLocalizedSitePath } from './source/sitePaths.js'

const filename = new URL('./prerender-worker.js', import.meta.url).href
const pool = new Tinypool({ filename })

const sitePathFr = constructLocalizedSitePath('fr')
const sitePathEn = constructLocalizedSitePath('en')

export const pagesToPrerender: {
	'mon-entreprise': string[]
	infrance: string[]
} = {
	'mon-entreprise': [
		sitePathFr.index,
		sitePathFr.créer.index,
		sitePathFr.gérer.index,
		sitePathFr.simulateurs.index,
		sitePathFr.simulateurs.salarié,
		sitePathFr.simulateurs['chômage-partiel'],
		sitePathFr.simulateurs['auto-entrepreneur'],
		sitePathFr.simulateurs.indépendant,
		sitePathFr.simulateurs.sasu,
		sitePathFr.simulateurs['artiste-auteur'],
		'/iframes/simulateur-embauche',
		'/iframes/pamc',
	],
	infrance: [
		sitePathEn.index,
		sitePathEn.simulateurs.salarié,
		'/iframes/simulateur-embauche',
	],
}

if (process.env.GENERATE_PRERENDER_PATHS_JSON) {
	// This json file is used in e2e cypress test
	writeFileSync(
		'cypress/prerender-paths.json',
		JSON.stringify(pagesToPrerender)
	)
	console.log('cypress/prerender-paths.json was generated!')

	process.exit()
}

await Promise.all(
	Object.entries(pagesToPrerender).flatMap(([site, urls]) =>
		urls.map((url) =>
			pool.run({ site, url, lang: site === 'mon-entreprise' ? 'fr' : 'en' })
		)
	)
)
