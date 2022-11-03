import { CaptureConsole } from '@sentry/integrations'
import { init } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

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
	init({
		dsn: 'https://d857393f4cfb40eebc0b9b54893bab23@sentry.incubateur.net/9',
		integrations: [
			new BrowserTracing(),
			new CaptureConsole({ levels: ['error'] }),
		],
		release,
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 0.1,
	})
}
