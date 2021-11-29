import 'core-js/stable'
import rules from 'modele-social'
import { render } from 'react-dom'
import 'react-hot-loader'
import { hot } from 'react-hot-loader/root'
import 'regenerator-runtime/runtime'
import App from './App'
import i18next from './locales/i18n'
import { I18nProvider } from '@react-aria/i18n'

import './sentry'

i18next.changeLanguage('fr')

const Root = hot(() => <App basename="mon-entreprise" rules={rules} />)

// Test bug Firefox
// from https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
false &&
	typeof window !== 'undefined' &&
	window.addEventListener('beforeunload', function (e) {
		// Cancel the event
		e.preventDefault() // If you prevent default behavior in Mozilla Firefox prompt will always be shown
		// Chrome requires returnValue to be set
		e.returnValue = ''
	})

const anchor = document.querySelector('#js')
render(
	<I18nProvider locale="fr-FR">
		<Root />
	</I18nProvider>,
	anchor
)
