import { describe, expect, it } from 'vitest'

import { sanitizePersistedSituation } from './sanitizePersistedSituation'

describe('sanitizePersistedSituation', () => {
	it('convertit les objets {valeur, unité} en expressions Publicodes string', () => {
		const situation = {
			'salarié . contrat . salaire brut': '40000 €/an',
			'salarié . rémunération . frais professionnels . titres-restaurant . montant unitaire':
				{ unité: '€/titre-restaurant', valeur: 10 },
			'salarié . rémunération . frais professionnels . titres-restaurant . taux employeur':
				{ unité: '%', valeur: 60 },
			'impôt . foyer fiscal . enfants à charge': {
				unité: 'enfant',
				valeur: 2,
			},
		}

		const result = sanitizePersistedSituation(situation)

		expect(result).toEqual({
			'salarié . contrat . salaire brut': '40000 €/an',
			'salarié . rémunération . frais professionnels . titres-restaurant . montant unitaire':
				'10 €/titre-restaurant',
			'salarié . rémunération . frais professionnels . titres-restaurant . taux employeur':
				'60 %',
			'impôt . foyer fiscal . enfants à charge': '2 enfant',
		})
	})

	it('préserve les strings et les nombres', () => {
		const situation = {
			'salarié . contrat': "'CDI'",
			'salarié . contrat . statut cadre': 'oui',
			'salarié . contrat . salaire brut': '2700 €/mois',
		}

		const result = sanitizePersistedSituation(situation)

		expect(result).toEqual(situation)
	})

	it('supprime les objets qui ne sont pas des expressions {valeur, unité}', () => {
		const situation = {
			'salarié . contrat . salaire brut': '2700 €/mois',
			'impôt . méthode de calcul . par défaut': {
				variations: [
					{
						si: 'salarié . contrat . salaire brut <= 6000 €/mois',
						alors: "'taux neutre'",
					},
					{ sinon: "'barème standard'" },
				],
			},
			'salarié . cotisations . prévoyances': {
				'applicable si': 'non',
			},
		}

		const result = sanitizePersistedSituation(situation)

		expect(result).toEqual({
			'salarié . contrat . salaire brut': '2700 €/mois',
		})
	})

	it('retourne un objet vide pour une situation vide', () => {
		expect(sanitizePersistedSituation({})).toEqual({})
	})
})
