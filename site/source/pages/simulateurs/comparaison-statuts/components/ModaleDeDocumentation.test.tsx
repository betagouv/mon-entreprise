import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DocumentationBasePathProvider } from '@/components/documentation'
import { PianoTracker } from '@/components/PianoAnalytics/PianoTracker'
import { PianoTrackerContext } from '@/components/PianoAnalytics/PianoTrackerContext'
import {
	ComparateurProvider,
	ModèleAssimiléSalarié,
	ModèleComparable,
	ModèleTravailleurIndépendant,
} from '@/contextes/comparateur'
import { useSitePaths } from '@/sitePaths'
import { TestProvider } from '@/test/TestProvider'

import { ModaleDeDocumentation } from './ModaleDeDocumentation'

const TIMEOUT = 20_000

const DocumentationDuComparateur = () => {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<DocumentationBasePathProvider
			basePath={absoluteSitePaths.simulateurs.comparaison}
		>
			<ModaleDeDocumentation />
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

	const sendEvent = vi.fn()
	const traceur = {
		setProperties: () => {},
		sendEvent,
		consent: { setMode: () => {}, getMode: () => ({ name: 'opt-out' }) },
	} as unknown as PianoTracker

	render(
		<TestProvider>
			<PianoTrackerContext.Provider value={traceur}>
				<ComparateurProvider modèles={[modèle]}>
					<DocumentationDuComparateur />
				</ComparateurProvider>
			</PianoTrackerContext.Provider>
		</TestProvider>
	)

	return {
		vuesDePage: () =>
			sendEvent.mock.calls.filter(([type]) => type === 'page.display'),
	}
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

describe('ModaleDeDocumentation', () => {
	it('documente une valeur EI avec le modèle travailleur indépendant', async () => {
		afficherLaDocumentation(
			ModèleTravailleurIndépendant,
			'EI/indépendant/rémunération/nette'
		)

		expect(
			await screen.findByRole('heading', { name: /Rémunération nette/ })
		).toBeInTheDocument()
	})

	it('compte une vue de documentation à l’ouverture de la modale', async () => {
		const { vuesDePage } = afficherLaDocumentation(
			ModèleTravailleurIndépendant,
			'EI/indépendant/rémunération/nette'
		)

		await screen.findByRole('heading', { name: /Rémunération nette/ })

		expect(vuesDePage()).toEqual([
			[
				'page.display',
				expect.objectContaining({
					page_chapter1: 'documentation',
					page: 'independant___remuneration___nette',
				}),
			],
		])
	})

	it('documente une valeur SASU avec le modèle assimilé salarié', async () => {
		afficherLaDocumentation(
			ModèleAssimiléSalarié,
			'SASU/assimilé-salarié/rémunération/nette'
		)

		expect(
			await screen.findByRole('heading', { name: /Rémunération nette/ })
		).toBeInTheDocument()
	})

	it("ne rend rien lorsque l'URL ne demande aucune documentation", () => {
		afficherLaDocumentation(ModèleTravailleurIndépendant, '')

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})

	it("annonce une règle introuvable plutôt que d'ouvrir une modale vide", async () => {
		afficherLaDocumentation(ModèleAssimiléSalarié, 'SASU/règle-inexistante')

		expect(
			await screen.findByText(/introuvable dans la base/)
		).toBeInTheDocument()
	})

	it("laisse l'usager sur le comparateur lorsque l'URL s'arrête à l'étiquette", () => {
		afficherLaDocumentation(ModèleAssimiléSalarié, 'SASU')

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		expect(window.location.pathname).not.toBe('/404')
	})

	it(
		'propose le paquet npm du modèle qui documente la valeur',
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
})
