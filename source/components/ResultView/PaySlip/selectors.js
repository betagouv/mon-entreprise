/* @flow */

import { encodeRuleName } from 'Engine/rules.js'
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
import type { State } from '../../../types/State'
import type { Analysis } from '../../../types/Analysis'

type Cotisation = Règle & {
	branche: Branche,
	montant: MontantPartagé
}

type Règle = {
	nom: string,
	lien: string
}
type RègleAvecMontant = Règle & {
	montant: number
}

type Branche =
	| 'santé'
	| 'accidents du travail / maladies professionnelles'
	| 'retraite'
	| 'famille'
	| 'assurance chômage'
	| 'logement'
	| 'autres'

type MontantPartagé = {
	partSalariale: number,
	partPatronale: number
}
type Cotisations = Array<[Branche, Array<Cotisation>]>

export const COTISATION_BRANCHE_ORDER: Array<Branche> = [
	'santé',
	'accidents du travail / maladies professionnelles',
	'retraite',
	'famille',
	'assurance chômage',
	'logement',
	'autres'
]

export type FicheDePaie = {
	salaireBrut: RègleAvecMontant,
	avantagesEnNature: RègleAvecMontant,
	salaireDeBase: RègleAvecMontant,
	// TODO supprimer (cf https://github.com/betagouv/syso/issues/242)
	réductionsDeCotisations: RègleAvecMontant,
	cotisations: Cotisations,
	totalCotisations: MontantPartagé,
	salaireChargé: RègleAvecMontant,
	salaireNet: RègleAvecMontant,
	salaireNetImposable: RègleAvecMontant,
	salaireNetàPayer: RègleAvecMontant
}

type VariableWithCotisation = {
	category: 'variable',
	name: string,
	title: string,
	cotisation: {|
		'dû par'?: 'salarié' | 'employeur',
		branche?: Branche
	|},
	dottedName: string,
	nodeValue: number,
	explanation: {
		cotisation: {
			'dû par'?: 'salarié' | 'employeur',
			branche?: Branche
		},
		taxe: {
			'dû par'?: 'salarié' | 'employeur',
			branche?: Branche
		}
	}
}

// Used for type consistency
const BLANK_COTISATION: Cotisation = {
	montant: {
		partPatronale: 0,
		partSalariale: 0
	},
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
const mergeCotisations: (Cotisation, Cotisation) => Cotisation = mergeWithKey(
	(key, a, b) => (key === 'montant' ? mergeWith(add, a, b) : b)
)

function variableToCotisation(variable: VariableWithCotisation): Cotisation {
	return mergeCotisations(BLANK_COTISATION, {
		nom: variable.name,
		branche: brancheSelector(variable),
		lien: '/règle/' + encodeRuleName(variable.dottedName),
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
		cotisationsMap[branche]
	])
}
function analysisToCotisations(analysis: Analysis): Cotisations {
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
				map(variableToCotisation),
				reduce(mergeCotisations, BLANK_COTISATION)
			)
		),
		filter(
			cotisation =>
				cotisation.montant.partPatronale !== 0 ||
				cotisation.montant.partSalariale !== 0
		),
		groupByBranche
	)(variables)

	return cotisations
}

function analysisRègleSelector(
	ruleName: string,
	analysis: Analysis
): RègleAvecMontant {
	if (!analysis) {
		throw new Error(
			`[Règle selector] L'analyse fournie ne doit pas être 'undefined' ou 'null'`
		)
	}
	const rule =
		analysis.cache[ruleName] ||
		analysis.targets.find(target => target.dottedName === ruleName)
	if (!rule) {
		throw new Error(
			`[Règle selector] Impossible de trouver la règle "${ruleName}" dans l'analyse. Pensez à vérifier l'orthographe et que l'écriture est bien sous forme dottedName`
		)
	}
	const { name, titre, dottedName, nodeValue, explanation } = rule
	return {
		nom:
			titre || (explanation && (explanation.titre || explanation.name)) || name,
		montant: nodeValue || 0,
		lien: '/règle/' + encodeRuleName(dottedName)
	}
}

// Custom values for flow type checking
// https://github.com/facebook/flow/issues/2221
function analysisToFicheDePaie(analysis: Analysis): FicheDePaie {
	const cotisations = analysisToCotisations(analysis)
	const cotisationsPatronales = analysisRègleSelector('contrat salarié . cotisations patronales', analysis) 
	const cotisationsSalariales = analysisRègleSelector('contrat salarié . cotisations salariales', analysis) 
	const réductionsDeCotisations = analysisRègleSelector('contrat salarié . réductions de cotisations', analysis) 
	const totalCotisations = {
		partPatronale: cotisationsPatronales.montant - réductionsDeCotisations.montant,
		partSalariale: cotisationsSalariales.montant,
	}
	return {
		salaireDeBase: analysisRègleSelector(
			'contrat salarié . salaire . brut de base',
			analysis
		),
		avantagesEnNature: analysisRègleSelector(
			'contrat salarié . avantages en nature . montant',
			analysis
		),
		salaireBrut: analysisRègleSelector(
			'contrat salarié . salaire . brut',
			analysis
		),
		cotisations,
		réductionsDeCotisations,
		totalCotisations,
		salaireChargé: analysisRègleSelector(
			'contrat salarié . salaire . total',
			analysis
		),
		salaireNet: analysisRègleSelector(
			'contrat salarié . salaire . net',
			analysis
		),
		salaireNetImposable: analysisRègleSelector(
			'contrat salarié . salaire . net imposable',
			analysis
		),
		salaireNetàPayer: analysisRègleSelector(
			'contrat salarié . salaire . net à payer',
			analysis
		)
	}
}

export default (state: State) =>
	analysisToFicheDePaie(state.analysis)
