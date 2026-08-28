import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { DocumentationBasePathProvider } from '@/components/documentation/DocumentationBasePathProvider'
import {
	ComparateurProvider,
	ModèleAssimiléSalarié,
	ModèleComparable,
	ModèleTravailleurIndépendant,
} from '@/contextes/comparateur'
import { useSitePaths } from '@/sitePaths'
import { TestProvider } from '@/test/TestProvider'

import { DocumentationRoutes } from './DocumentationRoutes'

const TIMEOUT = 20_000

const DocumentationDuComparateur = () => {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<DocumentationBasePathProvider
			basePath={absoluteSitePaths.simulateurs.comparaison}
		>
			<DocumentationRoutes />
		</DocumentationBasePathProvider>
	)
}

const afficherLaDocumentation = (
	modèle: ModèleComparable,
	cheminDeLaRègle: string
) => {
	window.history.replaceState(
		null,
		'',
		`/simulateurs/comparaison-régimes-sociaux/${cheminDeLaRègle}`
	)

	render(
		<TestProvider>
			<ComparateurProvider modèles={[modèle]}>
				<DocumentationDuComparateur />
			</ComparateurProvider>
		</TestProvider>
	)
}

const déplierRéutiliserCeCalcul = async (
	user: ReturnType<typeof userEvent.setup>
) => {
	const section = await screen.findByText(/Réutiliser ce calcul/, undefined, {
		timeout: TIMEOUT,
	})
	await user.click(section)
}

const paquetNpmProposé = () =>
	screen
		.getAllByRole('link')
		.map((lien) => lien.getAttribute('href'))
		.find((href) => href?.includes('npmjs.com/package/'))

describe('DocumentationRoutes', () => {
	it(
		'documente une valeur EI avec le modèle travailleur indépendant',
		async () => {
			const user = userEvent.setup()
			afficherLaDocumentation(
				ModèleTravailleurIndépendant,
				'EI/indépendant/rémunération/nette'
			)

			await déplierRéutiliserCeCalcul(user)

			await waitFor(() =>
				expect(paquetNpmProposé()).toBe(
					'https://www.npmjs.com/package/modele-ti'
				)
			)
		},
		TIMEOUT
	)

	it(
		'documente une valeur SASU avec le modèle assimilé salarié',
		async () => {
			const user = userEvent.setup()
			afficherLaDocumentation(
				ModèleAssimiléSalarié,
				'SASU/assimilé-salarié/rémunération/nette'
			)

			await déplierRéutiliserCeCalcul(user)

			await waitFor(() =>
				expect(paquetNpmProposé()).toBe(
					'https://www.npmjs.com/package/modele-as'
				)
			)
		},
		TIMEOUT
	)

	it("ne rend rien lorsque l'URL ne demande aucune documentation", () => {
		afficherLaDocumentation(ModèleTravailleurIndépendant, '')

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})
})
