import { Analysis } from 'Engine/traverse'
import {
	add,
	concat,
	filter,
	groupBy,
	map,
	mergeWith,
	mergeWithKey,
	path,
	pathOr,
	pipe,
	prop,
	reduce,
	values
} from 'ramda'
import { createSelector } from 'reselect'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { Branch, Cotisation } from './repartitionSelectors'
// Used for type consistency
export const BLANK_COTISATION: Cotisation = {
	montant: {
		partPatronale: 0,
		partSalariale: 0
	},
	unit: 'ERROR_SHOULD_BE_INSTANCIATED',
	dottedName: 'ERROR_SHOULD_BE_INSTANCIATED' as any,
	title: 'ERROR_SHOULD_BE_INSTANCIATED',
	branche: 'protection sociale . autres'
}

export const COTISATION_BRANCHE_ORDER: Array<Branch> = [
	'protection sociale . santé',
	'protection sociale . accidents du travail et maladies professionnelles',
	'protection sociale . retraite',
	'protection sociale . famille',
	'protection sociale . assurance chômage',
	'protection sociale . formation',
	'protection sociale . transport',
	'protection sociale . autres'
]

function duParSelector(variable): 'employeur' | 'salarié' {
	const dusPar = [
		['cotisation', 'dû par'],
		['taxe', 'dû par'],
		['explanation', 'cotisation', 'dû par'],
		['explanation', 'taxe', 'dû par']
	].map(p => path(p, variable))
	return dusPar.filter(Boolean)[0] as any
}
function brancheSelector(variable): Branch {
	const branches = [
		['cotisation', 'branche'],
		['taxe', 'branche'],
		['explanation', 'cotisation', 'branche'],
		['explanation', 'taxe', 'branche']
	].map(p => path(p, variable))
	return ('protection sociale . ' +
		(branches.filter(Boolean)[0] || 'autres')) as any
}

export const mergeCotisations: (
	a: Cotisation,
	b: Cotisation
) => Cotisation = mergeWithKey((key, a, b) =>
	key === 'montant' ? mergeWith(add, a, b) : b
)

const variableToCotisation = (variable): Cotisation => {
	return mergeCotisations(BLANK_COTISATION, {
		...variable.explanation,
		branche: brancheSelector(variable),
		montant: {
			[duParSelector(variable) === 'salarié'
				? 'partSalariale'
				: 'partPatronale']: variable.nodeValue
		}
	})
}
const groupByBranche = (cotisations: Array<Cotisation>) => {
	const cotisationsMap = cotisations.reduce(
		(acc, cotisation) => ({
			...acc,
			[cotisation.branche]: [...(acc[cotisation.branche] || []), cotisation]
		}),
		{}
	)
	return COTISATION_BRANCHE_ORDER.map(branche => [
		branche,
		cotisationsMap[branche]
	])
}
export let analysisToCotisations = (analysis: Analysis) => {
	const variables = [
		'contrat salarié . cotisations . salariales',
		'contrat salarié . cotisations . patronales'
	]
		.map(name => analysis.cache[name])
		.map(pathOr([], ['explanation', 'formule', 'explanation', 'explanation']))
		.reduce(concat, [])

	const cotisations = pipe(
		map((rule: any) =>
			// Following :  weird logic to automatically handle negative negated value in sum

			rule.operationType === 'calculation' &&
			rule.operator === '−' &&
			rule.explanation[0].nodeValue === 0
				? { ...rule.explanation[1], nodeValue: rule.nodeValue }
				: rule
		),
		groupBy(prop('dottedName')),
		values,
		map(
			pipe(
				map(variableToCotisation),
				reduce(mergeCotisations, BLANK_COTISATION)
			)
		),
		filter(
			cotisation =>
				cotisation.montant.partPatronale !== 0 ||
				cotisation.montant.partSalariale !== 0
		),
		groupByBranche,
		filter(([, brancheCotisation]) => !!brancheCotisation)
	)(variables)
	return cotisations
}
export const analysisToCotisationsSelector = createSelector(
	[analysisWithDefaultsSelector],
	analysisToCotisations
)
