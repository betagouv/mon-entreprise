import règlesModeleSocial from 'modele-social'
import Engine from 'publicodes'
import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import { estUnGroupeDeChoix } from './RuleField'

const estUnGroupe = <Name extends string>(
	engine: Engine<Name>,
	dottedName: Name
) =>
	estUnGroupeDeChoix(
		dottedName as unknown as DottedName,
		engine as unknown as Engine<DottedName>
	)

describe('estUnGroupeDeChoix', () => {
	const engine = new Engine({
		question: {},
		'question . oui ou non': { question: 'Oui ou non ?' },
		'question . une possibilité': {
			question: 'Laquelle ?',
			'une possibilité': {
				'choix obligatoire': 'oui',
				possibilités: ['a', 'b'],
			},
		},
		'question . a': {},
		'question . b': {},
		'question . plusieurs possibilités': {
			question: 'Lesquelles ?',
			'plusieurs possibilités': ['c', 'd'],
		},
		'question . plusieurs possibilités . c': {},
		'question . plusieurs possibilités . d': {},
		'question . nombre sans unité': {
			question: 'Combien ?',
			'par défaut': '3',
		},
		'question . montant annuel': {
			question: 'Combien par an ?',
			unité: '€/an',
			'par défaut': '1000 €/an',
		},
		'question . montant mensuel': {
			question: 'Combien par mois ?',
			unité: '€/mois',
			'par défaut': '100 €/mois',
		},
		'question . taux': {
			question: 'Quel taux ?',
			unité: '%',
			'par défaut': '10 %',
		},
		'question . enfants': {
			question: "Combien d'enfants ?",
			unité: 'enfant',
			'par défaut': '2 enfant',
		},
		'question . titres-restaurant': {
			question: 'Combien de titres-restaurant ?',
			unité: 'titre-restaurant/mois',
			'par défaut': '20 titre-restaurant/mois',
		},
	})

	it.each([
		'question . montant annuel' as const,
		'question . montant mensuel',
		'question . taux',
		'question . enfants',
		'question . titres-restaurant',
		'question . nombre sans unité',
	])('retourne false pour le champ numérique « %s »', (dottedName) => {
		expect(estUnGroupe(engine, dottedName)).toBe(false)
	})

	it.each([
		'question . oui ou non' as const,
		'question . une possibilité' as const,
		'question . plusieurs possibilités' as const,
	])('retourne true pour le groupe de choix « %s »', (dottedName) => {
		expect(estUnGroupe(engine, dottedName)).toBe(true)
	})

	it('retourne false pour toutes les questions du modèle social avec une unité', () => {
		const engineModeleSocial = engineFactory(règlesModeleSocial)
		const questionsAvecUnité = (
			Object.keys(engineModeleSocial.getParsedRules()) as DottedName[]
		).filter(
			(dottedName) =>
				engineModeleSocial.getRule(dottedName).rawNode.question &&
				engineModeleSocial.evaluate(dottedName).unit
		)

		expect(questionsAvecUnité).not.toHaveLength(0)
		expect(
			questionsAvecUnité.filter((dottedName) =>
				estUnGroupe(engineModeleSocial, dottedName)
			)
		).toEqual([])
	})
})
