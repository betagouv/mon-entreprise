/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const OUTPUT_JSON_PATH = './output.json'

const url =
	'https://open.urssaf.fr/api/explore/v2.1/catalog/datasets/nombre-detablissements-employeurs-et-effectifs-salaries-du-secteur-prive-france-/exports/json?lang=fr&timezone=Europe%2FBerlin'

export interface Data {
	nombre_d_etablissements_2021: number
	code_ape: string
}

export interface Out {
	[codeAPE: string]: number
}

const response = await fetch(url)
if (!response.ok) {
	throw new Error(`Error while fetching data : ${response.status}`)
}
const json: Array<Data> = await response.json()

const out = json.reduce((acc, { code_ape, nombre_d_etablissements_2021 }) => {
	acc[code_ape] = nombre_d_etablissements_2021 ?? 0

	return acc
}, {} as Out)

writeFileSync(join(__dirname, OUTPUT_JSON_PATH), JSON.stringify(out, null, 1))
