import algoliasearch, { SearchIndex } from 'algoliasearch'
import dotenv from 'dotenv'
import rawRules from 'modele-social'
import Engine, { ParsedRules } from 'publicodes'

import { SimulatorData } from '@/pages/simulateurs-et-assistants/metadata-src'
import { NomModèle } from '@/domaine/SimulationConfig'

dotenv.config()

const path = '../../source/public/simulation-data.json'
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const simuData = (await import(path, { assert: { type: 'json' } }))
	.default as unknown as Omit<SimulatorData, 'component'>


const env = process.env

const ALGOLIA_APP_ID = env.ALGOLIA_APP_ID || ''
const ALGOLIA_ADMIN_KEY = env.ALGOLIA_ADMIN_KEY || ''
const ALGOLIA_INDEX_PREFIX = env.ALGOLIA_INDEX_PREFIX || ''

const formatRulesToAlgolia = (rules: ParsedRules<string>, nomModèle?: NomModèle) =>
	Object.entries(rules)
		.map(([dottedName, rule]) => {
			if (!rule) {
				return false
			}

			const objectID = nomModèle ? `${nomModèle} . ${dottedName}` : dottedName
			const path = dottedName.split(' . ')
			const namespace = path.slice(0, -1)
			const {
				title,
				rawNode: { icônes = '', description, acronyme, résumé },
			} = rule
			const ruleName = `${title} ${' ' + icônes}`.trim()

			return {
				objectID,
				nomModèle: nomModèle || 'modele-social',
				dottedName,
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
		.filter(<T>(value: T | false): value is T => Boolean(value))

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

const commonIndexSettings = {
	// Parameters are documented on Algolia website https://www.algolia.com/doc/api-reference/api-parameters/
	minWordSizefor1Typo: 4,
	minWordSizefor2Typos: 8,
	hitsPerPage: 20,
	maxValuesPerFacet: 100,
	paginationLimitedTo: 1000,
	exactOnSingleWordQuery: 'attribute' as 'attribute' | 'none' | 'word',
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
	removeWordsIfNoResults: 'none' as 'none' | 'lastWords' | 'firstWords' | 'allOptional',
	queryType: 'prefixLast' as 'prefixLast' | 'prefixAll' | 'prefixNone',
	highlightPreTag: '<em>',
	highlightPostTag: '</em>',
	snippetEllipsisText: '',
	alternativesAsExact: ['ignorePlurals', 'singleWordSynonym'] satisfies ReadonlyArray<'ignorePlurals' | 'singleWordSynonym' | 'multiWordsSynonym'>,
}

const updateIndex = async (index: SearchIndex, settings: object, objects: object[]) => {
	console.log('Clearing index')
	await index.clearObjects().wait()

	console.log('Configure index')
	await index
		.setSettings({
			...commonIndexSettings,
			...settings,
		})
		.wait()

	console.log('Uploading data')
	await index.saveObjects(objects).wait()
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)
const rulesIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}rules`)
const simulateursIndex = client.initIndex(`${ALGOLIA_INDEX_PREFIX}simulateurs`)

const parsedRules = new Engine(rawRules).getParsedRules()

try {
	console.log('Algolia update START')


	console.log('RULES index')
	const rules = formatRulesToAlgolia(parsedRules)
	await updateIndex(
		rulesIndex,
		{
			searchableAttributes: ['unordered(ruleName)', 'unordered(namespace)'],
			attributesToHighlight: ['ruleName', 'namespace'],
			customRanking: ['asc(pathDepth)'],
		},
		rules
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
		formatSimulationDataToAlgolia(simuData)
	)

	console.log('Algolia update DONE')
} catch (error) {
	console.log(JSON.stringify(error, null, 2))
}
