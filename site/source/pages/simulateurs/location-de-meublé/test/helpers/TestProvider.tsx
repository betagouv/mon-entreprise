import rules from 'modele-social'
import Engine from 'publicodes'
import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { DesignSystemThemeProvider } from '@/design-system'
import { ReactRouterNavigationProvider } from '@/lib/navigation'
import i18n from '@/locales/i18n'
import { makeStore } from '@/store/store'

interface TestProviderProps {
	children: ReactNode
}

// Configurer la langue par défaut pour les tests
void i18n.changeLanguage('fr')

// Créer l'Engine avec les règles du modèle social
// Désactiver les warnings pour les tests
const testEngine = new Engine(rules, {
	logger: {
		log: () => {}, // Supprimer les logs
		warn: () => {}, // Supprimer les warnings
		error: console.error, // Garder les erreurs
	},
})

// Créer le store Redux
const testStore = makeStore(testEngine)

export const TestProvider = ({ children }: TestProviderProps) => {
	return (
		<I18nextProvider i18n={i18n}>
			<ReduxProvider store={testStore}>
				<DesignSystemThemeProvider>
					<BrowserRouter>
						<ReactRouterNavigationProvider>
							{children}
						</ReactRouterNavigationProvider>
					</BrowserRouter>
				</DesignSystemThemeProvider>
			</ReduxProvider>
		</I18nextProvider>
	)
}
