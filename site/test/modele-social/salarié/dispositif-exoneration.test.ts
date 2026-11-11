import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { configLodeom } from '@/pages/simulateurs/lodeom/simulationConfig'

const DISPOSITIF = "salarié . dispositif d'exonération"
const CHOIX = `${DISPOSITIF} . choix`

const métropole = (brut: number) => ({
	dirigeant: 'non',
	'entreprise . catégorie juridique': "''",
	'entreprise . imposition': 'non',
	'salarié . contrat . salaire brut': `${brut} €/mois`,
	date: '08/2026',
})

const guadeloupe = (brut: number) => ({
	...métropole(brut),
	'établissement . commune . département': "'Guadeloupe'",
	'entreprise . salariés . effectif . seuil': "'moins de 5'",
	"salarié . cotisations . exonérations . lodeom . secteurs d'activité éligibles":
		'non',
	'salarié . cotisations . exonérations . lodeom . zone un . barème compétitivité renforcée':
		'non',
	'salarié . cotisations . exonérations . lodeom . zone un . barème innovation et croissance':
		'non',
})

const jeuneEntrepriseInnovante = {
	'salarié . cotisations . exonérations . JEI': 'oui',
}

const choisi = (dispositif: string) => ({ [CHOIX]: `'${dispositif}'` })

const enEuros = (engine: Engine<RègleModèleSocial>, règle: string) =>
	engine.evaluate({ valeur: règle, unité: '€/mois' }).nodeValue

