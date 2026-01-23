import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'entreprise . imposition': "'IS'",
}

describe('Dividendes', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('exonérés de cotisations sociales', () => {
		it('est le montant total par défaut', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . dividendes': '1000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . dividendes . plafond exonéré de cotisations sociales',
				1000
			)
		})

		it('sont plafonnés à 10% du capital social pour les sociétés', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . dividendes': '1000 €/an',
				'entreprise . capital social': '20000 €',
				"entreprise . bénéfice net de l'exercice précédent": '30000 €',
			})

			expect(e).toBeApplicable('entreprise . capital social')
			expect(e).not.toBeApplicable(
				"entreprise . bénéfice net de l'exercice précédent"
			)
			expect(e).toEvaluate(
				'indépendant . dividendes . plafond exonéré de cotisations sociales',
				2000
			)
		})

		it('sont plafonnés à 10% du bénéfice net de l’exercice précédent pour les entreprises individuelles', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . dividendes': '1000 €/an',
				'entreprise . capital social': '20000 €',
				"entreprise . bénéfice net de l'exercice précédent": '30000 €',
				'entreprise . EI': 'oui',
			})

			expect(e).not.toBeApplicable('entreprise . capital social')
			expect(e).toBeApplicable(
				"entreprise . bénéfice net de l'exercice précédent"
			)
			expect(e).toEvaluate(
				'indépendant . dividendes . plafond exonéré de cotisations sociales',
				3000
			)
		})
	})

	describe('inférieurs ou égaux à 10% du capital social', () => {
		const dividendes = 1000
		const defaultSituationAvecDividendes = {
			...defaultSituation,
			'indépendant . rémunération . totale': '40000 €/an',
			'indépendant . dividendes': `${dividendes} €/an`,
			'entreprise . capital social': '10000 €',
		}

		it('sont soumis à 17,2% de prélèvements sociaux', () => {
			const e = engine.setSituation(defaultSituationAvecDividendes)

			expect(e).toEvaluate(
				'indépendant . dividendes . soumis à prélèvements sociaux',
				1000
			)
			expect(e).toEvaluate(
				'indépendant . dividendes . prélèvements sociaux',
				186
			)
		})

		it('ne sont pas soumis à cotisations sociales', () => {
			const e = engine.setSituation(defaultSituationAvecDividendes)

			expect(e).not.toBeApplicable(
				'indépendant . dividendes . soumis à cotisations sociales'
			)
		})

		it('s’ajoutent à la rémunération nette avec dividendes après prélèvements sociaux', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': '40000 €/an',
			})
			const rémunérationNetteSansDividendes = e1.evaluate(
				'indépendant . rémunération . nette . avec dividendes'
			).nodeValue as number

			const e2 = engine.setSituation(defaultSituationAvecDividendes)
			const prélèvementsSociauxDividendes = e2.evaluate(
				'indépendant . dividendes . prélèvements sociaux'
			).nodeValue as number
			const rémunérationNetteAvecDividendes = e2.evaluate(
				'indépendant . rémunération . nette . avec dividendes'
			).nodeValue

			expect(rémunérationNetteAvecDividendes).toEqual(
				rémunérationNetteSansDividendes +
					dividendes -
					prélèvementsSociauxDividendes
			)
		})

		it('sont soumis par défaut à un PFU de 12,8%', () => {
			const e = engine.setSituation(defaultSituationAvecDividendes)

			expect(e).toEvaluate('indépendant . dividendes . PFU', 128)
			expect(e).not.toBeApplicable('indépendant . dividendes . imposables')
		})

		it('ne modifient pas la rémunération imposable en cas de PFU', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': '40000 €/an',
			})
			const rémunérationNetteImposableSansDividendes = e1.evaluate(
				'indépendant . rémunération . nette . imposable'
			).nodeValue

			const e2 = engine.setSituation(defaultSituationAvecDividendes)
			const rémunérationNetteImposableAvecDividendes = e2.evaluate(
				'indépendant . rémunération . nette . imposable'
			).nodeValue

			expect(rémunérationNetteImposableAvecDividendes).toEqual(
				rémunérationNetteImposableSansDividendes
			)
		})

		it('ne modifient pas le montant de l’impôt en cas de PFU', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': '40000 €/an',
			})
			const impôtSansDividendes = e1.evaluate(
				'indépendant . rémunération . impôt'
			).nodeValue

			const e2 = engine.setSituation(defaultSituationAvecDividendes)
			const impôtAvecDividendes = e2.evaluate(
				'indépendant . rémunération . impôt'
			).nodeValue

			expect(impôtAvecDividendes).toEqual(impôtSansDividendes)
		})

		it('s’ajoutent à la rémunération nette après impôt après prélèvements sociaux et PFU', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': '40000 €/an',
			})
			const rémunérationNetteAprèsImpôtSansDividendes = e1.evaluate(
				'indépendant . rémunération . nette . après impôt'
			).nodeValue as number

			const e2 = engine.setSituation(defaultSituationAvecDividendes)
			const prélèvementsSociauxDividendes = e2.evaluate(
				'indépendant . dividendes . prélèvements sociaux'
			).nodeValue as number
			const PFU = e2.evaluate('indépendant . dividendes . PFU')
				.nodeValue as number
			const rémunérationNetteAprèsImpôtAvecDividendes = e2.evaluate(
				'indépendant . rémunération . nette . après impôt'
			).nodeValue

			expect(rémunérationNetteAprèsImpôtAvecDividendes).toEqual(
				rémunérationNetteAprèsImpôtSansDividendes +
					dividendes -
					prélèvementsSociauxDividendes -
					PFU
			)
		})

		it('peuvent être imposables au barème progressif de l’IR après abattement de 40% et soustraction de la CSG déductible', () => {
			const e = engine.setSituation({
				...defaultSituationAvecDividendes,
				'indépendant . dividendes . imposition': "'barème progressif'",
			})
			const CSGDéductible = e.evaluate(
				'indépendant . dividendes . prélèvements sociaux . CSG déductible'
			).nodeValue as number

			expect(e).not.toBeApplicable('indépendant . dividendes . PFU')
			expect(e).toEvaluate(
				'indépendant . dividendes . imposables',
				Math.round(0.6 * dividendes) - CSGDéductible
			)
		})

		it('s’ajoutent à la rémunération nette imposable en cas d’imposition au barème progressif', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': '40000 €/an',
			})
			const rémunérationNetteImposableSansDividendes = e1.evaluate(
				'indépendant . rémunération . nette . imposable'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecDividendes,
				'indépendant . dividendes . imposition': "'barème progressif'",
			})
			const dividendesImposables = e2.evaluate(
				'indépendant . dividendes . imposables'
			).nodeValue as number
			const rémunérationNetteImposableAvecDividendes = e2.evaluate(
				'indépendant . rémunération . nette . imposable'
			).nodeValue

			expect(rémunérationNetteImposableAvecDividendes).toEqual(
				rémunérationNetteImposableSansDividendes + dividendesImposables
			)
		})
	})

	describe('supérieurs à 10% du capital social', () => {
		const rémunérationTotale = 40000
		const dividendes = 1200
		const defaultSituationAvecDividendes = {
			...defaultSituation,
			'indépendant . rémunération . totale': `${rémunérationTotale} €/an`,
			'indépendant . dividendes': `${dividendes} €/an`,
			'entreprise . capital social': '10000 €',
		}
		const plafondDividendes = 1000
		const dividendesSupérieursAuPlafond = dividendes - plafondDividendes

		it('sont soumis à 17,2% de prélèvements sociaux sur la part inférieure à 10% du capital social', () => {
			const e = engine.setSituation(defaultSituationAvecDividendes)

			expect(e).toEvaluate(
				'indépendant . dividendes . soumis à prélèvements sociaux',
				1000
			)
			expect(e).toEvaluate(
				'indépendant . dividendes . prélèvements sociaux',
				186
			)
		})

		it('sont soumis à cotisations sociales sur la part supérieure à 10% du capital social', () => {
			const e = engine.setSituation(defaultSituationAvecDividendes)

			expect(e).toEvaluate(
				'indépendant . dividendes . soumis à cotisations sociales',
				200
			)
		})

		it('la part soumise à cotisations sociales est intégrée au revenu brut', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': '40000 €/an',
			})
			const revenuBrutSansDividendes = e1.evaluate('indépendant . revenu brut')
				.nodeValue as number

			const e2 = engine.setSituation(defaultSituationAvecDividendes)
			const dividendesSoumisÀCotisationsSociales = e2.evaluate(
				'indépendant . dividendes . soumis à cotisations sociales'
			).nodeValue as number

			expect(e2).toEvaluate(
				'indépendant . revenu brut',
				revenuBrutSansDividendes + dividendesSoumisÀCotisationsSociales
			)
		})

		it('la part soumise à cotisations sociales augmente les cotisations et contributions autant qu’une augmentation de rémunération totale', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': `${
					rémunérationTotale + dividendesSupérieursAuPlafond
				} €/an`,
			})
			const cotisationsEtContributionsAvecRémunérationTotaleAugmentée =
				e1.evaluate('indépendant . cotisations et contributions')
					.nodeValue as number

			const e2 = engine.setSituation(defaultSituationAvecDividendes)

			expect(e2).toEvaluate(
				'indépendant . cotisations et contributions',
				cotisationsEtContributionsAvecRémunérationTotaleAugmentée
			)
		})

		it('la part soumise à cotisations sociales diminue la rémunération nette', () => {
			// Les cotisations sociales sont plus importantes puisqu'elles incluent la
			// la part de dividendes supérieure à 10% du capital social.
			// Comme le montant des dividendes n'est pour autant pas intégré à la
			// rémunération nette (uniquement à la rémunération nette avec dividendes),
			// celle-ci est donc inférieure.
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': '40000 €/an',
			})
			const rémunérationNetteSansDividendes = e.evaluate(
				'indépendant . rémunération . nette'
			).nodeValue as number
			const cotisationsEtContributionsSansDividendes = e.evaluate(
				'indépendant . cotisations et contributions'
			).nodeValue as number

			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': `${
					rémunérationTotale + dividendesSupérieursAuPlafond
				} €/an`,
			})
			const cotisationsEtContributionsAvecRémunérationTotaleAugmentée =
				e1.evaluate('indépendant . cotisations et contributions')
					.nodeValue as number
			const augmentationDeCotisations =
				cotisationsEtContributionsAvecRémunérationTotaleAugmentée -
				cotisationsEtContributionsSansDividendes

			const e2 = engine.setSituation(defaultSituationAvecDividendes)

			expect(e2).toEvaluate(
				'indépendant . rémunération . nette',
				rémunérationNetteSansDividendes - augmentationDeCotisations
			)
		})

		it('s’ajoutent à la la rémunération nette avec dividendes après prélèvements sociaux', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': '40000 €/an',
			})
			const rémunérationNetteSansDividendes = e.evaluate(
				'indépendant . rémunération . nette . avec dividendes'
			).nodeValue as number
			const cotisationsEtContributionsSansDividendes = e.evaluate(
				'indépendant . cotisations et contributions'
			).nodeValue as number

			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': `${
					rémunérationTotale + dividendesSupérieursAuPlafond
				} €/an`,
			})
			const cotisationsEtContributionsAvecRémunérationTotaleAugmentée =
				e1.evaluate('indépendant . cotisations et contributions')
					.nodeValue as number
			const augmentationDeCotisations =
				cotisationsEtContributionsAvecRémunérationTotaleAugmentée -
				cotisationsEtContributionsSansDividendes

			const e2 = engine.setSituation(defaultSituationAvecDividendes)
			const prélèvementsSociauxDividendes = e2.evaluate(
				'indépendant . dividendes . prélèvements sociaux'
			).nodeValue as number

			expect(e2).toEvaluate(
				'indépendant . rémunération . nette . avec dividendes',
				rémunérationNetteSansDividendes -
					augmentationDeCotisations +
					dividendes -
					prélèvementsSociauxDividendes
			)
		})

		it('sont soumis par défaut à un PFU de 12,8%', () => {
			const e = engine.setSituation(defaultSituationAvecDividendes)

			expect(e).toEvaluate('indépendant . dividendes . PFU', 153.6)
			expect(e).not.toBeApplicable('indépendant . dividendes . imposables')
		})

		it('ne s’ajoutent pas à la rémunération nette imposable', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': '40000 €/an',
			})
			const rémunérationNetteImposableSansDividendes = e.evaluate(
				'indépendant . rémunération . nette . imposable'
			).nodeValue as number
			const cotisationsEtContributionsSansDividendes = e.evaluate(
				'indépendant . cotisations et contributions'
			).nodeValue as number
			const contributionsNonDéductiblesSansDividendes = e.evaluate(
				'indépendant . cotisations et contributions . non déductibles'
			).nodeValue as number

			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . rémunération . totale': `${
					rémunérationTotale + dividendesSupérieursAuPlafond
				} €/an`,
			})
			const cotisationsEtContributionsAvecRémunérationTotaleAugmentée =
				e1.evaluate('indépendant . cotisations et contributions')
					.nodeValue as number
			const contributionsNonDéductiblesAvecRémunérationTotaleAugmentée =
				e1.evaluate(
					'indépendant . cotisations et contributions . non déductibles'
				).nodeValue as number

			const e2 = engine.setSituation(defaultSituationAvecDividendes)

			const augmentationDeCotisationsDéductibles =
				cotisationsEtContributionsAvecRémunérationTotaleAugmentée -
				contributionsNonDéductiblesAvecRémunérationTotaleAugmentée -
				(cotisationsEtContributionsSansDividendes -
					contributionsNonDéductiblesSansDividendes)
			expect(e2).toEvaluate(
				'indépendant . rémunération . nette . imposable',
				rémunérationNetteImposableSansDividendes -
					augmentationDeCotisationsDéductibles
			)
		})

		it('la rémunération nette après impôt inclue les dividendes après prélèvements sociaux et PFU', () => {
			const e = engine.setSituation(defaultSituationAvecDividendes)
			const rémunérationNette = e.evaluate('indépendant . rémunération . nette')
				.nodeValue as number
			const prélèvementsSociaux = e.evaluate(
				'indépendant . dividendes . prélèvements sociaux'
			).nodeValue as number
			const PFU = e.evaluate('indépendant . dividendes . PFU')
				.nodeValue as number
			const impôt = e.evaluate('indépendant . rémunération . impôt')
				.nodeValue as number

			const dividendesAprèsImpôt = dividendes - prélèvementsSociaux - PFU
			expect(e).toEvaluate(
				'indépendant . rémunération . nette . après impôt',
				Math.round(rémunérationNette - impôt + dividendesAprèsImpôt)
			)
		})

		it('peuvent être imposables au barème progressif de l’IR après abattement de 40% et soustraction de la CSG déductible', () => {
			const e = engine.setSituation({
				...defaultSituationAvecDividendes,
				'indépendant . dividendes . imposition': "'barème progressif'",
			})
			const CSGDéductible = e.evaluate(
				'indépendant . dividendes . prélèvements sociaux . CSG déductible'
			).nodeValue as number

			expect(e).not.toBeApplicable('indépendant . dividendes . PFU')
			expect(e).toEvaluate(
				'indépendant . dividendes . imposables',
				Math.round(0.6 * dividendes) - CSGDéductible
			)
		})

		it('s’ajoutent à la rémunération nette imposable en cas d’imposition au barème progressif', () => {
			const e1 = engine.setSituation(defaultSituationAvecDividendes)
			const rémunérationNetteImposablePFU = e1.evaluate(
				'indépendant . rémunération . nette . imposable'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecDividendes,
				'indépendant . dividendes . imposition': "'barème progressif'",
			})
			const dividendesImposables = e2.evaluate(
				'indépendant . dividendes . imposables'
			).nodeValue as number

			expect(e2).toEvaluate(
				'indépendant . rémunération . nette . imposable',
				rémunérationNetteImposablePFU + dividendesImposables
			)
		})
	})
})
