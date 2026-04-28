import { readFileSync } from 'fs'

import algoliasearch, { SearchIndex } from 'algoliasearch'
import dotenv from 'dotenv'

import type { AlgoliaData, AlgoliaRule, AlgoliaSimulateur } from './format'

dotenv.config()

const env = process.env

const ALGOLIA_APP_ID = env.ALGOLIA_APP_ID || ''
const ALGOLIA_ADMIN_KEY = env.ALGOLIA_ADMIN_KEY || ''
const ALGOLIA_INDEX_PREFIX = env.ALGOLIA_INDEX_PREFIX || ''

const updateIndex = async (
	index: SearchIndex,
	settings: object,
	objects: AlgoliaRule[] | AlgoliaSimulateur[]
) => {
	console.log('Clearing index')
	await index.clearObjects().wait()

	console.log('Configuring index')
	await index
		.setSettings({
			// Parameters are documented on Algolia website https://www.algolia.com/doc/api-reference/api-parameters/
			minWordSizefor1Typo: 4,
			minWordSizefor2Typos: 8,
			hitsPerPage: 20,
			maxValuesPerFacet: 100,
			paginationLimitedTo: 1000,
			exactOnSingleWordQuery: 'attribute',
			ranking: [
				'typo',
				'geo',
				'words',
				'filters',
				'proximity',
				'attribute',
				'exact',
				'custom',
			],
			separatorsToIndex: '',
			removeWordsIfNoResults: 'none',
			queryType: 'prefixLast',
			highlightPreTag: '<em>',
			highlightPostTag: '</em>',
			snippetEllipsisText: '',
			alternativesAsExact: ['ignorePlurals', 'singleWordSynonym'],
			...settings,
		})
		.wait()

	console.log('Uploading data')
	await index.saveObjects(objects).wait()
	console.log('Data uploaded')
}

const loadAlgoliaData = (): AlgoliaData => {
	try {
		return JSON.parse(readFileSync('algolia-data.json', 'utf8')) as AlgoliaData
	} catch (error) {
		if (
			error instanceof Error &&
			'code' in error &&
			error.code === 'ENOENT'
		) {
			throw new Error(
				"algolia-data.json introuvable. Lance 'yarn algolia:export' avant 'yarn algolia:push'."
			)
		}
		throw error
	}
}

console.log('Algolia push START')

const data = loadAlgoliaData()
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)
const rulesIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}rules`)
const simulateursIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}simulateurs`)

console.log('RULES index')
await updateIndex(
	rulesIndex,
	{
		searchableAttributes: ['unordered(ruleName)', 'unordered(namespace)'],
		attributesToHighlight: ['ruleName', 'namespace'],
		customRanking: ['asc(pathDepth)'],
	},
	data.rules
)

console.log('SIMULATEURS index')
await updateIndex(
	simulateursIndex,
	{
		searchableAttributes: [
			'unordered(title)',
			'unordered(tooltip)',
			'unordered(description)',
		],
		attributesToHighlight: ['title'],
	},
	data.simulateurs
)

console.log('Algolia push DONE')
