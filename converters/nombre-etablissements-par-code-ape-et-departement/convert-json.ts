/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { writeFileSync } from 'fs'
import got from 'got'
import { Writable } from 'node:stream'
import { join } from 'path'
import streamJson from 'stream-json'
import streamPick from 'stream-json/filters/Pick.js'
import streamValues from 'stream-json/streamers/StreamValues.js'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const OUTPUT_JSON_PATH = './output.json'

const url =
	'https://open.urssaf.fr/explore/dataset/etablissements-et-effectifs-salaries-au-niveau-commune-x-ape-last/download/?format=json&timezone=Europe/Berlin&lang=fr'

export interface Data {
	nombre_d_etablissements_2021: number
	code_ape: string
	ape: string
	code_departement: string
	departement: string
	region: string
}

export interface Out {
	data: Data[]
	indexByCodeApe: { [codeAPE: string]: number[] }
	indexByCodeDepartement: { [codeDepartement: string]: number[] }
}

const out: Out = {
	data: [],
	indexByCodeApe: {},
	indexByCodeDepartement: {},
}

const count = { code_ape: 0, code_departement: 0, total: 0 }
const stream = got
	.stream(url)
	.pipe(streamJson.parser())
	.pipe(streamPick.pick({ filter: /^\d+\.fields/ }))
	.pipe(streamValues.streamValues())
	.pipe(
		new Writable({
			objectMode: true,
			write(data: { value: Data }, _, cb) {
				const {
					nombre_d_etablissements_2021,
					code_ape,
					ape,
					code_departement,
					departement,
					region,
				} = data.value

				const elem: Data | null =
					nombre_d_etablissements_2021 > 0
						? {
								nombre_d_etablissements_2021,
								code_ape,
								ape,
								code_departement,
								departement,
								region,
						  }
						: null

				if (!elem) {
					return cb(null)
				}

				++count.total
				const log = [
					'[elements parsed]:',
					count.total,
					'[element added]:',
					out.data.length,
					'[estimated percentage done]:',
					// 730 codes ape * 100 départements
					Math.round((out.data.length * 100) / (730 * 100)).toString() + '%',
				]
				if (!(elem.code_ape in out.indexByCodeApe)) {
					console.log(
						'[new ape code]:',
						elem.code_ape,
						'[count]:',
						++count.code_ape,
						...log
					)
				}
				if (!(elem.code_departement in out.indexByCodeDepartement)) {
					console.log(
						'[new departement code]:',
						elem.code_departement,
						'[count]:',
						++count.code_departement,
						...log
					)
				}

				const actualAPE = out.indexByCodeApe[elem.code_ape] ?? []
				const actualDep =
					out.indexByCodeDepartement[elem.code_departement] ?? []

				const small =
					actualAPE.length < actualDep.length ? actualAPE : actualDep
				const large =
					actualAPE.length > actualDep.length ? actualAPE : actualDep

				let index = small.find(
					(a) =>
						large.includes(a) &&
						elem.code_ape === out.data[a].code_ape &&
						elem.code_departement === out.data[a].code_departement
				)

				if (typeof index === 'undefined') {
					index = out.data.length
					out.data.push(elem)
					out.indexByCodeApe[elem.code_ape] ??= []
					out.indexByCodeDepartement[elem.code_departement] ??= []
				} else {
					out.data[index].nombre_d_etablissements_2021 +=
						elem.nombre_d_etablissements_2021
				}

				if (!out.indexByCodeApe[elem.code_ape].includes(index)) {
					out.indexByCodeApe[elem.code_ape].push(index)
				}

				if (
					!out.indexByCodeDepartement[elem.code_departement].includes(index)
				) {
					out.indexByCodeDepartement[elem.code_departement].push(index)
				}

				cb(null)
			},
		})
	)

stream.on('error', (err: Error) => {
	console.error(err)
	throw err
})

stream.on('close', () => {
	console.log('close')

	writeFileSync(join(__dirname, OUTPUT_JSON_PATH), JSON.stringify(out, null, 1))
})

console.log('conversion in progress...')
