import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { TestProvider } from '@/test/TestProvider'

import { BoutonDeDocumentation } from './BoutonDeDocumentation'
import { LienVersLaDocumentationProvider } from './LienVersLaDocumentationContext'

const règles = {
	entreprise: {},
	'entreprise . sans documentation': {
		titre: 'Une règle non documentée',
	},
	'entreprise . avec documentation': {
		titre: 'Une règle documentée',
		description: 'Description de la règle',
	},
}

const engine = new Engine(règles) as Engine<DottedName>

const renderBoutonDeDocumentation = (dottedName: DottedName) => {
	const user = userEvent.setup()

	render(
		<TestProvider>
			<BoutonDeDocumentation dottedName={dottedName} />
		</TestProvider>
	)

	return { user }
}

const renderBoutonDeDocumentationAvecProvider = (
	lienVersLaDocumentation: boolean
) => {
	const user = userEvent.setup()

	render(
		<TestProvider>
			<LienVersLaDocumentationProvider
				lienVersLaDocumentation={lienVersLaDocumentation}
			>
				<BoutonDeDocumentation dottedName="entreprise . avec documentation" />
			</LienVersLaDocumentationProvider>
		</TestProvider>
	)

	return { user, button: screen.getByRole('button') }
}

vi.mock('@/utils/publicodes/EngineContext', () => ({
	useEngine: () => engine,
	useOptionalEngine: () => engine,
}))

describe('BoutonDeDocumentation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('ne rend rien lorsque la règle ne possède pas de description', () => {
		renderBoutonDeDocumentation('entreprise . sans documentation' as DottedName)

		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})

	it('affiche le bouton d’information lorsque la règle possède une description', () => {
		renderBoutonDeDocumentation('entreprise . avec documentation' as DottedName)

		const button = screen.getByRole('button')

		expect(button).toBeInTheDocument()
	})

	it('affiche le lien vers la documentation par défaut', async () => {
		const { user } = renderBoutonDeDocumentation(
			'entreprise . avec documentation' as DottedName
		)

		const button = screen.getByRole('button')
		await user.click(button)

		await waitFor(() => {
			expect(
				screen.getByRole('link', {
					name: 'Lire la documentation sur Une règle documentée',
				})
			).toBeInTheDocument()
		})
	})

	it('affiche le lien lorsque le contexte vaut true', async () => {
		const { user } = renderBoutonDeDocumentationAvecProvider(true)

		const button = screen.getByRole('button')
		await user.click(button)

		await waitFor(() => {
			expect(
				screen.getByRole('link', {
					name: 'Lire la documentation sur Une règle documentée',
				})
			).toBeInTheDocument()
		})
	})

	it('masque le lien lorsque le contexte vaut false', async () => {
		const { user } = renderBoutonDeDocumentationAvecProvider(false)

		const button = screen.getByRole('button')
		await user.click(button)

		await waitFor(() => {
			expect(screen.queryByRole('link')).not.toBeInTheDocument()
		})
	})
})
