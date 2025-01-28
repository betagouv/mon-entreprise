import path from 'path'
import { fileURLToPath } from 'url'

import { buildRules } from '../scripts/build-rules.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

buildRules(
	'legacy',
	path.resolve(__dirname, './règles'),
	path.resolve(__dirname, './')
)