describe('Dispositif d’exonération de cotisations patronales', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('Quand un seul dispositif est éligible', () => {
		it('applique la RGDU en métropole', () => {
			engine.setSituation(métropole(2000))

			expect(engine).toEvaluate(DISPOSITIF, 'RGDU')
		})

		it('ne demande pas à l’usager de choisir', () => {
			engine.setSituation(métropole(2000))

			expect(engine).not.toBeApplicable(CHOIX)
		})
	})

	describe('Quand aucun dispositif n’est éligible', () => {
		it.each([
			['au-delà de 3 Smic', métropole(10000)],
			['pour un stage', { ...métropole(700), 'salarié . contrat': "'stage'" }],
		])(
			'n’applique aucun dispositif ni ne demande de choisir, %s',
			(_, situation) => {
				engine.setSituation(situation)

				expect(engine.evaluate(DISPOSITIF).nodeValue).toBeNull()
				expect(engine).not.toBeApplicable(CHOIX)
			}
		)
	})

	describe('Par défaut, le premier dispositif éligible dans l’ordre JEI, Lodeom, RGDU', () => {
		it('applique la JEI à une jeune entreprise innovante', () => {
			engine.setSituation({ ...métropole(2000), ...jeuneEntrepriseInnovante })

			expect(engine).toEvaluate(DISPOSITIF, 'JEI')
		})

		it('applique le Lodeom en Guadeloupe', () => {
			engine.setSituation(guadeloupe(2000))

			expect(engine).toEvaluate(DISPOSITIF, 'Lodeom')
		})

		it('applique la JEI à une jeune entreprise innovante de Guadeloupe', () => {
			engine.setSituation({ ...guadeloupe(2000), ...jeuneEntrepriseInnovante })

			expect(engine).toEvaluate(DISPOSITIF, 'JEI')
		})
	})

	describe('Quand plusieurs dispositifs sont éligibles', () => {
		it('demande à l’usager de choisir', () => {
			engine.setSituation(guadeloupe(2000))

			expect(engine).toBeApplicable(CHOIX)
		})

		it('ne propose que les dispositifs éligibles', () => {
			engine.setSituation(guadeloupe(2000))

			expect(engine).toBeApplicable(`${CHOIX} . Lodeom`)
			expect(engine).toBeApplicable(`${CHOIX} . RGDU`)
			expect(engine).not.toBeApplicable(`${CHOIX} . JEI`)
		})
	})

	describe('Quand une jeune entreprise innovante de métropole choisit la RGDU', () => {
		it('ne lui propose que la JEI et la RGDU', () => {
			engine.setSituation({ ...métropole(2000), ...jeuneEntrepriseInnovante })

			expect(engine).toBeApplicable(`${CHOIX} . JEI`)
			expect(engine).toBeApplicable(`${CHOIX} . RGDU`)
			expect(engine).not.toBeApplicable(`${CHOIX} . Lodeom`)
		})

		it('applique la RGDU à la place de la JEI', () => {
			engine.setSituation({
				...métropole(2000),
				...jeuneEntrepriseInnovante,
				...choisi('RGDU'),
			})

			expect(engine).toEvaluate(DISPOSITIF, 'RGDU')
			expect(
				enEuros(engine, 'salarié . cotisations . exonérations . employeur')
			).toBe(enEuros(engine, 'salarié . cotisations . exonérations . RGDU'))
		})
	})

	describe('À Mayotte', () => {
		const mayotte = (brut: number) => ({
			...guadeloupe(brut),
			'établissement . commune . département': "'Mayotte'",
		})

		it('applique le Lodeom par défaut, avec les taux réduits mahorais', () => {
			engine.setSituation(mayotte(2000))

			expect(engine).toEvaluate(DISPOSITIF, 'Lodeom')
			expect(engine).toEvaluate(
				'salarié . cotisations . maladie . employeur . taux',
				3.12
			)
			expect(engine).toEvaluate(
				'salarié . cotisations . allocations familiales . taux',
				3.55
			)
		})

		it('fait cotiser aux taux pleins mahorais l’employeur qui choisit la RGDU', () => {
			engine.setSituation({ ...mayotte(2000), ...choisi('RGDU') })

			expect(engine).toEvaluate(DISPOSITIF, 'RGDU')
			expect(engine).toEvaluate(
				'salarié . cotisations . maladie . employeur . taux',
				5.8
			)
			expect(engine).toEvaluate(
				'salarié . cotisations . allocations familiales . taux',
				5.4
			)
		})

		it('coûte moins cher à une jeune entreprise innovante sous le Lodeom que sous la JEI appliquée par défaut', () => {
			const coûtTotal = (situation: Record<string, string>) =>
				enEuros(
					engine.setSituation({
						...mayotte(2000),
						...jeuneEntrepriseInnovante,
						...situation,
					}),
					'salarié . coût total employeur'
				) as number

			expect(coûtTotal(choisi('Lodeom'))).toBeLessThan(coûtTotal({}))
		})
	})

	describe('Quand l’usager choisit la RGDU en Guadeloupe', () => {
		const situation = { ...guadeloupe(2000), ...choisi('RGDU') }

		it('applique la RGDU à la place du Lodeom', () => {
			engine.setSituation(situation)

			expect(engine).toEvaluate(DISPOSITIF, 'RGDU')
			expect(
				enEuros(engine, 'salarié . cotisations . exonérations . employeur')
			).toBe(enEuros(engine, 'salarié . cotisations . exonérations . RGDU'))
		})

		it('fait cotiser l’employeur aux taux pleins de maladie et d’allocations familiales', () => {
			engine.setSituation(situation)

			expect(engine).toEvaluate(
				'salarié . cotisations . maladie . employeur . taux',
				13
			)
			expect(engine).toEvaluate(
				'salarié . cotisations . allocations familiales . taux',
				5.25
			)
		})
	})

	describe('Quand l’usager garde le Lodeom en Guadeloupe', () => {
		it('fait bénéficier l’employeur des taux réduits de maladie et d’allocations familiales', () => {
			engine.setSituation(guadeloupe(2000))

			expect(engine).toEvaluate(
				'salarié . cotisations . maladie . employeur . taux',
				7
			)
			expect(engine).toEvaluate(
				'salarié . cotisations . allocations familiales . taux',
				3.45
			)
		})
	})

	describe('Quand le dispositif choisi cesse d’être éligible', () => {
		it('applique le premier dispositif éligible à la place de la RGDU au-delà de 3 Smic', () => {
			engine.setSituation({
				...guadeloupe(6000),
				...jeuneEntrepriseInnovante,
				...choisi('RGDU'),
			})

			expect(engine).toEvaluate(DISPOSITIF, 'JEI')
			expect(
				enEuros(engine, 'salarié . cotisations . exonérations . employeur')
			).toBe(
				enEuros(engine, 'salarié . cotisations . exonérations . JEI . montant')
			)
		})

		it('ne fait plus bénéficier des taux réduits un employeur qui avait choisi le Lodeom hors de l’outre-mer', () => {
			engine.setSituation({
				...métropole(2000),
				...jeuneEntrepriseInnovante,
				...choisi('Lodeom'),
			})

			expect(engine).toEvaluate(DISPOSITIF, 'JEI')
			expect(engine).toEvaluate(
				'salarié . cotisations . maladie . employeur . taux',
				13
			)
		})
	})

	describe('Dans le simulateur Lodeom', () => {
		it('calcule le Lodeom d’une jeune entreprise innovante comme celui de tout employeur', () => {
			const simulateurLodeom = (situation: Record<string, string>) =>
				enEuros(
					engine.setSituation({
						...(configLodeom.situation as Record<string, string>),
						...situation,
					}),
					'salarié . cotisations . exonérations . lodeom . montant'
				)

			const mayotte = {
				...métropole(2000),
				'établissement . commune . département': "'Mayotte'",
				'entreprise . salariés . effectif . seuil': "'moins de 5'",
			}

			expect(
				simulateurLodeom({ ...mayotte, ...jeuneEntrepriseInnovante })
			).toBe(simulateurLodeom(mayotte))
		})
	})

	describe('Quand une jeune entreprise innovante de Guadeloupe choisit le Lodeom', () => {
		it('applique le Lodeom à la place de la JEI', () => {
			engine.setSituation({
				...guadeloupe(2000),
				...jeuneEntrepriseInnovante,
				...choisi('Lodeom'),
			})

			expect(engine).toEvaluate(DISPOSITIF, 'Lodeom')
			expect(
				enEuros(engine, 'salarié . cotisations . exonérations . employeur')
			).toBe(
				enEuros(
					engine,
					'salarié . cotisations . exonérations . lodeom . montant'
				)
			)
		})
	})

	describe('L’avantage du dispositif appliqué', () => {
		const AVANTAGE = `${DISPOSITIF} . avantage`
		const MONTANT = `${DISPOSITIF} . montant`

		it('vaut le montant de l’exonération pour la RGDU', () => {
			engine.setSituation({ ...guadeloupe(2000), ...choisi('RGDU') })

			expect(enEuros(engine, AVANTAGE)).toBe(enEuros(engine, MONTANT))
		})

		it('vaut le montant de l’exonération pour la JEI', () => {
			engine.setSituation({ ...métropole(2000), ...jeuneEntrepriseInnovante })

			expect(enEuros(engine, AVANTAGE)).toBe(enEuros(engine, MONTANT))
		})

		it('ajoute au Lodeom l’économie due aux taux réduits de maladie et d’allocations familiales', () => {
			engine.setSituation(guadeloupe(2000))

			expect(
				(enEuros(engine, AVANTAGE) as number) -
					(enEuros(engine, MONTANT) as number)
			).toBeCloseTo((0.13 - 0.07 + 0.0525 - 0.0345) * 2000, 2)
		})

		it('compte l’économie aux taux mahorais à Mayotte', () => {
			engine.setSituation({
				...guadeloupe(2000),
				'établissement . commune . département': "'Mayotte'",
			})

			expect(
				(enEuros(engine, AVANTAGE) as number) -
					(enEuros(engine, MONTANT) as number)
			).toBeCloseTo((0.058 - 0.0312 + 0.054 - 0.0355) * 2000, 2)
		})

		it('ne compte que le taux réduit d’allocations familiales au-delà du plafond du taux réduit de maladie', () => {
			engine.setSituation(guadeloupe(4500))

			expect(enEuros(engine, MONTANT)).toBe(0)
			expect(enEuros(engine, AVANTAGE)).toBeCloseTo((0.0525 - 0.0345) * 4500, 2)
		})

		it('départage le Lodeom et la RGDU du même écart que le coût total employeur', () => {
			const avantageEtCoûtTotal = (dispositif: string) => {
				engine.setSituation({ ...guadeloupe(2000), ...choisi(dispositif) })

				return {
					avantage: enEuros(engine, AVANTAGE) as number,
					coûtTotal: enEuros(
						engine,
						'salarié . coût total employeur'
					) as number,
				}
			}
			const lodeom = avantageEtCoûtTotal('Lodeom')
			const rgdu = avantageEtCoûtTotal('RGDU')

			expect(lodeom.avantage - rgdu.avantage).toBeCloseTo(
				rgdu.coûtTotal - lodeom.coûtTotal,
				2
			)
		})
	})
})
