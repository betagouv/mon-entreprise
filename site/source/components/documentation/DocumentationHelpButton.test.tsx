import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { DocumentationDeChamp } from '@/domaine/documentation/DocumentationDeChamp'
import { TestProvider } from '@/test/TestProvider'

import { DocumentationHelpButton } from './DocumentationHelpButton'

const documentation: DocumentationDeChamp = {
	Documentation: () => <p>Telle est la question</p>,
	références: {
		'Site officiel': 'https://example.com',
		'Guide pratique': 'https://guide-pratique.fr',
	},
}

const renderDocumentationHelpButton = (documentation: DocumentationDeChamp) => {
	const user = userEvent.setup()

	render(
		<TestProvider>
			<DocumentationHelpButton
				sujet="Être ou ne pas être"
				documentation={documentation}
			/>
		</TestProvider>
	)

	return { user, button: screen.getByLabelText(/Être ou ne pas être/) }
}

describe('DocumentationHelpButton', () => {
	it('utilise le sujet dans l’aria-label du bouton', () => {
		const { button } = renderDocumentationHelpButton(documentation)

		expect(button).toBeInTheDocument()
	})

	it('affiche le composant de documentation fourni', async () => {
		const { user, button } = renderDocumentationHelpButton(documentation)

		await user.click(button)

		await waitFor(() => {
			expect(screen.getByText('Telle est la question')).toBeInTheDocument()
		})
	})

	it('affiche les références fournies', async () => {
		const { user, button } = renderDocumentationHelpButton(documentation)

		await user.click(button)

		await waitFor(() => {
			expect(
				screen.getByRole('heading', { name: 'Liens utiles' })
			).toBeInTheDocument()
		})

		expect(screen.getByRole('link', { name: /Site officiel/ })).toHaveAttribute(
			'href',
			'https://example.com'
		)

		expect(
			screen.getByRole('link', { name: /Guide pratique/ })
		).toHaveAttribute('href', 'https://guide-pratique.fr')
	})

	it('n’affiche pas de section de liens utiles si aucune référence n’est fournie', async () => {
		const documentationSansRéférences: DocumentationDeChamp = {
			Documentation: () => <p>Documentation sans références</p>,
			références: {},
		}

		const { user, button } = renderDocumentationHelpButton(
			documentationSansRéférences
		)

		await user.click(button)

		await waitFor(() => {
			expect(
				screen.getByText('Documentation sans références')
			).toBeInTheDocument()
		})

		expect(
			screen.queryByRole('heading', { name: 'Liens utiles' })
		).not.toBeInTheDocument()
	})
})
