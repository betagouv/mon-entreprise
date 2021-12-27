import algoliasearch from 'algoliasearch'
import dotenv from 'dotenv'
import rawRules from 'modele-social'
import { parsePublicodes } from 'publicodes'
import getSimulationData from '../../source/pages/Simulateurs/metadata-src.js'

dotenv.config()

const rules = parsePublicodes(rawRules)

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY
const ALGOLIA_INDEX_PREFIX = process.env.ALGOLIA_INDEX_PREFIX || ''

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)

const rulesIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}rules`)
const simulateursIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}simulateurs`)

const formatRulesToAlgolia = (rules) =>
	Object.entries(rules)
		.map(([n, rule]) => {
			if (!rule) return
			const path = n.split(' . ')
			const {
				title,
				rawNode: { icônes = '', description, acronyme, résumé },
			} = rule
			const ruleName = `${title} ${' ' + icônes}`.trim()
			const namespace = path.slice(0, -1)

			return {
				objectID: n,
				path,
				ruleName,
				namespace,
				pathDepth: path.length,
				acronyme: acronyme,
				titre: title,
				icone: icônes,
				description: description || résumé,
			}
		})
		.filter(Boolean)

const formatSimulationDataToAlgolia = (simulations) =>
	Object.entries(simulations).map(([id, simulation]) => ({
		...simulation,
		objectID: id,
		title: simulation.title || simulation.shortName || simulation.meta.title,
		tooltip: simulation.tooltip || '',
		description: simulation.meta?.description,
	}))

;(async function () {
	try {
		console.log('Algolia update START')

		console.log('Clearing: rules')
		await rulesIndex.clearObjects().wait()
		console.log('Configure index: rules')
		await rulesIndex
			.setSettings({
				// Parameters are documented on Algolia website https://www.algolia.com/doc/api-reference/api-parameters/
				minWordSizefor1Typo: 4,
				minWordSizefor2Typos: 8,
				hitsPerPage: 20,
				maxValuesPerFacet: 100,
				attributesToIndex: ['unordered(ruleName)', 'unordered(namespace)'],
				numericAttributesToIndex: null,
				attributesToRetrieve: null,
				unretrievableAttributes: null,
				optionalWords: null,
				attributesForFaceting: null,
				attributesToSnippet: null,
				attributesToHighlight: ['ruleName', 'namespace'],
				paginationLimitedTo: 1000,
				attributeForDistinct: null,
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
				customRanking: ['asc(pathDepth)'],
				separatorsToIndex: '',
				removeWordsIfNoResults: 'none',
				queryType: 'prefixLast',
				highlightPreTag: '<em>',
				highlightPostTag: '</em>',
				snippetEllipsisText: '',
				alternativesAsExact: ['ignorePlurals', 'singleWordSynonym'],
			})
			.wait()

		console.log('Uploading: rules')

		await rulesIndex.saveObjects(formatRulesToAlgolia(rules)).wait()

		console.log('Clearing: simulateurs')
		await simulateursIndex.clearObjects().wait()
		console.log('Configure index: simulateurs')
		await simulateursIndex
			.setSettings({
				// Parameters are documented on Algolia website https://www.algolia.com/doc/api-reference/api-parameters/
				minWordSizefor1Typo: 4,
				minWordSizefor2Typos: 8,
				hitsPerPage: 20,
				maxValuesPerFacet: 100,
				attributesToIndex: [
					'unordered(title)',
					'unordered(tooltip)',
					'unordered(description)',
				],
				numericAttributesToIndex: null,
				attributesToRetrieve: null,
				unretrievableAttributes: null,
				optionalWords: null,
				attributesForFaceting: null,
				attributesToSnippet: null,
				attributesToHighlight: ['title'],
				paginationLimitedTo: 1000,
				attributeForDistinct: null,
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
				customRanking: null,
				separatorsToIndex: '',
				removeWordsIfNoResults: 'none',
				queryType: 'prefixLast',
				highlightPreTag: '<em>',
				highlightPostTag: '</em>',
				snippetEllipsisText: '',
				alternativesAsExact: ['ignorePlurals', 'singleWordSynonym'],
			})
			.wait()
		console.log('Updloading: simulateurs')
		await simulateursIndex
			.saveObjects(formatSimulationDataToAlgolia(getSimulationData()))
			.wait()

		console.log('Algolia update DONE')
	} catch (e) {
		console.log(JSON.stringify(e, null, 2))
	}
})()
