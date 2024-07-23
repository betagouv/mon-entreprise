import { MultipleQueriesQuery } from '@algolia/client-search'
import algoliasearch from 'algoliasearch/lite'

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID || ''
const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY || ''

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)

// Désactive les requêtes à Algolia pour les recherches vides
// https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/js/#detecting-empty-search-requests
const searchClient = {
	...algoliaClient,
	search(requests: Array<MultipleQueriesQuery>) {
		if (requests.every(({ params }) => !params?.query)) {
			return Promise.resolve({
				results: requests.map(() => ({
					hits: [],
					nbHits: 0,
					nbPages: 0,
					page: 0,
					processingTimeMS: 0,
					hitsPerPage: 0,
					exhaustiveNbHits: false,
					query: '',
					params: '',
				})),
			})
		}

		return algoliaClient.search(requests)
	},
}

export default searchClient
