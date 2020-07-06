import fs from 'fs'
import fetch from 'node-fetch'
import lines from './ecolab-URLs.js'

fetch('https://ecolab-data.netlify.app/co2.json')
	.then((res) => res.json())
	.then((json) => {
		const documentationLines = Object.keys(json).map(
			(dottedName) =>
				`https://ecolab.ademe.fr/apps/climat/documentation/${encodeRuleName(
					dottedName
				)}`
		)
		const text = documentationLines.join('\n')
		fs.writeFileSync('./sitemap.txt', lines + text, 'utf8')
		console.log('Sitemap mis à jour avec les dernières règles publicodes :)')
	})

/* Unfortunately, we can't yet import this function from engine/rules */
export let encodeRuleName = (name) =>
	name
		.replace(/\s\.\s/g, '/')
		.replace(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
		.replace(/\s/g, '-')
