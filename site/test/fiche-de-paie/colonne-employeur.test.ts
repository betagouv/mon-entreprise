import rules from 'modele-social'
import Engine from 'publicodes'
import { describe, expect, it } from 'vitest'

import {
	getCotisationsBySection,
	partPatronale,
} from '@/components/simulationExplanation/FicheDePaie/utils'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { engineFactory } from '@/utils/publicodes/engineFactory'

const ORDRE_DES_SECTIONS = [
	'salarié . cotisations . catégories . maladie',
	'salarié . cotisations . catégories . atmp',
	'salarié . cotisations . catégories . retraite',
	'salarié . cotisations . catégories . chômage',
	'salarié . cotisations . catégories . divers',
	'salarié . cotisations . catégories . CSG-CRDS',
	'salarié . cotisations . catégories . exonérations',
	'salarié . cotisations . catégories . facultatives',
] as DottedName[]

const LIGNE_DES_ALLÈGEMENTS = 'salarié . cotisations . exonérations'

const zoneUn = ({
	département,
	brut,
}: {
	département: string
	brut: number
}) => ({
	dirigeant: 'non',
	'entreprise . catégorie juridique': "''",
	'entreprise . imposition': 'non',
	'établissement . commune . département': `'${département}'`,
	'salarié . contrat . salaire brut': `${brut} €/mois`,
	date: '08/2026',
	'entreprise . salariés . effectif . seuil': "'moins de 5'",
	"salarié . cotisations . exonérations . lodeom . secteurs d'activité éligibles":
		'non',
	'salarié . cotisations . exonérations . lodeom . zone un . barème compétitivité renforcée':
		'non',
	'salarié . cotisations . exonérations . lodeom . zone un . barème innovation et croissance':
		'non',
})

const métropole = (brut: number) => ({
	dirigeant: 'non',
	'entreprise . catégorie juridique': "''",
	'entreprise . imposition': 'non',
	'salarié . contrat . salaire brut': `${brut} €/mois`,
	date: '08/2026',
})

const jeuneEntrepriseInnovante = (brut: number) => ({
	...métropole(brut),
	'salarié . cotisations . exonérations . JEI': 'oui',
})

const présidentDeSASAvecAcre = (brut: number) => ({
	'entreprise . catégorie juridique': "'SAS'",
	'entreprise . associés': "'unique'",
	'dirigeant . exonérations . ACRE': 'oui',
	'entreprise . date de création': '01/03/2026',
	'salarié . contrat . salaire brut': `${brut} €/mois`,
	date: '08/2026',
})

const avecHeuresSupplémentaires = (
	situation: Record<string, unknown>,
	heures: number
) => ({
	...situation,
	'salarié . temps de travail . heures supplémentaires': `${heures} heures/mois`,
})

const CAS_AVEC_HEURES_SUPPLÉMENTAIRES: [
	libellé: string,
	situation: Record<string, unknown>,
	dispositif: string | null,
][] = [
	[
		'en métropole au Smic, avec 5 heures supplémentaires',
		avecHeuresSupplémentaires(métropole(1802), 5),
		'salarié . cotisations . exonérations . RGDU',
	],
	[
		'en métropole à 6 000 €, avec 5 heures supplémentaires',
		avecHeuresSupplémentaires(métropole(6000), 5),
		null,
	],
	[
		'à Mayotte à 2 000 €, avec 5 heures supplémentaires',
		avecHeuresSupplémentaires(
			zoneUn({ département: 'Mayotte', brut: 2000 }),
			5
		),
		'salarié . cotisations . exonérations . lodeom . montant',
	],
	[
		'en Guadeloupe à 3 800 €, avec 10 heures supplémentaires',
		avecHeuresSupplémentaires(
			zoneUn({ département: 'Guadeloupe', brut: 3800 }),
			10
		),
		'salarié . cotisations . exonérations . lodeom . montant',
	],
	[
		'pour une jeune entreprise innovante, avec 5 heures supplémentaires',
		avecHeuresSupplémentaires(jeuneEntrepriseInnovante(3000), 5),
		'salarié . cotisations . exonérations . JEI . montant',
	],
]

