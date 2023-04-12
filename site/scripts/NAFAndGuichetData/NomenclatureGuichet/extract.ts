import parseCsv from 'csv-parser'
import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

import { computeGuichet } from './compute-guichet.js'

const FILENAME = 'NomenclatureGuichet_v1_32resana.csv'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const results = [] as Array<Activity>

type CodeAPE = string

type FormeExercice =
	| 'ACTIF AGRICOLE'
	| 'AGENT COMMERCIAL'
	| 'AGRICOLE (NON ACTIF)'
	| 'ARTISANALE_REGLEMENTEE'
	| 'ARTISANALE'
	| 'COMMERCIALE'
	| 'GESTION DE BIENS'
	| 'LIBERALE_NON_REGLEMENTEE'
	| 'LIBERALE_REGLEMENTEE'
	| 'Non applicable'

export type CodeGuichet = string
export type Activity = {
	'Niv. 1': string
	'Niv. 2': string
	'Niv. 3': string
	'Niv. 4': string
	"Métiers d'art": string
	'Code final': CodeGuichet
	'Codes APE compatibles': Array<CodeAPE>
	'Caisse de retraite spéciale':
		| 'CARDCF'
		| 'CARMF'
		| 'CARPIMKO'
		| 'CAVAMAC'
		| 'CAVEC'
		| 'CAVOM'
		| 'CAVP'
		| 'CIPAV'
		| 'CNBF'
		| 'CPRN'
		| ''
	'Affiliation si principale (hors prolongement agricole)':
		| 'MSA'
		| 'ACOSS'
		| 'ENIM'
	'Forme exercice Activité si  effectif < 11 (hors prolongement agricole)': FormeExercice
	"Forme exercice d'activité si JQPA non revendiquée (hors proongement agricole)": FormeExercice
	'Forme exercice Activité si prolongement agricole': FormeExercice
	'Encodage ACOSS': string
	'si microEntreprise = true, déduction de regimeImpositionBenefices': string
}

function computeAPETag(
	activities: Array<Activity>
): Record<CodeAPE, Array<string>> {
	return Object.fromEntries(
		Object.entries(
			activities.reduce(
				(
					acc,
					{
						'Codes APE compatibles': codesAPE,
						'Niv. 3': niv3,
						'Niv. 4': niv4,
						"Métiers d'art": métiers,
					}
				) => {
					codesAPE.forEach((codeAPE) => {
						acc[codeAPE] ??= new Set()
						acc[codeAPE].add(niv3).add(niv4).add(métiers)
					})

					return acc
				},
				{} as Record<CodeAPE, Set<string>>
			)
		).map(([key, value]) => [key, Array.from(value).filter(Boolean)])
	)
}

function computeApeToGuichet(
	activities: Array<Activity>
): Record<CodeAPE, Array<CodeGuichet>> {
	return activities.reduce(
		(acc, { 'Codes APE compatibles': codesAPE, 'Code final': codeGuichet }) => {
			codesAPE.forEach((codeAPE) => {
				acc[codeAPE] ??= []
				acc[codeAPE].push(codeGuichet)
			})

			return acc
		},
		{} as Record<CodeAPE, Array<CodeGuichet>>
	)
}

/* The following code reads a CSV file named `NomenclatureGuichet_v1_32resana.csv` using the `fs` module and
`csv-parser` library. It then processes the data and writes the results to four different JSON
files: `raw_output.json`, `ape_tags.json`, `ape_to_guichet.json` and `guichet.json`. */

fs.createReadStream(join(__dirname, FILENAME))
	.pipe(
		parseCsv({
			separator: ';',
			skipLines: 1,
			mapHeaders: ({ header }) =>
				(header.match(/.+?(?=\n)/)?.[0] ?? header).trim(),
			mapValues: ({ header, value }) =>
				(header === 'Codes APE compatibles' &&
					value
						.split(' ; ')
						.map((v: string) => v.trim())
						.filter(Boolean)) ||
				value,
		})
	)
	.on('data', (data) => results.push(data))
	.on('end', () => {
		fs.writeFileSync(
			join(__dirname, 'raw_output.json'),
			JSON.stringify(results, null, 2)
		)

		fs.writeFileSync(
			join(__dirname, 'ape_tags.json'),
			JSON.stringify(computeAPETag(results), null, 2)
		)

		fs.writeFileSync(
			join(__dirname, 'ape_to_guichet.json'),
			JSON.stringify(computeApeToGuichet(results), null, 2)
		)

		fs.writeFileSync(
			join(__dirname, 'guichet.json'),
			JSON.stringify(computeGuichet(results), null, 2)
		)
	})
