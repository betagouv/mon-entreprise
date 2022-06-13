import { writeFileSync } from 'node:fs'
import {
	constructLocalizedSitePath,
	generateSiteMap,
} from '../source/sitePaths.js'

const basePathEn =
	process.env.VITE_EN_BASE_URL ?? 'http://localhost:3000/infrance'
const basePathFr =
	process.env.VITE_FR_BASE_URL ?? 'http://localhost:3000/mon-entreprise'

const enSiteMap = generateSiteMap(constructLocalizedSitePath('en')).map(
	(path) => basePathEn + path
)
const frSiteMap = generateSiteMap(constructLocalizedSitePath('fr')).map(
	(path) => basePathFr + path
)

writeFileSync('source/public/sitemap.en.txt', enSiteMap.join('\n') + '\n', {
	encoding: 'utf8',
})
writeFileSync('source/public/sitemap.fr.txt', frSiteMap.join('\n') + '\n', {
	encoding: 'utf8',
})
