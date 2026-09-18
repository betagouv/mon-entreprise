import { render, screen } from '@testing-library/react'
import rules from 'modele-social'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/EngineComparison'
import { TestProvider } from '@/test/TestProvider'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import { EngineDocumentationRoutes } from './EngineDocumentationRoutes'

const BASE_PATH = '/assistants/choix-du-statut/comparateur'
const TIMEOUT = 20_000

const moteur = engineFactory(rules)
const namedEngines = [
	{ name: 'SASU', engine: moteur },
	{ name: 'EI', engine: moteur.shallowCopy() },
] as EngineComparison

const afficherLaDocumentation = (cheminDemandé: string) => {
	window.history.replaceState(null, '', `${BASE_PATH}/${cheminDemandé}`)

	render(
		<TestProvider>
			<Routes>
				<Route
					path={`${BASE_PATH}/*`}
					element={
						<EngineDocumentationRoutes
							namedEngines={namedEngines}
							basePath={BASE_PATH}
						/>
					}
				/>
			</Routes>
		</TestProvider>
	)
}

describe('EngineDocumentationRoutes', () => {
	it("n'ouvre pas de modale lorsque l'URL s'arrête à l'étiquette du statut", () => {
		afficherLaDocumentation('SASU')

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})

	it("n'ouvre pas de modale lorsque l'URL ne désigne aucune règle", () => {
		afficherLaDocumentation('SASU/règle-inexistante')

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})

	it(
		"ouvre la modale sur la règle désignée par l'URL",
		async () => {
			afficherLaDocumentation('SASU/salarié/contrat/salaire-brut')

			expect(
				await screen.findByRole('dialog', undefined, { timeout: TIMEOUT })
			).toBeInTheDocument()
		},
		TIMEOUT
	)
})
