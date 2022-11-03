import 'dotenv/config.js'

import algoliasearch from 'algoliasearch'

const {
	ALGOLIA_APP_ID,
	ALGOLIA_ADMIN_KEY,
	ALGOLIA_INDEX_PREFIX = '',
} = process.env

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)

const rulesIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}rules`)
const simulateursIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}simulateurs`)

rulesIndex.delete()
simulateursIndex.delete()
