import { render, screen } from '@testing-library/react'
import Engine from 'publicodes'
import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { TestProvider } from '@/test/TestProvider'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import { SimpleField } from './SimpleField'

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
	'question . une possibilité . a': {},
	'question . une possibilité . b': {},
	'question . montant': {
		question: 'Combien par mois ?',
		unité: '€/mois',
		'par défaut': '100 €/mois',
	},
	'question . enfants': {
		question: "Combien d'enfants ?",
		unité: 'enfant',
		'par défaut': '2 enfant',
	},
	'question . nombre sans unité': {
		question: 'Combien ?',
		'par défaut': '3',
	},
}) as unknown as Engine<DottedName>

const rendLeChamp = (dottedName: string) =>
	render(
		<TestProvider>
			<EngineProvider value={engine}>
				<SimpleField dottedName={dottedName as DottedName} />
			</EngineProvider>
		</TestProvider>
	)

describe('SimpleField', () => {
	it.each([
		['question . montant', 'Combien par mois ?'],
		['question . enfants', "Combien d'enfants ?"],
		['question . nombre sans unité', 'Combien ?'],
	])('nomme le champ numérique « %s » par un label', (dottedName, question) => {
		rendLeChamp(dottedName)

		expect(screen.getByRole('textbox', { name: question })).toBeInTheDocument()
		expect(
			screen
				.queryAllByRole('group')
				.filter((groupe) => groupe.tagName === 'FIELDSET')
		).toEqual([])
	})

	it.each([
		['question . oui ou non', /^Oui ou non \?/],
		['question . une possibilité', /^Laquelle \?/],
	])(
		'regroupe les choix de « %s » dans un fieldset nommé par sa legend',
		(dottedName, question) => {
			rendLeChamp(dottedName)

			const groupe = screen.getByRole('group', { name: question })

			expect(groupe.tagName).toBe('FIELDSET')
		}
	)
})
