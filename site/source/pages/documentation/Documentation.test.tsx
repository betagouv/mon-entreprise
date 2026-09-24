import { render, screen } from '@testing-library/react'
import rules from 'modele-social'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import Documentation from './Documentation'

const BASE_PATH = '/documentation'
const TIMEOUT = 20_000

const moteur = engineFactory(rules)

const afficherLaDocumentation = (cheminDemandé: string) => {
	window.history.replaceState(null, '', `${BASE_PATH}/${cheminDemandé}`)

	render(
		<TestProvider>
			<Routes>
				<Route
					path={`${BASE_PATH}/*`}
					element={
						<Documentation
							documentationPath={BASE_PATH}
							engine={moteur}
							nomModèle="modele-social"
						/>
					}
				/>
			</Routes>
		</TestProvider>
	)
}

describe('Documentation', () => {
	it("affiche la 404 sans quitter l'URL lorsqu'elle ne désigne aucune règle", async () => {
		afficherLaDocumentation('règle-inexistante')

		expect(
			await screen.findByText(/Cette page n'existe pas/i)
		).toBeInTheDocument()
		expect(decodeURI(window.location.pathname)).toBe(
			`${BASE_PATH}/règle-inexistante`
		)
	})

	it(
		"documente la règle désignée par l'URL",
		async () => {
			afficherLaDocumentation('salarié/contrat/salaire-brut')

			expect(
				await screen.findByRole(
					'heading',
					{ name: /Salaire brut/ },
					{ timeout: TIMEOUT }
				)
			).toBeInTheDocument()
		},
		TIMEOUT
	)
})
