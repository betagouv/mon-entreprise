import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { DesignSystemThemeProvider } from '@/design-system'
import i18n from '@/locales/i18n'
import { makeStore } from '@/store/store'

interface TestProviderProps {
	children: ReactNode
}

// Configurer la langue par défaut pour les tests
void i18n.changeLanguage('fr')

// Créer le store Redux
const testStore = makeStore()

export const TestProvider = ({ children }: TestProviderProps) => {
	return (
		<I18nextProvider i18n={i18n}>
			<ReduxProvider store={testStore}>
				<DesignSystemThemeProvider>
					<BrowserRouter>{children}</BrowserRouter>
				</DesignSystemThemeProvider>
			</ReduxProvider>
		</I18nextProvider>
	)
}
