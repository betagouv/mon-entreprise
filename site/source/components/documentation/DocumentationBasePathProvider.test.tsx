import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DocumentationDeValeur } from '@/domaine/documentation/DocumentationDeValeur'
import { TestProvider } from '@/test/TestProvider'

import { DocumentationBasePathProvider } from './DocumentationBasePathProvider'
import { DocumentationLink } from './DocumentationLink'

const RienÀAfficher = () => null

const documentation: DocumentationDeValeur = {
	titre: () => 'Rémunération nette',
	chemin: 'EI/indépendant/rémunération/nette',
	Résumé: RienÀAfficher,
	Références: RienÀAfficher,
}

describe('DocumentationBasePathProvider', () => {
	it('préfixe les liens par le chemin où il est monté', () => {
		render(
			<TestProvider>
				<DocumentationBasePathProvider basePath="/simulateurs/comparaison-régimes-sociaux">
					<DocumentationLink vers={documentation}>détail</DocumentationLink>
				</DocumentationBasePathProvider>
			</TestProvider>
		)

		expect(screen.getByRole('link')).toHaveAttribute(
			'href',
			'/simulateurs/comparaison-régimes-sociaux/EI/indépendant/rémunération/nette'
		)
	})

	it('refuse un lien de documentation posé hors de tout espace', () => {
		const erreurs = vi.spyOn(console, 'error').mockImplementation(() => {})

		expect(() =>
			render(
				<TestProvider>
					<DocumentationLink vers={documentation}>détail</DocumentationLink>
				</TestProvider>
			)
		).toThrow(/DocumentationBasePathProvider/)

		erreurs.mockRestore()
	})
})
