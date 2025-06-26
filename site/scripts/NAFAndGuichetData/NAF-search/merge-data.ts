import { writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

import { Data as RawApeData } from '../extract-NAF-data/convert-pdf.js'
import rawApeData from '../extract-NAF-data/output.json' assert { type: 'json' }
import { Out as NbEtablissementsData } from '../nombre-etablissements-par-code-ape/fetch-json.js'
import rawEtablissementsData from '../nombre-etablissements-par-code-ape/output.json' assert { type: 'json' }
import rawApeTags from '../NomenclatureGuichet/ape_tags.json' assert { type: 'json' }
import { customTags } from './custom-tags.js'
import { multipleCf } from './custom.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const OUTPUT_JSON_PATH = join(__dirname, './output.json')

const apeData = rawApeData as RawApeData[]
const etablissementsData = rawEtablissementsData as NbEtablissementsData
const apeTags = rawApeTags as Record<string, string[]>

interface ApeData {
	codeApe: string
	title: string
	data: string[]
	contenuCentral: string[]
	contenuAnnexe: string[]
	contenuExclu: string[]
}

export interface Output {
	/**
	 * Données textuel pour chaque code APE
	 */
	apeData: ApeData[]

	/**
	 * Nombre d'établissement par code APE,
	 */
	indexByCodeApe: NbEtablissementsData
}

const sousClasses = apeData.filter(({ type }) => type === 'sousClasse')

const index: Record<string, number> = sousClasses.reduce(
	(obj, val, i) => ({ ...obj, [val.code]: i }),
	{}
)

const addContenuExcluToContenuCentral: number[][] = []
const output: Output = {
	apeData: sousClasses.map(
		(
			{
				code: codeApe,
				title,
				data,
				contenuCentral,
				contenuAnnexe,
				contenuExclu,
			},
			i
		) => {
			contenuExclu.forEach((exclu, j) => {
				const matchs = Array.from(
					exclu.matchAll(/\(cf\. (?:([0-9A-Z.]+)(?:, )?)+\)/g)
				)
				if (matchs.length > 1 && !(exclu in multipleCf)) {
					console.error(
						'Une phrase contenant plusieurs "cf." est manquante dans le fichier custom.ts:',
						exclu
					)
				}

				if (matchs.length === 1) {
					const codes = [...matchs[0]]
					codes.shift()
					codes
						.map((k) => index?.[k])
						.filter((x) => typeof x !== 'undefined')
						.forEach((index) => {
							addContenuExcluToContenuCentral.push([i, j, index])
						})
				}
			})

			return {
				codeApe,
				title,
				data,
				contenuCentral: contenuCentral.concat(
					apeTags[codeApe]?.filter((el) => el) ?? [],
					customTags[codeApe]?.contenuCentral ?? []
				),
				contenuAnnexe: contenuAnnexe.concat(
					customTags[codeApe]?.contenuAnnexe ?? []
				),
				contenuExclu: contenuExclu.concat(
					customTags[codeApe]?.contenuExclu ?? []
				),
			}
		}
	),

	indexByCodeApe: etablissementsData,
}

addContenuExcluToContenuCentral.forEach(([i, j, index]) => {
	output.apeData[index].contenuCentral.push(
		output.apeData[i].contenuExclu[j].replace(/\s+\(cf\. [0-9A-Z,. ]+\)/, '')
	)
	output.apeData[index].contenuCentral = Array.from(
		new Set(output.apeData[index].contenuCentral)
	)
})

Object.values(multipleCf).forEach((obj) => {
	Object.entries(obj).forEach(([code, { contenuCentral }]) => {
		if (index[code]) {
			output.apeData[index[code]].contenuCentral.push(...contenuCentral)

			output.apeData[index[code]].contenuCentral = Array.from(
				new Set(output.apeData[index[code]].contenuCentral)
			)
		}
	})
})

output.apeData = output.apeData.map(
	({ contenuCentral, contenuAnnexe, contenuExclu, ...rest }) => ({
		contenuAnnexe: contenuAnnexe.map(
			(text) => text[0].toUpperCase() + text.slice(1)
		),
		contenuExclu: contenuExclu.map(
			(text) => text[0].toUpperCase() + text.slice(1)
		),
		contenuCentral: contenuCentral.reduce((acc, text) => {
			if (text.startsWith('•')) {
				acc[acc.length - 1] = acc[acc.length - 1] + '\n' + text.slice(2)
			} else {
				acc.push(text[0].toUpperCase() + text.slice(1))
			}

			return acc
		}, [] as string[]),
		...rest,
	})
)

writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(output, null, 2))
