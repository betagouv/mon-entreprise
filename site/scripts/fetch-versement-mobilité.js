import { writeInDataDir } from './utils.js'

const CURRENT_YEAR = 2026
const CSV_URL =
	'https://fichierdirect.declaration.urssaf.fr/static/tauxTransport.20260106.csv'

const INDEX = {
	TAUX: 2,
	CODE_COMMUNE: 0,
	DATE_EFFET: 4,
}

const response = await fetch(CSV_URL)
const rawCSV = await response.text()
const data = rawCSV
	.split('\n')
	.slice(1, -1)
	.map((row) => row.split(';'))
	.filter((r) => r[INDEX.TAUX] !== '0')
	.filter((r) => !r[INDEX.DATE_EFFET].startsWith((CURRENT_YEAR + 1).toString()))
	.map((r) => {
		r[INDEX.CODE_COMMUNE] = r[INDEX.CODE_COMMUNE].slice(1, -1) // Remove single quote ''
		return r
	})
	.sort((a, b) =>
		+a[INDEX.CODE_COMMUNE] < +b[INDEX.CODE_COMMUNE]
			? -1
			: +a[INDEX.CODE_COMMUNE] > +b[INDEX.CODE_COMMUNE]
			? 1
			: a[INDEX.DATE_EFFET] > b[INDEX.DATE_EFFET]
			? -1
			: 1
	)
	.reduce(
		(acc, r) => ({
			[r[INDEX.CODE_COMMUNE]]: +r[INDEX.TAUX],
			...acc,
		}),
		{}
	)

writeInDataDir('versement-mobilité.json', data)
