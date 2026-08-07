import { render, screen } from '@testing-library/react'
import { TFunction } from 'i18next'
import { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import Page404 from '@/pages/404'
import Assistants from '@/pages/assistants'
import Iframes from '@/pages/iframes'
import Simulateurs from '@/pages/simulateurs'
import getMetadataSrc from '@/pages/simulateurs-et-assistants/metadata-src'
import { absoluteSitePaths } from '@/sitePaths'
import { TestProvider } from '@/test/TestProvider'

const t = ((_clé: string, défaut: string) => défaut) as unknown as TFunction

const pageRenderTimeout = 30_000

const renderAt = (path: string, ui: ReactElement) => {
	window.history.replaceState(null, '', path)

	render(ui)
}

const langues = [
	{ langue: 'fr', laPage404: /Cette page n'existe pas/i },
	{ langue: 'en', laPage404: /This page does not exist/i },
] as const

describe.each(langues)('Routage en $langue', ({ langue, laPage404 }) => {
	const sitePaths = absoluteSitePaths[langue]
	const pages = Object.values(
		getMetadataSrc({ t, sitePaths, language: langue })
	)

	const Router = () => (
		<Routes>
			<Route
				path={sitePaths.simulateurs.index + '/*'}
				element={<Simulateurs />}
			/>
			<Route
				path={sitePaths.assistants.index + '/*'}
				element={<Assistants />}
			/>
			<Route path="*" element={<Page404 />} />
		</Routes>
	)

	it.each(pages)(
		'la page « $id » ($path) est routée et ne tombe pas en 404',
		({ path }) => {
			renderAt(
				path,
				<TestProvider langue={langue}>
					<Router />
				</TestProvider>
			)

			expect(screen.queryByText(laPage404)).toBeNull()
		},
		pageRenderTimeout
	)

	it('un chemin inconnu affiche la 404', () => {
		renderAt(
			sitePaths.simulateurs.index + '/chemin-qui-nexiste-pas',
			<TestProvider langue={langue}>
				<Router />
			</TestProvider>
		)

		expect(screen.getByText(laPage404)).toBeInTheDocument()
	})
})

describe('Routage des iframes', () => {
	const laPage404 = /Cette page n'existe pas/i
	const pages = Object.values(
		getMetadataSrc({ t, sitePaths: absoluteSitePaths.fr, language: 'fr' })
	)

	const Router = () => (
		<Routes>
			<Route path="/iframes/*" element={<Iframes />} />
			<Route path="*" element={<Page404 />} />
		</Routes>
	)

	it.each(pages)(
		"l'iframe « $id » (/iframes/$iframePath) est routée et ne tombe pas en 404",
		({ iframePath }) => {
			renderAt(
				'/iframes/' + iframePath,
				<TestProvider>
					<Router />
				</TestProvider>
			)

			expect(screen.queryByText(laPage404)).toBeNull()
		},
		pageRenderTimeout
	)

	it('un chemin iframe inconnu affiche la 404', () => {
		renderAt(
			'/iframes/chemin-qui-nexiste-pas',
			<TestProvider>
				<Router />
			</TestProvider>
		)

		expect(screen.getByText(laPage404)).toBeInTheDocument()
	})
})
