import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const COTISATIONS = 'indépendant . cotisations et contributions . cotisations'

const defaultSituation = {
	'entreprise . imposition': "'IR'",
	'indépendant . cotisations et contributions . assiette sociale': '50000 €/an',
}
const defaultSituationInvalidité = {
	...defaultSituation,
	'indépendant . cotisations et contributions . cotisations . exonérations . invalidité':
		'oui',
}

describe('L’exonération invalidité', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it('s’applique aux cotisations maladie-maternité, indemnités journalières et retraite complémentaire pour les A/C/PLNR', () => {
		const e1 = engine.setSituation(defaultSituation)

		expect(e1).not.toBeApplicable(
			`${COTISATIONS} . exonérations . invalidité . exonération`
		)

		const retraiteDeBase = e1.evaluate(`${COTISATIONS} . retraite de base`)
			.nodeValue as number

		const e2 = engine.setSituation(defaultSituationInvalidité)

		expect(e2).toEvaluate(`${COTISATIONS} . maladie-maternité`, 0)
		expect(e2).toEvaluate(`${COTISATIONS} . indemnités journalières`, 0)
		expect(e2).toEvaluate(`${COTISATIONS} . retraite de base`, retraiteDeBase)
		expect(e2).toEvaluate(`${COTISATIONS} . retraite complémentaire`, 0)
	})

	it('s’applique aux cotisations maladie-maternité, indemnités journalières, retraite de base et retraite complémentaire pour les PLR Cipav', () => {
		const situationCipav = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		const e = engine.setSituation({
			...defaultSituationInvalidité,
			...situationCipav,
		})

		expect(e).toEvaluate(`${COTISATIONS} . maladie-maternité`, 0)
		expect(e).toEvaluate(`${COTISATIONS} . indemnités journalières`, 0)
		expect(e).toEvaluate(`${COTISATIONS} . retraite de base`, 0)
		expect(e).toEvaluate(`${COTISATIONS} . retraite complémentaire`, 0)
	})

	it('s’applique aux cotisations maladie-maternité et indemnités journalières pour les PLR non Cipav', () => {
		const situationPLRNonCipav = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
			'indépendant . profession libérale . réglementée . métier':
				"'expert-comptable'",
		}

		const e1 = engine.setSituation({
			...defaultSituation,
			...situationPLRNonCipav,
		})

		const retraiteDeBase = e1.evaluate(`${COTISATIONS} . retraite de base`)
			.nodeValue as number
		const retraiteComplémentaire = e1.evaluate(
			`${COTISATIONS} . retraite complémentaire`
		).nodeValue as number

		const e2 = engine.setSituation({
			...defaultSituationInvalidité,
			...situationPLRNonCipav,
		})

		expect(e2).toEvaluate(`${COTISATIONS} . maladie-maternité`, 0)
		expect(e2).toEvaluate(`${COTISATIONS} . indemnités journalières`, 0)
		expect(e2).toEvaluate(`${COTISATIONS} . retraite de base`, retraiteDeBase)
		expect(e2).toEvaluate(
			`${COTISATIONS} . retraite complémentaire`,
			retraiteComplémentaire
		)
	})

	it('est proratisée en fonction de la durée d’invalidité', () => {
		const e = engine.setSituation({
			...defaultSituationInvalidité,
			'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
				'9 mois',
		})

		expect(e).toEvaluate(
			`${COTISATIONS} . exonérations . invalidité . prorata sur l'année`,
			75
		)
	})
})
