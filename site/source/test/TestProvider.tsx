import { ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { DesignSystemThemeProvider } from '@/design-system'
import { ReactRouterNavigationProvider } from '@/lib/navigation'
import i18n from '@/locales/i18n'
import { makeStore } from '@/store/store'

void i18n.changeLanguage('fr')

const testStore = makeStore()

export const TestProvider = ({ children }: { children: ReactNode }) => (
	<HelmetProvider>
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
	</HelmetProvider>
)
