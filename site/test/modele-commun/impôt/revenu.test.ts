import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const tauxCSGDéductible = 6.8 / 100

const salaires = 100_000
const bénéfices = 50_000
const dividendes = 10_000
const autresRevenus = 5_000

describe('Revenus utilisés dans le calcul de l’impôt', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('Le revenu brut global', () => {
		it('est calculé correctement avec des dividendes au PFU', () => {
			// Le revenu brut global est la somme :
			// - des salaires imposables après abattement de 10%,
			// - des autres revenus imposables (bénéfices et autres revenus du foyer).
			// Les dividendes au PFU ne sont pas inclus dans le revenu brut global.

			const e = engine.setSituation({
				"paramètres . impôt . revenu d'activité": `${salaires} €/an`,
				'paramètres . impôt . bénéfices imposables': `${bénéfices} €/an`,
				'impôt . foyer fiscal . autres revenus imposables': `${autresRevenus} €/an`,
				'paramètres . dividendes . bruts': `${dividendes} €/an`,
			})

			expect(e).toEvaluate(
				'impôt . revenu . brut global',
				salaires * 0.9 + bénéfices + autresRevenus
			)
		})

		it('est calculé correctement avec des dividendes au barème progressif', () => {
			// Le revenu brut global est la somme :
			// - des salaires imposables après abattement de 10%,
			// - des dividendes soumis au barème progressif après abattement de 40%,
			// - des autres revenus imposables (bénéfices et autres revenus du foyer).

			const e = engine.setSituation({
				"paramètres . impôt . revenu d'activité": `${salaires} €/an`,
				'paramètres . impôt . bénéfices imposables': `${bénéfices} €/an`,
				'impôt . foyer fiscal . autres revenus imposables': `${autresRevenus} €/an`,
				'paramètres . dividendes . bruts': `${dividendes} €/an`,
				'paramètres . dividendes . imposition au barème progressif': 'oui',
			})

			expect(e).toEvaluate(
				'impôt . revenu . brut global',
				salaires * 0.9 + dividendes * 0.6 + bénéfices + autresRevenus
			)
		})
	})

	describe('Le revenu net global', () => {
		it('est égal au revenu brut global en cas de dividendes au PFU', () => {
			// En cas de dividendes au PFU, il n'y a pas de CSG déductible et le
			// revenu net global est égal au revenu brut global

			const e = engine.setSituation({
				"paramètres . impôt . revenu d'activité": `${salaires} €/an`,
				'paramètres . impôt . bénéfices imposables': `${bénéfices} €/an`,
				'impôt . foyer fiscal . autres revenus imposables': `${autresRevenus} €/an`,
				'paramètres . dividendes . bruts': `${dividendes} €/an`,
			})

			const revenuBrutGlobal = e.evaluate(
				'impôt . revenu . brut global'
			).nodeValue

			expect(e).toEvaluate('impôt . revenu . net global', revenuBrutGlobal)
		})

		it('est calculé correctement avec des dividendes au barème progressif', () => {
			// En cas de dividendes au barème progressif, le revenu net global est égal
			// au revenu brut global moins la CSG déductible sur les dividendes.

			const e = engine.setSituation({
				"paramètres . impôt . revenu d'activité": `${salaires} €/an`,
				'paramètres . impôt . bénéfices imposables': `${bénéfices} €/an`,
				'impôt . foyer fiscal . autres revenus imposables': `${autresRevenus} €/an`,
				'paramètres . dividendes . bruts': `${dividendes} €/an`,
				'paramètres . dividendes . imposition au barème progressif': 'oui',
			})

			const revenuBrutGlobal = e.evaluate('impôt . revenu . brut global')
				.nodeValue as number

			expect(e).toEvaluate(
				'impôt . revenu . net global',
				revenuBrutGlobal - dividendes * tauxCSGDéductible
			)
		})
	})

	describe('Le revenu net imposable', () => {
		it.each([
			['PFU', 'non'],
			['barème progressif', 'oui'],
		])(
			'est égal au revenu net global en cas de dividendes au %s',
			(_, barèmeProgressif) => {
				const e = engine.setSituation({
					"paramètres . impôt . revenu d'activité": `${salaires} €/an`,
					'paramètres . impôt . bénéfices imposables': `${bénéfices} €/an`,
					'impôt . foyer fiscal . autres revenus imposables': `${autresRevenus} €/an`,
					'paramètres . dividendes . bruts': `${dividendes} €/an`,
					'paramètres . dividendes . imposition au barème progressif':
						barèmeProgressif,
				})

				const revenuNetGlobal = e.evaluate(
					'impôt . revenu . net global'
				).nodeValue

				expect(e).toEvaluate('impôt . revenu . net imposable', revenuNetGlobal)
			}
		)
	})

	describe('Le revenu fiscal de référence', () => {
		it('est calculé correctement avec des dividendes au PFU', () => {
			// Le revenu fiscal de référence est la somme :
			// - des salaires imposables après abattement de 10%,
			// - des dividendes (sans aucun abattement),
			// - des autres revenus imposables (bénéfices et autres revenus du foyer).

			const e = engine.setSituation({
				"paramètres . impôt . revenu d'activité": `${salaires} €/an`,
				'paramètres . impôt . bénéfices imposables': `${bénéfices} €/an`,
				'impôt . foyer fiscal . autres revenus imposables': `${autresRevenus} €/an`,
				'paramètres . dividendes . bruts': `${dividendes} €/an`,
			})

			expect(e).toEvaluate(
				'impôt . revenu . fiscal de référence',
				salaires * 0.9 + bénéfices + autresRevenus + dividendes
			)
		})

		it('est calculé correctement avec des dividendes au barème progressif', () => {
			// Le revenu fiscal de référence est la somme :
			// - des salaires imposables après abattement de 10%,
			// - des dividendes sans abattement de 40% mais après déduction de la
			//   CSG déductible,
			// - des autres revenus imposables (bénéfices et autres revenus du foyer).

			const e = engine.setSituation({
				"paramètres . impôt . revenu d'activité": `${salaires} €/an`,
				'paramètres . impôt . bénéfices imposables': `${bénéfices} €/an`,
				'impôt . foyer fiscal . autres revenus imposables': `${autresRevenus} €/an`,
				'paramètres . dividendes . bruts': `${dividendes} €/an`,
				'paramètres . dividendes . imposition au barème progressif': 'oui',
			})

			expect(e).toEvaluate(
				'impôt . revenu . fiscal de référence',
				salaires * 0.9 +
					bénéfices +
					autresRevenus +
					dividendes -
					dividendes * tauxCSGDéductible
			)
		})
	})
})
