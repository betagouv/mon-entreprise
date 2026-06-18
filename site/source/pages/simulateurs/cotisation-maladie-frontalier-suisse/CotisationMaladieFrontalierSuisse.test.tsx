import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { DesignSystemThemeProvider } from '@/design-system'
import { ReactRouterNavigationProvider } from '@/lib/navigation'
import i18n from '@/locales/i18n'
import { makeStore } from '@/store/store'

import CotisationMaladieFrontalierSuisse from './CotisationMaladieFrontalierSuisse'

void i18n.changeLanguage('fr')

const Wrapper = ({ children }: { children: ReactNode }) => (
	<HelmetProvider>
		<I18nextProvider i18n={i18n}>
			<ReduxProvider store={makeStore()}>
				<DesignSystemThemeProvider>
					<BrowserRouter>
						<ReactRouterNavigationProvider>
							{children}
						</ReactRouterNavigationProvider>
					</BrowserRouter>
				</DesignSystemThemeProvider>
			</ReduxProvider>
		</I18nextProvider>
	</HelmetProvider>
)

describe('Simulateur cotisation maladie frontalier suisse', () => {
	it('affiche les trois champs de saisie au montage', async () => {
		render(
			<Wrapper>
				<CotisationMaladieFrontalierSuisse />
			</Wrapper>
		)

		expect(await screen.findByText(/Date d'affiliation/i)).toBeInTheDocument()
		expect(screen.getByText(/Salaires perçus en/i)).toBeInTheDocument()
		expect(screen.getByText(/Autres revenus perçus en/i)).toBeInTheDocument()
	})

	it("n'affiche pas la cotisation tant que la saisie est incomplète", async () => {
		render(
			<Wrapper>
				<CotisationMaladieFrontalierSuisse />
			</Wrapper>
		)

		await screen.findByText(/Date d'affiliation/i)

		expect(
			screen.queryByText(/Cotisation maladie annuelle/i)
		).not.toBeInTheDocument()
	})
})
