import { render, screen } from '@testing-library/react'
import Engine from 'publicodes'
import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { TestProvider } from '@/test/TestProvider'

import { RéférencesDeRègle } from './ReferencesDeRegle'

const règles = {
	entreprise: { titre: 'Entreprise' },
	'entreprise . chiffre': {
		titre: "Chiffre d'affaires",
		références: {
			'Urssaf.fr': 'https://www.urssaf.fr/portail/home.html',
			'BPI France': 'https://bpifrance-creation.fr/encyclopedie/statut',
		},
		valeur: 0,
	},
	'entreprise . sans documentation': {
		titre: 'Une règle non documentée',
		valeur: 0,
	},
}

const engine = new Engine(règles) as Engine<DottedName>

const afficherLesRéférences = (dottedName: string) => {
	render(
		<TestProvider>
			<div data-testid="références">
				<RéférencesDeRègle
					engine={engine}
					dottedName={dottedName as DottedName}
				/>
			</div>
		</TestProvider>
	)

	return screen.getByTestId('références')
}

describe('RéférencesDeRègle', () => {
	it('affiche les références à afficher hors du site de la BPI', () => {
		afficherLesRéférences('entreprise . chiffre')

		expect(screen.getByText('Urssaf.fr')).toBeInTheDocument()
		expect(screen.queryByText('BPI France')).not.toBeInTheDocument()
	})

	it("n'affiche rien lorsque la règle n'a pas de référence", () => {
		expect(
			afficherLesRéférences('entreprise . sans documentation')
		).toBeEmptyDOMElement()
	})
})
