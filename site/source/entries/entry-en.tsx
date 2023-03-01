import { I18nProvider } from '@react-aria/i18n'
import { withProfiler } from '@sentry/react'
import { createRoot } from 'react-dom/client'

import App from '../App'
import i18next from '../locales/i18n'
import ruleTranslations from '../locales/rules-en.yaml'
import translateRules from '../locales/translateRules'
import translations from '../locales/ui-en.yaml'

import '../sentry'

export const AppEn = () => (
	<I18nProvider locale="en-GB">
		<App
			basename="infrance"
			rulesPreTransform={(rules) =>
				translateRules('en', ruleTranslations, rules)
			}
		/>
	</I18nProvider>
)

const AppEnWithProfiler = withProfiler(AppEn)

i18next.addResourceBundle('en', 'translation', translations)

if (!import.meta.env.SSR) {
	i18next.changeLanguage('en').catch((err) =>
		// eslint-disable-next-line no-console
		console.error(err)
	)

	const container = document.querySelector('#js') as Element
	const root = createRoot(container)
	root.render(<AppEnWithProfiler />)
}
