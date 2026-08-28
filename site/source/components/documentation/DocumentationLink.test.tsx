import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DocumentationDeValeur } from '@/domaine/documentation/DocumentationDeValeur'
import { TestProvider } from '@/test/TestProvider'

import { DocumentationLink } from './DocumentationLink'

const RienÀAfficher = () => null

const documentation: DocumentationDeValeur = {
	titre: () => 'Rémunération nette',
	chemin: 'EI/indépendant/rémunération/nette',
	Résumé: RienÀAfficher,
	Références: RienÀAfficher,
}

const afficherLeLien = () =>
	render(
		<TestProvider>
			<DocumentationLink vers={documentation}>en savoir plus</DocumentationLink>
		</TestProvider>
	)

describe('DocumentationLink', () => {
	it('pointe vers le chemin de la documentation', () => {
		afficherLeLien()

		expect(screen.getByRole('link')).toHaveAttribute(
			'href',
			'/EI/indépendant/rémunération/nette'
		)
	})

	it('nomme le lien par le titre de la documentation', () => {
		afficherLeLien()

		expect(
			screen.getByRole('link', { name: /Rémunération nette/ })
		).toBeInTheDocument()
	})
})
