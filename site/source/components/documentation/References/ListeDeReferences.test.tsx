import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { ListeDeRéférences } from './ListeDeReferences'

const afficherLaListe = (références: Record<string, string>) => {
	render(
		<TestProvider>
			<div data-testid="liste">
				<ListeDeRéférences références={références} />
			</div>
		</TestProvider>
	)

	return screen.getByTestId('liste')
}

describe('ListeDeRéférences', () => {
	it('affiche un lien par référence', () => {
		afficherLaListe({
			'Urssaf.fr': 'https://www.urssaf.fr/portail/home.html',
		})

		expect(screen.getByText('Urssaf.fr')).toBeInTheDocument()
	})

	it("n'affiche pas de liste vide lorsqu'il n'y a aucune référence", () => {
		expect(afficherLaListe({})).toBeEmptyDOMElement()
	})
})
