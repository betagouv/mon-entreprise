import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { configAutoEntrepreneur } from '@/pages/simulateurs/auto-entrepreneur/simulationConfig'

const situationParDéfaut = {
	...configAutoEntrepreneur.situation,
	"dirigeant . auto-entrepreneur . chiffre d'affaires": '50000 €/an',
	'entreprise . activité . nature': '"libérale"',
}

describe('Le simulateur auto-entrepreneur', () => {
	let engine: Engine<DottedName>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('calcule les cotisations', () => {
		it('pour les PLNR', () => {
			const e = engine.setSituation(situationParDéfaut)

			const cotisations = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations'
			).nodeValue
			const serviceBNC = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC'
			).nodeValue

			expect(cotisations).toEqual(serviceBNC)
			expect(cotisations).toEqual(1025)

			expect(e).not.toBeApplicable(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . taux'
			)
			expect(e).toBeApplicable(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . taux'
			)
			expect(e).toEvaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . taux',
				24.6
			)
		})

		it('pour les PLR', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'entreprise . activité . nature . libérale . réglementée': 'oui',
			})

			const cotisations = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations'
			).nodeValue
			const serviceBNCCipav = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav'
			).nodeValue

			expect(cotisations).toEqual(serviceBNCCipav)
			expect(Math.round(cotisations as number)).toEqual(967)

			expect(e).toBeApplicable(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . taux'
			)
			expect(e).toEvaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . taux',
				23.2
			)
		})
	})

	describe('donne la répartition des cotisations', () => {
		it('pour les PLNR', () => {
			const e = engine.setSituation(situationParDéfaut)

			const cotisations = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations'
			).nodeValue as number

			const partRetraiteBase = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite de base'
			).nodeValue as number
			const partRetraiteComplémentaire = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite complémentaire'
			).nodeValue as number
			const partMaladie = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . maladie-maternité'
			).nodeValue as number
			const partPrévoyance = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . invalidité-décès'
			).nodeValue as number
			const partAutres = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . autres contributions'
			).nodeValue as number

			const partRetraiteBaseBNC = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . répartition . retraite de base'
			).nodeValue
			const partRetraiteComplémentaireBNC = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . répartition . retraite complémentaire'
			).nodeValue
			const partMaladieBNC = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . répartition . maladie-maternité'
			).nodeValue
			const partPrévoyanceBNC = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . répartition . invalidité-décès'
			).nodeValue
			const partAutresBNC = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . répartition . autres contributions'
			).nodeValue

			expect(partRetraiteBase).toEqual(partRetraiteBaseBNC)
			expect(partRetraiteComplémentaire).toEqual(partRetraiteComplémentaireBNC)
			expect(partMaladie).toEqual(partMaladieBNC)
			expect(partPrévoyance).toEqual(partPrévoyanceBNC)
			expect(partAutres).toEqual(partAutresBNC)

			expect(
				Math.round((10000 * partRetraiteBase) / cotisations) / 100
			).toEqual(47.6)
			expect(
				Math.round((10000 * partRetraiteComplémentaire) / cotisations) / 100
			).toEqual(13)
			expect(Math.round((10000 * partMaladie) / cotisations) / 100).toEqual(3.4)
			expect(Math.round((10000 * partPrévoyance) / cotisations) / 100).toEqual(
				3.5
			)
			expect(Math.round((10000 * partAutres) / cotisations) / 100).toEqual(32.5)
		})

		it('pour les PLR', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'entreprise . activité . nature . libérale . réglementée': 'oui',
			})

			const cotisations = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations'
			).nodeValue as number

			const partRetraiteBase = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite de base'
			).nodeValue as number
			const partRetraiteComplémentaire = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite complémentaire'
			).nodeValue as number
			const partMaladie = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . maladie-maternité'
			).nodeValue as number
			const partPrévoyance = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . invalidité-décès'
			).nodeValue as number
			const partAutres = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . autres contributions'
			).nodeValue as number

			const partRetraiteBaseCipav = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . répartition . retraite de base'
			).nodeValue
			const partRetraiteComplémentaireCipav = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . répartition . retraite complémentaire'
			).nodeValue
			const partMaladieCipav = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . répartition . maladie-maternité'
			).nodeValue
			const partPrévoyanceCipav = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . répartition . invalidité-décès'
			).nodeValue
			const partAutresCipav = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . répartition . autres contributions'
			).nodeValue

			expect(partRetraiteBase).toEqual(partRetraiteBaseCipav)
			expect(partRetraiteComplémentaire).toEqual(
				partRetraiteComplémentaireCipav
			)
			expect(partMaladie).toEqual(partMaladieCipav)
			expect(partPrévoyance).toEqual(partPrévoyanceCipav)
			expect(partAutres).toEqual(partAutresCipav)

			expect(
				Math.round((10000 * partRetraiteBase) / cotisations) / 100
			).toEqual(28.8)
			expect(
				Math.round((10000 * partRetraiteComplémentaire) / cotisations) / 100
			).toEqual(25.6)
			expect(Math.round((10000 * partMaladie) / cotisations) / 100).toEqual(
				10.2
			)
			expect(Math.round((10000 * partPrévoyance) / cotisations) / 100).toEqual(
				1.4
			)
			expect(Math.round((10000 * partAutres) / cotisations) / 100).toEqual(34)
		})
	})

	describe('calcule les cotisations avec Acre', () => {
		it('pour les PLNR', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'entreprise . date de création': '01/01/2025',
				"dirigeant . auto-entrepreneur . éligible à l'ACRE": 'oui',
				'dirigeant . exonérations . ACRE': 'oui',
			})

			const cotisations = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations'
			).nodeValue
			const serviceBNC = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC'
			).nodeValue

			expect(cotisations).toEqual(serviceBNC)
			expect(cotisations).toEqual(512.5)

			expect(e).not.toBeApplicable(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . taux'
			)
			expect(e).toBeApplicable(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . taux'
			)
			expect(e).toEvaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . taux',
				12.3
			)
		})

		it('pour les PLR', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'entreprise . activité . nature . libérale . réglementée': 'oui',
				'entreprise . date de création': '01/01/2025',
				"dirigeant . auto-entrepreneur . éligible à l'ACRE": 'oui',
				'dirigeant . exonérations . ACRE': 'oui',
			})

			const cotisations = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations'
			).nodeValue
			const serviceBNCCipav = e.evaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav'
			).nodeValue

			expect(cotisations).toEqual(serviceBNCCipav)
			expect(Math.round(cotisations as number)).toEqual(579)

			expect(e).toBeApplicable(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . taux'
			)
			expect(e).toEvaluate(
				'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . taux',
				13.9
			)
		})
	})
})
