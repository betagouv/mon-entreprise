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
				<Route path="/404" element={<p>Page introuvable</p>} />
			</Routes>
		</TestProvider>
	)
}

describe('Documentation', () => {
	it("renvoie vers la page 404 lorsque l'URL ne désigne aucune règle", async () => {
		afficherLaDocumentation('règle-inexistante')

		expect(await screen.findByText('Page introuvable')).toBeInTheDocument()
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
