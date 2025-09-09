import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { argv } from 'node:process'

import Tinypool from 'tinypool'

import { absoluteSitePaths } from '../source/sitePaths.js'

const dev = argv.findIndex((val) => val === '--dev') > -1

const filenameExtension = dev ? 'js' : 'ts'
const filename = new URL(
	`./prerender-worker.${filenameExtension}`,
	import.meta.url
).href
const pool = new Tinypool({
	filename,
	idleTimeout: 2000,
})

const sitePathFr = absoluteSitePaths.fr
const sitePathEn = absoluteSitePaths.en

export const pagesToPrerender: {
	'mon-entreprise': string[]
	infrance: string[]
} = {
	'mon-entreprise': [
		'/iframes/pamc',
		'/iframes/simulateur-embauche',
		'/iframes/simulateur-independant',
		'/iframes/simulateur-autoentrepreneur',
		'/iframes/simulateur-assimilesalarie',
		'/iframes/simulateur-eurl',
		'/iframes/profession-liberale',
		'/iframes/auxiliaire-medical',
		'/iframes/medecin',
		'/iframes/choix-statut-juridique',
		sitePathFr.assistants['choix-du-statut'].index,
		sitePathFr.assistants['déclaration-charges-sociales-indépendant'],
		sitePathFr.assistants['déclaration-revenus-pamc'],
		sitePathFr.assistants['recherche-code-ape'],
		sitePathFr.index,
		sitePathFr.simulateursEtAssistants,
		sitePathFr.simulateurs.index,
		sitePathFr.simulateurs.comparaison,
		sitePathFr.simulateurs.dividendes,
		sitePathFr.simulateurs.eirl,
		sitePathFr.simulateurs.eurl,
		sitePathFr.simulateurs.indépendant,
		sitePathFr.simulateurs.is,
		sitePathFr.simulateurs.lodeom,
		sitePathFr.simulateurs.pamc,
		sitePathFr.simulateurs.salarié,
		sitePathFr.simulateurs.sasu,
		sitePathFr.simulateurs['artiste-auteur'],
		sitePathFr.simulateurs['auto-entrepreneur'],
		sitePathFr.simulateurs['cessation-activité'],
		sitePathFr.simulateurs['coût-création-entreprise'],
		sitePathFr.simulateurs['entreprise-individuelle'],
		sitePathFr.simulateurs['profession-libérale'].avocat,
		sitePathFr.simulateurs['profession-libérale'].auxiliaire,
		sitePathFr.simulateurs['profession-libérale']['chirurgien-dentiste'],
		sitePathFr.simulateurs['profession-libérale'].cipav,
		sitePathFr.simulateurs['profession-libérale']['expert-comptable'],
		sitePathFr.simulateurs['profession-libérale'].index,
		sitePathFr.simulateurs['profession-libérale'].médecin,
		sitePathFr.simulateurs['profession-libérale'].pharmacien,
		sitePathFr.simulateurs['profession-libérale']['sage-femme'],
		sitePathFr.simulateurs['réduction-générale'],
	].map((val) => encodeURI(val)),
	infrance: [
		sitePathEn.index,
		sitePathEn.simulateurs.salarié,
		'/iframes/simulateur-embauche',
	].map((val) => encodeURI(val)),
}

const redirects = await Promise.all(
	Object.entries(pagesToPrerender).flatMap(([site, urls]) =>
		urls.map(async (url) => {
			const path = await (pool.run({
				site,
				url,
				lang: site === 'mon-entreprise' ? 'fr' : 'en',
			}) as Promise<string>)

			// eslint-disable-next-line no-console
			console.log(`preredering ${url} done, adding redirect`)

			return `
[[redirects]]
	from = ":SITE_${site === 'mon-entreprise' ? 'FR' : 'EN'}${
		dev ? decodeURI(url) : url
	}"
	to = "/${path}"
	status = 200
${dev ? '  force = true\n' : ''}`
		})
	)
)

// Replace the #[prerender]# tag in netlify.toml if --netlify-toml-path is specified

const index = argv.findIndex((val) => val === '--netlify-toml-path')

if (index > -1 && argv[index + 1]) {
	const netlifyTomlPath = resolve(argv[index + 1])

	if (statSync(netlifyTomlPath).isFile()) {
		const data = readFileSync(netlifyTomlPath, { encoding: 'utf8' })

		if (/#\[prerender\]#/g.test(data)) {
			writeFileSync(
				netlifyTomlPath,
				data.replace(/#\[prerender\]#/g, redirects.join(''))
			)

			// eslint-disable-next-line no-console
			console.log('Redirects added to ' + netlifyTomlPath)
		} else {
			throw new Error('tag #[prerender]# not found in ' + netlifyTomlPath)
		}
	} else {
		throw new Error('this path is not a file' + netlifyTomlPath)
	}
}
