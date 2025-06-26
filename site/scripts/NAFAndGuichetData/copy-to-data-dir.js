import { copyFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

import { dataDir } from '../utils.js'

/* This code is copying three JSON files (`output.json`, `ape-to-guichet.json`, and `guichet.json`)
from their respective directories (`NAF-search` and `NomenclatureGuichet`) to the public
`data` directory */

copyFileSync(
	join(fileURLToPath(import.meta.url), '..', 'NAF-search', 'output.json'),
	join(dataDir, 'ape-search.json')
)

copyFileSync(
	join(
		fileURLToPath(import.meta.url),
		'..',
		'NomenclatureGuichet',
		'ape_to_guichet.json'
	),
	join(dataDir, 'ape-to-guichet.json')
)

copyFileSync(
	join(
		fileURLToPath(import.meta.url),
		'..',
		'NomenclatureGuichet',
		'guichet.json'
	),
	join(dataDir, 'guichet.json')
)
