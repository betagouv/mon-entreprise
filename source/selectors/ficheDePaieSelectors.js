/* @flow */
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
import {
	règleAvecMontantSelector,
	règleAvecValeurSelector,
	règleLocaliséeSelector
} from 'Selectors/regleSelectors'

import type { Analysis } from 'Types/Analysis'
import type {
	VariableWithCotisation,
	Cotisation,
	Cotisations,
	Branche,
	FicheDePaie
} from 'Types/ResultViewTypes'

import type { Règle } from 'Types/RegleTypes'

export const COTISATION_BRANCHE_ORDER: Array<Branche> = [
	'santé',
	'accidents du travail / maladies professionnelles',
	'retraite',
	'famille',
	'assurance chômage',
	'formation',
	'logement',
	'transport',
	'autres'
]

// Used for type consistency
export const BLANK_COTISATION: Cotisation = {
	montant: {
		partPatronale: 0,
		partSalariale: 0
	},
	id: 'ERROR_SHOULD_BE_INSTANCIATED',
	type: 'euros',
	nom: 'ERROR_SHOULD_BE_INSTANCIATED',
	lien: 'ERROR_SHOULD_BE_INSTANCIATED',
	branche: 'autres'
}

function duParSelector(
	variable: VariableWithCotisation
): ?('employeur' | 'employé') {
	const dusPar = [
		['cotisation', 'dû par'],
		['taxe', 'dû par'],
		['explanation', 'cotisation', 'dû par'],
		['explanation', 'taxe', 'dû par']
	].map(p => path(p, variable))
	return dusPar.filter(Boolean)[0]
}
function brancheSelector(variable: VariableWithCotisation): Branche {
	const branches = [
		['cotisation', 'branche'],
		['taxe', 'branche'],
		['explanation', 'cotisation', 'branche'],
		['explanation', 'taxe', 'branche']
	].map(p => path(p, variable))
	return branches.filter(Boolean)[0] || 'autres'
}

// $FlowFixMe
export const mergeCotisations: (
	Cotisation,
	Cotisation
) => Cotisation = mergeWithKey(
	(key, a, b) => (key === 'montant' ? mergeWith(add, a, b) : b)
)

const variableToCotisation = (règleLocaliséeSelector: string => Règle) => (
	variable: VariableWithCotisation
): Cotisation => {
	return mergeCotisations(BLANK_COTISATION, {
		...règleLocaliséeSelector(variable.dottedName),
		branche: brancheSelector(variable),
		montant: {
			[duParSelector(variable) === 'salarié'
				? 'partSalariale'
				: 'partPatronale']: variable.nodeValue
		}
	})
}
function groupByBranche(cotisations: Array<Cotisation>): Cotisations {
	const cotisationsMap = cotisations.reduce(
		(acc, cotisation) => ({
			...acc,
			[cotisation.branche]: [cotisation, ...(acc[cotisation.branche] || [])]
		}),
		{}
	)
	return COTISATION_BRANCHE_ORDER.map(branche => [
		branche,
		// $FlowFixMe
		cotisationsMap[branche]
	])
}
const analysisToCotisations = (
	analysis: Analysis,
	règleLocaliséeSelector: string => Règle
): Cotisations => {
	const variables = [
		'contrat salarié . cotisations salariales',
		'contrat salarié . cotisations patronales'
	]
		.map(name => analysis.cache[name])
		.map(pathOr([], ['explanation', 'formule', 'explanation', 'explanation']))
		.reduce(concat, [])
	const cotisations = pipe(
		groupBy(prop('dottedName')),
		values,
		map(
			pipe(
				map(variableToCotisation(règleLocaliséeSelector)),
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

// Custom values for flow type checking
// https://github.com/facebook/flow/issues/2221
function analysisToFicheDePaie(
	règleAvecMontant,
	règleAvecValeur,
	règleLocalisée,
	analysis
): ?FicheDePaie {
	if (!analysis.cache) {
		return null
	}
	const cotisations = analysisToCotisations(analysis, règleLocalisée)
	const cotisationsSalariales = règleAvecMontant(
		'contrat salarié . cotisations salariales'
	)
	const cotisationsPatronales = règleAvecMontant(
		'contrat salarié . cotisations patronales'
	)
	const réductionsDeCotisations = règleAvecMontant(
		'contrat salarié . réductions de cotisations'
	)
	const totalCotisations = {
		partPatronale:
			cotisationsPatronales.montant - réductionsDeCotisations.montant,
		partSalariale: cotisationsSalariales.montant
	}
	return {
		salaireDeBase: règleAvecMontant('contrat salarié . salaire . brut de base'),
		avantagesEnNature: règleAvecMontant(
			'contrat salarié . avantages en nature . montant'
		),
		salaireBrut: règleAvecMontant('contrat salarié . salaire . brut'),
		cotisations,
		réductionsDeCotisations,
		totalCotisations,
		salaireChargé: règleAvecMontant('contrat salarié . salaire . total'),
		salaireNet: règleAvecMontant('contrat salarié . salaire . net'),
		salaireNetImposable: règleAvecMontant(
			'contrat salarié . salaire . net imposable'
		),
		salaireNetàPayer: règleAvecMontant(
			'contrat salarié . salaire . net à payer'
		),
		nombreHeuresTravaillées: Math.round(
			règleAvecValeur('contrat salarié . heures par semaine').valeur * 4.33
		)
	}
}

export default createSelector(
	[
		règleAvecMontantSelector,
		règleAvecValeurSelector,
		règleLocaliséeSelector,
		analysisWithDefaultsSelector
	],
	analysisToFicheDePaie
)
