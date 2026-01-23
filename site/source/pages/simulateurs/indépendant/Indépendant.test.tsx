import { render, screen, waitFor, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { TrackingProvider } from '@/components/TrackingProvider'
import { DesignSystemThemeProvider } from '@/design-system'
import i18n from '@/locales/i18n'
import { makeStore } from '@/store/store'

import Indépendant from './Indépendant'

void i18n.changeLanguage('fr')

describe('Indépendant', () => {
	it('affiche les 4 objectifs', async () => {
		const testStore = makeStore()
		render(
			<HelmetProvider>
				<TrackingProvider>
					<I18nextProvider i18n={i18n}>
						<ReduxProvider store={testStore}>
							<DesignSystemThemeProvider>
								<BrowserRouter>
									<Indépendant />
								</BrowserRouter>
							</DesignSystemThemeProvider>
						</ReduxProvider>
					</I18nextProvider>
				</TrackingProvider>
			</HelmetProvider>
		)

		const blocObjectifs = await screen.findByTestId('bloc-objectifs')
		expect(
			within(blocObjectifs).getByLabelText(/Chiffre d'affaires/, {selector: 'input'})
		).toBeInTheDocument()
		expect(
			within(blocObjectifs).getByLabelText(/Charges \(hors rémunération dirigeant\)/, {selector: 'input'})
		).toBeInTheDocument()
		expect(
			within(blocObjectifs).getByLabelText(/Rémunération nette/, {selector: 'input'})
		).toBeInTheDocument()
		expect(
			within(blocObjectifs).getByLabelText(/Revenu après impôt/, {selector: 'input'})
		).toBeInTheDocument()
	})
})
