/* @flow */

import {
	add,
	compose,
	equals,
	filter,
	fromPairs,
	map,
	mapObjIndexed,
	max,
	mergeWith,
	pick,
	pipe,
	reduce,
	sort,
	propEq,
	without
} from 'ramda'
import { createSelector } from 'reselect'
import {
	BLANK_COTISATION,
	mergeCotisations,
	analysisToCotisations
} from './ficheDePaieSelectors'
import {
	getRuleFromAnalysis,
	analysisWithDefaultsSelector
} from 'Selectors/analyseSelectors'

import type {
	Cotisation,
	MontantPartagé,
	Branche,
	Répartition
} from 'Types/ResultViewTypes'
import type { RègleAvecMontant, Règle } from 'Types/RegleTypes'

const totalCotisations = (cotisations: Array<Cotisation>): MontantPartagé =>
	cotisations.reduce(mergeCotisations, BLANK_COTISATION).montant

const byMontantTotal = (
	a: [Branche, MontantPartagé],
	b: [Branche, MontantPartagé]
): number => {
	return (
		b[1].partPatronale +
		b[1].partSalariale -
		a[1].partPatronale -
		a[1].partSalariale
	)
}

const REPARTITION_CSG: { [Branche]: number } = {
	'protection sociale . famille': 0.85,
	'protection sociale . santé': 7.75,
	// TODO: cette part correspond à l'amortissement de la dette de la sécurité sociale.
	// On peut imaginer la partager à toute les composantes concernées
	'protection sociale . autres': 0.6
}
function applyCSGInPlace(
	CSG: Cotisation,
	rawRépartition: { [Branche]: MontantPartagé }
): void {
	// $FlowFixMe
	for (const branche: Branche in REPARTITION_CSG) {
		rawRépartition[branche] = {
			partPatronale:
				rawRépartition[branche].partPatronale +
				(CSG.montant.partPatronale * (REPARTITION_CSG[branche] / (9.2 / 100))) /
					100,
			partSalariale:
				rawRépartition[branche].partSalariale +
				(CSG.montant.partSalariale * (REPARTITION_CSG[branche] / (9.2 / 100))) /
					100
		}
	}
}

const brancheConcernéeParLaRéduction = [
	'santé',
	'retraite',
	'logement',
	'famille'
].map(branche => 'protection sociale . ' + branche)
function applyReduction(
	réduction: RègleAvecMontant,
	répartitionMap: { [Branche]: MontantPartagé }
): { [Branche]: MontantPartagé } {
	const totalPatronal = pipe(
		pick(brancheConcernéeParLaRéduction),
		Object.values,

		reduce(mergeWith(add), {})
		// $FlowFixMe
	)(répartitionMap).partPatronale
	return mapObjIndexed(
		({ partPatronale, partSalariale }, branche) => ({
			partPatronale: brancheConcernéeParLaRéduction.find(equals(branche))
				? partPatronale - (partPatronale / totalPatronal) * réduction.nodeValue
				: partPatronale,
			partSalariale
		}),
		// $FlowFixMe
		répartitionMap
	)
}

const répartition = (analysis): ?Répartition => {
	// $FlowFixMe
	let cotisations: { [Branche]: Array<Cotisation> } = fromPairs(
		analysisToCotisations(analysis)
	)

	const getRule = getRuleFromAnalysis(analysis),
		salaireNet = getRule('contrat salarié . salaire . net'),
		salaireChargé = getRule('contrat salarié . rémunération . total'),
		réductionsDeCotisations = getRule(
			'contrat salarié . réductions de cotisations'
		)
	let CSG
	const autresCotisations = cotisations['protection sociale . autres']
	if (autresCotisations) {
		CSG = autresCotisations.find(propEq('dottedName', 'contrat salarié . CSG'))
		if (!CSG)
			throw new Error('[répartition selector]: expect CSG not to be null')
		cotisations['protection sociale . autres'] = without(
			[CSG],
			autresCotisations
		)
	}

	// $FlowFixMe
	let répartitionMap: { [Branche]: MontantPartagé } = map(
		totalCotisations,
		cotisations
	)
	if (CSG) {
		applyCSGInPlace(CSG, répartitionMap)
	}

	répartitionMap = applyReduction(réductionsDeCotisations, répartitionMap)
	return {
		// $FlowFixMe
		répartition: compose(
			sort(byMontantTotal),
			Object.entries,
			filter(
				({ partPatronale, partSalariale }) =>
					Math.round(partPatronale + partSalariale) !== 0
			)
		)(répartitionMap),
		// $FlowFixMe
		total: compose(
			reduce(mergeWith(add), 0),
			Object.values
		)(répartitionMap),
		cotisationMaximum: compose(
			reduce(max, 0),
			map(montant => montant.partPatronale + montant.partSalariale),
			Object.values
			// $FlowFixMe
		)(répartitionMap),
		salaireNet,
		salaireChargé
	}
}

// $FlowFixMe
export default createSelector(
	[analysisWithDefaultsSelector],
	répartition
)