const moteur = (situation: Record<string, unknown>) => {
	const engine = engineFactory(rules)
	engine.setSituation(situation)

	return engine
}

const lignesAffichées = (engine: Engine<DottedName>) =>
	getCotisationsBySection(
		'salarié',
		engine.getParsedRules(),
		ORDRE_DES_SECTIONS
	).flatMap(([, cotisations]) => cotisations)

const totalDeLaColonneEmployeur = (engine: Engine<DottedName>) =>
	lignesAffichées(engine).reduce((total, ligne) => {
		const montant = partPatronale(engine, 'salarié', ligne).nodeValue

		if (typeof montant !== 'number') return total

		return ligne === LIGNE_DES_ALLÈGEMENTS ? total - montant : total + montant
	}, 0)

const cotisationsPatronales = (engine: Engine<DottedName>) =>
	engine.evaluate({
		valeur: 'salarié . cotisations . employeur',
		unité: '€/mois',
	}).nodeValue

describe('La colonne employeur de la fiche de paie', () => {
	it('n’affiche aucune ligne étrangère aux cotisations', () => {
		const lignes = lignesAffichées(moteur(métropole(2000)))

		expect(
			lignes.filter((ligne) => !ligne.startsWith('salarié . cotisations . '))
		).toEqual([])
	})

	describe.each<[libellé: string, situation: Record<string, unknown>]>([
		['en métropole au Smic', métropole(1802)],
		['en métropole à 4 000 €', métropole(4000)],
		['à Mayotte au Smic', zoneUn({ département: 'Mayotte', brut: 1450 })],
		['à Mayotte à 2 000 €', zoneUn({ département: 'Mayotte', brut: 2000 })],
		[
			'en Guadeloupe à 1 800 €',
			zoneUn({ département: 'Guadeloupe', brut: 1800 }),
		],
		[
			'en Guadeloupe à 3 800 €',
			zoneUn({ département: 'Guadeloupe', brut: 3800 }),
		],
		[
			'en Guadeloupe à 4 400 €',
			zoneUn({ département: 'Guadeloupe', brut: 4400 }),
		],
		['pour une jeune entreprise innovante', jeuneEntrepriseInnovante(3000)],
		[
			'pour un président de SAS qui bénéficie de l’Acre',
			présidentDeSASAvecAcre(2000),
		],
		...CAS_AVEC_HEURES_SUPPLÉMENTAIRES.map(
			([libellé, situation]): [string, Record<string, unknown>] => [
				libellé,
				situation,
			]
		),
	])('%s', (_, situation) => {
		it('affiche une ligne par cotisation patronale due', () => {
			const lignes = lignesAffichées(moteur(situation))

			expect(lignes).toContain('salarié . cotisations . maladie')
			expect(lignes).toContain('salarié . cotisations . ATMP')
			expect(lignes).toContain('salarié . cotisations . allocations familiales')
			expect(lignes).toContain(LIGNE_DES_ALLÈGEMENTS)
		})

		it('somme ses lignes jusqu’au total des cotisations patronales', () => {
			const engine = moteur(situation)

			expect(totalDeLaColonneEmployeur(engine)).toBeCloseTo(
				cotisationsPatronales(engine) as number,
				2
			)
		})
	})

	describe.each(CAS_AVEC_HEURES_SUPPLÉMENTAIRES)(
		'%s',
		(_, situation, dispositif) => {
			it('cumule la déduction pour heures supplémentaires et le dispositif du régime dans l’exonération', () => {
				const engine = moteur(situation)
				const enEuros = (règle: string) =>
					(engine.evaluate({ valeur: règle, unité: '€/mois' }).nodeValue as
						| number
						| null) ?? 0
				const déduction = enEuros(
					'salarié . cotisations . exonérations . heures supplémentaires . employeur'
				)

				expect(déduction).toBeGreaterThan(0)
				expect(
					partPatronale(engine, 'salarié', LIGNE_DES_ALLÈGEMENTS).nodeValue
				).toBeCloseTo(déduction + (dispositif ? enEuros(dispositif) : 0), 2)
			})
		}
	)
})
