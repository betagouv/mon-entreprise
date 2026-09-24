import Engine from 'publicodes'
import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { documentationPublicodes } from './documentationPublicodes'

const règles = {
	entreprise: { titre: 'Entreprise' },
	'entreprise . chiffre': {
		titre: "Chiffre d'affaires",
		description: 'Tout ce que votre entreprise encaisse sur une année.',
		valeur: 0,
	},
}

const engine = () => new Engine(règles) as Engine<DottedName>

describe('documentationPublicodes', () => {
	describe('chemin', () => {
		it("désigne la règle dans l'espace de documentation du modèle", () => {
			expect(
				documentationPublicodes(
					engine,
					'entreprise . chiffre' as DottedName,
					'EI'
				).chemin
			).toBe('EI/entreprise/chiffre')
		})

		it("se réduit à la règle lorsque le modèle n'a pas d'espace", () => {
			expect(
				documentationPublicodes(engine, 'entreprise . chiffre' as DottedName)
					.chemin
			).toBe('entreprise/chiffre')
		})
	})

	describe('titre', () => {
		it('reprend le titre de la règle', () => {
			expect(
				documentationPublicodes(
					engine,
					'entreprise . chiffre' as DottedName,
					'EI'
				).titre()
			).toBe("Chiffre d'affaires")
		})
	})
})
