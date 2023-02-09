import parseCsv from 'csv-parser'
import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const FILENAME = 'NomenclatureGuichet_v1_26resana.csv'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const results = [] as Array<Activity>

fs.createReadStream(join(__dirname, FILENAME))
	.pipe(
		parseCsv({
			separator: ';',
			skipLines: 1,
			mapHeaders: ({ header }) =>
				(header.match(/.+?(?=\n)/)?.[0] ?? header).trim(),
			mapValues: ({ header, value }) =>
				(header === 'Codes APE compatibles' && value.split(' ; ')) || value,
		})
	)
	.on('data', (data) => results.push(data))
	.on('end', () => {
		fs.writeFileSync(
			join(__dirname, 'raw_output.json'),
			JSON.stringify(results)
		)

		fs.writeFileSync(
			join(__dirname, 'ape_tags.json'),
			JSON.stringify(computeAPETag(results))
		)
	})

type CodeAPE = string
type Activity = {
	'Niv. 1': string
	'Niv. 2': string
	'Niv. 3': string
	'Niv. 4': string
	'Codes APE compatibles': Array<CodeAPE>
}

function computeAPETag(
	results: Array<Activity>
): Record<CodeAPE, Array<string>> {
	return {}
}
