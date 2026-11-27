import { describe, expect, it } from 'vitest'

import { Rules } from '@/domaine/publicodes/Rules'
import { setAppLanguage } from '@/locales/i18n'

import { engineFactory } from './engineFactory'

const ASSIETTE = 'artiste-auteur . cotisations . assiette surcotisation'

const règles: Rules = {
	'artiste-auteur': {},
	'artiste-auteur . cotisations': {},
	[ASSIETTE]: { titre: 'assiette surcotisation', valeur: 0 },
}

const titreDeLaRègle = () => engineFactory(règles).getRule(ASSIETTE).title

describe('engineFactory', () => {
	it('traduit les règles avec le catalogue anglais quand l’application parle anglais', () => {
		setAppLanguage('en')

		expect(titreDeLaRègle()).toBe('Over-contribution base')
	})

	it('laisse les règles en français quand l’application parle français', () => {
		setAppLanguage('fr')

		expect(titreDeLaRègle()).toBe('Assiette surcotisation')
	})
})
