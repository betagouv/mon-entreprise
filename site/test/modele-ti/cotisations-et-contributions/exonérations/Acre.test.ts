import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const COTISATIONS = 'indépendant . cotisations et contributions . cotisations'

const defaultSituation = {
	'entreprise . imposition': "'IR'",
	'entreprise . date de création': '01/01/2026',
}
const defaultSituationAcre = {
	...defaultSituation,
	'indépendant . cotisations et contributions . cotisations . exonérations . Acre':
		'oui',
}

describe('L’exonération Acre', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('avant 2026', () => {
		const defaultSituationAvant2026 = {
			...defaultSituation,
			date: '01/01/2025',
			'entreprise . date de création': '01/01/2025',
		}
		const defaultSituationAvecAcreAvant2026 = {
			...defaultSituationAcre,
			date: '01/01/2025',
			'entreprise . date de création': '01/01/2025',
		}

		it('est totale lorsque l’assiette sociale est inférieure à 75% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituationAvecAcreAvant2026,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(`${COTISATIONS} . maladie-maternité`, 0)
			expect(e).toEvaluate(`${COTISATIONS} . indemnités journalières`, 0)
			expect(e).toEvaluate(`${COTISATIONS} . allocations familiales`, 0)
			expect(e).toEvaluate(`${COTISATIONS} . retraite de base`, 0)
			expect(e).toEvaluate(`${COTISATIONS} . invalidité et décès`, 0)
		})

		it('est partielle lorsque l’assiette sociale est comprise entre 75% du PASS et le PASS', () => {
			const e1 = engine.setSituation({
				...defaultSituationAvant2026,
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
			})

			const AM = e1.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number
			const IJ = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number
			const AF = e1.evaluate(`${COTISATIONS} . allocations familiales`)
				.nodeValue as number
			const RB = e1.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number
			const ID = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
				.nodeValue as number

			const PASS = engine
				.setSituation({ date: '01/01/2025' })
				.evaluate('plafond sécurité sociale . annuel').nodeValue as number
			const TroisQuartDuPASS = Math.round(0.75 * PASS)

			const e2 = engine.setSituation({
				...defaultSituationAvant2026,
				'indépendant . cotisations et contributions . assiette sociale': `${TroisQuartDuPASS} €/an`,
			})

			const AM75Pass = e2.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number
			const IJ75Pass = e2.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number
			const AF75Pass = e2.evaluate(`${COTISATIONS} . allocations familiales`)
				.nodeValue as number
			const RB75Pass = e2.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number
			const ID75Pass = e2.evaluate(`${COTISATIONS} . invalidité et décès`)
				.nodeValue as number

			const e3 = engine.setSituation({
				...defaultSituationAvecAcreAvant2026,
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
			})

			expect(e3).toEvaluate(
				`${COTISATIONS} . maladie-maternité`,
				AM - Math.round(((PASS - 40_000) * AM75Pass) / (0.25 * PASS))
			)
			expect(e3).toEvaluate(
				`${COTISATIONS} . indemnités journalières`,
				IJ - Math.round(((PASS - 40_000) * IJ75Pass) / (0.25 * PASS)) + 1
			)
			expect(e3).toEvaluate(
				`${COTISATIONS} . allocations familiales`,
				AF - Math.round(((PASS - 40_000) * AF75Pass) / (0.25 * PASS))
			)
			expect(e3).toEvaluate(
				`${COTISATIONS} . retraite de base`,
				RB - Math.round(((PASS - 40_000) * RB75Pass) / (0.25 * PASS)) + 1
			)
			expect(e3).toEvaluate(
				`${COTISATIONS} . invalidité et décès`,
				ID - Math.round(((PASS - 40_000) * ID75Pass) / (0.25 * PASS))
			)
		})

		it('est nulle lorsque l’assiette sociale est supérieure au PASS', () => {
			const e1 = engine.setSituation({
				...defaultSituationAvant2026,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})
			const cotisations = e1.evaluate(COTISATIONS).nodeValue

			const e2 = engine.setSituation({
				...defaultSituationAvecAcreAvant2026,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e2).toEvaluate(COTISATIONS, cotisations)
		})

		it('est proratisée en fonction de la durée d’application sur l’année en cours', () => {
			const e1 = engine.setSituation({
				...defaultSituationAvant2026,
				'entreprise . date de création': '18/02/2024',
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			const AM = e1.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number
			const IJ = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number
			const AF = e1.evaluate(`${COTISATIONS} . allocations familiales`)
				.nodeValue as number
			const RB = e1.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number
			const ID = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecAcreAvant2026,
				'entreprise . date de création': '18/02/2024', // = 47 jours d'Acre restant en 2025
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			// Avant prorata, l'exonération totale car assiette sociale < 75% du PASS proratisé
			expect(e2).toEvaluate(
				`${COTISATIONS} . maladie-maternité`,
				AM - Math.round((AM * 47) / 365)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . indemnités journalières`,
				IJ - Math.round((IJ * 47) / 365)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . allocations familiales`,
				AF - Math.round((AF * 47) / 365)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . retraite de base`,
				RB - Math.round((RB * 47) / 365)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . invalidité et décès`,
				ID - Math.round((ID * 47) / 365)
			)
		})
	})

	describe('après 2026', () => {
		it('est égale au quart des cotisations exonérées lorsque l’assiette sociale est inférieure à 75% du PASS', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			const AM = e1.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number
			const IJ = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number
			const AF = e1.evaluate(`${COTISATIONS} . allocations familiales`)
				.nodeValue as number
			const RB = e1.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number
			const ID = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAcre,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . maladie-maternité`,
				AM - Math.round(AM / 4)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . indemnités journalières`,
				IJ - Math.round(IJ / 4) + 1
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . allocations familiales`,
				AF - Math.round(AF / 4)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . retraite de base`,
				RB - Math.round(RB / 4)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . invalidité et décès`,
				ID - Math.round(ID / 4) + 1
			)
		})

		it('est dégressive lorsque l’assiette sociale est comprise entre 75% du PASS et le PASS', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
			})

			const AM = e1.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number
			const IJ = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number
			const AF = e1.evaluate(`${COTISATIONS} . allocations familiales`)
				.nodeValue as number
			const RB = e1.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number
			const ID = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
				.nodeValue as number

			const PASS = engine.evaluate('plafond sécurité sociale . annuel')
				.nodeValue as number
			const TroisQuartDuPASS = Math.round(0.75 * PASS)

			const e2 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale': `${TroisQuartDuPASS} €/an`,
			})

			const AM75Pass = e2.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number
			const IJ75Pass = e2.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number
			const AF75Pass = e2.evaluate(`${COTISATIONS} . allocations familiales`)
				.nodeValue as number
			const RB75Pass = e2.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number
			const ID75Pass = e2.evaluate(`${COTISATIONS} . invalidité et décès`)
				.nodeValue as number

			const e3 = engine.setSituation({
				...defaultSituationAcre,
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
			})

			expect(e3).toEvaluate(
				`${COTISATIONS} . maladie-maternité`,
				AM - Math.round(((PASS - 40_000) * AM75Pass) / PASS)
			)
			expect(e3).toEvaluate(
				`${COTISATIONS} . indemnités journalières`,
				IJ - Math.round(((PASS - 40_000) * IJ75Pass) / PASS)
			)
			expect(e3).toEvaluate(
				`${COTISATIONS} . allocations familiales`,
				AF - Math.round(((PASS - 40_000) * AF75Pass) / PASS)
			)
			expect(e3).toEvaluate(
				`${COTISATIONS} . retraite de base`,
				RB - Math.round(((PASS - 40_000) * RB75Pass) / PASS)
			)
			expect(e3).toEvaluate(
				`${COTISATIONS} . invalidité et décès`,
				ID - Math.round(((PASS - 40_000) * ID75Pass) / PASS)
			)
		})

		it('est nulle lorsque l’assiette sociale est supérieure au PASS', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})
			const cotisations = e1.evaluate(COTISATIONS).nodeValue

			const e2 = engine.setSituation({
				...defaultSituationAcre,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e2).toEvaluate(COTISATIONS, cotisations)
		})

		it('est proratisée en fonction de la durée d’application sur l’année en cours', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'entreprise . date de création': '18/02/2025',
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			const AM = e1.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number
			const IJ = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number
			const AF = e1.evaluate(`${COTISATIONS} . allocations familiales`)
				.nodeValue as number
			const RB = e1.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number
			const ID = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAcre,
				'entreprise . date de création': '18/02/2025', // = 48 jours d'Acre restant en 2026
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			// Aant prorata, l'exonération est maximale (25%) car assiette sociale < 75% du PASS proratisé
			expect(e2).toEvaluate(
				`${COTISATIONS} . maladie-maternité`,
				AM - Math.round(((AM / 4) * 48) / 365)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . indemnités journalières`,
				IJ - Math.round(((IJ / 4) * 48) / 365)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . allocations familiales`,
				AF - Math.round(((AF / 4) * 48) / 365)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . retraite de base`,
				RB - Math.round(((RB / 4) * 48) / 365)
			)
			expect(e2).toEvaluate(
				`${COTISATIONS} . invalidité et décès`,
				ID - Math.round(((ID / 4) * 48) / 365)
			)
		})
	})
})
