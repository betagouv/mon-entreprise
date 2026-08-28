import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { DocumentationDeValeur } from '@/domaine/documentation/DocumentationDeValeur'
import { TestProvider } from '@/test/TestProvider'

import { DocumentationBasePathProvider } from './DocumentationBasePathProvider'
import { DocumentationInfoButton } from './DocumentationInfoButton'

const documentation: DocumentationDeValeur = {
	titre: () => 'Rémunération nette',
	chemin: 'EI/indépendant/rémunération/nette',
	Résumé: () => <p>Ce qu’il vous reste une fois les cotisations payées.</p>,
	Références: () => <a href="https://urssaf.fr">Urssaf.fr</a>,
}

const ouvrirLInfoBulle = async () => {
	const user = userEvent.setup()

	render(
		<TestProvider>
			<DocumentationBasePathProvider basePath="/simulateurs/comparaison-régimes-sociaux">
				<DocumentationInfoButton documentation={documentation} />
			</DocumentationBasePathProvider>
		</TestProvider>
	)

	await user.click(screen.getByRole('button'))
}

describe('DocumentationInfoButton', () => {
	it('affiche le résumé sans quitter la page', async () => {
		await ouvrirLInfoBulle()

		expect(
			await screen.findByText(
				/Ce qu’il vous reste une fois les cotisations payées/
			)
		).toBeInTheDocument()
	})

	it('propose de lire la documentation complète', async () => {
		await ouvrirLInfoBulle()

		expect(
			await screen.findByRole('link', { name: /Rémunération nette/ })
		).toHaveAttribute(
			'href',
			'/simulateurs/comparaison-régimes-sociaux/EI/indépendant/rémunération/nette'
		)
	})

	it('affiche les références de la documentation', async () => {
		await ouvrirLInfoBulle()

		expect(
			await screen.findByRole('link', { name: 'Urssaf.fr' })
		).toBeInTheDocument()
	})
})
