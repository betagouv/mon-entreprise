import { describe, expect, it } from 'vitest'

import { référencesÀAfficher } from './references'

describe('référencesÀAfficher', () => {
	const références = {
		'Urssaf.fr': 'https://www.urssaf.fr/portail/home.html',
		'BPI France': 'https://bpifrance-creation.fr/encyclopedie/statut',
		'Associations.gouv.fr': 'https://www.associations.gouv.fr/creation.html',
	}

	describe('hors du site de la BPI', () => {
		it('masque les références des sites partenaires de la BPI', () => {
			expect(référencesÀAfficher(références, false)).toStrictEqual({
				'Urssaf.fr': 'https://www.urssaf.fr/portail/home.html',
			})
		})
	})

	describe('embarqué sur le site de la BPI', () => {
		it('ne montre que les références des sites partenaires de la BPI', () => {
			expect(référencesÀAfficher(références, true)).toStrictEqual({
				'BPI France': 'https://bpifrance-creation.fr/encyclopedie/statut',
				'Associations.gouv.fr':
					'https://www.associations.gouv.fr/creation.html',
			})
		})
	})

	describe('sans référence', () => {
		it('retourne un ensemble vide', () => {
			expect(référencesÀAfficher(undefined, false)).toStrictEqual({})
			expect(référencesÀAfficher(undefined, true)).toStrictEqual({})
		})
	})
})
