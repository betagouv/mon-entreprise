// TODO: The webpack configuration of the publi.codes site remains in the
// mon-entreprise.fr and should be dissociated.
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import 'core-js/stable'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import App from './components/App'

Sentry.init({
	dsn:
		'https://92bbc21937b24136a2fe1b1d922b000f@o548798.ingest.sentry.io/5745615',
	integrations: [new Integrations.BrowserTracing()],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 0.5,
})

const anchor = document.querySelector('#js')
render(<App />, anchor)
