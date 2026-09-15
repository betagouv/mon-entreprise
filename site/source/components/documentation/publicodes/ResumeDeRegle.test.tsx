import { render, screen } from '@testing-library/react'
import Engine from 'publicodes'
import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { TestProvider } from '@/test/TestProvider'

import { RésuméDeRègle } from './ResumeDeRegle'

const règles = {
	entreprise: { titre: 'Entreprise' },
	'entreprise . chiffre': {
		titre: "Chiffre d'affaires",
		description: 'Tout ce que votre entreprise encaisse sur une année.',
		valeur: 0,
	},
	'entreprise . sans documentation': {
		titre: 'Une règle non documentée',
		valeur: 0,
	},
}

const engine = new Engine(règles) as Engine<DottedName>

const afficherLeRésumé = (dottedName: string) => {
	render(
		<TestProvider>
			<div data-testid="résumé">
				<RésuméDeRègle engine={engine} dottedName={dottedName as DottedName} />
			</div>
		</TestProvider>
	)

	return screen.getByTestId('résumé')
}

describe('RésuméDeRègle', () => {
	it('affiche la description de la règle', () => {
		afficherLeRésumé('entreprise . chiffre')

		expect(
			screen.getByText(/Tout ce que votre entreprise encaisse/)
		).toBeInTheDocument()
	})

	it("n'affiche rien lorsque la règle n'a pas de description", () => {
		expect(
			afficherLeRésumé('entreprise . sans documentation')
		).toBeEmptyDOMElement()
	})
})
