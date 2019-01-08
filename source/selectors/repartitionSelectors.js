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
	without
} from 'ramda'
import { createSelector } from 'reselect'
import FicheDePaieSelectors, {
	BLANK_COTISATION,
	mergeCotisations
} from './ficheDePaieSelectors'
import { règleLocaliséeSelector } from './regleSelectors'

import type {
	Cotisation,
	MontantPartagé,
	Branche,
	FicheDePaie,
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
				? partPatronale - (partPatronale / totalPatronal) * réduction.montant
				: partPatronale,
			partSalariale
		}),
		// $FlowFixMe
		répartitionMap
	)
}

const répartition = (
	ficheDePaie: ?FicheDePaie,
	règle: string => Règle
): ?Répartition => {
	if (!ficheDePaie) {
		return null
	}
	// $FlowFixMe
	const cotisations: { [Branche]: Array<Cotisation> } = fromPairs(
		map(
			([brancheRègle, cotisations]) => [brancheRègle.id, cotisations],
			ficheDePaie.cotisations
		)
	)
	const { salaireNet, salaireChargé, réductionsDeCotisations } = ficheDePaie
	let CSG
	const autresCotisations =
		cotisations['protection sociale . autres']
	if (autresCotisations) {
		CSG = autresCotisations.find(({ id }) => id === 'contrat salarié . CSG')
		if (!CSG)
			throw new Error('[répartition selector]: expect CSG not to be null')
		cotisations['protection sociale . autres'] = without(
			[CSG],
			autresCotisations
		)
	}

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
			map(([id, cotisation]) => [règle(id), cotisation]),
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

export default createSelector(
	FicheDePaieSelectors,
	règleLocaliséeSelector,
	répartition
)
