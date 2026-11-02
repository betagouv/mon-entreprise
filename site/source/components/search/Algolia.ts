import algoliasearch from 'algoliasearch/lite'

import { environnement } from '@/services/environnement'

export const searchClient = algoliasearch(
	environnement.algolia.appId,
	environnement.algolia.searchKey
)

export const algoliaIndexPrefix = environnement.algolia.préfixeIndex
