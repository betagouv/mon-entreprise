import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const salaires = 100_000
const bénéfices = 50_000
const dividendes = 10_000
const autresRevenus = 5_000

describe('L’impôt', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('avec un taux personnalisé', () => {
		const taux = 18
		describe('en cas de dividendes au PFU', () => {
			it('est calculé sur le revenu imposable', () => {
				// Le revenu imposable est la somme :
				// - des salaires imposables (sans abattement de 10%),
				// - des bénéfices imposables.
				// Les dividendes au PFU ne sont pas inclus dans le revenu imposable.
				// Les autres revenus du foyer ne sont pas inclus car ils ne servent que
				// pour le calcul au barème standard.

				const e = engine.setSituation({
					'impôt . méthode de calcul': "'taux personnalisé'",
					'impôt . taux personnalisé': `${taux}%`,
					"paramètres . impôt . revenu d'activité": `${salaires} €/an`,
					'paramètres . impôt . bénéfices imposables': `${bénéfices} €/an`,
					'impôt . foyer fiscal . autres revenus imposables': `${autresRevenus} €/an`,
					'paramètres . dividendes . bruts': `${dividendes} €/an`,
				})

				expect(e).toEvaluate('impôt . revenu . imposable', salaires + bénéfices)
				expect(e).toEvaluate(
					'impôt . montant',
					((salaires + bénéfices) * taux) / 100
				)
			})
		})

		describe('en cas de dividendes au barème progressif', () => {
			it('est calculé sur le revenu imposable', () => {
				// Le revenu imposable est la somme :
				// - des salaires imposables (sans abattement de 10%),
				// - des bénéfices imposables,
				// - des dividendes imposables (après abattement de 40%).
				// Les autres revenus du foyer ne sont pas inclus car ils ne servent que
				// pour le calcul au barème standard.

				const e = engine.setSituation({
					'impôt . méthode de calcul': "'taux personnalisé'",
					'impôt . taux personnalisé': `${taux}%`,
					"paramètres . impôt . revenu d'activité": `${salaires} €/an`,
					'paramètres . impôt . bénéfices imposables': `${bénéfices} €/an`,
					'impôt . foyer fiscal . autres revenus imposables': `${autresRevenus} €/an`,
					'paramètres . dividendes . bruts': `${dividendes} €/an`,
					'paramètres . dividendes . imposition au barème progressif': 'oui',
				})

				expect(e).toEvaluate(
					'impôt . revenu . imposable',
					salaires + bénéfices + dividendes * 0.6
				)
				expect(e).toEvaluate(
					'impôt . montant',
					((salaires + bénéfices + dividendes * 0.6) * taux) / 100
				)
			})
		})
	})
})
