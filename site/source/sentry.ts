import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { getBranch, isProduction, isStaging } from './utils'

const branch = getBranch()

if (branch && isStaging()) {
	// eslint-disable-next-line no-console
	console.info(
		`ℹ Vous êtes sur la branche : %c${branch}`,
		'font-weight: bold; text-decoration: underline;'
	)
}

const release =
	branch && `${branch}-` + import.meta.env.VITE_GITHUB_SHA?.substring(0, 7)

if (isProduction()) {
	Sentry.init({
		dsn: 'https://92bbc21937b24136a2fe1b1d922b000f@o548798.ingest.sentry.io/5745615',
		integrations: [new Integrations.BrowserTracing()],
		release,
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 0.05,
	})
}
