import { getRuleFromAnalysis } from 'Engine/rules'
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
	propEq,
	reduce,
	sort,
	without
} from 'ramda'
import { createSelector } from 'reselect'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { Rule } from 'Types/rule'
import {
	analysisToCotisations,
	BLANK_COTISATION,
	mergeCotisations
} from './ficheDePaieSelectors'

export type Cotisation = Partial<Rule> & {
	branche: Branch
	montant: MontantPartagé
}

type MontantPartagé = {
	partSalariale: number
	partPatronale: number
}

export type Branch =
	| 'protection sociale . santé'
	| 'protection sociale . accidents du travail et maladies professionnelles'
	| 'protection sociale . retraite'
	| 'protection sociale . famille'
	| 'protection sociale . assurance chômage'
	| 'protection sociale . formation'
	| 'protection sociale . transport'
	| 'protection sociale . autres'

const totalCotisations = (cotisations: Array<Cotisation>): MontantPartagé =>
	cotisations.reduce(mergeCotisations, BLANK_COTISATION).montant

const byMontantTotal = (
	a: [Branch, MontantPartagé],
	b: [Branch, MontantPartagé]
): number => {
	return (
		b[1].partPatronale +
		b[1].partSalariale -
		a[1].partPatronale -
		a[1].partSalariale
	)
}

const REPARTITION_CSG: Partial<Record<Branch, number>> = {
	'protection sociale . famille': 0.85,
	'protection sociale . santé': 7.75,
	// TODO: cette part correspond à l'amortissement de la dette de la sécurité sociale.
	// On peut imaginer la partager à toute les composantes concernées
	'protection sociale . autres': 0.6
}
function applyCSGInPlace(
	CSG: Cotisation,
	rawRépartition: Record<Branch, MontantPartagé>
): void {
	for (const branche in REPARTITION_CSG) {
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
	réduction,
	répartitionMap: Record<Branch, MontantPartagé>
): Record<Branch, MontantPartagé> {
	const totalPatronal = (pipe(
		pick(brancheConcernéeParLaRéduction),
		Object.values,

		reduce(mergeWith(add), {})
	)(répartitionMap) as any).partPatronale
	return mapObjIndexed(
		({ partPatronale, partSalariale }, branche: string) => ({
			partPatronale: brancheConcernéeParLaRéduction.find(equals(branche))
				? partPatronale - (partPatronale / totalPatronal) * réduction.nodeValue
				: partPatronale,
			partSalariale
		}),
		répartitionMap
	)
}

const répartition = analysis => {
	let cotisations = fromPairs(analysisToCotisations(analysis) as any)

	const getRule = getRuleFromAnalysis(analysis),
		salaireNet = getRule('contrat salarié . rémunération . net'),
		salaireChargé = getRule('contrat salarié . rémunération . total'),
		cotisationsRule = getRule('contrat salarié . cotisations'),
		réductionsDeCotisations = getRule(
			'contrat salarié . cotisations . patronales . réductions de cotisations'
		)
	let CSG
	const autresCotisations = cotisations['protection sociale . autres'] as any
	if (autresCotisations) {
		CSG = autresCotisations.find(propEq('dottedName', 'contrat salarié . CSG'))
		cotisations['protection sociale . autres'] = without(
			[CSG],
			autresCotisations
		)
	}

	let répartitionMap = map(totalCotisations as any, cotisations) as any
	if (CSG) {
		applyCSGInPlace(CSG, répartitionMap)
	}

	répartitionMap = applyReduction(réductionsDeCotisations, répartitionMap)
	return {
		répartition: compose(
			sort(byMontantTotal),
			Object.entries as any,
			filter(
				({ partPatronale, partSalariale }) =>
					Math.round(partPatronale + partSalariale) !== 0
			)
		)(répartitionMap),
		total: cotisationsRule.nodeValue,
		cotisations: cotisationsRule,
		maximum: compose(
			reduce(max, 0),
			map(montant => montant.partPatronale + montant.partSalariale),
			Object.values
		)(répartitionMap),
		salaireNet,
		salaireChargé
	}
}

export default createSelector([analysisWithDefaultsSelector], répartition)
