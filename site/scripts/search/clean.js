import algoliasearch from 'algoliasearch'
import dotenv from 'dotenv'

dotenv.config()

const {
	ALGOLIA_APP_ID,
	ALGOLIA_ADMIN_KEY,
	ALGOLIA_INDEX_PREFIX = '',
} = process.env

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)

const rulesIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}rules`)
const simulateursIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}simulateurs`)

try {
	await Promise.all([rulesIndex.delete(), simulateursIndex.delete()])
} catch (error) {
	console.error(
		'Algolia clean failed:',
		JSON.stringify(
			{ name: error.name, message: error.message, status: error.status },
			null,
			2
		)
	)
	throw error
}
