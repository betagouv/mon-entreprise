import algoliasearch from 'algoliasearch/lite'

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID || ''
const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY || ''

export const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)

export const algoliaIndexPrefix =
	import.meta.env.VITE_ALGOLIA_INDEX_PREFIX || ''
