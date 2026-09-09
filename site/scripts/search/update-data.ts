import algoliasearch from 'algoliasearch'
import dotenv from 'dotenv'
import rawRules from 'modele-social'
import Engine, { ParsedRules } from 'publicodes'

import { SimulatorData } from '@/pages/simulateurs-et-assistants/metadata-src'

dotenv.config()

const path = '../../source/public/simulation-data.json'
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const simuData = (await import(path, { assert: { type: 'json' } }))
	.default as unknown as Omit<SimulatorData, 'component'>

const parsedRules = new Engine(rawRules).getParsedRules()

const env = process.env

const ALGOLIA_APP_ID = env.ALGOLIA_APP_ID || ''
const ALGOLIA_ADMIN_KEY = env.ALGOLIA_ADMIN_KEY || ''
const ALGOLIA_INDEX_PREFIX = env.ALGOLIA_INDEX_PREFIX || ''

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)

const rulesIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}rules`)
const simulateursIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}simulateurs`)

const falsy = <T>(value: T | false): value is T => Boolean(value)

const formatRulesToAlgolia = (rules: ParsedRules<string>) =>
	Object.entries(rules)
		.map(([n, rule]) => {
			if (!rule) {
				return false
			}
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
				acronyme,
				titre: title,
				icone: icônes,
				description: description || résumé,
			}
		})
		.filter(falsy)

const formatSimulationDataToAlgolia = (
	simulations: Omit<SimulatorData, 'component'>
) =>
	Object.entries(simulations)
		.filter(
			([, simulation]) =>
				!(
					typeof simulation === 'object' &&
					'private' in simulation &&
					simulation.private === true
				)
		)
		.map(([id, simulation]) => ({
			...simulation,
			objectID: id,
			title:
				('title' in simulation && simulation.title) ||
				simulation.shortName ||
				simulation.meta.title,
			tooltip: ('tooltip' in simulation && simulation.tooltip) || '',
			description: simulation.meta?.description,
		}))

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
			attributesToHighlight: ['ruleName', 'namespace'],
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

	await rulesIndex.saveObjects(formatRulesToAlgolia(parsedRules)).wait()

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
			attributesToHighlight: ['title'],
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
		})
		.wait()
	console.log('Uploading: simulateurs')

	await simulateursIndex
		.saveObjects(formatSimulationDataToAlgolia(simuData))
		.wait()

	console.log('Algolia update DONE')
} catch (e) {
	console.log(JSON.stringify(e, null, 2))
}
